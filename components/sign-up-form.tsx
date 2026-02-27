"use client";

import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentPropsWithoutRef, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    repeatPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export function SignUpForm({ className, ...props }: ComponentPropsWithoutRef<"div">) {
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

      const { email, password } = submission.value;
      const supabase = createClient();
      setIsLoading(true);
      setServerError(null);

      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) throw error;
        router.push("/auth/sign-up-success");
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
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form {...getFormProps(form)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor={fields.email.id}>Email</Label>
                <Input {...getInputProps(fields.email, { type: "email" })} placeholder="m@example.com" />
                {fields.email.errors && <p className="text-sm text-red-500">{fields.email.errors[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor={fields.password.id}>Password</Label>
                <Input {...getInputProps(fields.password, { type: "password" })} />
                {fields.password.errors && <p className="text-sm text-red-500">{fields.password.errors[0]}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor={fields.repeatPassword.id}>Repeat Password</Label>
                <Input {...getInputProps(fields.repeatPassword, { type: "password" })} />
                {fields.repeatPassword.errors && <p className="text-sm text-red-500">{fields.repeatPassword.errors[0]}</p>}
              </div>
              {serverError && <p className="text-sm text-red-500">{serverError}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating an account..." : "Sign up"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

