import red from "../config/redis.js";
import logger from "../utils/logger.js";

const DEFAULT_TTL = parseInt(process.env.TTL || "5", 10); //s not in minute

const cache = {
  async get(key) {
    try {
      const value = await red.get(key);
      if (value) {
        logger.debug(`Cache HIT: ${key}`);
        return JSON.parse(value);
      }
      logger.debug(`Cache MISS: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Cache GET error for ${key}:`, error);
      return null;
    }
  },

  async set(key, value, ttl = DEFAULT_TTL) {
    try {
      await red.setex(key, Math.floor(ttl), JSON.stringify(value));
      logger.debug(`Cache SET: ${key} (TTL: ${ttl}s)`);
      return true;
    } catch (error) {
      logger.error(`Cache SET error for  ${key}:`, error);
      return false;
    }
  },

  async del(key) {
    try {
      await red.del(key);
      logger.debug(`Cache DEL: ${key}`);
      return true;
    } catch (error) {
      logger.error(`Cache DEL error for ${key}:`, error);
      return false;
    }
  },

  async delPattern(pattern) {
    try {
      const keys = await red.keys(pattern);
      if (keys.length > 0) {
        await red.del(...keys);
        logger.debug(`Cache DEL PATTERN: ${pattern} (${keys.length} keys)`);
      }
      return keys.length;
    } catch (error) {
      logger.error(`Cache DEL PATTERN error for ${pattern}:`, error);
      return 0;
    }
  },

  async getOrSet(key, fetchFn, ttl = DEFAULT_TTL) {
    const cached = await this.get(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fetchFn();
    if (value !== null && value !== undefined) {
      await this.set(key, value, ttl);
    }
    return value;
  },

  async invalidateByTags(tags) {
    for (const tag of tags) {
      await this.delPattern(`${tag}:*`);
    }
  },

  key(...segments) {
    return segments.join(":");
  },
};

export default cache;
