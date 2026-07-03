#!/usr/bin/env node
// detect-stack.js - Detect tech stack from GitHub repo's package.json or pyproject.toml
// Usage: node detect-stack.js <owner> <repo>

const { execSync } = require('child_process');

const OWNER = process.argv[2];
const REPO = process.argv[3];

if (!OWNER || !REPO) {
  console.error('Usage: node detect-stack.js <owner> <repo>');
  process.exit(1);
}

function fetchFile(path) {
  try {
    const result = execSync(
      `gh api repos/${OWNER}/${REPO}/contents/${path} --jq '.content'`,
      { encoding: 'utf8', timeout: 10000 }
    );
    return Buffer.from(result.trim(), 'base64').toString('utf8');
  } catch {
    return null;
  }
}

function mapDep(dep) {
  const map = {
    // JS/TS frameworks
    'next': 'Next.js', 'react': 'React.js', 'vue': 'Vue.js', 'nuxt': 'Nuxt',
    'svelte': 'Svelte', 'angular': 'Angular', 'gatsby': 'Gatsby',
    // Languages
    'typescript': 'TypeScript', 'node': 'Node.js',
    // Styling
    'tailwindcss': 'Tailwind CSS', 'styled-components': 'Styled Components',
    // DB/ORM
    '@prisma/client': 'Prisma ORM', 'prisma': 'Prisma ORM',
    'drizzle-orm': 'Drizzle ORM', 'mongoose': 'Mongoose',
    '@neondatabase/serverless': 'Neon Postgres',
    // Auth
    '@clerk/nextjs': 'Clerk', 'next-auth': 'NextAuth.js', 'better-auth': 'BetterAuth',
    '@supabase/supabase-js': 'Supabase',
    // AI
    'openai': 'OpenAI API', '@google/generative-ai': 'Gemini AI',
    'langchain': 'LangChain', 'ai': 'Vercel AI SDK',
    // CMS
    'sanity': 'Sanity CMS',
    // Payments
    'stripe': 'Stripe',
    // E-commerce
    'shopify': 'Shopify',
  };
  return map[dep] || null;
}

function mapPythonDep(dep) {
  const map = {
    'fastapi': 'FastAPI', 'django': 'Django', 'flask': 'Flask', 'streamlit': 'Streamlit',
    'openai': 'OpenAI API', 'langchain': 'LangChain', 'transformers': 'Hugging Face',
    'pandas': 'Pandas', 'numpy': 'NumPy',
    'openai-agents': 'OpenAI Agents SDK', 'chainlit': 'Chainlit',
    'sqlalchemy': 'SQLAlchemy', 'psycopg2': 'PostgreSQL',
    'qdrant-client': 'Qdrant', 'redis': 'Redis',
    'beautifulsoup4': 'BeautifulSoup', 'scrapy': 'Scrapy', 'playwright': 'Playwright',
  };
  return map[dep] || null;
}

// Try package.json (Node.js)
const pkgJson = fetchFile('package.json');
if (pkgJson) {
  try {
    const pkg = JSON.parse(pkgJson);
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    const stack = Object.keys(allDeps).map(mapDep).filter(Boolean);
    console.log(JSON.stringify({ type: 'node', stack, name: pkg.name, description: pkg.description }));
    process.exit(0);
  } catch (e) {
    // parse error, continue
  }
}

// Try pyproject.toml (Python)
const pyproject = fetchFile('pyproject.toml');
if (pyproject) {
  const deps = [];
  const lines = pyproject.split('\n');
  let inDeps = false;
  for (const line of lines) {
    if (line.includes('dependencies')) inDeps = true;
    if (inDeps && line.includes('"')) {
      const match = line.match(/"([a-zA-Z0-9_-]+)/);
      if (match) deps.push(match[1]);
    }
    if (inDeps && line.includes(']')) inDeps = false;
  }
  const stack = deps.map(mapPythonDep).filter(Boolean);
  console.log(JSON.stringify({ type: 'python', stack }));
  process.exit(0);
}

// Try requirements.txt
const reqTxt = fetchFile('requirements.txt');
if (reqTxt) {
  const deps = reqTxt.split('\n')
    .map(l => l.split('==')[0].split('>=')[0].split('[')[0].trim())
    .filter(Boolean);
  const stack = deps.map(mapPythonDep).filter(Boolean);
  console.log(JSON.stringify({ type: 'python', stack }));
  process.exit(0);
}

console.log(JSON.stringify({ type: 'unknown', stack: [] }));
