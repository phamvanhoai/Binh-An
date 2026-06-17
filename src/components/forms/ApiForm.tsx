"use client";

import { useState } from "react";
import { Send } from "lucide-react";

type Field =
  | { name: string; label: string; type?: "text" | "date" | "datetime-local" | "url"; placeholder?: string; required?: boolean }
  | { name: string; label: string; type: "textarea"; placeholder?: string; required?: boolean }
  | { name: string; label: string; type: "select"; options: { label: string; value: string }[]; required?: boolean };

type ApiFormProps = {
  endpoint: string;
  fields: Field[];
  submitLabel: string;
};

export function ApiForm({ endpoint, fields, submitLabel }: ApiFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    const payload = Object.fromEntries(
      Array.from(formData.entries()).filter(([, value]) => String(value).trim() !== "")
    );

    if (payload.open_at) {
      payload.open_at = new Date(String(payload.open_at)).toISOString();
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = (await response.json()) as { success: boolean; error?: string };
    setLoading(false);
    setMessage(json.success ? "Da luu thanh cong." : json.error || "Co loi xay ra.");
  }

  return (
    <form action={onSubmit} className="soft-panel grid gap-4 rounded-lg p-5">
      {fields.map((field) => (
        <label key={field.name} className="grid gap-2 text-sm font-semibold text-slate-700">
          {field.label}
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              required={field.required}
              placeholder={field.placeholder}
              className="min-h-32 rounded border border-slate-300 bg-white px-3 py-2 font-normal outline-none transition focus:border-night"
            />
          ) : field.type === "select" ? (
            <select
              name={field.name}
              required={field.required}
              className="rounded border border-slate-300 bg-white px-3 py-2 font-normal outline-none transition focus:border-night"
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={field.name}
              type={field.type || "text"}
              required={field.required}
              placeholder={field.placeholder}
              className="rounded border border-slate-300 bg-white px-3 py-2 font-normal outline-none transition focus:border-night"
            />
          )}
        </label>
      ))}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded bg-night px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={17} aria-hidden="true" />
        {loading ? "Dang luu..." : submitLabel}
      </button>
      {message ? <p className="text-sm font-medium text-slate-600">{message}</p> : null}
    </form>
  );
}
