import { createClient, RedisClientType } from 'redis';
import { env } from '../config/env';

export class RedisService {
  private client: RedisClientType;
  private isConnected: boolean = false;
  private defaultTTL: number = parseInt(env.REDIS_TTL || '3600', 10);

  constructor() {
    this.client = createClient({
      url: env.REDIS_URL
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('✅ Redis client connected');
      this.isConnected = true;
    });

    this.client.on('reconnecting', () => {
      console.log('⚠️ Redis client reconnecting...');
      this.isConnected = false;
    });

    this.client.on('ready', () => {
      console.log('✅ Redis client ready');
      this.isConnected = true;
    });
  }

  /**
   * Connect to Redis server
   */
  async connect(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        await this.client.connect();
      }
      return true;
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      return false;
    }
  }

  /**
   * Disconnect from Redis server
   */
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Check if Redis is connected
   */
  isReady(): boolean {
    return this.isConnected;
  }

  /**
   * Set a key-value pair in Redis with optional TTL
   */
  async set(key: string, value: any, ttl?: number): Promise<boolean> {
    try {
      if (!this.isConnected) await this.connect();
      
      const serializedValue = JSON.stringify(value);
      const expiry = ttl || this.defaultTTL;
      
      await this.client.set(key, serializedValue, { EX: expiry });
      return true;
    } catch (error) {
      console.error(`Error setting key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get a value from Redis by key
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.isConnected) await this.connect();
      
      const value = await this.client.get(key);
      if (!value) return null;
      
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error getting key ${key}:`, error);
      return null;
    }
  }

  /**
   * Delete a key from Redis
   */
  async delete(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) await this.connect();
      
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error(`Error deleting key ${key}:`, error);
      return false;
    }
  }

  /**
   * Check if a key exists in Redis
   */
  async exists(key: string): Promise<boolean> {
    try {
      if (!this.isConnected) await this.connect();
      
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Error checking if key ${key} exists:`, error);
      return false;
    }
  }

  /**
   * Clear all keys in Redis (use with caution)
   */
  async flushAll(): Promise<boolean> {
    try {
      if (!this.isConnected) await this.connect();
      
      await this.client.flushAll();
      return true;
    } catch (error) {
      console.error('Error flushing Redis:', error);
      return false;
    }
  }
} 