/**
 * Main app entry point. Wires up events and initializes everything.
 */
(function () {
    var currentMode = 'balanced';
    var isFirstSoloRoll = true;
    var isFirstSquadRoll = true;
    var currentResult = null;
    var isSquadMode = false;
    var currentSquadResults = null;

    function doRandomize() {
        if (isSquadMode) {
            doSquadRandomize();
            return;
        }

        HD2UI.hideError();

        var result = HD2Randomizer.randomize(currentMode);

        if (result.error) {
            HD2UI.showError(result.error);
            return;
        }

        currentResult = result;

        // Remove pulse from randomize button
        document.getElementById('randomize-btn').classList.remove('randomize-btn--pulse');

        if (isFirstSoloRoll) {
            isFirstSoloRoll = false;
            var emptyEl = document.getElementById('loadout-empty');
            var loadoutEl = document.getElementById('loadout-display');

            // Fade out empty state, show randomize button
            emptyEl.classList.add('loadout-empty--fading');
            var randSection = document.getElementById('randomize-section');

            setTimeout(function () {
                emptyEl.style.display = 'none';
                loadoutEl.classList.remove('loadout--hidden');
                randSection.classList.remove('randomize-section--hidden');

                // Render content then casino reveal
                HD2UI.renderLoadout(result);
                HD2UI.casinoRevealCards();

                // Update URL hash so the loadout is shareable
                history.replaceState(null, '', HD2Sharing.encodeLoadout(result, currentMode));
            }, 300);
            return;
        }

        HD2UI.renderLoadout(result);
        HD2UI.casinoRevealCards();

        // Update URL hash so the loadout is shareable
        history.replaceState(null, '', HD2Sharing.encodeLoadout(result, currentMode));
    }

    function doSquadRandomize() {
        HD2UI.hideError();

        var squadResult = HD2Randomizer.randomizeSquad(currentMode);

        if (squadResult.error) {
            HD2UI.showError(squadResult.error);
            return;
        }

        currentSquadResults = squadResult.loadouts;

        // Remove pulse from randomize button
        document.getElementById('randomize-btn').classList.remove('randomize-btn--pulse');

        if (isFirstSquadRoll) {
            isFirstSquadRoll = false;
            var emptyEl = document.getElementById('loadout-empty');
            var randSection = document.getElementById('randomize-section');

            emptyEl.classList.add('loadout-empty--fading');

            setTimeout(function () {
                emptyEl.style.display = 'none';
                document.getElementById('squad-display').classList.remove('squad-display--hidden');
                randSection.classList.remove('randomize-section--hidden');

                HD2UI.renderSquadLoadout(currentSquadResults);
                HD2UI.staggerRevealSquadCards();

                history.replaceState(null, '', HD2Sharing.encodeSquadLoadout(currentSquadResults, currentMode));
            }, 300);
            return;
        }

        HD2UI.renderSquadLoadout(currentSquadResults);
        HD2UI.staggerRevealSquadCards();

        history.replaceState(null, '', HD2Sharing.encodeSquadLoadout(currentSquadResults, currentMode));
    }

    /**
     * Show the correct display state based on current mode and results.
     */
    function showCurrentView() {
        var soloLoadout = document.getElementById('loadout-display');
        var squadDisplay = document.getElementById('squad-display');
        var emptyEl = document.getElementById('loadout-empty');
        var randSection = document.getElementById('randomize-section');

        // Hide both displays first
        soloLoadout.classList.add('loadout--hidden');
        squadDisplay.classList.add('squad-display--hidden');

        if (isSquadMode) {
            if (currentSquadResults) {
                emptyEl.style.display = 'none';
                squadDisplay.classList.remove('squad-display--hidden');
                randSection.classList.remove('randomize-section--hidden');
                HD2UI.renderSquadLoadout(currentSquadResults);
                history.replaceState(null, '', HD2Sharing.encodeSquadLoadout(currentSquadResults, currentMode));
            } else {
                // No squad results yet — show empty state
                emptyEl.style.display = '';
                emptyEl.classList.remove('loadout-empty--fading');
                randSection.classList.add('randomize-section--hidden');
                document.getElementById('randomize-btn').classList.add('randomize-btn--pulse');
            }
        } else {
            if (currentResult) {
                emptyEl.style.display = 'none';
                soloLoadout.classList.remove('loadout--hidden');
                randSection.classList.remove('randomize-section--hidden');
                HD2UI.renderLoadout(currentResult);
                history.replaceState(null, '', HD2Sharing.encodeLoadout(currentResult, currentMode));
            } else {
                // No solo results yet — show empty state
                emptyEl.style.display = '';
                emptyEl.classList.remove('loadout-empty--fading');
                randSection.classList.add('randomize-section--hidden');
                document.getElementById('randomize-btn').classList.add('randomize-btn--pulse');
            }
        }
    }

    function initSquadToggle() {
        var btn = document.getElementById('squad-toggle-btn');
        HD2UI.buildSquadDOM();

        btn.addEventListener('click', function () {
            isSquadMode = !isSquadMode;
            btn.classList.toggle('active', isSquadMode);
            showCurrentView();
        });
    }

    function initModeSelector() {
        currentMode = HD2Storage.loadMode();
        HD2UI.setActiveMode(currentMode);

        document.querySelectorAll('.mode-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentMode = this.dataset.mode;
                HD2Storage.saveMode(currentMode);
                HD2UI.setActiveMode(currentMode);
            });
        });
    }

    function initModeHelp() {
        var btn = document.getElementById('mode-help-btn');
        var panel = document.getElementById('mode-help');
        btn.addEventListener('click', function () {
            panel.classList.toggle('mode-help--visible');
            btn.classList.toggle('active');
        });
    }

    function initRandomizeButton() {
        var btn = document.getElementById('randomize-btn');

        // Pulse animation to draw attention on first load
        btn.classList.add('randomize-btn--pulse');

        btn.addEventListener('click', function () {
            doRandomize();
        });
    }

    /**
     * Copy text to clipboard with fallback for non-HTTPS contexts.
     */
    function copyToClipboard(text, onSuccess) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(onSuccess).catch(function () {
                fallbackCopy(text, onSuccess);
            });
        } else {
            fallbackCopy(text, onSuccess);
        }
    }

    function fallbackCopy(text, onSuccess) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            if (onSuccess) onSuccess();
        } catch (e) {
            // Copy failed silently
        }
        document.body.removeChild(textarea);
    }

    function initCopyButton() {
        var btn = document.getElementById('copy-btn');
        btn.addEventListener('click', function () {
            var text;

            if (isSquadMode) {
                if (!currentSquadResults) return;
                var allLines = [];
                for (var p = 0; p < currentSquadResults.length; p++) {
                    var r = currentSquadResults[p];
                    allLines.push('=== Player ' + (p + 1) + ' ===');
                    allLines.push('Primary: ' + r.primaryWeapon.name);
                    allLines.push('Secondary: ' + r.secondaryWeapon.name);
                    allLines.push('Throwable: ' + r.throwable.name);
                    allLines.push('Armor: ' + r.armor.weightClass + ' - ' + r.armor.passiveName);
                    for (var i = 0; i < r.stratagems.length; i++) {
                        allLines.push('Stratagem ' + (i + 1) + ': ' + r.stratagems[i].name);
                    }
                    allLines.push('Booster: ' + r.booster.name);
                    if (p < 3) allLines.push('');
                }
                text = allLines.join('\n');
            } else {
                if (!currentResult) return;
                var lines = [];
                lines.push('Primary: ' + currentResult.primaryWeapon.name);
                lines.push('Secondary: ' + currentResult.secondaryWeapon.name);
                lines.push('Throwable: ' + currentResult.throwable.name);
                lines.push('Armor: ' + currentResult.armor.weightClass + ' - ' + currentResult.armor.passiveName);
                for (var i = 0; i < currentResult.stratagems.length; i++) {
                    lines.push('Stratagem ' + (i + 1) + ': ' + currentResult.stratagems[i].name);
                }
                lines.push('Booster: ' + currentResult.booster.name);
                text = lines.join('\n');
            }

            copyToClipboard(text, function () {
                btn.textContent = 'Copied!';
                btn.classList.add('copy-btn--copied');
                setTimeout(function () {
                    btn.textContent = 'Copy Loadout';
                    btn.classList.remove('copy-btn--copied');
                }, 1500);
            });
        });
    }

    function initShareButton() {
        var btn = document.getElementById('share-btn');
        btn.addEventListener('click', function () {
            var url, hash;

            if (isSquadMode) {
                if (!currentSquadResults) return;
                url = HD2Sharing.buildSquadShareURL(currentSquadResults, currentMode);
                hash = HD2Sharing.encodeSquadLoadout(currentSquadResults, currentMode);
            } else {
                if (!currentResult) return;
                url = HD2Sharing.buildShareURL(currentResult, currentMode);
                hash = HD2Sharing.encodeLoadout(currentResult, currentMode);
            }

            // Update the browser URL without reloading
            history.replaceState(null, '', hash);

            copyToClipboard(url, function () {
                btn.textContent = 'Link Copied!';
                btn.classList.add('copy-btn--copied');
                setTimeout(function () {
                    btn.textContent = 'Share Link';
                    btn.classList.remove('copy-btn--copied');
                }, 1500);
            });
        });
    }

    /**
     * Check for a shared loadout in the URL hash and restore it.
     */
    function loadFromHash() {
        var hash = window.location.hash;
        if (!hash || hash.length < 2) return false;

        // Try squad first
        var squadDecoded = HD2Sharing.decodeSquadHash(hash);
        if (squadDecoded) {
            var squadResults = HD2Sharing.resolveSquadLoadout(squadDecoded);
            if (!squadResults) return false;

            // Activate squad mode
            isSquadMode = true;
            isFirstSquadRoll = false;
            document.getElementById('squad-toggle-btn').classList.add('active');

            currentMode = squadDecoded.mode;
            HD2Storage.saveMode(currentMode);
            HD2UI.setActiveMode(currentMode);

            currentSquadResults = squadResults;

            var emptyEl = document.getElementById('loadout-empty');
            var squadDisplay = document.getElementById('squad-display');
            var randSection = document.getElementById('randomize-section');

            emptyEl.style.display = 'none';
            document.getElementById('loadout-display').classList.add('loadout--hidden');
            squadDisplay.classList.remove('squad-display--hidden');
            randSection.classList.remove('randomize-section--hidden');

            HD2UI.renderSquadLoadout(squadResults);
            HD2UI.staggerRevealSquadCards();

            return true;
        }

        // Try solo
        var decoded = HD2Sharing.decodeHash(hash);
        if (!decoded) return false;

        var result = HD2Sharing.resolveLoadout(decoded);
        if (!result) return false;

        // Set mode to match the shared loadout
        currentMode = decoded.mode;
        HD2Storage.saveMode(currentMode);
        HD2UI.setActiveMode(currentMode);

        // Display the loadout
        currentResult = result;
        isFirstSoloRoll = false;

        var emptyEl = document.getElementById('loadout-empty');
        var loadoutEl = document.getElementById('loadout-display');
        var randSection = document.getElementById('randomize-section');

        emptyEl.style.display = 'none';
        loadoutEl.classList.remove('loadout--hidden');
        randSection.classList.remove('randomize-section--hidden');

        HD2UI.renderLoadout(result);
        HD2UI.staggerRevealCards();

        return true;
    }

    function initDiceButton() {
        var diceBtn = document.getElementById('dice-btn');
        if (diceBtn) {
            diceBtn.addEventListener('click', function () {
                doRandomize();
            });
        }
    }

    function getSlotType(cardId) {
        var map = {
            'card-primary': 'primary',
            'card-secondary': 'secondary',
            'card-throwable': 'throwable',
            'card-armor': 'armor',
            'card-booster': 'booster',
            'card-strat-0': 'strat-0',
            'card-strat-1': 'strat-1',
            'card-strat-2': 'strat-2',
            'card-strat-3': 'strat-3'
        };
        return map[cardId] || null;
    }

    function initCardClickHandlers() {
        document.querySelectorAll('.loadout-card').forEach(function (card) {
            card.addEventListener('click', function () {
                if (!currentResult) return;

                var slotType = getSlotType(card.id);
                if (!slotType) return;

                HD2UI.hideError();
                var reroll = HD2Randomizer.rerollSlot(slotType, currentResult, currentMode);

                if (reroll.error) {
                    HD2UI.showError(reroll.error);
                    return;
                }

                // Update currentResult
                if (reroll.key === 'strat') {
                    currentResult.stratagems[reroll.index] = reroll.item;
                } else {
                    currentResult[reroll.key] = reroll.item;
                }

                // Re-render just this card
                if (card.id === 'card-armor') {
                    HD2UI.renderArmorCard(reroll.item);
                } else {
                    var label = card.querySelector('.loadout-card__label').textContent;
                    HD2UI.renderCard(card.id, reroll.item, label);
                }

                HD2UI.casinoRevealSingleCard(card.id);

                // Update URL hash after reroll
                history.replaceState(null, '', HD2Sharing.encodeLoadout(currentResult, currentMode));
            });
        });
    }

    function initFilterPanel() {
        // Toggle filter panel open/close
        document.getElementById('filter-panel-header').addEventListener('click', function () {
            document.getElementById('filter-panel').classList.toggle('open');
        });

        // Select All / Deselect All
        document.getElementById('filter-select-all').addEventListener('click', function () {
            HD2Filters.selectAll();
            HD2UI.renderFilterPanel();
            initFilterListeners();
            HD2UI.updateFilterCount();
        });

        document.getElementById('filter-deselect-all').addEventListener('click', function () {
            HD2Filters.deselectAll();
            HD2UI.renderFilterPanel();
            initFilterListeners();
            HD2UI.updateFilterCount();
        });

        // Render the filter panel
        HD2UI.renderFilterPanel();
        initFilterListeners();
        HD2UI.updateFilterCount();
    }

    function initFilterListeners() {
        // Warbond header click to expand/collapse
        document.querySelectorAll('.warbond-group__header').forEach(function (header) {
            // Remove old listeners by cloning
            var newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);

            newHeader.addEventListener('click', function (e) {
                // Don't toggle expand when clicking the toggle switch
                if (e.target.closest('.toggle-switch')) return;

                var group = this.closest('.warbond-group');
                group.classList.toggle('expanded');
            });
        });

        // Sub-category header click to expand/collapse
        document.querySelectorAll('.warbond-subcategory__header').forEach(function (header) {
            header.addEventListener('click', function () {
                var subcategory = this.closest('.warbond-subcategory');
                subcategory.classList.toggle('expanded');
            });
        });

        // Warbond toggle switches
        document.querySelectorAll('[data-warbond-toggle]').forEach(function (checkbox) {
            checkbox.addEventListener('change', function (e) {
                e.stopPropagation();
                var warbondId = this.dataset.warbondToggle;
                HD2Filters.toggleWarbond(warbondId, this.checked);

                // Update item toggles in this warbond
                var group = this.closest('.warbond-group');
                group.querySelectorAll('[data-item-toggle]').forEach(function (itemCb) {
                    itemCb.checked = checkbox.checked;
                });

                HD2UI.updateWarbondCheckboxState(warbondId);
                HD2UI.updateFilterCount();
            });
        });

        // Item toggle switches
        document.querySelectorAll('[data-item-toggle]').forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                var itemId = this.dataset.itemToggle;
                HD2Filters.toggleItem(itemId, this.checked);

                // Update parent warbond toggle state
                var group = this.closest('.warbond-group');
                var warbondId = group.querySelector('[data-warbond-toggle]').dataset.warbondToggle;
                HD2UI.updateWarbondCheckboxState(warbondId);
                HD2UI.updateFilterCount();
            });
        });
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        HD2Filters.init();
        initModeSelector();
        initModeHelp();
        initSquadToggle();
        initFilterPanel();
        initRandomizeButton();
        initDiceButton();
        initCopyButton();
        initShareButton();
        initCardClickHandlers();

        // Try to restore a shared loadout from the URL hash
        loadFromHash();
    });
})();
