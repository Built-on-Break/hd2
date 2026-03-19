/**
 * Daily Challenge — deterministic loadout based on date.
 * Same loadout for everyone worldwide on the same day.
 * Uses all items regardless of user filter settings.
 */
window.HD2Daily = (function () {

    /**
     * Simple seeded PRNG (mulberry32).
     * Returns a function that produces deterministic floats in [0, 1).
     */
    function seededRandom(seed) {
        return function () {
            seed |= 0;
            seed = seed + 0x6D2B79F5 | 0;
            var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    /**
     * Convert a date string to a numeric seed.
     */
    function dateToSeed(dateStr) {
        var hash = 0;
        for (var i = 0; i < dateStr.length; i++) {
            hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }

    /**
     * Pick a random element from an array using the seeded RNG.
     */
    function seededPick(arr, rng) {
        return arr[Math.floor(rng() * arr.length)];
    }

    /**
     * Seeded Fisher-Yates shuffle.
     */
    function seededShuffle(arr, rng) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(rng() * (i + 1));
            var temp = a[i];
            a[i] = a[j];
            a[j] = temp;
        }
        return a;
    }

    /**
     * Get today's date string in YYYY-MM-DD format (UTC).
     */
    function getTodayString() {
        var now = new Date();
        var y = now.getUTCFullYear();
        var m = String(now.getUTCMonth() + 1).padStart(2, '0');
        var d = String(now.getUTCDate()).padStart(2, '0');
        return y + '-' + m + '-' + d;
    }

    /**
     * Generate the daily challenge loadout.
     * Uses ALL items (ignores filters) so everyone gets the same result.
     * Applies balanced-style constraints for playability.
     */
    function generateDaily() {
        var dateStr = getTodayString();
        var seed = dateToSeed('hd2-daily-' + dateStr);
        var rng = seededRandom(seed);

        var result = {
            date: dateStr,
            primaryWeapon: seededPick(HD2Data.primaryWeapons, rng),
            secondaryWeapon: seededPick(HD2Data.secondaryWeapons, rng),
            throwable: seededPick(HD2Data.throwables, rng),
            armor: seededPick(HD2Data.armorCombos, rng),
            booster: seededPick(HD2Data.boosters, rng),
            stratagems: null,
            difficulty: null
        };

        // Pick 4 unique stratagems with basic constraints
        var pool = seededShuffle(HD2Data.stratagems, rng);
        var selected = [];
        var backpackCount = 0;
        var vehicleCount = 0;

        for (var i = 0; i < pool.length && selected.length < 4; i++) {
            var s = pool[i];
            // No duplicates
            var isDupe = false;
            for (var j = 0; j < selected.length; j++) {
                if (selected[j].id === s.id) { isDupe = true; break; }
            }
            if (isDupe) continue;

            // Basic constraints
            if (s.hasBackpack && backpackCount >= 1) continue;
            if (s.category === 'vehicle' && vehicleCount >= 1) continue;

            selected.push(s);
            if (s.hasBackpack) backpackCount++;
            if (s.category === 'vehicle') vehicleCount++;
        }

        result.stratagems = selected;
        result.difficulty = calculateDifficulty(result);

        return result;
    }

    /**
     * Calculate a difficulty rating based on AT/CC scores.
     * Returns { label, score, color }
     */
    function calculateDifficulty(result) {
        var config = HD2Data.missionReadyConfig;

        // Total AT score
        var atScore = (result.primaryWeapon.atScore || 0) +
                      (result.secondaryWeapon.atScore || 0) +
                      (result.throwable.atScore || 0);
        for (var i = 0; i < result.stratagems.length; i++) {
            atScore += (result.stratagems[i].atScore || 0);
        }

        // Total CC score
        var ccScore = (result.primaryWeapon.ccScore || 0) +
                      (result.secondaryWeapon.ccScore || 0) +
                      (result.throwable.ccScore || 0);
        for (var i = 0; i < result.stratagems.length; i++) {
            ccScore += (config.crowdClear[result.stratagems[i].id] || 0);
        }

        // Rate difficulty for Super Helldive (difficulty 10)
        // Lower AT/CC scores = harder to survive
        var total = atScore + ccScore;

        if (total >= 10) return { label: 'MANAGEABLE', score: total, color: '#44ff88' };
        if (total >= 7)  return { label: 'TOUGH', score: total, color: '#f5c518' };
        if (total >= 4)  return { label: 'BRUTAL', score: total, color: '#ff8844' };
        return { label: 'SUICIDAL', score: total, color: '#ff4444' };
    }

    /**
     * Format the date for display.
     */
    function formatDate(dateStr) {
        var parts = dateStr.split('-');
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[parseInt(parts[1], 10) - 1] + ' ' + parseInt(parts[2], 10) + ', ' + parts[0];
    }

    return {
        generateDaily: generateDaily,
        getTodayString: getTodayString,
        formatDate: formatDate
    };
})();
