// ---------- CONFIG ----------

const SAVE_KEY = "fracturedEngineSave_v5";
const INTRO_KEY = "fracturedEngineIntroSeen";

const generators = [
  {
    id: "g1",
    name: "Ember Conduits",
    shortLabel: "Conduit",
    icon: "◆",
    baseRate: 1.0,
    baseCost: 8,
    costGrowth: 1.13,
    unlockAtSparks: 0,
    flavor: "Thin channels that keep loose Sparks from leaking at bends."
  },
  {
    id: "g2",
    name: "Pulse Relays",
    shortLabel: "Relay",
    icon: "▶",
    baseRate: 6,
    baseCost: 60,
    costGrowth: 1.14,
    unlockAtSparks: 40,
    flavor: "Rhythmic arrays that turn static flows into steady pulses."
  },
  {
    id: "g3",
    name: "Flux Weavers",
    shortLabel: "Weaver",
    icon: "✺",
    baseRate: 30,
    baseCost: 320,
    costGrowth: 1.16,
    unlockAtSparks: 180,
    flavor: "Weave multiple streams of Sparks into a coherent current."
  },
  {
    id: "g4",
    name: "Core Looms",
    shortLabel: "Loom",
    icon: "▣",
    baseRate: 120,
    baseCost: 1400,
    costGrowth: 1.18,
    unlockAtSparks: 800,
    flavor: "Massive frames that spin Sparks into dense, reusable patterns."
  },
  {
    id: "g5",
    name: "Singularity Seeds",
    shortLabel: "Seed",
    icon: "◎",
    baseRate: 500,
    baseCost: 4800,
    costGrowth: 1.2,
    unlockAtSparks: 2600,
    flavor: "Proto cores that bend local rules, feeding on their own output."
  }
];

// Spark upgrades (reset on stabilize unless persistence unlocked)
// Types used:
// - mult_gen_rate (per generator)
// - reduce_cost_growth (per generator)
// - self_boost_per_buy (per generator)
// - global_dep_boost (global based on Sparks)
// - global_type_boost (global based on types of generators owned)
// - spark_global_mult (global temporary multiplier this run)
// - spark_exp_bonus (raise gain to power 1 + value)
const sparkUpgrades = [
  // Early per-gen doubles and cost scaling
  {
    id: "u_spark_g1_double",
    name: "Reinforced Channels",
    icon: "▴",
    currency: "sparks",
    cost: 60,
    flavor: "Add extra plating where the first conduits twist and strain.",
    effectText: "Doubles production of Ember Conduits.",
    type: "mult_gen_rate",
    targetGenIndex: 0,
    value: 2
  },
  {
    id: "u_spark_g1_scale",
    name: "Smoothed Channels",
    icon: "▤",
    currency: "sparks",
    cost: 120,
    flavor: "Flow friendly layouts that keep cost pressure from spiking.",
    effectText: "Reduces Ember Conduit cost scaling.",
    type: "reduce_cost_growth",
    targetGenIndex: 0,
    value: 0.03
  },
  {
    id: "u_spark_g2_double",
    name: "Relay Overclock",
    icon: "▹",
    currency: "sparks",
    cost: 220,
    flavor: "Relays twitch faster than the eye can track.",
    effectText: "Doubles production of Pulse Relays.",
    type: "mult_gen_rate",
    targetGenIndex: 1,
    value: 2
  },
  {
    id: "u_spark_g2_scale",
    name: "Tuned Relays",
    icon: "▥",
    currency: "sparks",
    cost: 420,
    flavor: "Careful tuning keeps relay costs from climbing as sharply.",
    effectText: "Reduces Pulse Relay cost scaling.",
    type: "reduce_cost_growth",
    targetGenIndex: 1,
    value: 0.03
  },
  {
    id: "u_spark_g3_double",
    name: "Weaver Synchrony",
    icon: "✹",
    currency: "sparks",
    cost: 900,
    flavor: "Weavers align their loops so no energy slips through gaps.",
    effectText: "Doubles production of Flux Weavers.",
    type: "mult_gen_rate",
    targetGenIndex: 2,
    value: 2
  },
  {
    id: "u_spark_g3_scale",
    name: "Stable Weaves",
    icon: "☰",
    currency: "sparks",
    cost: 1600,
    flavor: "Stabilized weave patterns make each new Weaver cheaper to assemble.",
    effectText: "Reduces Flux Weaver cost scaling.",
    type: "reduce_cost_growth",
    targetGenIndex: 2,
    value: 0.03
  },
  {
    id: "u_spark_g4_double",
    name: "Loom Overhaul",
    icon: "▦",
    currency: "sparks",
    cost: 3200,
    flavor: "Looms receive heavier frames and broader feeds.",
    effectText: "Doubles production of Core Looms.",
    type: "mult_gen_rate",
    targetGenIndex: 3,
    value: 2
  },
  {
    id: "u_spark_g4_scale",
    name: "Mass Production Looms",
    icon: "▧",
    currency: "sparks",
    cost: 5200,
    flavor: "Assembly lines that build assembly lines.",
    effectText: "Reduces Core Loom cost scaling.",
    type: "reduce_cost_growth",
    targetGenIndex: 3,
    value: 0.03
  },
  {
    id: "u_spark_g5_double",
    name: "Seed Compression",
    icon: "◎",
    currency: "sparks",
    cost: 9000,
    flavor: "Pack each Seed with a denser singularity shell.",
    effectText: "Doubles production of Singularity Seeds.",
    type: "mult_gen_rate",
    targetGenIndex: 4,
    value: 2
  },
  {
    id: "u_spark_g5_scale",
    name: "Cheap Proto Cores",
    icon: "◉",
    currency: "sparks",
    cost: 14000,
    flavor: "You stop throwing away nearly finished Seeds.",
    effectText: "Reduces Singularity Seed cost scaling.",
    type: "reduce_cost_growth",
    targetGenIndex: 4,
    value: 0.03
  },

  // Self boost by own amount
  {
    id: "u_spark_g1_self",
    name: "Conduit Feedback",
    icon: "◍",
    currency: "sparks",
    cost: 1500,
    flavor: "Each Conduit leaks a little power back into its neighbors.",
    effectText: "Ember Conduits boost their own production based on how many you own.",
    type: "self_boost_per_buy",
    targetGenIndex: 0,
    value: 0.01
  },
  {
    id: "u_spark_g2_self",
    name: "Relay Loopback",
    icon: "◫",
    currency: "sparks",
    cost: 2600,
    flavor: "Relays borrow timing from nearby relays, training each other.",
    effectText: "Pulse Relays boost their own production based on how many you own.",
    type: "self_boost_per_buy",
    targetGenIndex: 1,
    value: 0.01
  },
  {
    id: "u_spark_g3_self",
    name: "Weaver Echoes",
    icon: "◭",
    currency: "sparks",
    cost: 4200,
    flavor: "Each completed weave teaches the frame to work smarter next time.",
    effectText: "Flux Weavers boost their own production based on how many you own.",
    type: "self_boost_per_buy",
    targetGenIndex: 2,
    value: 0.01
  },
  {
    id: "u_spark_g4_self",
    name: "Loom Resonance",
    icon: "◮",
    currency: "sparks",
    cost: 7800,
    flavor: "Looms resonate in sympathy, sharing the strain.",
    effectText: "Core Looms boost their own production based on how many you own.",
    type: "self_boost_per_buy",
    targetGenIndex: 3,
    value: 0.01
  },
  {
    id: "u_spark_g5_self",
    name: "Seed Feedback",
    icon: "◬",
    currency: "sparks",
    cost: 13000,
    flavor: "Each singularity Seed tugs on nearby Seeds, deepening their gravity wells.",
    effectText: "Singularity Seeds boost their own production based on how many you own.",
    type: "self_boost_per_buy",
    targetGenIndex: 4,
    value: 0.01
  },

  // Dependent and global style upgrades
  {
    id: "u_spark_echoes",
    name: "Residual Echoes",
    icon: "◌",
    currency: "sparks",
    cost: 18000,
    flavor: "Each idle Spark hums softly, adding to the background rhythm.",
    effectText: "Boosts all Spark production based on unspent Sparks.",
    type: "global_dep_boost",
    value: 4   // divisor in log10 term
  },
  {
    id: "u_spark_lattice_focus",
    name: "Lattice Focus",
    icon: "◇",
    currency: "sparks",
    cost: 26000,
    flavor: "Tightens every joint in the lattice, pushing more power through each link.",
    effectText: "Boosts all generator output based on how many generator types you own.",
    type: "global_type_boost",
    value: 0.25
  },
  {
    id: "u_spark_surge",
    name: "Spark Surge",
    icon: "✧",
    currency: "sparks",
    cost: 42000,
    flavor: "You force an unstable surge through every construct at once.",
    effectText: "Multiplies all Spark production this run by x1.5.",
    type: "spark_global_mult",
    value: 1.5
  },
  {
    id: "u_spark_overload",
    name: "Controlled Overload",
    icon: "✦",
    currency: "sparks",
    cost: 90000,
    flavor: "The engine hums on the edge of meltdown, but does not tip.",
    effectText: "Multiplies all Spark production this run by x2.",
    type: "spark_global_mult",
    value: 2
  },
  {
    id: "u_spark_exponent",
    name: "Nonlinear Flow",
    icon: "∞",
    currency: "sparks",
    cost: 250000,
    flavor: "The engine stops thinking in straight lines.",
    effectText: "Spark gain is raised to the power of 1.01. Very strong, appears later.",
    type: "spark_exp_bonus",
    value: 0.01
  }
];

