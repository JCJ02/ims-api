import express from "express";
import RoleController from "../controllers/RoleController";
import authenticationMiddleware from "../middlewares/AuthenticationMiddleware";

const roleRoute = express.Router();
const roleController = new RoleController();

roleRoute.post("/", authenticationMiddleware, roleController.create);
roleRoute.put("/:id", authenticationMiddleware, roleController.update);
roleRoute.delete("/:id", authenticationMiddleware, roleController.delete);
roleRoute.get("/", authenticationMiddleware, roleController.list);
roleRoute.get("/:id", authenticationMiddleware, roleController.get);
roleRoute.put("/archive/:id", authenticationMiddleware, roleController.archive);
roleRoute.get("/retrieve/archive-list", authenticationMiddleware, roleController.archiveList);

export default roleRoute;

