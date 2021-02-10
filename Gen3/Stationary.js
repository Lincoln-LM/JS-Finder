function Generate() {
  let initial = parseInt(document.getElementById("initial").value,16);
  let initial_advances = parseInt(document.getElementById("initial_advances").value);
  let max_advances = parseInt(document.getElementById("max_advances").value);
  let delay = parseInt(document.getElementById("delay").value)
  let tid = parseInt(document.getElementById("tid").value);
  let sid = parseInt(document.getElementById("sid").value);
  let tsv = Math.floor((tid^sid)/8);
  let rng = new PokeRNG(initial);
  let t = document.getElementById("states");
  let b = t.tBodies[0];
  b.innerHTML = "";
  
  let natures = [ "Hardy", "Lonely", "Brave", "Adamant", "Naughty", "Bold", "Docile", "Relaxed", "Impish", "Lax", "Timid", "Hasty", "Serious", "Jolly", "Naive", "Modest", "Mild", "Quiet", "Bashful", "Rash", "Calm", "Gentle", "Sassy", "Careful", "Quirky" ]

  rng.next(initial_advances+delay);
  for (let i=0;i<max_advances;i++) {
    let seed = rng.seed;
    let go = new PokeRNG(seed);
    let state = [];
    
    let low = go.nextUShort();
    let high = go.nextUShort();
    let pid = ((high<<16) | low) >>> 0;
    let psv = Math.floor((low ^ high) / 8);
    
    let iv1 = go.nextUShort();
    let iv2 = go.nextUShort();
    let ivs = getIVs(iv1,iv2);
    
    state.push(i+initial_advances);
    state.push(pid.toString(16));
    if (tsv == psv) {
      state.push("Yes");
    } else {
      state.push("No");
    }
    state.push(natures[pid%25]);
    state.push(pid&1);
    state = state.concat(ivs)
    
    let row = b.insertRow();
    
    for (let val of state) {
      let cell = row.insertCell();
      let text = document.createTextNode(val);
      cell.appendChild(text);
    }
    rng.nextUInt();
  }
}