// Stabilizer upgrades (permanent)
// Types:
// - global_mult
// - prestige_gain_mult
// - keep_spark_upgrades
// - autobuy_gen
// - gen_produces_lower
// - stab_produces_gen
// - prestige_uses_best
// - spark_from_stab
// - starting_sparks
const stabUpgrades = [
  {
    id: "u_stab_resonant_coils",
    name: "Resonant Coils",
    icon: "✶",
    currency: "stabilizers",
    cost: 1,
    flavor: "Tune the core frequency so that every construct vibrates in phase.",
    effectText: "Increases all Spark production by x1.5 permanently.",
    type: "global_mult",
    value: 1.5
  },
  {
    id: "u_stab_autobuy_g1",
    name: "Guided Conduits",
    icon: "◆",
    currency: "stabilizers",
    cost: 2,
    flavor: "Conduits now route themselves into place when there is spare power.",
    effectText: "Automatically buys Ember Conduits when affordable.",
    type: "autobuy_gen",
    targetGenIndex: 0
  },
  {
    id: "u_stab_deep_memory",
    name: "Deep Memory",
    icon: "⌘",
    currency: "stabilizers",
    cost: 3,
    flavor: "Etch each run deeper into the engine's memory banks.",
    effectText: "Increases Stabilizer gain from each run.",
    type: "prestige_gain_mult",
    value: 1.5
  },
  {
    id: "u_stab_autobuy_g2",
    name: "Guided Relays",
    icon: "▶",
    currency: "stabilizers",
    cost: 4,
    flavor: "Relays assemble themselves as soon as there is enough current.",
    effectText: "Automatically buys Pulse Relays when affordable.",
    type: "autobuy_gen",
    targetGenIndex: 1
  },
  {
    id: "u_stab_g2_makes_g1",
    name: "Relay Seeding",
    icon: "▹",
    currency: "stabilizers",
    cost: 5,
    flavor: "Mature relays spin off crude Conduits on the side.",
    effectText: "Pulse Relays slowly produce Ember Conduits.",
    type: "gen_produces_lower",
    sourceGenIndex: 1,
    targetGenIndex: 0,
    value: 0.02 // per Relay per second
  },
  {
    id: "u_stab_autobuy_g3",
    name: "Guided Weavers",
    icon: "✺",
    currency: "stabilizers",
    cost: 6,
    flavor: "New Weavers hook themselves into empty slots.",
    effectText: "Automatically buys Flux Weavers when affordable.",
    type: "autobuy_gen",
    targetGenIndex: 2
  },
  {
    id: "u_stab_spark_trickle",
    name: "Background Drift",
    icon: "●",
    currency: "stabilizers",
    cost: 7,
    flavor: "Stabilizers leak a harmless amount of power into the lattice.",
    effectText: "Each Stabilizer generates a small stream of Sparks.",
    type: "spark_from_stab",
    value: 0.4 // Sparks per Stabilizer per second
  },
  {
    id: "u_stab_autobuy_g4",
    name: "Guided Looms",
    icon: "▣",
    currency: "stabilizers",
    cost: 8,
    flavor: "Looms are slotted automatically when patterns demand.",
    effectText: "Automatically buys Core Looms when affordable.",
    type: "autobuy_gen",
    targetGenIndex: 3
  },
  {
    id: "u_stab_g3_makes_g2",
    name: "Weaver Splinters",
    icon: "✹",
    currency: "stabilizers",
    cost: 9,
    flavor: "Each Weave throws off a few usable relay stubs.",
    effectText: "Flux Weavers slowly produce Pulse Relays.",
    type: "gen_produces_lower",
    sourceGenIndex: 2,
    targetGenIndex: 1,
    value: 0.015
  },
  {
    id: "u_stab_persistent_lattice",
    name: "Persistent Lattice",
    icon: "▦",
    currency: "stabilizers",
    cost: 10,
    flavor: "Lock the lattice pattern so its clever tricks survive collapse.",
    effectText: "Spark upgrades are no longer reset when you stabilize.",
    type: "keep_spark_upgrades"
  },
  {
    id: "u_stab_autobuy_g5",
    name: "Guided Seeds",
    icon: "◎",
    currency: "stabilizers",
    cost: 12,
    flavor: "Seeds grow into place whenever the field feels empty.",
    effectText: "Automatically buys Singularity Seeds when affordable.",
    type: "autobuy_gen",
    targetGenIndex: 4
  },
  {
    id: "u_stab_g4_makes_g3",
    name: "Loom Shavings",
    icon: "▧",
    currency: "stabilizers",
    cost: 14,
    flavor: "Loom waste gets reworked into fresh Weaver frames.",
    effectText: "Core Looms slowly produce Flux Weavers.",
    type: "gen_produces_lower",
    sourceGenIndex: 3,
    targetGenIndex: 2,
    value: 0.012
  },
  {
    id: "u_stab_g5_makes_g4",
    name: "Seed Cascades",
    icon: "◉",
    currency: "stabilizers",
    cost: 18,
    flavor: "Dense Seeds collapse into simpler Looms as side effects.",
    effectText: "Singularity Seeds slowly produce Core Looms.",
    type: "gen_produces_lower",
    sourceGenIndex: 4,
    targetGenIndex: 3,
    value: 0.01
  },
  {
    id: "u_stab_starting_sparks",
    name: "Primed Reservoir",
    icon: "✢",
    currency: "stabilizers",
    cost: 20,
    flavor: "The engine never again starts from true zero.",
    effectText: "Each reset begins with extra Sparks in storage.",
    type: "starting_sparks",
    value: 200
  },
  {
    id: "u_stab_stab_makes_g5",
    name: "Core Seeding",
    icon: "✥",
    currency: "stabilizers",
    cost: 25,
    flavor: "Stabilizers condense into new Seeds at a glacial pace.",
    effectText: "Stabilizers very slowly produce Singularity Seeds.",
    type: "stab_produces_gen",
    targetGenIndex: 4,
    value: 0.002 // per Stabilizer per second
  },
  {
    id: "u_stab_best_based",
    name: "Peak Trace",
    icon: "✩",
    currency: "stabilizers",
    cost: 30,
    flavor: "The engine remembers your strongest moment, not how you ended.",
    effectText: "Stabilizers gained are based on best Sparks this reset instead of total.",
    type: "prestige_uses_best"
  },
  {
    id: "u_stab_core_overclock",
    name: "Core Overclock",
    icon: "✪",
    currency: "stabilizers",
    cost: 40,
    flavor: "Turn the core past reasonable levels and trust it to hold.",
    effectText: "Further increases all Spark production by x2 permanently.",
    type: "global_mult",
    value: 2
  }
];

