/* ==========================================================================
   ProDown - Main JavaScript Engine
   Path: assets/js/app.js
   ========================================================================== */

// --- Toggle Mobile Menu Dropdown ---
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// --- Toggle Support Payment Gateways Box ---
function toggleSupportBox() {
    const supportBox = document.getElementById('supportBox');
    if (supportBox) {
        supportBox.classList.toggle('hidden');
    }
}

// --- Platform Tabs Switcher Logic ---
function selectTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('bg-white/5');
    });
    const activeBtn = document.getElementById('tab-' + tab);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.classList.remove('bg-white/5');
    }
}

// --- iOS / Safari Native Direct Download Trigger ---
async function triggerDirectDownload(fileUrl, fileName = "video.mp4") {
    const btn = document.getElementById('downloadTriggerBtn');
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Preparing Download...';
    }
    
    try {
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        
        // Create anchor element to simulate direct file transfer
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        
        // Trigger browser native download pop-up
        link.click();
        
        // Clean up object memory
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (err) {
        // Fallback: direct window redirect if CORS blocks fetch
        window.location.href = fileUrl;
    } finally {
        if (btn) {
            btn.innerHTML = `
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-file-arrow-down text-base"></i>
                    <span>Download Video</span>
                </div>
                <span class="text-[10px] bg-black/30 px-2.5 py-1 rounded-lg">Direct MP4</span>
            `;
        }
    }
}

// --- Core Media Extraction Process Engine ---
async function processDownload() {
    const inputUrlObj = document.getElementById('inputUrl');
    const resultBox = document.getElementById('resultBox');
    const resultTitle = document.getElementById('resultTitle');
    const resultPlatform = document.getElementById('resultPlatform');
    const downloadOptions = document.getElementById('downloadOptions');

    if (!inputUrlObj) return;
    const urlInput = inputUrlObj.value.trim();

    if (!urlInput) {
        alert('Please paste a valid video link.');
        return;
    }

    // UI Loading State
    resultBox.classList.remove('hidden');
    resultTitle.textContent = 'Extracting Media... Please Wait ⏳';
    resultPlatform.textContent = 'ProDown Extraction Engine';
    downloadOptions.innerHTML = `
        <div class="text-center py-3">
            <i class="fa-solid fa-circle-notch fa-spin text-orange-500 text-2xl"></i>
        </div>
    `;

    let downloadUrl = null;

    // Attempt 1: TiklyDown (TikTok Specialized API)
    if (urlInput.includes('tiktok.com')) {
        try {
            const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(urlInput)}`);
            const data = await res.json();
            if (data && data.video && (data.video.noWatermark || data.video.watermark)) {
                downloadUrl = data.video.noWatermark || data.video.watermark;
            }
        } catch (e) {
            console.log('TiklyDown failed, switching to Cobalt engine...');
        }
    }

    // Attempt 2: Cobalt Engine Primary Proxy
    if (!downloadUrl) {
        try {
            const res = await fetch('https://co.wuk.sh/api/json', {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlInput, videoQuality: 'max' })
            });
            const data = await res.json();
            if (data && (data.url || (data.picker && data.picker[0].url))) {
                downloadUrl = data.url || data.picker[0].url;
            }
        } catch (e) {
            console.log('Cobalt primary failed, switching to universal fallback...');
        }
    }

    // Attempt 3: Universal CORS Fallback Engine
    if (!downloadUrl) {
        try {
            const proxyRes = await fetch(`https://api.cobalt.tools/api/json`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: urlInput, videoQuality: 'max' })
            });
            const data = await proxyRes.json();
            if (data && (data.url || (data.picker && data.picker[0].url))) {
                downloadUrl = data.url || data.picker[0].url;
            }
        } catch (e) {
            console.error('All extraction endpoints failed.', e);
        }
    }

    // Render Download Options Result
    if (downloadUrl) {
        resultTitle.textContent = 'Media Extraction Successful! 🎉';
        resultPlatform.textContent = 'Ready for Direct Download';
        downloadOptions.innerHTML = `
            <button id="downloadTriggerBtn" onclick="triggerDirectDownload('${downloadUrl}', 'ProDown_video.mp4')" class="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold p-3.5 rounded-xl flex justify-between items-center transition-all shadow-lg orange-glow-btn">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-file-arrow-down text-base"></i>
                    <span>Download Video</span>
                </div>
                <span class="text-[10px] bg-black/30 px-2.5 py-1 rounded-lg">Direct MP4</span>
            </button>
        `;
    } else {
        resultTitle.textContent = 'Unable to Extract Link ⚠️';
        resultPlatform.textContent = 'Verification Failed';
        downloadOptions.innerHTML = `
            <p class="text-slate-400 text-xs text-center py-2">
                Please verify the URL is public and valid, then try again.
            </p>
        `;
    }
}
