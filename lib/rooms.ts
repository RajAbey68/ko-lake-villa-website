import path from 'node:path';
import { promises as fs } from 'node:fs';

export type Room = {
  id: string; title: string;
  guestsMin: number; guestsMax: number;
  weeklyAirbnb: number;
  perks: string[]; airbnbSlug: string;
};

export async function getRooms(): Promise<Room[]> {
  try{
    const p = path.join(process.cwd(),'data','rooms.json');
    const raw = await fs.readFile(p,'utf8');
    const j = JSON.parse(raw);
    return Array.isArray(j.rooms) ? j.rooms : [];
  }catch{ return []; }
}

export function guestsLabel(min:number,max:number){
  return min===max ? `${min} guests` : `${min}–${max} guests`;
}

export function airbnbUrl(slug:string){
  return `https://airbnb.co.uk/h/${slug}`;
}