import express from 'express';
import cors from 'cors';
import { Opper } from 'opperai';
import { z } from 'zod';
const app = express();

const port = process.env['PORT'] || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.post('/api/ai', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "text" in request body.' });
    }
    // ✅ Use raw fetch with X-Opper-Route header
    const response = await fetch('https://api.opper.ai/v3/compat/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env['OPPER_API_KEY']}`,
        'Content-Type': 'application/json',
        'X-Opper-Route': 'dynamic/my-route',
      },
      body: JSON.stringify({
        model: 'nebius/moonshotai/Kimi-K2.7-Code',
        messages: [
          {
            role: 'system',
            content: 'You are a helper assistant named AG. Always say your name when talking.',
          },
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Opper API error:', response.status, errorBody);
      throw new Error(`Opper API error ${response.status}: ${errorBody}`);
    }
    const data = await response.json();
    // Extract content (OpenAI-compatible response)
    const summary = data.choices?.[0]?.message?.content?.trim();
    if (!summary) {
      return res.status(500).json({
        error: 'Unexpected response from AI.',
        details: JSON.stringify(data),
      });
    }
    return res.status(200).json({ summary });
  } catch (error: any) {
    console.error('Error in /api/ai:', error);
    return res.status(500).json({
      error: 'Failed to process AI request.',
      details: error?.message || String(error),
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