// ---------- STATE ----------

const state = {
  sparks: 0,
  stabilizers: 0,
  sparkMultiplier: 1,        // from stabilizer global_mult upgrades
  stabilizerGainMult: 1,     // from Deep Memory
  sparkExponentBonus: 0,     // from Nonlinear Flow style upgrades
  totalSparksThisRun: 0,
  bestSparksThisReset: 0,
  genCounts: new Array(generators.length).fill(0),
  genFractional: new Array(generators.length).fill(0),
  upgrades: {
    sparks: {},
    stabilizers: {}
  },
  settings: {
    autosave: true,
    notation: "short"
  }
};

let selectedUpgrade = null;
let buyMode = "1"; // "1", "10", "max"

// ---------- UTILS ----------

function formatNumber(x) {
  const notation = state.settings?.notation || "short";
  if (notation === "scientific" && x >= 1000) {
    return x.toExponential(2);
  }
  if (x >= 1e9) return x.toExponential(2);
  if (x >= 1e6) return (x / 1e6).toFixed(2) + "M";
  if (x >= 1e3) return (x / 1e3).toFixed(2) + "K";
  return x.toFixed(2);
}

function formatSmall(x) {
  if (x >= 100) return x.toFixed(0);
  if (x >= 10) return x.toFixed(1);
  return x.toFixed(2);
}

