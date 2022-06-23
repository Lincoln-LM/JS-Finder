function generate(pid) {
    let states = [];
    let methods = [1, 2, 4]
    let seeds = recoverLower16BitsPID(pid);
    for (method in methods) {
      for (tempSeed in seeds) {
        let temp = new PokeRNGR(seeds[tempSeed])
        let seed = temp.nextUInt();
        let go = new PokeRNG(seed);
        let state = [];

        go.nextUShort();
        go.nextUShort();
        if (methods[method] == 2) {
            go.nextUShort();
        }
        let iv1 = go.nextUShort();
        if (methods[method] == 4) {
            go.nextUShort();
        }
        let iv2 = go.nextUShort();
        let ivs = getIVs(iv1,iv2);
        state.push(seed.toString(16).toUpperCase())
        state.push(methods[method])
        state.push(ivs.toString())
        states.push(state)
      }
    }
    return states;
  }
