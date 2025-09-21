"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_fastify = __toESM(require("fastify"), 1);

// src/http/controllers/register.ts
var import_zod = __toESM(require("zod"), 1);

// src/use-cases/register-use-case.ts
var import_bcrypt = __toESM(require("bcrypt"), 1);
var RegisterUseCase = class {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }
  async execute({
    name,
    email,
    password
  }) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new Error("Email already exists");
    }
    await this.usersRepository.create({
      name,
      email,
      password_hash: await import_bcrypt.default.hashh(password, 6)
    });
  }
};

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/repositories/prisma-users-repository.ts
var PrismaUsersRepository = class {
  async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    return user;
  }
  async create(data) {
    const user = await prisma.user.create({
      data
    });
    return user;
  }
};

// src/http/controllers/register.ts
async function register(request, reply) {
  const createUserSchema = import_zod.default.object({
    name: import_zod.default.string(),
    email: import_zod.default.string().email(),
    password: import_zod.default.string().min(6, "Password must be at least 6 characters long")
  });
  const { name, email, password } = createUserSchema.parse(request.body);
  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);
    await registerUseCase.execute({
      name,
      email,
      password
    });
  } catch (err) {
    return reply.status(409).send();
  }
  return reply.status(201).send();
}

// src/http/routes.ts
async function appRoutes(app2) {
  app2.post("/users", register);
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(appRoutes);

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod2 = require("zod");
var envSchema = import_zod2.z.object({
  NODE_ENV: import_zod2.z.enum(["dev", "production", "test"]).default("production"),
  PORT: import_zod2.z.coerce.number().default(3333),
  DATABASE_URL: import_zod2.z.string()
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error(
    "\u274C invalid environment variables",
    import_zod2.z.prettifyError(_env.error)
  );
  throw new Error("\u274C invalid environment variables");
}
var env = _env.data;

// src/server.ts
app.get("/users", async (request, reply) => {
  const users = await prisma.user.findMany();
  return reply.send(users);
});
app.listen({
  port: env.PORT,
  host: "0.0.0.0"
}).then(() => {
  console.log("Server is running on http://localhost:3333");
});
