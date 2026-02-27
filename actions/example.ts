// TODO: Replace example file
"use server";

import { z } from "zod/v4";

import { actionClient } from "@/lib/safe-action";

export const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

export const exampleAction = actionClient.inputSchema(schema).action(async ({ parsedInput: { name } }) => {
  return { message: `Hello, ${name}!` };
});
