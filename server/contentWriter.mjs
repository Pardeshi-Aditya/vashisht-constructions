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

function extensionFromDataUrl(dataUrl) {
  const match = /^data:image\/([\w+]+);base64,/.exec(dataUrl);
  if (!match) return 'jpg';
  const type = match[1].toLowerCase().replace('jpeg', 'jpg');
  if (type === 'svg+xml') return 'svg';
  return type;
}

function saveDataUrl(dataUrl, relativePath) {
  const match = /^data:image\/[\w+]+;base64,(.+)$/.exec(dataUrl);
  if (!match) throw new Error('Invalid image data URL');
  const buffer = Buffer.from(match[1], 'base64');
  const absolute = path.join(ROOT, 'public', relativePath.replace(/^\//, ''));
  ensureDir(path.dirname(absolute));
  fs.writeFileSync(absolute, buffer);
  return relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
}

function materializeImage(value, fallbackPath) {
  if (!value) return fallbackPath || '';
  if (!isDataUrl(value)) return value;
  return saveDataUrl(value, fallbackPath);
}

/**
 * Persist full site content into segregated JSON files under /data
 * and write any base64 images into /public/images.
 */
export function writeSiteContent(content) {
  if (!content || typeof content !== 'object') {
    throw new Error('Invalid content payload');
  }

  const company = content.company;
  const about = {
    ...content.about,
    image: materializeImage(
      content.aboutImage || content.about?.image,
      '/images/about/studio.webp',
    ),
  };
  const hero = {
    ...content.hero,
    image: materializeImage(content.hero?.image, '/images/hero/hero.webp'),
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

    const folder = `/images/projects/${slug}`;
    const next = {
      ...project,
      slug,
      heroImage: materializeImage(project.heroImage, `${folder}/hero.jpg`),
      thumbnail: materializeImage(project.thumbnail, `${folder}/thumb.jpg`),
      gallery: (project.gallery || []).map((img, index) =>
        materializeImage(img, `${folder}/${index + 1}.jpg`),
      ),
    };

    writeJson(path.join(projectsDir, `${slug}.json`), next);
    slugs.push(slug);
  }

  writeJson(path.join(projectsDir, '_index.json'), slugs);

  for (const file of existing) {
    const slug = file.replace(/\.json$/, '');
    if (!slugs.includes(slug)) {
      fs.unlinkSync(path.join(projectsDir, file));
    }
  }

  return readSiteContent();
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

/**
 * Save an uploaded data-URL image into public/images.
 */
export function saveUploadedImage({ dataUrl, folder = 'uploads', filename }) {
  if (!isDataUrl(dataUrl)) throw new Error('Expected a data URL image');

  const safeFolder = String(folder)
    .replace(/\.\./g, '')
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-zA-Z0-9/_-]/g, '');

  const ext = extensionFromDataUrl(dataUrl);
  const safeName = (filename || `image-${Date.now()}`)
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .toLowerCase();

  const relative = `/images/${safeFolder}/${safeName}.${ext}`;
  return saveDataUrl(dataUrl, relative);
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
        reject(error);
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
