/* ==========================================================================
   ProDown - Download Engine v2.3
   Parallel Racing | Auto-Detect | History | Watermark Toggle | XSS-safe DOM
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

/* ── Detect Platform (includes short-link domains) ───────────────────────── */
function detectPlatform(url) {
    if (/tiktok\.com|vt\.tiktok\.com/i.test(url))            return { key: 'tt',   label: 'TikTok' };
    if (/instagram\.com/i.test(url))                          return { key: 'ig',   label: 'Instagram' };
    if (/(facebook\.com|fb\.watch)/i.test(url))               return { key: 'fb',   label: 'Facebook' };
    if (/(youtube\.com|youtu\.be)/i.test(url))                return { key: 'yt',   label: 'YouTube' };
    if (/snapchat\.com/i.test(url))                           return { key: 'snap', label: 'Snapchat' };
    return null;
}

/* ── DOMContentLoaded Setup ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('inputUrl');

    // ── Priority 3: Auto Platform Detection on input ─────────────────────
    if (input) {
        input.addEventListener('input', () => {
            const val = input.value.trim();
            if (!val) return;
            const p = detectPlatform(val);
            if (p) selectTab(p.key);
        });

        // Auto-paste from clipboard on focus
        input.addEventListener('focus', async () => {
            try {
                const text = await navigator.clipboard.readText();
                if (text && !input.value && /https?:\/\//i.test(text)) {
                    input.value = text;
                    showAlert('Link pasted from clipboard!', 'info');
                    const p = detectPlatform(text);
                    if (p) selectTab(p.key);
                }
            } catch (_) {}
        });

        input.addEventListener('keydown', e => { if (e.key === 'Enter') processDownload(); });
    }

    // ── Service Worker (PWA) ─────────────────────────────────────────────
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // ── PWA Install Prompt ───────────────────────────────────────────────
    let deferredInstallPrompt = null;
    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        deferredInstallPrompt = e;
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

    // ── Priority 4: Render history on load ───────────────────────────────
    renderHistory();
});

/* ══════════════════════════════════════════════════════════════════════════
   PRIORITY 2 — PARALLEL ENGINE RACING
   raceEngines() fires all engines simultaneously.
   Each engine has its own timeout wrapper.
   Returns the first non-null result, or null if all fail / timeout.
   ══════════════════════════════════════════════════════════════════════════ */
async function raceEngines(engineFns, timeoutMs = 3000) {
    return new Promise(resolve => {
        let settled = false;
        let remaining = engineFns.length;
        if (remaining === 0) { resolve(null); return; }

        engineFns.forEach(fn => {
            // Wrap each engine with a hard timeout
            const timedFn = Promise.race([
                fn(),
                new Promise(r => setTimeout(() => r(null), timeoutMs))
            ]);
            timedFn
                .then(result => {
                    remaining--;
                    if (!settled && result && result.length) {
                        settled = true;
                        resolve(result);
                    } else if (remaining === 0 && !settled) {
                        settled = true;
                        resolve(null);
                    }
                })
                .catch(() => {
                    remaining--;
                    if (remaining === 0 && !settled) { settled = true; resolve(null); }
                });
        });
    });
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
   Each engine must return: Array<{ url, label, quality, type, wmUrl?, thumb? }> | null
   All URL values are validated via sanitizeDownloadUrl before returning.
   ══════════════════════════════════════════════════════════════════════════ */

// ── Engine: TikWM (TikTok — returns HD, SD, WM variant, and thumbnail) ─────
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
        const wmv  = sanitizeDownloadUrl(d.data.wmplay);  // watermarked version
        const mp3  = sanitizeDownloadUrl(d.data.music);
        const thumb = sanitizeDownloadUrl(d.data.cover || d.data.origin_cover);
        const videoUrl = hd || sd;
        if (videoUrl) {
            results.push({
                url:   videoUrl,
                label: 'Download HD (No Watermark)',
                quality: hd ? 'HD' : 'SD',
                type:  'video',
                wmUrl: wmv || null,   // Priority 5: expose watermarked URL
                thumb: thumb || null
            });
        }
        if (mp3) results.push({ url: mp3, label: 'Download MP3 Audio', quality: 'MP3', type: 'audio', thumb });
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
            if (noWm) return [{ url: noWm, label: 'Download HD (No Watermark)', quality: 'HD', type: 'video', wmUrl: wm || null }];
            if (wm)   return [{ url: wm,   label: 'Download Video', quality: 'SD', type: 'video' }];
        } catch (_) {}
    }
    return null;
}

