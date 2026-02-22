import handler from "../../sharedService/utils/handler.js";
import eventRepository from "../repo/eventRepository.js";

const eventService = {
  add: handler(async (data) => {
    return eventRepository.add(data);
  }),

  edit: handler(async ({ id, ...updates }) => {
    updates.updatedAt = new Date();
    return eventRepository.edit(id, updates);
  }),

  fetch: handler(async (filters) => {
    return eventRepository.fetch(filters);
  }),

  fetchOne: handler(async ({ id }) => {
    return eventRepository.fetchOne(id);
  }),

  delete: handler(async ({ id }) => {
    return eventRepository.delete(id);
  }),

  deleteAll: handler(async () => eventRepository.deleteAll()),

  ping: handler(async () => {
    return eventRepository.ping();
  }),
};

export default eventService;
