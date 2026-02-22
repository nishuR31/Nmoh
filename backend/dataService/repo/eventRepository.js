import eventClient from "../src/prisma.js";
import cache from "../../sharedService/utils/cache.js";
import redisKeyGen from "../../sharedService/utils/redisKeyGen.js";

const EVENT_CACHE_KEY = redisKeyGen("scafe", "event", "", "fetch");

const eventRepository = {
  // CREATE
  add: async (data) => {
    const result = await eventClient.event.create({ data });
    await cache.del(EVENT_CACHE_KEY);
    return result;
  },

  // UPDATE
  edit: async (id, updates) => {
    const result = await eventClient.event.update({
      where: { id },
      data: updates,
    });
    await cache.del(EVENT_CACHE_KEY);
    return result;
  },

  // FIND ALL (with getOrSet cache)
  fetch: async (filters = {}) => {
    return await cache.getOrSet(
      EVENT_CACHE_KEY,
      async () => {
        return eventClient.event.findMany({
          where: filters,
          select: {
            id: true,
            name: true,
            description: true,
            url: true,
            deleteUrl: true,
            likes: true,
            visible: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: true,
            eventDate: true,
            eventTime: true,
            performer: true,
          },
          orderBy: { createdAt: "desc" },
        });
      },
      5,
    );
  },

  // FIND ONE (with getOrSet cache)
  fetchOne: async (id) => {
    const key = redisKeyGen("scafe", "event", id, "fetchOne");
    return await cache.getOrSet(
      key,
      async () => {
        return eventClient.event.findUnique({
          where: { id },
        });
      },
      5,
    );
  },

  // DELETE
  delete: async (id) => {
    const result = await eventClient.event.delete({
      where: { id },
    });
    await cache.del(EVENT_CACHE_KEY);
    const key = redisKeyGen("scafe", "event", id, "fetchOne");
    await cache.del(key);
    return result;
  },

  // DELETE ALL
  deleteAll: async () => {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Bulk delete is disabled in production");
    }
    const result = await eventClient.event.deleteMany({});
    await cache.del(EVENT_CACHE_KEY);
    return { deleted: result.count };
  },

  // HEALTH CHECK
  ping: async () => {
    return "Pong";
  },
};

export default eventRepository;
