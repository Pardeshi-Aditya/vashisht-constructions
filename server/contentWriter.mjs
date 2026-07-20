import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');
export const DATA_DIR = path.join(ROOT, 'data');

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
 * Image fields must be public URLs used directly in <img src>.
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
 * Image fields are URL strings (Google Drive links used directly in <img src>).
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
    image: content.aboutImage || content.about?.image || '',
  };
  const hero = {
    ...content.hero,
    image: content.hero?.image || '',
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
      deletedFiles.push(`data/projects/${file}`);
      fs.unlinkSync(path.join(projectsDir, file));
    }
  }

  return {
    content: readSiteContent(),
    deletedFiles,
  };
}

export function readSiteContent() {
  const company = readJson(path.join(DATA_DIR, 'company.json'), {});
  const aboutFile = readJson(path.join(DATA_DIR, 'about.json'), {});
  const { image: aboutImage = '', ...about } = aboutFile;
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