/* ── CORS Proxy helper — wraps a URL through available proxies ──────────── */
async function fetchViaProxy(targetUrl, timeoutMs = 10000) {
    const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
        `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    ];
    for (const p of proxies) {
        try {
            const r = await fetch(p, { signal: AbortSignal.timeout(timeoutMs) });
            if (!r.ok) continue;
            const ct = r.headers.get('content-type') || '';
            if (ct.includes('application/json')) {
                const d = await r.json();
                // allorigins wraps in { contents, status }; corsproxy returns raw
                return d?.contents !== undefined ? d.contents : JSON.stringify(d);
            }
            return await r.text();
        } catch (_) {}
    }
    return null;
}

/* ── Parse raw content — tries JSON then returns string ─────────────────── */
function tryParseJson(raw) {
    if (typeof raw !== 'string') return raw;
    try { return JSON.parse(raw); } catch (_) { return null; }
}

// ── Engine: Cobalt v7+ (all platforms — fixed API format) ─────────────────
async function fetchCobalt(url) {
    const instances = [
        'https://api.cobalt.tools/',
        'https://cobalt.api.timelessnesses.me/',
        'https://cobalt-api.kkili.com/',
        'https://cobalt.api.lostdomain.org/',
    ];
    const body = JSON.stringify({
        url,
        videoQuality:  '1080',   // v7+ requires numeric string, not 'max'
        downloadMode:  'auto',   // required in v7+
        filenameStyle: 'pretty',
        audioFormat:   'best',
        tiktokH265:    false,
        twitterGif:    false,
    });
    for (const ep of instances) {
        try {
            const r = await fetch(ep, {
                method:  'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body,
                signal:  AbortSignal.timeout(12000)
            });
            if (!r.ok) continue;
            const d = await r.json();
            // v7+ always has d.status; skip errors
            if (!d || d.status === 'error' || d.error) continue;
            const results = [];
            // status: redirect | tunnel | stream → d.url is the media URL
            const videoUrl = sanitizeDownloadUrl(d.url);
            if (videoUrl) results.push({ url: videoUrl, label: 'Download HD Video', quality: '1080p', type: 'video' });
            const audioUrl = sanitizeDownloadUrl(d.audio);
            if (audioUrl) results.push({ url: audioUrl, label: 'Download MP3 Audio', quality: 'MP3', type: 'audio' });
            // status: picker → d.picker[] (carousel / multi-image posts)
            if (Array.isArray(d.picker)) {
                d.picker.slice(0, 6).forEach((p, i) => {
                    const pUrl = sanitizeDownloadUrl(p?.url);
                    if (pUrl) results.push({
                        url: pUrl,
                        label: `Download ${p.type === 'photo' ? 'Photo' : 'Video'} ${i + 1}`,
                        quality: 'HD',
                        type: 'video'
                    });
                });
            }
            if (results.length) return results;
        } catch (_) {}
    }
    return null;
}

// ── Engine: SnapInst (Instagram — dedicated API, via proxy) ───────────────
async function fetchSnapInst(url) {
    try {
        const raw = await fetchViaProxy(
            `https://snapinst.app/api/?url=${encodeURIComponent(url)}&lang=en`, 11000
        );
        if (!raw) return null;
        const d = tryParseJson(raw);
        if (!d) return null;
        const results = [];
        const items = Array.isArray(d) ? d
            : Array.isArray(d?.data) ? d.data
            : d?.url ? [d] : [];
        items.slice(0, 6).forEach((item, i) => {
            const dlUrl = sanitizeDownloadUrl(item?.url || item?.download_url || item?.link);
            if (dlUrl) results.push({
                url: dlUrl, label: i === 0 ? 'Download Reel HD' : `Download Item ${i + 1}`,
                quality: 'HD', type: item?.type === 'image' ? 'video' : 'video'
            });
        });
        if (!results.length) {
            const single = sanitizeDownloadUrl(d?.url || d?.link);
            if (single) results.push({ url: single, label: 'Download Reel', quality: 'HD', type: 'video' });
        }
        return results.length ? results : null;
    } catch (_) { return null; }
}

