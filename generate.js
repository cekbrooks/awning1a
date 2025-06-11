
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const replicateApiKey = process.env.REPLICATE_API_TOKEN;
  const { image } = req.body;

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "INSERT_MODEL_VERSION_ID_HERE",
        input: {
          image: image,
          prompt: "Show this awning as if it has been cleaned, but keeping any sun-bleaching or fading that a physical clean cannot change. Keep structure, logos, and colors realistic."
        }
      })
    });

    const prediction = await response.json();

    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { 'Authorization': `Token ${replicateApiKey}` }
      });
      result = await pollRes.json();
    }

    if (result.status === "succeeded") {
      return res.status(200).json({ afterImage: result.output });
    } else {
      return res.status(500).json({ message: 'AI generation failed' });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}
