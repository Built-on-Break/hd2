/**
 * Shareable loadout image card generator.
 * Renders the current loadout as a styled PNG using Canvas API.
 * Loads item images via weserv.nl proxy (CORS-safe); falls back to
 * styled category placeholders if the proxy is unavailable.
 */
window.HD2ImageCard = (function () {

    var CARD_W = 1200;
    var CARD_H = 480;

    var COLOR_BG = '#0a0a0f';
    var COLOR_SURFACE = '#181825';
    var COLOR_SURFACE_LIGHT = '#1e1e2e';
    var COLOR_BORDER = '#2a2a3a';
    var COLOR_PRIMARY = '#f5c518';
    var COLOR_TEXT = '#e8e8e8';
    var COLOR_TEXT_MUTED = '#888898';
    var COLOR_BRAND_ORANGE = '#d4772c';

    var MODE_CONFIG = {
        'mission-ready': { label: 'MISSION READY', color: '#44ff88' },
        'balanced': { label: 'BALANCED', color: '#f5c518' },
        'chaos': { label: 'CHAOS', color: '#ff4444' }
    };

    var STRAT_COLORS = {
        'support-weapon': '#4a9eff',
        'orbital': '#ff6b35',
        'eagle': '#ff4444',
        'sentry': '#44cc44',
        'backpack': '#aa66ff',
        'vehicle': '#ffaa00',
        'emplacement': '#66cccc'
    };

    var STRAT_LABELS = {
        'support-weapon': 'SW',
        'orbital': 'ORB',
        'eagle': 'EGL',
        'sentry': 'SEN',
        'backpack': 'BP',
        'vehicle': 'VEH',
        'emplacement': 'EMP'
    };

    // ── Canvas helpers ──────────────────────────────────────────────

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
    }

    function truncateText(ctx, text, maxWidth) {
        if (ctx.measureText(text).width <= maxWidth) return text;
        var t = text;
        while (t.length > 0 && ctx.measureText(t + '...').width > maxWidth) {
            t = t.slice(0, -1);
        }
        return t + '...';
    }

    // ── Image loading ───────────────────────────────────────────────

    var IMG_PROXY = 'https://images.weserv.nl/?url=';

    function loadImage(url) {
        if (!url) return Promise.resolve(null);
        var cleanURL = url.replace(/^https?:\/\//, '');
        var proxyURL = IMG_PROXY + encodeURIComponent(cleanURL);

        return new Promise(function (resolve) {
            var img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = function () { resolve(img); };
            img.onerror = function () { resolve(null); };
            img.src = proxyURL;
        });
    }

    function loadAllImages(result) {
        var tasks = {};
        var keys = [];

        var items = {
            primaryWeapon: result.primaryWeapon,
            secondaryWeapon: result.secondaryWeapon,
            throwable: result.throwable,
            armor: result.armor,
            booster: result.booster
        };

        Object.keys(items).forEach(function (key) {
            keys.push(key);
            tasks[key] = loadImage(items[key].image);
        });

        result.stratagems.forEach(function (strat, i) {
            var k = 'strat' + i;
            keys.push(k);
            tasks[k] = loadImage(strat.image);
        });

        var taskArray = keys.map(function (k) { return tasks[k]; });
        return Promise.all(taskArray).then(function (results) {
            var map = {};
            keys.forEach(function (k, i) { map[k] = results[i]; });
            return map;
        });
    }

    // ── Drawing functions ───────────────────────────────────────────

    function drawPlaceholder(ctx, x, y, size, color, label) {
        roundRect(ctx, x, y, size, size, 6);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.15;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.font = 'bold ' + Math.floor(size * 0.3) + 'px "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, x + size / 2, y + size / 2);
        ctx.textBaseline = 'alphabetic';
    }

    function drawImageOrPlaceholder(ctx, img, x, y, size, color, label) {
        if (img) {
            // Slightly lighter background so transparent PNGs pop
            roundRect(ctx, x, y, size, size, 6);
            ctx.fillStyle = COLOR_SURFACE;
            ctx.fill();

            // Subtle inner glow matching the accent color
            var glow = ctx.createRadialGradient(
                x + size / 2, y + size / 2, size * 0.1,
                x + size / 2, y + size / 2, size * 0.6
            );
            glow.addColorStop(0, color.replace(')', ', 0.08)').replace('rgb', 'rgba'));
            glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = glow;
            ctx.fill();

            // Border
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.5;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.globalAlpha = 1;

            // Draw image centered and fitted
            ctx.save();
            roundRect(ctx, x + 2, y + 2, size - 4, size - 4, 5);
            ctx.clip();

            var iw = img.width;
            var ih = img.height;
            var scale = Math.min((size - 8) / iw, (size - 8) / ih);
            var dw = iw * scale;
            var dh = ih * scale;
            var dx = x + (size - dw) / 2;
            var dy = y + (size - dh) / 2;
            ctx.drawImage(img, dx, dy, dw, dh);
            ctx.restore();
        } else {
            drawPlaceholder(ctx, x, y, size, color, label);
        }
    }

    function drawItemRow(ctx, label, name, x, y, w, h, accentColor, img, placeholderLabel) {
        var imgSize = h - 10;
        var imgX = x + 8;
        var imgY = y + 5;
        var textX = x + imgSize + 22;
        var textW = w - imgSize - 34;

        // Row background
        roundRect(ctx, x, y, w, h, 8);
        ctx.fillStyle = COLOR_SURFACE_LIGHT;
        ctx.fill();
        ctx.strokeStyle = COLOR_BORDER;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Left accent bar
        if (accentColor) {
            roundRect(ctx, x, y, 4, h, 2);
            ctx.fillStyle = accentColor;
            ctx.fill();
        }

        // Image / placeholder
        drawImageOrPlaceholder(ctx, img, imgX, imgY, imgSize, accentColor || COLOR_PRIMARY, placeholderLabel || '?');

        // Label
        ctx.fillStyle = COLOR_TEXT_MUTED;
        ctx.font = '600 11px "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(label.toUpperCase(), textX, y + 22);

        // Name
        ctx.fillStyle = COLOR_TEXT;
        ctx.font = '700 15px "Segoe UI", system-ui, sans-serif';
        ctx.fillText(truncateText(ctx, name, textW), textX, y + 40);

        return h;
    }

    // ── Main card generator ─────────────────────────────────────────

    function generateCard(result, mode) {
        if (!result) return Promise.reject(new Error('No loadout'));

        return loadAllImages(result).then(function (images) {
            var canvas = document.createElement('canvas');
            canvas.width = CARD_W;
            canvas.height = CARD_H;
            var ctx = canvas.getContext('2d');

            // === BACKGROUND ===
            ctx.fillStyle = COLOR_BG;
            ctx.fillRect(0, 0, CARD_W, CARD_H);

            // Subtle grid
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
            ctx.lineWidth = 1;
            for (var gx = 0; gx < CARD_W; gx += 40) {
                ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, CARD_H); ctx.stroke();
            }
            for (var gy = 0; gy < CARD_H; gy += 40) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(CARD_W, gy); ctx.stroke();
            }

            // Top gradient glow
            var topGrad = ctx.createLinearGradient(0, 0, 0, 100);
            topGrad.addColorStop(0, 'rgba(245, 197, 24, 0.08)');
            topGrad.addColorStop(1, 'rgba(245, 197, 24, 0)');
            ctx.fillStyle = topGrad;
            ctx.fillRect(0, 0, CARD_W, 100);

            // === TOP ACCENT LINE ===
            ctx.fillStyle = COLOR_PRIMARY;
            ctx.fillRect(20, 0, CARD_W - 40, 3);

            // === CORNER MARKS ===
            var cm = 16; // corner mark length
            ctx.strokeStyle = COLOR_PRIMARY;
            ctx.lineWidth = 2;
            // Top-left
            ctx.beginPath(); ctx.moveTo(6, 6 + cm); ctx.lineTo(6, 6); ctx.lineTo(6 + cm, 6); ctx.stroke();
            // Top-right
            ctx.beginPath(); ctx.moveTo(CARD_W - 6 - cm, 6); ctx.lineTo(CARD_W - 6, 6); ctx.lineTo(CARD_W - 6, 6 + cm); ctx.stroke();
            // Bottom-left
            ctx.beginPath(); ctx.moveTo(6, CARD_H - 6 - cm); ctx.lineTo(6, CARD_H - 6); ctx.lineTo(6 + cm, CARD_H - 6); ctx.stroke();
            // Bottom-right
            ctx.beginPath(); ctx.moveTo(CARD_W - 6 - cm, CARD_H - 6); ctx.lineTo(CARD_W - 6, CARD_H - 6); ctx.lineTo(CARD_W - 6, CARD_H - 6 - cm); ctx.stroke();

            // === HEADER ===
            ctx.fillStyle = COLOR_PRIMARY;
            ctx.font = 'bold 26px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('HELLDIVERS 2 LOADOUT', CARD_W / 2, 42);

            // Mode badge
            var modeConf = MODE_CONFIG[mode] || MODE_CONFIG['balanced'];
            ctx.font = 'bold 11px "Segoe UI", system-ui, sans-serif';
            var badgeText = modeConf.label;
            var badgeW = ctx.measureText(badgeText).width + 22;
            var badgeX = (CARD_W - badgeW) / 2;
            var badgeY = 52;

            roundRect(ctx, badgeX, badgeY, badgeW, 20, 4);
            ctx.fillStyle = modeConf.color;
            ctx.globalAlpha = 0.15;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.strokeStyle = modeConf.color;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.fillStyle = modeConf.color;
            ctx.textAlign = 'center';
            ctx.fillText(badgeText, CARD_W / 2, badgeY + 14);

            // === DIVIDER ===
            var divY = 82;
            ctx.beginPath();
            ctx.moveTo(40, divY);
            ctx.lineTo(CARD_W - 40, divY);
            ctx.strokeStyle = COLOR_BORDER;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Diamond
            ctx.fillStyle = COLOR_PRIMARY;
            ctx.save();
            ctx.translate(CARD_W / 2, divY);
            ctx.rotate(Math.PI / 4);
            ctx.fillRect(-4, -4, 8, 8);
            ctx.restore();

            // === CONTENT AREA ===
            var colLeftX = 36;
            var colW = 545;
            var rowH = 54;
            var rowGap = 5;
            var startY = 96;

            // ── Left column: Equipment (all 5 items, uniform) ──
            ctx.fillStyle = COLOR_TEXT_MUTED;
            ctx.font = '700 10px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillText('EQUIPMENT', colLeftX, startY);

            var y = startY + 10;
            y += drawItemRow(ctx, 'Primary', result.primaryWeapon.name, colLeftX, y, colW, rowH, COLOR_PRIMARY, images.primaryWeapon, 'PRI') + rowGap;
            y += drawItemRow(ctx, 'Secondary', result.secondaryWeapon.name, colLeftX, y, colW, rowH, COLOR_PRIMARY, images.secondaryWeapon, 'SEC') + rowGap;
            y += drawItemRow(ctx, 'Throwable', result.throwable.name, colLeftX, y, colW, rowH, COLOR_PRIMARY, images.throwable, 'THR') + rowGap;

            var armorName = result.armor.weightClass + ' — ' + result.armor.passiveName;
            y += drawItemRow(ctx, 'Armor', armorName, colLeftX, y, colW, rowH, COLOR_PRIMARY, images.armor, 'ARM') + rowGap;

            // Booster — same row style, no separate header
            drawItemRow(ctx, 'Booster', result.booster.name, colLeftX, y, colW, rowH, COLOR_PRIMARY, images.booster, 'BST');

            // ── Right column: Stratagems ──
            var colRightX = 620;
            var colRightW = 544;

            ctx.fillStyle = COLOR_TEXT_MUTED;
            ctx.font = '700 10px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('STRATAGEMS', colRightX, startY);

            var sy = startY + 10;
            // Slightly taller rows to fill column evenly with equipment
            var stratRowH = 58;
            var stratGap = Math.floor((y + rowH - (startY + 10) - stratRowH * 4) / 3);
            if (stratGap < 4) stratGap = 4;

            for (var s = 0; s < result.stratagems.length; s++) {
                var strat = result.stratagems[s];
                var stratColor = (strat.category && STRAT_COLORS[strat.category]) || '#4a9eff';
                var stratLabel = (strat.category && STRAT_LABELS[strat.category]) || 'STR';
                sy += drawItemRow(ctx, 'Stratagem ' + (s + 1), strat.name, colRightX, sy, colRightW, stratRowH, stratColor, images['strat' + s], stratLabel) + stratGap;
            }

            // === FOOTER ===
            var footerY = CARD_H - 40;

            // Separator line
            ctx.beginPath();
            ctx.moveTo(36, footerY);
            ctx.lineTo(CARD_W - 36, footerY);
            ctx.strokeStyle = COLOR_BORDER;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Brand: < BUILT ON BREAK >
            ctx.font = 'bold 16px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'left';
            ctx.fillStyle = COLOR_BRAND_ORANGE;
            var brandY = footerY + 24;
            ctx.fillText('<', 36, brandY);
            var bw = ctx.measureText('< ').width;
            ctx.fillStyle = COLOR_TEXT;
            ctx.fillText('BUILT ON BREAK', 36 + bw - 2, brandY);
            var afterBrand = 36 + bw - 2 + ctx.measureText('BUILT ON BREAK ').width;
            ctx.fillStyle = COLOR_BRAND_ORANGE;
            ctx.fillText('>', afterBrand - 2, brandY);

            // CTA + URL (right side, two lines)
            ctx.textAlign = 'right';
            ctx.fillStyle = COLOR_PRIMARY;
            ctx.font = 'bold 13px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('Roll your own loadout', CARD_W - 36, footerY + 18);
            ctx.fillStyle = COLOR_TEXT_MUTED;
            ctx.font = '600 12px "Segoe UI", system-ui, sans-serif';
            ctx.fillText('builtonbreak.com/hd2', CARD_W - 36, footerY + 34);

            // === DOWNLOAD ===
            try {
                var dataURL = canvas.toDataURL('image/png');
                var link = document.createElement('a');
                link.download = 'hd2-loadout.png';
                link.href = dataURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return Promise.resolve();
            } catch (e) {
                return Promise.reject(new Error('Could not generate image'));
            }
        });
    }

    return {
        generateCard: generateCard
    };

})();
