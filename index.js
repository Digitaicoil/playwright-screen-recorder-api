console.log("🚀 Starting app...");

const express = require('express');
const { performActionsAndRecord } = require('./recording');
const app = express();

const port = process.env.PORT || 3000;
console.log("✅ Binding to port:", port);

app.use(express.json());

app.post('/record', async (req, res) => {
  console.log("🎬 /record endpoint hit");
  const { url, actions, duration } = req.body;
  ...
});

app.use('/videos', express.static('videos'));

app.listen(port, () => {
  console.log(`🎥 Recorder API running on port ${port}`);
});
