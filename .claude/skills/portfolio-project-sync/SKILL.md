---
name: portfolio-project-sync
description: |
  Sync GitHub repositories into a Next.js portfolio project. Fetches repos,
  reads README/package.json for metadata, detects tech stack, captures screenshots
  of deployed sites, and adds projects to data/profile.ts with value-based categories.
  This skill should be used when users ask to add GitHub projects to portfolio,
  sync repositories, update project screenshots, or refresh portfolio data.
---

# Portfolio Project Sync

Automates the full lifecycle of adding GitHub repositories to a Next.js portfolio:
discovery → metadata extraction → categorization → screenshot capture → data update.

## Prerequisites

| Requirement | Check |
|-------------|-------|
| `gh` CLI authenticated | `gh auth status` (run in PowerShell if not in bash PATH) |
| Node.js installed | `node --version` |
| Playwright installed | `npm install -D @playwright/test && npx playwright install chromium` |
| Portfolio uses `data/profile.ts` | Check file exists |

**Note**: On Windows, `gh` may only be in PowerShell's PATH, not bash. Run scripts from PowerShell or use `powershell.exe -Command "gh ..."` from bash.

## Before Implementation

Gather context to ensure successful implementation:

| Source | Gather |
|--------|--------|
| **Codebase** | Read `data/profile.ts` to understand Project interface and existing categories |
| **Conversation** | User's GitHub username, which repos to add, deployment URLs |
| **Skill References** | Category mapping from `references/category-guide.md`, pitfalls from `references/pitfalls.md` |
| **User Guidelines** | Project-specific conventions in `CLAUDE.md` |

## Workflow

```
1. Discover repos (gh CLI)
2. Read README + package.json from each repo
3. Detect tech stack from dependencies
4. Map to value-based category
5. Capture screenshot if deployed URL exists
6. Generate project entry
7. Add to data/profile.ts
8. Update public/llms.txt
9. Build, commit, push
```

### Step 1: Discover Repositories

```bash
# List all repos for a user
gh repo list <username> --limit 50 --json name,description,url,pushedAt,isPrivate

# Get specific repo details
gh api repos/<username>/<repo>/contents/README.md --jq '.content' | base64 -d
gh api repos/<username>/<repo>/contents/package.json --jq '.content' | base64 -d
```

Filter out:
- Forks (unless customized)
- Archived repos
- Learning/practice repos (ask user which to skip)

### Step 2: Extract Metadata

From README (first paragraph → description):
```bash
gh api repos/<username>/<repo>/contents/README.md --jq '.content' | base64 -d | head -20
```

From package.json (dependencies → tech stack):
```bash
gh api repos/<username>/<repo>/contents/package.json --jq '.content' | base64 -d
```

For Python repos, check `pyproject.toml` or `requirements.txt`:
```bash
gh api repos/<username>/<repo>/contents/pyproject.toml --jq '.content' | base64 -d
gh api repos/<username>/<repo>/contents/requirements.txt --jq '.content' | base64 -d
```

### Step 3: Detect Tech Stack

Map dependencies to display names. See `references/tech-detection.md` for full mapping.

**Common mappings:**
| Dependency | Display Name |
|------------|-------------|
| `next`, `nextjs` | Next.js |
| `react` | React.js |
| `typescript` | TypeScript |
| `tailwindcss` | Tailwind CSS |
| `python` | Python |
| `fastapi` | FastAPI |
| `openai` | OpenAI API |
| `@prisma/client` | Prisma ORM |
| `sanity` | Sanity CMS |
| `woocommerce` | WooCommerce |
| `shopify` | Shopify |

### Step 4: Map to Category

Use value-based categories (NOT tech-based). See `references/category-guide.md`.

| Category | Use For |
|----------|---------|
| **AI Tool** | AI-powered utilities, chatbots, agents, RAG systems |
| **Marketplace** | E-commerce, multi-vendor, rental, P2P platforms |
| **Tool** | Single-purpose utilities, converters, builders |
| **Dashboard** | Admin panels, analytics, management UIs |
| **Platform** | SaaS products, multi-sided platforms, agency sites |
| **Personal** | Portfolio, personal websites |
| **WordPress** | WordPress-based sites |
| **Institution** | Educational, organizational, religious sites |
| **Ecommerce** | Online stores, shopping sites |

