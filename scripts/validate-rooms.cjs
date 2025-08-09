#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load the data and schema
const dataPath = path.join(__dirname, '..', 'data', 'rooms.json');
const schemaPath = path.join(__dirname, '..', 'data', 'rooms.schema.json');

if (!fs.existsSync(dataPath)) {
  console.error('❌ data/rooms.json not found');
  process.exit(1);
}

if (!fs.existsSync(schemaPath)) {
  console.error('❌ data/rooms.schema.json not found');
  process.exit(1);
}

try {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  
  // Basic validation (without ajv dependency for simplicity)
  const errors = [];
  
  // Check required fields
  if (!data.updatedFromAirbnb) {
    errors.push('Missing updatedFromAirbnb field');
  }
  
  if (!data.rooms || !Array.isArray(data.rooms)) {
    errors.push('Missing or invalid rooms array');
  } else {
    // Validate each room
    data.rooms.forEach((room, index) => {
      const requiredFields = ['id', 'title', 'guestsMin', 'guestsMax', 'weeklyAirbnb', 'perks', 'airbnbSlug'];
      
      requiredFields.forEach(field => {
        if (!(field in room)) {
          errors.push(`Room ${index}: missing ${field}`);
        }
      });
      
      // Validate guest counts
      if (room.guestsMin && room.guestsMax) {
        if (room.guestsMin > room.guestsMax) {
          errors.push(`Room ${room.id}: guestsMin (${room.guestsMin}) > guestsMax (${room.guestsMax})`);
        }
        if (room.guestsMin < 1) {
          errors.push(`Room ${room.id}: guestsMin must be at least 1`);
        }
        if (room.guestsMax > 50) {
          errors.push(`Room ${room.id}: guestsMax seems unreasonably high (${room.guestsMax})`);
        }
      }
      
      // Validate pricing
      if (room.weeklyAirbnb !== undefined) {
        if (room.weeklyAirbnb <= 0) {
          errors.push(`Room ${room.id}: weeklyAirbnb must be positive`);
        }
        if (room.weeklyAirbnb > 100000) {
          errors.push(`Room ${room.id}: weeklyAirbnb seems unreasonably high ($${room.weeklyAirbnb})`);
        }
      }
      
      // Validate Airbnb slug
      if (room.airbnbSlug && !/^[a-z0-9-]+$/.test(room.airbnbSlug)) {
        errors.push(`Room ${room.id}: invalid airbnbSlug format`);
      }
    });
    
    // Check for duplicate IDs
    const ids = data.rooms.map(r => r.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      errors.push('Duplicate room IDs found');
    }
  }
  
  if (errors.length > 0) {
    console.error('❌ Validation failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
  
  // Additional info
  console.log('✅ data/rooms.json is valid');
  console.log(`📊 Summary:`);
  console.log(`  - Last updated: ${data.updatedFromAirbnb}`);
  console.log(`  - Total rooms: ${data.rooms.length}`);
  console.log(`  - Total capacity: ${data.rooms.reduce((sum, r) => sum + r.guestsMax, 0)} guests`);
  
  // Price summary
  const avgWeekly = data.rooms.reduce((sum, r) => sum + r.weeklyAirbnb, 0) / data.rooms.length;
  console.log(`  - Average weekly price: $${avgWeekly.toFixed(2)}`);
  console.log(`  - Average nightly price: $${(avgWeekly / 7).toFixed(2)}`);
  
  // Show each room
  console.log('\n📋 Rooms:');
  data.rooms.forEach(room => {
    const nightly = (room.weeklyAirbnb / 7).toFixed(2);
    console.log(`  - ${room.title}: ${room.guestsMin}-${room.guestsMax} guests, $${nightly}/night`);
  });
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
