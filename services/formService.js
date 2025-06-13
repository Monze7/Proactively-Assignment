import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createForm = async (adminId, title) => {
  return prisma.form.create({
    data: {
      title,
      shareCode: Math.random().toString(36).substring(2, 8),
      admin: { connect: { id: adminId } }
    }
  });
};

export const getFormByCode = async (code) => {
  return prisma.form.findUnique({
    where: { shareCode: code },
    include: { fields: true, response: { include: { entries: true } } }
  });
};
