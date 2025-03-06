const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 5001; // Use a different port for the proxy server

app.use(express.json());

// Proxy endpoint
app.post('/proxy/chat', async (req, res) => {
  try {
    const apiUrl = 'https://api.deepseek.com/v1/chat'; // DeepSeek API endpoint
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-3c4b007c56c648a4afc096f4d04d4e33', // Replace with your actual API key
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});