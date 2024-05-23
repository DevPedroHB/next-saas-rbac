import { z } from "zod";
import { role } from "../roles";

export const user = z.object({
  role,
});

export type User = z.infer<typeof user>;
