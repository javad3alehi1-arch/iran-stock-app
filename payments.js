import express from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const router = express.Router();
const prisma = new PrismaClient();
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "no token" });
  const token = header.split(" ")[1];
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); } catch(e){ return res.status(401).json({ message: "invalid token" });}
}
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.userId;
    const p = await prisma.payment.create({ data: { userId, provider: "zarinpal", amount: amount||10000, status: "pending" }});
    return res.json({ paymentId: p.id, url: `https://sandbox.zarinpal.com/pg/StartPay/${p.id}`});
  } catch(e){ console.error(e); res.status(500).json({ message: "server error" });}
});
router.post("/webhook/simulate", async (req, res) => {
  try {
    const { paymentId } = req.body;
    const pay = await prisma.payment.findUnique({ where: { id: Number(paymentId) }});
    if (!pay) return res.status(404).json({ message: "payment not found" });
    await prisma.payment.update({ where: { id: pay.id }, data: { status: "success" }});
    await prisma.user.update({ where: { id: pay.userId }, data: { freeQuota: { increment: 3 } }});
    return res.json({ ok: true });
  } catch(e){ console.error(e); res.status(500).json({ message: "server error" });}
});
export default router;
