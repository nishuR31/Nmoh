import handler from "../../sharedService/utils/handler.js";
import repoRepository from "../repo/repoRepository.js";

const repoService = {
  add: handler(async (data) => {
    return repoRepository.add(data);
  }),

  edit: handler(async ({ id, ...updates }) => {
    updates.updatedAt = new Date();
    return repoRepository.edit(id, updates);
  }),

  fetch: handler(async (filters) => {
    return repoRepository.fetch(filters);
  }),

  fetchOne: handler(async ({ id }) => {
    return repoRepository.fetchOne(id);
  }),

  delete: handler(async ({ id }) => {
    return repoRepository.delete(id);
  }),

  deleteAll: handler(async () => repoRepository.deleteAll()),

  ping: handler(async () => {
    return repoRepository.ping();
  }),
};

export default repoService;
