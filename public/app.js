document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');

    const qualityInput = document.getElementById('qualityInput');
    const qualityVal = document.getElementById('qualityVal');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const aspectRatioLockBtn = document.getElementById('aspectRatioLockBtn');
    const resetDimsBtn = document.getElementById('resetDimsBtn');
    const aspectRatioHint = document.getElementById('aspectRatioHint');
    const losslessCheck = document.getElementById('losslessCheck');

    const regenerateBar = document.getElementById('regenerateBar');
    const regenerateBtn = document.getElementById('regenerateBtn');

    const conversionStatus = document.getElementById('conversionStatus');
    const statusMessage = document.getElementById('statusMessage');

    const resultsSection = document.getElementById('resultsSection');
    const cardsGrid = document.getElementById('cardsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const savingsSummary = document.getElementById('savingsSummary');
    const clearBtn = document.getElementById('clearBtn');
    const downloadZipBtn = document.getElementById('downloadZipBtn');

    const globalStatsBadge = document.getElementById('globalStatsBadge');
    const globalStatsText = document.getElementById('globalStatsText');

    const currentYear = document.getElementById('currentYear');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Converted items in memory
    let convertedFiles = [];
    let isAspectLocked = true;
    let activeAspectRatio = null; // Width / Height

    // Synchronize UI badges with current input values (handles browser form-restore & bfcache)
    function syncUIFromInputs() {
        if (qualityInput && qualityVal) {
            if (losslessCheck && losslessCheck.checked) {
                qualityInput.disabled = true;
                qualityInput.style.opacity = '0.3';
                qualityVal.textContent = 'Lossless';
            } else {
                qualityInput.disabled = false;
                qualityInput.style.opacity = '1';
                qualityVal.textContent = `${qualityInput.value}%`;
            }
        }

        if (widthInput && heightInput && widthInput.value && heightInput.value) {
            const w = parseInt(widthInput.value, 10);
            const h = parseInt(heightInput.value, 10);
            if (w > 0 && h > 0) {
                activeAspectRatio = w / h;
            }
        }
    }

    // Initialize UI immediately and on page restore
    syncUIFromInputs();
    window.addEventListener('pageshow', syncUIFromInputs);
    window.addEventListener('load', syncUIFromInputs);

    // Quality Slider Interaction
    qualityInput.addEventListener('input', () => {
        syncUIFromInputs();
        showRegenerateHint();
    });

    qualityInput.addEventListener('change', () => {
        syncUIFromInputs();
    });

    // Aspect Ratio Lock Toggle
    if (aspectRatioLockBtn) {
        aspectRatioLockBtn.addEventListener('click', () => {
            isAspectLocked = !isAspectLocked;
            aspectRatioLockBtn.classList.toggle('active', isAspectLocked);
            aspectRatioLockBtn.setAttribute(
                'title',
                isAspectLocked ? 'Aspect ratio locked (proportional)' : 'Aspect ratio unlocked'
            );
            if (aspectRatioHint) {
                aspectRatioHint.textContent = isAspectLocked
                    ? 'Linked aspect ratio \u2022 Changing width or height automatically calculates the other.'
                    : 'Aspect ratio unlinked \u2022 Width and height can be changed independently.';
            }
        });
    }

    // Width Input Interaction (Linked to Height)
    widthInput.addEventListener('input', () => {
        const val = parseInt(widthInput.value, 10);
        if (isAspectLocked) {
            if (!val || isNaN(val) || val <= 0) {
                heightInput.value = '';
            } else if (activeAspectRatio && activeAspectRatio > 0) {
                heightInput.value = Math.max(1, Math.round(val / activeAspectRatio));
            }
        }
        showRegenerateHint();
    });

    // Height Input Interaction (Linked to Width)
    heightInput.addEventListener('input', () => {
        const val = parseInt(heightInput.value, 10);
        if (isAspectLocked) {
            if (!val || isNaN(val) || val <= 0) {
                widthInput.value = '';
            } else if (activeAspectRatio && activeAspectRatio > 0) {
                widthInput.value = Math.max(1, Math.round(val * activeAspectRatio));
            }
        }
        showRegenerateHint();
    });

    // Reset Dimensions to Original
    if (resetDimsBtn) {
        resetDimsBtn.addEventListener('click', () => {
            widthInput.value = '';
            heightInput.value = '';
            if (convertedFiles.length > 0) {
                const first = convertedFiles[0];
                activeAspectRatio = first.originalWidth / first.originalHeight;
                widthInput.placeholder = `${first.originalWidth}`;
                heightInput.placeholder = `${first.originalHeight}`;
            } else {
                activeAspectRatio = null;
                widthInput.placeholder = 'Auto';
                heightInput.placeholder = 'Auto';
            }
            showRegenerateHint();
        });
    }

    losslessCheck.addEventListener('change', () => {
        syncUIFromInputs();
        showRegenerateHint();
    });

    function showRegenerateHint() {
        if (convertedFiles.length > 0) {
            regenerateBar.style.display = 'flex';
        }
    }

    // File Picker Triggers
    browseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });

    dropzone.addEventListener('click', (e) => {
        if (e.target !== browseBtn && !browseBtn.contains(e.target)) {
            fileInput.click();
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
            handleFiles(Array.from(fileInput.files));
            fileInput.value = '';
        }
    });

    // Drag & Drop
    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('dragover');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('dragover');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer && e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFiles(Array.from(files));
        }
    });

    function formatBytes(bytes, decimals = 1) {
        if (!bytes || isNaN(bytes) || bytes === 0) return '0 B';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function getActiveOptions() {
        const wVal = parseInt(widthInput.value, 10);
        const hVal = parseInt(heightInput.value, 10);

        return {
            quality: qualityInput.value,
            width: (!isNaN(wVal) && wVal > 0) ? wVal : null,
            height: (!isNaN(hVal) && hVal > 0) ? hVal : null,
            lossless: losslessCheck.checked,
            isAspectLocked,
        };
    }

    // Load Image helper with fallback
    async function loadImage(file) {
        if (typeof createImageBitmap === 'function') {
            try {
                const bmp = await createImageBitmap(file);
                return {
                    source: bmp,
                    width: bmp.width,
                    height: bmp.height,
                    close: () => bmp.close(),
                };
            } catch (err) {
                // Fallback to Image element
            }
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                resolve({
                    source: img,
                    width: img.naturalWidth || img.width,
                    height: img.naturalHeight || img.height,
                    close: () => URL.revokeObjectURL(url),
                });
            };
            img.onerror = (err) => {
                URL.revokeObjectURL(url);
                reject(new Error(`Failed to decode image "${file.name}".`));
            };
            img.src = url;
        });
    }

    // WebP Animation Container Muxer (Client-side RIFF / ANMF assembler)
    function muxAnimatedWebP(frames, canvasWidth, canvasHeight, loopCount = 0) {
        const chunks = [];

        // 1. VP8X Chunk (10 bytes payload)
        const vp8x = new Uint8Array(8 + 10);
        const vp8xView = new DataView(vp8x.buffer);
        vp8x.set([0x56, 0x50, 0x38, 0x58], 0); // 'VP8X'
        vp8xView.setUint32(4, 10, true);

        // Flags: Bit 1 is Animation (0x02)
        let flags = 0x02;
        let hasAlpha = false;
        vp8x.set([flags, 0, 0, 0], 8);

        const wMinus1 = canvasWidth - 1;
        vp8x[12] = wMinus1 & 0xff;
        vp8x[13] = (wMinus1 >> 8) & 0xff;
        vp8x[14] = (wMinus1 >> 16) & 0xff;

        const hMinus1 = canvasHeight - 1;
        vp8x[15] = hMinus1 & 0xff;
        vp8x[16] = (hMinus1 >> 8) & 0xff;
        vp8x[17] = (hMinus1 >> 16) & 0xff;
        chunks.push(vp8x);

        // 2. ANIM Chunk (6 bytes payload: BG color + loop count)
        const anim = new Uint8Array(8 + 6);
        const animView = new DataView(anim.buffer);
        anim.set([0x41, 0x4e, 0x49, 0x4d], 0); // 'ANIM'
        animView.setUint32(4, 6, true);
        animView.setUint32(8, 0x00000000, true);
        animView.setUint16(12, loopCount, true);
        chunks.push(anim);

        // 3. ANMF Chunks for each animation frame
        for (const frame of frames) {
            const rawWebp = frame.webpBuffer;
            if (rawWebp.length < 12) continue;

            let offset = 12;
            const subChunks = [];
            while (offset < rawWebp.length) {
                const fourCC = String.fromCharCode(...rawWebp.subarray(offset, offset + 4));
                const chunkSize = new DataView(rawWebp.buffer, rawWebp.byteOffset + offset + 4, 4).getUint32(0, true);
                const totalChunkLen = 8 + chunkSize + (chunkSize % 2);

                if (fourCC === 'VP8 ' || fourCC === 'VP8L' || fourCC === 'ALPH') {
                    if (fourCC === 'ALPH' || fourCC === 'VP8L') hasAlpha = true;
                    subChunks.push(rawWebp.subarray(offset, offset + totalChunkLen));
                }
                offset += totalChunkLen;
            }

            if (subChunks.length === 0) continue;

            let subChunksSize = 0;
            for (const sc of subChunks) subChunksSize += sc.length;

            const anmfPayloadSize = 16 + subChunksSize;
            const anmfHeader = new Uint8Array(8 + 16);
            const anmfView = new DataView(anmfHeader.buffer);
            anmfHeader.set([0x41, 0x4e, 0x4d, 0x46], 0); // 'ANMF'
            anmfView.setUint32(4, anmfPayloadSize, true);

            // Frame X, Y (0, 0)
            anmfHeader[8] = 0; anmfHeader[9] = 0; anmfHeader[10] = 0;
            anmfHeader[11] = 0; anmfHeader[12] = 0; anmfHeader[13] = 0;
            // Frame W - 1, H - 1
            anmfHeader[14] = wMinus1 & 0xff;
            anmfHeader[15] = (wMinus1 >> 8) & 0xff;
            anmfHeader[16] = (wMinus1 >> 16) & 0xff;
            anmfHeader[17] = hMinus1 & 0xff;
            anmfHeader[18] = (hMinus1 >> 8) & 0xff;
            anmfHeader[19] = (hMinus1 >> 16) & 0xff;

            // Frame Duration (3 bytes, ms)
            const dur = Math.max(10, Math.min(65535, frame.duration || 100));
            anmfHeader[20] = dur & 0xff;
            anmfHeader[21] = (dur >> 8) & 0xff;
            anmfHeader[22] = (dur >> 16) & 0xff;

            anmfHeader[23] = 0x02; // Do not blend (blend method = 1)

            chunks.push(anmfHeader);
            for (const sc of subChunks) chunks.push(sc);

            if (anmfPayloadSize % 2 !== 0) {
                chunks.push(new Uint8Array([0]));
            }
        }

        if (hasAlpha) {
            vp8x[8] |= 0x10;
        }

        // RIFF Header
        let payloadSize = 4; // 'WEBP'
        for (const c of chunks) payloadSize += c.length;

        const riffHeader = new Uint8Array(12);
        const riffView = new DataView(riffHeader.buffer);
        riffHeader.set([0x52, 0x49, 0x46, 0x46], 0); // 'RIFF'
        riffView.setUint32(4, payloadSize, true);
        riffHeader.set([0x57, 0x45, 0x42, 0x50], 8); // 'WEBP'

        const totalLength = 12 + chunks.reduce((acc, c) => acc + c.length, 0);
        const result = new Uint8Array(totalLength);
        result.set(riffHeader, 0);
        let curOffset = 12;
        for (const c of chunks) {
            result.set(c, curOffset);
            curOffset += c.length;
        }
        return result;
    }

    // Animated GIF Processor using browser WebCodecs ImageDecoder
    async function processAnimatedGif(file, options) {
        if (typeof ImageDecoder === 'undefined') return null;

        const arrayBuffer = await file.arrayBuffer();
        const decoder = new ImageDecoder({ data: arrayBuffer, type: 'image/gif' });
        await decoder.tracks.ready;

        const track = decoder.tracks.selectedTrack;
        if (!track || track.frameCount <= 1) {
            decoder.close();
            return null;
        }

        const frameCount = track.frameCount;
        const repetitionCount = track.repetitionCount ?? 0;
        const frames = [];
        let animWidth = 0;
        let animHeight = 0;

        for (let i = 0; i < frameCount; i++) {
            if (statusMessage) {
                statusMessage.textContent = `Encoding ${file.name}: frame ${i + 1} of ${frameCount}...`;
            }

            const frameResult = await decoder.decode({ frameIndex: i });
            const videoFrame = frameResult.image;
            const duration = (videoFrame.duration || 100000) / 1000; // microseconds to ms

            const origW = videoFrame.displayWidth || videoFrame.codedWidth;
            const origH = videoFrame.displayHeight || videoFrame.codedHeight;
            const imgRatio = origW / origH;

            let targetW = origW;
            let targetH = origH;
            if (options.width && options.height) {
                if (options.isAspectLocked) {
                    targetW = options.width;
                    targetH = Math.max(1, Math.round(options.width / imgRatio));
                } else {
                    targetW = options.width;
                    targetH = options.height;
                }
            } else if (options.width) {
                targetW = options.width;
                targetH = Math.max(1, Math.round(options.width / imgRatio));
            } else if (options.height) {
                targetH = options.height;
                targetW = Math.max(1, Math.round(options.height * imgRatio));
            }

            animWidth = targetW;
            animHeight = targetH;

            let canvas, ctx;
            if (typeof OffscreenCanvas !== 'undefined') {
                canvas = new OffscreenCanvas(targetW, targetH);
                ctx = canvas.getContext('2d');
            } else {
                canvas = document.createElement('canvas');
                canvas.width = targetW;
                canvas.height = targetH;
                ctx = canvas.getContext('2d');
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(videoFrame, 0, 0, targetW, targetH);
            videoFrame.close();

            const quality = options.lossless ? 1.0 : Math.min(1, Math.max(0.05, (parseInt(options.quality, 10) || 65) / 100));
            let frameBlob;
            if (canvas.convertToBlob) {
                frameBlob = await canvas.convertToBlob({ type: 'image/webp', quality });
            } else {
                frameBlob = await new Promise(res => canvas.toBlob(res, 'image/webp', quality));
            }

            const webpBuffer = new Uint8Array(await frameBlob.arrayBuffer());
            frames.push({
                webpBuffer,
                duration: Math.round(duration) || 100,
            });
        }

        decoder.close();

        const animatedBuffer = muxAnimatedWebP(frames, animWidth, animHeight, repetitionCount === -1 ? 1 : 0);
        const convertedBlob = new Blob([animatedBuffer], { type: 'image/webp' });
        const previewUrl = URL.createObjectURL(convertedBlob);

        const lastDot = file.name.lastIndexOf('.');
        const baseName = lastDot > 0 ? file.name.substring(0, lastDot) : file.name;
        const outputFilename = `${baseName}.webp`;

        const originalSize = file.size;
        const convertedSize = convertedBlob.size;
        const savingsPercent = originalSize > 0
            ? Math.round(((originalSize - convertedSize) / originalSize) * 100)
            : 0;

        return {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            originalFile: file,
            originalName: file.name,
            originalSize,
            originalWidth: animWidth,
            originalHeight: animHeight,
            convertedName: outputFilename,
            convertedSize,
            convertedBlob,
            previewUrl,
            savingsPercent,
            isAnimated: true,
            frameCount,
            width: animWidth,
            height: animHeight,
        };
    }

    // Client-Side Image Processor
    async function processImageClientSide(file, options) {
        const isGif = file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif');

        // Attempt multi-frame animated GIF conversion
        if (isGif) {
            try {
                const animResult = await processAnimatedGif(file, options);
                if (animResult) return animResult;
            } catch (err) {
                console.warn('Animated GIF decode fallback:', err);
            }
        }

        const loaded = await loadImage(file);
        const origWidth = loaded.width;
        const origHeight = loaded.height;
        const imgRatio = origWidth / origHeight;

        // Track active aspect ratio for UI calculations
        if (!activeAspectRatio) {
            activeAspectRatio = imgRatio;
            if (!widthInput.value && !heightInput.value) {
                widthInput.placeholder = `${origWidth}`;
                heightInput.placeholder = `${origHeight}`;
            }
        }

        // Determine target dimensions
        let targetWidth = origWidth;
        let targetHeight = origHeight;

        const reqW = options.width;
        const reqH = options.height;

        if (reqW && reqH) {
            if (options.isAspectLocked) {
                // Preserving aspect ratio when both are provided
                targetWidth = reqW;
                targetHeight = Math.max(1, Math.round(reqW / imgRatio));
            } else {
                targetWidth = reqW;
                targetHeight = reqH;
            }
        } else if (reqW) {
            targetWidth = reqW;
            targetHeight = Math.max(1, Math.round(reqW / imgRatio));
        } else if (reqH) {
            targetHeight = reqH;
            targetWidth = Math.max(1, Math.round(reqH * imgRatio));
        }

        let canvas;
        let ctx;
        if (typeof OffscreenCanvas !== 'undefined') {
            canvas = new OffscreenCanvas(targetWidth, targetHeight);
            ctx = canvas.getContext('2d');
        } else {
            canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx = canvas.getContext('2d');
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(loaded.source, 0, 0, targetWidth, targetHeight);
        loaded.close();

        const quality = options.lossless ? 1.0 : Math.min(1, Math.max(0.05, (parseInt(options.quality, 10) || 65) / 100));

        let convertedBlob;
        if (canvas.convertToBlob) {
            convertedBlob = await canvas.convertToBlob({ type: 'image/webp', quality });
        } else {
            convertedBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/webp', quality));
        }

        if (!convertedBlob) {
            throw new Error('WebP encoding failed in your browser.');
        }

        // Determine output file name
        const lastDot = file.name.lastIndexOf('.');
        const baseName = lastDot > 0 ? file.name.substring(0, lastDot) : file.name;
        const outputFilename = `${baseName}.webp`;

        const originalSize = file.size;
        const convertedSize = convertedBlob.size;
        const savingsPercent = originalSize > 0
            ? Math.round(((originalSize - convertedSize) / originalSize) * 100)
            : 0;

        const previewUrl = URL.createObjectURL(convertedBlob);

        return {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            originalFile: file,
            originalName: file.name,
            originalSize,
            originalWidth: origWidth,
            originalHeight: origHeight,
            convertedName: outputFilename,
            convertedSize,
            convertedBlob,
            previewUrl,
            savingsPercent,
            isAnimated: file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif'),
            frameCount: 1,
            width: targetWidth,
            height: targetHeight,
        };
    }

    // Handle Uploaded Files
    async function handleFiles(files) {
        const validFiles = files.filter(f => {
            const type = (f.type || '').toLowerCase();
            const ext = f.name.split('.').pop().toLowerCase();
            return type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext);
        });

        if (validFiles.length === 0) {
            alert('Please upload valid images (PNG, JPG, WebP, or GIF).');
            return;
        }

        conversionStatus.style.display = 'flex';
        const opts = getActiveOptions();
        const newResults = [];

        let failedCount = 0;
        let lastError = null;

        for (let i = 0; i < validFiles.length; i++) {
            const file = validFiles[i];
            statusMessage.textContent = `Encoding ${i + 1} of ${validFiles.length}: ${file.name}...`;

            try {
                const result = await processImageClientSide(file, opts);
                newResults.push(result);
            } catch (err) {
                console.error(`Failed to process ${file.name}:`, err);
                failedCount++;
                lastError = err;
            }
        }

        if (newResults.length > 0) {
            convertedFiles = [...newResults, ...convertedFiles];
            regenerateBar.style.display = 'none';
            renderResults();
        }

        if (failedCount > 0 && newResults.length === 0) {
            alert(`Could not convert image(s): ${lastError ? lastError.message : 'Unknown error'}`);
        }

        conversionStatus.style.display = 'none';
    }

    // Regenerate Existing Queue with new options
    regenerateBtn.addEventListener('click', async () => {
        if (convertedFiles.length === 0) return;

        conversionStatus.style.display = 'flex';
        regenerateBtn.disabled = true;
        const opts = getActiveOptions();
        const updated = [];

        for (let i = 0; i < convertedFiles.length; i++) {
            const item = convertedFiles[i];
            statusMessage.textContent = `Re-encoding ${i + 1} of ${convertedFiles.length}: ${item.originalName}...`;

            try {
                const newResult = await processImageClientSide(item.originalFile, opts);
                // Revoke previous blob URL to prevent memory leaks
                if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
                updated.push(newResult);
            } catch (err) {
                console.error(`Failed to re-encode ${item.originalName}:`, err);
                updated.push(item);
            }
        }

        convertedFiles = updated;
        regenerateBar.style.display = 'none';
        renderResults();

        conversionStatus.style.display = 'none';
        regenerateBtn.disabled = false;
    });

    // Render Result Cards
    function renderResults() {
        if (convertedFiles.length === 0) {
            resultsSection.style.display = 'none';
            globalStatsBadge.style.display = 'none';
            regenerateBar.style.display = 'none';
            return;
        }

        resultsSection.style.display = 'flex';
        resultsCount.textContent = convertedFiles.length;
        cardsGrid.innerHTML = '';

        let totalOriginal = 0;
        let totalConverted = 0;

        convertedFiles.forEach(item => {
            totalOriginal += item.originalSize;
            totalConverted += item.convertedSize;

            const card = document.createElement('div');
            card.className = 'liquid-asset-card';

            const badgeText = item.isAnimated
                ? (item.frameCount > 1 ? `WEBP ANIM \u2022 ${item.frameCount}F` : 'WEBP')
                : 'WEBP';
            const isReduced = item.savingsPercent > 0;
            const deltaClass = isReduced ? 'saved' : 'increased';
            const deltaLabel = isReduced
                ? `-${item.savingsPercent}%`
                : (item.savingsPercent === 0 ? '0%' : `+${Math.abs(item.savingsPercent)}%`);

            card.innerHTML = `
        <div class="liquid-preview-box">
          <button type="button" class="card-remove-btn" data-id="${item.id}" title="Remove image" aria-label="Remove image">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <span class="preview-glass-pill">${badgeText}</span>
          <img src="${item.previewUrl}" alt="${item.convertedName}" loading="lazy" />
        </div>
        <div class="liquid-card-body">
          <div class="card-asset-name" title="${item.convertedName}">${item.convertedName}</div>
          <div class="liquid-delta-strip">
            <span class="delta-striked">${formatBytes(item.originalSize)}</span>
            <span class="delta-arrow">&rarr;</span>
            <span class="delta-current">${formatBytes(item.convertedSize)}</span>
            <span class="delta-badge-liquid ${deltaClass}">${deltaLabel}</span>
          </div>
          <div class="liquid-card-bottom">
            <span class="card-dims">${item.width}&times;${item.height}px</span>
            <div class="card-actions-group">
              <button type="button" class="liquid-btn btn-glass-subtle btn-compact-glass btn-card-remove" data-id="${item.id}" title="Remove image" aria-label="Remove image">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
                <span>Remove</span>
              </button>
              <a href="${item.previewUrl}" class="liquid-btn btn-glass-subtle btn-compact-glass" download="${item.convertedName}">
                Download
              </a>
            </div>
          </div>
        </div>
      `;
            cardsGrid.appendChild(card);
        });

        const totalSaved = totalOriginal - totalConverted;
        const overallPercent = totalOriginal > 0 ? Math.round((totalSaved / totalOriginal) * 100) : 0;

        if (totalSaved >= 0) {
            savingsSummary.style.color = '#30d158';
            savingsSummary.textContent = `Total space saved: ${formatBytes(totalSaved)} (${overallPercent}% reduction)`;
        } else {
            savingsSummary.style.color = '#ff375f';
            savingsSummary.textContent = `Payload increased by ${formatBytes(Math.abs(totalSaved))} (+${Math.abs(overallPercent)}%). Lower quality or scale.`;
        }

        globalStatsBadge.style.display = 'flex';
        globalStatsText.textContent = `${convertedFiles.length} in queue \u2022 ${totalSaved >= 0 ? formatBytes(totalSaved) + ' saved' : 'Ready'}`;
    }

    // Remove single file from queue
    function removeFile(id, cardElement) {
        const index = convertedFiles.findIndex(item => item.id === id);
        if (index === -1) return;

        const [removed] = convertedFiles.splice(index, 1);
        if (removed && removed.previewUrl) {
            URL.revokeObjectURL(removed.previewUrl);
        }

        if (cardElement) {
            cardElement.classList.add('removing');
            setTimeout(() => {
                finalizeRemoval();
            }, 180);
        } else {
            finalizeRemoval();
        }
    }

    function finalizeRemoval() {
        if (convertedFiles.length === 0) {
            activeAspectRatio = null;
            if (!widthInput.value && !heightInput.value) {
                widthInput.placeholder = 'Auto';
                heightInput.placeholder = 'Auto';
            }
        } else if (!widthInput.value && !heightInput.value) {
            const first = convertedFiles[0];
            activeAspectRatio = first.originalWidth / first.originalHeight;
            widthInput.placeholder = `${first.originalWidth}`;
            heightInput.placeholder = `${first.originalHeight}`;
        }
        renderResults();
    }

    // Event delegation for card remove buttons
    cardsGrid.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.card-remove-btn, .btn-card-remove');
        if (removeBtn) {
            e.preventDefault();
            e.stopPropagation();
            const id = removeBtn.getAttribute('data-id');
            const card = removeBtn.closest('.liquid-asset-card');
            removeFile(id, card);
        }
    });

    // Clear Queue
    clearBtn.addEventListener('click', () => {
        convertedFiles.forEach(item => {
            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
        convertedFiles = [];
        activeAspectRatio = null;
        widthInput.value = '';
        heightInput.value = '';
        widthInput.placeholder = 'Auto';
        heightInput.placeholder = 'Auto';
        renderResults();
    });

    // Fast Zero-Dependency In-Memory ZIP Creator (Store Mode - WebP files are already compressed)
    const crcTable = (() => {
        const table = new Uint32Array(256);
        for (let i = 0; i < 256; i++) {
            let c = i;
            for (let k = 0; k < 8; k++) {
                c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
            }
            table[i] = c;
        }
        return table;
    })();

    function calculateCrc32(uint8Array) {
        let crc = 0xffffffff;
        for (let i = 0; i < uint8Array.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ uint8Array[i]) & 0xff];
        }
        return (crc ^ 0xffffffff) >>> 0;
    }

    function createZipBlob(files) {
        const textEncoder = new TextEncoder();
        const chunks = [];
        const centralRecords = [];
        let offset = 0;

        const now = new Date();
        const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (Math.floor(now.getSeconds() / 2));
        const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

        for (const file of files) {
            const filenameBytes = textEncoder.encode(file.name);
            const dataBytes = file.data;
            const crc = calculateCrc32(dataBytes);
            const size = dataBytes.length;

            // Local Header: 30 bytes + filename
            const localHeader = new Uint8Array(30);
            const view = new DataView(localHeader.buffer);
            view.setUint32(0, 0x04034b50, true);
            view.setUint16(4, 20, true);
            view.setUint16(6, 0x0800, true); // UTF-8 filename flag
            view.setUint16(8, 0, true);      // Method 0: STORE
            view.setUint16(10, dosTime, true);
            view.setUint16(12, dosDate, true);
            view.setUint32(14, crc, true);
            view.setUint32(18, size, true);
            view.setUint32(22, size, true);
            view.setUint16(26, filenameBytes.length, true);
            view.setUint16(28, 0, true);

            chunks.push(localHeader, filenameBytes, dataBytes);

            // Central Directory Record: 46 bytes + filename
            const cdRecord = new Uint8Array(46);
            const cdView = new DataView(cdRecord.buffer);
            cdView.setUint32(0, 0x02014b50, true);
            cdView.setUint16(4, 20, true);
            cdView.setUint16(6, 20, true);
            cdView.setUint16(8, 0x0800, true);
            cdView.setUint16(10, 0, true);
            cdView.setUint16(12, dosTime, true);
            cdView.setUint16(14, dosDate, true);
            cdView.setUint32(16, crc, true);
            cdView.setUint32(20, size, true);
            cdView.setUint32(24, size, true);
            cdView.setUint16(28, filenameBytes.length, true);
            cdView.setUint16(30, 0, true);
            cdView.setUint16(32, 0, true);
            cdView.setUint16(34, 0, true);
            cdView.setUint16(36, 0, true);
            cdView.setUint32(38, 0, true);
            cdView.setUint32(42, offset, true);

            centralRecords.push(cdRecord, filenameBytes);
            offset += localHeader.length + filenameBytes.length + dataBytes.length;
        }

        const cdOffset = offset;
        let cdSize = 0;
        for (const chunk of centralRecords) {
            chunks.push(chunk);
            cdSize += chunk.length;
        }

        // End of Central Directory (EOCD): 22 bytes
        const eocd = new Uint8Array(22);
        const eocdView = new DataView(eocd.buffer);
        eocdView.setUint32(0, 0x06054b50, true);
        eocdView.setUint16(4, 0, true);
        eocdView.setUint16(6, 0, true);
        eocdView.setUint16(8, files.length, true);
        eocdView.setUint16(10, files.length, true);
        eocdView.setUint32(12, cdSize, true);
        eocdView.setUint32(16, cdOffset, true);
        eocdView.setUint16(20, 0, true);

        chunks.push(eocd);

        return new Blob(chunks, { type: 'application/zip' });
    }

    // Download All as ZIP
    downloadZipBtn.addEventListener('click', async () => {
        if (convertedFiles.length === 0) return;

        downloadZipBtn.disabled = true;
        const originalText = downloadZipBtn.innerHTML;
        downloadZipBtn.textContent = 'Generating ZIP Archive...';

        try {
            const filesForZip = [];
            for (const item of convertedFiles) {
                const buffer = await item.convertedBlob.arrayBuffer();
                filesForZip.push({
                    name: item.convertedName,
                    data: new Uint8Array(buffer),
                });
            }

            const zipBlob = createZipBlob(filesForZip);
            const downloadUrl = URL.createObjectURL(zipBlob);

            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `webp-optimized-bundle-${Date.now()}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
        } catch (err) {
            console.error(err);
            alert(`Error building ZIP archive: ${err.message}`);
        } finally {
            downloadZipBtn.disabled = false;
            downloadZipBtn.innerHTML = originalText;
        }
    });
});
