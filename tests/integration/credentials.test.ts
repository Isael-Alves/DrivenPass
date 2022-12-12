import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createCredential, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /credentials", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/credentials");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/credentials").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/credentials").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 201", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const body = {
        userId: user.id,
        title: faker.lorem.sentence(),
        url: faker.internet.url(),
        username: faker.name.findName(),
        password: user.password
      };

      const response = await server.post("/credentials").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.CREATED);
    });

    it("should respond with status 404 when the title is already in use. ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const credential = await createCredential(user);

      const body = {
        userId: user.id,
        title: credential.title,
        url: faker.internet.url(),
        username: faker.name.findName(),
        password: user.password
      };

      const response = await server.post("/credentials").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when when information for the body is incorrect or incomplete", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const body = {
        userId: user.id,
        title: faker.lorem.sentence(),
        url: faker.internet.url(),
        password: user.password
      };

      const response = await server.post("/credentials").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});
