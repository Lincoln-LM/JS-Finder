function getIVs(iv1, iv2) {
  hp = iv1 & 0x1f;
  atk = (iv1 >>> 5) & 0x1f;
  defense = (iv1 >>> 10) & 0x1f;
  spa = (iv2 >>> 5) & 0x1f;
  spd = (iv2 >>> 10) & 0x1f;
  spe = iv2 & 0x1f;
  return [hp, atk, defense, spa, spd, spe]
}
