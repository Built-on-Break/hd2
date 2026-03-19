/**
 * Shareable loadout URLs via hash fragment.
 * Encodes loadout item IDs into a compact URL hash.
 *
 * Solo format: #m=<mode>&p=<primary>&s=<secondary>&t=<throwable>&a=<armor>&b=<booster>&s0=<strat>&s1=<strat>&s2=<strat>&s3=<strat>
 * Squad format: #squad&m=<mode>&p0=<primary>&...&p3=<primary>&...
 */
window.HD2Sharing = (function () {

    /**
     * Encode a solo loadout result into a URL hash string.
     */
    function encodeLoadout(result, mode) {
        if (!result) return '';

        var params = [];
        params.push('m=' + encodeURIComponent(mode || 'balanced'));
        params.push('p=' + encodeURIComponent(result.primaryWeapon.id));
        params.push('s=' + encodeURIComponent(result.secondaryWeapon.id));
        params.push('t=' + encodeURIComponent(result.throwable.id));
        params.push('a=' + encodeURIComponent(result.armor.id));
        params.push('b=' + encodeURIComponent(result.booster.id));

        for (var i = 0; i < result.stratagems.length; i++) {
            params.push('s' + i + '=' + encodeURIComponent(result.stratagems[i].id));
        }

        return '#' + params.join('&');
    }

    /**
     * Encode a squad loadout (4 results) into a URL hash string.
     */
    function encodeSquadLoadout(results, mode) {
        if (!results || results.length !== 4) return '';

        var params = [];
        params.push('squad');
        params.push('m=' + encodeURIComponent(mode || 'balanced'));

        for (var p = 0; p < 4; p++) {
            var r = results[p];
            params.push('p' + p + '=' + encodeURIComponent(r.primaryWeapon.id));
            params.push('sc' + p + '=' + encodeURIComponent(r.secondaryWeapon.id));
            params.push('t' + p + '=' + encodeURIComponent(r.throwable.id));
            params.push('a' + p + '=' + encodeURIComponent(r.armor.id));
            params.push('b' + p + '=' + encodeURIComponent(r.booster.id));
            for (var i = 0; i < r.stratagems.length; i++) {
                params.push('st' + p + '' + i + '=' + encodeURIComponent(r.stratagems[i].id));
            }
        }

        return '#' + params.join('&');
    }

    /** Keys that must never be set from URL input. */
    var BANNED_KEYS = { '__proto__': 1, 'constructor': 1, 'prototype': 1 };

    /**
     * Parse hash string into a key-value map.
     * Uses Object.create(null) to avoid prototype pollution.
     */
    function parseHash(hash) {
        if (!hash || hash.length < 2) return null;
        var str = hash.charAt(0) === '#' ? hash.substring(1) : hash;
        if (!str) return null;

        var parts = str.split('&');
        var map = Object.create(null);
        var flags = [];
        for (var i = 0; i < parts.length; i++) {
            var kv = parts[i].split('=');
            if (kv.length === 2 && !BANNED_KEYS[kv[0]]) {
                map[kv[0]] = decodeURIComponent(kv[1]);
            } else if (kv.length === 1 && kv[0] && !BANNED_KEYS[kv[0]]) {
                flags.push(kv[0]);
            }
        }
        map._flags = flags;
        return map;
    }

    /**
     * Decode a URL hash string into item IDs (solo).
     * Returns null if hash is empty or invalid.
     */
    function decodeHash(hash) {
        var map = parseHash(hash);
        if (!map) return null;

        // Check if this is a squad URL
        if (map._flags.indexOf('squad') !== -1) return null;

        // Validate required keys
        if (!map.p || !map.s || !map.t || !map.a || !map.b ||
            !map.s0 || !map.s1 || !map.s2 || !map.s3) {
            return null;
        }

        return {
            mode: map.m || 'balanced',
            primaryId: map.p,
            secondaryId: map.s,
            throwableId: map.t,
            armorId: map.a,
            boosterId: map.b,
            stratagemIds: [map.s0, map.s1, map.s2, map.s3]
        };
    }

    /**
     * Decode a squad URL hash string into item IDs for 4 players.
     * Returns null if hash is empty, invalid, or not a squad URL.
     */
    function decodeSquadHash(hash) {
        var map = parseHash(hash);
        if (!map) return null;
        if (map._flags.indexOf('squad') === -1) return null;

        var players = [];
        for (var p = 0; p < 4; p++) {
            if (!map['p' + p] || !map['sc' + p] || !map['t' + p] ||
                !map['a' + p] || !map['b' + p] ||
                !map['st' + p + '0'] || !map['st' + p + '1'] ||
                !map['st' + p + '2'] || !map['st' + p + '3']) {
                return null;
            }

            players.push({
                primaryId: map['p' + p],
                secondaryId: map['sc' + p],
                throwableId: map['t' + p],
                armorId: map['a' + p],
                boosterId: map['b' + p],
                stratagemIds: [
                    map['st' + p + '0'],
                    map['st' + p + '1'],
                    map['st' + p + '2'],
                    map['st' + p + '3']
                ]
            });
        }

        return {
            squad: true,
            mode: map.m || 'balanced',
            players: players
        };
    }

    /**
     * Look up an item by ID from a data array.
     */
    function findById(arr, id) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].id === id) return arr[i];
        }
        return null;
    }

    /**
     * Resolve decoded IDs into actual item objects (solo).
     */
    function resolveLoadout(decoded) {
        if (!decoded) return null;

        var primary = findById(HD2Data.primaryWeapons, decoded.primaryId);
        var secondary = findById(HD2Data.secondaryWeapons, decoded.secondaryId);
        var throwable = findById(HD2Data.throwables, decoded.throwableId);
        var armor = findById(HD2Data.armorCombos, decoded.armorId);
        var booster = findById(HD2Data.boosters, decoded.boosterId);

        if (!primary || !secondary || !throwable || !armor || !booster) return null;

        var stratagems = [];
        for (var i = 0; i < decoded.stratagemIds.length; i++) {
            var strat = findById(HD2Data.stratagems, decoded.stratagemIds[i]);
            if (!strat) return null;
            stratagems.push(strat);
        }

        return {
            primaryWeapon: primary,
            secondaryWeapon: secondary,
            throwable: throwable,
            armor: armor,
            booster: booster,
            stratagems: stratagems
        };
    }

    /**
     * Resolve decoded squad IDs into actual item objects.
     */
    function resolveSquadLoadout(decoded) {
        if (!decoded || !decoded.players) return null;

        var results = [];
        for (var p = 0; p < decoded.players.length; p++) {
            var r = resolveLoadout(decoded.players[p]);
            if (!r) return null;
            results.push(r);
        }
        return results;
    }

    /**
     * Build the full shareable URL for the current page.
     */
    function buildShareURL(result, mode) {
        var hash = encodeLoadout(result, mode);
        var url = window.location.href.split('#')[0] + hash;
        return url;
    }

    /**
     * Build the full shareable URL for a squad loadout.
     */
    function buildSquadShareURL(results, mode) {
        var hash = encodeSquadLoadout(results, mode);
        var url = window.location.href.split('#')[0] + hash;
        return url;
    }

    return {
        encodeLoadout: encodeLoadout,
        encodeSquadLoadout: encodeSquadLoadout,
        decodeHash: decodeHash,
        decodeSquadHash: decodeSquadHash,
        resolveLoadout: resolveLoadout,
        resolveSquadLoadout: resolveSquadLoadout,
        buildShareURL: buildShareURL,
        buildSquadShareURL: buildSquadShareURL
    };
})();
