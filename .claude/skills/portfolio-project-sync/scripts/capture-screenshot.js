#!/usr/bin/env node
// capture-screenshot.js - Capture hero section screenshot of a deployed site
// Usage: node capture-screenshot.js <url> <output-path>
// Example: node capture-screenshot.js https://octively.com public/assets/projects/octively.png

const { chromium } = require('playwright');
const path = require('path');

const URL = process.argv[2];
const OUTPUT = process.argv[3] || 'public/assets/projects/screenshot.png';

if (!URL) {
  console.error('Usage: node capture-screenshot.js <url> <output-path>');
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  try {
    console.log(`Navigating to ${URL}...`);
    await page.goto(URL, { waitUntil: 'load', timeout: 30000 });
    
    // Extra wait for animations/dynamic content
    await page.waitForTimeout(3000);
    
    // Scroll to top to ensure hero is visible
    await page.evaluate(() => window.scrollTo(0, 0));
    
    // Capture viewport only (hero section)
    await page.screenshot({ path: OUTPUT, type: 'png' });
    
    const title = await page.title();
    console.log(`✓ Captured: ${OUTPUT}`);
    console.log(`  Title: ${title}`);
  } catch (e) {
    console.error(`✗ Failed: ${e.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
