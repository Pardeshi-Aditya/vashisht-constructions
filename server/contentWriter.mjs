import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');
export const DATA_DIR = path.join(ROOT, 'data');
export const IMAGES_DIR = path.join(ROOT, 'public', 'images');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function isDataUrl(value) {
  return typeof value === 'string' && value.startsWith('data:image/');
}

function looksLikeEmbeddedBase64(value) {
  return (
    typeof value === 'string' &&
    (isDataUrl(value) || (value.includes('base64,') && value.length > 500))
  );
}

/**
 * Walk the content tree and reject any embedded Base64 / data-URL images.
 * Image fields must be public URLs (or legacy /images/ paths) — never Base64.
 */
export function assertNoEmbeddedImages(value, trail = 'content') {
  if (typeof value === 'string') {
    if (looksLikeEmbeddedBase64(value)) {
      throw new Error(
        `Embedded image data is not allowed in ${trail}. Paste a public image URL instead (e.g. from Google Drive).`,
      );
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      assertNoEmbeddedImages(item, `${trail}[${index}]`),
    );
    return;
  }

  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      assertNoEmbeddedImages(child, `${trail}.${key}`);
    }
  }
}

/**
 * Persist full site content into segregated JSON files under /data.
 * Image fields are URL strings (external Drive/CDN or legacy /images/ paths).
 * Removed projects also clean leftover public/images/projects/{slug} folders.
 *
 * @returns {{ content: object, deletedFiles: string[] }}
 */
export function writeSiteContent(content) {
  if (!content || typeof content !== 'object') {
    throw new Error('Invalid content payload');
  }

  assertNoEmbeddedImages(content);

  const company = content.company;
  const about = {
    ...content.about,
    image: content.aboutImage || content.about?.image || '/images/about/studio.webp',
  };
  const hero = {
    ...content.hero,
    image: content.hero?.image || '/images/hero/hero.webp',
  };

  writeJson(path.join(DATA_DIR, 'company.json'), company);
  writeJson(path.join(DATA_DIR, 'about.json'), about);
  writeJson(path.join(DATA_DIR, 'hero.json'), hero);
  writeJson(path.join(DATA_DIR, 'stats.json'), content.stats || []);
  writeJson(path.join(DATA_DIR, 'why-choose-us.json'), content.whyChooseUs || []);
  writeJson(path.join(DATA_DIR, 'timeline.json'), content.timeline || []);
  writeJson(path.join(DATA_DIR, 'footer.json'), content.footer);
  writeJson(path.join(DATA_DIR, 'testimonials.json'), content.testimonials || []);
  writeJson(path.join(DATA_DIR, 'faq.json'), content.faq || []);

  const projectsDir = path.join(DATA_DIR, 'projects');
  ensureDir(projectsDir);

  const existing = fs
    .readdirSync(projectsDir)
    .filter((f) => f.endsWith('.json') && f !== '_index.json');

  const projects = Array.isArray(content.projects) ? content.projects : [];
  const slugs = [];

  for (const project of projects) {
    if (!project?.slug) continue;
    const slug = String(project.slug)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    const next = {
      ...project,
      slug,
      heroImage: project.heroImage || '',
      thumbnail: project.thumbnail || '',
      gallery: Array.isArray(project.gallery) ? project.gallery : [],
    };

    writeJson(path.join(projectsDir, `${slug}.json`), next);
    slugs.push(slug);
  }

  writeJson(path.join(projectsDir, '_index.json'), slugs);

  const deletedFiles = [];
  for (const file of existing) {
    const slug = file.replace(/\.json$/, '');
    if (!slugs.includes(slug)) {
      const projectPath = path.join(projectsDir, file);
      const project = readJson(projectPath, null);
      deletedFiles.push(`data/projects/${file}`);
      fs.unlinkSync(projectPath);

      if (project) {
        const referenced = [
          project.heroImage,
          project.thumbnail,
          ...(Array.isArray(project.gallery) ? project.gallery : []),
        ];
        deletedFiles.push(...removeReferencedProjectImages(referenced));
      }
      deletedFiles.push(...removeProjectImageFolder(slug));
    }
  }

  return {
    content: readSiteContent(),
    deletedFiles: [...new Set(deletedFiles)],
  };
}

