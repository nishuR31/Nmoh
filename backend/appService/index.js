import app from "./config/app.js";
import "../sharedService/config/env.js";

import handler from "../sharedService/utils/handler.js";
// import "../sharedService/queue/worker.js"; // Initialize mail worker

export default function appService() {
  return handler(() => {
    const port = process.env.APP_PORT || 4000;
    app.listen(port, "0.0.0.0", () => {
      console.log(`App server fired up! on port ${port}`);
      // console.log("Mail queue worker initialized");
    });
  })();
}

await appService();
