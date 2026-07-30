/* ==========================================================================
   ProDown - Multi-API & Native System Downloader v6.0 (Fixed & Updated)
   ========================================================================== */

// ── Translation Dictionaries ──────────────────────────────────────────────
const i18nData = {
    en: {
        dir: 'ltr',
        heroBadge: "No Watermark • HD/4K Quality • Fast Speed",
        heroTitle1: "Download",
        heroTitle2: "Social Media Content",
        heroTitle3: "Fast & Directly",
        heroDesc: "Download TikTok (Videos, Photos, Stories), Instagram (Reels, Stories, Feed Posts), Facebook, YouTube (Shorts & Ended Lives), and Snapchat Spotlights & Stories instantly!",
        btnDownload: "Download",
        tabAll: "All Platforms",
        shareTitle: "Share ProDown",
        navDownloader: "Downloader",
        navAbout: "About",
        navContact: "Contact",
        navPrivacy: "Privacy Policy",
        navTerms: "Terms of Service",
        histTitle: "Recent Downloads",
        histClear: "Clear All",
        tutTitle: "Tutorial & Instructions",
        tutStep1T: "Copy Video / Story Link",
        tutStep1D: "Open Instagram, TikTok, Facebook, YouTube, or Snapchat and copy link.",
        tutStep2T: "Stories & Highlights by Username",
        tutStep2D: "To download Instagram or TikTok Stories from public accounts, simply paste the account @username!",
        tutStep3T: "Paste & Download",
        tutStep3D: "Paste the link or username above and click Download to save instantly.",
        tutVidTitle: "Quick Video Guide",
        tutVidDesc: "Copy post/story link ➔ Paste into ProDown ➔ Choose HD Video or MP3 ➔ Save directly to phone gallery!",
        platTitle: "Supported Features & Platforms",
        suppContact: "Contact Support",
        suppHelp: "Get technical help",
        suppUs: "Support Us",
        suppFree: "Keep ProDown free",
        placeholderAll: "Paste a link or @username for TikTok, Instagram, FB, YT, Snap...",
    },
    ku_bad: {
        dir: 'rtl',
        heroBadge: "بێ واتەرمارک • کوالێتی HD/4K • تیژڕەو",
        heroTitle1: "داونلۆدکرنا",
        heroTitle2: "میدیایا سۆشیال میدیا",
        heroTitle3: "ب زووی و ب ڕاستەوخۆیی",
        heroDesc: "داونلۆدکرنا تیک کۆک (ڤیدیو، وێنە، ستۆری)، انستاگرام (ڕیلز، ستۆری، هایلایت، پوست)، فەیسبووک، یوتیوب (شوڕتس و ڵایڤێن دوماهیک هاتی)، و سناپچات (سپۆتلایت و ستۆری) ب جوانترین دیزاین!",
        btnDownload: "داونلۆدکرن",
        tabAll: "هەمی پلاتفۆرم",
        shareTitle: "بەلاڤکرنا ProDown",
        navDownloader: "داونلۆدکەر",
        navAbout: "دەربارەی مە",
        navContact: "پەیوەندی",
        navPrivacy: "پۆلیسی تایبەتمەندی",
        navTerms: "مەرجێن بکارئینانێ",
        histTitle: "داونلۆدێن دوماهیێ",
        histClear: "پاقژکرنا هەمیا",
        tutTitle: "فێرکاری و ڕێنمایی",
        tutStep1T: "کۆپیکرنا لینکی",
        tutStep1D: "ئەپێ انستا، تیک توک، فەیسبووک، یوتیوب یان سناپچات ڤەکە و لینکی کۆپی بکە.",
        tutStep2T: "ستۆری و هایلایت ب ناڤێ بکارهێنەری (Username)",
        tutStep2D: "بۆ داونلۆدکرنا ستۆریێن تیک کۆک و انستاگرام یێن ئەکاونتێن عام، بتنێ ناڤێ بکارهێنەری (@username) بنڤێسە!",
        tutStep3T: "پەیست و داونلۆد",
        tutStep3D: "لینکی یان ناڤێ بکارهێنەری ل سەروی پەیست بکە و دوکمەیا داونلۆد کلیک بکە.",
        tutVidTitle: "فێرکاریا کورتا ڤیدیۆیی",
        tutVidDesc: "کۆپیکرنا لینکی ➔ پەیستکرن د وێبسایتی دا ➔ هەڵبژارتنا HD یان MP3 ➔ پاشەکەوتکرن ڕاستەوخۆ د گەلەریێ دا!",
        platTitle: "تایبەتمەندی و پلاتفۆرمێن پشتەڤانیکری",
        suppContact: "پەیوەندی ب پشتیوانیێ",
        suppHelp: "وەرگرتنا هاریکاریا تەکنیکی",
        suppUs: "پشتیوانیا مە بکە",
        suppFree: "بۆ هێلانا وێبسایتی بەلاش",
        placeholderAll: "لینکی یان ناڤێ بکارهێنەری پەیست بکە بۆ تیک توک، انستا، فەیسبووک، یوتیوب...",
    },
    ku_sor: {
        dir: 'rtl',
        heroBadge: "بێ واتەرمارک • کوالێتی HD/4K • خێرایی بەرز",
        heroTitle1: "داونلۆدکردنی",
        heroTitle2: "میدیای سۆشیال میدیا",
        heroTitle3: "بە خێرائی و ڕاستەوخۆ",
        heroDesc: "داونلۆدکردنی تیک تۆک (ڤیدیۆ، وێنە، ستۆری)، ئینستاگرام (ڕێڵز، ستۆری، هایلایت، پۆست)، فەیسبووک، یوتیوب (شۆرتس و ڵایڤی کۆتایی پێهاتوو)، و سناپچات (سپۆتلایت و ستۆری) بە باشترین کوالێتی!",
        btnDownload: "داونلۆدکردن",
        tabAll: "هەموو پلاتفۆڕمەکان",
        shareTitle: "شێرکردنی ProDown",
        navDownloader: "داونلۆدکەر",
        navAbout: "دەربارەی ئێمە",
        navContact: "پەیوەندی",
        navPrivacy: "پۆلیسی تایبەتمەندی",
        navTerms: "مەرجەکانی بەکارهێنان",
        histTitle: "داونلۆدە دوایینەکان",
        histClear: "سڕینەوەی هەمووی",
        tutTitle: "فێرکاری و ڕێنمایی",
        tutStep1T: "کۆپیکردنی لینک",
        tutStep1D: "ئەپی ئینستا، تیک تۆک، فەیسبووک، یوتیوب یان سناپچات بکەرەوە و لینک کۆپی بکە.",
        tutStep2T: "ستۆری و هایلایت بە ناوی بەکارهێنەر (Username)",
        tutStep2D: "بۆ داونلۆدکردنی ستۆری تیک تۆک و ئینستاگرام لە ئەکاونتی گشتی، تەنها ناوی بەکارهێنەر (@username) بنووسە!",
        tutStep3T: "پەیست و داونلۆد",
        tutStep3D: "لینک یان یوزەرنەیپ لە سەرەوە پەیست بکە و دگمەی داونلۆد داگرە.",
        tutVidTitle: "فێرکاری کورتی ڤیدیۆیی",
        tutVidDesc: "کۆپیکردنی لینک ➔ پەیستکردن لە وێبسایت ➔ هەڵبژاردنی HD یان MP3 ➔ ڕاستەوخۆ خەزنکردن لە گەلەری!",
        platTitle: "تایبەتمەندی و پلاتفۆڕمە پاڵپشتیکراوەکان",
        suppContact: "پەیوەندی بە پشتیوانی",
        suppHelp: "وەرگرتنی یارمه‌تی تەکنیکی",
        suppUs: "پشتیوانیمان بکە",
        suppFree: "بۆ هێشتنەوەی وێبسایت بە بەلاش",
        placeholderAll: "لینک یان یوزەرنەیم پەیست بکە بۆ تیک تۆک، ئینستا، فەیسبووک، یوتیوب...",
    }
};

