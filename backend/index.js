import "./sharedService/config/env.js";
import menuService from "./menuService/index.js";
import appService from "./appService/index.js";
import eventService from "./eventService/index.js";
import red from "./sharedService/config/redis.js";
import offerService from "./offerService/index.js";
import gateway from "./gateway/index.js";

async function start() {
  // Wait for Redis to be ready
  if (red.status !== "ready") {
    await new Promise((resolve) => {
      red.once("ready", resolve);
    });
  }

  console.log("RAM installed", process.env.FRONTEND_URL);

  // Start all services
  gateway();
  appService();
  eventService();
  menuService();
  offerService();
}

await start();
