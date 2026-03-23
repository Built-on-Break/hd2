/**
 * Main app entry point. Wires up events and initializes everything.
 */
(function () {
    var currentMode = 'balanced';
    var currentFaction = 'any';
    var isFirstSoloRoll = true;
    var isFirstSquadRoll = true;
    var currentResult = null;
    var isSquadMode = false;
    var isDailyMode = false;
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

                // Render content so card elements have final values ready
                HD2UI.renderLoadout(result);
                highlightRolledFaction();

                // Immediately start casino spin — this masks final content
                // with random items before anything is visible
                HD2UI.casinoRevealCards(currentMode);

                // Now show the grid in transparent state
                loadoutEl.classList.remove('loadout--hidden');
                loadoutEl.classList.add('loadout--entering');
                randSection.classList.remove('randomize-section--hidden');
                randSection.classList.add('randomize-section--entering');

                // Force layout calc, then trigger fade-in
                void loadoutEl.offsetHeight;
                loadoutEl.classList.add('loadout--visible');
                randSection.classList.add('randomize-section--visible');

                // Update URL hash so the loadout is shareable
                history.replaceState(null, '', HD2Sharing.encodeLoadout(result, currentMode, getEffectiveFaction()));
            }, 300);
            return;
        }

        HD2UI.renderLoadout(result);
        highlightRolledFaction();
        HD2UI.casinoRevealCards(currentMode);

        // Update URL hash so the loadout is shareable
        history.replaceState(null, '', HD2Sharing.encodeLoadout(result, currentMode, getEffectiveFaction()));
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

                var squadDisplay = document.getElementById('squad-display');
                HD2UI.renderSquadLoadout(currentSquadResults);

                // Hide all cards before showing the container
                var cards = squadDisplay.querySelectorAll('.loadout-card');
                cards.forEach(function (card) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateX(-20px)';
                });

                squadDisplay.classList.remove('squad-display--hidden');
                randSection.classList.remove('randomize-section--hidden');

                // Now stagger them in
                HD2UI.staggerRevealSquadCards();

                history.replaceState(null, '', HD2Sharing.encodeSquadLoadout(currentSquadResults, currentMode, getEffectiveFaction()));
            }, 300);
            return;
        }

        HD2UI.renderSquadLoadout(currentSquadResults);
        HD2UI.staggerRevealSquadCards();

        history.replaceState(null, '', HD2Sharing.encodeSquadLoadout(currentSquadResults, currentMode, getEffectiveFaction()));
    }

    /**
     * Show the correct display state based on current mode and results.
     */
    function showCurrentView() {
        var soloLoadout = document.getElementById('loadout-display');
        var squadDisplay = document.getElementById('squad-display');
        var dailyPanel = document.getElementById('daily-challenge');
        var emptyEl = document.getElementById('loadout-empty');
        var randSection = document.getElementById('randomize-section');
        var diceBtn = document.getElementById('dice-btn');
        var imageCardBtn = document.getElementById('image-card-btn');

        // Hide image card button in squad/daily mode
        imageCardBtn.style.display = (isSquadMode || isDailyMode) ? 'none' : '';

        // Hide everything first
        soloLoadout.classList.add('loadout--hidden');
        soloLoadout.classList.remove('loadout--entering', 'loadout--visible');
        squadDisplay.classList.add('squad-display--hidden');
        dailyPanel.classList.add('daily-challenge--hidden');
        randSection.classList.remove('randomize-section--entering', 'randomize-section--visible');

        if (isDailyMode) {
            // Daily takes over the whole view — no rolling allowed
            emptyEl.style.display = 'none';
            randSection.classList.add('randomize-section--hidden');
            diceBtn.style.display = 'none';
            dailyPanel.classList.remove('daily-challenge--hidden');
            return;
        }

        // Restore dice button when not in daily mode
        diceBtn.style.display = '';

        if (isSquadMode) {
            if (currentSquadResults) {
                emptyEl.style.display = 'none';
                squadDisplay.classList.remove('squad-display--hidden');
                randSection.classList.remove('randomize-section--hidden');
                randSection.classList.add('randomize-section--entering', 'randomize-section--visible');
                HD2UI.renderSquadLoadout(currentSquadResults);
                history.replaceState(null, '', HD2Sharing.encodeSquadLoadout(currentSquadResults, currentMode, getEffectiveFaction()));
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
                soloLoadout.classList.add('loadout--entering', 'loadout--visible');
                randSection.classList.remove('randomize-section--hidden');
                randSection.classList.add('randomize-section--entering', 'randomize-section--visible');
                HD2UI.renderLoadout(currentResult);
                history.replaceState(null, '', HD2Sharing.encodeLoadout(currentResult, currentMode, getEffectiveFaction()));
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

            // Deactivate daily if turning on squad
            if (isSquadMode && isDailyMode) {
                isDailyMode = false;
                document.getElementById('daily-btn').classList.remove('active');
            }

            showCurrentView();
        });
    }

    function initModeSelector() {
        currentMode = HD2Storage.loadMode();
        HD2UI.setActiveMode(currentMode);
        updateFactionVisibility();

        document.querySelectorAll('.mode-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                currentMode = this.dataset.mode;
                HD2Storage.saveMode(currentMode);
                HD2UI.setActiveMode(currentMode);
                updateFactionVisibility();
            });
        });
    }

    function updateFactionVisibility() {
        var factionEl = document.getElementById('faction-selector');
        if (!factionEl) return;
        if (currentMode === 'mission-ready') {
            factionEl.classList.remove('faction-selector--hidden');
        } else {
            factionEl.classList.add('faction-selector--hidden');
        }
    }

    function setFaction(faction) {
        currentFaction = faction || 'random';
        HD2Storage.saveFaction(currentFaction);
        HD2Randomizer.setFaction(currentFaction);

        var factionBtns = document.querySelectorAll('.faction-btn');
        factionBtns.forEach(function (btn) {
            btn.classList.remove('faction-btn--rolled');
            if (btn.dataset.faction === currentFaction) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Get the effective faction for sharing/encoding.
     * Uses the last rolled faction if set to random.
     */
    function getEffectiveFaction() {
        if (currentFaction === 'random') {
            return HD2Randomizer.getLastRolledFaction() || 'terminids';
        }
        return currentFaction;
    }

    /**
     * After a roll, highlight which faction was actually used.
     * When "random" is selected, this shows the picked faction.
     */
    function highlightRolledFaction() {
        var rolled = HD2Randomizer.getLastRolledFaction();
        if (!rolled || currentFaction !== 'random') return;

        var factionBtns = document.querySelectorAll('.faction-btn');
        factionBtns.forEach(function (btn) {
            btn.classList.remove('faction-btn--rolled');
            if (btn.dataset.faction === rolled) {
                btn.classList.add('faction-btn--rolled');
            }
        });
    }

    function initFactionSelector() {
        var savedFaction = HD2Storage.loadFaction();
        setFaction(savedFaction);

        var factionBtns = document.querySelectorAll('.faction-btn');
        factionBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                setFaction(this.dataset.faction);
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
                url = HD2Sharing.buildSquadShareURL(currentSquadResults, currentMode, getEffectiveFaction());
                hash = HD2Sharing.encodeSquadLoadout(currentSquadResults, currentMode, getEffectiveFaction());
            } else {
                if (!currentResult) return;
                url = HD2Sharing.buildShareURL(currentResult, currentMode, getEffectiveFaction());
                hash = HD2Sharing.encodeLoadout(currentResult, currentMode, getEffectiveFaction());
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
            setFaction(squadDecoded.faction || 'any');
            updateFactionVisibility();

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

        // Set mode and faction to match the shared loadout
        currentMode = decoded.mode;
        HD2Storage.saveMode(currentMode);
        HD2UI.setActiveMode(currentMode);
        setFaction(decoded.faction || 'any');
        updateFactionVisibility();

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
                history.replaceState(null, '', HD2Sharing.encodeLoadout(currentResult, currentMode, getEffectiveFaction()));
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

    function initDailyChallenge() {
        var dailyBtn = document.getElementById('daily-btn');

        dailyBtn.addEventListener('click', function () {
            isDailyMode = !isDailyMode;
            dailyBtn.classList.toggle('active', isDailyMode);

            // Deactivate squad if turning on daily
            if (isDailyMode && isSquadMode) {
                isSquadMode = false;
                document.getElementById('squad-toggle-btn').classList.remove('active');
            }

            if (isDailyMode) {
                renderDailyChallenge();
            }

            showCurrentView();
        });
    }

    function renderDailyChallenge() {
        var dailyPanel = document.getElementById('daily-challenge');
        var daily = HD2Daily.generateDaily();

        // Render date and difficulty
        document.getElementById('daily-date').textContent = HD2Daily.formatDate(daily.date);
        var diffEl = document.getElementById('daily-difficulty');
        diffEl.textContent = daily.difficulty.label;
        diffEl.style.color = daily.difficulty.color;
        diffEl.style.borderColor = daily.difficulty.color;

        // Render the loadout cards
        HD2UI.renderCard('daily-primary', daily.primaryWeapon, 'Primary');
        HD2UI.renderCard('daily-secondary', daily.secondaryWeapon, 'Secondary');
        HD2UI.renderCard('daily-throwable', daily.throwable, 'Throwable');
        HD2UI.renderCard('daily-booster', daily.booster, 'Booster');

        // Armor
        var armorCard = document.getElementById('daily-armor');
        var armorNameEl = armorCard.querySelector('.loadout-card__name');
        var armorImgEl = armorCard.querySelector('.loadout-card__image img');
        armorNameEl.textContent = daily.armor.weightClass + ' - ' + daily.armor.passiveName;
        if (daily.armor.image) {
            armorImgEl.src = daily.armor.image;
            armorImgEl.alt = daily.armor.passiveName;
            armorImgEl.classList.remove('img-fallback');
            armorImgEl.onerror = function () {
                this.onerror = null;
                this.src = 'images/placeholder.png';
                this.classList.add('img-fallback');
            };
        }
        armorCard.removeAttribute('data-category');

        // Stratagems
        for (var i = 0; i < 4; i++) {
            HD2UI.renderCard('daily-strat-' + i, daily.stratagems[i], 'Stratagem ' + (i + 1));
        }

        // Stagger reveal the daily cards
        var cards = dailyPanel.querySelectorAll('.loadout-card');
        cards.forEach(function (card) { card.classList.add('card--hidden'); });
        requestAnimationFrame(function () {
            cards.forEach(function (card, index) {
                setTimeout(function () {
                    card.classList.remove('card--hidden');
                    card.classList.add('card--revealed');
                }, 100 + index * 80);
            });
        });

        // Wire up copy button for daily
        var copyBtn = document.getElementById('daily-copy-btn');
        var newCopyBtn = copyBtn.cloneNode(true);
        copyBtn.parentNode.replaceChild(newCopyBtn, copyBtn);
        newCopyBtn.addEventListener('click', function () {
            var lines = [];
            lines.push('HD2 Daily Challenge - ' + HD2Daily.formatDate(daily.date) + ' [' + daily.difficulty.label + ']');
            lines.push('');
            lines.push('Primary: ' + daily.primaryWeapon.name);
            lines.push('Secondary: ' + daily.secondaryWeapon.name);
            lines.push('Throwable: ' + daily.throwable.name);
            lines.push('Armor: ' + daily.armor.weightClass + ' - ' + daily.armor.passiveName);
            for (var i = 0; i < daily.stratagems.length; i++) {
                lines.push('Stratagem ' + (i + 1) + ': ' + daily.stratagems[i].name);
            }
            lines.push('Booster: ' + daily.booster.name);
            lines.push('');
            lines.push('Can you beat this on Super Helldive?');

            copyToClipboard(lines.join('\n'), function () {
                newCopyBtn.textContent = 'Copied!';
                newCopyBtn.classList.add('copy-btn--copied');
                setTimeout(function () {
                    newCopyBtn.textContent = 'Copy Challenge';
                    newCopyBtn.classList.remove('copy-btn--copied');
                }, 1500);
            });
        });
    }

    function initImageCardButton() {
        var btn = document.getElementById('image-card-btn');
        btn.addEventListener('click', function () {
            if (!currentResult) return;

            btn.textContent = 'Generating...';
            btn.disabled = true;

            HD2ImageCard.generateCard(currentResult, currentMode).then(function () {
                btn.textContent = 'Downloaded!';
                btn.classList.add('copy-btn--copied');
                setTimeout(function () {
                    btn.textContent = 'Share as Image';
                    btn.classList.remove('copy-btn--copied');
                    btn.disabled = false;
                }, 1500);
            }).catch(function () {
                btn.textContent = 'Share as Image';
                btn.disabled = false;
            });
        });
    }

    function initAboutToggle() {
        var btn = document.getElementById('about-toggle');
        var content = document.getElementById('about-content');
        btn.addEventListener('click', function () {
            var opening = !content.classList.contains('visible');
            content.classList.toggle('visible');
            btn.textContent = opening ? 'Close' : 'About this tool';

            if (opening) {
                // Smooth scroll so the about content is in view
                setTimeout(function () {
                    btn.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            }
        });
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        HD2Filters.init();
        initModeSelector();
        initFactionSelector();
        initModeHelp();
        initSquadToggle();
        initDailyChallenge();
        initFilterPanel();
        initRandomizeButton();
        initDiceButton();
        initCopyButton();
        initShareButton();
        initImageCardButton();
        initCardClickHandlers();
        initAboutToggle();

        // Try to restore a shared loadout from the URL hash
        loadFromHash();
    });
})();
