window.HD2Data = window.HD2Data || {};

window.HD2Data.armorPassives = [
    { id: "servo-assisted", name: "Servo-Assisted", image: "https://helldivers.wiki.gg/images/Servo-Assisted_Armor_Passive_Icon.svg" },
    { id: "scout", name: "Scout", image: "https://helldivers.wiki.gg/images/Scout_Armor_Passive_Icon.svg" },
    { id: "engineering-kit", name: "Engineering Kit", image: "https://helldivers.wiki.gg/images/Engineering_Kit_Armor_Passive_Icon.svg" },
    { id: "fortified", name: "Fortified", image: "https://helldivers.wiki.gg/images/Fortified_Armor_Passive_Icon.svg" },
    { id: "extra-padding", name: "Extra Padding", image: "https://helldivers.wiki.gg/images/Extra_Padding_Armor_Passive_Icon.svg" },
    { id: "med-kit", name: "Med-Kit", image: "https://helldivers.wiki.gg/images/Med-Kit_Armor_Passive_Icon.svg" },
    { id: "democracy-protects", name: "Democracy Protects", image: "https://helldivers.wiki.gg/images/Democracy_Protects_Armor_Passive_Icon.svg" },
    { id: "electrical-conduit", name: "Electrical Conduit", image: "https://helldivers.wiki.gg/images/Electrical_Conduit_Armor_Passive_Icon.svg" },
    { id: "peak-physique", name: "Peak Physique", image: "https://helldivers.wiki.gg/images/Peak_Physique_Armor_Passive_Icon.svg" },
    { id: "inflammable", name: "Inflammable", image: "https://helldivers.wiki.gg/images/Inflammable_Armor_Passive_Icon.svg" },
    { id: "advanced-filtration", name: "Advanced Filtration", image: "https://helldivers.wiki.gg/images/Advanced_Filtration_Armor_Passive_Icon.svg" },
    { id: "unflinching", name: "Unflinching", image: "https://helldivers.wiki.gg/images/Unflinching_Armor_Passive_Icon.svg" },
    { id: "siege-ready", name: "Siege-Ready", image: "https://helldivers.wiki.gg/images/Siege-Ready_Armor_Passive_Icon.svg" },
    { id: "acclimated", name: "Acclimated", image: "https://helldivers.wiki.gg/images/Acclimated_Armor_Passive_Icon.svg" },
    { id: "integrated-explosives", name: "Integrated Explosives", image: "https://helldivers.wiki.gg/images/Integrated_Explosives_Armor_Passive_Icon.svg" },
    { id: "gunslinger", name: "Gunslinger", image: "https://helldivers.wiki.gg/images/Gunslinger_Armor_Passive_Icon.svg" },
    { id: "reinforced-epaulettes", name: "Reinforced Epaulettes", image: "https://helldivers.wiki.gg/images/Reinforced_Epaulettes_Armor_Passive_Icon.svg" },
    { id: "ballistic-padding", name: "Ballistic Padding", image: "https://helldivers.wiki.gg/images/Ballistic_Padding_Armor_Passive_Icon.svg" },
    { id: "adreno-defibrillator", name: "Adreno-Defibrillator", image: "https://helldivers.wiki.gg/images/Adreno-Defibrillator_Armor_Passive_Icon.svg" },
    { id: "desert-stormer", name: "Desert Stormer", image: "https://helldivers.wiki.gg/images/Desert_Stormer_Armor_Passive_Icon.svg" },
    { id: "rock-solid", name: "Rock Solid", image: "https://helldivers.wiki.gg/images/Rock_Solid_Armor_Passive_Icon.svg" },
    { id: "reduced-signature", name: "Reduced Signature", image: "https://helldivers.wiki.gg/images/Reduced_Signature_Armor_Passive_Icon.svg" },
    { id: "supplementary-adrenaline", name: "Supplementary Adrenaline", image: "https://helldivers.wiki.gg/images/Supplementary_Adrenaline_Armor_Passive_Icon.svg" },
    { id: "feet-first", name: "Feet First", image: "https://helldivers.wiki.gg/images/Feet_First_Armor_Passive_Icon.svg" }
];

