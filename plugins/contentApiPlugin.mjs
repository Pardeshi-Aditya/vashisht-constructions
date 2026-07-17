import {
  assertNoEmbeddedImages,
  parseBody,
  readSiteContent,
  sendJson,
  writeSiteContent,
} from '../server/contentWriter.mjs';

function isAdminAuthorized(req) {
  const header = req.headers['x-admin-token'] || '';
  const expected = process.env.ADMIN_API_TOKEN || 'yash:aditya';
  return header === expected;
}

/**
 * Vite middleware that writes /data JSON files during local development.
 */
export function contentApiPlugin() {
  return {
    name: 'content-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/admin')) return next();

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (!isAdminAuthorized(req)) {
          sendJson(res, 401, { ok: false, error: 'Unauthorized' });
          return;
        }

        try {
          if (req.method === 'GET' && req.url.split('?')[0] === '/api/admin/content') {
            sendJson(res, 200, { ok: true, content: readSiteContent() });
            return;
          }

          if (req.method === 'POST' && req.url.split('?')[0] === '/api/admin/content') {
            let body;
            try {
              body = await parseBody(req);
            } catch (error) {
              sendJson(res, 400, {
                ok: false,
                error:
                  error instanceof Error
                    ? error.message
                    : 'Invalid JSON payload.',
              });
              return;
            }

            try {
              assertNoEmbeddedImages(body.content);
              const { content } = writeSiteContent(body.content);
              sendJson(res, 200, {
                ok: true,
                content,
                message: 'Content saved to data/ JSON files',
              });
            } catch (error) {
              sendJson(res, 400, {
                ok: false,
                error:
                  error instanceof Error
                    ? error.message
                    : 'Invalid content payload',
              });
            }
            return;
          }

          sendJson(res, 404, { ok: false, error: 'Not found' });
        } catch (error) {
          sendJson(res, 500, {
            ok: false,
            error: error instanceof Error ? error.message : 'Server error',
          });
        }
      });
    },
  };
}