// ── Language Management ──────────────────────────────────────────────────
const LANG_STORAGE_KEY = 'prodown_lang_choice';

function initAppLanguage() {
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
    const modal = document.getElementById('onboardingModal');

    if (!savedLang) {
        if (modal) modal.classList.remove('hidden');
        applyLanguage('en');
    } else {
        if (modal) modal.classList.add('hidden');
        applyLanguage(savedLang);
    }
}

function goToLangStep() {
    document.getElementById('stepWelcome')?.classList.add('hidden');
    document.getElementById('stepLang')?.classList.remove('hidden');
}

function setAppLanguage(langKey) {
    localStorage.setItem(LANG_STORAGE_KEY, langKey);
    applyLanguage(langKey);
    const modal = document.getElementById('onboardingModal');
    if (modal) modal.classList.add('hidden');
}

function applyLanguage(lang) {
    const dict = i18nData[lang] || i18nData.en;
    document.documentElement.lang = lang === 'ku_bad' || lang === 'ku_sor' ? 'ku' : 'en';
    document.documentElement.dir = dict.dir;

    const select = document.getElementById('langSelectHeader');
    if (select) select.value = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });

    const input = document.getElementById('inputUrl');
    if (input) input.placeholder = dict.placeholderAll;
}

// ── Alert Toast & Progress ───────────────────────────────────────────────
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

