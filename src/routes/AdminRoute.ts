import express from "express";
import AdminController from "../controllers/AdminController";
import authAdminMiddleware from "../middlewares/AuthAdminMiddleware";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/index", authAdminMiddleware, adminController.index);
adminRoute.get("/", adminController.getAllAdmin);
adminRoute.post("/create", adminController.createAdmin);
adminRoute.post("/authenticate", adminController.authenticate);
adminRoute.put("/update/:id", adminController.updateAdmin);
adminRoute.put("/update-password/:id", adminController.updateAdminPassword); 
adminRoute.post("/update-password/:id", adminController.updateAdminPassword); 

export default adminRoute;