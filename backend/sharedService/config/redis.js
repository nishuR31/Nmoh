import { Redis } from "ioredis";

const url = process.env.REDIS;
const evictionPolicy = process.env.REDIS_EVICTION_POLICY || "noeviction";

const red = new Redis(url, {
  lazyConnect: false,
  enableReadyCheck: true,
  maxRetriesPerRequest: null,
  showFriendlyErrorStack: false,
  enableOfflineQueue: true,
});

// Events
red.on("connect", () => console.log("Redis installed."));
red.on("ready", async () => {
  console.log("Redis ready");
  try {
    const info = await red.info("memory");
    const match = info.match(/maxmemory_policy:(\S+)/);
    const currentPolicy = match ? match[1] : "unknown";
    if (currentPolicy !== evictionPolicy) {
      console.warn(
        `IMPORTANT! Eviction policy is ${currentPolicy}. It should be "${evictionPolicy}"`,
      );
    } else {
      console.log(`Redis eviction policy verified: ${currentPolicy}`);
    }
  } catch (err) {
    console.warn("Redis eviction policy check failed:", err.message);
  }
});
red.on("reconnecting", () => console.log("Redis reconnecting..."));
red.on("close", () => console.log("Redis connection closed"));
red.on("error", (err) => console.log("Redis error:", err.message));

export default red;
