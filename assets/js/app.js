/* ==========================================================================
   ProDown - Download Engine v2.2
   Multi-platform | Redirect-aware | XSS-safe DOM construction
   ========================================================================== */

/* ── Utility: Toast Alert ─────────────────────────────────────────────────── */
function showAlert(msg, type = 'info') {
    const toast = document.getElementById('alertToast');
    if (!toast) return;
    const colors = { info: 'bg-orange-500/90', success: 'bg-emerald-500/90', error: 'bg-red-500/90', warn: 'bg-amber-500/90' };
    const icons  = { info: 'fa-circle-info', success: 'fa-circle-check', error: 'fa-triangle-exclamation', warn: 'fa-triangle-exclamation' };
    toast.className = `fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-xs font-bold text-white shadow-2xl flex items-center gap-2 max-w-xs text-center ${colors[type] || colors.info}`;
    const icon = document.createElement('i');
    icon.className = `fa-solid ${icons[type] || 'fa-circle-info'}`;
    toast.replaceChildren(icon, document.createTextNode(' ' + msg));
    toast.classList.remove('hidden');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.add('hidden'), 4500);
}

/* ── Utility: Validate a download URL (must be https) ────────────────────── */
function sanitizeDownloadUrl(raw) {
    if (typeof raw !== 'string' || !raw.trim()) return null;
    try {
        const u = new URL(raw.trim());
        return u.protocol === 'https:' ? u.href : null;
    } catch (_) { return null; }
}

/* ── Utility: Strip HTML from display strings ────────────────────────────── */
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
        tt:   'Paste a TikTok or vt.tiktok.com link here…',
        ig:   'Paste an Instagram Reels or post link here…',
        fb:   'Paste a Facebook video or fb.watch link here…',
        yt:   'Paste a YouTube Shorts or youtu.be link here…',
        snap: 'Paste a Snapchat Spotlight link here…'
    };
    input.placeholder = placeholders[tab] || placeholders.all;
}

/* ── Auto-Paste & Keyboard ────────────────────────────────────────────────── */
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
        } catch (_) {}
    });
    input.addEventListener('keydown', e => { if (e.key === 'Enter') processDownload(); });

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // PWA Install prompt
    let deferredInstallPrompt = null;
    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        deferredInstallPrompt = e;
        const btn = document.getElementById('installPwaBtn');
        if (btn) btn.classList.remove('hidden');
    });
    window.addEventListener('appinstalled', () => {
        const btn = document.getElementById('installPwaBtn');
        if (btn) btn.classList.add('hidden');
        deferredInstallPrompt = null;
        showAlert('ProDown installed successfully!', 'success');
    });
    document.getElementById('installPwaBtn')?.addEventListener('click', async () => {
        if (!deferredInstallPrompt) return;
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        if (outcome === 'accepted') showAlert('Installing ProDown…', 'success');
    });
});

