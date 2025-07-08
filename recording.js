const { chromium } = require('playwright');
const { exec } = require('child_process');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { performActions } = require('./actions');

async function performActionsAndRecord(url, actions, duration = 15) {
  const filename = `output-${uuidv4()}.mp4`;
  const outputPath = `videos/${filename}`;

  if (!fs.existsSync('videos')) fs.mkdirSync('videos');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  const ffmpeg = exec(`ffmpeg -y -video_size 1280x720 -f x11grab -i :0.0 -t ${duration} ${outputPath}`);

  await page.goto(url);
  await performActions(page, actions);
  await page.waitForTimeout(duration * 1000);

  await browser.close();

  return new Promise((resolve, reject) => {
    ffmpeg.on('exit', () => {
      resolve(filename);
    });
    ffmpeg.on('error', reject);
  });
}

module.exports = { performActionsAndRecord };