/**
 * Delete specific project image files referenced in content (path strings).
 * Only allows paths under public/images/projects/.
 */
export function removeReferencedProjectImages(imagePaths) {
  const deleted = [];
  const projectsRoot = path.resolve(IMAGES_DIR, 'projects');

  for (const imagePath of imagePaths) {
    if (typeof imagePath !== 'string' || !imagePath.startsWith('/images/projects/')) {
      continue;
    }

    const absolute = path.resolve(ROOT, 'public', imagePath.replace(/^\//, ''));
    if (
      absolute !== projectsRoot &&
      !absolute.startsWith(`${projectsRoot}${path.sep}`)
    ) {
      continue;
    }

    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) continue;

    fs.unlinkSync(absolute);
    deleted.push(path.relative(ROOT, absolute).split(path.sep).join('/'));

    // Clean empty parent directories up to projects/
    let parent = path.dirname(absolute);
    while (
      parent.startsWith(`${projectsRoot}${path.sep}`) &&
      parent !== projectsRoot
    ) {
      const entries = fs.existsSync(parent) ? fs.readdirSync(parent) : ['.'];
      if (entries.length > 0) break;
      fs.rmdirSync(parent);
      parent = path.dirname(parent);
    }
  }

  return deleted;
}

/**
 * Delete public/images/projects/{slug}/ and return repo-relative paths removed.
 */
export function removeProjectImageFolder(slug) {
  const safeSlug = String(slug || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');

  if (!safeSlug) return [];

  const folder = path.join(IMAGES_DIR, 'projects', safeSlug);
  const projectsRoot = path.join(IMAGES_DIR, 'projects');
  const resolved = path.resolve(folder);
  if (
    resolved !== path.resolve(projectsRoot) &&
    !resolved.startsWith(`${path.resolve(projectsRoot)}${path.sep}`)
  ) {
    throw new Error('Invalid project image path');
  }

  if (!fs.existsSync(folder)) return [];

  const deleted = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(absolute);
      } else {
        deleted.push(
          path.relative(ROOT, absolute).split(path.sep).join('/'),
        );
      }
    }
  };
  walk(folder);
  fs.rmSync(folder, { recursive: true, force: true });
  return deleted;
}

export function readSiteContent() {
  const company = readJson(path.join(DATA_DIR, 'company.json'), {});
  const aboutFile = readJson(path.join(DATA_DIR, 'about.json'), {});
  const { image: aboutImage = '/images/about/studio.webp', ...about } = aboutFile;
  const hero = readJson(path.join(DATA_DIR, 'hero.json'), {});
  const stats = readJson(path.join(DATA_DIR, 'stats.json'), []);
  const whyChooseUs = readJson(path.join(DATA_DIR, 'why-choose-us.json'), []);
  const timeline = readJson(path.join(DATA_DIR, 'timeline.json'), []);
  const footer = readJson(path.join(DATA_DIR, 'footer.json'), {});
  const testimonials = readJson(path.join(DATA_DIR, 'testimonials.json'), []);
  const faq = readJson(path.join(DATA_DIR, 'faq.json'), []);
  const index = readJson(path.join(DATA_DIR, 'projects', '_index.json'), []);

  const projects = index
    .map((slug) => readJson(path.join(DATA_DIR, 'projects', `${slug}.json`), null))
    .filter(Boolean);

  return {
    version: 1,
    company,
    about,
    aboutImage,
    hero,
    stats,
    whyChooseUs,
    timeline,
    footer,
    testimonials,
    faq,
    projects,
  };
}

export function parseBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Invalid JSON';
        reject(
          new Error(
            `Invalid JSON payload (${message}). Do not embed Base64 images — paste public image URLs instead.`,
          ),
        );
      }
    });
    req.on('error', reject);
  });
}

export function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}
