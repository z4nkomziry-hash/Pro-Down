/* ==========================================================================
   ProDown - Node.js Express Backend API Extractor Server v3.0
   ========================================================================== */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// چالاککردنی CORS و بەکارهێنانی فۆرماتی JSON
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ڕووتی سەرەکی بۆ پشکنینی سێرڤەر
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'ProDown Multi-Engine API Server is running smoothly!',
        timestamp: new Date().toISOString()
    });
});

// ڕووتی سەرەکیی دەرهێنانی لینکی داونلۆد (POST /api/download)
app.post('/api/download', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url || typeof url !== 'string' || !url.trim()) {
            return res.status(400).json({
                success: false,
                error: 'تکایە لینکێکی دروست بنێرە.'
            });
        }

        const targetUrl = url.trim();

        // 1. تاقیکردنەوە لە ڕێگەی Cobalt API Engine
        try {
            const cobaltResponse = await fetch('https://co.wuk.sh/api/json', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                body: JSON.stringify({
                    url: targetUrl,
                    vCodec: 'h264',
                    vQuality: 'max',
                    aFormat: 'mp3',
                    filenamePattern: 'nerd'
                })
            });

            if (cobaltResponse.ok) {
                const cobaltData = await cobaltResponse.json();

                if (cobaltData.url) {
                    return res.status(200).json({
                        success: true,
                        platform: detectPlatform(targetUrl),
                        downloadUrl: cobaltData.url,
                        audioUrl: cobaltData.audio || null,
                        thumb: cobaltData.thumb || null,
                        source: 'Cobalt Engine'
                    });
                }

                if (cobaltData.picker && cobaltData.picker.length > 0) {
                    return res.status(200).json({
                        success: true,
                        platform: detectPlatform(targetUrl),
                        downloadUrl: cobaltData.picker[0].url,
                        thumb: cobaltData.picker[0].thumb || null,
                        source: 'Cobalt Picker'
                    });
                }
            }
        } catch (cobaltError) {
            console.warn('[ProDown Backend] Cobalt API primary failed, trying secondary engines...');
        }

        // 2. تاقیکردنەوە لە ڕێگەی Backup Cobalt Instance Engine
        try {
            const altCobaltResponse = await fetch('https://api.cobalt.tools/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                },
                body: JSON.stringify({ url: targetUrl })
            });

            if (altCobaltResponse.ok) {
                const altData = await altCobaltResponse.json();
                if (altData.url) {
                    return res.status(200).json({
                        success: true,
                        platform: detectPlatform(targetUrl),
                        downloadUrl: altData.url,
                        audioUrl: altData.audio || null,
                        source: 'Secondary Cobalt Engine'
                    });
                }
            }
        } catch (altError) {
            console.warn('[ProDown Backend] Secondary Cobalt API failed...');
        }

        // 3. ڕاگەیاندنی لینکی ڕاستەوخۆ (Direct Stream Fallback)
        return res.status(200).json({
            success: true,
            platform: detectPlatform(targetUrl),
            downloadUrl: targetUrl,
            source: 'Direct Stream Fallback'
        });

    } catch (globalError) {
        console.error('[ProDown Backend Error]:', globalError);
        return res.status(500).json({
            success: false,
            error: 'کێشەیەک لە سێرڤەردا ڕوویدا، تکایە دواتر هەوڵ بدەرەوە.'
        });
    }
});

// فەنکشنی دیاریکردنی پلاتفۆڕم لە ڕێگەی لینکەوە
function detectPlatform(url) {
    if (/tiktok\.com|vt\.tiktok\.com/i.test(url)) return 'TikTok';
    if (/instagram\.com/i.test(url)) return 'Instagram';
    if (/(facebook\.com|fb\.watch)/i.test(url)) return 'Facebook';
    if (/(youtube\.com|youtu\.be)/i.test(url)) return 'YouTube';
    if (/snapchat\.com/i.test(url)) return 'Snapchat';
    return 'Social Media';
}

// دەستپێکردنی سێرڤەر
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 ProDown Backend API is active on port ${PORT}`);
    console.log(`==================================================`);
});

module.exports = app;

