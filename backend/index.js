import "./sharedService/config/env.js";
// import dataService from "./dataService/index.js";
import appService from "./appService/index.js";
import red from "./sharedService/config/redis.js";
import gateway from "./gatewayService/index.js";

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
}

await start();
