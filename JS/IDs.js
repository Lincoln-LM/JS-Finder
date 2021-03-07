function generate(initial,initialAdvances,maxAdvances,delay,targetTid,targetSid,targetPid,tidcheck,sidcheck,pidcheck) {
    let rng = new PokeRNG(initial);
    let states = [];
    let psv = Math.floor(((targetPid>>>16)^(targetPid&0xFFFF))/8)
    
    rng.next(initialAdvances+delay);
    for (let i=0;i<maxAdvances;i++) {
      let seed = rng.seed;
      let go = new PokeRNG(seed);
      let state = [];
      
      let sid = go.nextUShort();
      let tid = go.nextUShort();
      let tsv = Math.floor((tid^sid)/8);
      
      let flag = true;
      
      if (tidcheck && tid != targetTid) {
        flag = false;
      }
      if (sidcheck && sid != targetSid) {
        flag = false;
      }
      if (pidcheck && tsv != psv) {
        flag = false;
      }

      if (flag) {
        state.push(i+initialAdvances);
        state.push(tid);
        state.push(sid);
        states.push(state)
      }
      
      rng.nextUInt();
    }
    return states;
  }
  