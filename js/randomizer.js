/**
 * Core randomization logic for Balanced, Mission Ready, and Chaos modes.
 * Mission Ready mode is faction-aware with 3-dimensional scoring.
 */
window.HD2Randomizer = (function () {

    var currentFaction = 'random';
    var lastRolledFaction = null;
    var factionPool = ['terminids', 'automatons', 'illuminate'];

    /**
     * Resolve faction — if "random", pick one from the pool.
     */
    function resolveFaction() {
        if (currentFaction === 'random') {
            lastRolledFaction = factionPool[Math.floor(Math.random() * factionPool.length)];
            return lastRolledFaction;
        }
        lastRolledFaction = currentFaction;
        return currentFaction;
    }

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
     * Check if primary weapon is one-handed (can use with ballistic/directional shield).
     * All SMGs except Reprimand, plus the Exploding Crossbow.
     */
    function isOneHandedPrimary(primary) {
        if (!primary) return false;
        if (primary.category === 'SMG' && primary.id !== 'smg32-reprimand') return true;
        if (primary.id === 'cb9-exploding-crossbow') return true;
        return false;
    }

    /**
     * Filter out hand-shield stratagems if primary is two-handed.
     */
    function filterHandShields(stratagems, primary) {
        if (isOneHandedPrimary(primary)) return stratagems;
        var config = HD2Data.factionConfig;
        if (!config.requiresOneHanded) return stratagems;
        return stratagems.filter(function (s) {
            return !config.requiresOneHanded[s.id];
        });
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

        // Max 1 expendable AT weapon
        var expendableATCount = 0;
        for (var i = 0; i < hypothetical.length; i++) {
            if (hypothetical[i].category === 'support-weapon' && hypothetical[i].subcategory === 'expendable' && (hypothetical[i].atScore || 0) >= 1) {
                expendableATCount++;
            }
        }
        if (expendableATCount > 1) return true;

        // No persistent AT + expendable AT overlap
        // Persistent AT = main support weapon with atScore >= 2 (unless allowExpendableAT)
        // Expendable AT = expendable support weapon with atScore >= 1
        var hasPersistentAT = false;
        var hasExpendableAT = false;
        for (var i = 0; i < hypothetical.length; i++) {
            var s = hypothetical[i];
            if (s.category === 'support-weapon' && s.subcategory === 'main' && (s.atScore || 0) >= 2 && !s.allowExpendableAT) {
                hasPersistentAT = true;
            }
            if (s.category === 'support-weapon' && s.subcategory === 'expendable' && (s.atScore || 0) >= 1) {
                hasExpendableAT = true;
            }
        }
        if (hasPersistentAT && hasExpendableAT) return true;

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

    // =========================================================================
    // Faction-Aware Mission Ready Mode
    // =========================================================================

    /**
     * Get an item's effective score for a given dimension and faction.
     * Checks faction overrides first, then falls back to item's base score.
     */
    function getScore(item, dimension, faction) {
        var config = HD2Data.factionConfig;
        var overrides = config.factionScoreOverrides[faction];
        if (overrides && overrides[item.id] && overrides[item.id][dimension] !== undefined) {
            return overrides[item.id][dimension];
        }
        return item[dimension] || 0;
    }

    /**
     * Calculate a stratagem's synergy weight based on how much it addresses
     * remaining scoring deficits vs how redundant it would be.
     */
    function getStratagemColor(s) {
        if (s.category === 'support-weapon' || s.category === 'backpack' || s.category === 'vehicle') return 'blue';
        if (s.category === 'orbital' || s.category === 'eagle') return 'red';
        return 'green'; // sentry, emplacement
    }

    function calcSynergyWeight(candidate, deficits, faction, config, colorCounts) {
        var weight = 1; // base weight

        // How much does this candidate help fill remaining gaps?
        var contribution = 0;
        var cc = getScore(candidate, 'ccScore', faction);
        var elite = getScore(candidate, 'eliteScore', faction);
        var at = getScore(candidate, 'atScore', faction);

        contribution += Math.min(cc, Math.max(0, deficits.cc));
        contribution += Math.min(elite, Math.max(0, deficits.elite));
        contribution += Math.min(at, Math.max(0, deficits.at));

        // Light penalty for overshoot in already-met dimensions
        var overshoot = 0;
        if (deficits.cc <= 0) overshoot += cc * 0.3;
        if (deficits.elite <= 0) overshoot += elite * 0.3;
        if (deficits.at <= 0) overshoot += at * 0.3;

        weight += contribution * 2;
        weight = Math.max(0.5, weight - overshoot);

        // When thresholds are met, give curated utility items a nudge
        if (deficits.cc <= 0 && deficits.elite <= 0 && deficits.at <= 0) {
            var nudge = config.utilityNudge[candidate.id];
            if (nudge) weight += nudge;
        }

        // Category balance weights (compensate for pool size imbalance)
        if (candidate.category === 'orbital' || candidate.category === 'eagle') {
            weight *= config.redStratagemWeight;
        }
        if (candidate.category === 'sentry' || candidate.category === 'emplacement') {
            weight *= config.greenStratagemWeight;
        }

        // Color diversity — penalize a color that already has 2+ picks
        if (colorCounts) {
            var color = getStratagemColor(candidate);
            if (colorCounts[color] >= 2) weight *= 0.2;
        }

        return weight;
    }

    /**
     * Pick from candidates using synergy-aware weighted random selection.
     */
    function synergyWeightedPick(candidates, deficits, faction, config, colorCounts) {
        var weights = [];
        var totalWeight = 0;

        for (var i = 0; i < candidates.length; i++) {
            var w = calcSynergyWeight(candidates[i], deficits, faction, config, colorCounts);
            weights.push(w);
            totalWeight += w;
        }

        var r = Math.random() * totalWeight;
        var cumulative = 0;
        for (var i = 0; i < candidates.length; i++) {
            cumulative += weights[i];
            if (r < cumulative) return candidates[i];
        }
        return candidates[candidates.length - 1];
    }

    /**
     * Update deficits after adding an item to the loadout.
     */
    function updateDeficits(deficits, item, faction) {
        deficits.cc -= getScore(item, 'ccScore', faction);
        deficits.elite -= getScore(item, 'eliteScore', faction);
        deficits.at -= getScore(item, 'atScore', faction);
    }

    /**
     * Randomize stratagems in faction-aware Mission Ready mode.
     * Uses 3-dimensional scoring with synergy-aware weighted selection.
     */
    function randomizeMissionReady(enabledStratagems, weaponScores, faction, maxRetries) {
        var config = HD2Data.factionConfig;
        var thresholds = config.thresholds[faction] || config.thresholds.any;
        maxRetries = maxRetries || 200;

        for (var attempt = 0; attempt < maxRetries; attempt++) {
            // Calculate deficits: how much each dimension still needs from stratagems
            var deficits = {
                cc: thresholds.cc - weaponScores.cc,
                elite: thresholds.elite - weaponScores.elite,
                at: thresholds.at - weaponScores.at
            };

            // Phase 1: Guarantee at least 1 support weapon or vehicle
            var supportPool = enabledStratagems.filter(function (s) {
                return s.category === 'support-weapon' || s.category === 'vehicle';
            });

            if (supportPool.length === 0) {
                return { error: 'No support weapons or vehicles are enabled. Enable at least one.' };
            }

            // Prefer support weapons that address the largest deficit
            var colorCounts = { blue: 0, red: 0, green: 0 };
            var firstPick = synergyWeightedPick(supportPool, deficits, faction, config, colorCounts);
            var selected = [firstPick];
            updateDeficits(deficits, firstPick, faction);
            colorCounts[getStratagemColor(firstPick)]++;

            var failed = false;

            // Phase 2: Fill remaining 3 slots with synergy-aware weighted random
            for (var slot = 1; slot < 4; slot++) {
                var candidates = enabledStratagems.filter(function (s) {
                    for (var j = 0; j < selected.length; j++) {
                        if (selected[j].id === s.id) return false;
                    }
                    return !wouldViolateConstraints(s, selected);
                });

                if (candidates.length === 0) {
                    failed = true;
                    break;
                }

                var pick = synergyWeightedPick(candidates, deficits, faction, config, colorCounts);
                selected.push(pick);
                updateDeficits(deficits, pick, faction);
                colorCounts[getStratagemColor(pick)]++;
            }

            if (failed || selected.length !== 4) continue;

            // Validate: all three thresholds met
            var totalCC = weaponScores.cc;
            var totalElite = weaponScores.elite;
            var totalAT = weaponScores.at;
            for (var i = 0; i < selected.length; i++) {
                totalCC += getScore(selected[i], 'ccScore', faction);
                totalElite += getScore(selected[i], 'eliteScore', faction);
                totalAT += getScore(selected[i], 'atScore', faction);
            }

            if (totalCC < thresholds.cc) continue;
            if (totalElite < thresholds.elite) continue;
            if (totalAT < thresholds.at) continue;

            return { stratagems: shuffle(selected) };
        }

        return { error: 'Could not generate a viable mission ready loadout. Try enabling more stratagems or selecting a different faction.' };
    }

    /**
     * Check if a loadout has at least one way to close objectives.
     * Checks primary, secondary, throwable, and stratagems.
     */
    function canCloseObjectives(result) {
        if (result.primaryWeapon && result.primaryWeapon.closesObjectives) return true;
        if (result.secondaryWeapon && result.secondaryWeapon.closesObjectives) return true;
        if (result.throwable && result.throwable.closesObjectives) return true;

        var config = HD2Data.missionReadyConfig;
        for (var i = 0; i < result.stratagems.length; i++) {
            if (config.closesObjectives[result.stratagems[i].id]) return true;
        }

        return false;
    }

    /**
     * Check if loadout meets hard requirements for the given faction.
     */
    function meetsHardRequirements(result, faction) {
        var config = HD2Data.factionConfig;
        var reqs = config.hardRequirements[faction] || config.hardRequirements.any;

        // Check objective closing
        if (reqs.closesObjectives && !canCloseObjectives(result)) return false;

        // Check minimum single-item AT score
        if (reqs.minSingleAT > 0) {
            var found = false;
            // Check weapons
            if ((result.primaryWeapon.atScore || 0) >= reqs.minSingleAT) found = true;
            if (!found && (result.secondaryWeapon.atScore || 0) >= reqs.minSingleAT) found = true;
            if (!found && (result.throwable.atScore || 0) >= reqs.minSingleAT) found = true;
            // Check stratagems
            if (!found) {
                for (var i = 0; i < result.stratagems.length; i++) {
                    if (getScore(result.stratagems[i], 'atScore', faction) >= reqs.minSingleAT) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found) return false;
        }

        return true;
    }

    /**
     * Light tier weighting for weapons/throwables.
     * Uses base scores (not faction-specific) to gently nudge toward
     * more capable items. Zero-score items still appear, just less often.
     * A weapon with 0 total score gets weight 0.6, a weapon with 3+ gets ~1.5.
     */
    function pickTierWeighted(pool) {
        var weights = [];
        var totalWeight = 0;

        for (var i = 0; i < pool.length; i++) {
            var item = pool[i];
            var total = (item.ccScore || 0) + (item.eliteScore || 0) + (item.atScore || 0);
            // Base 0.6 for zero-score items, scales up gently
            var w = 0.6 + total * 0.3;
            weights.push(w);
            totalWeight += w;
        }

        var r = Math.random() * totalWeight;
        var cumulative = 0;
        for (var i = 0; i < pool.length; i++) {
            cumulative += weights[i];
            if (r < cumulative) return pool[i];
        }
        return pool[pool.length - 1];
    }

    /**
     * Weighted pick for armor based on faction preferences.
     */
    function pickFactionArmor(enabledArmor, faction) {
        var config = HD2Data.factionConfig;
        var weightPref = config.armorWeightPreference[faction] || config.armorWeightPreference.any;
        var passiveAff = config.armorPassiveAffinity;

        var weights = [];
        var totalWeight = 0;

        for (var i = 0; i < enabledArmor.length; i++) {
            var armor = enabledArmor[i];
            var w = 1;

            // Weight class preference
            var classMult = weightPref[armor.weightClass] || 1;
            w *= classMult;

            // Passive affinity
            if (passiveAff[armor.passive]) {
                var affinity = passiveAff[armor.passive][faction] || 1;
                w *= affinity;
            }

            weights.push(w);
            totalWeight += w;
        }

        var r = Math.random() * totalWeight;
        var cumulative = 0;
        for (var i = 0; i < enabledArmor.length; i++) {
            cumulative += weights[i];
            if (r < cumulative) return enabledArmor[i];
        }
        return enabledArmor[enabledArmor.length - 1];
    }

    /**
     * Weighted pick for boosters based on faction preferences.
     */
    function pickFactionBooster(enabledBoosters, faction) {
        var config = HD2Data.factionConfig;
        var boosterAff = config.boosterAffinity;

        var weights = [];
        var totalWeight = 0;

        for (var i = 0; i < enabledBoosters.length; i++) {
            var booster = enabledBoosters[i];
            var w = 1;

            if (boosterAff[booster.id]) {
                w = boosterAff[booster.id][faction] || 1;
            }

            weights.push(w);
            totalWeight += w;
        }

        var r = Math.random() * totalWeight;
        var cumulative = 0;
        for (var i = 0; i < enabledBoosters.length; i++) {
            cumulative += weights[i];
            if (r < cumulative) return enabledBoosters[i];
        }
        return enabledBoosters[enabledBoosters.length - 1];
    }

    /**
     * Main randomization function.
     */
    function randomize(mode) {
        var maxAttempts = (mode === 'chaos') ? 1 : 50;
        var faction = (mode === 'mission-ready') ? resolveFaction() : (currentFaction || 'random');

        for (var attempt = 0; attempt < maxAttempts; attempt++) {
            var enabledPrimary = HD2Filters.getEnabledItems(HD2Data.primaryWeapons);
            var enabledSecondary = HD2Filters.getEnabledItems(HD2Data.secondaryWeapons);
            var enabledThrowables = HD2Filters.getEnabledItems(HD2Data.throwables);
            var enabledArmor = HD2Filters.getEnabledItems(HD2Data.armorCombos);
            var enabledBoosters = HD2Filters.getEnabledItems(HD2Data.boosters);

            var isMR = mode === 'mission-ready';
            var result = {
                primaryWeapon: isMR ? pickTierWeighted(enabledPrimary) : pickRandom(enabledPrimary),
                secondaryWeapon: isMR ? pickTierWeighted(enabledSecondary) : pickRandom(enabledSecondary),
                throwable: isMR ? pickTierWeighted(enabledThrowables) : pickRandom(enabledThrowables),
                armor: (isMR && enabledArmor.length > 0)
                    ? pickFactionArmor(enabledArmor, faction)
                    : pickRandom(enabledArmor),
                booster: (mode === 'mission-ready' && enabledBoosters.length > 0)
                    ? pickFactionBooster(enabledBoosters, faction)
                    : pickRandom(enabledBoosters),
                stratagems: null,
                error: null
            };

            // Check minimum items
            if (!result.primaryWeapon) return { error: 'No primary weapons enabled.' };
            if (!result.secondaryWeapon) return { error: 'No secondary weapons enabled.' };
            if (!result.throwable) return { error: 'No throwables enabled.' };
            if (!result.armor) return { error: 'No armor combos enabled.' };
            if (!result.booster) return { error: 'No boosters enabled.' };

            var enabledStratagems = filterHandShields(
                HD2Filters.getEnabledItems(HD2Data.stratagems), result.primaryWeapon);

            var stratagemResult;
            if (mode === 'chaos') {
                stratagemResult = randomizeChaos(enabledStratagems);
            } else if (mode === 'mission-ready') {
                // Calculate 3D weapon scores using faction overrides
                var weaponScores = {
                    cc: getScore(result.primaryWeapon, 'ccScore', faction) +
                        getScore(result.secondaryWeapon, 'ccScore', faction) +
                        getScore(result.throwable, 'ccScore', faction),
                    elite: getScore(result.primaryWeapon, 'eliteScore', faction) +
                           getScore(result.secondaryWeapon, 'eliteScore', faction) +
                           getScore(result.throwable, 'eliteScore', faction),
                    at: getScore(result.primaryWeapon, 'atScore', faction) +
                        getScore(result.secondaryWeapon, 'atScore', faction) +
                        getScore(result.throwable, 'atScore', faction)
                };
                stratagemResult = randomizeMissionReady(enabledStratagems, weaponScores, faction);
            } else {
                stratagemResult = randomizeBalanced(enabledStratagems);
            }

            if (stratagemResult.error) {
                return { error: stratagemResult.error };
            }

            result.stratagems = stratagemResult.stratagems;

            // For mission-ready, check hard requirements (includes objective closing)
            if (mode === 'mission-ready') {
                if (meetsHardRequirements(result, faction)) {
                    return result;
                }
                continue;
            }

            // For balanced, just check objective closing
            if (mode === 'chaos' || canCloseObjectives(result)) {
                return result;
            }
            // Otherwise retry with a new roll
        }

        // Fallback: return the last result even if it doesn't fully validate
        return result;
    }

    /**
     * Reroll a single slot, returning the new item.
     * slotType: 'primary', 'secondary', 'throwable', 'armor', 'booster', 'strat-0'..'strat-3'
     */
    function rerollSlot(slotType, currentResult, mode) {
        var faction = lastRolledFaction || resolveFaction();

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
            var pickPool = filtered.length > 0 ? filtered : pool;
            if (pickPool.length === 0) return { error: 'No items enabled for this slot.' };

            var pick;
            if (mode === 'mission-ready') {
                if (slotType === 'armor') {
                    pick = pickFactionArmor(pickPool, faction);
                } else if (slotType === 'booster') {
                    pick = pickFactionBooster(pickPool, faction);
                } else {
                    pick = pickTierWeighted(pickPool);
                }
            } else {
                pick = pickRandom(pickPool);
            }

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

            var enabledStratagems = filterHandShields(
                HD2Filters.getEnabledItems(HD2Data.stratagems), currentResult.primaryWeapon);

            var candidates;
            if (mode === 'balanced' || mode === 'mission-ready') {
                candidates = enabledStratagems.filter(function (s) {
                    for (var j = 0; j < others.length; j++) {
                        if (others[j].id === s.id) return false;
                    }
                    if (s.id === currentStrat.id) return false;
                    return !wouldViolateConstraints(s, others);
                });
            } else {
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
                    if (mode === 'balanced' || mode === 'mission-ready') return !wouldViolateConstraints(s, others);
                    return true;
                });
            }

            if (candidates.length === 0) return { error: 'No valid stratagems available for this slot.' };

            // Mission Ready mode uses synergy-aware weighted pick
            var pick;
            if (mode === 'mission-ready') {
                var config = HD2Data.factionConfig;
                // Calculate current loadout scores from weapons + other 3 stratagems
                var currentScores = {
                    cc: getScore(currentResult.primaryWeapon, 'ccScore', faction) +
                        getScore(currentResult.secondaryWeapon, 'ccScore', faction) +
                        getScore(currentResult.throwable, 'ccScore', faction),
                    elite: getScore(currentResult.primaryWeapon, 'eliteScore', faction) +
                           getScore(currentResult.secondaryWeapon, 'eliteScore', faction) +
                           getScore(currentResult.throwable, 'eliteScore', faction),
                    at: getScore(currentResult.primaryWeapon, 'atScore', faction) +
                        getScore(currentResult.secondaryWeapon, 'atScore', faction) +
                        getScore(currentResult.throwable, 'atScore', faction)
                };
                for (var i = 0; i < others.length; i++) {
                    currentScores.cc += getScore(others[i], 'ccScore', faction);
                    currentScores.elite += getScore(others[i], 'eliteScore', faction);
                    currentScores.at += getScore(others[i], 'atScore', faction);
                }
                var thresholds = config.thresholds[faction] || config.thresholds.any;
                var deficits = {
                    cc: thresholds.cc - currentScores.cc,
                    elite: thresholds.elite - currentScores.elite,
                    at: thresholds.at - currentScores.at
                };
                pick = synergyWeightedPick(candidates, deficits, faction, config);
            } else {
                pick = pickRandom(candidates);
            }
            return { item: pick, key: 'strat', index: stratIndex };
        }

        return { error: 'Unknown slot type.' };
    }

    /**
     * Generate 4 complementary loadouts for a full squad.
     * Stratagems are unique across all players; weapons/armor/boosters may overlap.
     */
    function randomizeSquad(mode) {
        var usedStratIds = {};
        var usedBoosterIds = {};
        var loadouts = [];
        var retries = 0;
        var maxRetries = 50;
        var faction = (mode === 'mission-ready') ? resolveFaction() : (currentFaction || 'random');

        for (var p = 0; p < 4; p++) {
            // Boosters are unique across squad when possible
            var availableBoosters = HD2Filters.getEnabledItems(HD2Data.boosters).filter(function (b) {
                return !usedBoosterIds[b.id];
            });
            if (availableBoosters.length === 0) {
                availableBoosters = HD2Filters.getEnabledItems(HD2Data.boosters);
            }

            var enabledArmor = HD2Filters.getEnabledItems(HD2Data.armorCombos);

            var sqMR = mode === 'mission-ready';

            var result = {
                primaryWeapon: pickRandom(HD2Filters.getEnabledItems(HD2Data.primaryWeapons)),
                secondaryWeapon: pickRandom(HD2Filters.getEnabledItems(HD2Data.secondaryWeapons)),
                throwable: pickRandom(HD2Filters.getEnabledItems(HD2Data.throwables)),
                armor: (sqMR && enabledArmor.length > 0)
                    ? pickFactionArmor(enabledArmor, faction)
                    : pickRandom(enabledArmor),
                booster: (mode === 'mission-ready' && availableBoosters.length > 0)
                    ? pickFactionBooster(availableBoosters, faction)
                    : pickRandom(availableBoosters),
                stratagems: null,
                error: null
            };

            if (!result.primaryWeapon) return { error: 'No primary weapons enabled.' };
            if (!result.secondaryWeapon) return { error: 'No secondary weapons enabled.' };
            if (!result.throwable) return { error: 'No throwables enabled.' };
            if (!result.armor) return { error: 'No armor combos enabled.' };
            if (!result.booster) return { error: 'No boosters enabled.' };

            // Filter out stratagems already used by other players, and hand-shields if primary is two-handed
            var enabledStratagems = filterHandShields(
                HD2Filters.getEnabledItems(HD2Data.stratagems), result.primaryWeapon
            ).filter(function (s) {
                return !usedStratIds[s.id];
            });

            var stratagemResult;
            if (mode === 'chaos') {
                stratagemResult = randomizeChaos(enabledStratagems);
            } else if (mode === 'mission-ready') {
                var weaponScores = {
                    cc: getScore(result.primaryWeapon, 'ccScore', faction) +
                        getScore(result.secondaryWeapon, 'ccScore', faction) +
                        getScore(result.throwable, 'ccScore', faction),
                    elite: getScore(result.primaryWeapon, 'eliteScore', faction) +
                           getScore(result.secondaryWeapon, 'eliteScore', faction) +
                           getScore(result.throwable, 'eliteScore', faction),
                    at: getScore(result.primaryWeapon, 'atScore', faction) +
                        getScore(result.secondaryWeapon, 'atScore', faction) +
                        getScore(result.throwable, 'atScore', faction)
                };
                stratagemResult = randomizeMissionReady(enabledStratagems, weaponScores, faction);
            } else {
                stratagemResult = randomizeBalanced(enabledStratagems);
            }

            if (stratagemResult.error) {
                return { error: 'Player ' + (p + 1) + ': ' + stratagemResult.error };
            }

            result.stratagems = stratagemResult.stratagems;

            // For mission-ready, check hard requirements
            if (mode === 'mission-ready') {
                if (!meetsHardRequirements(result, faction) && retries < maxRetries) {
                    retries++;
                    p--;
                    continue;
                }
            } else if (mode !== 'chaos' && !canCloseObjectives(result) && retries < maxRetries) {
                retries++;
                p--;
                continue;
            }

            // Mark these stratagems and booster as used
            for (var i = 0; i < result.stratagems.length; i++) {
                usedStratIds[result.stratagems[i].id] = true;
            }
            usedBoosterIds[result.booster.id] = true;

            loadouts.push(result);
        }

        return { loadouts: loadouts };
    }

    /**
     * Set the current faction for Mission Ready mode.
     */
    function setFaction(faction) {
        currentFaction = faction || 'random';
    }

    /**
     * Get the current faction setting.
     */
    function getFaction() {
        return currentFaction;
    }

    /**
     * Get the faction that was actually used in the last roll.
     * When set to "random", this returns which faction was picked.
     */
    function getLastRolledFaction() {
        return lastRolledFaction;
    }

    return {
        randomize: randomize,
        rerollSlot: rerollSlot,
        randomizeSquad: randomizeSquad,
        setFaction: setFaction,
        getFaction: getFaction,
        getLastRolledFaction: getLastRolledFaction
    };
})();