// ── Engine: IgramWorld (Instagram fallback) ────────────────────────────────
async function fetchIgram(url) {
    try {
        const raw = await fetchViaProxy(
            `https://igram.world/api/convert?url=${encodeURIComponent(url)}`, 11000
        );
        if (!raw) return null;
        const d = tryParseJson(raw);
        if (!d) return null;
        const results = [];
        const items = Array.isArray(d) ? d : (d?.media ? d.media : []);
        items.slice(0, 4).forEach((item, i) => {
            const dlUrl = sanitizeDownloadUrl(item?.url || item?.src);
            if (dlUrl) results.push({ url: dlUrl, label: `Download ${i === 0 ? 'Reel' : 'Item ' + (i + 1)}`, quality: item?.quality || 'HD', type: 'video' });
        });
        if (!results.length) {
            const solo = sanitizeDownloadUrl(d?.url || d?.download_url);
            if (solo) results.push({ url: solo, label: 'Download Reel', quality: 'HD', type: 'video' });
        }
        return results.length ? results : null;
    } catch (_) { return null; }
}

// ── Engine: FbSave (Facebook — dedicated fallback) ─────────────────────────
async function fetchFbSave(url) {
    // fdown.net accepts a POST with the Facebook URL and returns JSON with hd/sd links
    try {
        const formData = `URLz=${encodeURIComponent(url)}`;
        const raw = await fetchViaProxy(
            `https://fdown.net/download.php?${formData}`, 11000
        );
        if (!raw) return null;
        const d = tryParseJson(raw);
        if (!d) {
            // Might return HTML — look for MP4 hrefs
            const m = String(raw).match(/href="(https:\/\/[^"]+\.mp4[^"]*?)"/i);
            if (m) {
                const u = sanitizeDownloadUrl(m[1]);
                if (u) return [{ url: u, label: 'Download Facebook Video', quality: 'HD', type: 'video' }];
            }
            return null;
        }
        const results = [];
        const hd = sanitizeDownloadUrl(d?.hd || d?.hd_url || d?.hd_link);
        const sd = sanitizeDownloadUrl(d?.sd || d?.sd_url || d?.sd_link || d?.url);
        if (hd) results.push({ url: hd, label: 'Download HD Video', quality: 'HD', type: 'video' });
        if (sd) results.push({ url: sd, label: 'Download SD Video', quality: 'SD', type: 'video' });
        return results.length ? results : null;
    } catch (_) { return null; }
}

// ── Engine: GetFVid (Facebook fallback #2) ─────────────────────────────────
async function fetchGetFVid(url) {
    try {
        const raw = await fetchViaProxy(
            `https://getfvid.com/downloader?url=${encodeURIComponent(url)}`, 11000
        );
        if (!raw) return null;
        // HTML response — scan for mp4 hrefs
        const text = String(raw);
        const hdMatch = text.match(/href="(https:\/\/[^"]+)"[^>]*>.*?HD/i);
        const sdMatch = text.match(/href="(https:\/\/[^"]+)"[^>]*>.*?SD/i);
        const anyMatch = text.match(/href="(https:\/\/[^"]+\.mp4[^"]*?)"/i);
        const results = [];
        const hd = hdMatch ? sanitizeDownloadUrl(hdMatch[1]) : null;
        const sd = sdMatch ? sanitizeDownloadUrl(sdMatch[1]) : null;
        const any = anyMatch ? sanitizeDownloadUrl(anyMatch[1]) : null;
        if (hd) results.push({ url: hd, label: 'Download HD Video', quality: 'HD', type: 'video' });
        if (sd && sd !== hd) results.push({ url: sd, label: 'Download SD Video', quality: 'SD', type: 'video' });
        if (!results.length && any) results.push({ url: any, label: 'Download Video', quality: 'HD', type: 'video' });
        return results.length ? results : null;
    } catch (_) { return null; }
}

