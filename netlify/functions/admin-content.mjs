import {
  assertNoEmbeddedImages,
  readSiteContent,
  writeSiteContent,
} from '../../server/contentWriter.mjs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
    body: JSON.stringify(body),
  };
}

function isAuthorized(event) {
  const header = event.headers['x-admin-token'] || event.headers['X-Admin-Token'] || '';
  const expected = process.env.ADMIN_API_TOKEN || 'yash:aditya';
  return header === expected;
}

/**
 * Production admin API.
 *
 * Netlify's function bundle is read-only for the deploy package.
 * Content JSON is committed via GitHub when configured:
 *   GITHUB_TOKEN, GITHUB_REPO (owner/repo), GITHUB_BRANCH (default main)
 *
 * Images are Google Drive URLs used directly in <img src>; admin only stores the link.
 */
async function commitToGitHub(files, message = 'chore: update site content from admin') {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !repo) {
    return { committed: false, reason: 'GitHub not configured' };
  }

  const [owner, repoName] = repo.split('/');
  const api = `https://api.github.com/repos/${owner}/${repoName}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'vashisht-admin',
  };

  const refRes = await fetch(`${api}/git/ref/heads/${branch}`, { headers });
  if (!refRes.ok) throw new Error('Failed to read GitHub branch ref');
  const ref = await refRes.json();
  const baseSha = ref.object.sha;

  const commitRes = await fetch(`${api}/git/commits/${baseSha}`, { headers });
  if (!commitRes.ok) throw new Error('Failed to read base commit');
  const baseCommit = await commitRes.json();

  const treeItems = [];
  for (const file of files) {
    if (file.delete) {
      treeItems.push({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: null,
      });
      continue;
    }

    const blobRes = await fetch(`${api}/git/blobs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content: file.content,
        encoding: file.encoding || 'utf-8',
      }),
    });
    if (!blobRes.ok) {
      const detail = await blobRes.text().catch(() => '');
      throw new Error(
        `Failed to create blob for ${file.path}${detail ? `: ${detail.slice(0, 200)}` : ''}`,
      );
    }
    const blob = await blobRes.json();
    treeItems.push({
      path: file.path,
      mode: '100644',
      type: 'blob',
      sha: blob.sha,
    });
  }

  const treeRes = await fetch(`${api}/git/trees`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      base_tree: baseCommit.tree.sha,
      tree: treeItems,
    }),
  });
  if (!treeRes.ok) throw new Error('Failed to create GitHub tree');
  const tree = await treeRes.json();

  const newCommitRes = await fetch(`${api}/git/commits`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      tree: tree.sha,
      parents: [baseSha],
    }),
  });
  if (!newCommitRes.ok) throw new Error('Failed to create GitHub commit');
  const newCommit = await newCommitRes.json();

  const updateRes = await fetch(`${api}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ sha: newCommit.sha }),
  });
  if (!updateRes.ok) throw new Error('Failed to update GitHub branch');

  return { committed: true, sha: newCommit.sha };
}

function contentToGitFiles(content, deletedFiles = []) {
  const files = [
    { path: 'data/company.json', content: JSON.stringify(content.company, null, 2) + '\n' },
    {
      path: 'data/about.json',
      content:
        JSON.stringify({ ...content.about, image: content.aboutImage }, null, 2) + '\n',
    },
    { path: 'data/hero.json', content: JSON.stringify(content.hero, null, 2) + '\n' },
    { path: 'data/stats.json', content: JSON.stringify(content.stats, null, 2) + '\n' },
    {
      path: 'data/why-choose-us.json',
      content: JSON.stringify(content.whyChooseUs, null, 2) + '\n',
    },
    { path: 'data/timeline.json', content: JSON.stringify(content.timeline, null, 2) + '\n' },
    { path: 'data/footer.json', content: JSON.stringify(content.footer, null, 2) + '\n' },
    {
      path: 'data/testimonials.json',
      content: JSON.stringify(content.testimonials, null, 2) + '\n',
    },
    { path: 'data/faq.json', content: JSON.stringify(content.faq, null, 2) + '\n' },
    {
      path: 'data/projects/_index.json',
      content: JSON.stringify(
        content.projects.map((p) => p.slug),
        null,
        2,
      ) + '\n',
    },
  ];

  for (const project of content.projects) {
    files.push({
      path: `data/projects/${project.slug}.json`,
      content: JSON.stringify(project, null, 2) + '\n',
    });
  }

  for (const deletedPath of deletedFiles) {
    files.push({ path: deletedPath, delete: true });
  }

  return files;
}

function parseRequestPath(event) {
  return (event.path || '').replace(
    /\/\.netlify\/functions\/admin-content/,
    '/api/admin',
  );
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (!isAuthorized(event)) {
    return json(401, { ok: false, error: 'Unauthorized' });
  }

  try {
    const requestPath = parseRequestPath(event);

    if (
      event.httpMethod === 'GET' &&
      (requestPath.endsWith('/content') || requestPath.includes('/content'))
    ) {
      try {
        const content = readSiteContent();
        return json(200, { ok: true, content, source: 'filesystem' });
      } catch {
        return json(200, {
          ok: true,
          content: null,
          source: 'bundle',
          message: 'Use bundled JSON from the client build',
        });
      }
    }

    if (event.httpMethod === 'POST' && requestPath.includes('/content')) {
      let body;
      try {
        const raw = event.isBase64Encoded
          ? Buffer.from(event.body || '', 'base64').toString('utf8')
          : event.body || '{}';
        body = JSON.parse(raw);
      } catch {
        return json(400, {
          ok: false,
          error:
            'Invalid JSON payload. Do not embed Base64 images — paste public image URLs instead.',
        });
      }

      try {
        assertNoEmbeddedImages(body.content);
      } catch (error) {
        return json(400, {
          ok: false,
          error:
            error instanceof Error
              ? error.message
              : 'Embedded image data is not allowed in content payloads.',
        });
      }

      let content;
      let deletedFiles = [];
      try {
        const result = writeSiteContent(body.content);
        content = result.content;
        deletedFiles = result.deletedFiles || [];
      } catch (error) {
        // Production may be read-only; still reject bad payloads above.
        if (
          error instanceof Error &&
          error.message.includes('Embedded image data')
        ) {
          return json(400, { ok: false, error: error.message });
        }
        content = body.content;
      }

      const git = await commitToGitHub(contentToGitFiles(content, deletedFiles));

      return json(200, {
        ok: true,
        content,
        git,
        message: git.committed
          ? 'Content committed to GitHub. Netlify will redeploy shortly.'
          : 'Content saved locally. For production global updates, run admin via npm run dev (writes data/) then commit & push, or set GITHUB_TOKEN + GITHUB_REPO.',
      });
    }

    return json(404, { ok: false, error: 'Not found' });
  } catch (error) {
    return json(500, {
      ok: false,
      error: error instanceof Error ? error.message : 'Server error',
    });
  }
}
