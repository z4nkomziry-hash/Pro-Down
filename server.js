const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes (Connect Frontend to Backend seamlessly)
app.use(cors());
app.use(express.json());

// ── Multi-Engine Extractor Route ──────────────────────────────────
app.post('/api/download', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, error: 'URL field is required.' });
    }

    // Engine 1: Cobalt Main Endpoint
    try {
        const response = await axios.post('https://co.wuk.sh/api/json', 
            { url }, 
            { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, timeout: 8000 }
        );
        const data = response.data;
        const mediaUrl = data.url || (data.picker && data.picker[0]?.url);
        
        if (mediaUrl) {
            return res.json({ success: true, engine: 'Cobalt-Primary', downloadUrl: mediaUrl });
        }
    } catch (err) {
        console.warn('Engine 1 failed, switching to Engine 2...');
    }

    // Engine 2: Cobalt Alternative Endpoint
    try {
        const response = await axios.post('https://api.cobalt.tools/', 
            { url }, 
            { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, timeout: 8000 }
        );
        const data = response.data;
        const mediaUrl = data.url || (data.picker && data.picker[0]?.url);

        if (mediaUrl) {
            return res.json({ success: true, engine: 'Cobalt-Secondary', downloadUrl: mediaUrl });
        }
    } catch (err) {
        console.warn('Engine 2 failed, switching to Engine 3...');
    }

    // Engine 3: VKRDown Extractor Endpoint
    try {
        const response = await axios.get(`https://api.vkrdown.com/v1/main?url=${encodeURIComponent(url)}`, { timeout: 8000 });
        const data = response.data;
        const mediaUrl = data?.data?.url || (data?.downloads && data?.downloads[0]?.url);

        if (mediaUrl) {
            return res.json({ success: true, engine: 'VKRDown Engine', downloadUrl: mediaUrl });
        }
    } catch (err) {
        console.warn('Engine 3 failed.');
    }

    // Fallback response if all third-party engines fail
    return res.status(502).json({ 
        success: false, 
        error: 'Unable to extract stream from provided link. Please check if the link is public.' 
    });
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send('ProDown Backend API Server is running smoothly! 🚀');
});

// Export app for Vercel Serverless Environments
module.exports = app;

// Run stand-alone server locally (Only if not running on Vercel)
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}
