import express from "express";
import InternController from "../controllers/InternController";
import authenticationMiddleware from "../middlewares/AuthenticationMiddleware";

const internRoute = express.Router();
const internController = new InternController();

internRoute.get("/dashboard", authenticationMiddleware, internController.index);
internRoute.post("/", authenticationMiddleware, internController.create);
internRoute.post("/authenticate", internController.authenticate);
internRoute.put("/:id", authenticationMiddleware, internController.update);
internRoute.put("/update-password/:id", authenticationMiddleware, internController.updatePassword);
internRoute.delete("/:id", authenticationMiddleware, internController.delete);
internRoute.get("/", authenticationMiddleware, internController.list);
internRoute.get("/:id", authenticationMiddleware, internController.get);
internRoute.put("/reset-password/:id", authenticationMiddleware, internController.resetPassword);
internRoute.put("/archive/:id", authenticationMiddleware, internController.archive);
internRoute.get("/retrieve/archive-list", authenticationMiddleware, internController.archiveList);

export default internRoute;