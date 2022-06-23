const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const zeroPad = (num, places) => String(num).padStart(places, "0")

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

Date.prototype.addSeconds = function(seconds) {
  var date = new Date(this.valueOf());
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}

function dateToSeed(dayIndex,hour,minute) {
  v = (
    1440 * dayIndex
     + 960 * Math.floor(hour / 10)
     + 60 * (hour % 10)
     + 16 * Math.floor(minute / 10)
     + (minute % 10)
     + 0x5A0
  ) & 0xFFFFFFFF;
  v = (v >> 16) ^ (v & 0xFFFF);
  return v;
}

function dateFormat(d) {
  return (
    days[d.getDay()].substring(0,3)
    + " "
    + months[d.getMonth()].substring(0,3)
    + " "
    + d.getDate()
    + " "
    + zeroPad(d.getHours(),2)
    + ":"
    + zeroPad(d.getMinutes(),2)
    + ":00 2000"
  );
}

function daysInMonth (month, year) {
  return new Date(year, month + 1, 0).getDate();
}

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
    right = (BigInt(mult) * BigInt(i) + BigInt(add)) & 0xFFFFFFFFn;
    val = Number(right >> 16n);
    flags[val] = true;
    low[val] = i;
    val -= 1;
    flags[val] = true;
    low[val] = i;
  }
  first = (BigInt(pid) << 16n) & 0xFFFFFFFFn;
  second = BigInt(pid) & 0xFFFF0000n;
  search = (second - (first * BigInt(mult))) & 0xFFFFFFFFn;
  origin = [];
  for (i = 0; i < 256; i++, search = (search - BigInt(k) & 0xFFFFFFFFn)) {
    if (flags[Number(search >> BigInt(16))]) {
      test = first | BigInt(i << 8) | BigInt(low[Number(search >> 16n)]);
      if (((test * BigInt(mult) + BigInt(add)) & 0xFFFF0000n) == second) {
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
    right = (BigInt(mult) * BigInt(i) + BigInt(add)) & 0xFFFFFFFFn;
    val = Number(right >> 16n);
    flags[val] = true;
    low[val] = i;
    val -= 1;
    flags[val] = true;
    low[val] = i;
  }
  first = BigInt((hp | (atk << 5) | (def << 10)) << 16)
  second = BigInt((spe | (spa << 5) | (spd << 10)) << 16)
  search1 = (second - (first * BigInt(mult))) & 0xFFFFFFFFn;
  search2 = (second - ((first ^ 0x80000000n) * BigInt(mult))) & 0xFFFFFFFFn;
  origin = [];
  for (i = 0;
    i < 256;
    i++,
    search1 = (search1 - BigInt(k) & 0xFFFFFFFFn),
    search2 = (search2 - BigInt(k) & 0xFFFFFFFFn)) {
    if (flags[Number(search1 >> 16n)]) {
      test = first | BigInt(i << 8) | BigInt(low[Number(search1 >> 16n)]);
      if (((test * BigInt(mult) + BigInt(add)) & 0x7FFF0000n) == second) {
        origin.push(Number(test))
      }
    }
    if (flags[Number(search2 >> 16n)]) {
      test = first | BigInt(i << 8) | BigInt(low[Number(search2 >> 16n)]);
      if (((test * BigInt(mult) + BigInt(add)) & 0x7FFF0000n) == second) {
        origin.push(Number(test))
      }
    }
  }
  return origin;
}