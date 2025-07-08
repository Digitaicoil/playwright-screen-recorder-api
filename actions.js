async function performActions(page, actions = []) {
  for (const action of actions) {
    if (action.type === 'click') {
      await page.click(action.selector);
    } else if (action.type === 'scroll') {
      await page.evaluate((amount) => window.scrollBy(0, amount), action.amount || 500);
    } else if (action.type === 'wait') {
      await page.waitForTimeout(action.delay || 2000);
    } else if (action.type === 'goto') {
      await page.goto(action.url || 'https://example.com');
    }
  }
}

module.exports = { performActions };
