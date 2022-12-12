import { AuthenticatedRequest } from "@/middlewares";
import credentialService from "@/services/credentials-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function createCredentials(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const body = req.body;
  try {
    await credentialService.createCredential(userId, body);
    return res.sendStatus(httpStatus.CREATED);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function credentialsGet(req: AuthenticatedRequest, res: Response) {
  try {
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "DuplicatedEmailError") {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function credentialsDelete(req: AuthenticatedRequest, res: Response) {
  try {
    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "DuplicatedEmailError") {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}