// ── Engine: YtLoader (YouTube fallback — loader.to API) ───────────────────
async function fetchYtLoader(url) {
    try {
        const raw = await fetchViaProxy(
            `https://loader.to/api/button/?url=${encodeURIComponent(url)}&f=mp4`, 11000
        );
        if (!raw) return null;
        const d = tryParseJson(raw);
        if (!d) return null;
        const dlUrl = sanitizeDownloadUrl(d?.url || d?.download_url || d?.link);
        return dlUrl ? [{ url: dlUrl, label: 'Download YouTube Video MP4', quality: '720p', type: 'video' }] : null;
    } catch (_) { return null; }
}

// ── Engine: YtMate (YouTube fallback — y2mate API) ─────────────────────────
async function fetchYtMate(url) {
    // y2mate uses a 2-step flow: analyse → download link
    try {
        const step1Raw = await fetchViaProxy(
            `https://www.y2mate.guru/api/ajaxSearch?url=${encodeURIComponent(url)}&q_auto=0&ajax=1`, 11000
        );
        if (!step1Raw) return null;
        const step1 = tryParseJson(step1Raw);
        if (!step1 || !step1.vid) return null;
        const vid = sanitizeText(step1.vid, 20);
        const step2Raw = await fetchViaProxy(
            `https://www.y2mate.guru/api/ajaxConvert?vid=${vid}&type=mp4&quality=720`, 11000
        );
        if (!step2Raw) return null;
        const step2 = tryParseJson(step2Raw);
        const dlUrl = sanitizeDownloadUrl(step2?.dlink || step2?.url);
        return dlUrl ? [{ url: dlUrl, label: 'Download YouTube Video 720p', quality: '720p', type: 'video' }] : null;
    } catch (_) { return null; }
}

// ── Engine: SnapSave (Snapchat — direct + proxy + multi-pattern parser) ────
async function fetchSnapSave(url) {
    const apiUrl = `https://snapsave.app/action.php?lang=en&url=${encodeURIComponent(url)}`;
    let text = null;

    // Try direct first (sometimes CORS works for this endpoint)
    try {
        const r = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) });
        if (r.ok) text = await r.text();
    } catch (_) {}

    // Fallback: route through CORS proxy
    if (!text) {
        text = await fetchViaProxy(apiUrl, 11000);
    }

    if (!text || typeof text !== 'string') return null;

    // Multiple regex patterns covering different response shapes
    const patterns = [
        /href=["'](https:\/\/[^"']+\.mp4[^"']*?)["']/gi,
        /src=["'](https:\/\/[^"']+\.mp4[^"']*?)["']/gi,
        /"url"\s*:\s*["'](https:\/\/[^"']+)["']/gi,
        /"download"\s*:\s*["'](https:\/\/[^"']+)["']/gi,
    ];
    for (const pat of patterns) {
        const matches = [...text.matchAll(pat)];
        if (matches.length) {
            const dlUrl = sanitizeDownloadUrl(matches[0][1]);
            if (dlUrl) return [{ url: dlUrl, label: 'Download Spotlight', quality: 'HD', type: 'video' }];
        }
    }
    return null;
}

// ── Engine: SnapDownloader (Snapchat fallback) ─────────────────────────────
async function fetchSnapDownloader(url) {
    try {
        const raw = await fetchViaProxy(
            `https://snapdownloader.app/api/download?url=${encodeURIComponent(url)}`, 11000
        );
        if (!raw) return null;
        const d = tryParseJson(raw);
        if (!d) return null;
        const dlUrl = sanitizeDownloadUrl(d?.url || d?.download || d?.link);
        return dlUrl ? [{ url: dlUrl, label: 'Download Snap Video', quality: 'HD', type: 'video' }] : null;
    } catch (_) { return null; }
}

