"use client";

import { useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useDialogClose } from "@/components/DialogContext";

export function FormStatusWatcher() {
  const { pending } = useFormStatus();
  const closeDialog = useDialogClose();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) closeDialog?.();
    wasPending.current = pending;
  }, [pending, closeDialog]);

  return null;
}
