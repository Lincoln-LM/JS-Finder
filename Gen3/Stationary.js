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
  let ivn = [ document.getElementById("hpmin").value, document.getElementById("atkmin").value, document.getElementById("defmin").value, document.getElementById("spamin").value, document.getElementById("spdmin").value, document.getElementById("spemin").value ]
  let ivx = [ document.getElementById("hpmax").value, document.getElementById("atkmax").value, document.getElementById("defmax").value, document.getElementById("spamax").value, document.getElementById("spdmax").value, document.getElementById("spemax").value ]
    
  
  rng.next(initial_advances+delay);
  for (let i=0;i<max_advances;i++) {
    let seed = rng.seed;
    let go = new PokeRNG(seed);
    let state = [];
    
    let low = go.nextUShort();
    let high = go.nextUShort();
    let pid = ((high << 16)>>>0 | low)>>>0;
    let psv = Math.floor((low ^ high) / 8);
    
    let iv1 = go.nextUShort();
    let iv2 = go.nextUShort();
    let ivs = getIVs(iv1,iv2);
    let flag = true;
    for (let j = 0; j < 6; j++) {
      if (ivs[j] < ivn[j] | ivs[j] > ivx[j]) {
        flag = false;
      }
    }
    if (document.getElementById("nature").value != "Any" & natures[pid%25] != document.getElementById("nature").value) {
      flag = false;
    }
    if (document.getElementById("shiny").checked & !(tsv == psv)) {
      flag = false;
    }
    if (flag) {
      state.push(i+initial_advances);
      state.push(pid.toString(16));
      if (tsv == psv) {
        state.push("Yes");
      } else {
        state.push("No");
      }
      state.push(natures[pid%25]);
      state.push(pid&1);
      state = state.concat(ivs);
    
      let row = b.insertRow();
    
      for (let val of state) {
        let cell = row.insertCell();
        let text = document.createTextNode(val);
        cell.appendChild(text);
      }
    }
    rng.nextUInt();
  }
}