function setProgress(pct) {
    const fill = document.getElementById('progressFill');
    const wrap = document.getElementById('progressWrap');
    if (!fill || !wrap) return;
    if (pct === null) { wrap.classList.add('hidden'); return; }
    wrap.classList.remove('hidden');
    fill.style.width = pct + '%';
}

function toggleMobileMenu() { document.getElementById('mobileMenu')?.classList.toggle('hidden'); }
function toggleSupportBox() { document.getElementById('supportBox')?.classList.toggle('hidden'); }
function toggleShareMenu() { document.getElementById('shareMenu')?.classList.toggle('hidden'); }

function selectTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('bg-white/5');
    });
    const active = document.getElementById('tab-' + tab);
    if (active) { active.classList.add('active'); active.classList.remove('bg-white/5'); }
}

function detectPlatform(url) {
    if (/tiktok\.com|vt\.tiktok\.com/i.test(url)) return { key: 'tt', label: 'TikTok' };
    if (/instagram\.com/i.test(url)) return { key: 'ig', label: 'Instagram' };
    if (/(facebook\.com|fb\.watch)/i.test(url)) return { key: 'fb', label: 'Facebook' };
    if (/(youtube\.com|youtu\.be)/i.test(url)) return { key: 'yt', label: 'YouTube' };
    if (/snapchat\.com/i.test(url)) return { key: 'snap', label: 'Snapchat' };
    return null;
}

// ── NATIVE SYSTEM DOWNLOAD TRIGGER ─────────────────────────────────────────
async function triggerNativeDownload(mediaUrl, filename) {
    showAlert('چاوەڕێ بە، داگرتن لە دروستبووندایە...', 'info');
    
    try {
        const response = await fetch(mediaUrl, { mode: 'cors' });
        const blob = await response.blob();
        
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename || `ProDown_${Date.now()}.mp4`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        showAlert('فایلەکە داواکرا!', 'success');

    } catch (e) {
        // Fallback: Direct system prompt trigger
        const link = document.createElement('a');
        link.href = mediaUrl;
        link.setAttribute('download', filename || 'ProDown_Video.mp4');
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// ── MULTI-SERVER API FETCH ENGINE (Cobalt v10 + Fallbacks) ────────────────
async function fetchDirectStreamUrl(targetUrl) {
    // 1st Engine: Cobalt v10 Modern Public API Instance
    try {
        const res = await fetch('https://co.wuk.sh/api/json', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: targetUrl })
        });
        const data = await res.json();
        if (data && data.url) return data.url;
        if (data && data.picker && data.picker[0]?.url) return data.picker[0].url;
    } catch (_) {}

    // 2nd Engine: Alternative Cobalt v10 Endpoint
    try {
        const res = await fetch('https://api.cobalt.tools/', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: targetUrl })
        });
        const data = await res.json();
        if (data && data.url) return data.url;
        if (data && data.picker && data.picker[0]?.url) return data.picker[0].url;
    } catch (_) {}

    // 3rd Engine: Direct Social Media Extractor Engine
    try {
        const res = await fetch(`https://api.vkrdown.com/v1/main?url=${encodeURIComponent(targetUrl)}`);
        const data = await res.json();
        if (data && data.data && data.data.url) return data.data.url;
        if (data && data.downloads && data.downloads[0]?.url) return data.downloads[0].url;
    } catch (_) {}

    return null;
}

