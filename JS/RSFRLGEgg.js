function generateLower(seed, initialAdvances, maxAdvances, compatability) {
    let states = [];

    let rng = new PokeRNG(seed);
    rng.next(initialAdvances);

    for (let cnt = 0; cnt <= maxAdvances; cnt++, rng.next())
    {
        let go = new PokeRNG(rng.seed);
        if (((go.nextUShort() * 100) / 0xFFFF) < compatability)
        {
            let pid = (go.nextUShort() % 0xFFFE) + 1;

            states.push([cnt + initialAdvances, pid]);
        }
    }

    return states;
}

function setInheritance(inh, par, ivs, parents) {
    let available = [0, 1, 2, 3, 4, 5];
    for (let i = 0; i < 3; i++) {
        let stat = available[inh[i] % (6 - i)];
        let parent = par[i] & 1;
        switch (stat)
        {
        case 0:
          ivs[0] = parents[parent][0];
          break;
        case 1:
          ivs[1] = parents[parent][1];
          break;
        case 2:
          ivs[2] = parents[parent][2];
          break;
        case 3:
          ivs[5] = parents[parent][5];
          break;
        case 4:
          ivs[3] = parents[parent][3];
          break;
        case 5:
          ivs[4] = parents[parent][4];
          break;
        }

        // Avoids repeat IV inheritance
        // In Emerald this doesn't work properly
        for (let j = stat; j < 5 - i; j++)
        {
            available[j] = available[j + 1];
        }
    }
    return ivs;
}

function generateUpper(seed, initialAdvances, maxAdvances, lower, parents) {
  let upper = [];

  let rng = new PokeRNG(seed);
  rng.next(initialAdvances);

  for (let cnt = 0; cnt <= maxAdvances; cnt++, rng.next()) {
    let state = [];
    let go = new PokeRNG(rng.seed);
    let pid = go.nextUShort();
    state.push(pid)
    go.next(1);
    let iv1 = go.nextUShort();
    go.next(0);
    let iv2 = go.nextUShort();
    let ivs = getIVs(iv1,iv2)
    go.next(1);
    let inh1 = go.nextUShort();
    let inh2 = go.nextUShort();
    let inh3 = go.nextUShort();
    let inh = [inh1,inh2,inh3];
    let par1 = go.nextUShort();
    let par2 = go.nextUShort();
    let par3 = go.nextUShort();
    let par = [par1,par2,par3];

    state.push(setInheritance(inh,par,ivs,parents));
    //console.log(state)
    upper.push(state);
  }

  let states = [];
  console.log(upper)
  for (let l = 0; l < lower.length; l++) {
    low = lower[l]
    for (let u = 0; u < upper.length; u++) {
      up = upper[u]
      let pid = ((up[0] << 16)>>>0 | low[1])>>>0;
      let ivs = up[1];
      console.log(u)
      states.push([u,low[0],pid,ivs])
    }
  }
  return states;
}

function generateBack(
  seed1,
  seed2,
  heldInitialAdvances,
  pickupInitialAdvances,
  heldMaxAdvances,
  pickupMaxAdvances,
  parents,
  compatability
) {
  low = generateLower(
    seed1,
    heldInitialAdvances,
    heldMaxAdvances,
    compatability
  );
  if (low.length > 0) {
    return generateUpper(
      seed2,
      pickupInitialAdvances,
      pickupMaxAdvances,
      low,
      parents
    )
  }
}

function generate(
  heldinitial,
  pickupinitial,
  heldInitialAdvances,
  pickupInitialAdvances,
  heldMaxAdvances,
  pickupMaxAdvances,
  delay,
  tid,
  sid,
  ivn,
  ivx,
  iva,
  ivb,
  compatability,
  targetNature,
  isShiny
) {
  let natures = [
  "Hardy", "Lonely", "Brave", "Adamant", "Naughty",
  "Bold", "Docile", "Relaxed", "Impish", "Lax",
  "Timid", "Hasty", "Serious", "Jolly", "Naive",
  "Modest", "Mild", "Quiet", "Bashful", "Rash",
  "Calm", "Gentle", "Sassy", "Careful", "Quirky"
]

  let tsv = Math.floor((tid^sid)/8);
  let rng = new PokeRNG(heldinitial);
  let rng2 = new PokeRNG(pickupinitial);
  let states = [];

  let sstates = generateBack(
    rng.seed,
    rng2.seed,
    heldInitialAdvances,
    pickupInitialAdvances,
    heldMaxAdvances,
    pickupMaxAdvances,
    [iva,ivb],
    compatability
  )

  for (let i in sstates) {
    sstate = sstates[i];
    state = [];

    let pid = sstate[2];
    let psv = Math.floor((pid&0xFFFF ^ (pid>>16)) / 8);

    let ivs = sstate[3]
    let flag = true;

    for (let j = 0; j < 6; j++) {
      if (ivs[j] < ivn[j] | ivs[j] > ivx[j]) {
        flag = false;
      }
    }
    if (targetNature != "Any" & natures[pid%25] != targetNature) {
      flag = false;
    }
    if (isShiny & (tsv != psv)) {
      flag = false;
    }

    if (flag) {
      state.push(sstate[1]);
      state.push(sstate[0]);
      state.push(pid.toString(16).toUpperCase());
      if (tsv == psv) {
        state.push("Yes");
      } else {
        state.push("No");
      }
      state.push(natures[pid%25]);
      state.push(pid&1);
      state = state.concat(ivs);
      states.push(state)
    }
  }
  return states;
}
