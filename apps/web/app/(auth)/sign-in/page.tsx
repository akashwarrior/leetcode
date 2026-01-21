"use client";

import { mutate } from "swr";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeSlash, Spinner } from "@phosphor-icons/react";
import { signIn } from "@/lib/auth/client";
import { toast } from "sonner";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const busy = isLoading || isGoogleLoading;

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error, data } = await signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message ?? "Invalid email or password");
      }
      if (data?.user) {
        await mutate("session");
        router.replace("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message ?? "Google sign-in failed");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-medium tracking-tight text-primary">
          Welcome back
        </CardTitle>
        <CardDescription className="text-sm text-secondary">
          Sign in to continue your practice
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@example.com"
                required
                disabled={busy}
                className="h-10 rounded-lg"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder={showPassword ? "password" : "••••••••"}
                  required
                  disabled={busy}
                  className="h-10 rounded-lg"
                />
                <InputGroupAddon align="inline-end">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={busy}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {!showPassword ? <Eye size={14} /> : <EyeSlash size={14} />}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field>
              <Button
                type="submit"
                disabled={busy}
                className="w-full bg-primary text-primary-foreground hover:opacity-85 font-medium h-10 rounded-lg"
              >
                {isLoading ? (
                  <Spinner className="size-4 animate-spin" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </Field>

            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-xs">
              Or continue with
            </FieldSeparator>

            <Field>
              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={handleGoogleLogin}
                className="border-border/50 h-10 rounded-lg font-medium"
              >
                {isGoogleLoading ? (
                  <Spinner className="size-4 animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-4"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-secondary m-auto">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => !busy && router.replace("/sign-up")}
            className="cursor-pointer font-medium text-primary hover:opacity-80 transition-opacity"
          >
            Sign up
          </span>
        </p>
      </CardFooter>
    </Card>
  );
}
