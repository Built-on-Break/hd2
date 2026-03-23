// =============================================================================
// Faction-Aware Mission Ready Configuration
// =============================================================================
// Defines per-faction scoring thresholds, hard requirements, armor/booster
// affinities, and score overrides for items whose effectiveness changes
// dramatically by faction.
//
// Score resolution: factionScoreOverrides[faction][item.id][dim] ?? item[dim] ?? 0
// =============================================================================

window.HD2Data = window.HD2Data || {};
window.HD2Data.factionConfig = {

    // =========================================================================
    // Per-faction score thresholds (total across loadout must meet these)
    // =========================================================================
    thresholds: {
        terminids:  { cc: 5, elite: 3, at: 4 },
        automatons: { cc: 3, elite: 3, at: 5 },
        illuminate: { cc: 5, elite: 5, at: 3 },
        any:        { cc: 5, elite: 5, at: 5 }
    },

    // =========================================================================
    // Hard requirements — binary checks beyond score thresholds
    // closesObjectives: loadout must have at least one objective-closing item
    // minSingleAT: at least one item must have this atScore or higher
    // =========================================================================
    hardRequirements: {
        terminids:  { closesObjectives: true, minSingleAT: 2 },
        automatons: { closesObjectives: true, minSingleAT: 2 },
        illuminate: { closesObjectives: true, minSingleAT: 0 },
        any:        { closesObjectives: true, minSingleAT: 2 }
    },

    // =========================================================================
    // Armor weight class preferences per faction (selection weight multipliers)
    // Terminids: light for kiting swarms
    // Automatons: heavy for ranged firefights
    // Illuminate: medium for balanced mobility
    // =========================================================================
    armorWeightPreference: {
        terminids:  { Light: 1.8, Medium: 1.2, Heavy: 1 },
        automatons: { Light: 1, Medium: 1.3, Heavy: 1.8 },
        illuminate: { Light: 1, Medium: 1.8, Heavy: 1.2 },
        any:        { Light: 1, Medium: 1, Heavy: 1 }
    },

    // =========================================================================
    // Armor passive affinity — weight multipliers per faction
    // Higher = more likely to be selected for that faction
    // Omitted passives default to weight 1
    // =========================================================================
    armorPassiveAffinity: {
        'med-kit':              { terminids: 1.5, automatons: 1.5, illuminate: 1.5 },
        'acclimated':           { terminids: 2, automatons: 1, illuminate: 1 },
        'inflammable':          { terminids: 2, automatons: 1, illuminate: 1 },
        'advanced-filtration':  { terminids: 1.5, automatons: 1, illuminate: 1 },
        'fortified':            { terminids: 1, automatons: 2, illuminate: 1 },
        'siege-ready':          { terminids: 1, automatons: 1.5, illuminate: 1 },
        'extra-padding':        { terminids: 1, automatons: 1.5, illuminate: 1 },
        'ballistic-padding':    { terminids: 1, automatons: 1.5, illuminate: 1 },
        'engineering-kit':      { terminids: 1.5, automatons: 1.5, illuminate: 1 },
        'scout':                { terminids: 1.5, automatons: 1, illuminate: 1 },
        'peak-physique':        { terminids: 1.5, automatons: 1, illuminate: 1 },
        'electrical-conduit':   { terminids: 1.5, automatons: 1, illuminate: 1.5 },
        'desert-stormer':       { terminids: 1.5, automatons: 1, illuminate: 1 },
        'democracy-protects':   { terminids: 1, automatons: 1.5, illuminate: 1 },
        'unflinching':          { terminids: 1, automatons: 1.5, illuminate: 1 },
        'reduced-signature':    { terminids: 1, automatons: 1.5, illuminate: 1.5 },
        'adreno-defibrillator': { terminids: 1, automatons: 1, illuminate: 1.5 },
        'supplementary-adrenaline': { terminids: 1.5, automatons: 1, illuminate: 1 },
        'feet-first':           { terminids: 1, automatons: 1, illuminate: 1 },
        'rock-solid':           { terminids: 1, automatons: 1, illuminate: 1 },
        'gunslinger':           { terminids: 1, automatons: 1, illuminate: 1 },
        'reinforced-epaulettes': { terminids: 1, automatons: 1, illuminate: 1 },
        'servo-assisted':       { terminids: 1, automatons: 1, illuminate: 1 },
        'integrated-explosives': { terminids: 1, automatons: 1, illuminate: 1 },
        'concussive-padding-grenadier': { terminids: 1.5, automatons: 1.5, illuminate: 1.5 },
        'concussive-padding-hazmat': { terminids: 1, automatons: 1, illuminate: 1 },
        'concussive-padding-reinforced': { terminids: 1.5, automatons: 1.5, illuminate: 1.5 }
    },

    // =========================================================================
    // Booster affinity — weight multipliers per faction
    // Omitted boosters default to weight 1
    // =========================================================================
    boosterAffinity: {
        'vitality-enhancement':         { terminids: 2, automatons: 2, illuminate: 2 },
        'stamina-enhancement':          { terminids: 2, automatons: 1, illuminate: 1 },
        'muscle-enhancement':           { terminids: 2, automatons: 1, illuminate: 1 },
        'firebomb-hellpods':            { terminids: 2, automatons: 1, illuminate: 1 },
        'dead-sprint':                  { terminids: 2, automatons: 1, illuminate: 1 },
        'increased-reinforcement-budget': { terminids: 1, automatons: 2, illuminate: 1 },
        'flexible-reinforcement-budget': { terminids: 1, automatons: 2, illuminate: 1 },
        'concealed-insertion':          { terminids: 1, automatons: 2, illuminate: 1 },
        'experimental-infusion':        { terminids: 1, automatons: 1, illuminate: 2 },
        'stun-pods':                    { terminids: 1, automatons: 1, illuminate: 2 }
    },

    // =========================================================================
    // Faction-specific score overrides
    // For items whose effectiveness changes significantly by faction.
    // These override the base scores on the item objects.
    // Only list items that DIFFER from their base score.
    // =========================================================================
    factionScoreOverrides: {
        terminids: {
            // Shields are near-useless vs bugs (they melee through them)
            'sh-32-shield-generator-pack': { eliteScore: 0, ccScore: 0 },
            'sh-20-ballistic-shield-backpack': { eliteScore: 0, ccScore: 0 },
            'sh-51-directional-shield': { eliteScore: 0, ccScore: 0 },
            'fx-12-shield-generator-relay': { eliteScore: 0, ccScore: 0 },
            // Fire weapons excel vs bugs
            'flam-40-flamethrower':     { ccScore: 3, eliteScore: 2 },
            'bflam-80-cremator':        { ccScore: 3, eliteScore: 2 },
            'axflam-75-hot-dog':        { ccScore: 3 },
            'eat-700-expendable-napalm': { ccScore: 2 },
            'eagle-napalm-airstrike':   { ccScore: 3 },
            'orbital-napalm-barrage':   { ccScore: 3 },
            'aflam-40-flame-sentry':    { ccScore: 2 },
            // Gas is great vs bugs
            'orbital-gas-strike':       { ccScore: 3 },
            'md-8-gas-mines':           { ccScore: 3 },
            'axtx-13-dog-breath':       { ccScore: 3 },
            'agm-17-gas-mortar-sentry': { ccScore: 3 },
            // Arc is solid vs bugs (chains through swarms)
            'arc-3-arc-thrower':        { ccScore: 3 },
            // Breaker Incendiary is a bug-clearing god
            'sg225ie-breaker-incendiary': { ccScore: 3 },
            // Torcher excels vs bugs
            'flam66-torcher':           { ccScore: 3 },
            // AT Emplacement is bad vs bugs — stationary, bugs swarm you
            'eat-12-anti-tank-emplacement': { atScore: 1, eliteScore: 1 },
            // HMG Emplacement same problem
            'emg-101-hmg-emplacement': { eliteScore: 1 },
            // Cookout fire damage
            'sg451-cookout':            { ccScore: 3 }
        },
        automatons: {
            // Fire weapons are weak vs bots (armor resists)
            'flam-40-flamethrower':     { ccScore: 1, eliteScore: 0 },
            'bflam-80-cremator':        { ccScore: 1, eliteScore: 0 },
            'axflam-75-hot-dog':        { ccScore: 1 },
            'aflam-40-flame-sentry':    { ccScore: 0 },
            'flam66-torcher':           { ccScore: 1 },
            'sg451-cookout':            { ccScore: 1 },
            // Railgun excels vs bot armor
            'rs-422-railgun':           { eliteScore: 3, atScore: 3 },
            // AMR is amazing for Devastator headshots + Hulk eyes
            'apw-1-anti-materiel-rifle': { eliteScore: 3, atScore: 2 },
            // Autocannon is king vs bots
            'ac-8-autocannon':          { eliteScore: 3, atScore: 3 },
            // Marksman rifles excel vs bots (headshots)
            'r63cs-diligence-counter-sniper': { eliteScore: 3 },
            'r63-diligence':            { eliteScore: 2 },
            'r72-censor':               { eliteScore: 3 },
            // Arc thrower is bad vs bots
            'arc-3-arc-thrower':        { ccScore: 1, eliteScore: 0 },
            // Blitzer bad vs bots
            'arc12-blitzer':            { ccScore: 1, eliteScore: 0 }
        },
        illuminate: {
            // Emplacements are weaker vs illuminate — too mobile
            'eat-12-anti-tank-emplacement': { atScore: 2, eliteScore: 1 },
            // High ROF weapons strip shields effectively
            'mg-43-machine-gun':        { eliteScore: 2 },
            'm-105-stalwart':           { eliteScore: 1 },
            'mg-206-heavy-machine-gun': { eliteScore: 3 },
            // Gas bypasses Illuminate shields
            'orbital-gas-strike':       { eliteScore: 2 },
            'md-8-gas-mines':           { eliteScore: 1 },
            'axtx-13-dog-breath':       { eliteScore: 1 },
            // Fire bypasses shields
            'flam-40-flamethrower':     { eliteScore: 2 },
            'bflam-80-cremator':        { eliteScore: 2 },
            // Purifier is S-tier vs Illuminate
            'plas101-purifier':         { ccScore: 2, eliteScore: 3 },
            // Blitzer is strong vs Illuminate
            'arc12-blitzer':            { ccScore: 3, eliteScore: 2 },
            // Airburst excels vs Illuminate groups
            'rl-77-airburst-rocket-launcher': { ccScore: 3, eliteScore: 3 }
        }
    },

    // =========================================================================
    // Utility nudge — when combat thresholds are already met, these items
    // get a weight bonus for the remaining slots. Higher = more likely.
    // Only kicks in when all three deficits are satisfied.
    // =========================================================================
    utilityNudge: {
        // Mobility — changes how you play
        'lift-850-jump-pack': 2,
        'lift-860-hover-pack': 2,
        'lift-182-warp-pack': 2,
        // Shields
        'sh-32-shield-generator-pack': 1.5,
        'sh-20-ballistic-shield-backpack': 1,
        'sh-51-directional-shield': 1,
        'fx-12-shield-generator-relay': 0.75,
        // Supply/support
        'b-1-supply-pack': 1.5
    },

    // Stratagems that require a one-handed weapon to be useful.
    // These will only be picked if the loadout has a one-handed support weapon
    // or no main support weapon at all.
    requiresOneHanded: {
        'sh-20-ballistic-shield-backpack': true,
        'sh-51-directional-shield': true
    },

    // =========================================================================
    // Stratagem pool balance weights (carried from missionReadyConfig)
    // Compensates for different pool sizes: blue=47, red=19, green=17
    // =========================================================================
    redStratagemWeight: 2,    // orbitals + eagles
    greenStratagemWeight: 2   // sentries + emplacements
};
