class PokeRNG {
  constructor(seed) {
    this.seed = BigInt(seed);
    this.mult = 0x41C64E6Dn;
    this.add = 0x6073n;
  }

  nextUInt() {
    this.seed = (this.seed * this.mult + this.add) & 0xFFFFFFFFn;
    return Number(this.seed);
  }

  nextUShort() {
    return this.nextUInt() >>> 16;
  }

  next(advances = 1) {
    for (let i = 0; i < advances; i++) {
      this.nextUInt();
    }
    return this.seed;
  }
}

class PokeRNGR {
  constructor(seed) {
    this.seed = BigInt(seed);
    this.mult = 0xEEB9EB65n;
    this.add = 0xA3561A1n;
  }

  nextUInt() {
    this.seed = (this.seed * this.mult + this.add) & 0xFFFFFFFFn;
    return Number(this.seed);
  }

  nextUShort() {
    return this.nextUInt() >>> 16;
  }

  next(advances = 1) {
    for (let i = 0; i < advances; i++) {
      this.nextUInt();
    }
    return this.seed;
  }
}

class BattleTowerRNG {
  constructor(seed) {
    this.seed = BigInt(seed);
    this.mult = 0x2E90EDDn;
    this.add = 0x1n;
  }

  nextUInt() {
    this.seed = (this.seed * this.mult + this.add) & 0xFFFFFFFFn;
    return Number(this.seed);
  }

  nextUShort() {
    return Math.floor(this.nextUInt() / 65535);
  }

  rand(max) {
    return this.nextUShort() % max;
  }

  randrange(min,max) {
    return (this.nextUShort() % (max-min + 1)) + min;
  }

  next(advances = 1) {
    for (let i = 0; i < advances; i++) {
      this.nextUInt();
    }
    return this.seed;
  }
}