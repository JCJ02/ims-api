import express from "express";
import RoleController from "../controllers/RoleController";
import authMiddleware from "../middleware/AuthMiddleware";

const roleRoute = express.Router();
const roleController = new RoleController();

roleRoute.post("/", authMiddleware, roleController.create);
roleRoute.put("/:id", authMiddleware, roleController.update);
roleRoute.delete("/:id", authMiddleware, roleController.delete);
roleRoute.get("/list", authMiddleware, roleController.list);

export default roleRoute;

