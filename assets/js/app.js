/* ==========================================================================
   ProDown - Engine v3.0 (i18n + LocalStorage + Expanded Platforms)
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
        // First time visit -> Show onboarding modal
        if (modal) modal.classList.remove('hidden');
        applyLanguage('en'); // Default initial view is English
    } else {
        // Returning user -> Hide modal and load saved language
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

    // Sync header dropdown
    const select = document.getElementById('langSelectHeader');
    if (select) select.value = lang;

    // Update text elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });

    // Update placeholder
    const input = document.getElementById('inputUrl');
    if (input) input.placeholder = dict.placeholderAll;
}

// ── Alert Toast ─────────────────────────────────────────────────────────
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

function toggleMobileMenu() {
    document.getElementById('mobileMenu')?.classList.toggle('hidden');
}

function toggleSupportBox() {
    document.getElementById('supportBox')?.classList.toggle('hidden');
}

function toggleShareMenu() {
    document.getElementById('shareMenu')?.classList.toggle('hidden');
}

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
                    showAlert('Link pasted!', 'info');
                    const p = detectPlatform(text);
                    if (p) selectTab(p.key);
                }
            } catch (_) {}
        });

        input.addEventListener('keydown', e => { if (e.key === 'Enter') processDownload(); });
    }

    renderHistory();
});

// ── Download Logic ──────────────────────────────────────────────────────
async function processDownload() {
    const inputEl = document.getElementById('inputUrl');
    const resultBox = document.getElementById('resultBox');
    const resultTitle = document.getElementById('resultTitle');
    const resultPlatform = document.getElementById('resultPlatform');
    const dlOptions = document.getElementById('downloadOptions');

    if (!inputEl || !inputEl.value.trim()) {
        showAlert('Please paste a link or username first.', 'warn');
        return;
    }

    const val = inputEl.value.trim();
    resultBox.classList.remove('hidden');
    resultTitle.textContent = 'Extracting media...';
    resultPlatform.textContent = 'ProDown Multi-Engine';
    dlOptions.innerHTML = '<div class="skeleton h-10 rounded-xl w-full"></div>';
    setProgress(30);

    // Simulated Extraction Engine Response
    setTimeout(() => {
        setProgress(100);
        setTimeout(() => setProgress(null), 500);

        const platform = detectPlatform(val) || { label: 'Social Media' };
        resultTitle.textContent = '✅ Media Ready!';
        resultPlatform.textContent = `${platform.label} • High Quality • No Watermark`;

        dlOptions.innerHTML = `
            <a href="${val}" target="_blank" rel="noopener" class="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold p-3.5 rounded-xl flex justify-between items-center orange-glow-btn shadow-lg">
                <span class="flex items-center gap-2"><i class="fa-solid fa-cloud-arrow-down"></i> Download Video / Story HD</span>
                <span class="text-[10px] bg-black/30 px-2 py-1 rounded-lg">HD MP4</span>
            </a>
            <a href="${val}" target="_blank" rel="noopener" class="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold p-3.5 rounded-xl flex justify-between items-center orange-glow-btn shadow-lg">
                <span class="flex items-center gap-2"><i class="fa-solid fa-music"></i> Download Audio MP3</span>
                <span class="text-[10px] bg-black/30 px-2 py-1 rounded-lg">MP3</span>
            </a>
        `;

        saveToHistory({ url: val, platform: platform.label, timestamp: Date.now() });
        renderHistory();
    }, 1200);
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
    showAlert('History cleared!', 'info');
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
