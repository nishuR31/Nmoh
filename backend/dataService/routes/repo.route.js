import express from "express";
import repoFetch from "../controllers/repoFetch.controller.js";
import repoFetchOne from "../controllers/repoFetchOne.controller.js";
import repoAdd from "../controllers/repoAdd.controller.js";
import repoEdit from "../controllers/repoEdit.controller.js";
import repoDelete from "../controllers/repoDelete.controller.js";
import repoDeleteAll from "../controllers/repoDeleteAll.controller.js";
import repoPing from "../controllers/repoPing.controller.js";
import middlewareAuth from "../../sharedService/middleware/middlewareAuth.js";

const repoRouter = express.Router();

// Fetch all repos
repoRouter.get("/fetch", repoFetch);

// Add repo
repoRouter.post("/add", middlewareAuth, repoAdd);

// Fetch one repo
repoRouter.get("/fetchOne/:id", repoFetchOne);

// Edit/Update repo
repoRouter.put("/edit/:id", middlewareAuth, repoEdit);

// Delete repo
repoRouter.delete("/delete/:id", middlewareAuth, repoDelete);

// Delete all repos
repoRouter.delete("/delete-all", middlewareAuth, repoDeleteAll);

// Health check
repoRouter.get("/ping", repoPing);

// Login (fetch repos for user)
repoRouter.post("/login", repoLogin);

export default repoRouter;
