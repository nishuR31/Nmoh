import handler from "../../sharedService/utils/handler.js";
import menuRepository from "../repo/menuRepository.js";

let menuService = {
  add: handler(async (data) => await menuRepository.add(data)),
  edit: handler(async ({ id, ...updates }) => {
    updates.updatedAt = new Date(); // service owns timestamps
    return await menuRepository.edit(id, updates);
  }),
  fetch: handler(async () => await menuRepository.fetch()),
  fetchOne: handler(async ({ id }) => await menuRepository.fetchOne(id)),
  fetchImages: handler(async (ids) => await menuRepository.fetchImages(ids)),
  delete: handler(async ({ id }) => await menuRepository.delete(id)),
  deleteAll: handler(async () => await menuRepository.deleteAll()),
  ping: handler(async () => await menuRepository.ping()),
};

export default menuService;
