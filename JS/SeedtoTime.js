function generate(seed) {
    let states = [];
    let rng = new PokeRNGR(seed);
    let advances = 0;
    while (Number(rng.seed) != (Number(rng.seed)&0xFFFF)) {
        rng.nextUInt();
        advances += 1;
    }
    seed = Number(rng.seed);
    let dayIndex = 0;
    for (month=0;month<12;month++) {
        for (day=0;day<daysInMonth(month, 2000);day++,dayIndex++) {
            //console.log(dayIndex+1,month+1,day+1)
            for (hour=0;hour<24;hour++) {
                for (minute=0;minute<60;minute++) {
                    v = dateToSeed(dayIndex,hour,minute);
                    if (v == seed) {
                        d = new Date(2000,month,day+1,hour,minute,0);
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
  