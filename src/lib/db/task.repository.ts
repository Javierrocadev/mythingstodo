import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@prisma/client";

type TaskCreateData = Pick<
  Prisma.TaskCreateInput,
  "title" | "urgency" | "emotionalType" | "estimatedMinutes" | "deadline" | "order"
>;

type TaskUpdateData = Partial<
  Pick<
    Prisma.TaskCreateInput,
    "title" | "urgency" | "emotionalType" | "estimatedMinutes" | "deadline" | "status" | "order"
  >
> & { completedAt?: Date | null; startedAt?: Date | null };

export const taskRepository = {
  async findManyByUser(userId: string) {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { order: "asc" },
    });
  },

  async findActiveByUser(userId: string) {
    return prisma.task.findMany({
      where: { userId, status: { not: "DONE" } },
      orderBy: { order: "asc" },
    });
  },

  async findById(id: string) {
    return prisma.task.findUnique({ where: { id } });
  },

  async create(userId: string, data: TaskCreateData) {
    return prisma.task.create({
      data: { ...data, userId },
    });
  },

  async update(id: string, data: TaskUpdateData) {
    return prisma.task.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.task.delete({ where: { id } });
  },

  async getNextOrder(userId: string) {
    const last = await prisma.task.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
    return (last?.order ?? 0) + 1;
  },

  async reorder(orderedIds: string[]) {
    const updates = orderedIds.map((id, index) =>
      prisma.task.update({
        where: { id },
        data: { order: index },
      }),
    );
    await prisma.$transaction(updates);
  },

  async batchEnrich(
    updates: Array<{ id: string; emotionalType?: string; estimatedMinutes?: number | null }>,
  ) {
    const ops = updates
      .filter((u) => u.emotionalType !== undefined || u.estimatedMinutes !== undefined)
      .map((u) =>
        prisma.task.update({
          where: { id: u.id },
          data: {
            ...(u.emotionalType ? { emotionalType: u.emotionalType as any } : {}),
            ...(u.estimatedMinutes !== undefined ? { estimatedMinutes: u.estimatedMinutes } : {}),
          },
        }),
      );
    if (ops.length > 0) await prisma.$transaction(ops);
  },
};
