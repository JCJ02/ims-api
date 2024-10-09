import express from "express";
import RoleController from "../controllers/RoleController";

const roleRoute = express.Router();
const roleController = new RoleController();

roleRoute.post("/create", roleController.createRole);
roleRoute.put("/update-role/:id", roleController.updateRole);
roleRoute.put("/delete-role/:id", roleController.deleteRole);
roleRoute.get("/get-roles", roleController.getRoles);
roleRoute.get("/get-roles/search", roleController.searchRoles);

export default roleRoute;