/* ── URL Redirect Resolver (handles vt.tiktok.com, youtu.be, fb.watch etc.) */
async function resolveRedirect(url) {
    const proxies = [
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        `https://corsproxy.io/?${encodeURIComponent(url)}`
    ];
    for (const proxy of proxies) {
        try {
            const r = await fetch(proxy, { signal: AbortSignal.timeout(5000) });
            if (!r.ok) continue;
            const d = await r.json();
            const finalUrl = d?.status?.url || d?.url;
            if (finalUrl && finalUrl !== url) {
                const safe = sanitizeDownloadUrl(finalUrl);
                if (safe) return safe;
            }
        } catch (_) {}
    }
    return url;
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN DOWNLOAD ORCHESTRATOR — uses raceEngines() for parallel execution
   ══════════════════════════════════════════════════════════════════════════ */
let _isDownloading = false; // guard against double-clicks

async function processDownload() {
    if (_isDownloading) return;
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

    _isDownloading = true;
    resultBox.classList.remove('hidden');
    resultTitle.textContent = 'Detecting platform…';
    resultPlatform.textContent = 'ProDown Extraction Engine';
    showSkeleton(dlOptions);
    setProgress(10);
    showAlert('Processing your link…', 'info');

    // Resolve redirects (handles vt.tiktok.com, fb.watch, youtu.be etc.)
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
        _isDownloading = false;
        return;
    }

    resultTitle.textContent = `Extracting from ${platform.label}…`;
    resultPlatform.textContent = `Racing engines for ${platform.label}…`;
    setProgress(40);

    let results = null;
    try {
        // ── Parallel Engine Racing — all engines fire simultaneously ─────
        // Timeout raised to 8 s so proxy-wrapped engines have time to respond.
        if (platform.key === 'tt') {
            results = await raceEngines([
                () => fetchTikWM(workingUrl),
                () => fetchTiklyDown(workingUrl),
                () => fetchCobalt(workingUrl),
            ], 8000);
        } else if (platform.key === 'ig') {
            // Instagram: Cobalt (carousel-aware) + SnapInst + IgramWorld
            results = await raceEngines([
                () => fetchCobalt(workingUrl),
                () => fetchSnapInst(workingUrl),
                () => fetchIgram(workingUrl),
            ], 8000);
        } else if (platform.key === 'fb') {
            // Facebook: Cobalt + fdown.net + getfvid.com
            results = await raceEngines([
                () => fetchCobalt(workingUrl),
                () => fetchFbSave(workingUrl),
                () => fetchGetFVid(workingUrl),
            ], 8000);
        } else if (platform.key === 'yt') {
            // YouTube: Cobalt + loader.to + y2mate
            results = await raceEngines([
                () => fetchCobalt(workingUrl),
                () => fetchYtLoader(workingUrl),
                () => fetchYtMate(workingUrl),
            ], 8000);
        } else if (platform.key === 'snap') {
            // Snapchat: SnapSave (direct+proxy) + snapdownloader + Cobalt
            results = await raceEngines([
                () => fetchSnapSave(workingUrl),
                () => fetchSnapDownloader(workingUrl),
                () => fetchCobalt(workingUrl),
            ], 8000);
        }
        setProgress(85);
    } catch (err) {
        console.error('ProDown engine error:', err);
    }

    setProgress(100);
    setTimeout(() => setProgress(null), 600);
    dlOptions.replaceChildren();
    _isDownloading = false;

    if (results && results.length) {
        resultTitle.textContent = '✅ Media ready to download!';
        resultPlatform.textContent = `${platform.label} · No Watermark · High Quality`;
        showAlert('Success! Your download is ready.', 'success');

        // ── Priority 5: Watermark Toggle — inject above first video result ─
        const firstVideo = results.find(r => r.type === 'video');
        if (firstVideo && firstVideo.wmUrl) {
            const toggleEl = buildWatermarkToggle(firstVideo);
            dlOptions.appendChild(toggleEl);
        }

        results.forEach((r, i) => dlOptions.appendChild(buildDownloadButton(r, platform, i)));
        dlOptions.appendChild(buildAdSlotCTA());

        // ── Priority 4: Save to history ───────────────────────────────────
        const thumb = results.find(r => r.thumb)?.thumb || null;
        saveToHistory({ url: workingUrl, platform: platform.label, platformKey: platform.key, thumb, timestamp: Date.now() });
        renderHistory();

    } else {
        resultTitle.textContent = '⚠️ Unable to extract media';
        resultPlatform.textContent = 'All engines failed';
        showAlert('Could not download. The video may be private or temporarily unavailable.', 'error');
        buildErrorState(dlOptions);
    }
}

