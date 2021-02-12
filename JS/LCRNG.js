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