function isUpgradePurchased(type, id) {
  return !!state.upgrades[type][id];
}

function effectiveCostGrowth(index) {
  const gen = generators[index];
  let g = gen.costGrowth;
  sparkUpgrades.forEach(upg => {
    if (!isUpgradePurchased("sparks", upg.id)) return;
    if (upg.type === "reduce_cost_growth" && upg.targetGenIndex === index) {
      g = Math.max(1.02, g - upg.value);
    }
  });
  return g;
}

function baseCostWithDiscount(index) {
  // Right now no global flat discounts, just baseCost
  return generators[index].baseCost;
}

function genCost(index) {
  const growth = effectiveCostGrowth(index);
  const base = baseCostWithDiscount(index);
  return base * Math.pow(growth, state.genCounts[index]);
}

function generatorRateMultiplier(index) {
  let mult = 1;

  // Per-gen upgrades
  sparkUpgrades.forEach(upg => {
    if (!isUpgradePurchased("sparks", upg.id)) return;

    if (upg.type === "mult_gen_rate" && upg.targetGenIndex === index) {
      mult *= upg.value;
    }

    if (upg.type === "self_boost_per_buy" && upg.targetGenIndex === index) {
      const extra = 1 + state.genCounts[index] * upg.value;
      mult *= extra;
    }

    if (upg.type === "global_dep_boost") {
      const factor = 1 + Math.log10(1 + state.sparks) / upg.value;
      mult *= factor;
    }

    if (upg.type === "global_type_boost") {
      let typesOwned = 0;
      for (let i = 0; i < generators.length; i++) {
        if (state.genCounts[i] > 0) typesOwned += 1;
      }
      const factor = 1 + typesOwned * upg.value;
      mult *= factor;
    }

    if (upg.type === "spark_global_mult") {
      mult *= upg.value;
    }
  });

  return mult;
}

function genEffectiveRate(index) {
  const base = generators[index].baseRate;
  return base * generatorRateMultiplier(index);
}

function sparksPerSecond() {
  let total = 0;
  generators.forEach((gen, index) => {
    total += state.genCounts[index] * genEffectiveRate(index);
  });
  return total * state.sparkMultiplier;
}

function useBestForPrestige() {
  return isUpgradePurchased("stabilizers", "u_stab_best_based");
}

function stabilizerRawGain() {
  const metric = useBestForPrestige()
    ? state.bestSparksThisReset
    : state.totalSparksThisRun;

  const base = Math.pow(metric, 0.55) / 25;
  return base * state.stabilizerGainMult;
}

function stabilizerGainFloored() {
  return Math.floor(stabilizerRawGain());
}

// ---------- CORE LOGIC ----------

function gainSparks(amount) {
  if (amount <= 0) return;

  let gain = amount;
  if (state.sparkExponentBonus > 0) {
    gain = Math.pow(gain, 1 + state.sparkExponentBonus);
  }

  state.sparks += gain;
  state.totalSparksThisRun += gain;

  if (state.sparks > state.bestSparksThisReset) {
    state.bestSparksThisReset = state.sparks;
  }
}

function extraSparkRateFromStabilizers() {
  let rate = 0;
  stabUpgrades.forEach(upg => {
    if (!isUpgradePurchased("stabilizers", upg.id)) return;
    if (upg.type === "spark_from_stab") {
      rate += state.stabilizers * upg.value;
    }
  });
  return rate;
}

function tick(dt) {
  const sps = sparksPerSecond();
  const baseGain = sps * dt;
  gainSparks(baseGain);

  const extraSparkRate = extraSparkRateFromStabilizers();
  if (extraSparkRate > 0) {
    gainSparks(extraSparkRate * dt);
  }

  runGeneratorProduction(dt);
  runAutobuyers();
}

function resetSparkLayer() {
  const baseStarting = 0;
  let extra = 0;

  stabUpgrades.forEach(upg => {
    if (!isUpgradePurchased("stabilizers", upg.id)) return;
    if (upg.type === "starting_sparks") {
      extra += upg.value;
    }
  });

  state.sparks = baseStarting + extra;
  state.totalSparksThisRun = 0;
  state.bestSparksThisReset = state.sparks;
  state.genCounts = new Array(generators.length).fill(0);
  state.genFractional = new Array(generators.length).fill(0);

  if (!isUpgradePurchased("stabilizers", "u_stab_persistent_lattice")) {
    state.upgrades.sparks = {};
    state.sparkExponentBonus = 0;
  }
}

function stabilize() {
  const gainInt = stabilizerGainFloored();
  if (gainInt <= 0) return;
  state.stabilizers += gainInt;
  resetSparkLayer();
  saveGame();
}

function runGeneratorProduction(dt) {
  stabUpgrades.forEach(upg => {
    if (!isUpgradePurchased("stabilizers", upg.id)) return;

    if (upg.type === "gen_produces_lower") {
      const src = upg.sourceGenIndex;
      const tgt = upg.targetGenIndex;
      const rate = upg.value;
      const add = state.genCounts[src] * rate * dt;
      state.genFractional[tgt] += add;
    }

    if (upg.type === "stab_produces_gen") {
      const tgt = upg.targetGenIndex;
      const rate = upg.value;
      const add = state.stabilizers * rate * dt;
      state.genFractional[tgt] += add;
    }
  });

  for (let i = 0; i < state.genFractional.length; i++) {
    if (state.genFractional[i] >= 1) {
      const whole = Math.floor(state.genFractional[i]);
      state.genFractional[i] -= whole;
      state.genCounts[i] += whole;
    }
  }
}

