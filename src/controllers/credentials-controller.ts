import { unprocessableEntity } from "@/errors";
import { AuthenticatedRequest } from "@/middlewares";
import credentialService from "@/services/credentials-service";
import { Credential } from "@prisma/client";
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

export async function getCredential(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { credentialId } = req.params;
  if (!credentialId) {
    throw unprocessableEntity();
  }

  try {
    const credential = await credentialService.getCredential( userId, Number(credentialId));

    res.status(httpStatus.OK).send(credential);
  } catch (error) {
    if (error.name === "UnprocessableEntity") {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error);
    }

    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function credentialsDelete(req: AuthenticatedRequest, res: Response) {
  const { credentialId } = req.params;
  const { userId } = req;
  if (!credentialId) {
    throw unprocessableEntity();
  }
  try {
    await credentialService.deleteCredential(userId, Number(credentialId));

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    if (error.name === "UnprocessableEntity") {
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).send(error);
    }

    return res.status(httpStatus.NOT_FOUND).send(error);
  }
}

export async function getAllCredentials(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const credentials: Credential[] = await credentialService.getAllCredentials(userId);

  res.status(httpStatus.OK).send(credentials);
}
