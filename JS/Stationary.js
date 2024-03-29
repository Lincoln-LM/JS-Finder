function generate(
  initial,
  initialAdvances,
  maxAdvances,
  delay,
  tid,
  sid,
  ivn,
  ivx,
  targetNature,
  isShiny
) {
  let natures = [
    "Hardy", "Lonely", "Brave", "Adamant", "Naughty",
    "Bold", "Docile", "Relaxed", "Impish", "Lax",
    "Timid", "Hasty", "Serious", "Jolly", "Naive",
    "Modest", "Mild", "Quiet", "Bashful", "Rash",
    "Calm", "Gentle", "Sassy", "Careful", "Quirky"
  ];

  let tsv = Math.floor((tid^sid)/8);
  let rng = new PokeRNG(initial);
  let states = [];

  rng.next(initialAdvances+delay);
  for (let cnt = 0; cnt < maxAdvances; cnt++) {
    let seed = rng.seed;
    let go = new PokeRNG(seed);
    let state = [];

    let low = go.nextUShort();
    let high = go.nextUShort();
    let pid = ((high << 16) >>> 0 | low) >>> 0;
    let psv = (low ^ high) >>> 3;

    let iv1 = go.nextUShort();
    let iv2 = go.nextUShort();
    let ivs = getIVs(iv1,iv2);
    let flag = true;

    for (let j = 0; j < 6; j++) {
      if (ivs[j] < ivn[j] | ivs[j] > ivx[j]) {
        flag = false;
      }
    }
    if (targetNature != "Any" & natures[pid % 25] != targetNature) {
      flag = false;
    }
    if (isShiny & !(tsv == psv)) {
      flag = false;
    }

    if (flag) {
      state.push(cnt + initialAdvances);
      state.push(pid.toString(16).toUpperCase());
      if (tsv == psv) {
        state.push("Yes");
      } else {
        state.push("No");
      }
      state.push(natures[pid % 25]);
      state.push(pid & 1);
      state = state.concat(ivs);
      states.push(state)
    }

    rng.nextUInt();
  }
  return states;
}
