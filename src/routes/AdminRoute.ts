import express from "express";
import AdminController from "../controllers/AdminController";
import authMiddleware from "../middlewares/AuthMiddleware";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/test", adminController.test);

adminRoute.get("/index", authMiddleware, adminController.index);
adminRoute.post("/create", adminController.createAdmin);
adminRoute.post("/authenticate", adminController.authenticate);
adminRoute.put("/update/:id", adminController.updateAdmin);
adminRoute.post("/update-password/:id", adminController.updateAdminPassword);
adminRoute.put("/delete/:id", adminController.deleteAdmin);
adminRoute.post("/send-email", adminController.sendEmail);
adminRoute.get("/get-admins", adminController.getAdmins);
adminRoute.get("/get-admins/search", adminController.searchAdmins);

export default adminRoute;