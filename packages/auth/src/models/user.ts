import { z } from "zod";
import { role } from "../roles";

export const user = z.object({
  id: z.string(),
  role,
});

export type User = z.infer<typeof user>;
