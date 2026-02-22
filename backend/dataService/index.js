import "../sharedService/config/env.js";
import app from "./config/app.js";
import handler from "../sharedService/utils/handler.js";

export default function eventService() {
  return handler(() => {
    const port = process.env.PORT || process.env.EVENT_PORT || 4001;
    app.listen(port, "0.0.0.0", () => {
      console.log(`Event server fired up! on port ${port}`);
    });
  })();
}

await eventService();
