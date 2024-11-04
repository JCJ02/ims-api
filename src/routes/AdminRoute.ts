import express from "express";
import AdminController from "../controllers/AdminController";
import authMiddleware from "../middleware/AuthMiddleware";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/test", adminController.test);
adminRoute.get("/dashboard", authMiddleware, adminController.dashboard);
adminRoute.post("/", authMiddleware, adminController.create);
adminRoute.post("/authenticate", adminController.authenticate);
adminRoute.put("/:id", authMiddleware, adminController.update);
adminRoute.put("/update-password/:id", authMiddleware, adminController.updatePassword);
adminRoute.delete("/:id", authMiddleware, adminController.delete);
adminRoute.post("/send-email", authMiddleware, adminController.sendEmail);
adminRoute.get("/", authMiddleware, adminController.list);
adminRoute.get("/:id", authMiddleware, adminController.get);

export default adminRoute;