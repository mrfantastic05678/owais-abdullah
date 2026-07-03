#!/usr/bin/env node
// add-project.js - Generate a project entry for data/profile.ts
// Usage: node add-project.js --name "Project" --desc "Description" --link URL --category Category --stack "Next.js,Tailwind" --tags "AI,SaaS"

const args = process.argv.slice(2);

function getArg(name) {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : null;
}

const name = getArg('name');
const desc = getArg('desc');
const link = getArg('link') || '#';
const repoUrl = getArg('repo');
const category = getArg('category') || 'Tool';
const image = getArg('image') || '/assets/placeholder.png';
const stack = getArg('stack') || '';
const tags = getArg('tags') || '';

if (!name) {
  console.error('Usage: node add-project.js --name "Name" --desc "Description" [--link URL] [--repo URL] [--category Cat] [--image path] [--stack "A,B"] [--tags "X,Y"]');
  process.exit(1);
}

const techStack = stack ? stack.split(',').map(s => s.trim()) : [];
const tagList = tags ? tags.split(',').map(t => t.trim()) : [];

const entry = `  {
    title: "${name}",
    description: "${desc}",
    image: "${image}",
    link: "${link}",${repoUrl ? `\n    repoUrl: "${repoUrl}",` : ''}
    category: "${category}",
    tags: [${tagList.map(t => `"${t}"`).join(', ')}],
    techStack: [${techStack.map(t => `"${t}"`).join(', ')}],
  },`;

console.log('');
console.log('=== Add this to data/profile.ts (existingProjects array) ===');
console.log('');
console.log(entry);
console.log('');
console.log('=== Category options ===');
console.log('AI Tool, Marketplace, Tool, Dashboard, Platform, Personal, WordPress, Institution, Ecommerce');
