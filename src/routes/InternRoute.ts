import express from "express";
import InternController from "../controllers/InternController";
import authAdminMiddleware from "../middlewares/AuthAdminMiddleware";
import authMiddleware from "../middlewares/AuthMiddleware";
import RoleController from "../controllers/RoleController";

const internRoute = express.Router();
const internController = new InternController();

internRoute.get("/index", authMiddleware, internController.index);
internRoute.post("/create", internController.createIntern);
internRoute.post("/authenticate", internController.authenticate);
internRoute.put("/update/:id", internController.updateIntern);
internRoute.put("/update-password/:id", internController.updateInternPassword);
internRoute.put("/delete/:id", internController.deleteIntern);
internRoute.get("/get-interns", internController.getInterns);
internRoute.get("/get-interns/search", internController.searchInterns);

export default internRoute;