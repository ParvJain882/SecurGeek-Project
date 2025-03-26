const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all domains

// Load OpenAI API Key from .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// POST endpoint to communicate with OpenAI API
app.post('/api/openai', async (req, res) => {
  const { model, messages } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error occurred while communicating with OpenAI API:', error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({ error: 'No response received from OpenAI API.' });
    } else {
      // Something happened in setting up the request
      res.status(500).json({ error: 'Failed to setup OpenAI API request.' });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
