import express from "express"
import AdminController from "../controllers/AdminController";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/", adminController.index);
adminRoute.post("/create", adminController.createAdmin);
adminRoute.post("/login", adminController.loginAdmin);

export default adminRoute;