export type RoomPricingInput = { weeklyAirbnb: number; now?: Date; checkIn?: Date };
export const DIRECT_DISCOUNT = 10;
export const LATE_DISCOUNT = 15;
export const LATE_WINDOW_DAYS = 4; // Sun + 3 days → Sun..Wed inclusive

export function lastSunday(d=new Date()){
  const x=new Date(d); const day=x.getDay(); // 0=Sun
  x.setDate(x.getDate() - day); x.setHours(0,0,0,0); return x;
}
export function inLateWindow(d=new Date()){
  const sunday = lastSunday(d).getTime();
  const diffDays = Math.floor((d.getTime()-sunday)/(24*60*60*1000));
  return diffDays >= 0 && diffDays < LATE_WINDOW_DAYS; // Sun..Wed inclusive
}

export function priceFromWeekly({ weeklyAirbnb, now, checkIn }: RoomPricingInput){
  const today = now ?? new Date();
  const nightly = Math.round((weeklyAirbnb/7)*100)/100;

  const directPct = DIRECT_DISCOUNT;
  const latePct = inLateWindow(today) ? LATE_DISCOUNT : 0;
  const totalPct = directPct + latePct;

  const final = Math.max(0, Math.round(nightly*(1-totalPct/100)*100)/100);
  const savings = Math.round((nightly-final)*100)/100;

  return { nightlyAirbnb: nightly, directPct, latePct, totalPct, final, savings };
}