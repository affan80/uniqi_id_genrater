import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const QRCode = {
  async findByCode(code) {
    try {
      const qr = await prisma.qRCode.findUnique({
        where: { code },
        include: { cohort: true },
      });

      if (!qr) {
        console.warn(`No QR code found for code: ${code}`);
        return null;
      }
      return qr;
    } catch (error) {
      console.error("❌ Error fetching QR code by code:", error.message);
      throw new Error("Database error while fetching QR code");
    }
  }
};
export default QRCode;