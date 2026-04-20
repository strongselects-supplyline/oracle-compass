import { NextResponse } from 'next/server';
import { statSync } from 'fs';
import path from 'path';

function getAge(filePath: string): { mtime: string | null; ageDays: number | null; color: 'green' | 'amber' | 'red' | 'unknown' } {
  try {
    const stat = statSync(filePath);
    const mtime = stat.mtime.toISOString();
    const ageDays = Math.floor((Date.now() - stat.mtime.getTime()) / 86400000);
    const color = ageDays < 7 ? 'green' : ageDays < 30 ? 'amber' : 'red';
    return { mtime, ageDays, color };
  } catch {
    return { mtime: null, ageDays: null, color: 'unknown' };
  }
}

export async function GET() {
  // Resolve paths relative to the repo root (goes up from oracle-compass to antigravity)
  const repoRoot = path.resolve(process.cwd(), '..');

  const tools = [
    {
      name: 'Catalog Intelligence Matrix',
      path: path.join(repoRoot, 'brain', 'catalog_intelligence_matrix.json'),
      link: null,
    },
    {
      name: 'Gorilla Geo Output',
      path: path.join(repoRoot, 'scratch', 'gorilla-geo', 'output', 'tier-classified.json'),
      link: null,
    },
    {
      name: 'Core Drive Builder Output',
      path: path.join(repoRoot, 'scratch', 'core-drive-builder', 'output'),
      link: null,
    },
    {
      name: 'Synesthesia Visualizer',
      path: path.join(repoRoot, 'scratch', 'synesthesia-visualizer', 'visualizer.js'),
      link: 'https://synesthesia-visualizer.vercel.app',
    },
  ];

  const result = tools.map(t => ({
    name: t.name,
    link: t.link,
    ...getAge(t.path),
  }));

  return NextResponse.json(result);
}