// ---------- BUY MODE AND GENERATOR BUYING ----------

function setBuyMode(mode) {
  buyMode = mode;
  const buttons = document.querySelectorAll("[data-buy-mode]");
  buttons.forEach(btn => {
    const isActive = btn.getAttribute("data-buy-mode") === mode;
    btn.style.outline = isActive ? "1px solid #9caeff" : "none";
  });
}

function setupBuyModeButtons() {
  const buttons = document.querySelectorAll("[data-buy-mode]");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-buy-mode");
      setBuyMode(mode);
    });
  });
  setBuyMode("1");
}

function maxAffordableForGenerator(index, availableSparks) {
  const r = effectiveCostGrowth(index);
  const base = baseCostWithDiscount(index);
  const count = state.genCounts[index];
  const a = base * Math.pow(r, count);

  if (availableSparks < a) return 0;

  if (r <= 1.0000001) {
    return Math.floor(availableSparks / a);
  }

  const numerator = availableSparks * (r - 1) / a + 1;
  if (numerator <= 1) return 0;
  const k = Math.floor(Math.log(numerator) / Math.log(r));
  return Math.max(0, k);
}

function buyGenerator(index, modeOverride) {
  const mode = modeOverride || buyMode;
  const available = state.sparks;

  if (mode === "1") {
    const cost = genCost(index);
    if (available >= cost) {
      state.sparks -= cost;
      state.genCounts[index] += 1;
    }
    return;
  }

  let maxK = maxAffordableForGenerator(index, available);
  if (mode === "10") {
    maxK = Math.min(maxK, 10);
  }

  if (maxK <= 0) return;

  const r = effectiveCostGrowth(index);
  const base = baseCostWithDiscount(index);
  const count = state.genCounts[index];
  const a = base * Math.pow(r, count);
  const totalCost = a * (Math.pow(r, maxK) - 1) / (r - 1);

  if (state.sparks + 1e-9 >= totalCost) {
    state.sparks -= totalCost;
    state.genCounts[index] += maxK;
  }
}

function batchCost(index, countToBuy) {
  const r = effectiveCostGrowth(index);
  const base = baseCostWithDiscount(index);
  const current = state.genCounts[index];
  const a = base * Math.pow(r, current);

  if (countToBuy <= 0) return 0;

  if (r <= 1.0000001) {
    return a * countToBuy;
  }

  return a * (Math.pow(r, countToBuy) - 1) / (r - 1);
}

function getPlannedPurchase(index) {
  const available = state.sparks;
  let maxK = maxAffordableForGenerator(index, available);

  if (buyMode === "1") {
    maxK = Math.min(maxK, 1);
  } else if (buyMode === "10") {
    maxK = Math.min(maxK, 10);
  }
  // buyMode "max" uses full maxK

  if (maxK <= 0) {
    return { qty: 0, cost: 0, canAfford: false };
  }

  const cost = batchCost(index, maxK);
  const canAfford = state.sparks + 1e-9 >= cost;

  return { qty: maxK, cost, canAfford };
}

function runAutobuyers() {
  stabUpgrades.forEach(upg => {
    if (!isUpgradePurchased("stabilizers", upg.id)) return;
    if (upg.type === "autobuy_gen") {
      buyGenerator(upg.targetGenIndex, "max");
    }
  });
}

// ---------- UI BUILD ----------

function buildGeneratorUI() {
  const list = document.getElementById("generatorsList");
  list.innerHTML = "";

  generators.forEach((gen, index) => {
    const row = document.createElement("div");
    row.className = "gen-row hidden";
    row.id = "genRow_" + gen.id;

    row.innerHTML = `
      <div class="gen-header">
        <div class="gen-left">
          <span class="gen-icon">${gen.icon}</span>
          <div>
            <div class="gen-name">${gen.name}</div>
            <div class="gen-meta small">
              Owned: <span id="genCount_${gen.id}" class="inline-stat">0</span>
              · Output: <span id="genOutput_${gen.id}" class="inline-stat">0.00</span>/s
            </div>
          </div>
        </div>
      </div>
      <div class="gen-actions">
        <button id="genBuy_${gen.id}">
          Construct ${gen.shortLabel}
          <span id="genBuyInfo_${gen.id}" class="small"></span>
        </button>
      </div>
      <div class="gen-flavor hover-flavor small">
        ${gen.flavor}
      </div>
    `;
    list.appendChild(row);
  });
}


function buildUpgradesUI() {
  const sparkGrid = document.getElementById("sparkUpgradesGrid");
  const stabGrid = document.getElementById("stabUpgradesGrid");
  sparkGrid.innerHTML = "";
  stabGrid.innerHTML = "";

  sparkUpgrades.forEach(upg => {
    const btn = document.createElement("button");
    btn.className = "upgrade-icon-btn";
    btn.id = "upgBtn_sparks_" + upg.id;
    btn.textContent = upg.icon;
    btn.dataset.type = "sparks";
    btn.dataset.id = upg.id;
    sparkGrid.appendChild(btn);
  });

  stabUpgrades.forEach(upg => {
    const btn = document.createElement("button");
    btn.className = "upgrade-icon-btn";
    btn.id = "upgBtn_stab_" + upg.id;
    btn.textContent = upg.icon;
    btn.dataset.type = "stabilizers";
    btn.dataset.id = upg.id;
    stabGrid.appendChild(btn);
  });
}

// ---------- VISIBILITY & HIGHLIGHTS ----------