### Step 5: Capture Screenshot

Only for deployed sites with accessible URLs:

```javascript
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(DEPLOYED_URL, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `public/assets/projects/${repo-name}.png`, type: 'png' });
  await browser.close();
})();
```

**Pitfalls:**
- `fullPage: true` captures too much — use viewport-only for hero screenshot
- Some sites need `waitForTimeout(5000)` for animations to render
- Blank screenshots = page didn't load or background is transparent
- Save as PNG, not JPEG (better quality for UI screenshots)

### Step 6: Generate Project Entry

```typescript
{
  title: "Project Name",
  description: "Short, specific description — what it does, not how it's built.",
  image: "/assets/projects/${repo-name}.png",  // or "/assets/placeholder.png"
  link: "https://deployed-url.vercel.app/",    // or "#" for private
  repoUrl: "https://github.com/user/repo",     // omit if private
  category: "AI Tool",                          // value-based, not tech-based
  tags: ["Next.js", "AI", "SaaS"],             // max 5-6 relevant tags
  techStack: ["Next.js", "TypeScript", "Tailwind CSS"],  // actual dependencies
}
```

**Description rules:**
- Lead with what it does, not "built with..."
- No "A fully dynamic" or "Created a website for" template language
- First person for founder projects ("AI chatbot SaaS I founded")
- Specific, not generic ("15+ optimized posts a day" not "SEO tool")

### Step 7: Add to data/profile.ts

Insert into `existingProjects` array (NOT `githubRepositories` — those get merged automatically).

Place new projects:
- After existing similar-category projects
- Before the `// WordPress Projects` comment if Next.js
- Before the `// Tools & Automation` comment if Python/tools

### Step 8: Update public/llms.txt

Add notable new projects to the "Notable projects" section. Keep it to 6-8 projects max.

### Step 9: Build, Commit, Push

```bash
npm run build                    # Verify no errors
git add -A
git commit -m "Add <project> to portfolio"
git push origin main
git push client main             # If client remote exists
```

## Project Entry Template

```typescript
{
  title: "REPO_NAME formatted as Title Case",
  description: "ONE sentence: what it does for the user. Specific, not generic.",
  image: "/assets/projects/REPO_NAME.png",  // captured or placeholder
  link: "DEPLOYED_URL or #",
  repoUrl: "GITHUB_URL",                    // omit if private/missing
  category: "VALUE_BASED_CATEGORY",
  tags: ["TAG1", "TAG2", "TAG3"],
  techStack: ["STACK1", "STACK2", "STACK3"],
}
```

## Quick Commands

```bash
# List all repos
gh repo list USERNAME --limit 50 --json name,url,pushedAt

# Get README
gh api repos/USERNAME/REPO/contents/README.md --jq '.content' | base64 -d

# Get package.json
gh api repos/USERNAME/REPO/contents/package.json --jq '.content' | base64 -d

# Get pyproject.toml
gh api repos/USERNAME/REPO/contents/pyproject.toml --jq '.content' | base64 -d

# Check if site is live
curl -s -o /dev/null -w "%{http_code}" https://deployed-url.vercel.app/

# Capture screenshot (requires playwright)
node -e "const{chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});await p.goto('URL',{waitUntil:'load'});await p.waitForTimeout(3000);await p.evaluate(()=>window.scrollTo(0,0));await p.screenshot({path:'public/assets/projects/NAME.png'});await b.close()})()"
```

## Pitfalls to Avoid

See `references/pitfalls.md` for full list. Key ones:

1. **Don't use tech-based categories** — "Next.js" is not a category, "Platform" is
2. **Don't write "A fully dynamic..."** — describe what the project DOES
3. **Don't add learning repos** — "Assignment Projects" dilutes the portfolio
4. **Don't forget screenshots** — placeholder.png looks unprofessional
5. **Don't skip the build check** — always `npm run build` before committing
6. **Don't push to only one remote** — push to ALL configured remotes
7. **Don't use `fullPage: true`** — hero section only for project cards
8. **Don't hardcode image paths** — verify the file exists before referencing
