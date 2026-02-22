import express from "express";
import eventFetch from "../controllers/eventFetch.controller.js";
import eventFetchOne from "../controllers/eventFetchOne.controller.js";
import eventPing from "../controllers/eventPing.controller.js";
import eventDelete from "../controllers/eventDelete.controller.js";
import eventDeleteAll from "../controllers/eventDeleteAll.controller.js";
import eventAdd from "../controllers/eventAdd.controller.js";
import eventEdit from "../controllers/eventEdit.controller.js";
import middlewareAuth from "../../sharedService/middleware/middlewareAuth.js";
import { multerInstance } from "../../sharedService/upload/multer.js";

const eventRouter = express.Router();

// Fetch all events
eventRouter.get("/fetch", eventFetch);

eventRouter.post("/add", middlewareAuth, multerInstance.single("file"), eventAdd);
// Fetch one event
eventRouter.get("/fetchOne/:id", eventFetchOne);

// Edit/Update event
eventRouter.put("/edit/:id", middlewareAuth, multerInstance.single("file"), eventEdit);

// Delete event
eventRouter.delete("/delete/:id", middlewareAuth, eventDelete);

// Delete all events
eventRouter.delete("/delete-all", middlewareAuth, eventDeleteAll);

eventRouter.get("/ping", eventPing);

export default eventRouter;
