import { app } from "./app";
import { env } from "./env";
import { prisma } from "./lib/prisma";


app.get("/users", async (request, reply) => {
  const users = await prisma.user.findMany();
  return reply.send(users);
});



app
  .listen({
    port: env.PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("Server is running on http://localhost:3333");
  });