// Each combo = a valid weight class + passive pairing from a specific source.
// The randomizer picks one of these combos.
// One entry per unique weight+passive combo; attributed to the earliest non-superstore source.
// Superstore-exclusive combos (no other source) use "superstore".
window.HD2Data.armorCombos = [

    // === BASE GAME ===
    { id: "medium-extra-padding-base", weightClass: "Medium", passive: "extra-padding", passiveName: "Extra Padding", source: "base", image: "https://helldivers.wiki.gg/images/Extra_Padding_Armor_Passive_Icon.svg" },

    // === HELLDIVERS MOBILIZE (Free) ===
    { id: "light-scout-mobilize", weightClass: "Light", passive: "scout", passiveName: "Scout", source: "helldivers-mobilize", image: "https://helldivers.wiki.gg/images/Scout_Armor_Passive_Icon.svg" },
    { id: "medium-scout-mobilize", weightClass: "Medium", passive: "scout", passiveName: "Scout", source: "helldivers-mobilize", image: "https://helldivers.wiki.gg/images/Scout_Armor_Passive_Icon.svg" },
    { id: "medium-engineering-kit-mobilize", weightClass: "Medium", passive: "engineering-kit", passiveName: "Engineering Kit", source: "helldivers-mobilize", image: "https://helldivers.wiki.gg/images/Engineering_Kit_Armor_Passive_Icon.svg" },
    { id: "medium-med-kit-mobilize", weightClass: "Medium", passive: "med-kit", passiveName: "Med-Kit", source: "helldivers-mobilize", image: "https://helldivers.wiki.gg/images/Med-Kit_Armor_Passive_Icon.svg" },
    { id: "medium-democracy-protects-mobilize", weightClass: "Medium", passive: "democracy-protects", passiveName: "Democracy Protects", source: "helldivers-mobilize", image: "https://helldivers.wiki.gg/images/Democracy_Protects_Armor_Passive_Icon.svg" },
    { id: "heavy-fortified-mobilize", weightClass: "Heavy", passive: "fortified", passiveName: "Fortified", source: "helldivers-mobilize", image: "https://helldivers.wiki.gg/images/Fortified_Armor_Passive_Icon.svg" },

    // === STEELED VETERANS ===
    { id: "medium-servo-assisted-steeled", weightClass: "Medium", passive: "servo-assisted", passiveName: "Servo-Assisted", source: "steeled-veterans", image: "https://helldivers.wiki.gg/images/Servo-Assisted_Armor_Passive_Icon.svg" },
    { id: "heavy-servo-assisted-steeled", weightClass: "Heavy", passive: "servo-assisted", passiveName: "Servo-Assisted", source: "steeled-veterans", image: "https://helldivers.wiki.gg/images/Servo-Assisted_Armor_Passive_Icon.svg" },

    // === CUTTING EDGE ===
    { id: "light-electrical-conduit-cutting", weightClass: "Light", passive: "electrical-conduit", passiveName: "Electrical Conduit", source: "cutting-edge", image: "https://helldivers.wiki.gg/images/Electrical_Conduit_Armor_Passive_Icon.svg" },
    { id: "medium-electrical-conduit-cutting", weightClass: "Medium", passive: "electrical-conduit", passiveName: "Electrical Conduit", source: "cutting-edge", image: "https://helldivers.wiki.gg/images/Electrical_Conduit_Armor_Passive_Icon.svg" },

    // === DEMOCRATIC DETONATION ===
    { id: "light-engineering-kit-demo", weightClass: "Light", passive: "engineering-kit", passiveName: "Engineering Kit", source: "democratic-detonation", image: "https://helldivers.wiki.gg/images/Engineering_Kit_Armor_Passive_Icon.svg" },

    // === VIPER COMMANDOS ===
    { id: "light-peak-physique-viper", weightClass: "Light", passive: "peak-physique", passiveName: "Peak Physique", source: "viper-commandos", image: "https://helldivers.wiki.gg/images/Peak_Physique_Armor_Passive_Icon.svg" },
    { id: "heavy-peak-physique-viper", weightClass: "Heavy", passive: "peak-physique", passiveName: "Peak Physique", source: "viper-commandos", image: "https://helldivers.wiki.gg/images/Peak_Physique_Armor_Passive_Icon.svg" },

    // === FREEDOM'S FLAME ===
    { id: "light-inflammable-flame", weightClass: "Light", passive: "inflammable", passiveName: "Inflammable", source: "freedoms-flame", image: "https://helldivers.wiki.gg/images/Inflammable_Armor_Passive_Icon.svg" },
    { id: "medium-inflammable-flame", weightClass: "Medium", passive: "inflammable", passiveName: "Inflammable", source: "freedoms-flame", image: "https://helldivers.wiki.gg/images/Inflammable_Armor_Passive_Icon.svg" },

    // === CHEMICAL AGENTS ===
    { id: "light-advanced-filtration-chem", weightClass: "Light", passive: "advanced-filtration", passiveName: "Advanced Filtration", source: "chemical-agents", image: "https://helldivers.wiki.gg/images/Advanced_Filtration_Armor_Passive_Icon.svg" },
    { id: "medium-advanced-filtration-chem", weightClass: "Medium", passive: "advanced-filtration", passiveName: "Advanced Filtration", source: "chemical-agents", image: "https://helldivers.wiki.gg/images/Advanced_Filtration_Armor_Passive_Icon.svg" },

    // === TRUTH ENFORCERS ===
    { id: "light-unflinching-truth", weightClass: "Light", passive: "unflinching", passiveName: "Unflinching", source: "truth-enforcers", image: "https://helldivers.wiki.gg/images/Unflinching_Armor_Passive_Icon.svg" },
    { id: "medium-unflinching-truth", weightClass: "Medium", passive: "unflinching", passiveName: "Unflinching", source: "truth-enforcers", image: "https://helldivers.wiki.gg/images/Unflinching_Armor_Passive_Icon.svg" },

    // === SERVANTS OF FREEDOM ===
    { id: "medium-integrated-explosives-servants", weightClass: "Medium", passive: "integrated-explosives", passiveName: "Integrated Explosives", source: "servants-of-freedom", image: "https://helldivers.wiki.gg/images/Integrated_Explosives_Armor_Passive_Icon.svg" },

    // === URBAN LEGENDS ===
    { id: "light-siege-ready-urban", weightClass: "Light", passive: "siege-ready", passiveName: "Siege-Ready", source: "urban-legends", image: "https://helldivers.wiki.gg/images/Siege-Ready_Armor_Passive_Icon.svg" },
    { id: "heavy-siege-ready-urban", weightClass: "Heavy", passive: "siege-ready", passiveName: "Siege-Ready", source: "urban-legends", image: "https://helldivers.wiki.gg/images/Siege-Ready_Armor_Passive_Icon.svg" },

    // === BORDERLINE JUSTICE ===
    { id: "medium-gunslinger-borderline", weightClass: "Medium", passive: "gunslinger", passiveName: "Gunslinger", source: "borderline-justice", image: "https://helldivers.wiki.gg/images/Gunslinger_Armor_Passive_Icon.svg" },
    { id: "heavy-gunslinger-borderline", weightClass: "Heavy", passive: "gunslinger", passiveName: "Gunslinger", source: "borderline-justice", image: "https://helldivers.wiki.gg/images/Gunslinger_Armor_Passive_Icon.svg" },

    // === MASTERS OF CEREMONY ===
    { id: "light-reinforced-epaulettes-masters", weightClass: "Light", passive: "reinforced-epaulettes", passiveName: "Reinforced Epaulettes", source: "masters-of-ceremony", image: "https://helldivers.wiki.gg/images/Reinforced_Epaulettes_Armor_Passive_Icon.svg" },
    { id: "medium-reinforced-epaulettes-masters", weightClass: "Medium", passive: "reinforced-epaulettes", passiveName: "Reinforced Epaulettes", source: "masters-of-ceremony", image: "https://helldivers.wiki.gg/images/Reinforced_Epaulettes_Armor_Passive_Icon.svg" },

    // === FORCE OF LAW ===
    { id: "light-ballistic-padding-law", weightClass: "Light", passive: "ballistic-padding", passiveName: "Ballistic Padding", source: "force-of-law", image: "https://helldivers.wiki.gg/images/Ballistic_Padding_Armor_Passive_Icon.svg" },
    { id: "medium-ballistic-padding-law", weightClass: "Medium", passive: "ballistic-padding", passiveName: "Ballistic Padding", source: "force-of-law", image: "https://helldivers.wiki.gg/images/Ballistic_Padding_Armor_Passive_Icon.svg" },

    // === DUST DEVILS ===
    { id: "medium-desert-stormer-dust", weightClass: "Medium", passive: "desert-stormer", passiveName: "Desert Stormer", source: "dust-devils", image: "https://helldivers.wiki.gg/images/Desert_Stormer_Armor_Passive_Icon.svg" },
    { id: "heavy-desert-stormer-dust", weightClass: "Heavy", passive: "desert-stormer", passiveName: "Desert Stormer", source: "dust-devils", image: "https://helldivers.wiki.gg/images/Desert_Stormer_Armor_Passive_Icon.svg" },

    // === CONTROL GROUP ===
    { id: "medium-adreno-defibrillator-control", weightClass: "Medium", passive: "adreno-defibrillator", passiveName: "Adreno-Defibrillator", source: "control-group", image: "https://helldivers.wiki.gg/images/Adreno-Defibrillator_Armor_Passive_Icon.svg" },
    { id: "heavy-adreno-defibrillator-control", weightClass: "Heavy", passive: "adreno-defibrillator", passiveName: "Adreno-Defibrillator", source: "control-group", image: "https://helldivers.wiki.gg/images/Adreno-Defibrillator_Armor_Passive_Icon.svg" },

    // === PYTHON COMMANDOS ===
    { id: "light-rock-solid-python", weightClass: "Light", passive: "rock-solid", passiveName: "Rock Solid", source: "python-commandos", image: "https://helldivers.wiki.gg/images/Rock_Solid_Armor_Passive_Icon.svg" },
    { id: "heavy-rock-solid-python", weightClass: "Heavy", passive: "rock-solid", passiveName: "Rock Solid", source: "python-commandos", image: "https://helldivers.wiki.gg/images/Rock_Solid_Armor_Passive_Icon.svg" },

    // === REDACTED REGIMENT ===
    { id: "light-reduced-signature-redacted", weightClass: "Light", passive: "reduced-signature", passiveName: "Reduced Signature", source: "redacted-regiment", image: "https://helldivers.wiki.gg/images/Reduced_Signature_Armor_Passive_Icon.svg" },
    { id: "medium-reduced-signature-redacted", weightClass: "Medium", passive: "reduced-signature", passiveName: "Reduced Signature", source: "redacted-regiment", image: "https://helldivers.wiki.gg/images/Reduced_Signature_Armor_Passive_Icon.svg" },

    // === SIEGE BREAKERS ===
    { id: "medium-supplementary-adrenaline-siege", weightClass: "Medium", passive: "supplementary-adrenaline", passiveName: "Supplementary Adrenaline", source: "siege-breakers", image: "https://helldivers.wiki.gg/images/Supplementary_Adrenaline_Armor_Passive_Icon.svg" },
    { id: "heavy-supplementary-adrenaline-siege", weightClass: "Heavy", passive: "supplementary-adrenaline", passiveName: "Supplementary Adrenaline", source: "siege-breakers", image: "https://helldivers.wiki.gg/images/Supplementary_Adrenaline_Armor_Passive_Icon.svg" },

    // === HALO: ODST ===
    { id: "medium-feet-first-halo", weightClass: "Medium", passive: "feet-first", passiveName: "Feet First", source: "halo-odst", image: "https://helldivers.wiki.gg/images/Feet_First_Armor_Passive_Icon.svg" },

    // === KILLZONE ===
    { id: "light-acclimated-killzone", weightClass: "Light", passive: "acclimated", passiveName: "Acclimated", source: "killzone", image: "https://helldivers.wiki.gg/images/Acclimated_Armor_Passive_Icon.svg" },
    { id: "medium-acclimated-killzone", weightClass: "Medium", passive: "acclimated", passiveName: "Acclimated", source: "killzone", image: "https://helldivers.wiki.gg/images/Acclimated_Armor_Passive_Icon.svg" },

    // === SUPERSTORE (exclusive combos not available from any warbond) ===
    { id: "light-servo-assisted-store", weightClass: "Light", passive: "servo-assisted", passiveName: "Servo-Assisted", source: "superstore", image: "https://helldivers.wiki.gg/images/Servo-Assisted_Armor_Passive_Icon.svg" },
    { id: "light-fortified-store", weightClass: "Light", passive: "fortified", passiveName: "Fortified", source: "superstore", image: "https://helldivers.wiki.gg/images/Fortified_Armor_Passive_Icon.svg" },
    { id: "medium-fortified-store", weightClass: "Medium", passive: "fortified", passiveName: "Fortified", source: "superstore", image: "https://helldivers.wiki.gg/images/Fortified_Armor_Passive_Icon.svg" },
    { id: "light-extra-padding-store", weightClass: "Light", passive: "extra-padding", passiveName: "Extra Padding", source: "superstore", image: "https://helldivers.wiki.gg/images/Extra_Padding_Armor_Passive_Icon.svg" },
    { id: "heavy-extra-padding-store", weightClass: "Heavy", passive: "extra-padding", passiveName: "Extra Padding", source: "superstore", image: "https://helldivers.wiki.gg/images/Extra_Padding_Armor_Passive_Icon.svg" },
    { id: "light-med-kit-store", weightClass: "Light", passive: "med-kit", passiveName: "Med-Kit", source: "superstore", image: "https://helldivers.wiki.gg/images/Med-Kit_Armor_Passive_Icon.svg" },
    { id: "heavy-med-kit-store", weightClass: "Heavy", passive: "med-kit", passiveName: "Med-Kit", source: "superstore", image: "https://helldivers.wiki.gg/images/Med-Kit_Armor_Passive_Icon.svg" },
    { id: "heavy-engineering-kit-store", weightClass: "Heavy", passive: "engineering-kit", passiveName: "Engineering Kit", source: "superstore", image: "https://helldivers.wiki.gg/images/Engineering_Kit_Armor_Passive_Icon.svg" },
    { id: "medium-peak-physique-store", weightClass: "Medium", passive: "peak-physique", passiveName: "Peak Physique", source: "superstore", image: "https://helldivers.wiki.gg/images/Peak_Physique_Armor_Passive_Icon.svg" },
    { id: "heavy-inflammable-store", weightClass: "Heavy", passive: "inflammable", passiveName: "Inflammable", source: "superstore", image: "https://helldivers.wiki.gg/images/Inflammable_Armor_Passive_Icon.svg" },
    { id: "heavy-advanced-filtration-store", weightClass: "Heavy", passive: "advanced-filtration", passiveName: "Advanced Filtration", source: "superstore", image: "https://helldivers.wiki.gg/images/Advanced_Filtration_Armor_Passive_Icon.svg" },
    { id: "medium-siege-ready-store", weightClass: "Medium", passive: "siege-ready", passiveName: "Siege-Ready", source: "superstore", image: "https://helldivers.wiki.gg/images/Siege-Ready_Armor_Passive_Icon.svg" },
    { id: "light-integrated-explosives-store", weightClass: "Light", passive: "integrated-explosives", passiveName: "Integrated Explosives", source: "superstore", image: "https://helldivers.wiki.gg/images/Integrated_Explosives_Armor_Passive_Icon.svg" },
    { id: "light-gunslinger-store", weightClass: "Light", passive: "gunslinger", passiveName: "Gunslinger", source: "superstore", image: "https://helldivers.wiki.gg/images/Gunslinger_Armor_Passive_Icon.svg" },
    { id: "heavy-reinforced-epaulettes-store", weightClass: "Heavy", passive: "reinforced-epaulettes", passiveName: "Reinforced Epaulettes", source: "superstore", image: "https://helldivers.wiki.gg/images/Reinforced_Epaulettes_Armor_Passive_Icon.svg" },
    { id: "heavy-ballistic-padding-store", weightClass: "Heavy", passive: "ballistic-padding", passiveName: "Ballistic Padding", source: "superstore", image: "https://helldivers.wiki.gg/images/Ballistic_Padding_Armor_Passive_Icon.svg" },
    { id: "light-adreno-defibrillator-store", weightClass: "Light", passive: "adreno-defibrillator", passiveName: "Adreno-Defibrillator", source: "superstore", image: "https://helldivers.wiki.gg/images/Adreno-Defibrillator_Armor_Passive_Icon.svg" },
    { id: "light-desert-stormer-store", weightClass: "Light", passive: "desert-stormer", passiveName: "Desert Stormer", source: "superstore", image: "https://helldivers.wiki.gg/images/Desert_Stormer_Armor_Passive_Icon.svg" },
    { id: "medium-rock-solid-store", weightClass: "Medium", passive: "rock-solid", passiveName: "Rock Solid", source: "superstore", image: "https://helldivers.wiki.gg/images/Rock_Solid_Armor_Passive_Icon.svg" }
];
