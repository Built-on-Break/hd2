/**
 * Main app entry point. Wires up events and initializes everything.
 */
(function () {
    var currentMode = 'balanced';
    var isFirstRandomize = true;

    function doRandomize() {
        HD2UI.hideError();

        var result = HD2Randomizer.randomize(currentMode);

        if (result.error) {
            HD2UI.showError(result.error);
            return;
        }

        // Remove pulse from randomize button
        document.getElementById('randomize-btn').classList.remove('randomize-btn--pulse');

        if (isFirstRandomize) {
            isFirstRandomize = false;
            var emptyEl = document.getElementById('loadout-empty');
            var loadoutEl = document.getElementById('loadout-display');

            // Fade out empty state
            emptyEl.classList.add('loadout-empty--fading');

            setTimeout(function () {
                emptyEl.style.display = 'none';
                loadoutEl.classList.remove('loadout--hidden');

                // Render content then casino reveal
                HD2UI.renderLoadout(result);
                HD2UI.casinoRevealCards();
            }, 300);
            return;
        }

        HD2UI.renderLoadout(result);
        HD2UI.casinoRevealCards();
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

    function initRandomizeButton() {
        var btn = document.getElementById('randomize-btn');

        // Pulse animation to draw attention on first load
        btn.classList.add('randomize-btn--pulse');

        btn.addEventListener('click', function () {
            doRandomize();
        });
    }

    function initDiceButton() {
        var diceBtn = document.getElementById('dice-btn');
        if (diceBtn) {
            diceBtn.addEventListener('click', function () {
                doRandomize();
            });
        }
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
        });

        document.getElementById('filter-deselect-all').addEventListener('click', function () {
            HD2Filters.deselectAll();
            HD2UI.renderFilterPanel();
            initFilterListeners();
        });

        // Render the filter panel
        HD2UI.renderFilterPanel();
        initFilterListeners();
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
            var newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);

            newHeader.addEventListener('click', function () {
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
            });
        });
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        HD2Filters.init();
        initModeSelector();
        initFilterPanel();
        initRandomizeButton();
        initDiceButton();
    });
})();
