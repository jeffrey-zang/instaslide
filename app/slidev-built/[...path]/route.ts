import { NextResponse } from 'next/server';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DIST_ROOT = path.join(process.cwd(), '.slidev-dist');

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

function getContentType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();
  return CONTENT_TYPES[extension] ?? 'application/octet-stream';
}

export async function GET(_request: Request, context: { params: Promise<{ path?: string[] }> }) {
  const params = await context.params;
  const segments = params.path ?? [];
  if (segments.length === 0) {
    return new NextResponse('Not found', { status: 404 });
  }

  const [deckId, ...rest] = segments;
  const relativePath = rest.length > 0 ? rest.join('/') : 'index.html';

  const deckRoot = path.join(DIST_ROOT, deckId);
  const filePath = path.join(deckRoot, relativePath);
  const normalizedPath = path.normalize(filePath);

  if (!normalizedPath.startsWith(deckRoot)) {
    return new NextResponse('Not found', { status: 404 });
  }

  try {
    const fileBuffer = await readFile(normalizedPath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': getContentType(relativePath),
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
