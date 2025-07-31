import { z } from "zod";

export const errorSchema = z.object({
  error: z.string(),
  details: z.array(z.object({ campo: z.string(), mensaje: z.string() })).optional(),
});