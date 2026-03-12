/**
 * DOM rendering for loadout cards and filter panel.
 */
window.HD2UI = (function () {

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
        var cards = document.querySelectorAll('.loadout-card');

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
     * Whether a card should cycle images (only stratagems — they use small SVGs).
     */
    function shouldCycleImages(cardId) {
        return cardId && cardId.indexOf('card-strat') === 0;
    }

    var activeSpinIntervals = [];

    /**
     * Casino slot-machine reveal. Cards flicker and cycle through
     * random names (and images for stratagems), then lock in one by one.
     */
    function casinoRevealCards() {
        // Clear any running intervals from a previous animation
        activeSpinIntervals.forEach(function (id) { clearInterval(id); });
        activeSpinIntervals = [];

        var cards = document.querySelectorAll('.loadout-card');
        var finals = [];

        // Capture final values and preload images into browser cache
        cards.forEach(function (card) {
            var nameEl = card.querySelector('.loadout-card__name');
            var imgEl = card.querySelector('.loadout-card__image img');
            var src = imgEl.src;
            finals.push({ name: nameEl.textContent, image: src });
            var preload = new Image();
            preload.src = src;
        });

        // Start all cards spinning
        cards.forEach(function (card, index) {
            card.classList.remove('card--spinning', 'card--locked', 'card--rolling', 'card--revealed');

            var nameEl = card.querySelector('.loadout-card__name');
            var imgEl = card.querySelector('.loadout-card__image img');
            var cycleImages = shouldCycleImages(card.id);
            var pool = getNamePoolForCard(card.id);

            imgEl.onerror = null;
            card.classList.add('card--spinning');

            // Cycle names always; cycle images only for stratagems (SVGs)
            var intervalId = setInterval(function () {
                var rand = pool[Math.floor(Math.random() * pool.length)];
                nameEl.textContent = rand.name;
                if (cycleImages) {
                    imgEl.src = rand.image;
                }
            }, 80);
            activeSpinIntervals.push(intervalId);

            // Lock in after staggered delay
            var stopDelay = 400 + index * 150;
            var revealDelay = stopDelay + 150;

            // Phase 1: Stop cycling, set final content (still blurred)
            setTimeout(function () {
                clearInterval(intervalId);
                nameEl.textContent = finals[index].name;
                imgEl.onerror = null;
                imgEl.onload = null;
                imgEl.src = finals[index].image;
            }, stopDelay);

            // Phase 2: Reveal at fixed time, but wait for decode first
            (function (c, el) {
                setTimeout(function () {
                    function reveal() {
                        c.classList.remove('card--spinning');
                        c.classList.add('card--locked');
                        setTimeout(function () {
                            c.classList.remove('card--locked');
                        }, 400);
                    }
                    if (el.decode) {
                        el.decode().then(reveal, reveal);
                    } else {
                        reveal();
                    }
                }, revealDelay);
            })(card, imgEl);
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

        // Preload final image into cache
        var preload = new Image();
        preload.src = finalImage;

        var cycleImages = shouldCycleImages(cardId);
        var pool = getNamePoolForCard(cardId);

        card.classList.remove('card--spinning', 'card--locked', 'card--rolling', 'card--revealed');
        imgEl.onerror = null;
        card.classList.add('card--spinning');

        var intervalId = setInterval(function () {
            var rand = pool[Math.floor(Math.random() * pool.length)];
            nameEl.textContent = rand.name;
            if (cycleImages) {
                imgEl.src = rand.image;
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

        // Phase 2: Reveal at fixed time, but wait for decode first
        setTimeout(function () {
            function reveal() {
                card.classList.remove('card--spinning');
                card.classList.add('card--locked');
                setTimeout(function () {
                    card.classList.remove('card--locked');
                }, 400);
            }

            if (imgEl.decode) {
                imgEl.decode().then(reveal, reveal);
            } else {
                reveal();
            }
        }, 650);
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
            if (wb.image) {
                headerStyle = ' style="background-image: url(\'' + wb.image + '\')"';
            } else if (wb.type === 'base') {
                headerExtraClass = ' warbond-group__header--base-game';
                if (wb.icon) {
                    iconHtml = '<img src="' + wb.icon + '" alt="" class="warbond-group__header__icon">';
                }
            } else if (wb.type === 'superstore') {
                headerExtraClass = ' warbond-group__header--superstore';
                if (wb.icon) {
                    iconHtml = '<img src="' + wb.icon + '" alt="" class="warbond-group__header__icon">';
                }
            } else {
                headerExtraClass = ' warbond-group__header--no-banner';
                if (wb.icon) {
                    iconHtml = '<img src="' + wb.icon + '" alt="" class="warbond-group__header__icon">';
                }
            }

            div.innerHTML =
                '<div class="warbond-group__header' + headerExtraClass + '" data-warbond="' + wb.id + '"' + headerStyle + '>' +
                    iconHtml +
                    '<label class="toggle-switch" onclick="event.stopPropagation()">' +
                        '<input type="checkbox" class="toggle-switch__input" data-warbond-toggle="' + wb.id + '"' +
                            (HD2Filters.isWarbondEnabled(wb.id) ? ' checked' : '') + '>' +
                        '<span class="toggle-switch__slider"></span>' +
                    '</label>' +
                    '<span class="warbond-group__name">' + wb.name + '</span>' +
                    '<span class="warbond-group__type' + typeClass + '">' + typeLabel + '</span>' +
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
                    '<span class="warbond-subcategory__name">' + subGroup.type + ' (' + subGroup.items.length + ')</span>' +
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
                        '<label class="toggle-switch toggle-switch--small" onclick="event.stopPropagation()">' +
                            '<input type="checkbox" class="toggle-switch__input" data-item-toggle="' + item.id + '"' +
                                (HD2Filters.isItemEnabled(item.id) ? ' checked' : '') + '>' +
                            '<span class="toggle-switch__slider"></span>' +
                        '</label>' +
                        '<span class="warbond-item__name">' + displayName + '</span>' +
                        '<span class="warbond-item__type">' + itemType + '</span>';

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
        updateAllWarbondCheckboxStates: updateAllWarbondCheckboxStates
    };
})();
