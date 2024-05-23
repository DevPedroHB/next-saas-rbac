import { z } from "zod";
import { project } from "../models/project";

export const projectSubject = z.tuple([
  z.union([
    z.literal("manage"),
    z.literal("get"),
    z.literal("create"),
    z.literal("update"),
    z.literal("delete"),
  ]),
  z.union([z.literal("Project"), project]),
]);

export type ProjectSubject = z.infer<typeof projectSubject>;
