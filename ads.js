import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const router = express.Router();
const prisma = new PrismaClient();
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "no token" });
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch(e) { return res.status(401).json({ message: "invalid token" }); }
}
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, price, city, category, images } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.userId }});
    if (!user) return res.status(404).json({ message: "user not found" });
    if (user.freeQuota <= 0) return res.status(400).json({ message: "no free quota" });
    const ad = await prisma.ad.create({ data: {
      title, description, price: price||0, city, category, images: images||[], userId: user.id
    }});
    await prisma.user.update({ where: { id: user.id }, data: { freeQuota: { decrement: 1 } }});
    res.json({ message: "ad created", ad });
  } catch(e) {
    console.error(e); res.status(500).json({ message: "server error" });
  }
});
router.get("/", async (req, res) => {
  const ads = await prisma.ad.findMany({ include: { user: true }, orderBy: { createdAt: "desc" }});
  res.json(ads);
});
export default router;
