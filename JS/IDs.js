function generate(
  initial,
  initialAdvances,
  maxAdvances,
  delay,
  targetTID,
  targetSID,
  targetPID,
  tidcheck,
  sidcheck,
  pidcheck
) {
    let rng = new PokeRNG(initial);
    let states = [];
    let psv = ((targetPID >>> 16) ^ (targetPID & 0xFFFF)) >>> 3;

    rng.next(initialAdvances + delay);
    for (let cnt = 0; cnt<maxAdvances; cnt++, rng.next()) {
      let seed = rng.seed;
      let go = new PokeRNG(seed);
      let state = [];

      let sid = go.nextUShort();
      let tid = go.nextUShort();
      let tsv = Math.floor((tid^sid)/8);

      let flag = true;

      if (
        (tidcheck && tid != targetTID) ||
        (sidcheck && sid != targetSID) ||
        (pidcheck && tsv != psv)
      ) {
        flag = false;
      }

      if (flag) {
        state.push(cnt+initialAdvances);
        state.push(tid);
        state.push(sid);
        states.push(state)
      }
    }
    return states;
  }
