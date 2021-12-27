class Xorshift {
  constructor(s0,s1,s2,s3) {
    this.s0 = BigInt(s0);
    this.s1 = BigInt(s1);
    this.s2 = BigInt(s2);
    this.s3 = BigInt(s3);
  }
  
  next() {
    let t = this.s0 ^ this.s0 << 11n & 0xFFFFFFFFn;
    this.s0 = this.s1;
    this.s1 = this.s2;
    this.s2 = this.s3;
    this.s3 = t ^ t >> 8n ^ this.s3 ^ this.s3 >> 19n;

    return this.s3;
  }

  previous() {
    let t = this.s2 >> 19n ^ this.s2 ^ this.s3;
    t ^= t >> 8n;
    t ^= t << 11n & 0xFFFFFFFFn;
    t ^= t << 22n & 0xFFFFFFFFn;

    this.s0 = t;
    this.s1 = this.s0;
    this.s2 = this.s1;
    this.s3 = this.s2;

    return this.s3;
  }

  range(min,max) {
    return this.next() % (max-min) + min
  }

  rangeF(min,max) {
    min = BigInt(min);
    max = BigInt(max);
    let size = 0x7FFFFFn;
    let rand = this.next() & 0x7FFFFFn;
    let t = rand * size / 0x7FFFFFn;
    return Number(t * min + (size - t) * max)/Number(size);
  }
}