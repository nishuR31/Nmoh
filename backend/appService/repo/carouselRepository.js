import userClient from "../config/prisma.js";
import handler from "../../sharedService/utils/handler.js";
import cache from "../../sharedService/utils/cache.js";
import redisKeyGen from "../../sharedService/utils/redisKeyGen.js";
const CAROUSEL_CACHE_KEY = redisKeyGen("scafe", "carousel", "", "fetch");

const carouselRepository = {
  // Fetch all carousel images (with getOrSet cache)
  getAll: handler(async () => {
    return await cache.getOrSet(
      CAROUSEL_CACHE_KEY,
      async () => {
        return await userClient.carouselImage.findMany({
          orderBy: { createdAt: "desc" },
        });
      },
      5,
    );
  }),

  // Add a new carousel image
  add: handler(async ({ url, deleteUrl, imgbbId }) => {
    const image = await userClient.carouselImage.create({
      data: { url, deleteUrl, imgbbId },
    });
    await cache.del(CAROUSEL_CACHE_KEY);
    return image;
  }),

  // Delete a carousel image by id
  delete: handler(async (id) => {
    const image = await userClient.carouselImage.findUnique({ where: { id } });
    if (!image) throw new Error("Image not found");
    await userClient.carouselImage.delete({ where: { id } });
    await cache.del(CAROUSEL_CACHE_KEY);
    return image;
  }),
};

export default carouselRepository;
