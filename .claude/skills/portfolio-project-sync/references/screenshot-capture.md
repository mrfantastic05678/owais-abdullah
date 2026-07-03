# Screenshot Capture Reference

How to capture project screenshots for portfolio cards.

## Setup

```bash
# Install Playwright (one-time)
npm install -D @playwright/test
npx playwright install chromium
```

## Basic Screenshot (Hero Section)

```javascript
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  await page.goto('https://example.com', { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(3000);  // Wait for animations
  await page.evaluate(() => window.scrollTo(0, 0));  // Ensure at top
  
  await page.screenshot({ 
    path: 'public/assets/projects/project-name.png',
    type: 'png'
  });
  
  await browser.close();
})();
```

## Batch Screenshots

```javascript
const { chromium } = require('playwright');

const sites = [
  { url: 'https://site1.com', name: 'site1' },
  { url: 'https://site2.com', name: 'site2' },
  { url: 'https://site3.com', name: 'site3' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  for (const site of sites) {
    try {
      await page.goto(site.url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(3000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ 
        path: `public/assets/projects/${site.name}.png`,
        type: 'png'
      });
      console.log(`✓ ${site.name}`);
    } catch (e) {
      console.log(`✗ ${site.name}: ${e.message}`);
    }
  }
  
  await browser.close();
})();
```

## One-liner (for quick capture)

```bash
node -e "
const{chromium}=require('playwright');
(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:1280,height:800}});
  await p.goto('URL',{waitUntil:'load'});
  await p.waitForTimeout(3000);
  await p.evaluate(()=>window.scrollTo(0,0));
  await p.screenshot({path:'public/assets/projects/NAME.png'});
  await b.close();
})()
"
```

## Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Blank screenshot | Page not loaded | Add `waitForTimeout(5000)` |
| White image | Transparent background | Site needs dark mode or bg color |
| Missing text | Font not loaded | Wait for `networkidle` instead of `load` |
| Wrong dimensions | Default viewport | Set `viewport: { width: 1280, height: 800 }` |
| Partial capture | Scrolled down | Add `window.scrollTo(0, 0)` before screenshot |
| Timeout error | Site slow/blocked | Increase timeout to 60000 |

## Verifying Screenshots

Always verify the screenshot was captured correctly:

```bash
# Check file size (should be > 10KB for a real screenshot)
ls -la public/assets/projects/*.png

# Or read the image to visually verify
# (Use the Read tool on the PNG file)
```

## Screenshot Naming Convention

```
public/assets/projects/
├── owais-portfolio.png    # Personal portfolio
├── octively.png           # Octively AI chatbot
├── visati.png             # Visati visa SaaS
├── gigbillow.png          # GigBillow freelance toolkit
├── teamflow.png           # TeamFlow team management
├── rentparlo.png          # RentParlo rental marketplace
├── placeholder.png        # Fallback for no screenshot
```

Use lowercase, hyphens, repo name as filename. Never spaces.