/* ══════════════════════════════════════════════════════════════════════════
   PRIORITY 5 — WATERMARK TOGGLE
   Builds a pill toggle above the main download button.
   Switches the button URL between no-watermark (clean) and watermarked.
   ══════════════════════════════════════════════════════════════════════════ */
function buildWatermarkToggle(videoResult) {
    const wrap = document.createElement('div');
    wrap.className = 'flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-[10px]';

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-droplet text-orange-400 flex-shrink-0';

    const lbl = document.createElement('span');
    lbl.className = 'text-slate-400 font-semibold flex-1';
    lbl.textContent = 'TikTok Watermark:';

    const pill = document.createElement('div');
    pill.className = 'flex items-center bg-white/5 rounded-lg p-0.5 gap-0.5';

    const noWmBtn = document.createElement('button');
    noWmBtn.type = 'button';
    noWmBtn.className = 'px-3 py-1 rounded-md text-[10px] font-bold transition-all bg-orange-500 text-white';
    noWmBtn.textContent = 'Off ✓';

    const wmBtn = document.createElement('button');
    wmBtn.type = 'button';
    wmBtn.className = 'px-3 py-1 rounded-md text-[10px] font-bold transition-all text-slate-400 hover:text-white';
    wmBtn.textContent = 'On';

    let wmMode = false;
    const update = () => {
        // Update the download button that follows this toggle
        const dlBtn = wrap.nextElementSibling;
        if (dlBtn) {
            dlBtn.dataset.dlUrl = wmMode ? videoResult.wmUrl : videoResult.url;
            const sp = dlBtn.querySelector('span');
            if (sp) sp.textContent = wmMode ? 'Download Video (With Watermark)' : sanitizeText(videoResult.label, 60);
        }
        if (wmMode) {
            wmBtn.className   = 'px-3 py-1 rounded-md text-[10px] font-bold transition-all bg-slate-600 text-white';
            noWmBtn.className = 'px-3 py-1 rounded-md text-[10px] font-bold transition-all text-slate-400 hover:text-white';
        } else {
            noWmBtn.className = 'px-3 py-1 rounded-md text-[10px] font-bold transition-all bg-orange-500 text-white';
            wmBtn.className   = 'px-3 py-1 rounded-md text-[10px] font-bold transition-all text-slate-400 hover:text-white';
        }
    };

    noWmBtn.addEventListener('click', () => { wmMode = false; update(); });
    wmBtn.addEventListener('click',   () => { wmMode = true;  update(); });

    pill.appendChild(noWmBtn);
    pill.appendChild(wmBtn);
    wrap.appendChild(icon);
    wrap.appendChild(lbl);
    wrap.appendChild(pill);
    return wrap;
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
    msg.textContent = customMsg || 'Make sure the video is public and the link is correct. Private videos and DRM-protected content cannot be downloaded.';
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

/* ══════════════════════════════════════════════════════════════════════════
   PRIORITY 4 — DOWNLOAD HISTORY (localStorage)
   Stores last 10 downloads: { url, platform, platformKey, thumb, timestamp }
   ══════════════════════════════════════════════════════════════════════════ */
const HISTORY_KEY = 'prodown_history';
const HISTORY_MAX = 10;

function saveToHistory(entry) {
    let history = loadHistory();
    // Remove duplicate URLs
    history = history.filter(h => h.url !== entry.url);
    history.unshift(entry);
    history = history.slice(0, HISTORY_MAX);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch (_) {}
}

function loadHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
}

