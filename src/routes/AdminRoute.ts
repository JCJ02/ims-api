import express from "express";
import AdminController from "../controllers/AdminController";
import authenticationMiddleware from "../middlewares/AuthenticationMiddleware";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/test", adminController.test);
adminRoute.get("/index", authenticationMiddleware, adminController.index);
adminRoute.post("/", authenticationMiddleware, adminController.create);
adminRoute.post("/authenticate", adminController.authenticate);
adminRoute.put("/:id", authenticationMiddleware, adminController.update);
adminRoute.put("/update-password/:id", authenticationMiddleware, adminController.updatePassword);
adminRoute.delete("/:id", authenticationMiddleware, adminController.delete);
adminRoute.post("/send-email", authenticationMiddleware, adminController.sendEmail);
adminRoute.get("/", authenticationMiddleware, adminController.list);
adminRoute.get("/:id", authenticationMiddleware, adminController.get);
adminRoute.put("/archive/:id", authenticationMiddleware, adminController.archive);
adminRoute.get("/retrieve/archive-list", authenticationMiddleware, adminController.archiveList);

export default adminRoute;