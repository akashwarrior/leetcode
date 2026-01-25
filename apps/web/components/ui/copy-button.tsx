"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { Button, buttonVariants } from "./button";
import { useEffect, useRef, useState } from "react";
import { ButtonProps } from "@base-ui/react";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type CopyButtonProps = ButtonProps &
  VariantProps<typeof buttonVariants> & {
    value: string;
  };

export function CopyButton({ value, ...buttonProps }: CopyButtonProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (!isCopied) {
        await navigator.clipboard.writeText(value);
        setIsCopied(true);
        timeoutRef.current = setTimeout(() => setIsCopied(false), 1500);
      }
    } catch {
      toast.error("Unable to copy to clipboard");
    }
  };

  useEffect(
    () => () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    },
    [],
  );

  return (
    <Button
      {...buttonProps}
      size={buttonProps.size || "icon-sm"}
      onClick={(e) => {
        copyToClipboard();
        buttonProps.onClick?.(e);
      }}
      className={cn("rounded-lg relative", buttonProps.className)}
    >
      <CheckIcon
        className={cn(
          "size-3.5 scale-0 transition-transform absolute duration-100",
          isCopied && "text-success scale-100",
        )}
      />
      <CopyIcon
        className={cn(
          "size-3.5 scale-0 transition-transform absolute duration-100",
          !isCopied && "scale-100",
        )}
      />
    </Button>
  );
}
