window.HD2Data = window.HD2Data || {};
window.HD2Data.primaryWeapons = [

    // =====================================================================
    // ASSAULT RIFLES
    // eliteScore: medium-armor pen, burst damage, precision vs medium threats
    // =====================================================================

    { id: "ar23-liberator", name: "AR-23 Liberator", category: "Assault Rifle", source: "base", ccScore: 1, eliteScore: 1, image: "https://helldivers.wiki.gg/images/AR-23_Liberator_Primary_Render.png" },
    { id: "ar23p-liberator-penetrator", name: "AR-23P Liberator Penetrator", category: "Assault Rifle", source: "helldivers-mobilize", ccScore: 1, eliteScore: 2, image: "https://helldivers.wiki.gg/images/AR-23P_Liberator_Penetrator_Primary_Render.png" },
    { id: "ar23c-liberator-concussive", name: "AR-23C Liberator Concussive", category: "Assault Rifle", source: "steeled-veterans", ccScore: 1, image: "https://helldivers.wiki.gg/images/AR-23C_Liberator_Concussive_Primary_Render.png" },
    { id: "ar23a-liberator-carbine", name: "AR-23A Liberator Carbine", category: "Assault Rifle", source: "viper-commandos", ccScore: 2, eliteScore: 1, image: "https://helldivers.wiki.gg/images/AR-23A_Liberator_Carbine_Primary_Render.png" },
    { id: "ar61-tenderizer", name: "AR-61 Tenderizer", category: "Assault Rifle", source: "polar-patriots", ccScore: 1, eliteScore: 1, image: "https://helldivers.wiki.gg/images/AR-61_Tenderizer_Primary_Render.png" },
    { id: "ar2-coyote", name: "AR-2 Coyote", category: "Assault Rifle", source: "dust-devils", ccScore: 2, eliteScore: 2, image: "https://helldivers.wiki.gg/images/AR-2_Coyote_Primary_Render.png" },
    { id: "ar32-pacifier", name: "AR-32 Pacifier", category: "Assault Rifle", source: "force-of-law", ccScore: 1, image: "https://helldivers.wiki.gg/images/AR-32_Pacifier_Primary_Render.png" },
    { id: "br14-adjudicator", name: "BR-14 Adjudicator", category: "Assault Rifle", source: "democratic-detonation", ccScore: 1, eliteScore: 2, image: "https://helldivers.wiki.gg/images/BR-14_Adjudicator_Primary_Render.png" },
    { id: "sta52-assault-rifle", name: "StA-52 Assault Rifle", category: "Assault Rifle", source: "killzone", ccScore: 1, eliteScore: 1, image: "https://helldivers.wiki.gg/images/StA-52_Assault_Rifle_Primary_Render.png" },
    { id: "ma5c-assault-rifle", name: "MA5C Assault Rifle", category: "Assault Rifle", source: "halo-odst", ccScore: 1, eliteScore: 1, image: "https://helldivers.wiki.gg/images/MA5C_Assault_Rifle_Primary_Render.png" },
    { id: "argl21-one-two", name: "AR/GL-21 One-Two", category: "Assault Rifle", source: "python-commandos", ccScore: 2, eliteScore: 1, closesObjectives: true, image: "https://helldivers.wiki.gg/images/AR-GL-21_One_Two_Primary_Render.png" },
    { id: "ar59-suppressor", name: "AR-59 Suppressor", category: "Assault Rifle", ccScore: 1, source: "redacted-regiment", image: "https://helldivers.wiki.gg/images/AR-59_Suppressor_Primary_Render.png" },

    // =====================================================================
    // MARKSMAN RIFLES
    // High eliteScore — precision weapons excel at medium-threat headshots
    // =====================================================================

    { id: "r63-diligence", name: "R-63 Diligence", category: "Marksman Rifle", eliteScore: 1, source: "helldivers-mobilize", image: "https://helldivers.wiki.gg/images/R-63_Diligence_Primary_Render.png" },
    { id: "r63cs-diligence-counter-sniper", name: "R-63CS Diligence Counter Sniper", category: "Marksman Rifle", eliteScore: 2, source: "helldivers-mobilize", image: "https://helldivers.wiki.gg/images/R-63CS_Diligence_Counter_Sniper_Primary_Render.png" },
    { id: "r2124-constitution", name: "R-2124 Constitution", category: "Marksman Rifle", source: "base", image: "https://helldivers.wiki.gg/images/R-2124_Constitution_Primary_Render.png" },
    { id: "r2-amendment", name: "R-2 Amendment", category: "Marksman Rifle", eliteScore: 1, source: "masters-of-ceremony", image: "https://helldivers.wiki.gg/images/R-2_Amendment_Primary_Render.png" },
    { id: "r6-deadeye", name: "R-6 Deadeye", category: "Marksman Rifle", eliteScore: 1, source: "borderline-justice", image: "https://helldivers.wiki.gg/images/R-6_Deadeye_Primary_Render.png" },
    { id: "r72-censor", name: "R-72 Censor", category: "Marksman Rifle", eliteScore: 1, source: "redacted-regiment", image: "https://helldivers.wiki.gg/images/R-72_Censor_Primary_Render.png" },

    // =====================================================================
    // SUBMACHINE GUNS
    // High ROF but low pen — good CC, weak vs elites
    // =====================================================================

    { id: "smg37-defender", name: "SMG-37 Defender", category: "SMG", source: "helldivers-mobilize", ccScore: 1, image: "https://helldivers.wiki.gg/images/SMG-37_Defender_Primary_Render.png" },
    { id: "smg72-pummeler", name: "SMG-72 Pummeler", category: "SMG", source: "polar-patriots", ccScore: 1, image: "https://helldivers.wiki.gg/images/SMG-72_Pummeler_Primary_Render.png" },
    { id: "mp98-knight", name: "MP-98 Knight", category: "SMG", source: "base", ccScore: 1, image: "https://helldivers.wiki.gg/images/MP-98_Knight_Primary_Render.png" },
    { id: "sta11-smg", name: "StA-11 SMG", category: "SMG", source: "killzone", ccScore: 1, image: "https://helldivers.wiki.gg/images/StA-11_SMG_Primary_Render.png" },
    { id: "m7s-smg", name: "M7S SMG", category: "SMG", source: "halo-odst", ccScore: 1, image: "https://helldivers.wiki.gg/images/M7S_SMG_Primary_Render.png" },
    { id: "smg32-reprimand", name: "SMG-32 Reprimand", category: "SMG", source: "truth-enforcers", ccScore: 1, eliteScore: 1, image: "https://helldivers.wiki.gg/images/SMG-32_Reprimand_Primary_Render.png" },
    { id: "smgflam34-stoker", name: "SMG/FLAM-34 Stoker", category: "SMG", ccScore: 1, eliteScore: 1, source: "entrenched-division", image: "https://helldivers.wiki.gg/images/SMGFLAM-34_Stoker_Primary_Icon.png" },

    // =====================================================================
    // SHOTGUNS
    // Great CC, mixed elite handling
    // =====================================================================

    { id: "sg225-breaker", name: "SG-225 Breaker", category: "Shotgun", ccScore: 2, source: "helldivers-mobilize", image: "https://helldivers.wiki.gg/images/SG-225_Breaker_Primary_Render.png" },
    { id: "sg225sp-breaker-spraypray", name: "SG-225SP Breaker Spray&Pray", category: "Shotgun", source: "helldivers-mobilize", ccScore: 2, image: "https://helldivers.wiki.gg/images/SG-225SP_Breaker_Spray%26Pray_Primary_Render.png" },
    { id: "sg225ie-breaker-incendiary", name: "SG-225IE Breaker Incendiary", category: "Shotgun", source: "steeled-veterans", ccScore: 2, image: "https://helldivers.wiki.gg/images/SG-225IE_Breaker_Incendiary_Primary_Render.png" },
    { id: "sg8-punisher", name: "SG-8 Punisher", category: "Shotgun", source: "helldivers-mobilize", ccScore: 1, eliteScore: 1, image: "https://helldivers.wiki.gg/images/SG-8_Punisher_Primary_Render.png" },
    { id: "sg8s-slugger", name: "SG-8S Slugger", category: "Shotgun", source: "helldivers-mobilize", ccScore: 1, eliteScore: 1, image: "https://helldivers.wiki.gg/images/SG-8S_Slugger_Primary_Render.png" },
    { id: "sg8p-punisher-plasma", name: "SG-8P Punisher Plasma", category: "Shotgun", source: "cutting-edge", ccScore: 2, eliteScore: 2, image: "https://helldivers.wiki.gg/images/SG-8P_Punisher_Plasma_Primary_Render.png" },
    { id: "sg451-cookout", name: "SG-451 Cookout", category: "Shotgun", source: "freedoms-flame", ccScore: 2, image: "https://helldivers.wiki.gg/images/SG-451_Cookout_Primary_Render.png" },
    { id: "sg20-halt", name: "SG-20 Halt", category: "Shotgun", source: "truth-enforcers", ccScore: 1, eliteScore: 1, image: "https://helldivers.wiki.gg/images/SG-20_Halt_Primary_Render.png" },
    { id: "m90a-shotgun", name: "M90A Shotgun", category: "Shotgun", source: "halo-odst", ccScore: 1, image: "https://helldivers.wiki.gg/images/M90A_Shotgun_Primary_Render.png" },
    { id: "dbs2-double-freedom", name: "DBS-2 Double Freedom", category: "Shotgun", ccScore: 1, eliteScore: 2, source: "superstore", image: "https://helldivers.wiki.gg/images/DBS-2_Shotgun_Primary_Render.png" },
    { id: "sg97-sweeper", name: "SG-97 Sweeper", category: "Shotgun", ccScore: 1, eliteScore: 1, source: "superstore", image: "https://helldivers.wiki.gg/images/SG-97_Shotgun_Primary_Render.png" },

    // =====================================================================
    // ENERGY WEAPONS
    // =====================================================================

    { id: "las5-scythe", name: "LAS-5 Scythe", category: "Energy", source: "helldivers-mobilize", ccScore: 1, image: "https://helldivers.wiki.gg/images/LAS-5_Scythe_Primary_Render.png" },
    { id: "las16-sickle", name: "LAS-16 Sickle", category: "Energy", ccScore: 1, source: "cutting-edge", image: "https://helldivers.wiki.gg/images/LAS-16_Sickle_Primary_Render.png" },
    { id: "las17-double-edge-sickle", name: "LAS-17 Double-Edge Sickle", category: "Energy", source: "servants-of-freedom", ccScore: 1, eliteScore: 1, image: "https://helldivers.wiki.gg/images/LAS-17_Double-Edge_Sickle_Primary_Render.png" },
    { id: "las13-trident", name: "LAS-13 Trident", category: "Energy", source: "siege-breakers", ccScore: 2, eliteScore: 1, image: "https://helldivers.wiki.gg/images/LAS-13_Trident_Primary_Render.png" },
    { id: "plas1-scorcher", name: "PLAS-1 Scorcher", category: "Energy", source: "helldivers-mobilize", atScore: 1, ccScore: 1, eliteScore: 2, image: "https://helldivers.wiki.gg/images/PLAS-1_Scorcher_Primary_Render.png" },
    { id: "plas39-accelerator-rifle", name: "PLAS-39 Accelerator Rifle", category: "Energy", source: "killzone", ccScore: 1, eliteScore: 2, image: "https://helldivers.wiki.gg/images/PLAS-39_Accelerator_Rifle_Primary_Render.png" },
    { id: "plas101-purifier", name: "PLAS-101 Purifier", category: "Energy", source: "polar-patriots", ccScore: 1, eliteScore: 2, image: "https://helldivers.wiki.gg/images/PLAS-101_Purifier_Primary_Render.png" },

    // =====================================================================
    // EXPLOSIVE WEAPONS
    // =====================================================================

    { id: "r36-eruptor", name: "R-36 Eruptor", category: "Explosive", source: "democratic-detonation", atScore: 1, ccScore: 1, eliteScore: 2, closesObjectives: true, image: "https://helldivers.wiki.gg/images/R-36_Eruptor_Primary_Render.png" },
    { id: "cb9-exploding-crossbow", name: "CB-9 Exploding Crossbow", category: "Explosive", source: "democratic-detonation", ccScore: 2, eliteScore: 2, closesObjectives: true, image: "https://helldivers.wiki.gg/images/CB-9_Exploding_Crossbow_Primary_Render.png" },

    // =====================================================================
    // ARC WEAPONS
    // =====================================================================

    { id: "arc12-blitzer", name: "ARC-12 Blitzer", category: "Arc", source: "cutting-edge", ccScore: 2, eliteScore: 1, image: "https://helldivers.wiki.gg/images/ARC-12_Blitzer_Primary_Render.png" },

    // =====================================================================
    // SPECIAL WEAPONS
    // =====================================================================

    { id: "jar5-dominator", name: "JAR-5 Dominator", category: "Special", ccScore: 1, eliteScore: 2, source: "steeled-veterans", image: "https://helldivers.wiki.gg/images/JAR-5_Dominator_Primary_Render.png" },
    { id: "vg70-variable", name: "VG-70 Variable", category: "Special", source: "control-group", ccScore: 1, eliteScore: 1, image: "https://helldivers.wiki.gg/images/VG-70_Variable_Primary_Render.png" },
    { id: "flam66-torcher", name: "FLAM-66 Torcher", category: "Special", source: "freedoms-flame", ccScore: 2, image: "https://helldivers.wiki.gg/images/FLAM-66_Torcher_Primary_Render.png" },
];