function updateVisibility() {
  generators.forEach((gen, index) => {
    const row = document.getElementById("genRow_" + gen.id);
    if (!row) return;

    const unlocked = state.totalSparksThisRun >= gen.unlockAtSparks || state.genCounts[index] > 0;
    if (unlocked) {
      row.classList.remove("hidden");
    }
  });

  let activeGenTypes = 0;
  generators.forEach((_, index) => {
    if (state.genCounts[index] > 0) activeGenTypes += 1;
  });

  const panelStabilize = document.getElementById("panelStabilize");
  const canSeePrestige =
    activeGenTypes >= 2 || state.totalSparksThisRun >= 800 || state.stabilizers > 0;

  if (canSeePrestige) {
    panelStabilize.classList.remove("hidden");
  }
}

function toggleAffordable(element, canAfford) {
  if (!element) return;
  if (canAfford) {
    element.classList.add("affordable");
  } else {
    element.classList.remove("affordable");
  }
}

// ---------- UPGRADES LOGIC ----------

function getUpgradeDef(type, id) {
  if (type === "sparks") {
    return sparkUpgrades.find(u => u.id === id) || null;
  }
  if (type === "stabilizers") {
    return stabUpgrades.find(u => u.id === id) || null;
  }
  return null;
}

function canAffordUpgrade(upg) {
  if (upg.currency === "sparks") return state.sparks >= upg.cost;
  if (upg.currency === "stabilizers") return state.stabilizers >= upg.cost;
  return false;
}

function buyUpgrade(type, id) {
  if (isUpgradePurchased(type, id)) return;
  const upg = getUpgradeDef(type, id);
  if (!upg) return;
  if (!canAffordUpgrade(upg)) return;

  if (upg.currency === "sparks") state.sparks -= upg.cost;
  if (upg.currency === "stabilizers") state.stabilizers -= upg.cost;

  state.upgrades[type][id] = true;

  if (type === "stabilizers") {
    if (upg.type === "global_mult") {
      state.sparkMultiplier *= upg.value;
    }
    if (upg.type === "prestige_gain_mult") {
      state.stabilizerGainMult *= upg.value;
    }
    if (upg.type === "keep_spark_upgrades") {
      // behavior handled in reset
    }
  }

  if (type === "sparks") {
    if (upg.type === "spark_exp_bonus") {
      state.sparkExponentBonus += upg.value;
    }
  }

  saveGame();
}

function updateUpgradeButtonsUI() {
  sparkUpgrades.forEach(upg => {
    const btn = document.getElementById("upgBtn_sparks_" + upg.id);
    if (!btn) return;

    const purchased = isUpgradePurchased("sparks", upg.id);
    const affordable = canAffordUpgrade(upg);

    btn.classList.remove("purchased", "affordable");
    if (purchased) {
      btn.classList.add("purchased");
      btn.disabled = true;
    } else {
      btn.disabled = false;
      if (affordable) {
        btn.classList.add("affordable");
      }
    }
  });

  stabUpgrades.forEach(upg => {
    const btn = document.getElementById("upgBtn_stab_" + upg.id);
    if (!btn) return;

    const purchased = isUpgradePurchased("stabilizers", upg.id);
    const affordable = canAffordUpgrade(upg);

    btn.classList.remove("purchased", "affordable");
    if (purchased) {
      btn.classList.add("purchased");
      btn.disabled = true;
    } else {
      btn.disabled = false;
      if (affordable) {
        btn.classList.add("affordable");
      }
    }
  });
}

function describeCurrentEffect(upg) {
  if (upg.type === "global_dep_boost") {
    const factor = 1 + Math.log10(1 + state.sparks) / upg.value;
    if (isUpgradePurchased("sparks", upg.id)) {
      return "Current effect: global Spark production x" + factor.toFixed(2) + " based on unspent Sparks.";
    }
    return "If purchased now: global Spark production would be x" + factor.toFixed(2) + " based on unspent Sparks.";
  }

  if (upg.type === "global_type_boost") {
    let typesOwned = 0;
    for (let i = 0; i < generators.length; i++) {
      if (state.genCounts[i] > 0) typesOwned += 1;
    }
    const factor = 1 + typesOwned * upg.value;
    return "Current factor from owned types: x" + factor.toFixed(2) + " with " + typesOwned + " types.";
  }

  if (upg.type === "spark_global_mult" && isUpgradePurchased("sparks", upg.id)) {
    return "Current effect: Spark production this run multiplied by " + upg.value.toFixed(2) + ".";
  }

  if (upg.type === "spark_exp_bonus" && isUpgradePurchased("sparks", upg.id)) {
    const exp = 1 + state.sparkExponentBonus;
    return "Current gain exponent: " + exp.toFixed(3) + ".";
  }

  if (upg.type === "self_boost_per_buy" && isUpgradePurchased("sparks", upg.id)) {
    const idx = upg.targetGenIndex;
    const mult = 1 + state.genCounts[idx] * upg.value;
    return "Current self boost: x" + mult.toFixed(2) + " from owned count.";
  }

  if (upg.type === "mult_gen_rate" && isUpgradePurchased("sparks", upg.id)) {
    return "Current effect: generator production x" + upg.value.toFixed(2) + ".";
  }

  if (upg.type === "reduce_cost_growth" && isUpgradePurchased("sparks", upg.id)) {
    return "Current effect: cost growth reduced for this generator.";
  }

  if (upg.type === "global_mult" && isUpgradePurchased("stabilizers", upg.id)) {
    return "Current effect: Spark production permanently multiplied by " + upg.value.toFixed(2) + ".";
  }

  if (upg.type === "prestige_gain_mult" && isUpgradePurchased("stabilizers", upg.id)) {
    return "Current effect: Stabilizer gain multiplied by " + upg.value.toFixed(2) + ".";
  }

  if (upg.type === "keep_spark_upgrades" && isUpgradePurchased("stabilizers", upg.id)) {
    return "Current effect: Spark upgrades are preserved when you stabilize.";
  }

  if (upg.type === "spark_from_stab" && isUpgradePurchased("stabilizers", upg.id)) {
    const rate = state.stabilizers * upg.value;
    return "Current effect: about " + formatNumber(rate) + " Sparks per second from Stabilizers.";
  }

  if (upg.type === "gen_produces_lower" && isUpgradePurchased("stabilizers", upg.id)) {
    return "Current effect: higher tier generators slowly create lower tier ones over time.";
  }

  if (upg.type === "stab_produces_gen" && isUpgradePurchased("stabilizers", upg.id)) {
    return "Current effect: Stabilizers very slowly create Singularity Seeds.";
  }

  if (upg.type === "prestige_uses_best" && isUpgradePurchased("stabilizers", upg.id)) {
    return "Current effect: prestige uses best Sparks reached this reset instead of total flow.";
  }

  if (upg.type === "starting_sparks" && isUpgradePurchased("stabilizers", upg.id)) {
    return "Current effect: each reset begins with extra Sparks in storage.";
  }

  return "";
}

