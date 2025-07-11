const { chromium } = require('playwright');
const fs = require('fs');

async function recordScreen({ url, actions = [], duration = 10000 }) {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: './videos/', size: { width: 1280, height: 720 } },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  try {
    console.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });

    for (const action of actions || []) {
      console.log(`Performing action: ${action.type || action.action}`);
      switch (action.type || action.action) {
        case 'scroll':
          await page.mouse.wheel(0, action.amount || 500);
          break;
        case 'wait':
          await page.waitForTimeout(action.delay || 1000);
          break;
        case 'click':
          if (action.selector) await page.click(action.selector);
          break;
        case 'type':
        case 'fill':
          if (action.selector && action.value) await page.fill(action.selector, action.value);
          break;
        case 'screenshot':
          if (action.selector) {
            await page.locator(action.selector).screenshot({ path: `videos/screenshot-${Date.now()}.png` });
          } else {
            await page.screenshot({ path: `videos/screenshot-${Date.now()}.png` });
          }
          break;
      }
    }

    await page.waitForTimeout(duration);

    const videoPath = await page.video().path();
    await context.close();
    await browser.close();

    const videoBuffer = fs.readFileSync(videoPath);
    fs.unlinkSync(videoPath);

    return videoBuffer;
  } catch (err) {
    console.error('Recording error:', err.message);
    await context.close();
    await browser.close();
    throw new Error('Failed to record screen');
  }
}

module.exports = { recordScreen };
