"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth/client";
import {
  CheckCircleIcon,
  SpinnerIcon,
  TrophyIcon,
} from "@phosphor-icons/react";

type ContestRegistrationButtonProps = {
  contestSlug: string;
  contestTitle: string;
  initialRegistered: boolean;
  size?: "default" | "sm" | "lg";
  className?: string;
};

export function ContestRegistrationButton({
  contestSlug,
  contestTitle,
  initialRegistered,
  size = "default",
  className,
}: ContestRegistrationButtonProps) {
  const { data: session, isLoading: sessionLoading } = useSession();
  const router = useRouter();
  const [registered, setRegistered] = useState(initialRegistered);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setRegistered(initialRegistered);
  }, [initialRegistered]);

  async function handleClick() {
    if (sessionLoading) {
      return;
    }

    if (!session?.user) {
      toast.error("Sign in to register for contests");
      router.push("/sign-in");
      return;
    }

    setPending(true);

    try {
      const response = await fetch(
        `/api/contests/${contestSlug}/participation`,
        {
          method: registered ? "DELETE" : "POST",
        },
      );

      const payload = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? "Unable to update registration");
      }

      const nextRegistered = !registered;
      setRegistered(nextRegistered);

      if (nextRegistered) {
        toast.success(`Registered for ${contestTitle}`);
      } else {
        toast.success("Registration cancelled");
      }

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update registration",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      type="button"
      size={size}
      onClick={handleClick}
      disabled={pending}
      className={className}
    >
      {pending ? (
        <SpinnerIcon size={14} className="animate-spin" />
      ) : registered ? (
        <>
          <CheckCircleIcon size={14} />
          Registered
        </>
      ) : (
        <>
          <TrophyIcon size={14} />
          Register
        </>
      )}
    </Button>
  );
}
