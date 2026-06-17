let db;
let mode = "unknown";

export async function initDB() {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn("No MONGODB_URI found, using local JSON database");
    const local = await import("./localDB.js");
    db = { User: local.User, DailyLog: local.DailyLog };
    mode = "local";
    return db;
  }

  try {
    const mongooseModule = await import("mongoose");
    const mongoose = mongooseModule.default;
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB Atlas");
    const mongo = await import("./mongoDB.js");
    db = { User: mongo.User, DailyLog: mongo.DailyLog };
    mode = "mongo";
    return db;
  } catch (err) {
    console.warn("MongoDB connection failed, falling back to local JSON database:", err.message);
    const local = await import("./localDB.js");
    db = { User: local.User, DailyLog: local.DailyLog };
    mode = "local";
    return db;
  }
}

export function getDB() {
  if (!db) throw new Error("Database not initialized. Call initDB() first.");
  return db;
}

export function getMode() {
  return mode;
}
