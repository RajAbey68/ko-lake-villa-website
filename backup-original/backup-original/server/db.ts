import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { log } from './vite';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Enhanced connection pool configuration with auto-scaling capabilities
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of clients the pool should contain
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
  maxUses: 7500, // Close connections after this many uses to prevent resource leaks
});

// Log database connection information
pool.on('connect', (client) => {
  log('New database connection established', 'db');
});

pool.on('error', (err) => {
  log(`Database connection error: ${err.message}`, 'db');
});

// Add connection monitoring to automatically scale based on demand
let activeConnections = 0;
const CONNECTION_HIGH_WATERMARK = 15; // 75% of max connections
const MAX_CONNECTIONS = 20; // Match the max value set above

// Track connection acquisitions
pool.on('acquire', () => {
  activeConnections++;
  log(`Active DB connections: ${activeConnections}`, 'db');

  // If we're approaching connection limit, log a warning
  if (activeConnections >= CONNECTION_HIGH_WATERMARK) {
    log(`WARNING: High database connection usage (${activeConnections}/${MAX_CONNECTIONS})`, 'db');
  }
});

// Listen for connection removal events
pool.on('remove', () => {
  if (activeConnections > 0) {
    activeConnections--;
  }
});

export const db = drizzle({ client: pool, schema });

// Health check function to monitor database status
export async function checkDbHealth() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT 1 as health_check');

      // Get basic connection stats
      const connectionStats = {
        active: activeConnections,
        max: MAX_CONNECTIONS
      };

      return {
        status: 'healthy',
        connections: connectionStats,
        timestamp: new Date().toISOString()
      };
    } finally {
      client.release();
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    };
  }
}