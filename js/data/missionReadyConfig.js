// =============================================================================
// Mission Ready Mode Configuration
// =============================================================================
// Defines role tags (crowd-clear, utility) and scoring thresholds for the
// Mission Ready randomization mode. AT scores live on items directly (atScore).
// CC scores for weapons/throwables live on items directly (ccScore).
// CC scores for stratagems are stored here as ID->score lookups.
//
// The Mission Ready algorithm:
//   1. Picks weapons/throwable/armor/booster randomly (same as other modes)
//   2. Calculates AT score from primary + secondary + throwable
//   3. Calculates CC score from primary + secondary + throwable
//   4. Picks stratagems ensuring total loadout AT score >= atThreshold
//      AND total loadout CC score >= ccThreshold
//   5. Remaining stratagem slots use weighted random favoring crowd-clear/utility
// =============================================================================

window.HD2Data = window.HD2Data || {};
window.HD2Data.missionReadyConfig = {

    // Minimum total AT score across entire loadout (weapons + throwable + stratagems)
    atThreshold: 4,

    // Minimum total CC score across entire loadout (weapons + throwable + stratagems)
    // CC=2 items are reliable crowd clearers; CC=1 items are supplemental
    ccThreshold: 3,

    // Weight multiplier for crowd-clear and utility stratagems in remaining slots
    // (1 = no boost, 2 = double weight, 3 = triple weight)
    crowdClearWeight: 2,
    utilityWeight: 2,

    // Weight multipliers for red/green stratagems to compensate for pool imbalance
    // Pool sizes: blue=47, red=19, green=17 — without boosts, blue dominates
    redStratagemWeight: 2,    // orbitals + eagles
    greenStratagemWeight: 2,  // sentries + emplacements

    // =========================================================================
    // CROWD CLEAR scores for STRATAGEMS — values indicate CC capability
    // CC=2: Reliable crowd clearer (meets significant portion of threshold)
    // CC=1: Supplemental crowd control
    // Omitted = CC=0
    //
    // Weapon/throwable CC scores live on items directly as ccScore property.
    // =========================================================================
    crowdClear: {
        // Support Weapons — CC=2 (dedicated crowd clearers)
        'mg-43-machine-gun': 2,
        'm-105-stalwart': 2,
        'flam-40-flamethrower': 2,
        'mg-206-heavy-machine-gun': 2,
        'gl-21-grenade-launcher': 2,
        'gl-28-belt-fed-grenade-launcher': 2,
        'm-1000-maxigun': 2,
        'arc-3-arc-thrower': 2,
        'rl-77-airburst-rocket-launcher': 2,

        'bflam-80-cremator': 2,

        // Support Weapons — CC=1 (supplemental)
        'tx-41-sterilizer': 1,
        'gl-52-de-escalator': 1,
        'eat-700-expendable-napalm': 1,
        's-11-speargun': 1,

        // Orbitals — CC=2
        'orbital-gatling-barrage': 2,
        'orbital-gas-strike': 2,
        'orbital-120mm-he-barrage': 2,
        'orbital-airburst-strike': 2,
        'orbital-380mm-he-barrage': 2,
        'orbital-napalm-barrage': 2,

        // Orbitals — CC=1
        'orbital-walking-barrage': 1,
        'orbital-laser': 1,

        // Eagles — CC=2
        'eagle-strafing-run': 2,
        'eagle-airstrike': 2,
        'eagle-cluster-bomb': 2,
        'eagle-napalm-airstrike': 2,

        // Eagles — CC=1
        'eagle-110mm-rocket-pods': 1,
        'eagle-500kg-bomb': 1,

        // Sentries — CC=2
        'ag-16-gatling-sentry': 2,
        'amg-43-machine-gun-sentry': 2,

        // Sentries — CC=1
        'aflam-40-flame-sentry': 1,
        'agm-17-gas-mortar-sentry': 2,
        'aac-8-autocannon-sentry': 1,
        'am-12-mortar-sentry': 1,
        'alas-98-laser-sentry': 1,
        'amls-4x-rocket-sentry': 1,

        // Emplacements — CC=2
        'md-8-gas-mines': 2,
        'md-i4-incendiary-mines': 2,

        // Emplacements — CC=1
        'md-6-anti-personnel-minefield': 1,
        'aarc-3-tesla-tower': 1,
        'emg-101-hmg-emplacement': 1,
        'egl-21-grenadier-battlement': 1,

        // Backpacks (autonomous companions) — CC=2
        'axar-23-guard-dog': 2,
        'axlas-5-guard-dog-rover': 1,
        'axflam-75-hot-dog': 2,
        'axarc-3-k-9': 2,
        'axtx-13-dog-breath': 2,

        // Vehicles — CC=2
        'exo-45-patriot-exosuit': 2,
        'exo-49-emancipator-exosuit': 2,

        // Vehicles — CC=1
        'td-220-bastion-mk-xvi': 1,
    },

    // =========================================================================
    // UTILITY role tags — items providing CC, support, mobility, area denial
    // =========================================================================
    utility: {
        // Primary Weapons (stagger/stun effects)
        'ar23c-liberator-concussive': true,
        'smg72-pummeler': true,
        'sg20-halt': true,

        // Secondary Weapons
        'p11-stim-pistol': true,
        'cqc19-stun-lance': true,
        'cqc30-stun-baton': true,
        'gp31-grenade-pistol': true,
        'gp20-ultimatum': true,
        'p35-re-educator': true,
        'cqc73-entrenchment-tool': true,

        // Throwables
        'g23-stun': true,
        'g4-gas': true,
        'g3-smoke': true,
        'g109-urchin': true,
        'g89-smokescreen': true,
        'gsh39-shield': true,
        'tm1-lure-mine': true,

        // Stratagems — Support Weapons (CC/area-denial support weapons)
        'tx-41-sterilizer': true,
        'gl-52-de-escalator': true,

        // Stratagems — Orbitals
        'orbital-smoke-strike': true,
        'orbital-ems-strike': true,

        // Stratagems — Eagles
        'eagle-smoke-strike': true,

        // Stratagems — Sentries
        'am-23-ems-mortar-sentry': true,
        'agm-17-gas-mortar-sentry': true,

        // Stratagems — Emplacements
        'fx-12-shield-generator-relay': true,
        'md-8-gas-mines': true,

        // Stratagems — Backpacks
        'b-1-supply-pack': true,
        'lift-850-jump-pack': true,
        'sh-20-ballistic-shield-backpack': true,
        'sh-32-shield-generator-pack': true,
        'sh-51-directional-shield': true,
        'lift-860-hover-pack': true,
        'lift-182-warp-pack': true,
        'b-100-portable-hellbomb': true,

        // Stratagems — Vehicles
        'm-102-fast-recon-vehicle': true,
    },

    // =========================================================================
    // CLOSES OBJECTIVES — stratagems that can RELIABLY and REPEATEDLY destroy
    // fabricators / close bug holes throughout a full mission.
    // Only includes items practical as your sole objective-closing method.
    // Orbitals excluded (limited uses). Sentries excluded (uncontrollable aim).
    // Omitted = cannot practically close objectives on its own
    // =========================================================================
    closesObjectives: {
        // Support Weapons — reloadable/respawning explosive weapons
        'gr-8-recoilless-rifle': true,
        'ac-8-autocannon': true,
        'las-99-quasar-cannon': true,
        'mls-4x-commando': true,
        'faf-14-spear': true,
        'eat-17-expendable-anti-tank': true,
        'eat-411-leveller': true,
        'gl-21-grenade-launcher': true,
        'gl-28-belt-fed-grenade-launcher': true,
        'bmd-c4-pack': true,
        'ms-11-solo-silo': true,
        's-11-speargun': true,
        'cqc-20-breaching-hammer': true,

        // Eagles — multi-use, reliable structural damage
        'eagle-airstrike': true,
        'eagle-500kg-bomb': true,

        // Backpacks
        'b-100-portable-hellbomb': true,

        // Vehicles/Exosuits
        'exo-45-patriot-exosuit': true,
        'exo-49-emancipator-exosuit': true,
    }
};
