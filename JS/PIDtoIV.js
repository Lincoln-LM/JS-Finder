function generate(pid) {
    let states = [];
    let methods = [1,2,4]
    for (let i=0;i<methods.length;i++) {
      let seeds = recoverLower16BitsPID(pid);
      for (let j=0;j<seeds.length;j++) {
        let temp = new PokeRNGR(seeds[j])
        let seed = temp.nextUInt();
        let go = new PokeRNG(seed);
        let state = [];
        
        go.nextUShort();
        go.nextUShort();
        if (methods[i] == 2) {
            go.nextUShort();
        }
        let iv1 = go.nextUShort();
        if (methods[i] == 4) {
            go.nextUShort();
        }
        let iv2 = go.nextUShort();
        let ivs = getIVs(iv1,iv2);
        state.push(seed.toString(16).toUpperCase())
        state.push(methods[i])
        state.push(ivs.toString())
        states.push(state)
      }
    }
    return states;
  }
  