import express from "express";
import InternController from "../controllers/InternController";
import authMiddleware from "../middlewares/AuthMiddleware";

const internRoute = express.Router();
const internController = new InternController();

internRoute.get("/index", authMiddleware, internController.index);
internRoute.post("/create", internController.createIntern);
internRoute.post("/authenticate", internController.authenticate);
internRoute.put("/update/:id", internController.updateIntern);
internRoute.put("/update-password/:id", internController.updateInternPassword);
internRoute.put("/delete/:id", internController.deleteIntern);
internRoute.get("/get-interns", internController.getInternsList);
internRoute.get("/get-interns/search", internController.searchInterns);
internRoute.put("/reset-password/:id", internController.resetInternPassword);

export default internRoute;