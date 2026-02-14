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
import { workerLoginAction } from "@/lib/actions/worker-auth";
import { AlertCircle, Loader2, Users } from "lucide-react";

export function WorkerLoginForm() {
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
      const result = await workerLoginAction(data);

      if (!result.success) {
        setError(result.error || "Login failed");
        setIsPending(false);
        return;
      }

      // Redirect to workers dashboard
      router.push("/dashboard-workers");
    } catch (err) {
      setError("An unexpected error occurred");
      setIsPending(false);
    }
  }

  return (
    <Card className="w-full border-emerald-200 dark:border-emerald-800">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-emerald-600" />
          <CardTitle className="text-2xl">Worker Login</CardTitle>
        </div>
        <CardDescription>
          Enter your worker credentials to continue
        </CardDescription>
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
                  <FormLabel>Worker Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Enter your worker username"
                      disabled={isPending}
                      autoComplete="username"
                      className="border-emerald-200 focus:border-emerald-500 dark:border-emerald-800"
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
                      placeholder="Enter your password"
                      disabled={isPending}
                      autoComplete="current-password"
                      className="border-emerald-200 focus:border-emerald-500 dark:border-emerald-800"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In as Worker"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