/* ── Detect Platform (includes short-link domains) ───────────────────────── */
function detectPlatform(url) {
    if (/tiktok\.com/i.test(url))                        return { key: 'tt',   label: 'TikTok' };
    if (/instagram\.com/i.test(url))                     return { key: 'ig',   label: 'Instagram' };
    if (/(facebook\.com|fb\.watch)/i.test(url))          return { key: 'fb',   label: 'Facebook' };
    if (/(youtube\.com|youtu\.be)/i.test(url))           return { key: 'yt',   label: 'YouTube' };
    if (/snapchat\.com/i.test(url))                      return { key: 'snap', label: 'Snapchat' };
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

/* ══════════════════════════════════════════════════════════════════════════
   DOWNLOAD ENGINES
   Each engine must return: Array<{ url, label, quality, type }> | null
   All URL values are validated via sanitizeDownloadUrl before returning.
   ══════════════════════════════════════════════════════════════════════════ */

// ── Engine: TikWM (TikTok — handles vt.tiktok.com shortened links) ─────────
async function fetchTikWM(url) {
    try {
        const body = new URLSearchParams({ url, hd: '1' });
        const r = await fetch('https://www.tikwm.com/api/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
            signal: AbortSignal.timeout(10000)
        });
        if (!r.ok) return null;
        const d = await r.json();
        if (d?.code !== 0 || !d?.data) return null;
        const results = [];
        const hd   = sanitizeDownloadUrl(d.data.hdplay);
        const sd   = sanitizeDownloadUrl(d.data.play);
        const wmv  = sanitizeDownloadUrl(d.data.wmplay);
        const mp3  = sanitizeDownloadUrl(d.data.music);
        if (hd)  results.push({ url: hd,  label: 'Download HD (No Watermark)', quality: 'HD',  type: 'video' });
        else if (sd) results.push({ url: sd, label: 'Download Video (No Watermark)', quality: 'SD', type: 'video' });
        if (mp3) results.push({ url: mp3, label: 'Download MP3 Audio',          quality: 'MP3', type: 'audio' });
        return results.length ? results : null;
    } catch (_) { return null; }
}

// ── Engine: TiklyDown (TikTok fallback) ───────────────────────────────────
async function fetchTiklyDown(url) {
    const endpoints = [
        `https://api.tiklydown.eu.org/api/download/v2?url=${encodeURIComponent(url)}`,
        `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`
    ];
    for (const ep of endpoints) {
        try {
            const r = await fetch(ep, { signal: AbortSignal.timeout(8000) });
            if (!r.ok) continue;
            const d = await r.json();
            const noWm = sanitizeDownloadUrl(d?.video?.noWatermark || d?.data?.play);
            const wm   = sanitizeDownloadUrl(d?.video?.watermark);
            if (noWm) return [{ url: noWm, label: 'Download HD (No Watermark)', quality: 'HD', type: 'video' }];
            if (wm)   return [{ url: wm,   label: 'Download Video',             quality: 'SD', type: 'video' }];
        } catch (_) {}
    }
    return null;
}

// ── Engine: Cobalt (all platforms — tries multiple public instances) ────────
async function fetchCobalt(url) {
    const instances = [
        'https://api.cobalt.tools/',
        'https://cobalt.api.timelessnesses.me/',
        'https://co.wuk.sh/api/json'
    ];
    for (const ep of instances) {
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
        } catch (_) {}
    }
    return null;
}

// ── Engine: InstaFinsta (Instagram fallback) ───────────────────────────────
async function fetchInstaFinsta(url) {
    try {
        const api = `https://instafinsta.com/api/download?url=${encodeURIComponent(url)}`;
        const r = await fetch(api, { signal: AbortSignal.timeout(8000) });
        if (!r.ok) return null;
        const d = await r.json();
        const dlUrl = sanitizeDownloadUrl(d?.data?.url || d?.url);
        return dlUrl ? [{ url: dlUrl, label: 'Download Reel', quality: 'HD', type: 'video' }] : null;
    } catch (_) { return null; }
}

