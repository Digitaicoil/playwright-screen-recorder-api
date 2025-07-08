const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { chromium } = require('playwright');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/record', async (req, res) => {
  const { url, actions = [], duration = 10 } = req.body;

  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);

  for (const action of actions) {
    if (action.type === 'scroll') {
      await page.mouse.wheel(0, action.amount || 500);
    } else if (action.type === 'wait') {
      await page.waitForTimeout(action.delay || 1000);
    }
  }

  await page.waitForTimeout(duration * 1000);
  await page.screenshot({ path: 'screenshot.png' });

  await browser.close();
  res.json({ status: 'done', screenshot: 'saved' });
});

app.listen(3000, () => {
  console.log('Recorder API running on port 3000');
});
