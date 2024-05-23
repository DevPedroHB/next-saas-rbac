import { z } from "zod";
import { organization } from "../models/organization";

export const organizationSubject = z.tuple([
  z.union([
    z.literal("manage"),
    z.literal("create"),
    z.literal("update"),
    z.literal("delete"),
    z.literal("transfer_ownership"),
  ]),
  z.union([z.literal("Organization"), organization]),
]);

export type OrganizationSubject = z.infer<typeof organizationSubject>;
