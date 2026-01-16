"use client";

import { mutate } from "swr";
import { useState, ViewTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, LoaderCircle } from "lucide-react";
import { TextEffect } from "@/components/ui/text-effect";
import { signUp } from "@/lib/auth-client";
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

const blurSlideVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.01 },
    },
    exit: {
      transition: { staggerChildren: 0.01, staggerDirection: 1 },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(10px) brightness(0%)",
      y: 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px) brightness(100%)",
      transition: {
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: -30,
      filter: "blur(10px) brightness(0%)",
      transition: {
        duration: 0.4,
      },
    },
  },
};

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
        router.push("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>
          <TextEffect
            className="text-2xl font-medium"
            variants={blurSlideVariants}
          >
            Create your account
          </TextEffect>
        </CardTitle>

        <CardDescription className="text-sm">
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

            <ViewTransition name="auth_field_email">
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
            </ViewTransition>

            <ViewTransition name="auth_field_password">
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
                      {!showPassword ? (
                        <EyeIcon size={14} />
                      ) : (
                        <EyeOffIcon size={14} />
                      )}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters
                </p>
              </Field>
            </ViewTransition>

            <Field>
              <ViewTransition name="auth_submit">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-primary text-white font-medium h-10 rounded-lg"
                >
                  {isLoading ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </ViewTransition>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <p className="text-sm text-muted-foreground m-auto">
          Already have an account?{" "}
          <span
            onClick={() => !isLoading && router.replace("/sign-in")}
            className="cursor-pointer font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </span>
        </p>
      </CardFooter>
    </Card>
  );
}
