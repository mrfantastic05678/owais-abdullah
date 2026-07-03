# Pitfalls & Lessons Learned

Real issues encountered during portfolio project management. Learn from these.

## Data Pitfalls

### 1. Tech-based categories don't sell
**Problem**: Tabs showing "Next.js", "WordPress", "HTML & CSS" — tells visitors nothing about capability.
**Fix**: Use value-based categories: AI Tool, Marketplace, Platform, Dashboard, etc.
**Why**: Clients search for solutions, not technologies. "I need an AI tool" not "I need a Next.js developer".

### 2. "A fully dynamic" descriptions are template slop
**Problem**: Every project says "A fully dynamic X built using Next.js, Sanity, and Tailwind CSS."
**Fix**: Describe what the project DOES, not how it's built.
```typescript
// Bad
description: "A fully dynamic furniture marketplace built using Next.js, Sanity, and Tailwind CSS."

// Good
description: "Online furniture marketplace with product listings, cart, and checkout — built on Next.js and Sanity CMS."
```

### 3. Learning projects dilute the portfolio
**Problem**: "Assignment Projects", "Calculator Agent", "Next.js First App" sit beside production work.
**Fix**: Remove or skip learning repos. 15 strong projects beat 40 mixed ones.
**Rule**: If it was a tutorial assignment or first experiment, don't include it.

### 4. Dead "#" links hurt credibility
**Problem**: "View Project" leads nowhere — worse than no link.
**Fix**: If no deployed URL, use "Private client work" label instead of broken CTA.
```typescript
// In ProjectsTab.tsx, already handled:
{hasValidLink(project.link) ? (
  <Link href={project.link}>View Project</Link>
) : (
  <span>Private client work</span>
)}
```

### 5. Duplicate entries
**Problem**: Same project in both `existingProjects` and `githubRepositories` arrays.
**Fix**: The `mergeProjects()` function handles dedup by title (case-insensitive). But check before adding.

### 6. "Our Blog Posts" on a personal site
**Problem**: First-person plural ("Our") breaks personal brand.
**Fix**: Use "From the Blog" or just "Blog".

## Screenshot Pitfalls

### 7. `fullPage: true` captures too much
**Problem**: Full-page screenshot shows 20+ sections — project card only shows a tiny hero.
**Fix**: Use viewport-only (1280x800), scroll to top first.
```javascript
// Bad
await page.screenshot({ path: 'name.png', fullPage: true });

// Good
await page.evaluate(() => window.scrollTo(0, 0));
await page.screenshot({ path: 'name.png' });  // viewport only
```

### 8. Blank screenshots
**Problem**: Screenshot file exists but is blank/white.
**Causes**:
- Page hasn't loaded yet (need `waitForTimeout(3000-5000)`)
- Background is transparent (PNG on white = invisible)
- JavaScript-rendered content not executed
**Fix**: Always wait for `networkidle` + extra timeout, verify by reading the image.

### 9. Screenshots with wrong dimensions
**Problem**: Screenshot is 375px mobile or 1920px ultrawide.
**Fix**: Set viewport to 1280x800 before navigating.
```javascript
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
```

### 10. Old screenshots not updated
**Problem**: Site redesigned but portfolio still shows 6-month-old screenshot.
**Fix**: Re-capture screenshots periodically or when user provides new ones.

## Build & Deploy Pitfalls

### 11. Forgetting to build before push
**Problem**: Committed code that doesn't compile, Vercel build fails.
**Fix**: Always `npm run build` before committing.

### 12. Pushing to only one remote
**Problem**: Two remotes configured (origin + client), only pushed to one.
**Fix**: Push to ALL remotes:
```bash
git push origin main
git push client main
```

### 13. Cache-busting kills performance
**Problem**: `?v=${Date.now()}` on images means every visitor re-downloads everything.
**Fix**: Remove cache-busting params. Rename files if content changes.

### 14. Client-side fetching invisible to Google
**Problem**: Projects fetched in `useEffect` → crawlers see empty skeletons.
**Fix**: Server-render projects (import data directly in server component).

## Category Pitfalls

### 15. "Tools & Automation" is too broad
**Problem**: Everything from CLI apps to AI agents lumped together.
**Fix**: Split into "AI Tool" (AI-powered) and "Tool" (regular utilities).

### 16. WordPress sites need their own category
**Problem**: Mixing WordPress sites with Next.js sites in same tab.
**Fix**: Keep "WordPress" as separate category — different client expectation.

### 17. Agency sites ≠ Platform
**Problem**: "Hashtag Tech" (agency site) categorized as "Platform".
**Fix**: Agency marketing sites are "Platform". SaaS products are also "Platform".
**Rule**: If it's a business website (not a product), "Platform" works. If it's a product users pay for, "Platform" also works.

## Description Pitfalls

### 18. "Created a website for..." is passive
**Problem**: Reads like a homework report, not a portfolio.
**Fix**: Active voice, specific outcome.
```typescript
// Bad
description: "Created a website for a travel agency, showcasing their expertise."

// Good
description: "Travel agency website — tour packages, booking, and destination guides."
```

### 19. Listing tech in description
**Problem**: "Built with Next.js, TypeScript, Tailwind CSS, Supabase, Prisma..."
**Fix**: Put tech in `techStack` array. Description should explain VALUE, not stack.

### 20. Inconsistent description styles
**Problem**: Some descriptions are one sentence, others are three paragraphs.
**Fix**: Keep descriptions to 1-2 sentences max. Project card truncates at 2 lines anyway.
