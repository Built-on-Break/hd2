/**
 * DOM rendering for loadout cards and filter panel.
 */
window.HD2UI = (function () {

    /**
     * Escape a string for safe insertion into HTML.
     */
    function esc(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /**
     * Sanitize a URL for use in HTML attributes. Only allows http(s) and data URIs.
     */
    function sanitizeURL(url) {
        if (!url) return '';
        if (/^https?:\/\//i.test(url) || /^data:image\//i.test(url)) return url;
        return '';
    }

    /**
     * Render a loadout card with item data.
     */
    function renderCard(cardId, item, label) {
        var card = document.getElementById(cardId);
        if (!card || !item) return;

        var nameEl = card.querySelector('.loadout-card__name');
        var imgEl = card.querySelector('.loadout-card__image img');
        var labelEl = card.querySelector('.loadout-card__label');

        if (label) labelEl.textContent = label;
        nameEl.textContent = item.name;

        if (item.image) {
            imgEl.src = item.image;
            imgEl.alt = item.name;
            imgEl.classList.remove('img-fallback');
            imgEl.onerror = function () {
                this.onerror = null;
                this.src = 'images/placeholder.png';
                this.classList.add('img-fallback');
            };
        } else {
            imgEl.src = 'images/placeholder.png';
            imgEl.alt = item.name;
            imgEl.classList.add('img-fallback');
        }

        // Set category data attribute for stratagem color coding
        if (item.category) {
            card.setAttribute('data-category', item.category);
        } else {
            card.removeAttribute('data-category');
        }
    }

    /**
     * Render the armor card (weight class + passive).
     */
    function renderArmorCard(armorCombo) {
        var card = document.getElementById('card-armor');
        if (!card || !armorCombo) return;

        var nameEl = card.querySelector('.loadout-card__name');
        var imgEl = card.querySelector('.loadout-card__image img');

        nameEl.textContent = armorCombo.weightClass + ' - ' + armorCombo.passiveName;

        // Try to show passive icon
        if (armorCombo.image) {
            imgEl.src = armorCombo.image;
            imgEl.alt = armorCombo.passiveName;
            imgEl.classList.remove('img-fallback');
            imgEl.onerror = function () {
                this.onerror = null;
                this.src = 'images/placeholder.png';
                this.classList.add('img-fallback');
            };
        } else {
            imgEl.src = 'images/placeholder.png';
            imgEl.classList.add('img-fallback');
        }

        card.removeAttribute('data-category');
    }

    /**
     * Render the full loadout result.
     */
    function renderLoadout(result) {
        renderCard('card-primary', result.primaryWeapon, 'Primary');
        renderCard('card-secondary', result.secondaryWeapon, 'Secondary');
        renderCard('card-throwable', result.throwable, 'Throwable');

        if (result.armor) {
            renderArmorCard(result.armor);
        }

        if (result.stratagems) {
            for (var i = 0; i < 4; i++) {
                renderCard('card-strat-' + i, result.stratagems[i], 'Stratagem ' + (i + 1));
            }
        }

        renderCard('card-booster', result.booster, 'Booster');
    }

    /**
     * Show error message.
     */
    function showError(message) {
        var el = document.getElementById('error-message');
        el.textContent = message;
        el.classList.add('visible');
    }

    /**
     * Hide error message.
     */
    function hideError() {
        var el = document.getElementById('error-message');
        el.classList.remove('visible');
    }

    /**
     * Animate cards on randomize (staggered reveal).
     */
    function animateCards(callback) {
        var cards = document.querySelectorAll('.loadout-card');

        // Roll out all at once
        cards.forEach(function (card) {
            card.classList.remove('card--revealed');
            card.classList.add('card--rolling');
        });

        // After roll out, update content and stagger roll in
        setTimeout(function () {
            cards.forEach(function (card) {
                card.classList.remove('card--rolling');
            });

            if (callback) callback();

            // Stagger each card's reveal
            cards.forEach(function (card, index) {
                setTimeout(function () {
                    card.classList.add('card--revealed');
                }, index * 80);
            });
        }, 200);
    }

    /**
     * First-time stagger reveal (no roll-out needed).
     */
    function staggerRevealCards() {
        var cards = document.querySelectorAll('#loadout-display .loadout-card');

        // Start all hidden
        cards.forEach(function (card) {
            card.classList.add('card--hidden');
        });

        // Stagger reveal each card
        requestAnimationFrame(function () {
            cards.forEach(function (card, index) {
                setTimeout(function () {
                    card.classList.remove('card--hidden');
                    card.classList.add('card--revealed');
                }, 150 + index * 100);
            });
        });
    }

    /**
     * Build a pool of {name, image} items from a data array.
     */
    function buildPool(arr) {
        var pool = [];
        if (!arr) return pool;
        arr.forEach(function (i) {
            pool.push({ name: i.name || (i.weightClass + ' - ' + i.passiveName), image: i.image || 'images/placeholder.png' });
        });
        return pool;
    }

    /**
     * Get the name pool for a card's slot.
     */
    function getNamePoolForCard(cardId) {
        if (cardId === 'card-primary') return buildPool(HD2Data.primaryWeapons);
        if (cardId === 'card-secondary') return buildPool(HD2Data.secondaryWeapons);
        if (cardId === 'card-throwable') return buildPool(HD2Data.throwables);
        if (cardId === 'card-armor') return buildPool(HD2Data.armorCombos);
        if (cardId === 'card-booster') return buildPool(HD2Data.boosters);
        if (cardId && cardId.indexOf('card-strat') === 0) return buildPool(HD2Data.stratagems);
        return buildPool(HD2Data.stratagems);
    }

    /**
     * Whether a card should cycle images during the spin animation.
     * All card types cycle — images are cached and the blur filter hides loading.
     */
    function shouldCycleImages() {
        return true;
    }

    /**
     * Pick a random item from pool that differs from what's currently shown.
     * Checks both name and image to avoid any visual "stuck" effect.
     */
    function pickDifferent(pool, currentName, currentImage) {
        if (pool.length <= 1) return pool[0];
        var pick;
        do {
            pick = pool[Math.floor(Math.random() * pool.length)];
        } while (pick.name === currentName || pick.image === currentImage);
        return pick;
    }

    var activeSpinIntervals = [];

    /**
     * Casino slot-machine reveal. Cards flicker and cycle through
     * random names (and images for stratagems), then lock in one by one.
     */
    function casinoRevealCards(mode) {
        // Clear any running intervals from a previous animation
        activeSpinIntervals.forEach(function (id) { clearInterval(id); });
        activeSpinIntervals = [];

        var cards = document.querySelectorAll('#loadout-display .loadout-card');
        var finals = [];
        var preloadPromises = [];

        // Capture final values, mask them, and start spinning immediately
        cards.forEach(function (card) {
            var nameEl = card.querySelector('.loadout-card__name');
            var imgEl = card.querySelector('.loadout-card__image img');
            var src = imgEl.src;
            finals.push({ name: nameEl.textContent, image: src });

            // Immediately mask the final content
            card.classList.remove('card--spinning', 'card--locked', 'card--rolling', 'card--revealed');
            var pool = getNamePoolForCard(card.id);
            var cycleImages = shouldCycleImages(card.id);
            var rand = pool[Math.floor(Math.random() * pool.length)];
            nameEl.textContent = rand.name;
            if (cycleImages) {
                imgEl.src = rand.image;
            }
            imgEl.onerror = null;
            card.classList.add('card--spinning');

            // Start cycling right away — no waiting
            var intervalId = setInterval(function () {
                var r = pickDifferent(pool, nameEl.textContent, imgEl.src);
                nameEl.textContent = r.name;
                if (cycleImages) {
                    imgEl.src = r.image;
                }
            }, 80);
            activeSpinIntervals.push(intervalId);

            // Store refs for the reveal phase
            card._spinRefs = { nameEl: nameEl, imgEl: imgEl, intervalId: intervalId };

            // Preload final image in background
            var preload = new Image();
            preload.src = src;
            if (preload.decode) {
                preloadPromises.push(preload.decode().catch(function () {}));
            }
        });

        // Schedule reveals once final images are cached
        Promise.all(preloadPromises).then(function () {
            scheduleReveals(cards, finals);
        });
    }

    function scheduleReveals(cards, finals) {
        cards.forEach(function (card, index) {
            var refs = card._spinRefs;
            var stopDelay = 400 + index * 150;
            var revealDelay = stopDelay + 150;

            // Phase 1: Stop cycling, set final content (still blurred)
            setTimeout(function () {
                clearInterval(refs.intervalId);
                refs.nameEl.textContent = finals[index].name;
                refs.imgEl.onerror = null;
                refs.imgEl.onload = null;
                refs.imgEl.src = finals[index].image;
            }, stopDelay);

            // Phase 2: Unblur and lock in
            (function (c) {
                setTimeout(function () {
                    c.classList.remove('card--spinning');
                    c.classList.add('card--locked');
                    setTimeout(function () {
                        c.classList.remove('card--locked');
                    }, 400);
                }, revealDelay);
            })(card);
        });
    }

    /**
     * Casino reveal for a single card (used for slot rerolls).
     */
    function casinoRevealSingleCard(cardId) {
        var card = document.getElementById(cardId);
        if (!card) return;

        // Clear any running global spin intervals
        activeSpinIntervals.forEach(function (id) { clearInterval(id); });
        activeSpinIntervals = [];

        var nameEl = card.querySelector('.loadout-card__name');
        var imgEl = card.querySelector('.loadout-card__image img');

        var finalName = nameEl.textContent;
        var finalImage = imgEl.src;

        // Immediately mask the final content — show random item and start spinning
        var cycleImages = shouldCycleImages(cardId);
        var pool = getNamePoolForCard(cardId);
        var rand = pool[Math.floor(Math.random() * pool.length)];
        nameEl.textContent = rand.name;
        if (cycleImages) {
            imgEl.src = rand.image;
        }
        card.classList.remove('card--spinning', 'card--locked', 'card--rolling', 'card--revealed');
        imgEl.onerror = null;
        card.classList.add('card--spinning');

        // Preload final image in background
        var preload = new Image();
        preload.src = finalImage;
        var ready = preload.decode ? preload.decode().catch(function () {}) : Promise.resolve();

        ready.then(function () {
            var intervalId = setInterval(function () {
                var r = pickDifferent(pool, nameEl.textContent, imgEl.src);
                nameEl.textContent = r.name;
                if (cycleImages) {
                    imgEl.src = r.image;
                }
            }, 80);

            // Phase 1: Stop cycling, set final content (still blurred)
            setTimeout(function () {
                clearInterval(intervalId);
                nameEl.textContent = finalName;
                imgEl.onerror = null;
                imgEl.onload = null;
                imgEl.src = finalImage;
            }, 500);

            // Phase 2: Reveal — image already preloaded, timing is deterministic
            setTimeout(function () {
                card.classList.remove('card--spinning');
                card.classList.add('card--locked');
                setTimeout(function () {
                    card.classList.remove('card--locked');
                }, 400);
            }, 650);
        });
    }

    /**
     * Set the active mode button.
     */
    function setActiveMode(mode) {
        document.querySelectorAll('.mode-btn').forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
    }

    /**
     * Render the filter panel with warbond accordions.
     */
    function renderFilterPanel() {
        var container = document.getElementById('warbond-filters');
        container.innerHTML = '';

        var grouped = HD2Filters.getItemsByWarbondGrouped();

        HD2Data.warbonds.forEach(function (wb) {
            var group = grouped[wb.id];
            if (!group || group.totalCount === 0) return;
            var isLargeWarbond = group.totalCount > 15;

            var div = document.createElement('div');
            div.className = 'warbond-group';
            div.id = 'warbond-group-' + wb.id;

            // Determine type badge class
            var typeClass = '';
            if (wb.type === 'free') typeClass = ' warbond-group__type--free';
            else if (wb.type === 'legendary') typeClass = ' warbond-group__type--legendary';

            var typeLabel = wb.type === 'superstore' ? 'Store' :
                            wb.type === 'free' ? 'Free' :
                            wb.type === 'legendary' ? 'Legendary' :
                            wb.type === 'base' ? 'Base' : 'Premium';

            // Banner background style
            var headerStyle = '';
            var headerExtraClass = '';
            var iconHtml = '';
            var safeImage = sanitizeURL(wb.image);
            var safeIcon = sanitizeURL(wb.icon);
            if (safeImage) {
                headerStyle = ' style="background-image: url(&quot;' + esc(safeImage) + '&quot;)"';
            } else if (wb.type === 'base') {
                headerExtraClass = ' warbond-group__header--base-game';
                if (safeIcon) {
                    iconHtml = '<img src="' + esc(safeIcon) + '" alt="" class="warbond-group__header__icon">';
                }
            } else if (wb.type === 'superstore') {
                headerExtraClass = ' warbond-group__header--superstore';
                if (safeIcon) {
                    iconHtml = '<img src="' + esc(safeIcon) + '" alt="" class="warbond-group__header__icon">';
                }
            } else {
                headerExtraClass = ' warbond-group__header--no-banner';
                if (safeIcon) {
                    iconHtml = '<img src="' + esc(safeIcon) + '" alt="" class="warbond-group__header__icon">';
                }
            }

            var safeWbId = esc(wb.id);
            div.innerHTML =
                '<div class="warbond-group__header' + headerExtraClass + '" data-warbond="' + safeWbId + '"' + headerStyle + '>' +
                    iconHtml +
                    '<label class="toggle-switch" >' +
                        '<input type="checkbox" class="toggle-switch__input" data-warbond-toggle="' + safeWbId + '"' +
                            (HD2Filters.isWarbondEnabled(wb.id) ? ' checked' : '') + '>' +
                        '<span class="toggle-switch__slider"></span>' +
                    '</label>' +
                    '<span class="warbond-group__name">' + esc(wb.name) + '</span>' +
                    '<span class="warbond-group__type' + typeClass + '">' + esc(typeLabel) + '</span>' +
                    '<span class="warbond-group__expand">&#9660;</span>' +
                '</div>' +
                '<div class="warbond-group__items"></div>';

            // Render sub-categories inside
            var itemsContainer = div.querySelector('.warbond-group__items');
            group.subGroups.forEach(function (subGroup) {
                var subDiv = document.createElement('div');
                subDiv.className = 'warbond-subcategory';
                if (!isLargeWarbond) {
                    subDiv.classList.add('expanded');
                }
                subDiv.setAttribute('data-subcategory', subGroup.type);

                var subHeader = document.createElement('div');
                subHeader.className = 'warbond-subcategory__header';
                subHeader.innerHTML =
                    '<span class="warbond-subcategory__name">' + esc(subGroup.type) + ' (' + subGroup.items.length + ')</span>' +
                    '<span class="warbond-subcategory__expand">&#9660;</span>';
                subDiv.appendChild(subHeader);

                var subItems = document.createElement('div');
                subItems.className = 'warbond-subcategory__items';

                subGroup.items.forEach(function (item) {
                    var itemDiv = document.createElement('div');
                    itemDiv.className = 'warbond-item';

                    var itemType = getItemTypeLabel(item);
                    var displayName = item.name || (item.weightClass + ' - ' + item.passiveName);
                    itemDiv.innerHTML =
                        '<label class="toggle-switch toggle-switch--small" >' +
                            '<input type="checkbox" class="toggle-switch__input" data-item-toggle="' + esc(item.id) + '"' +
                                (HD2Filters.isItemEnabled(item.id) ? ' checked' : '') + '>' +
                            '<span class="toggle-switch__slider"></span>' +
                        '</label>' +
                        '<span class="warbond-item__name">' + esc(displayName) + '</span>' +
                        '<span class="warbond-item__type">' + esc(itemType) + '</span>';

                    subItems.appendChild(itemDiv);
                });

                subDiv.appendChild(subItems);
                itemsContainer.appendChild(subDiv);
            });

            container.appendChild(div);
        });

        // Update indeterminate states
        updateAllWarbondCheckboxStates();
    }

    /**
     * Get a display label for an item's type/category.
     */
    function getItemTypeLabel(item) {
        // Determine which data array this item belongs to
        if (HD2Data.primaryWeapons.indexOf(item) !== -1) return 'Primary';
        if (HD2Data.secondaryWeapons.indexOf(item) !== -1) return 'Secondary';
        if (HD2Data.throwables.indexOf(item) !== -1) return 'Throwable';
        if (HD2Data.boosters.indexOf(item) !== -1) return 'Booster';
        if (HD2Data.armorCombos.indexOf(item) !== -1) return 'Armor';
        if (HD2Data.stratagems.indexOf(item) !== -1) {
            var labels = {
                'support-weapon': 'Support',
                'backpack': 'Backpack',
                'vehicle': 'Vehicle',
                'orbital': 'Orbital',
                'eagle': 'Eagle',
                'sentry': 'Sentry',
                'emplacement': 'Emplacement'
            };
            return labels[item.category] || 'Stratagem';
        }
        return '';
    }

    /**
     * Update a warbond checkbox to reflect its items' state.
     */
    function updateWarbondCheckboxState(warbondId) {
        var checkbox = document.querySelector('[data-warbond-toggle="' + warbondId + '"]');
        if (!checkbox) return;

        var state = HD2Filters.getWarbondItemState(warbondId);
        var toggleLabel = checkbox.closest('.toggle-switch');
        checkbox.checked = state !== 'none';
        checkbox.indeterminate = state === 'some';

        // Update indeterminate visual on the toggle switch
        if (toggleLabel) {
            toggleLabel.classList.toggle('toggle-switch--indeterminate', state === 'some');
        }
    }

    function updateAllWarbondCheckboxStates() {
        HD2Data.warbonds.forEach(function (wb) {
            updateWarbondCheckboxState(wb.id);
        });
    }

    function updateFilterCount() {
        var el = document.getElementById('filter-count');
        if (!el) return;
        var allItems = [].concat(HD2Data.primaryWeapons, HD2Data.secondaryWeapons, HD2Data.throwables, HD2Data.stratagems, HD2Data.boosters, HD2Data.armorCombos);
        var enabled = HD2Filters.getEnabledItems(allItems).length;
        var total = allItems.length;
        if (enabled === total) {
            el.textContent = '';
        } else {
            el.textContent = '(' + enabled + '/' + total + ' enabled)';
        }
    }

    /**
     * Build the squad display DOM with 4 player panels.
     */
    function buildSquadDOM() {
        var container = document.getElementById('squad-display');
        if (!container || container.children.length > 0) return;

        for (var p = 0; p < 4; p++) {
            var member = document.createElement('div');
            member.className = 'squad-member';
            member.setAttribute('data-player', p);

            var header = document.createElement('div');
            header.className = 'squad-member__header';
            header.textContent = 'Player ' + (p + 1);
            member.appendChild(header);

            var loadout = document.createElement('div');
            loadout.className = 'squad-member__loadout';

            var slots = [
                { id: 'sq' + p + '-primary', label: 'Primary' },
                { id: 'sq' + p + '-secondary', label: 'Secondary' },
                { id: 'sq' + p + '-throwable', label: 'Throwable' },
                { id: 'sq' + p + '-armor', label: 'Armor' },
                { id: 'sq' + p + '-booster', label: 'Booster' },
                { id: 'sq' + p + '-strat-0', label: 'Strat 1' },
                { id: 'sq' + p + '-strat-1', label: 'Strat 2' },
                { id: 'sq' + p + '-strat-2', label: 'Strat 3' },
                { id: 'sq' + p + '-strat-3', label: 'Strat 4' }
            ];

            for (var s = 0; s < slots.length; s++) {
                var card = document.createElement('div');
                card.className = 'loadout-card';
                card.id = slots[s].id;
                card.innerHTML =
                    '<div class="loadout-card__label">' + esc(slots[s].label) + '</div>' +
                    '<div class="loadout-card__image"><img src="images/placeholder.png" alt=""></div>' +
                    '<div class="loadout-card__name">--</div>';
                loadout.appendChild(card);
            }

            member.appendChild(loadout);
            container.appendChild(member);
        }
    }

    /**
     * Render a single squad member's loadout.
     */
    function renderSquadMember(playerIndex, result) {
        var prefix = 'sq' + playerIndex;
        renderCard(prefix + '-primary', result.primaryWeapon, 'Primary');
        renderCard(prefix + '-secondary', result.secondaryWeapon, 'Secondary');
        renderCard(prefix + '-throwable', result.throwable, 'Throwable');
        renderCard(prefix + '-booster', result.booster, 'Booster');

        // Armor card
        var armorCard = document.getElementById(prefix + '-armor');
        if (armorCard && result.armor) {
            var nameEl = armorCard.querySelector('.loadout-card__name');
            var imgEl = armorCard.querySelector('.loadout-card__image img');
            nameEl.textContent = result.armor.weightClass + ' - ' + result.armor.passiveName;
            if (result.armor.image) {
                imgEl.src = result.armor.image;
                imgEl.alt = result.armor.passiveName;
                imgEl.classList.remove('img-fallback');
                imgEl.onerror = function () {
                    this.onerror = null;
                    this.src = 'images/placeholder.png';
                    this.classList.add('img-fallback');
                };
            } else {
                imgEl.src = 'images/placeholder.png';
                imgEl.classList.add('img-fallback');
            }
            armorCard.removeAttribute('data-category');
        }

        // Stratagems
        for (var i = 0; i < 4; i++) {
            renderCard(prefix + '-strat-' + i, result.stratagems[i], 'Strat ' + (i + 1));
        }
    }

    /**
     * Render all 4 squad loadouts.
     */
    function renderSquadLoadout(results) {
        for (var p = 0; p < results.length; p++) {
            renderSquadMember(p, results[p]);
        }
    }

    /**
     * Stagger reveal for squad cards.
     */
    function staggerRevealSquadCards() {
        var cards = document.querySelectorAll('#squad-display .loadout-card');

        // Start all cards hidden
        cards.forEach(function (card) {
            card.classList.remove('card--squad-revealed');
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
        });

        // Force layout so the hidden state is painted
        void document.getElementById('squad-display').offsetHeight;

        // Stagger reveal left to right
        cards.forEach(function (card, index) {
            setTimeout(function () {
                card.style.opacity = '';
                card.style.transform = '';
                card.classList.add('card--squad-revealed');
            }, 50 + index * 80);
        });
    }

    return {
        renderCard: renderCard,
        renderLoadout: renderLoadout,
        renderArmorCard: renderArmorCard,
        showError: showError,
        hideError: hideError,
        animateCards: animateCards,
        staggerRevealCards: staggerRevealCards,
        casinoRevealCards: casinoRevealCards,
        casinoRevealSingleCard: casinoRevealSingleCard,
        setActiveMode: setActiveMode,
        renderFilterPanel: renderFilterPanel,
        updateWarbondCheckboxState: updateWarbondCheckboxState,
        updateAllWarbondCheckboxStates: updateAllWarbondCheckboxStates,
        updateFilterCount: updateFilterCount,
        buildSquadDOM: buildSquadDOM,
        renderSquadLoadout: renderSquadLoadout,
        staggerRevealSquadCards: staggerRevealSquadCards
    };
})();
