import { prisma } from "@/config";
import { CreatWifiType } from "@/protocols";

async function insertWifi(userId: number, body: Omit<CreatWifiType, "userId">) {
  return prisma.wifi.create({
    data: {
      userId,
      ...body,
    }
  });
}

async function findWifiWithUserIdAndName(userId: number, name: string) {
  return prisma.wifi.findFirst({
    where: {
      userId,
      name
    },
  });
}

async function findWifiWithUserId(userId: number, wifiId: number) {
  return prisma.wifi.findFirst({
    where: {
      userId,
      id: wifiId
    },
  });
}

async function deleteWifi(wifiId: number) {
  return prisma.wifi.delete({ where: { id: wifiId } });
}

const wifiRepository = {
  insertWifi,
  findWifiWithUserIdAndName,
  findWifiWithUserId,
  deleteWifi
};

export default wifiRepository;
