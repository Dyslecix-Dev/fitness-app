"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useRouter } from "next/navigation";
import { ComponentPropsWithoutRef, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function UpdatePasswordForm({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    async onSubmit(event, { submission }) {
      event.preventDefault();
      if (!submission || submission.status !== "success") return;

      const { password } = submission.value;
      const supabase = createClient();
      setIsLoading(true);
      setServerError(null);

      try {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;

        router.push("/");
      } catch (error: unknown) {
        setServerError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form {...getFormProps(form)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor={fields.password.id}>New password</Label>
                <Input {...getInputProps(fields.password, { type: "password" })} placeholder="New password" />
                {fields.password.errors && <p className="text-sm text-red-500">{fields.password.errors[0]}</p>}
              </div>
              {serverError && <p className="text-sm text-red-500">{serverError}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save new password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

