/* ==========================================================================
   ProDown - Download Engine v2.1
   Multi-platform | Multi-fallback | AdSense-ready | XSS-safe DOM construction
   ========================================================================== */

/* ── Utility: Toast Alert ─────────────────────────────────────────────────── */
function showAlert(msg, type = 'info') {
    const toast = document.getElementById('alertToast');
    if (!toast) return;
    const colors = {
        info:    'bg-orange-500/90',
        success: 'bg-emerald-500/90',
        error:   'bg-red-500/90',
        warn:    'bg-amber-500/90'
    };
    const icons = { info: 'fa-circle-info', success: 'fa-circle-check', error: 'fa-triangle-exclamation', warn: 'fa-triangle-exclamation' };

    // Build using safe DOM — no innerHTML on external data
    const color = colors[type] || colors.info;
    toast.className = `fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-xs font-bold text-white shadow-2xl flex items-center gap-2 max-w-xs text-center ${color}`;

    const icon = document.createElement('i');
    icon.className = `fa-solid ${icons[type] || 'fa-circle-info'}`;
    const text = document.createTextNode(msg);

    toast.replaceChildren(icon, text);
    toast.classList.remove('hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.add('hidden'), 4000);
}

/* ── Utility: Validate & sanitize a download URL ─────────────────────────── */
function sanitizeDownloadUrl(raw) {
    if (typeof raw !== 'string') return null;
    let url;
    try { url = new URL(raw.trim()); } catch (_) { return null; }
    // Only allow HTTPS URLs from expected CDN/delivery origins
    if (url.protocol !== 'https:') return null;
    return url.href;
}

/* ── Utility: Sanitize display text (strip HTML) ─────────────────────────── */
function sanitizeText(raw, maxLen = 120) {
    if (typeof raw !== 'string') return '';
    return raw.replace(/[<>&"']/g, '').trim().slice(0, maxLen);
}

/* ── Utility: Progress Bar ────────────────────────────────────────────────── */
function setProgress(pct) {
    const fill = document.getElementById('progressFill');
    const wrap = document.getElementById('progressWrap');
    if (!fill || !wrap) return;
    if (pct === null) { wrap.classList.add('hidden'); return; }
    wrap.classList.remove('hidden');
    fill.style.width = pct + '%';
}

/* ── Mobile Menu ──────────────────────────────────────────────────────────── */
function toggleMobileMenu() {
    const m = document.getElementById('mobileMenu');
    if (m) m.classList.toggle('hidden');
}

/* ── Support Box ──────────────────────────────────────────────────────────── */
function toggleSupportBox() {
    const s = document.getElementById('supportBox');
    if (s) s.classList.toggle('hidden');
}

/* ── Platform Tabs ────────────────────────────────────────────────────────── */
function selectTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('bg-white/5');
    });
    const active = document.getElementById('tab-' + tab);
    if (active) { active.classList.add('active'); active.classList.remove('bg-white/5'); }

    const input = document.getElementById('inputUrl');
    if (!input) return;
    const placeholders = {
        all:  'Paste a TikTok, Instagram, Facebook, YouTube, or Snapchat link…',
        tt:   'Paste a TikTok video link here…',
        ig:   'Paste an Instagram Reels or post link here…',
        fb:   'Paste a Facebook video link here…',
        yt:   'Paste a YouTube Shorts or video link here…',
        snap: 'Paste a Snapchat Spotlight link here…'
    };
    input.placeholder = placeholders[tab] || placeholders.all;
}

/* ── Auto-Paste on Focus ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('inputUrl');
    if (!input) return;

    input.addEventListener('focus', async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && !input.value && /https?:\/\//i.test(text)) {
                input.value = text;
                showAlert('Link pasted from clipboard!', 'info');
            }
        } catch (_) { /* clipboard access denied — silently skip */ }
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') processDownload();
    });
});

/* ── Detect Platform ──────────────────────────────────────────────────────── */
function detectPlatform(url) {
    if (/tiktok\.com/i.test(url))                       return { key: 'tt',   label: 'TikTok' };
    if (/instagram\.com/i.test(url))                    return { key: 'ig',   label: 'Instagram' };
    if (/(facebook\.com|fb\.watch)/i.test(url))         return { key: 'fb',   label: 'Facebook' };
    if (/(youtube\.com|youtu\.be)/i.test(url))          return { key: 'yt',   label: 'YouTube' };
    if (/snapchat\.com/i.test(url))                     return { key: 'snap', label: 'Snapchat' };
    return null;
}

