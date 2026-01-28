import { z } from "zod";

/**
 * Validation schemas for submissions
 */

export const approveSubmissionSchema = z.object({
  id: z.string().uuid(),
  remarks: z.string().optional(),
});

export type ApproveSubmissionData = z.infer<typeof approveSubmissionSchema>;

export const returnSubmissionSchema = z.object({
  id: z.string().uuid(),
  remarks: z.string().min(1, "Remarks are required when returning"),
});

export type ReturnSubmissionData = z.infer<typeof returnSubmissionSchema>;