// ── Engine: SaveFrom (YouTube / Facebook fallback) ─────────────────────────
async function fetchSaveFrom(url) {
    try {
        const r = await fetch(`https://worker.saveform.net/api/info?url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(8000) });
        if (!r.ok) return null;
        const d = await r.json();
        const dlUrl = sanitizeDownloadUrl(d?.url?.[0]?.url);
        if (!dlUrl) return null;
        const ext  = sanitizeText(d.url[0].ext,     8).toUpperCase() || 'Video';
        const qual = sanitizeText(d.url[0].quality, 8) || 'HD';
        return [{ url: dlUrl, label: `Download ${ext}`, quality: qual, type: 'video' }];
    } catch (_) { return null; }
}

// ── Engine: SnapSave (Snapchat) ────────────────────────────────────────────
async function fetchSnapSave(url) {
    try {
        const r = await fetch(`https://snapsave.app/action.php?lang=en&url=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(8000) });
        if (!r.ok) return null;
        const text = await r.text();
        const match = text.match(/href="(https:\/\/[^"]+\.mp4[^"]*?)"/i);
        const dlUrl = match ? sanitizeDownloadUrl(match[1]) : null;
        return dlUrl ? [{ url: dlUrl, label: 'Download Spotlight', quality: 'HD', type: 'video' }] : null;
    } catch (_) { return null; }
}

/* ── URL Redirect Resolver (handles vt.tiktok.com, youtu.be, fb.watch etc.) */
async function resolveRedirect(url) {
    // Use allorigins as a CORS-safe redirect resolver
    try {
        const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const r = await fetch(proxy, { signal: AbortSignal.timeout(6000) });
        if (!r.ok) return url;
        const d = await r.json();
        // allorigins returns the final URL in the status.url field
        const finalUrl = d?.status?.url;
        if (finalUrl && finalUrl !== url) {
            const safe = sanitizeDownloadUrl(finalUrl);
            return safe || url;
        }
    } catch (_) {}
    return url;
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

    // Show loading state
    resultBox.classList.remove('hidden');
    resultTitle.textContent = 'Detecting platform…';
    resultPlatform.textContent = 'ProDown Extraction Engine';
    showSkeleton(dlOptions);
    setProgress(10);
    showAlert('Processing your link…', 'info');

    // Step 1: Resolve redirects (handles vt.tiktok.com, fb.watch, youtu.be, etc.)
    resultTitle.textContent = 'Resolving link…';
    setProgress(20);
    const resolvedUrl = await resolveRedirect(url);
    const workingUrl  = resolvedUrl || url;

    const platform = detectPlatform(workingUrl) || detectPlatform(url);
    if (!platform) {
        setProgress(null);
        resultTitle.textContent = '⚠️ Platform not recognized';
        resultPlatform.textContent = 'Unsupported link';
        dlOptions.replaceChildren();
        buildErrorState(dlOptions, 'Platform not recognized. Supported: TikTok, Instagram, Facebook, YouTube, Snapchat.');
        showAlert('Platform not supported. Check the link and try again.', 'warn');
        return;
    }

    resultTitle.textContent = `Extracting from ${platform.label}…`;
    resultPlatform.textContent = `Detected: ${platform.label}`;
    setProgress(40);

    let results = null;
    try {
        if (platform.key === 'tt') {
            // TikTok: TikWM first (best shortened URL support), then TiklyDown, then Cobalt
            results = await fetchTikWM(workingUrl)
                   || await fetchTiklyDown(workingUrl)
                   || await fetchCobalt(workingUrl);
        } else if (platform.key === 'snap') {
            results = await fetchSnapSave(workingUrl) || await fetchCobalt(workingUrl);
        } else if (platform.key === 'yt') {
            results = await fetchCobalt(workingUrl) || await fetchSaveFrom(workingUrl);
        } else if (platform.key === 'fb') {
            results = await fetchCobalt(workingUrl) || await fetchSaveFrom(workingUrl);
        } else {
            // Instagram
            results = await fetchCobalt(workingUrl)
                   || await fetchInstaFinsta(workingUrl);
        }
        setProgress(85);
    } catch (err) {
        console.error('ProDown engine error:', err);
    }

    setProgress(100);
    setTimeout(() => setProgress(null), 600);
    dlOptions.replaceChildren();

    if (results && results.length) {
        resultTitle.textContent = '✅ Media ready to download!';
        resultPlatform.textContent = `${platform.label} · No Watermark · High Quality`;
        showAlert('Success! Your download is ready.', 'success');
        results.forEach((r, i) => dlOptions.appendChild(buildDownloadButton(r, platform, i)));
        dlOptions.appendChild(buildAdSlotCTA());
    } else {
        resultTitle.textContent = '⚠️ Unable to extract media';
        resultPlatform.textContent = 'All engines failed';
        showAlert('Could not download. The video may be private or temporarily unavailable.', 'error');
        buildErrorState(dlOptions);
    }
}

/* ── Safe DOM: Build a Download Button ───────────────────────────────────── */
function buildDownloadButton(result, platform, index) {
    const isAudio  = result.type === 'audio';
    const fileName = `ProDown_${platform.label}_${Date.now()}${isAudio ? '.mp3' : '.mp4'}`;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = isAudio
        ? 'w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold p-3.5 rounded-xl flex justify-between items-center transition-all shadow-lg orange-glow-btn'
        : 'w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold p-3.5 rounded-xl flex justify-between items-center transition-all shadow-lg orange-glow-btn';
    btn.dataset.dlUrl  = result.url;
    btn.dataset.dlName = fileName;
    btn.addEventListener('click', () => triggerDirectDownload(btn.dataset.dlUrl, btn.dataset.dlName));

    const left = document.createElement('div');
    left.className = 'flex items-center gap-2';
    const icon = document.createElement('i');
    icon.className = `fa-solid ${isAudio ? 'fa-music' : 'fa-cloud-arrow-down'} text-base`;
    const labelSpan = document.createElement('span');
    labelSpan.textContent = sanitizeText(result.label, 60);
    left.appendChild(icon);
    left.appendChild(labelSpan);

    const badge = document.createElement('span');
    badge.className = 'text-[10px] bg-black/30 px-2.5 py-1 rounded-xl';
    badge.textContent = sanitizeText(result.quality, 10);

    btn.appendChild(left);
    btn.appendChild(badge);
    return btn;
}

/* ── Safe DOM: Build CTA Ad Slot ─────────────────────────────────────────── */
function buildAdSlotCTA() {
    const wrap = document.createElement('div');
    wrap.className = 'ad-slot ad-slot-cta mt-3';
    wrap.id = 'adSlotCTA';
    const label = document.createElement('span');
    label.textContent = 'Advertisement';
    wrap.appendChild(label);
    return wrap;
}

/* ── Safe DOM: Build Error / Retry State ─────────────────────────────────── */
function buildErrorState(container, customMsg) {
    const msg = document.createElement('p');
    msg.className = 'text-slate-400 text-xs text-center py-2 leading-relaxed';
    msg.textContent = customMsg || 'Make sure the video is public and the link is correct, then try again. Private videos and DRM-protected content cannot be downloaded.';
    container.appendChild(msg);

    const retryBtn = document.createElement('button');
    retryBtn.type = 'button';
    retryBtn.className = 'w-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold p-3 rounded-xl text-xs transition-all mt-1';
    retryBtn.addEventListener('click', () => {
        const inputEl   = document.getElementById('inputUrl');
        const resultBox = document.getElementById('resultBox');
        if (inputEl)   inputEl.value = '';
        if (resultBox) resultBox.classList.add('hidden');
        if (inputEl)   inputEl.focus();
    });
    const retryIcon = document.createElement('i');
    retryIcon.className = 'fa-solid fa-rotate-left mr-2';
    retryBtn.appendChild(retryIcon);
    retryBtn.appendChild(document.createTextNode('Try Another Link'));
    container.appendChild(retryBtn);
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
    if (menu) menu.classList.toggle('hidden');
}

function shareVia(platform) {
    const siteUrl = encodeURIComponent(window.location.origin);
    const msg     = encodeURIComponent('🚀 Download TikTok, Instagram, Facebook, YouTube & Snapchat videos FREE — no watermark! ');
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
        if (!shareMenu.contains(e.target) && !shareBtn?.contains(e.target)) shareMenu.classList.add('hidden');
    }
    const mobileMenu = document.getElementById('mobileMenu');
    const menuBtn    = document.getElementById('menuBtn');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        if (!mobileMenu.contains(e.target) && !menuBtn?.contains(e.target)) mobileMenu.classList.add('hidden');
    }
});
