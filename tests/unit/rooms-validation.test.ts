import { getRooms } from '@/lib/rooms';
import * as fs from 'fs';
import * as path from 'path';

describe('Rooms Data Validation', () => {
  test('rooms.json exists and is valid JSON', () => {
    const filePath = path.join(process.cwd(), 'data', 'rooms.json');
    expect(fs.existsSync(filePath)).toBe(true);
    
    const content = fs.readFileSync(filePath, 'utf8');
    expect(() => JSON.parse(content)).not.toThrow();
  });

  test('all rooms have required fields', async () => {
    const rooms = await getRooms();
    
    rooms.forEach(room => {
      expect(room).toHaveProperty('id');
      expect(room).toHaveProperty('title');
      expect(room).toHaveProperty('guestsMin');
      expect(room).toHaveProperty('guestsMax');
      expect(room).toHaveProperty('weeklyAirbnb');
      expect(room).toHaveProperty('perks');
      expect(room).toHaveProperty('airbnbSlug');
    });
  });

  test('guest counts are logical (min <= max)', async () => {
    const rooms = await getRooms();
    
    rooms.forEach(room => {
      expect(room.guestsMin).toBeLessThanOrEqual(room.guestsMax);
      expect(room.guestsMin).toBeGreaterThan(0);
      expect(room.guestsMax).toBeLessThan(50); // Reasonable upper limit
    });
  });

  test('weekly prices are reasonable', async () => {
    const rooms = await getRooms();
    
    rooms.forEach(room => {
      expect(room.weeklyAirbnb).toBeGreaterThan(0);
      expect(room.weeklyAirbnb).toBeLessThan(100000); // $100k weekly is unreasonable
    });
  });

  test('Airbnb slugs are valid', async () => {
    const rooms = await getRooms();
    const slugPattern = /^[a-z0-9-]+$/;
    
    rooms.forEach(room => {
      expect(room.airbnbSlug).toMatch(slugPattern);
    });
  });

  test('no duplicate room IDs', async () => {
    const rooms = await getRooms();
    const ids = rooms.map(r => r.id);
    const uniqueIds = new Set(ids);
    
    expect(ids.length).toBe(uniqueIds.size);
  });
});
