import { Credential, Wifi } from "@prisma/client";

export type ApplicationError = {
  name: string;
  message: string;
};

export type CreatCredentialType = Omit<Credential, "id">

export type CreatWifiType = Omit<Wifi, "id">

export type RequestError = {
  status: number,
  data: object | null,
  statusText: string,
  name: string,
  message: string,
};
