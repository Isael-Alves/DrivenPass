import { unprocessableEntity } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import wifiService from "@/services/wifi-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function createWifi(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const body = req.body;
  try {
    await wifiService.createWifi(userId, body);
    
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function getRedeWifiById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { wifiId } = req.params;

  if (!wifiId) {
    throw unprocessableEntity();
  }

  try {
    const wifi = await wifiService.getWifiById( userId, Number(wifiId));

    res.status(httpStatus.OK).send(wifi);
  } catch (error) {
    if (error.name === "UnprocessableEntity") {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error);
    }

    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function deleteWifi(req: AuthenticatedRequest, res: Response) {
  const { wifiId } = req.params;
  const { userId } = req;
  if (!wifiId) {
    throw unprocessableEntity();
  }
  try {
    await wifiService.deleteWifi(userId, Number(wifiId));

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "UnprocessableEntity") {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error);
    }

    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}
