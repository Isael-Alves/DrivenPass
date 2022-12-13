import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createUser, createWifi } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /wifi", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/wifi");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/wifi").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/wifi").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const body = {
        name: faker.name.findName(),
        password: user.password
      };

      const response = await server.post("/wifi").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.CREATED);
    });

    it("should respond with status 404 when body incomplete data", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const body = {};

      const response = await server.post("/wifi").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when conflict wifi name", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const wifi = await createWifi(user);
      const body = {
        name: wifi.name,
        password: user.password
      };
      
      const response = await server.post("/wifi").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});

describe("GET /wifi/:wifiId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/wifi/2");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/wifi/2").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/wifi/2").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const wifi = await createWifi(user);

      const response = await server.get(`/wifi/${wifi.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
    });

    it("should respond with status 404 when wifi id not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get(`/wifi/${user.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});

describe("DELETE /wifi/:wifiId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.delete("/wifi");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.delete("/wifi").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.delete("/wifi").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 200", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const wifi = await createWifi(user);

      const response = await server.delete(`/wifi/${wifi.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
    });

    it("should respond with status 404 when wifi id not found", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.delete(`/wifi/${user.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
  });
});
