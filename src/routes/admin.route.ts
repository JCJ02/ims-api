import express from "express"
import AdminController from "../controllers/admin.controller";

const adminRoute = express.Router();
const adminController = new AdminController();

adminRoute.get("/", adminController.index);

export default adminRoute;