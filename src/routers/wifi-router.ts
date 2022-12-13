import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { createWifi, deleteWifi, getRedeWifiById } from "@/controllers/wifi-controller";

const wifiRouter = Router();

wifiRouter
  .all("/*", authenticateToken)
  .post("/", createWifi)
  .get("/:wifiId", getRedeWifiById)
  .delete("/:wifiId", deleteWifi);

export { wifiRouter };
