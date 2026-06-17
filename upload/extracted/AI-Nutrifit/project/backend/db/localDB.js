import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { users: [], dailylogs: [] };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generateId() {
  return crypto.randomBytes(12).toString("hex");
}

function createCollection(name) {
  return {
    async find(filter = {}) {
      const db = readDB();
      const collection = db[name] || [];
      const entries = Object.entries(filter);
      return collection
        .filter((doc) =>
          entries.every(([key, val]) => {
            if (val && typeof val === "object" && val.$gte !== undefined && val.$lte !== undefined) {
              return doc[key] >= val.$gte && doc[key] <= val.$lte;
            }
            if (val && typeof val === "object" && val.$gte !== undefined) {
              return doc[key] >= val.$gte;
            }
            if (val && typeof val === "object" && val.$lte !== undefined) {
              return doc[key] <= val.$lte;
            }
            return doc[key] === val;
          })
        )
        .map((doc) => ({ ...doc, _id: doc._id }));
    },

    async findOne(filter = {}) {
      const results = await this.find(filter);
      return results[0] || null;
    },

    async findById(id) {
      const db = readDB();
      const collection = db[name] || [];
      const doc = collection.find((d) => d._id === id);
      return doc ? { ...doc } : null;
    },

    async create(data) {
      const db = readDB();
      if (!db[name]) db[name] = [];
      const doc = { ...data, _id: data._id || generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      db[name].push(doc);
      writeDB(db);
      return doc;
    },

    async findByIdAndUpdate(id, update, options = {}) {
      const db = readDB();
      const collection = db[name] || [];
      const idx = collection.findIndex((d) => d._id === id);
      if (idx === -1) return null;
      const setData = update.$set || update;
      collection[idx] = { ...collection[idx], ...setData, updatedAt: new Date().toISOString() };
      writeDB(db);
      return collection[idx];
    },

    async findOneAndUpdate(filter, update, options = {}) {
      const db = readDB();
      const collection = db[name] || [];
      const entries = Object.entries(filter);
      const idx = collection.findIndex((doc) => entries.every(([key, val]) => doc[key] === val));
      if (idx === -1) {
        if (options.upsert) {
          const setData = update.$set || update;
          const doc = { ...filter, ...setData, _id: generateId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
          db[name].push(doc);
          writeDB(db);
          return doc;
        }
        return null;
      }
      const setData = update.$set || update;
      collection[idx] = { ...collection[idx], ...setData, updatedAt: new Date().toISOString() };
      writeDB(db);
      return collection[idx];
    },

    async countDocuments(filter = {}) {
      const results = await this.find(filter);
      return results.length;
    },
  };
}

export const User = createCollection("users");
export const DailyLog = createCollection("dailylogs");
