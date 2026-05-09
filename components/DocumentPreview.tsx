"use client";

import { useState, createContext, useContext } from "react";
import { Copy, Check, Printer } from "lucide-react";
import type { DocumentType, DocumentSlots } from "@/lib/document-templates";
import { PLACEHOLDER } from "@/lib/document-templates";
import {
  renderFormalNotice,
  renderFilingPrepPacket,
  type DocumentSection,
  type RenderedDocument,
} from "@/lib/document-renderer";

// Reverse map: "[Tenant name]" → "tenantName"
const PLACEHOLDER_TO_KEY = Object.fromEntries(
  Object.entries(PLACEHOLDER).map(([k, v]) => [v, k as keyof DocumentSlots])
);

// ── Edit context ──────────────────────────────────────────────────────────────

type EditCtx = {
  onSlotChange?: (key: keyof DocumentSlots, value: string) => void;
  editing: keyof DocumentSlots | null;
  setEditing: (key: keyof DocumentSlots | null) => void;
};

const EditContext = createContext<EditCtx>({
  onSlotChange: undefined,
  editing: null,
  setEditing: () => {},
});

// ── InlineEdit — replaces a [placeholder] span with a real input on click ────

function InlineEdit({ slotKey, display }: { slotKey: keyof DocumentSlots; display: string }) {
  const { onSlotChange, editing, setEditing } = useContext(EditContext);
  const [draft, setDraft] = useState("");
  const isEditing = editing === slotKey;

  function commit() {
    if (draft.trim()) onSlotChange?.(slotKey, draft.trim());
    setEditing(null);
  }

  if (isEditing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
          if (e.key === "Escape") setEditing(null);
        }}
        placeholder={display.replace(/^\[|\]$/g, "")}
        className="inline-block border-b-2 border-blue-500 bg-blue-50/60 text-gray-900 outline-none px-1 rounded-sm min-w-[10ch] max-w-[40ch] print:hidden"
        style={{ fontSize: "inherit", lineHeight: "inherit", fontFamily: "inherit" }}
        size={Math.max(12, display.length)}
      />
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => { setDraft(""); setEditing(slotKey); }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") { setDraft(""); setEditing(slotKey); }
      }}
      title="Click to fill"
      className="text-amber-600 font-semibold bg-amber-50 px-0.5 rounded-sm cursor-text hover:bg-amber-100 transition-colors print:bg-transparent print:text-black print:font-normal print:underline"
    >
      {display}
    </span>
  );
}

// ── Rich — renders text with clickable placeholders and linked URLs ────────────

function Rich({ text }: { text: string }) {
  const { onSlotChange } = useContext(EditContext);
  const parts = text.split(/(https?:\/\/[^\s]+|\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 underline break-all print:text-black"
            >
              {part}
            </a>
          );
        }
        if (part.startsWith("[") && part.endsWith("]")) {
          const slotKey = PLACEHOLDER_TO_KEY[part];
          if (slotKey && onSlotChange) {
            return <InlineEdit key={i} slotKey={slotKey} display={part} />;
          }
          return (
            <span
              key={i}
              className="text-amber-600 font-semibold bg-amber-50 px-0.5 rounded-sm print:bg-transparent print:text-black print:font-normal print:underline"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function TextBlock({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) =>
        line === "" ? (
          <div key={i} className="h-2" />
        ) : (
          <p key={i}>
            <Rich text={line} />
          </p>
        )
      )}
    </>
  );
}

// ── Section renderers ─────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-2 print:text-gray-600">
      {label}
    </p>
  );
}

