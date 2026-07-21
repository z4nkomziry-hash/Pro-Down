/* ==========================================================================
   ProDown - Main JavaScript Engine (Updated)
   Path: assets/js/app.js
   ========================================================================== */

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

function toggleSupportBox() {
    const supportBox = document.getElementById('supportBox');
    if (supportBox) {
        supportBox.classList.toggle('hidden');
    }
}

function selectTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('bg-slate-100', 'dark:bg-white/5');
    });
    const activeBtn = document.getElementById('tab-' + tab);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.classList.remove('bg-slate-100', 'dark:bg-white/5');
    }
}

// Fixed iOS Safari Direct Blob Downloader
async function triggerDirectDownload(fileUrl, fileName = "ProDown_video.mp4") {
    const btn = document.getElementById('downloadTriggerBtn');
    if (btn) {
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Starting Download...';
    }
    
    try {
        const response = await fetch(fileUrl, { mode: 'cors' });
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    } catch (err) {
        // Fallback popup if fetch blocked by CORS
        window.open(fileUrl, '_blank');
    } finally {
        if (btn) {
            btn.innerHTML = `
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-cloud-arrow-down text-base"></i>
                    <span>Download Video</span>
                </div>
                <span class="text-[10px] bg-black/30 px-2.5 py-1 rounded-xl">Direct MP4</span>
            `;
        }
    }
}

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

    resultBox.classList.remove('hidden');
    resultTitle.textContent = 'Extracting Media... Please Wait ⏳';
    resultPlatform.textContent = 'ProDown Extraction Engine';
    downloadOptions.innerHTML = `
        <div class="text-center py-3">
            <i class="fa-solid fa-circle-notch fa-spin text-orange-500 text-2xl"></i>
        </div>
    `;

    let downloadUrl = null;

    // TikTok Direct API
    if (urlInput.includes('tiktok.com')) {
        try {
            const res = await fetch(`https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(urlInput)}`);
            const data = await res.json();
            if (data && data.video && (data.video.noWatermark || data.video.watermark)) {
                downloadUrl = data.video.noWatermark || data.video.watermark;
            }
        } catch (e) {
            console.log('TiklyDown fallback...');
        }
    }

    // Cobalt Engine Primary Proxy
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
            console.log('Cobalt fallback...');
        }
    }

    if (downloadUrl) {
        resultTitle.textContent = 'Media Ready for Download! 🎉';
        resultPlatform.textContent = 'High Quality No Watermark';
        downloadOptions.innerHTML = `
            <button id="downloadTriggerBtn" onclick="triggerDirectDownload('${downloadUrl}', 'ProDown_${Date.now()}.mp4')" class="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold p-3.5 rounded-xl flex justify-between items-center transition-all shadow-lg orange-glow-btn">
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-cloud-arrow-down text-base"></i>
                    <span>Download Video</span>
                </div>
                <span class="text-[10px] bg-black/30 px-2.5 py-1 rounded-xl text-white">Direct MP4</span>
            </button>
        `;
    } else {
        resultTitle.textContent = 'Unable to Extract Link ⚠️';
        resultPlatform.textContent = 'Verification Failed';
        downloadOptions.innerHTML = `
            <p class="text-slate-500 dark:text-slate-400 text-xs text-center py-2">
                Please verify the URL is public and valid, then try again.
            </p>
        `;
    }
}