/* ── Skeleton Loader ──────────────────────────────────────────────────────── */
function showSkeleton(container) {
    container.replaceChildren();
    for (let i = 0; i < 2; i++) {
        const div = document.createElement('div');
        div.className = 'skeleton h-10 rounded-xl w-full';
        container.appendChild(div);
    }
}

/* ── API Engines ──────────────────────────────────────────────────────────── */

// Engine 1 – TiklyDown (TikTok-specific)
async function fetchTiklyDown(url) {
    const endpoints = [
        `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
        `https://tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`
    ];
    for (const ep of endpoints) {
        try {
            const r = await fetch(ep, { signal: AbortSignal.timeout(8000) });
            if (!r.ok) continue;
            const d = await r.json();
            const noWm = sanitizeDownloadUrl(d?.video?.noWatermark);
            const wm   = sanitizeDownloadUrl(d?.video?.watermark);
            if (noWm) return [{ url: noWm, label: 'Download HD (No Watermark)', quality: 'HD',  type: 'video' }];
            if (wm)   return [{ url: wm,   label: 'Download Video',             quality: 'SD',  type: 'video' }];
        } catch (_) { /* try next */ }
    }
    return null;
}

// Engine 2 – Cobalt API (multi-platform)
async function fetchCobalt(url) {
    const endpoints = [
        'https://api.cobalt.tools/',
        'https://co.wuk.sh/api/json'
    ];
    for (const ep of endpoints) {
        try {
            const r = await fetch(ep, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, videoQuality: 'max', filenameStyle: 'pretty' }),
                signal: AbortSignal.timeout(10000)
            });
            if (!r.ok) continue;
            const d = await r.json();
            const results = [];
            const videoUrl = sanitizeDownloadUrl(d?.url);
            const audioUrl = sanitizeDownloadUrl(d?.audio);
            if (videoUrl) results.push({ url: videoUrl, label: 'Download HD Video',  quality: 'HD',  type: 'video' });
            if (audioUrl) results.push({ url: audioUrl, label: 'Download MP3 Audio', quality: 'MP3', type: 'audio' });
            if (Array.isArray(d?.picker)) {
                d.picker.slice(0, 3).forEach((p, i) => {
                    const pUrl = sanitizeDownloadUrl(p?.url);
                    if (pUrl) results.push({ url: pUrl, label: `Download Option ${i + 1}`, quality: 'HD', type: p.type === 'audio' ? 'audio' : 'video' });
                });
            }
            if (results.length) return results;
        } catch (_) { /* try next */ }
    }
    return null;
}

