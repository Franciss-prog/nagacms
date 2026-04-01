"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth";
import { adminLoginAction } from "@/lib/actions/auth";
import { AlertCircle, Loader2, ShieldCheck } from "lucide-react";

export function AdminLoginForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsPending(true);
    setError(null);

    try {
      const result = await adminLoginAction(data);

      if (!result.success) {
        setError(result.error || "Invalid username or password");
        setIsPending(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An unexpected error occurred");
      setIsPending(false);
    }
  }

  return (
    <Card className="w-full border-blue-200 dark:border-blue-800">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-2xl">Admin Login</CardTitle>
        </div>
        <CardDescription>Sign in with system administrator credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="flex items-center gap-3 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter admin username"
                      disabled={isPending}
                      autoComplete="username"
                      className="border-blue-200 focus:border-blue-500 dark:border-blue-800"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter password"
                      disabled={isPending}
                      autoComplete="current-password"
                      className="border-blue-200 focus:border-blue-500 dark:border-blue-800"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In as Admin"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
