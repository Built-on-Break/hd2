/**
 * localStorage persistence for filter settings and mode.
 */
window.HD2Storage = (function () {
    var KEYS = {
        WARBOND_TOGGLES: 'hd2-warbond-toggles',
        ITEM_TOGGLES: 'hd2-item-toggles',
        MODE: 'hd2-mode'
    };

    function save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            // localStorage full or unavailable -- silently ignore
        }
    }

    function load(key, defaultValue) {
        try {
            var stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    }

    function saveWarbondToggles(toggles) {
        save(KEYS.WARBOND_TOGGLES, toggles);
    }

    function loadWarbondToggles() {
        return load(KEYS.WARBOND_TOGGLES, {});
    }

    function saveItemToggles(toggles) {
        save(KEYS.ITEM_TOGGLES, toggles);
    }

    function loadItemToggles() {
        return load(KEYS.ITEM_TOGGLES, {});
    }

    function saveMode(mode) {
        save(KEYS.MODE, mode);
    }

    function loadMode() {
        return load(KEYS.MODE, 'balanced');
    }

    return {
        saveWarbondToggles: saveWarbondToggles,
        loadWarbondToggles: loadWarbondToggles,
        saveItemToggles: saveItemToggles,
        loadItemToggles: loadItemToggles,
        saveMode: saveMode,
        loadMode: loadMode
    };
})();
