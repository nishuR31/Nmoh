import menuClient from "../src/prisma.js";
import cache from "../../sharedService/utils/cache.js";
import redisKeyGen from "../../sharedService/utils/redisKeyGen.js";

if (!menuClient) {
  console.error("ERROR: menuClient is undefined! Prisma client failed to initialize");
  throw new Error("Prisma Client initialization failed for Menu Service");
}

// Verify menuClient has menu model
if (!menuClient.menu) {
  console.error("ERROR: menuClient.menu is undefined!");
  console.error("Available models:", Object.keys(menuClient));
  throw new Error("Menu model not found in Prisma client");
}

const MENU_CACHE_KEY = redisKeyGen("scafe", "menu", "", "fetch");

const menuRepository = {
  // CREATE
  add: async (data) => {
    const result = await menuClient.menu.create({ data });
    await cache.del(MENU_CACHE_KEY);
    return result;
  },

  // UPDATE
  edit: async (id, updates) => {
    const result = await menuClient.menu.update({
      where: { id },
      data: updates,
    });
    await cache.del(MENU_CACHE_KEY);
    return result;
  },

  // FIND ALL (with getOrSet cache)
  fetch: async (filters = {}) => {
    return await cache.getOrSet(
      MENU_CACHE_KEY,
      async () => {
        return menuClient.menu.findMany({
          where: filters,
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            discount: true,
            url: true,
            deleteUrl: true,
            likes: true,
            visible: true,
            availability: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: "desc" },
        });
      },
      5,
    );
  },

  // FIND ONE (with getOrSet cache) - Full details including images
  fetchOne: async (id) => {
    const key = redisKeyGen("scafe", "menu", id, "fetchOne");
    return await cache.getOrSet(
      key,
      async () => {
        return menuClient.menu.findUnique({
          where: { id },
          // Include all fields for single item detail view
        });
      },
      5,
    );
  },

  // DELETE
  delete: async (id) => {
    const result = await menuClient.menu.delete({
      where: { id },
    });
    await cache.del(MENU_CACHE_KEY);
    const key = redisKeyGen("scafe", "menu", id, "fetchOne");
    await cache.del(key);
    return result;
  },

  // DELETE ALL
  deleteAll: async () => {
    if (process.env.MODE === "production") {
      throw new Error("Bulk delete is disabled in production");
    }
    const result = await menuClient.menu.deleteMany({});
    await cache.del(MENU_CACHE_KEY);
    return { deleted: result.count };
  },

  // FETCH IMAGES (for client-side separate fetch)
  fetchImages: async (ids = []) => {
    if (!ids || ids.length === 0) return [];
    return await menuClient.menu.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        url: true,
      },
    });
  },

  // HEALTH CHECK
  ping: async () => {
    return "Pong";
  },
};

export default menuRepository;
