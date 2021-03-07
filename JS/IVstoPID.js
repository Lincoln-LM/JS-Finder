function generate(hp,atk,def,spa,spd,spe) {
    let states = [];
    let seeds = recoverLower16BitsIV(hp,atk,def,spa,spd,spe);
    for (let j=0;j<seeds.length;j++) {
      let temp = new PokeRNGR(seeds[j])
      temp.nextUInt();
      temp.nextUInt();
      let seed = temp.nextUInt();
      let go = new PokeRNG(seed);
      let state1 = [];
      let state2 = [];
        
      let low = go.nextUShort();
      let high = go.nextUShort();
      let pid = ((high << 16)>>>0 | low)>>>0;

      state1.push(seed.toString(16).toUpperCase())
      state1.push(pid.toString(16).toUpperCase())
      state2.push(((seed^0x80000000)>>>0).toString(16).toUpperCase())
      state2.push(((pid^0x80000000)>>>0).toString(16).toUpperCase())
      states.push(state1)
      states.push(state2)
    }
    return states;
  }
  