function updateUpgradeDetails() {
  const titleEl = document.getElementById("upgradeDetailsTitle");
  const flavorEl = document.getElementById("upgradeDetailsFlavor");
  const effectEl = document.getElementById("upgradeDetailsEffect");
  const costEl = document.getElementById("upgradeDetailsCost");
  const currentEl = document.getElementById("upgradeDetailsCurrent");

  if (!selectedUpgrade) {
    titleEl.textContent = "Hover or tap an upgrade icon.";
    flavorEl.textContent = "";
    effectEl.textContent = "";
    costEl.textContent = "";
    currentEl.textContent = "";
    return;
  }

  const { type, def } = selectedUpgrade;
  const purchased = isUpgradePurchased(type, def.id);
  const affordable = canAffordUpgrade(def);

  titleEl.textContent = def.name + (purchased ? " (purchased)" : "");
  flavorEl.textContent = def.flavor;
  effectEl.textContent = "Effect: " + def.effectText;

  const costText =
    def.currency === "sparks"
      ? formatNumber(def.cost) + " Sparks"
      : formatNumber(def.cost) + " Stabilizers";

  costEl.textContent = "Cost: " + costText + (affordable && !purchased ? " - affordable now." : "");
  currentEl.textContent = describeCurrentEffect(def);
}

// ---------- UI UPDATE ----------

function updateUI() {
  document.getElementById("sparksDisplay").textContent = formatNumber(state.sparks);
  document.getElementById("stabilizersDisplay").textContent = formatNumber(state.stabilizers);
  document.getElementById("spsDisplay").textContent = formatNumber(sparksPerSecond());

  generators.forEach((gen, index) => {
    const countSpan = document.getElementById("genCount_" + gen.id);
    const outputSpan = document.getElementById("genOutput_" + gen.id);
    const buyInfoSpan = document.getElementById("genBuyInfo_" + gen.id);
    const button = document.getElementById("genBuy_" + gen.id);
    if (!countSpan || !button) return;
  
    // Owned
    countSpan.textContent = state.genCounts[index].toString();
  
    // Total output per second for this generator type
    if (outputSpan) {
      const totalOutput = state.genCounts[index] * genEffectiveRate(index) * state.sparkMultiplier;
      outputSpan.textContent = formatNumber(totalOutput);
    }
  
    // Batch size and cost based on current buy mode
    if (buyInfoSpan) {
      const plan = getPlannedPurchase(index);
  
      if (plan.qty > 0) {
        buyInfoSpan.textContent =
          " | +" + plan.qty + " (Cost: " + formatNumber(plan.cost) + " Sparks)";
      } else {
        buyInfoSpan.textContent = " | Cannot afford";
      }
  
      toggleAffordable(button, plan.canAfford);
    }
  });


  const raw = stabilizerRawGain();
  const floored = stabilizerGainFloored();
  document.getElementById("stabilizeProgress").textContent = formatSmall(raw);
  document.getElementById("stabilizePreview").textContent = floored.toString();
  document.getElementById("runTotalSparks").textContent = formatNumber(state.totalSparksThisRun);

  const stabilizeBtn = document.getElementById("stabilizeBtn");
  const canStabilizeNow = floored > 0;
  toggleAffordable(stabilizeBtn, canStabilizeNow);
  stabilizeBtn.disabled = !canStabilizeNow;

  updateUpgradeButtonsUI();
  updateUpgradeDetails();
  updateSettingsUIFromState();

  updateVisibility();
}

// ---------- SAVE / LOAD ----------

function saveGame() {
  const saveData = JSON.stringify(state);
  localStorage.setItem(SAVE_KEY, saveData);
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;
  try {
    const data = JSON.parse(raw);

    state.sparks = data.sparks ?? 0;
    state.stabilizers = data.stabilizers ?? 0;
    state.sparkMultiplier = data.sparkMultiplier ?? 1;
    state.stabilizerGainMult = data.stabilizerGainMult ?? 1;
    state.sparkExponentBonus = data.sparkExponentBonus ?? 0;
    state.totalSparksThisRun = data.totalSparksThisRun ?? 0;
    state.bestSparksThisReset = data.bestSparksThisReset ?? 0;

    if (Array.isArray(data.genCounts)) {
      state.genCounts = data.genCounts.slice(0, generators.length);
      while (state.genCounts.length < generators.length) state.genCounts.push(0);
    } else {
      state.genCounts = new Array(generators.length).fill(0);
    }

    if (Array.isArray(data.genFractional)) {
      state.genFractional = data.genFractional.slice(0, generators.length);
      while (state.genFractional.length < generators.length) state.genFractional.push(0);
    } else {
      state.genFractional = new Array(generators.length).fill(0);
    }

    state.upgrades = data.upgrades || { sparks: {}, stabilizers: {} };
    if (!state.upgrades.sparks) state.upgrades.sparks = {};
    if (!state.upgrades.stabilizers) state.upgrades.stabilizers = {};

    state.settings = data.settings || state.settings;
    if (state.settings.autosave === undefined) state.settings.autosave = true;
    if (!state.settings.notation) state.settings.notation = "short";

    return true;
  } catch (e) {
    console.error("Save load failed", e);
    return false;
  }
}

