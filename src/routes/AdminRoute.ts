import express from "express"
import AdminController from "../controllers/AdminController";
import authAdminMiddleware from "../middlewares/AuthAdminMiddleware";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/test", authAdminMiddleware, adminController.index);
adminRoute.post("/create", adminController.createAdmin);
adminRoute.post("/authenticate", adminController.authenticate);
adminRoute.put("/update/:id", adminController.updateAdmin);
adminRoute.put("/update-password/:id", adminController.updateAdminPassword); // Check this if it is good?

export default adminRoute;