function generate(seed) {
  let states = [];
  let rng = new PokeRNGR(seed);
  let advances = 0;
  while (rng.seed != (rng.seed & 0xFFFFn)) {
    rng.nextUInt();
    advances += 1;
  }
  seed = Number(rng.seed);
  let dayIndex = 0;
  for (let month = 0; month < 12; month++) {
    for (let day = 0; day < daysInMonth(month, 2000); day++, dayIndex++) {
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute++) {
          v = dateToSeed(dayIndex, hour, minute);
          if (v == seed) {
            d = new Date(2000, month, day + 1, hour, minute, 0);
            state = [];
            state.push(rng.seed.toString(16).toUpperCase());
            state.push(dateFormat(d));
            state.push(advances);
            states.push(state);
          }
        }
      }
    }
  }
  states.push(state);
  return states;
}