// ---------- SETTINGS UI ----------

function updateSettingsUIFromState() {
  const autosaveCheckbox = document.getElementById("setting_autosave");
  const notationSelect = document.getElementById("notationSelect");
  if (autosaveCheckbox) autosaveCheckbox.checked = !!state.settings.autosave;
  if (notationSelect) notationSelect.value = state.settings.notation || "short";
}

function setupSettingsControls() {
  const autosaveCheckbox = document.getElementById("setting_autosave");
  const notationSelect = document.getElementById("notationSelect");
  const btnSaveNow = document.getElementById("btnSaveNow");
  const btnShowIntro = document.getElementById("btnShowIntro");
  const btnFullReset = document.getElementById("btnFullReset");

  autosaveCheckbox.addEventListener("change", () => {
    state.settings.autosave = autosaveCheckbox.checked;
    saveGame();
  });

  notationSelect.addEventListener("change", () => {
    state.settings.notation = notationSelect.value;
    saveGame();
    updateUI();
  });

  btnSaveNow.addEventListener("click", () => {
    saveGame();
    alert("Progress saved to this browser.");
  });

  btnShowIntro.addEventListener("click", () => {
    localStorage.removeItem(INTRO_KEY);
    alert("Intro will show again on next load.");
  });

  btnFullReset.addEventListener("click", () => {
    const sure = confirm(
      "This will erase all progress, upgrades, and settings for Fractured Engine in this browser. Continue?"
    );
    if (!sure) return;
    fullResetProgress();
  });
}

function fullResetProgress() {
  localStorage.removeItem(SAVE_KEY);
  localStorage.removeItem(INTRO_KEY);
  location.reload();
}

// ---------- BUTTONS, NAV, INTRO ----------

function setupGeneratorButtons() {
  generators.forEach((gen, index) => {
    const btn = document.getElementById("genBuy_" + gen.id);
    if (!btn) return;
    btn.onclick = () => {
      buyGenerator(index);
      updateUI();
      saveGame();
    };
  });
}

function setupUpgradeButtons() {
  const allBtns = document.querySelectorAll(".upgrade-icon-btn");
  allBtns.forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      const type = btn.dataset.type === "sparks" ? "sparks" : "stabilizers";
      const id = btn.dataset.id;
      const def = getUpgradeDef(type, id);
      if (!def) return;
      selectedUpgrade = { type, def };
      updateUpgradeDetails();
    });

    btn.addEventListener("click", () => {
      const type = btn.dataset.type === "sparks" ? "sparks" : "stabilizers";
      const id = btn.dataset.id;
      const def = getUpgradeDef(type, id);
      if (!def) return;

      selectedUpgrade = { type, def };
      buyUpgrade(type, id);
      updateUI();
    });
  });
}

function setupNav() {
  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach(btn => {
    btn.onclick = () => {
      const tab = btn.dataset.tab;
      showTab(tab);
    };
  });
}

function showTab(tab) {
  const sparksTab = document.getElementById("tabSparks");
  const upgradesTab = document.getElementById("tabUpgrades");
  const settingsTab = document.getElementById("tabSettings");

  if (tab === "sparks") {
    sparksTab.classList.remove("hidden");
    upgradesTab.classList.add("hidden");
    settingsTab.classList.add("hidden");
  } else if (tab === "upgrades") {
    sparksTab.classList.add("hidden");
    upgradesTab.classList.remove("hidden");
    settingsTab.classList.add("hidden");
  } else {
    sparksTab.classList.add("hidden");
    upgradesTab.classList.add("hidden");
    settingsTab.classList.remove("hidden");
  }

  const navButtons = document.querySelectorAll(".nav-btn");
  navButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === tab);
  });
}

function setupIntroOverlay() {
  const seen = localStorage.getItem(INTRO_KEY);
  const overlay = document.getElementById("introOverlay");
  if (!seen) {
    overlay.classList.remove("hidden");
  } else {
    overlay.classList.add("hidden");
  }
  const introBtn = document.getElementById("introConfirmBtn");
  introBtn.onclick = () => {
    overlay.classList.add("hidden");
    localStorage.setItem(INTRO_KEY, "1");
  };
}

// ---------- MAIN LOOP ----------

let lastTime = performance.now();

function gameLoop(now) {
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  tick(dt);
  updateUI();

  if (state.settings.autosave && now % 1000 < 50) {
    saveGame();
  }

  requestAnimationFrame(gameLoop);
}

// ---------- INIT ----------

buildGeneratorUI();
buildUpgradesUI();
const hadSave = loadGame();
if (!hadSave) {
  state.sparks = 25;
  state.totalSparksThisRun = 0;
  state.bestSparksThisReset = state.sparks;
  state.upgrades = { sparks: {}, stabilizers: {} };
  state.settings = { autosave: true, notation: "short" };
}

setupGeneratorButtons();
setupUpgradeButtons();
setupIntroOverlay();
setupNav();
setupSettingsControls();

// NEW: hook up Stabilize Flow button
const stabilizeBtnEl = document.getElementById("stabilizeBtn");
if (stabilizeBtnEl) {
  stabilizeBtnEl.onclick = () => {
    stabilize();
    updateUI();
  };
}

setupBuyModeButtons();
updateSettingsUIFromState();
updateUI();
requestAnimationFrame(gameLoop);