function renderSection(section: DocumentSection, idx: number) {
  switch (section.type) {
    case "addresses": {
      const [sender, date, recipient] = section.content;
      return (
        <div key={section.id} className="mb-8">
          <div className="flex justify-between items-start mb-5">
            <div>
              {sender.split("\n").map((line, i) => (
                <p key={i}>
                  <Rich text={line} />
                </p>
              ))}
            </div>
            <div className="text-right shrink-0 ml-8">
              <Rich text={date} />
            </div>
          </div>
          <div>
            {recipient.split("\n").map((line, i) => (
              <p key={i}>
                <Rich text={line} />
              </p>
            ))}
          </div>
        </div>
      );
    }

    case "subject":
      return (
        <p key={section.id} className="font-bold mb-6">
          <span className="font-bold">Re: </span>
          <Rich text={section.content} />
        </p>
      );

    case "salutation":
      return (
        <p key={section.id} className="mb-5">
          <Rich text={section.content} />
        </p>
      );

    case "notice":
      return (
        <div
          key={section.id}
          className="border border-amber-300 bg-amber-50 rounded-lg px-4 py-3 mb-6 print:border-black print:bg-transparent"
        >
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-amber-700 mb-1 print:text-black">
            ⚠ Important Notice
          </p>
          <p className="font-sans text-sm text-amber-900 print:text-black">
            {section.content}
          </p>
        </div>
      );

    case "paragraph":
      return (
        <div key={section.id} className="mb-5">
          {section.label && <SectionLabel label={section.label} />}
          <TextBlock text={section.content} />
        </div>
      );

    case "info-rows":
      return (
        <div key={section.id} className="mb-5">
          {section.label && <SectionLabel label={section.label} />}
          <table className="w-full border-collapse">
            <tbody>
              {section.content.map(([label, value], i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="py-1.5 pr-4 text-gray-500 font-sans text-xs w-48 shrink-0 align-top">
                    {label}
                  </td>
                  <td className="py-1.5 align-top">
                    <Rich text={value} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "checklist":
      return (
        <div key={section.id} className="mb-5">
          {section.label && <SectionLabel label={section.label} />}
          <ul className="flex flex-col gap-1.5">
            {section.content.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-base leading-none shrink-0 text-gray-400 print:text-black">
                  ☐
                </span>
                <span>
                  <Rich text={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "steps":
      return (
        <div key={section.id} className="mb-5">
          {section.label && <SectionLabel label={section.label} />}
          <ol className="flex flex-col gap-2">
            {section.content.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 w-5 h-5 rounded-full bg-gray-200 text-gray-700 font-sans text-[10px] font-bold flex items-center justify-center mt-0.5 print:border print:border-black print:bg-transparent print:text-black">
                  {i + 1}
                </span>
                <span>
                  <Rich text={item} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      );

    case "closing":
      return (
        <div key={section.id} className="mt-7 mb-8">
          <TextBlock text={section.content} />
        </div>
      );

    case "signature":
      return (
        <div key={section.id}>
          {section.content.split("\n").map((line, i) => (
            <p key={i}>
              <Rich text={line} />
            </p>
          ))}
        </div>
      );

    default:
      return null;
  }
}

// ── Plain text export ─────────────────────────────────────────────────────────

function toPlainText(doc: RenderedDocument): string {
  const lines: string[] = [doc.title, doc.subtitle, ""];
  for (const section of doc.sections) {
    if (section.label) lines.push(section.label, "");
    switch (section.type) {
      case "addresses": {
        const [sender, date, recipient] = section.content;
        lines.push(sender, "", date, "", recipient);
        break;
      }
      case "info-rows":
        for (const [label, value] of section.content) {
          lines.push(`${label}: ${value}`);
        }
        break;
      case "checklist":
      case "steps":
        for (const item of section.content) {
          lines.push(`☐ ${item}`);
        }
        break;
      default:
        lines.push(section.content as string);
    }
    lines.push("");
  }
  return lines.join("\n");
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  slots: DocumentSlots;
  type: DocumentType;
  onSlotChange?: (key: keyof DocumentSlots, value: string) => void;
}

export function DocumentPreview({ slots, type, onSlotChange }: Props) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState<keyof DocumentSlots | null>(null);

  const doc =
    type === "formal_notice"
      ? renderFormalNotice(slots)
      : renderFilingPrepPacket(slots);

  const emptyCount = (Object.keys(slots) as Array<keyof DocumentSlots>).filter(
    (k) => slots[k] === ""
  ).length;

  async function copyText() {
    try {
      await navigator.clipboard.writeText(toPlainText(doc));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <EditContext.Provider value={{ onSlotChange, editing, setEditing }}>
      <div className="mb-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-3 print:hidden">
          <div className="flex items-center gap-2">
            {emptyCount > 0 && onSlotChange && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {emptyCount} field{emptyCount !== 1 ? "s" : ""} to fill
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyText}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Copied!" : "Copy text"}
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Document */}
        <div
          id="print-letter"
          className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {/* Letterhead strip */}
          <div className="border-b border-gray-200 bg-gray-50 px-10 py-4 text-center print:bg-white">
            <p className="font-sans text-[10px] font-bold tracking-[0.18em] uppercase text-gray-400 mb-0.5">
              {doc.subtitle}
            </p>
            <p className="text-sm font-bold tracking-widest uppercase text-gray-900">
              {doc.title}
            </p>
          </div>

          {/* Body */}
          <div
            className="px-10 py-8 text-gray-900"
            style={{ fontSize: "13px", lineHeight: "1.75" }}
          >
            {doc.sections.map((section, idx) => renderSection(section, idx))}
          </div>
        </div>

        {onSlotChange && (
          <p className="text-xs text-gray-400 mt-3 text-center print:hidden">
            Click any{" "}
            <span className="font-semibold text-amber-600 bg-amber-50 px-1 rounded">
              [bracketed field]
            </span>{" "}
            to fill it in directly.
          </p>
        )}
      </div>
    </EditContext.Provider>
  );
}
