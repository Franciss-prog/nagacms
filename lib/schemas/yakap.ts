import { z } from "zod";

/**
 * Validation schemas for YAKAP applications
 */

export const approveYakakSchema = z.object({
  id: z.string().uuid(),
  remarks: z.string().optional(),
});

export type ApproveYakakData = z.infer<typeof approveYakakSchema>;

export const returnYakakSchema = z.object({
  id: z.string().uuid(),
  remarks: z.string().min(1, "Remarks are required when returning"),
});

export type ReturnYakakData = z.infer<typeof returnYakakSchema>;
