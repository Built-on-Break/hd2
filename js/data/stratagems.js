window.HD2Data = window.HD2Data || {};
window.HD2Data.stratagems = [

    // =====================================================================
    // SUPPORT WEAPONS
    // =====================================================================

    // --- Main (persistent/reloadable) support weapons ---
    { id: "mg-43-machine-gun", name: "MG-43 Machine Gun", category: "support-weapon", subcategory: "main", hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Machine_Gun_Stratagem_Icon.svg" },
    { id: "m-105-stalwart", name: "M-105 Stalwart", category: "support-weapon", subcategory: "main", hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Stalwart_Stratagem_Icon.svg" },
    { id: "las-98-laser-cannon", name: "LAS-98 Laser Cannon", category: "support-weapon", subcategory: "main", hasBackpack: false, atScore: 1, source: "base", image: "https://helldivers.wiki.gg/images/Laser_Cannon_Stratagem_Icon.svg" },
    { id: "apw-1-anti-materiel-rifle", name: "APW-1 Anti-Materiel Rifle", category: "support-weapon", subcategory: "main", hasBackpack: false, atScore: 1, source: "base", image: "https://helldivers.wiki.gg/images/Anti-Materiel_Rifle_Stratagem_Icon.svg" },
    { id: "gr-8-recoilless-rifle", name: "GR-8 Recoilless Rifle", category: "support-weapon", subcategory: "main", hasBackpack: true, atScore: 3, source: "base", image: "https://helldivers.wiki.gg/images/Recoilless_Rifle_Stratagem_Icon.svg" },
    { id: "gl-21-grenade-launcher", name: "GL-21 Grenade Launcher", category: "support-weapon", subcategory: "main", hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Grenade_Launcher_Stratagem_Icon.svg" },
    { id: "flam-40-flamethrower", name: "FLAM-40 Flamethrower", category: "support-weapon", subcategory: "main", hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Flamethrower_Stratagem_Icon.svg" },
    { id: "mg-206-heavy-machine-gun", name: "MG-206 Heavy Machine Gun", category: "support-weapon", subcategory: "main", hasBackpack: false, atScore: 1, source: "base", image: "https://helldivers.wiki.gg/images/Heavy_Machine_Gun_Stratagem_Icon.svg" },
    { id: "ac-8-autocannon", name: "AC-8 Autocannon", category: "support-weapon", subcategory: "main", hasBackpack: true, atScore: 2, source: "base", image: "https://helldivers.wiki.gg/images/Autocannon_Stratagem_Icon.svg" },
    { id: "arc-3-arc-thrower", name: "ARC-3 Arc Thrower", category: "support-weapon", subcategory: "main", hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Arc_Thrower_Stratagem_Icon.svg" },
    { id: "las-99-quasar-cannon", name: "LAS-99 Quasar Cannon", category: "support-weapon", subcategory: "main", hasBackpack: false, atScore: 3, source: "base", image: "https://helldivers.wiki.gg/images/Quasar_Cannon_Stratagem_Icon.svg" },
    { id: "rl-77-airburst-rocket-launcher", name: "RL-77 Airburst Rocket Launcher", category: "support-weapon", subcategory: "main", hasBackpack: true, source: "base", image: "https://helldivers.wiki.gg/images/Airburst_Rocket_Launcher_Stratagem_Icon.svg" },
    { id: "mls-4x-commando", name: "MLS-4X Commando", category: "support-weapon", subcategory: "main", hasBackpack: false, atScore: 2, source: "base", image: "https://helldivers.wiki.gg/images/Commando_Stratagem_Icon.svg" },
    { id: "faf-14-spear", name: "FAF-14 Spear", category: "support-weapon", subcategory: "main", hasBackpack: true, atScore: 3, source: "base", image: "https://helldivers.wiki.gg/images/Spear_Stratagem_Icon.svg" },
    { id: "rs-422-railgun", name: "RS-422 Railgun", category: "support-weapon", subcategory: "main", hasBackpack: false, atScore: 2, source: "base", image: "https://helldivers.wiki.gg/images/Railgun_Stratagem_Icon.svg" },
    { id: "sta-x3-wasp-launcher", name: "StA-X3 W.A.S.P. Launcher", category: "support-weapon", subcategory: "main", hasBackpack: true, atScore: 1, source: "base", image: "https://helldivers.wiki.gg/images/W.A.S.P._Launcher_Stratagem_Icon.svg" },
    { id: "cqc-20-breaching-hammer", name: "CQC-20 Breaching Hammer", category: "support-weapon", subcategory: "main", hasBackpack: false, atScore: 1, source: "siege-breakers", image: "https://helldivers.wiki.gg/images/Breaching_Hammer_Stratagem_Icon.svg" },
    { id: "plas-45-epoch", name: "PLAS-45 Epoch", category: "support-weapon", subcategory: "main", hasBackpack: false, atScore: 2, source: "control-group", image: "https://helldivers.wiki.gg/images/Epoch_Stratagem_Icon.svg" },
    { id: "s-11-speargun", name: "S-11 Speargun", category: "support-weapon", subcategory: "main", hasBackpack: false, atScore: 1, source: "dust-devils", image: "https://helldivers.wiki.gg/images/Speargun_Stratagem_Icon.svg" },
    { id: "cqc-9-defoliation-tool", name: "CQC-9 Defoliation Tool", category: "support-weapon", subcategory: "main", hasBackpack: false, atScore: 1, source: "python-commandos", image: "https://helldivers.wiki.gg/images/Defoliation_Tool_Stratagem_Icon.svg" },
    { id: "tx-41-sterilizer", name: "TX-41 Sterilizer", category: "support-weapon", subcategory: "main", hasBackpack: false, source: "chemical-agents", image: "https://helldivers.wiki.gg/images/Sterilizer_Stratagem_Icon.svg" },
    { id: "gl-52-de-escalator", name: "GL-52 De-Escalator", category: "support-weapon", subcategory: "main", hasBackpack: false, source: "force-of-law", image: "https://helldivers.wiki.gg/images/De-Escalator_Stratagem_Icon.svg" },
    { id: "gl-28-belt-fed-grenade-launcher", name: "GL-28 Belt-Fed Grenade Launcher", category: "support-weapon", subcategory: "main", hasBackpack: true, source: "siege-breakers", image: "https://helldivers.wiki.gg/images/Belt-Fed_Grenade_Launcher_Stratagem_Icon.svg" },
    { id: "m-1000-maxigun", name: "M-1000 Maxigun", category: "support-weapon", subcategory: "main", hasBackpack: true, source: "python-commandos", image: "https://helldivers.wiki.gg/images/Maxigun_Stratagem_Icon.svg" },
    { id: "cqc-1-one-true-flag", name: "CQC-1 One True Flag", category: "support-weapon", subcategory: "main", hasBackpack: false, source: "masters-of-ceremony", image: "https://helldivers.wiki.gg/images/One_True_Flag_Stratagem_Icon.svg" },
    { id: "bmd-c4-pack", name: "B/MD C4 Pack", category: "support-weapon", subcategory: "main", hasBackpack: true, atScore: 3, source: "redacted-regiment", image: "https://helldivers.wiki.gg/images/C4_Pack_Stratagem_Icon.svg" },

    { id: "bflam-80-cremator", name: "B/FLAM-80 Cremator", category: "support-weapon", subcategory: "main", hasBackpack: true, atScore: 1, source: "entrenched-division", image: "https://helldivers.wiki.gg/images/Cremator_Stratagem_Icon.svg" },

    // --- Expendable (single-use) support weapons ---
    { id: "eat-17-expendable-anti-tank", name: "EAT-17 Expendable Anti-Tank", category: "support-weapon", subcategory: "expendable", hasBackpack: false, atScore: 3, source: "base", image: "https://helldivers.wiki.gg/images/Expendable_Anti-Tank_Stratagem_Icon.svg" },
    { id: "eat-411-leveller", name: "EAT-411 Leveller", category: "support-weapon", subcategory: "expendable", hasBackpack: false, atScore: 3, source: "siege-breakers", image: "https://helldivers.wiki.gg/images/Leveller_Stratagem_Icon.svg" },
    { id: "eat-700-expendable-napalm", name: "EAT-700 Expendable Napalm", category: "support-weapon", subcategory: "expendable", hasBackpack: false, source: "dust-devils", image: "https://helldivers.wiki.gg/images/Expendable_Napalm_Stratagem_Icon.svg" },
    { id: "ms-11-solo-silo", name: "MS-11 Solo Silo", category: "support-weapon", subcategory: "expendable", hasBackpack: false, source: "dust-devils", image: "https://helldivers.wiki.gg/images/Solo_Silo_Stratagem_Icon.svg" },

    // =====================================================================
    // ORBITAL STRIKES
    // =====================================================================

    { id: "orbital-precision-strike", name: "Orbital Precision Strike", category: "orbital", subcategory: null, hasBackpack: false, atScore: 1, source: "base", image: "https://helldivers.wiki.gg/images/Orbital_Precision_Strike_Stratagem_Icon.svg" },
    { id: "orbital-gatling-barrage", name: "Orbital Gatling Barrage", category: "orbital", subcategory: null, hasBackpack: false, atScore: 1, source: "base", image: "https://helldivers.wiki.gg/images/Orbital_Gatling_Barrage_Stratagem_Icon.svg" },
    { id: "orbital-gas-strike", name: "Orbital Gas Strike", category: "orbital", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Orbital_Gas_Strike_Stratagem_Icon.svg" },
    { id: "orbital-120mm-he-barrage", name: "Orbital 120mm HE Barrage", category: "orbital", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Orbital_120mm_HE_Barrage_Stratagem_Icon.svg" },
    { id: "orbital-airburst-strike", name: "Orbital Airburst Strike", category: "orbital", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Orbital_Airburst_Strike_Stratagem_Icon.svg" },
    { id: "orbital-smoke-strike", name: "Orbital Smoke Strike", category: "orbital", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Orbital_Smoke_Strike_Stratagem_Icon.svg" },
    { id: "orbital-ems-strike", name: "Orbital EMS Strike", category: "orbital", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Orbital_EMS_Strike_Stratagem_Icon.svg" },
    { id: "orbital-380mm-he-barrage", name: "Orbital 380mm HE Barrage", category: "orbital", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Orbital_380mm_HE_Barrage_Stratagem_Icon.svg" },
    { id: "orbital-walking-barrage", name: "Orbital Walking Barrage", category: "orbital", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Orbital_Walking_Barrage_Stratagem_Icon.svg" },
    { id: "orbital-laser", name: "Orbital Laser", category: "orbital", subcategory: null, hasBackpack: false, atScore: 2, source: "base", image: "https://helldivers.wiki.gg/images/Orbital_Laser_Stratagem_Icon.svg" },
    { id: "orbital-napalm-barrage", name: "Orbital Napalm Barrage", category: "orbital", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Orbital_Napalm_Barrage_Stratagem_Icon.svg" },
    { id: "orbital-railcannon-strike", name: "Orbital Railcannon Strike", category: "orbital", subcategory: null, hasBackpack: false, atScore: 2, source: "base", image: "https://helldivers.wiki.gg/images/Orbital_Railcannon_Strike_Stratagem_Icon.svg" },

    // =====================================================================
    // EAGLE STRIKES
    // =====================================================================

    { id: "eagle-strafing-run", name: "Eagle Strafing Run", category: "eagle", subcategory: null, hasBackpack: false, atScore: 1, source: "base", image: "https://helldivers.wiki.gg/images/Eagle_Strafing_Run_Stratagem_Icon.svg" },
    { id: "eagle-airstrike", name: "Eagle Airstrike", category: "eagle", subcategory: null, hasBackpack: false, atScore: 1, source: "base", image: "https://helldivers.wiki.gg/images/Eagle_Airstrike_Stratagem_Icon.svg" },
    { id: "eagle-cluster-bomb", name: "Eagle Cluster Bomb", category: "eagle", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Eagle_Cluster_Bomb_Stratagem_Icon.svg" },
    { id: "eagle-smoke-strike", name: "Eagle Smoke Strike", category: "eagle", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Eagle_Smoke_Strike_Stratagem_Icon.svg" },
    { id: "eagle-napalm-airstrike", name: "Eagle Napalm Airstrike", category: "eagle", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Eagle_Napalm_Airstrike_Stratagem_Icon.svg" },
    { id: "eagle-110mm-rocket-pods", name: "Eagle 110mm Rocket Pods", category: "eagle", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Eagle_110mm_Rocket_Pods_Stratagem_Icon.svg" },
    { id: "eagle-500kg-bomb", name: "Eagle 500kg Bomb", category: "eagle", subcategory: null, hasBackpack: false, atScore: 2, source: "base", image: "https://helldivers.wiki.gg/images/Eagle_500kg_Bomb_Stratagem_Icon.svg" },

    // =====================================================================
    // SENTRIES
    // =====================================================================

    { id: "amg-43-machine-gun-sentry", name: "A/MG-43 Machine Gun Sentry", category: "sentry", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Machine_Gun_Sentry_Stratagem_Icon.svg" },
    { id: "ag-16-gatling-sentry", name: "A/G-16 Gatling Sentry", category: "sentry", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Gatling_Sentry_Stratagem_Icon.svg" },
    { id: "aac-8-autocannon-sentry", name: "A/AC-8 Autocannon Sentry", category: "sentry", subcategory: null, hasBackpack: false, atScore: 1, source: "base", image: "https://helldivers.wiki.gg/images/Autocannon_Sentry_Stratagem_Icon.svg" },
    { id: "am-12-mortar-sentry", name: "A/M-12 Mortar Sentry", category: "sentry", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Mortar_Sentry_Stratagem_Icon.svg" },
    { id: "amls-4x-rocket-sentry", name: "A/MLS-4X Rocket Sentry", category: "sentry", subcategory: null, hasBackpack: false, atScore: 2, source: "base", image: "https://helldivers.wiki.gg/images/Rocket_Sentry_Stratagem_Icon.svg" },
    { id: "am-23-ems-mortar-sentry", name: "A/M-23 EMS Mortar Sentry", category: "sentry", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/EMS_Mortar_Sentry_Stratagem_Icon.svg" },
    { id: "alas-98-laser-sentry", name: "A/LAS-98 Laser Sentry", category: "sentry", subcategory: null, hasBackpack: false, source: "control-group", image: "https://helldivers.wiki.gg/images/Laser_Sentry_Stratagem_Icon.svg" },
    { id: "aflam-40-flame-sentry", name: "A/FLAM-40 Flame Sentry", category: "sentry", subcategory: null, hasBackpack: false, source: "urban-legends", image: "https://helldivers.wiki.gg/images/Flame_Sentry_Stratagem_Icon.svg" },
    { id: "agm-17-gas-mortar-sentry", name: "A/GM-17 Gas Mortar Sentry", category: "sentry", subcategory: null, hasBackpack: false, source: "entrenched-division", image: "https://helldivers.wiki.gg/images/Gas_Mortar_Sentry_Stratagem_Icon.svg" },

    // =====================================================================
    // EMPLACEMENTS
    // =====================================================================

    { id: "md-6-anti-personnel-minefield", name: "MD-6 Anti-Personnel Minefield", category: "emplacement", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Anti-Personnel_Minefield_Stratagem_Icon.svg" },
    { id: "md-i4-incendiary-mines", name: "MD-I4 Incendiary Mines", category: "emplacement", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Incendiary_Mines_Stratagem_Icon.svg" },
    { id: "md-17-anti-tank-mines", name: "MD-17 Anti-Tank Mines", category: "emplacement", subcategory: null, hasBackpack: false, atScore: 1, source: "base", image: "https://helldivers.wiki.gg/images/Anti-Tank_Mines_Stratagem_Icon.svg" },
    { id: "aarc-3-tesla-tower", name: "A/ARC-3 Tesla Tower", category: "emplacement", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Tesla_Tower_Stratagem_Icon.svg" },
    { id: "fx-12-shield-generator-relay", name: "FX-12 Shield Generator Relay", category: "emplacement", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Shield_Generator_Relay_Stratagem_Icon.svg" },
    { id: "emg-101-hmg-emplacement", name: "E/MG-101 HMG Emplacement", category: "emplacement", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/HMG_Emplacement_Stratagem_Icon.svg" },
    { id: "egl-21-grenadier-battlement", name: "E/GL-21 Grenadier Battlement", category: "emplacement", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Grenadier_Battlement_Stratagem_Icon.svg" },
    { id: "md-8-gas-mines", name: "MD-8 Gas Mines", category: "emplacement", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Gas_Mines_Stratagem_Icon.svg" },
    { id: "eat-12-anti-tank-emplacement", name: "E/AT-12 Anti-Tank Emplacement", category: "emplacement", subcategory: null, hasBackpack: false, atScore: 3, source: "urban-legends", image: "https://helldivers.wiki.gg/images/Anti-Tank_Emplacement_Stratagem_Icon.svg" },

    // =====================================================================
    // BACKPACKS
    // =====================================================================

    { id: "b-1-supply-pack", name: "B-1 Supply Pack", category: "backpack", subcategory: null, hasBackpack: true, source: "base", image: "https://helldivers.wiki.gg/images/Supply_Pack_Stratagem_Icon.svg" },
    { id: "lift-850-jump-pack", name: "LIFT-850 Jump Pack", category: "backpack", subcategory: null, hasBackpack: true, source: "base", image: "https://helldivers.wiki.gg/images/Jump_Pack_Stratagem_Icon.svg" },
    { id: "sh-20-ballistic-shield-backpack", name: "SH-20 Ballistic Shield Backpack", category: "backpack", subcategory: null, hasBackpack: true, source: "base", image: "https://helldivers.wiki.gg/images/Ballistic_Shield_Backpack_Stratagem_Icon.svg" },
    { id: "axar-23-guard-dog", name: "AX/AR-23 Guard Dog", category: "backpack", subcategory: null, hasBackpack: true, source: "base", image: "https://helldivers.wiki.gg/images/Guard_Dog_Stratagem_Icon.svg" },
    { id: "axlas-5-guard-dog-rover", name: "AX/LAS-5 Guard Dog Rover", category: "backpack", subcategory: null, hasBackpack: true, source: "base", image: "https://helldivers.wiki.gg/images/Rover_Stratagem_Icon.svg" },
    { id: "sh-32-shield-generator-pack", name: "SH-32 Shield Generator Pack", category: "backpack", subcategory: null, hasBackpack: true, source: "base", image: "https://helldivers.wiki.gg/images/Shield_Generator_Pack_Stratagem_Icon.svg" },
    { id: "sh-51-directional-shield", name: "SH-51 Directional Shield", category: "backpack", subcategory: null, hasBackpack: true, source: "urban-legends", image: "https://helldivers.wiki.gg/images/Directional_Shield_Stratagem_Icon.svg" },
    { id: "axflam-75-hot-dog", name: "AX/FLAM-75 Hot Dog", category: "backpack", subcategory: null, hasBackpack: true, source: "python-commandos", image: "https://helldivers.wiki.gg/images/Hot_Dog_Stratagem_Icon.svg" },
    { id: "b-100-portable-hellbomb", name: "B-100 Portable Hellbomb", category: "backpack", subcategory: null, hasBackpack: true, source: "servants-of-freedom", image: "https://helldivers.wiki.gg/images/Portable_Hellbomb_Stratagem_Icon.svg" },
    { id: "axarc-3-k-9", name: "AX/ARC-3 K-9", category: "backpack", subcategory: null, hasBackpack: true, source: "force-of-law", image: "https://helldivers.wiki.gg/images/K-9_Stratagem_Icon.svg" },
    { id: "lift-860-hover-pack", name: "LIFT-860 Hover Pack", category: "backpack", subcategory: null, hasBackpack: true, source: "borderline-justice", image: "https://helldivers.wiki.gg/images/Hover_Pack_Stratagem_Icon.svg" },
    { id: "axtx-13-dog-breath", name: "AX/TX-13 Dog Breath", category: "backpack", subcategory: null, hasBackpack: true, source: "chemical-agents", image: "https://helldivers.wiki.gg/images/Dog_Breath_Stratagem_Icon.svg" },
    { id: "lift-182-warp-pack", name: "LIFT-182 Warp Pack", category: "backpack", subcategory: null, hasBackpack: true, source: "control-group", image: "https://helldivers.wiki.gg/images/Warp_Pack_Stratagem_Icon.svg" },

    // =====================================================================
    // VEHICLES / EXOSUITS
    // =====================================================================

    { id: "exo-45-patriot-exosuit", name: "EXO-45 Patriot Exosuit", category: "vehicle", subcategory: null, hasBackpack: false, atScore: 1, source: "base", image: "https://helldivers.wiki.gg/images/Patriot_Exosuit_Stratagem_Icon.svg" },
    { id: "exo-49-emancipator-exosuit", name: "EXO-49 Emancipator Exosuit", category: "vehicle", subcategory: null, hasBackpack: false, atScore: 1, source: "base", image: "https://helldivers.wiki.gg/images/Emancipator_Exosuit_Stratagem_Icon.svg" },
    { id: "m-102-fast-recon-vehicle", name: "M-102 Fast Recon Vehicle", category: "vehicle", subcategory: null, hasBackpack: false, source: "base", image: "https://helldivers.wiki.gg/images/Fast_Recon_Vehicle_Stratagem_Icon.svg" },
    { id: "td-220-bastion-mk-xvi", name: "TD-220 Bastion MK XVI", category: "vehicle", subcategory: null, hasBackpack: false, atScore: 2, source: "base", image: "https://helldivers.wiki.gg/images/Bastion_MK_XVI_Stratagem_Icon.svg" }
];
