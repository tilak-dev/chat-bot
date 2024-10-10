// Import required modules
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI }  from "@google/generative-ai"
import 'dotenv/config'


const app = express();


app.use(cors());
app.use(express.json());
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY || "";

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      message: "API key is missing",
    });
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function run(prompt) {
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              { text: "you are a friendly chat bot, user we ask you question you have to answer them in a polite manner \n" },
            ],
          },
        ],
      });

      const result = await chatSession.sendMessage(prompt);
      return result.response.text(); 
    } catch (err) {
      console.error('Error during chat session:', err);
      throw err;
    }
  }

  try {
    const result = await run(prompt);
    if (!result) {
      return res.status(204).json({
        success: true,
        message: "No response from model",
      });
    }
    return res.json({
      success: true,
      message: "Response from model",
      response: result,
    });
  } catch (error) {
    console.error('Error during generation:', error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
