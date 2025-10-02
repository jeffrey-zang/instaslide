import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

export const runtime = 'nodejs';

interface BuildRequestBody {
  id?: string;
  markdown?: string;
}

const PROJECT_ROOT = process.cwd();
const CACHE_DIR = path.join(PROJECT_ROOT, '.slidev-cache');
const DIST_ROOT = path.join(PROJECT_ROOT, '.slidev-dist');
const CLI_ENTRY = path.join(PROJECT_ROOT, 'node_modules', '@slidev', 'cli', 'bin', 'slidev.mjs');

function getHash(content: string) {
  return createHash('sha1').update(content).digest('hex');
}

async function fileExists(targetPath: string) {
  try {
    await stat(targetPath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return false;
    throw error;
  }
}

async function runSlidevBuild(entryPath: string, outputPath: string, basePath: string) {
  await mkdir(path.dirname(outputPath), { recursive: true });

  // Ensure a clean output directory to avoid stale assets between builds
  await rm(outputPath, { recursive: true, force: true });

  await mkdir(outputPath, { recursive: true });

  return new Promise<void>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [CLI_ENTRY, 'build', entryPath, '--out', outputPath, '--base', basePath],
      {
        cwd: PROJECT_ROOT,
        env: {
          ...process.env,
          NODE_ENV: 'production',
        },
      },
    );

    let stderrBuffer = '';

    child.stderr.on('data', (data) => {
      stderrBuffer += data.toString();
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderrBuffer || `Slidev build failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as BuildRequestBody;
  const { id, markdown } = body;

  if (!id || !markdown) {
    return NextResponse.json({ error: 'Slide id and markdown are required.' }, { status: 400 });
  }

  const trimmedMarkdown = markdown.trim();
  if (!trimmedMarkdown) {
    return NextResponse.json({ error: 'Presentation is empty.' }, { status: 400 });
  }

  const hash = getHash(trimmedMarkdown);
  const entryPath = path.join(CACHE_DIR, `${id}.md`);
  const outputPath = path.join(DIST_ROOT, id);
  const hashFile = path.join(CACHE_DIR, `${id}.hash`);
  const basePath = `/slidev-built/${encodeURIComponent(id)}/`;

  await mkdir(CACHE_DIR, { recursive: true });

  const previousHash = (await fileExists(hashFile)) ? await readFile(hashFile, 'utf8') : undefined;
  const hasExistingBuild = await fileExists(path.join(outputPath, 'index.html'));

  if (previousHash === hash && hasExistingBuild) {
    return NextResponse.json({ ok: true, cached: true });
  }

  await writeFile(entryPath, trimmedMarkdown, 'utf8');

  try {
    await runSlidevBuild(entryPath, outputPath, basePath);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to render presentation with Slidev.',
      },
      { status: 500 },
    );
  }

  await writeFile(hashFile, hash, 'utf8');

  return NextResponse.json({ ok: true, cached: false });
}
