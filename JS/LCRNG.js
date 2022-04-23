class PokeRNG {
  constructor(seed) {
    this.seed = BigInt(seed);
    this.mult = BigInt(0x41C64E6D);
    this.add = BigInt(0x6073);
  }
  
  nextUInt() {
    this.seed = (this.seed * this.mult + this.add) & BigInt(0xFFFFFFFF);
    return Number(this.seed);
  }
  
  nextUShort() {
    return this.nextUInt() >>> 16;
  }
  
  next(advances=1) {
    for (let i=0; i<advances; i++) {
      this.nextUInt();
    }
    return this.seed;
  }
}

class PokeRNGR {
  constructor(seed) {
    this.seed = BigInt(seed);
    this.mult = BigInt(0xEEB9EB65);
    this.add = BigInt(0xA3561A1);
  }
  
  nextUInt() {
    this.seed = (this.seed * this.mult + this.add) & BigInt(0xFFFFFFFF);
    return Number(this.seed);
  }
  
  nextUShort() {
    return this.nextUInt() >>> 16;
  }
  
  next(advances=1) {
    for (let i=0; i<advances; i++) {
      this.nextUInt();
    }
    return this.seed;
  }
}

class BattleTowerRNG {
  constructor(seed) {
    this.seed = BigInt(seed);
    this.mult = BigInt(0x2E90EDD);
    this.add = BigInt(0x1);
  }
  
  nextUInt() {
    this.seed = (this.seed * this.mult + this.add) & BigInt(0xFFFFFFFF);
    return Number(this.seed);
  }
  
  nextUShort() {
    return Math.floor(this.nextUInt() / 65535);
  }

  rand(max) {
    return this.nextUShort() % max;
  }

  randrange(min,max) {
    return (this.nextUShort() % (max-min+1)) + min;
  }
  
  next(advances=1) {
    for (let i=0; i<advances; i++) {
      this.nextUInt();
    }
    return this.seed;
  }
}