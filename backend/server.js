const express = require("express");
const axios = require("axios");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
console.log("🔑 ELEVENLABS_API_KEY:", process.env.ELEVENLABS_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/speak", async (req, res) => {
  const { text, voice_id } = req.body;

  try {
    const response = await axios({
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      data: {
        text,
        model_id: "eleven_multilingual_v1",
      },
    });

    const outputPath = path.join(__dirname, "output.mp3");
    fs.writeFileSync(outputPath, response.data);
    res.download(outputPath);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Failed to generate voice.");
  }
});

app.listen(5000, () => {
  console.log("✅ Backend server running on http://localhost:5000");
});
