"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { buttonClassName } from "@/components/ui";
import type { StoryType } from "@/lib/types";

export function ActionForm({
  issueId,
  productId,
  defectId,
  suggestedOwners,
}: {
  issueId: StoryType;
  productId: string | null;
  defectId: string | null;
  suggestedOwners: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("open");
  const [ownerUserId, setOwnerUserId] = useState(suggestedOwners[0] ?? "user_017");
  const [actionType, setActionType] = useState("corrective");
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setMessage(null);

    const payload = {
      actionType: String(formData.get("actionType") ?? actionType),
      status: String(formData.get("status") ?? status),
      ownerUserId: String(formData.get("ownerUserId") ?? ownerUserId),
      comments: String(formData.get("comments") ?? comments),
      productId,
      defectId: defectId ?? undefined,
    };

    const response = await fetch(`/api/issues/${issueId}/actions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setMessage(data?.error ?? "Could not create action.");
      return;
    }

    setComments("");
    setMessage("Action created and pushed into the live workflow.");
    router.refresh();
  }

  return (
    <form
      action={(formData) => startTransition(() => onSubmit(formData))}
      className="space-y-4 rounded-[12px] border border-[#d7deea] bg-[#f7f9fc] p-4"
    >
      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-2 text-sm text-[#334155]">
          <span className="font-medium">Action type</span>
          <input
            name="actionType"
            value={actionType}
            onChange={(event) => setActionType(event.target.value)}
            className="w-full rounded-xl border border-[#d7deea] bg-white px-3 py-2 outline-none focus:border-[#0B5FFF] focus:ring-2 focus:ring-[#b3ccff]"
          />
        </label>
        <label className="space-y-2 text-sm text-[#334155]">
          <span className="font-medium">Status</span>
          <select
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-xl border border-[#d7deea] bg-white px-3 py-2 outline-none focus:border-[#0B5FFF] focus:ring-2 focus:ring-[#b3ccff]"
          >
            <option value="open">open</option>
            <option value="in_progress">in_progress</option>
            <option value="blocked">blocked</option>
            <option value="done">done</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-[#334155]">
          <span className="font-medium">Owner</span>
          <select
            name="ownerUserId"
            value={ownerUserId}
            onChange={(event) => setOwnerUserId(event.target.value)}
            className="w-full rounded-xl border border-[#d7deea] bg-white px-3 py-2 outline-none focus:border-[#0B5FFF] focus:ring-2 focus:ring-[#b3ccff]"
          >
            {suggestedOwners.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block space-y-2 text-sm text-[#334155]">
        <span className="font-medium">Comments</span>
        <textarea
          name="comments"
          value={comments}
          onChange={(event) => setComments(event.target.value)}
          rows={4}
          className="w-full rounded-xl border border-[#d7deea] bg-white px-3 py-2 outline-none focus:border-[#0B5FFF] focus:ring-2 focus:ring-[#b3ccff]"
          placeholder="Containment, owner expectation, or verification note..."
        />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          This writes into the live `product_action` table for the active issue.
        </p>
        <button
          type="submit"
          disabled={isPending || !productId}
          className={`${buttonClassName()} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isPending ? "Creating..." : "Create action"}
        </button>
      </div>
      {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
    </form>
  );
}