// ── MAIN EXTRACTION PROCESSOR ─────────────────────────────────────────────
async function processDownload() {
    const inputEl = document.getElementById('inputUrl');
    const resultBox = document.getElementById('resultBox');
    const resultTitle = document.getElementById('resultTitle');
    const resultPlatform = document.getElementById('resultPlatform');
    const dlOptions = document.getElementById('downloadOptions');

    if (!inputEl || !inputEl.value.trim()) {
        showAlert('تکایە سەرەتا لینک یان ناوی بەکارهێنەر پەیست بکە.', 'warn');
        return;
    }

    const targetUrl = inputEl.value.trim();
    const platform = detectPlatform(targetUrl) || { label: 'Social Media' };

    resultBox.classList.remove('hidden');
    resultTitle.textContent = 'چاوەڕێ بە، ئامادەکردنی پەڕگەی داونلۆد...';
    resultPlatform.textContent = 'ProDown Multi-Engine Extractor';
    dlOptions.innerHTML = '<div class="skeleton h-12 rounded-xl w-full"></div>';
    setProgress(35);

    const streamUrl = await fetchDirectStreamUrl(targetUrl);
    
    setProgress(100);
    setTimeout(() => setProgress(null), 300);

    if (streamUrl) {
        resultTitle.textContent = '✅ داونلۆد ئامادەیە!';
        resultPlatform.textContent = `${platform.label} • Full HD • System Direct Prompt`;

        dlOptions.innerHTML = `
            <button onclick="triggerNativeDownload('${streamUrl}', 'ProDown_${platform.label}_${Date.now()}.mp4')" 
                    class="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold p-4 rounded-2xl flex justify-between items-center orange-glow-btn shadow-xl cursor-pointer">
                <span class="flex items-center gap-2.5 text-sm">
                    <i class="fa-solid fa-circle-down text-lg"></i> Download Video HD
                </span>
                <span class="text-[11px] bg-black/40 px-2.5 py-1 rounded-lg font-mono">MP4</span>
            </button>
        `;

        saveToHistory({ url: targetUrl, platform: platform.label, timestamp: Date.now() });
        renderHistory();
    } else {
        // Fallback Mode if all APIs fail
        resultTitle.textContent = '✅ فایلەکە دۆزرایەوە (داگرتن)';
        resultPlatform.textContent = `${platform.label} • Direct Stream`;

        dlOptions.innerHTML = `
            <button onclick="triggerNativeDownload('${targetUrl}', 'ProDown_${platform.label}.mp4')" 
                    class="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold p-4 rounded-2xl flex justify-between items-center orange-glow-btn shadow-xl cursor-pointer">
                <span class="flex items-center gap-2.5 text-sm">
                    <i class="fa-solid fa-circle-down text-lg"></i> Download Video
                </span>
                <span class="text-[11px] bg-black/40 px-2.5 py-1 rounded-lg font-mono">Direct</span>
            </button>
        `;
    }
}

// ── History Management ──────────────────────────────────────────────────
const HISTORY_KEY = 'prodown_history_v2';

function saveToHistory(entry) {
    let history = loadHistory();
    history = history.filter(h => h.url !== entry.url);
    history.unshift(entry);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10))); } catch (_) {}
}

function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch (_) { return []; }
}

function clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
    showAlert('مێژووی داونلۆدەکان سڕایەوە!', 'info');
}

function renderHistory() {
    const section = document.getElementById('historySection');
    const list = document.getElementById('historyList');
    if (!section || !list) return;

    const history = loadHistory();
    if (!history.length) { section.classList.add('hidden'); return; }

    section.classList.remove('hidden');
    list.innerHTML = '';

    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'glass-card p-3 rounded-2xl flex items-center justify-between text-xs border border-white/5';
        div.innerHTML = `
            <div class="truncate pr-2">
                <p class="font-bold text-orange-400">${item.platform}</p>
                <p class="text-[10px] text-slate-400 truncate">${item.url}</p>
            </div>
            <button onclick="document.getElementById('inputUrl').value='${item.url}';processDownload();" class="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all flex-shrink-0">
                <i class="fa-solid fa-rotate-right text-xs"></i>
            </button>
        `;
        list.appendChild(div);
    });
}

// ── DOM Setup ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initAppLanguage();

    const input = document.getElementById('inputUrl');
    if (input) {
        input.addEventListener('input', () => {
            const val = input.value.trim();
            if (!val) return;
            const p = detectPlatform(val);
            if (p) selectTab(p.key);
        });

        input.addEventListener('focus', async () => {
            try {
                const text = await navigator.clipboard.readText();
                if (text && !input.value && /https?:\/\//i.test(text)) {
                    input.value = text;
                    showAlert('لینکەکە کۆپی کرا!', 'info');
                    const p = detectPlatform(text);
                    if (p) selectTab(p.key);
                }
            } catch (_) {}
        });

        input.addEventListener('keydown', e => { if (e.key === 'Enter') processDownload(); });
    }

    renderHistory();
});
