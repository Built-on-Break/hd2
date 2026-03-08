/**
 * Two-level filter state management.
 * - Warbond-level toggles (on/off entire source)
 * - Item-level toggles (individual items within a source)
 */
window.HD2Filters = (function () {
    // State: { warbondId: true/false }
    var warbondToggles = {};
    // State: { itemId: true/false }
    var itemToggles = {};

    function init() {
        var savedWarbonds = HD2Storage.loadWarbondToggles();
        var savedItems = HD2Storage.loadItemToggles();

        // Initialize warbond toggles -- default all to enabled
        HD2Data.warbonds.forEach(function (wb) {
            warbondToggles[wb.id] = savedWarbonds.hasOwnProperty(wb.id)
                ? savedWarbonds[wb.id]
                : true;
        });

        // Initialize item toggles -- default all to enabled
        getAllItems().forEach(function (item) {
            itemToggles[item.id] = savedItems.hasOwnProperty(item.id)
                ? savedItems[item.id]
                : true;
        });

        save();
    }

    function getAllItems() {
        var all = [];
        if (HD2Data.primaryWeapons) all = all.concat(HD2Data.primaryWeapons);
        if (HD2Data.secondaryWeapons) all = all.concat(HD2Data.secondaryWeapons);
        if (HD2Data.throwables) all = all.concat(HD2Data.throwables);
        if (HD2Data.stratagems) all = all.concat(HD2Data.stratagems);
        if (HD2Data.boosters) all = all.concat(HD2Data.boosters);
        if (HD2Data.armorCombos) all = all.concat(HD2Data.armorCombos);
        return all;
    }

    function toggleWarbond(warbondId, enabled) {
        warbondToggles[warbondId] = enabled;

        // Cascade to all items from this warbond
        getAllItems().forEach(function (item) {
            if (item.source === warbondId) {
                itemToggles[item.id] = enabled;
            }
        });

        save();
    }

    function toggleItem(itemId, enabled) {
        itemToggles[itemId] = enabled;
        save();
    }

    function isWarbondEnabled(warbondId) {
        return warbondToggles[warbondId] !== false;
    }

    function isItemEnabled(itemId) {
        return itemToggles[itemId] !== false;
    }

    /**
     * Check if an item is effectively enabled (both its source and itself).
     */
    function isEffectivelyEnabled(item) {
        return isWarbondEnabled(item.source) && isItemEnabled(item.id);
    }

    /**
     * Get all enabled items from a data array.
     */
    function getEnabledItems(dataArray) {
        return dataArray.filter(function (item) {
            return isEffectivelyEnabled(item);
        });
    }

    /**
     * Get the state of a warbond's items: 'all', 'none', or 'some'.
     */
    function getWarbondItemState(warbondId) {
        var items = getAllItems().filter(function (item) {
            return item.source === warbondId;
        });
        if (items.length === 0) return 'none';

        var enabledCount = items.filter(function (item) {
            return isItemEnabled(item.id);
        }).length;

        if (enabledCount === 0) return 'none';
        if (enabledCount === items.length) return 'all';
        return 'some';
    }

    function selectAll() {
        HD2Data.warbonds.forEach(function (wb) {
            warbondToggles[wb.id] = true;
        });
        getAllItems().forEach(function (item) {
            itemToggles[item.id] = true;
        });
        save();
    }

    function deselectAll() {
        HD2Data.warbonds.forEach(function (wb) {
            warbondToggles[wb.id] = false;
        });
        getAllItems().forEach(function (item) {
            itemToggles[item.id] = false;
        });
        save();
    }

    function save() {
        HD2Storage.saveWarbondToggles(warbondToggles);
        HD2Storage.saveItemToggles(itemToggles);
    }

    /**
     * Get items grouped by warbond for filter panel rendering.
     */
    function getItemsByWarbond() {
        var allItems = getAllItems();
        var grouped = {};

        HD2Data.warbonds.forEach(function (wb) {
            grouped[wb.id] = {
                warbond: wb,
                items: allItems.filter(function (item) {
                    return item.source === wb.id;
                })
            };
        });

        return grouped;
    }

    return {
        init: init,
        toggleWarbond: toggleWarbond,
        toggleItem: toggleItem,
        isWarbondEnabled: isWarbondEnabled,
        isItemEnabled: isItemEnabled,
        isEffectivelyEnabled: isEffectivelyEnabled,
        getEnabledItems: getEnabledItems,
        getWarbondItemState: getWarbondItemState,
        selectAll: selectAll,
        deselectAll: deselectAll,
        getItemsByWarbond: getItemsByWarbond
    };
})();
