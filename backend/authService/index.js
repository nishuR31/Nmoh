import "../sharedService/config/env.js";
import app from "./config/app.js";
import handler from "../sharedService/utils/handler.js";

export default function menuService() {
  return handler(() => {
    const port = process.env.PORT || process.env.MENU_PORT || 4002;
    app.listen(port, "0.0.0.0", () => {
      console.log(`Menu server fired up! on port ${port}`);
    });
  })();
}

await menuService();
