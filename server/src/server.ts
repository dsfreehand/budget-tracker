import express, { Request } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import jwt from "jsonwebtoken";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables.");
}

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Budget Tracker API is running");
});

// Token extraction helper
const getUserFromToken = (req: Request) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // should contain { id, email }
  } catch (err) {
    console.warn("🔐 Invalid JWT:", err);
    return null;
  }
};

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log("✅ Connected to MongoDB");

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => {
        const user = getUserFromToken(req);
        return { user };
      },
    });

    await server.start();
    server.applyMiddleware({ app, path: "/graphql" });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔮 GraphQL endpoint ready at http://localhost:${PORT}/graphql`);
    });
  } catch (err: any) {
    console.error("❌ Server startup error:", err.message);
  }
}

startServer();
