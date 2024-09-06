import { z } from "zod";

export const OrganizationStatus = {
  Active: "active",
  Inactive: "inactive",
};

export const OrganizationSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable(),
  status: z.enum(["active", "inactive"]),
  type: z.string().nullable(),
  logoUrl: z.string().nullable(),
  richMediaConfig: z.any().nullable(),
  contactMail: z.string().email().nullable(),
  website: z.string().url().nullable(),
  twitter: z.string().url().nullable(),
  weibo: z.string().url().nullable(),
  qqGroup: z.string().nullable(),
  bilibili: z.string().url().nullable(),
  wikifur: z.string().url().nullable(),
  creationTime: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .nullable(),
});

export type OrganizationType = z.infer<typeof OrganizationSchema>;
