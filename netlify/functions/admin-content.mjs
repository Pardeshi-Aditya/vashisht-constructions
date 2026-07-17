import {
  readSiteContent,
  saveUploadedImage,
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
 * On Netlify the function filesystem is read-only for the deploy bundle,
 * so this writes to Netlify Blobs when available, and also supports
 * local `netlify dev` which can write files via the shared writer.
 *
 * For Git-backed global updates, set:
 *   GITHUB_TOKEN, GITHUB_REPO (owner/repo), GITHUB_BRANCH (default main)
 */
async function commitToGitHub(files) {
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
    const blobRes = await fetch(`${api}/git/blobs`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content: file.content,
        encoding: file.encoding || 'utf-8',
      }),
    });
    if (!blobRes.ok) throw new Error(`Failed to create blob for ${file.path}`);
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
      message: 'chore: update site content from admin',
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

function contentToGitFiles(content) {
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

  return files;
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (!isAuthorized(event)) {
    return json(401, { ok: false, error: 'Unauthorized' });
  }

  try {
    const path = event.path.replace(/\/\.netlify\/functions\/admin-content/, '/api/admin');

    if (event.httpMethod === 'GET' && (path.endsWith('/content') || path.includes('/content'))) {
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

    if (event.httpMethod === 'POST' && path.includes('/upload')) {
      const body = JSON.parse(event.body || '{}');
      try {
        const url = saveUploadedImage(body);
        return json(200, { ok: true, url, persisted: 'filesystem' });
      } catch {
        return json(501, {
          ok: false,
          error:
            'Image upload requires local `npm run dev` or GitHub-backed production setup. Upload during local admin, then deploy.',
        });
      }
    }

    if (event.httpMethod === 'POST' && path.includes('/content')) {
      const body = JSON.parse(event.body || '{}');
      let content;

      try {
        content = writeSiteContent(body.content);
      } catch {
        content = body.content;
      }

      const git = await commitToGitHub(contentToGitFiles(content));

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
