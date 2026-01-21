"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth/client";

type ContestRegistrationButtonProps = {
  contestId: string;
  contestTitle: string;
  initialRegistered: boolean;
  className?: string;
  size?: "default" | "sm" | "lg";
};

export function ContestRegistrationButton({
  contestId,
  contestTitle,
  initialRegistered,
  className,
  size = "default",
}: ContestRegistrationButtonProps) {
  const {data: session} = useSession();
  const router = useRouter();
  const [registered, setRegistered] = useState(initialRegistered);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setRegistered(initialRegistered);
  }, [initialRegistered]);

  async function handleClick() {
    if (!session?.user) {
      toast.error("Sign in to register for contests");
      router.push("/sign-in");
      return;
    }

    setPending(true);

    try {
      const response = await fetch(
        `/api/contests/${contestId}/participation`,
        {
          method: registered ? "DELETE" : "POST",
        },
      );

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

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
      className={cn(
        "gap-2 rounded-md border text-sm font-medium",
        registered
          ? "border-border bg-muted text-foreground hover:bg-muted/80"
          : "gradient-primary border-0 text-white",
        className,
      )}
    >
      {pending ? (
        <Loader2 size={14} className="animate-spin" />
      ) : registered ? (
        <>
          <CheckCircle2 size={14} />
          Registered
        </>
      ) : (
        <>
          <Trophy size={14} />
          Register
        </>
      )}
    </Button>
  );
}
