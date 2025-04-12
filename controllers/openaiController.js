const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

const generateImage = async (req, res) => {
  console.log("Using OpenAI Key:", process.env.OPEN_API_KEY ?  process.env.OPEN_API_KEY : "Missing ❌");
  const {prompt,size} = req.body;
  const imageSize = size === 'small'? '256x256' : size === 'medium'? '512x512' : '1024x1024';
  try {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: imageSize,
    });
      const image_url = response.data[0].url;
      res.status(200).json({
        success: true,
        image_url: image_url, 
      });
   
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("An error occurred during image generation.");
  }
};

const generateText = async (req, res) => {
  const {prompt} = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      prompt,
      messages: [
        { role: "user", content: prompt }, 
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });
    const generatedText = response.choices[0].message.content;
    
    res.status(200).json({
      success: true,
      response: generatedText, 
    })
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("An error occurred during Text generation.");
  }
}

module.exports = { generateImage,generateText };
