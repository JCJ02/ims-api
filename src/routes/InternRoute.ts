import express from "express";
import InternController from "../controllers/InternController";
import authMiddleware from "../middleware/AuthMiddleware";

const internRoute = express.Router();
const internController = new InternController();

internRoute.get("/dashboard", authMiddleware, internController.dashboard);
internRoute.post("/", authMiddleware, internController.create);
internRoute.post("/authenticate", internController.authenticate);
internRoute.put("/:id", authMiddleware, internController.update);
internRoute.put("/update-password/:id", authMiddleware, internController.updatePassword);
internRoute.delete("/:id", authMiddleware, internController.delete);
internRoute.get("/", authMiddleware, internController.list);
internRoute.get("/:id", authMiddleware, internController.get);
internRoute.put("/reset-password/:id", authMiddleware, internController.resetPassword);

export default internRoute;