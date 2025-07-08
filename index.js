const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { recordScreen } = require('./recording');
const fs = require('fs');

if (!fs.existsSync('videos')) {
  fs.mkdirSync('videos');
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('🎥 Screen Recorder API is running!');
});

app.post('/record', async (req, res) => {
  const { url, actions, duration } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const buffer = await recordScreen({ url, actions, duration });
    res.set('Content-Type', 'video/webm');
    res.send(buffer);
  } catch (e) {
    console.error('Recording error:', e);
    res.status(500).json({ error: 'Failed to record screen' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Recorder API running on http://0.0.0.0:${port}`);
});
