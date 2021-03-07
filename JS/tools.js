function getIVs(iv1, iv2) {
  hp = iv1 & 0x1f;
  atk = (iv1 >>> 5) & 0x1f;
  defense = (iv1 >>> 10) & 0x1f;
  spa = (iv2 >>> 5) & 0x1f;
  spd = (iv2 >>> 10) & 0x1f;
  spe = iv2 & 0x1f;
  return [hp, atk, defense, spa, spd, spe]
}

function getSlot(compare) {
  limits = [20, 40, 50, 60, 70, 80, 85, 90, 94, 98, 99, 100];
  for (i = 0; i < limits.length; i++) {
    if (compare < limits[i]) {
      return i;
    }
  }
  return 255;
}

function recoverLower16BitsPID(pid) {
  let add;
  let k;
  let mult;
  let low = [];
  let flags = [];
  k = 0xc64e6d00; // Mult << 8
  mult = 0x41c64e6d; // pokerng constant
  add = 0x6073; // pokerng constant
  
  for (i = 0; i < 0x10000; i++) {
    low.push(0);
    flags.push(false)
  }
  for (i = 0; i < 256; i++) {
    right = (BigInt(mult) * BigInt(i) + BigInt(add)) & BigInt(0xFFFFFFFF);
    val = Number(right >> BigInt(16));
    flags[val] = true;
    low[val] = i;
    val -= 1;
    flags[val] = true;
    low[val] = i;
  }
  first = (BigInt(pid) << BigInt(16)) & BigInt(0xFFFFFFFF);
  second = BigInt(pid & 0xFFFF0000);
  search = (second-(first*BigInt(mult)))&BigInt(0xFFFFFFFF);
  origin = [];
  for (i = 0; i < 256; i++, search = (search - BigInt(k)&BigInt(0xFFFFFFFF))) {
    if (flags[Number(search >> BigInt(16))]) {
      test = first | BigInt(i<<8) | BigInt(low[Number(search >> BigInt(16))]);
      if (((test * BigInt(mult) + BigInt(add)) & BigInt(0xFFFF0000)) == second) {
        origin.push(Number(test))
      }
    }
  }
  return origin;
}

function recoverLower16BitsIV(hp,atk,def,spa,spd,spe) {
  let add;
  let k;
  let mult;
  let low = [];
  let flags = [];
  k = 0xc64e6d00; // Mult << 8
  mult = 0x41c64e6d; // pokerng constant
  add = 0x6073; // pokerng constant
  
  for (i = 0; i < 0x10000; i++) {
    low.push(0);
    flags.push(false)
  }
  for (i = 0; i < 256; i++) {
    right = (BigInt(mult) * BigInt(i) + BigInt(add)) & BigInt(0xFFFFFFFF);
    val = Number(right >> BigInt(16));
    flags[val] = true;
    low[val] = i;
    val -= 1;
    flags[val] = true;
    low[val] = i;
  }
  first = BigInt((hp | (atk<<5) | (def<<10)) << 16)
  second = BigInt((spe | (spa<<5) | (spd<<10)) << 16)
  search1 = (second-(first*BigInt(mult)))&BigInt(0xFFFFFFFF);
  search2 = (second-((first^BigInt(0x80000000))*BigInt(mult)))&BigInt(0xFFFFFFFF);
  origin = [];
  for (i = 0; i < 256; i++, search1 = (search1 - BigInt(k)&BigInt(0xFFFFFFFF)), search2 = (search2 - BigInt(k)&BigInt(0xFFFFFFFF))) {
    if (flags[Number(search1 >> BigInt(16))]) {
      test = first | BigInt(i<<8) | BigInt(low[Number(search1 >> BigInt(16))]);
      if (((test * BigInt(mult) + BigInt(add)) & BigInt(0x7FFF0000)) == second) {
        origin.push(Number(test))
      }
    }
    if (flags[Number(search2 >> BigInt(16))]) {
      test = first | BigInt(i<<8) | BigInt(low[Number(search2 >> BigInt(16))]);
      if (((test * BigInt(mult) + BigInt(add)) & BigInt(0x7FFF0000)) == second) {
        origin.push(Number(test))
      }
    }
  }
  return origin;
}