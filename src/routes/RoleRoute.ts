import express from "express";
import RoleController from "../controllers/RoleController";
import authMiddleware from "../middleware/AuthMiddleware";

const roleRoute = express.Router();
const roleController = new RoleController();

roleRoute.post("/", authMiddleware, roleController.create);
roleRoute.put("/:id", authMiddleware, roleController.update);
roleRoute.delete("/:id", authMiddleware, roleController.delete);
roleRoute.get("/", authMiddleware, roleController.list);
roleRoute.get("/:id", authMiddleware, roleController.get);
roleRoute.put("/archive/:id", authMiddleware, roleController.archive);
roleRoute.get("/retrieve/archive-list", authMiddleware, roleController.archiveList);

export default roleRoute;

