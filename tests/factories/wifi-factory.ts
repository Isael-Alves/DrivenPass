import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { encrypt } from "@/utils/criptrUtils";
import { User, Wifi } from "@prisma/client";

export function createWifi(user: Partial<User> ): Promise<Wifi> {
  const newPassword = encrypt(user.password);
  return prisma.wifi.create({
    data: {
      name: faker.name.findName(),
      password: newPassword,
      userId: user.id
    },
  });
}
