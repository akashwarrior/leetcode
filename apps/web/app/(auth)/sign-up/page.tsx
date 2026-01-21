"use client";

import { mutate } from "swr";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Eye, EyeSlash, Spinner } from "@phosphor-icons/react";
import { signUp } from "@/lib/auth/client";
import { toast } from "sonner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    if (name.trim().length === 0) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsLoading(true);
    try {
      const { error, data } = await signUp.email({
        email,
        password,
        name,
        username,
      });

      if (error) {
        toast.error(error.message ?? "Failed to create account");
      }
      if (data?.user) {
        await mutate("session");
        router.replace("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-medium tracking-tight text-primary">
          Create your account
        </CardTitle>
        <CardDescription className="text-sm text-secondary">
          Start your coding journey today
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignUp}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="John Doe"
                required
                disabled={isLoading}
                className="h-10 rounded-lg"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="johndoe"
                required
                disabled={isLoading}
                className="h-10 rounded-lg"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@example.com"
                required
                disabled={isLoading}
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
                  minLength={8}
                  disabled={isLoading}
                  className="h-10 rounded-lg"
                />
                <InputGroupAddon align="inline-end">
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={isLoading}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {!showPassword ? <Eye size={14} /> : <EyeSlash size={14} />}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <p className="text-xs text-secondary mt-1">
                Must be at least 8 characters
              </p>
            </Field>

            <Field>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:opacity-85 font-medium h-10 rounded-lg"
              >
                {isLoading ? (
                  <Spinner className="size-4 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-secondary m-auto">
          Already have an account?{" "}
          <span
            onClick={() => !isLoading && router.replace("/sign-in")}
            className="cursor-pointer font-medium text-primary hover:opacity-80 transition-opacity"
          >
            Sign in
          </span>
        </p>
      </CardFooter>
    </Card>
  );
}
