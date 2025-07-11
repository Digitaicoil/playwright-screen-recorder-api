const { chromium } = require('playwright');
const fs = require('fs');

async function recordScreen({ url, actions = [], duration = 10000 }) {
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: './videos',
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();
  await page.goto(url);

  for (const action of actions || []) {
    switch (action.type || action.action) {
      case 'scroll':
        await page.mouse.wheel(0, action.amount || 500);
        break;
      case 'wait':
        await page.waitForTimeout(action.delay || 1000);
        break;
      case 'click':
        if (action.selector) {
          await page.click(action.selector);
        }
        break;
      case 'type':
      case 'fill':
        if (action.selector && action.value) {
          await page.fill(action.selector, action.value);
        }
        break;
      case 'screenshot':
        if (action.selector) {
          await page.locator(action.selector).screenshot({ path: `videos/screenshot-${Date.now()}.png` });
        } else {
          await page.screenshot({ path: `videos/screenshot-${Date.now()}.png` });
        }
        break;
      // Ignoring 'upload' for now as it requires file handling
    }
  }

  await page.waitForTimeout(duration);

  // סגירת הדפדפן תסיים את ההקלטה ותשמור את הקובץ
  await context.close();
  const videoPath = await page.video().path();
  
  await browser.close();

  const videoBuffer = fs.readFileSync(videoPath);
  fs.unlinkSync(videoPath); // מחיקת הקובץ לאחר קריאה

  return videoBuffer;
}

module.exports = { recordScreen };
