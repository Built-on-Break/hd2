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

    /**
     * Reroll a single slot, returning the new item.
     * slotType: 'primary', 'secondary', 'throwable', 'armor', 'booster', 'strat-0'..'strat-3'
     */
    function rerollSlot(slotType, currentResult, mode) {
        var dataMap = {
            'primary': HD2Data.primaryWeapons,
            'secondary': HD2Data.secondaryWeapons,
            'throwable': HD2Data.throwables,
            'armor': HD2Data.armorCombos,
            'booster': HD2Data.boosters
        };

        var resultKeyMap = {
            'primary': 'primaryWeapon',
            'secondary': 'secondaryWeapon',
            'throwable': 'throwable',
            'armor': 'armor',
            'booster': 'booster'
        };

        // Non-stratagem slots
        if (dataMap[slotType]) {
            var pool = HD2Filters.getEnabledItems(dataMap[slotType]);
            var currentItem = currentResult[resultKeyMap[slotType]];
            var filtered = pool.filter(function (item) {
                return item.id !== currentItem.id;
            });
            // Fall back to full pool if only 1 item enabled
            var pick = pickRandom(filtered.length > 0 ? filtered : pool);
            if (!pick) return { error: 'No items enabled for this slot.' };
            return { item: pick, key: resultKeyMap[slotType] };
        }

        // Stratagem slots
        var match = slotType.match(/^strat-(\d)$/);
        if (match) {
            var stratIndex = parseInt(match[1], 10);
            var currentStrat = currentResult.stratagems[stratIndex];

            // Build the other 3 stratagems
            var others = [];
            for (var i = 0; i < 4; i++) {
                if (i !== stratIndex) others.push(currentResult.stratagems[i]);
            }

            var enabledStratagems = HD2Filters.getEnabledItems(HD2Data.stratagems);

            var candidates;
            if (mode === 'balanced') {
                candidates = enabledStratagems.filter(function (s) {
                    // No duplicates with the other 3
                    for (var j = 0; j < others.length; j++) {
                        if (others[j].id === s.id) return false;
                    }
                    // Exclude current for variety
                    if (s.id === currentStrat.id) return false;
                    // Check constraints against the other 3
                    return !wouldViolateConstraints(s, others);
                });
            } else {
                // Chaos: only avoid duplicates within the 4
                candidates = enabledStratagems.filter(function (s) {
                    for (var j = 0; j < others.length; j++) {
                        if (others[j].id === s.id) return false;
                    }
                    if (s.id === currentStrat.id) return false;
                    return true;
                });
            }

            // Fall back to allowing same stratagem if no alternatives
            if (candidates.length === 0) {
                candidates = enabledStratagems.filter(function (s) {
                    for (var j = 0; j < others.length; j++) {
                        if (others[j].id === s.id) return false;
                    }
                    if (mode === 'balanced') return !wouldViolateConstraints(s, others);
                    return true;
                });
            }

            if (candidates.length === 0) return { error: 'No valid stratagems available for this slot.' };
            return { item: pickRandom(candidates), key: 'strat', index: stratIndex };
        }

        return { error: 'Unknown slot type.' };
    }

    return {
        randomize: randomize,
        rerollSlot: rerollSlot
    };
})();
