import { z } from "zod";

export const ratingSchema = z.object({
  blitz: z.number().int().min(0),
  rapid: z.number().int().min(0),
  daily: z.number().int().min(0),
});

export type Rating = z.infer<typeof ratingSchema>;
