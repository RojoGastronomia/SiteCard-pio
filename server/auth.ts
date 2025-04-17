import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, insertUserSchema } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  console.log(`[Compare] Comparing passwords. Stored value: ${stored ? stored.substring(0, 20) + '...' : 'undefined'}`);
  try {
    const [hashed, salt] = stored.split(".");
    if (!hashed || !salt) {
      console.error(`[Compare] Invalid stored password format for user.`);
      throw new Error("Invalid stored password format.");
    }
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    
    console.log(`[Compare] Hashed buffer length (stored): ${hashedBuf.length}`);
    console.log(`[Compare] Supplied buffer length (generated): ${suppliedBuf.length}`);
    
    if (hashedBuf.length !== suppliedBuf.length) {
       console.error(`[Compare] Buffer length mismatch! Cannot compare.`);
       return false; 
    }
    
    console.log("[Compare] Buffer lengths match. Performing timingSafeEqual.");
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
     console.error("[Compare] Error during password comparison:", error);
     throw error;
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "cardapio-digital-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    }, async (email, password, done) => {
      try {
        const user = await storage.getUserByEmail(email);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    console.log(`[Auth] Attempting to deserialize user with ID: ${id}`);
    try {
      const user = await storage.getUser(id);
      if (user) {
        console.log(`[Auth] Successfully deserialized user: ${user.username}`);
        done(null, user);
      } else {
        console.error(`[Auth] User not found for ID: ${id}`);
        done(new Error(`User not found for ID: ${id}`), null);
      }
    } catch (error) {
      console.error('[Auth] Error during deserialization:', error);
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser({
        ...userData,
        password: await hashPassword(userData.password),
      });

      req.login(user, (err: any) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: fromZodError(error).message 
        });
      }
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: SelectUser | false, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid email or password" });
      
      req.login(user, (err: any) => {
        if (err) return next(err);
        res.status(200).json(user);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err: any) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
