const express = require('express');
const { performActionsAndRecord } = require('./recording');
const app = express();

// ✅ This uses the Railway-assigned port
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/record', async (req, res) => {
  const { url, actions, duration } = req.body;

  if (!url || !Array.isArray(actions)) {
    return res.status(400).json({ error: 'Missing url or actions array' });
  }

  try {
    const filename = await performActionsAndRecord(url, actions, duration || 15);
    res.json({ video_url: `/videos/${filename}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/videos', express.static('videos'));

app.listen(port, () => {
  console.log(`Recorder API running on port ${port}`);
});

app.listen(port, () => {
  console.log(`✅ Recorder API running on port ${port}`);
  console.log(`▶ DISPLAY: ${process.env.DISPLAY}`);
});

