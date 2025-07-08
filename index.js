console.log("🔥 Starting API...");
const express = require('express');
const { performActionsAndRecord } = require('./recording');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/record', async (req, res) => {
  console.log("📥 POST /record hit");
  const { url, actions, duration } = req.body;
  ...
});

app.listen(port, () => {
  console.log(`✅ Listening on port ${port}`);
});
