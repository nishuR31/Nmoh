import express from "express";
import menuFetch from "../controllers/menuFetch.controller.js";
import menuFetchOne from "../controllers/menuFetchOne.controller.js";
import menuFetchImages from "../controllers/menuFetchImages.controller.js";
import menuPing from "../controllers/menuPing.controller.js";
import menuDelete from "../controllers/menuDelete.controller.js";
import menuDeleteAll from "../controllers/menuDeleteAll.controller.js";
import menuAdd from "../controllers/menuAdd.controller.js";
import menuEdit from "../controllers/menuEdit.controller.js";
import middlewareAuth from "../../sharedService/middleware/middlewareAuth.js";
import { multerInstance } from "../../sharedService/upload/multer.js";

const menuRouter = express.Router();

// Fetch all menus (WITHOUT images)
menuRouter.get("/fetch", menuFetch);

// Fetch images for specific menu items
menuRouter.post("/fetch-images", menuFetchImages);

menuRouter.post("/add", middlewareAuth, multerInstance.single("file"), menuAdd);
// Fetch one menu (WITH images)
menuRouter.get("/fetchOne/:id", menuFetchOne);

// Edit/Update menu
menuRouter.put("/edit/:id", middlewareAuth, multerInstance.single("file"), menuEdit);

// Delete menu
menuRouter.delete("/delete/:id", middlewareAuth, menuDelete);

// Delete all menus
menuRouter.delete("/delete-all", middlewareAuth, menuDeleteAll);

menuRouter.get("/ping", menuPing);

export default menuRouter;
