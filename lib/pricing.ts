export type PriceCalc = {
  base: number;                           // nightly base price
  checkIn?: Date;                          // optional check-in date
  now?: Date;                              // for testing
};

export function computeDiscounts({ base, checkIn, now }: PriceCalc) {
  const today = now ?? new Date();
  const ci = checkIn ?? today;

  // Always-on direct booking discount
  const directPct = 10; // %
  let extraPct = 0;

  const msPerDay = 24*60*60*1000;
  const daysAhead = Math.floor((ci.getTime() - today.getTime())/msPerDay);

  const dow = ci.getDay(); // 0=Sun ... 6=Sat
  const isSunThu = dow >= 0 && dow <= 4; // Sun..Thu
  const isWithin3Days = daysAhead >= 0 && daysAhead <= 3;

  if (isSunThu && isWithin3Days) {
    extraPct = 15;
  }

  const totalPct = directPct + extraPct;
  const final = round2(base * (1 - totalPct/100));
  const savings = round2(base - final);

  return { base, directPct, extraPct, totalPct, final, savings, isSunThu, isWithin3Days };
}

function round2(n:number){ return Math.round(n*100)/100; }