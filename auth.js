import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const router = express.Router();
const prisma = new PrismaClient();
router.post("/login", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "phone required" });
    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({ data: { phone } });
    }
    const token = jwt.sign({ userId: user.id, phone: user.phone }, process.env.JWT_SECRET);
    return res.json({ token, user });
  } catch(e) {
    console.error(e);
    res.status(500).json({ message: "server error" });
  }
});
export default router;
