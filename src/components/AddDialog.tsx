"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Modal } from "@/components/Modal";
import { DialogCloseContext } from "@/components/DialogContext";

export function AddDialog({
  trigger,
  title,
  children,
}: {
  trigger: string;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-rose-300 px-4 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 dark:border-rose-500/30 dark:text-rose-400 dark:hover:bg-rose-500/10"
      >
        <Plus className="h-4 w-4" />
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <Modal title={title} onClose={() => setOpen(false)}>
            <DialogCloseContext.Provider value={() => setOpen(false)}>
              {children}
            </DialogCloseContext.Provider>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