function clearHistory() {
    try { localStorage.removeItem(HISTORY_KEY); } catch (_) {}
    renderHistory();
    showAlert('History cleared.', 'info');
}

function reDownload(url) {
    const input = document.getElementById('inputUrl');
    if (!input) return;
    input.value = url;
    const p = detectPlatform(url);
    if (p) selectTab(p.key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    processDownload();
}

function renderHistory() {
    const section  = document.getElementById('historySection');
    const list     = document.getElementById('historyList');
    if (!section || !list) return;

    const history = loadHistory();
    if (!history.length) { section.classList.add('hidden'); return; }
    section.classList.remove('hidden');
    list.replaceChildren();

    const platformIcons = {
        tt:   { icon: 'fa-brands fa-tiktok',    color: 'text-white' },
        ig:   { icon: 'fa-brands fa-instagram', color: 'text-pink-500' },
        fb:   { icon: 'fa-brands fa-facebook',  color: 'text-blue-500' },
        yt:   { icon: 'fa-brands fa-youtube',   color: 'text-red-500' },
        snap: { icon: 'fa-brands fa-snapchat',  color: 'text-yellow-400' }
    };

    history.forEach(item => {
        const card = document.createElement('div');
        card.className = 'flex items-center gap-3 glass-card p-3 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-all';

        // Thumbnail or platform icon
        const thumbWrap = document.createElement('div');
        thumbWrap.className = 'w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden';
        if (item.thumb) {
            const img = document.createElement('img');
            img.src = item.thumb;
            img.alt = item.platform;
            img.className = 'w-full h-full object-cover';
            img.onerror = () => { thumbWrap.replaceChildren(buildPlatformIcon(item.platformKey, platformIcons)); };
            thumbWrap.appendChild(img);
        } else {
            thumbWrap.appendChild(buildPlatformIcon(item.platformKey, platformIcons));
        }

        // Info
        const info = document.createElement('div');
        info.className = 'flex-1 min-w-0';
        const pName = document.createElement('p');
        pName.className = 'text-[10px] font-black text-orange-400 uppercase tracking-wider';
        pName.textContent = sanitizeText(item.platform, 20);
        const urlSpan = document.createElement('p');
        urlSpan.className = 'text-[10px] text-slate-400 truncate mt-0.5';
        urlSpan.textContent = sanitizeText(item.url, 50);
        const timeSpan = document.createElement('p');
        timeSpan.className = 'text-[9px] text-slate-600 mt-0.5';
        timeSpan.textContent = formatRelativeTime(item.timestamp);
        info.appendChild(pName);
        info.appendChild(urlSpan);
        info.appendChild(timeSpan);

        // Re-download button
        const reBtn = document.createElement('button');
        reBtn.type = 'button';
        reBtn.className = 'flex-shrink-0 w-9 h-9 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white flex items-center justify-center transition-all';
        reBtn.title = 'Re-download';
        reBtn.dataset.histUrl = item.url;
        reBtn.addEventListener('click', () => reDownload(reBtn.dataset.histUrl));
        const reIcon = document.createElement('i');
        reIcon.className = 'fa-solid fa-rotate-right text-xs';
        reBtn.appendChild(reIcon);

        card.appendChild(thumbWrap);
        card.appendChild(info);
        card.appendChild(reBtn);
        list.appendChild(card);
    });
}

function buildPlatformIcon(platformKey, platformIcons) {
    const meta = platformIcons[platformKey] || { icon: 'fa-solid fa-download', color: 'text-orange-400' };
    const i = document.createElement('i');
    i.className = `${meta.icon} ${meta.color} text-lg`;
    return i;
}

function formatRelativeTime(ts) {
    const diff = Date.now() - ts;
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1)  return 'Just now';
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
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
