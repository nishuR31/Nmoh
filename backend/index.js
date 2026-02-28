import "./sharedService/config/env.js";
// import dataService from "./dataService/index.js";
import appService from "./appService/index.js";
import dataService from "./dataService/index.js";
import gateway from "./gatewayService/index.js";

(async function start() {
  // Wait for Redis to be ready
  // await red.connect();

  console.log("RAM installed", process.env.FRONTEND_URL);

  // Start all services
  gateway();
  appService();
  dataService()
  console.log("Gateway|Data|App fired up")
})()
