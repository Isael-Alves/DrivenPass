import { conflictError, notFoundError } from "@/errors";
import { CreatWifiType } from "@/protocols";
import wifiRepository from "@/repositories/wifi-repository";
import { decrypt, encrypt } from "@/utils/criptrUtils";

async function createWifi(userId: number, body: Omit<CreatWifiType, "userId">) {
  const checkRedeExist = await wifiRepository.findWifiWithUserIdAndName(userId, body.name);
  
  if (checkRedeExist) {
    throw conflictError("Name already in use");
  }

  const wifiInfos = {
    ...body,
    password: encrypt(body.password),
  };

  await wifiRepository.insertWifi(userId, wifiInfos);
}

async function getWifiById(userId: number, wifiId: number) {
  const checkWifiExist = await wifiRepository.findWifiWithUserId(
    userId,
    wifiId
  );
  if (!checkWifiExist) throw notFoundError();

  return {
    ...checkWifiExist,
    password: decrypt(checkWifiExist.password)
  };
}

async function deleteWifi(userId: number, wifiId: number) {
  await getWifiById(userId, wifiId);
  await wifiRepository.deleteWifi(wifiId);
}

const wifiService = {
  createWifi,
  getWifiById,
  deleteWifi
};

export default wifiService;
