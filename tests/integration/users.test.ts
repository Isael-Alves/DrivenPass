import app, { init } from "@/app";
import { faker } from "@faker-js/faker";

import httpStatus from "http-status";
import supertest from "supertest";
import { createUser, findUserByEmail } from "../factories";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /users", () => {
  it("should respond with status 400 when body is not given", async () => {
    const response = await server.post("/users");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/users").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(10),
    });

    it("should respond with status 409 when provided email already exists", async () => {
      const body = generateValidBody();
      await createUser({
        email: body.email,
        password: body.password 
      });

      const response = await server.post("/users").send(body);
      
      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it("should respond with status 201 when user is successfully created", async () => {
      const body = generateValidBody();
      
      const response = await server.post("/users").send(body);
      const user = await findUserByEmail(body.email);
    
      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: user.id,
        email: body.email
      });
    });
  });
});