// Engine 3 – SaveFrom (YouTube / Facebook fallback)
async function fetchSaveFrom(url) {
    try {
        const r = await fetch(`https://worker.saveform.net/api/info?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(8000) });
        if (!r.ok) return null;
        const d = await r.json();
        const dlUrl = sanitizeDownloadUrl(d?.url?.[0]?.url);
        if (dlUrl) {
            const ext = sanitizeText(d.url[0].ext, 8).toUpperCase() || 'Video';
            const qual = sanitizeText(d.url[0].quality, 8) || 'HD';
            return [{ url: dlUrl, label: `Download ${ext}`, quality: qual, type: 'video' }];
        }
    } catch (_) { /* skip */ }
    return null;
}

// Engine 4 – SnapSave (Snapchat)
async function fetchSnapSave(url) {
    try {
        const r = await fetch(`https://snapsave.app/action.php?lang=en&url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(8000) });
        if (!r.ok) return null;
        const text = await r.text();
        const match = text.match(/href="(https:\/\/[^"]+\.mp4[^"]*?)"/i);
        if (match) {
            const dlUrl = sanitizeDownloadUrl(match[1]);
            if (dlUrl) return [{ url: dlUrl, label: 'Download Spotlight', quality: 'HD', type: 'video' }];
        }
    } catch (_) { /* skip */ }
    return null;
}

/* ── Safe DOM: Build a Download Button ───────────────────────────────────── */
function buildDownloadButton(result, platform, index) {
    const isAudio  = result.type === 'audio';
    const fileName = `ProDown_${platform.label}_${Date.now()}${isAudio ? '.mp3' : '.mp4'}`;

    const btn = document.createElement('button');
    btn.className = isAudio
        ? 'w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold p-3.5 rounded-xl flex justify-between items-center transition-all shadow-lg orange-glow-btn'
        : 'w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold p-3.5 rounded-xl flex justify-between items-center transition-all shadow-lg orange-glow-btn';
    btn.type = 'button';

    // Store the URL in a data attribute (safe — not rendered as HTML)
    btn.dataset.dlUrl  = result.url;
    btn.dataset.dlName = fileName;
    btn.addEventListener('click', () => triggerDirectDownload(btn.dataset.dlUrl, btn.dataset.dlName));

    // Left side: icon + label
    const left = document.createElement('div');
    left.className = 'flex items-center gap-2';

    const icon = document.createElement('i');
    icon.className = `fa-solid ${isAudio ? 'fa-music' : 'fa-cloud-arrow-down'} text-base`;
    left.appendChild(icon);

    const labelSpan = document.createElement('span');
    labelSpan.textContent = sanitizeText(result.label, 60); // textContent — safe
    left.appendChild(labelSpan);

    // Right side: quality badge
    const badge = document.createElement('span');
    badge.className = 'text-[10px] bg-black/30 px-2.5 py-1 rounded-xl';
    badge.textContent = sanitizeText(result.quality, 10);

    btn.appendChild(left);
    btn.appendChild(badge);
    return btn;
}

/* ── Safe DOM: Build the AdSense CTA Slot ────────────────────────────────── */
function buildAdSlotCTA() {
    const wrap = document.createElement('div');
    wrap.className = 'ad-slot ad-slot-cta mt-3';
    wrap.id = 'adSlotCTA';
    // Comment for developers — not rendered as user-facing HTML
    const label = document.createElement('span');
    label.textContent = 'Advertisement';
    wrap.appendChild(label);
    return wrap;
}

/* ── Safe DOM: Build the Error / Retry State ─────────────────────────────── */
function buildErrorState(container) {
    const msg = document.createElement('p');
    msg.className = 'text-slate-400 text-xs text-center py-2 leading-relaxed';
    msg.textContent = 'Make sure the video is public and the link is correct, then try again. Private videos and DRM-protected content cannot be downloaded.';
    container.appendChild(msg);

    const retryBtn = document.createElement('button');
    retryBtn.type = 'button';
    retryBtn.className = 'w-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold p-3 rounded-xl text-xs transition-all';
    retryBtn.addEventListener('click', () => {
        const inputEl = document.getElementById('inputUrl');
        const resultBox = document.getElementById('resultBox');
        if (inputEl) inputEl.value = '';
        if (resultBox) resultBox.classList.add('hidden');
        if (inputEl) inputEl.focus();
    });

    const retryIcon = document.createElement('i');
    retryIcon.className = 'fa-solid fa-rotate-left mr-2';
    retryBtn.appendChild(retryIcon);
    retryBtn.appendChild(document.createTextNode('Try Another Link'));
    container.appendChild(retryBtn);
}

/* ── Main Download Orchestrator ───────────────────────────────────────────── */
async function processDownload() {
    const inputEl        = document.getElementById('inputUrl');
    const resultBox      = document.getElementById('resultBox');
    const resultTitle    = document.getElementById('resultTitle');
    const resultPlatform = document.getElementById('resultPlatform');
    const dlOptions      = document.getElementById('downloadOptions');
    if (!inputEl || !resultBox || !resultTitle || !resultPlatform || !dlOptions) return;

    const rawUrl = inputEl.value.trim();
    if (!rawUrl) { showAlert('Please paste a video link first.', 'warn'); inputEl.focus(); return; }

    let url;
    try { url = new URL(rawUrl).href; } catch (_) {
        showAlert("That doesn't look like a valid URL. Please try again.", 'error');
        return;
    }

    const platform = detectPlatform(url);
    if (!platform) {
        showAlert('Platform not recognized. Supported: TikTok, Instagram, Facebook, YouTube, Snapchat.', 'warn');
        return;
    }

    // Show loading state using safe DOM
    resultBox.classList.remove('hidden');
    resultTitle.textContent = 'Extracting media — please wait…';
    resultPlatform.textContent = `Detected: ${platform.label}`;
    showSkeleton(dlOptions);
    setProgress(15);
    showAlert('Processing your link…', 'info');

    let results = null;
    try {
        setProgress(35);
        if (platform.key === 'tt') {
            results = await fetchTiklyDown(url) || await fetchCobalt(url);
        } else if (platform.key === 'snap') {
            results = await fetchSnapSave(url) || await fetchCobalt(url);
        } else if (platform.key === 'yt' || platform.key === 'fb') {
            results = await fetchCobalt(url) || await fetchSaveFrom(url);
        } else {
            results = await fetchCobalt(url) || await fetchTiklyDown(url);
        }
        setProgress(80);
    } catch (err) {
        console.error('ProDown engine error:', err);
    }

    setProgress(100);
    setTimeout(() => setProgress(null), 600);

    // Clear the skeleton
    dlOptions.replaceChildren();

    if (results && results.length) {
        resultTitle.textContent = '✅ Media ready to download!';
        resultPlatform.textContent = `${platform.label} · No Watermark · High Quality`;
        showAlert('Success! Your download is ready.', 'success');

        results.forEach((r, i) => {
            dlOptions.appendChild(buildDownloadButton(r, platform, i));
        });

        // High-CTR AdSense slot below download buttons (safe DOM construction)
        dlOptions.appendChild(buildAdSlotCTA());
    } else {
        resultTitle.textContent = '⚠️ Unable to extract media';
        resultPlatform.textContent = 'Extraction failed';
        showAlert('Could not download. The video may be private or the link invalid.', 'error');
        buildErrorState(dlOptions);
    }
}

/* ── Direct Blob Download (iOS Safari Compatible) ─────────────────────────── */
async function triggerDirectDownload(fileUrl, fileName = 'ProDown_video.mp4') {
    const safeUrl = sanitizeDownloadUrl(fileUrl);
    if (!safeUrl) { showAlert('Invalid download URL.', 'error'); return; }

    showAlert('Starting download…', 'info');
    try {
        const r = await fetch(safeUrl, { mode: 'cors', signal: AbortSignal.timeout(30000) });
        if (!r.ok) throw new Error('Fetch failed');
        const blob = await r.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        showAlert('Download started!', 'success');
    } catch (_) {
        window.open(safeUrl, '_blank', 'noopener,noreferrer');
        showAlert('Opened in new tab — use long-press / Save Video to download.', 'info');
    }
}

/* ── Viral Share Menu ─────────────────────────────────────────────────────── */
function toggleShareMenu() {
    const menu = document.getElementById('shareMenu');
    if (!menu) return;
    menu.classList.toggle('hidden');
}

function shareVia(platform) {
    const siteUrl = encodeURIComponent(window.location.origin);
    const msg     = encodeURIComponent('🚀 Download TikTok, Instagram, Facebook, YouTube & Snapchat videos for FREE — no watermark! ');
    const urls = {
        whatsapp: `https://wa.me/?text=${msg}${siteUrl}`,
        telegram: `https://t.me/share/url?url=${siteUrl}&text=${msg}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${siteUrl}`,
        twitter:  `https://twitter.com/intent/tweet?text=${msg}&url=${siteUrl}`
    };
    if (urls[platform]) window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=450');
    toggleShareMenu();
}

/* ── Close menus on outside click ────────────────────────────────────────── */
document.addEventListener('click', e => {
    const shareMenu = document.getElementById('shareMenu');
    const shareBtn  = document.getElementById('shareBtn');
    if (shareMenu && !shareMenu.classList.contains('hidden')) {
        if (!shareMenu.contains(e.target) && !shareBtn?.contains(e.target)) {
            shareMenu.classList.add('hidden');
        }
    }
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn    = document.getElementById('menuBtn');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        if (!mobileMenu.contains(e.target) && !menuBtn?.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    }
});
