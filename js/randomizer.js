/**
 * Core randomization logic for both Balanced and Chaos modes.
 */
window.HD2Randomizer = (function () {

    /**
     * Pick a random element from an array.
     */
    function pickRandom(arr) {
        if (!arr || arr.length === 0) return null;
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Fisher-Yates shuffle (in-place, returns same array).
     */
    function shuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    }

    /**
     * Check if adding a candidate to the current selection would violate
     * any Balanced Mode constraint.
     */
    function wouldViolateConstraints(candidate, currentSelection) {
        var hypothetical = currentSelection.concat([candidate]);

        var backpackCount = 0;
        var supportCount = 0;
        var vehicleCount = 0;
        var mainSupportCount = 0;
        var sentryEmplacementCount = 0;
        var orbitalCount = 0;
        var eagleCount = 0;

        for (var i = 0; i < hypothetical.length; i++) {
            var s = hypothetical[i];
            if (s.hasBackpack) backpackCount++;
            if (s.category === 'support-weapon' || s.category === 'vehicle') supportCount++;
            if (s.category === 'vehicle') vehicleCount++;
            if (s.category === 'support-weapon' && s.subcategory === 'main') mainSupportCount++;
            if (s.category === 'sentry' || s.category === 'emplacement') sentryEmplacementCount++;
            if (s.category === 'orbital') orbitalCount++;
            if (s.category === 'eagle') eagleCount++;
        }

        if (backpackCount > 1) return true;            // Max 1 backpack
        if (supportCount > 2) return true;             // Max 2 support weapons + vehicles
        if (vehicleCount > 1) return true;             // Max 1 vehicle/exosuit
        if (mainSupportCount > 1) return true;         // Max 1 "main" support weapon
        if (sentryEmplacementCount > 2) return true;   // Max 2 sentries/emplacements
        if (orbitalCount > 2) return true;             // Max 2 orbitals
        if (eagleCount > 2) return true;               // Max 2 eagles

        return false;
    }

    /**
     * Randomize stratagems in Balanced Mode.
     * Guarantees at least 1 support weapon or vehicle.
     */
    function randomizeBalanced(enabledStratagems, maxRetries) {
        maxRetries = maxRetries || 100;

        for (var attempt = 0; attempt < maxRetries; attempt++) {
            // Phase 1: Guarantee at least 1 support weapon or vehicle
            var supportPool = enabledStratagems.filter(function (s) {
                return s.category === 'support-weapon' || s.category === 'vehicle';
            });

            if (supportPool.length === 0) {
                return { error: 'No support weapons or vehicles are enabled. Enable at least one, or switch to Chaos Mode.' };
            }

            var selected = [pickRandom(supportPool)];
            var failed = false;

            // Phase 2: Fill remaining 3 slots
            for (var slot = 1; slot < 4; slot++) {
                var candidates = enabledStratagems.filter(function (s) {
                    // No duplicates
                    for (var j = 0; j < selected.length; j++) {
                        if (selected[j].id === s.id) return false;
                    }
                    // Check constraints
                    return !wouldViolateConstraints(s, selected);
                });

                if (candidates.length === 0) {
                    failed = true;
                    break;
                }

                selected.push(pickRandom(candidates));
            }

            if (!failed && selected.length === 4) {
                return { stratagems: shuffle(selected) };
            }
        }

        return { error: 'Could not generate a valid balanced loadout with current filters. Try enabling more items.' };
    }

    /**
     * Randomize stratagems in Chaos Mode.
     * Only constraint: no duplicates.
     */
    function randomizeChaos(enabledStratagems) {
        if (enabledStratagems.length < 4) {
            return { error: 'Not enough stratagems enabled. Need at least 4, but only ' + enabledStratagems.length + ' are available.' };
        }

        var pool = shuffle(enabledStratagems.slice());
        return { stratagems: pool.slice(0, 4) };
    }

    /**
     * Main randomization function.
     */
    function randomize(mode) {
        var result = {
            primaryWeapon: pickRandom(HD2Filters.getEnabledItems(HD2Data.primaryWeapons)),
            secondaryWeapon: pickRandom(HD2Filters.getEnabledItems(HD2Data.secondaryWeapons)),
            throwable: pickRandom(HD2Filters.getEnabledItems(HD2Data.throwables)),
            armor: pickRandom(HD2Filters.getEnabledItems(HD2Data.armorCombos)),
            booster: pickRandom(HD2Filters.getEnabledItems(HD2Data.boosters)),
            stratagems: null,
            error: null
        };

        // Check minimum items
        if (!result.primaryWeapon) return { error: 'No primary weapons enabled.' };
        if (!result.secondaryWeapon) return { error: 'No secondary weapons enabled.' };
        if (!result.throwable) return { error: 'No throwables enabled.' };
        if (!result.armor) return { error: 'No armor combos enabled.' };
        if (!result.booster) return { error: 'No boosters enabled.' };

        var enabledStratagems = HD2Filters.getEnabledItems(HD2Data.stratagems);

        var stratagemResult;
        if (mode === 'chaos') {
            stratagemResult = randomizeChaos(enabledStratagems);
        } else {
            stratagemResult = randomizeBalanced(enabledStratagems);
        }

        if (stratagemResult.error) {
            return { error: stratagemResult.error };
        }

        result.stratagems = stratagemResult.stratagems;
        return result;
    }

    return {
        randomize: randomize
    };
})();
