import { z } from "zod";

export const ResumeSchema = z.object({
  name: z.string().min(1),

  email: z.string().email(),

  phone: z.string().optional(),

  skills: z.array(z.string()).default([]),

  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string()
    })
  ).default([]),

  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      year: z.string()
    })
  ).default([])
});
