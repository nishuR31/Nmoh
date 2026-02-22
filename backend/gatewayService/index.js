import app from "./app.js";
import "../sharedService/config/env.js";

import handler from "../sharedService/utils/handler.js";
export default function gatewayService() {
  return handler(() => {
    const port = process.env.PORT || process.env.GATEWAY_PORT || 4004;
    app.listen(port, "0.0.0.0", () => {
      console.log(`Gateway server fired up! on port ${port}`);
    });
  })();
}

await gatewayService();
