import eventClient from "../generated/prisma/index.js";
import cache from "../../sharedService/utils/cache.js";
import redisKeyGen from "../../sharedService/utils/redisKeyGen.js";

const REPO_CACHE_KEY = redisKeyGen("scafe", "repo", "", "fetch");

const repoRepository = {
  // CREATE
  add: async (data) => {
    const result = await eventClient.repo.create({ data });
    await cache.del(REPO_CACHE_KEY);
    return result;
  },

  // UPDATE
  edit: async (id, updates) => {
    const result = await eventClient.repo.update({
      where: { id },
      data: updates,
    });
    await cache.del(REPO_CACHE_KEY);
    return result;
  },

  // FIND ALL (with getOrSet cache)
  fetch: async (filters = {}) => {
    return await cache.getOrSet(
      REPO_CACHE_KEY,
      async () => {
        return eventClient.repo.findMany({
          where: filters,
          orderBy: { createdAt: "desc" },
        });
      },
      5,
    );
  },

  // FIND ONE (with getOrSet cache)
  fetchOne: async (id) => {
    const key = redisKeyGen("scafe", "repo", id, "fetchOne");
    return await cache.getOrSet(
      key,
      async () => {
        return eventClient.repo.findUnique({
          where: { id },
        });
      },
      5,
    );
  },

  // DELETE
  delete: async (id) => {
    const result = await eventClient.repo.delete({
      where: { id },
    });
    await cache.del(REPO_CACHE_KEY);
    const key = redisKeyGen("scafe", "repo", id, "fetchOne");
    await cache.del(key);
    return result;
  },

  // DELETE ALL
  deleteAll: async () => {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Bulk delete is disabled in production");
    }
    const result = await eventClient.repo.deleteMany({});
    await cache.del(REPO_CACHE_KEY);
    return { deleted: result.count };
  },

  // HEALTH CHECK
  ping: async () => {
    return "Pong";
  },
};

export default repoRepository;
