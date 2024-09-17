import express from "express"
import AdminController from "../controllers/admin.controller";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/", adminController.index);
adminRoute.post("/create", adminController.create);
adminRoute.post("/login", adminController.loginAdmin);

export default adminRoute;