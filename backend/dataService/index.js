import "../sharedService/config/env.js";
import app from "./config/app.js";
import handler from "../sharedService/utils/handler.js";

export default function dataService() {
  return handler(() => {
    const port = process.env.PORT || process.env.EVENT_PORT || 4001;
    app.listen(port, "0.0.0.0", () => {
      console.log(`Data server fired up! on port ${port}`);
    });
  })();
}

// await dataService();
