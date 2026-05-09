"use client";

import { useState, useCallback, createContext, useContext, useId, type CSSProperties } from "react";
import { Copy, Check, Mail, Printer } from "lucide-react";
import type { DocumentType, DocumentSlots } from "@/lib/document-templates";
import { PLACEHOLDER } from "@/lib/document-templates";
import {
  renderFormalNotice,
  renderFilingPrepPacket,
  type DocumentSection,
  type RenderedDocument,
} from "@/lib/document-renderer";

// ── Edit context ──────────────────────────────────────────────────────────────
// All editing state lives here (in DocumentPreview), not inside cells.

type EditCtx = {
  slots: DocumentSlots;
  onSlotChange?: (key: keyof DocumentSlots, value: string) => void;
  editing: { key: keyof DocumentSlots; id: string } | null;
  draft: string;
  openCell: (key: keyof DocumentSlots, id: string) => void;
  setDraft: (v: string) => void;
  commitCell: () => void;
  cancelCell: () => void;
};

const EditContext = createContext<EditCtx>({
  slots: {} as DocumentSlots,
  onSlotChange: undefined,
  editing: null,
  draft: "",
  openCell: () => {},
  setDraft: () => {},
  commitCell: () => {},
  cancelCell: () => {},
});

// ── Shared styles ─────────────────────────────────────────────────────────────

const PLACEHOLDER_SPAN =
  "cursor-text rounded-sm border-b border-amber-300 bg-amber-50/60 px-0.5 font-medium text-amber-800 " +
  "hover:bg-amber-100/70 transition-colors print:bg-transparent print:text-black " +
  "print:font-normal print:underline";

const FILLED_SPAN =
  "cursor-text border-b border-dashed border-slate-300 hover:border-[#172b5f] " +
  "hover:text-[#172b5f] transition-colors print:border-0";

const INPUT_STYLE: CSSProperties = { fontSize: "inherit", fontFamily: "inherit" };
const INPUT_CLASS =
  "border-b border-amber-300 bg-amber-50/50 text-gray-900 outline-none " +
  "px-1 rounded-sm print:hidden";

// ── EditableCell — stateless; all state lives in context ──────────────────────

function EditableCell({ slotKey }: { slotKey: keyof DocumentSlots }) {
  const { slots, editing, draft, openCell, setDraft, commitCell, cancelCell } =
    useContext(EditContext);
  const editId = `row-${slotKey}`;
  const currentValue = slots[slotKey] || "";
  const isEditing = editing?.key === slotKey && editing.id === editId;

  if (isEditing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitCell}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commitCell(); }
          if (e.key === "Escape") { e.preventDefault(); cancelCell(); }
        }}
        placeholder={PLACEHOLDER[slotKey].replace(/^\[|\]$/g, "")}
        className={`${INPUT_CLASS} min-w-[14ch] max-w-[44ch] block w-full`}
        style={INPUT_STYLE}
      />
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => openCell(slotKey, editId)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openCell(slotKey, editId);
        }
      }}
      title={currentValue ? "Click to edit" : "Click to fill"}
      className={currentValue ? FILLED_SPAN : PLACEHOLDER_SPAN}
    >
      {currentValue || PLACEHOLDER[slotKey]}
    </span>
  );
}

// ── Reverse map: "[Tenant name]" → "tenantName" ───────────────────────────────

const PLACEHOLDER_TO_KEY = Object.fromEntries(
  Object.entries(PLACEHOLDER).map(([k, v]) => [v, k as keyof DocumentSlots])
);

// ── InlineEdit — for [placeholder] tokens inside paragraph text ───────────────

function InlineEdit({ slotKey, display }: { slotKey: keyof DocumentSlots; display: string }) {
  const { slots, editing, draft, openCell, setDraft, commitCell, cancelCell } =
    useContext(EditContext);
  const editId = useId();
  const currentValue = slots[slotKey] || "";
  const isEditing = editing?.key === slotKey && editing.id === editId;

  if (isEditing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commitCell}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commitCell(); }
          if (e.key === "Escape") { e.preventDefault(); cancelCell(); }
        }}
        placeholder={display.replace(/^\[|\]$/g, "")}
        className={`${INPUT_CLASS} inline-block min-w-[10ch] max-w-[40ch]`}
        style={{ ...INPUT_STYLE, lineHeight: "inherit" }}
        size={Math.max(12, display.length)}
      />
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => openCell(slotKey, editId)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openCell(slotKey, editId);
        }
      }}
      title="Click to fill"
      className={currentValue ? FILLED_SPAN : PLACEHOLDER_SPAN}
    >
      {currentValue || display}
    </span>
  );
}

// ── Rich — splits text into URLs, [placeholders], and plain text ──────────────

function Rich({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+|\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) => {
        if (/^https?:\/\//.test(part)) {
          return (
            <a key={i} href={part} target="_blank" rel="noopener noreferrer"
              className="text-blue-700 underline break-all print:text-black">
              {part}
            </a>
          );
        }
        if (part.startsWith("[") && part.endsWith("]")) {
          const slotKey = PLACEHOLDER_TO_KEY[part];
          if (slotKey) {
            return <InlineEdit key={i} slotKey={slotKey} display={part} />;
          }
          return (
            <span key={i} className={PLACEHOLDER_SPAN}>{part}</span>
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
        line === "" ? <div key={i} className="h-2" /> : <p key={i}><Rich text={line} /></p>
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

function renderSection(section: DocumentSection) {
  switch (section.type) {
    case "addresses": {
      const [sender, date, recipient] = section.content;
      return (
        <div key={section.id} className="mb-8">
          <div className="flex justify-between items-start mb-5">
            <div>{sender.split("\n").map((l, i) => <p key={i}><Rich text={l} /></p>)}</div>
            <div className="text-right shrink-0 ml-8"><Rich text={date} /></div>
          </div>
          <div>{recipient.split("\n").map((l, i) => <p key={i}><Rich text={l} /></p>)}</div>
        </div>
      );
    }
    case "subject":
      return (
        <p key={section.id} className="font-bold mb-6">
          <span className="font-bold">Re: </span><Rich text={section.content} />
        </p>
      );
    case "salutation":
      return <p key={section.id} className="mb-5"><Rich text={section.content} /></p>;
    case "notice":
      return (
        <div key={section.id} className="border border-slate-200 bg-slate-50 rounded-lg px-4 py-3 mb-6 print:border-black print:bg-transparent">
          <p className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 print:text-black">Important Notice</p>
          <p className="font-sans text-sm text-slate-700 print:text-black">{section.content}</p>
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
              {section.content.map(([label, value, slotKey], i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="py-1.5 pr-4 text-gray-500 font-sans text-xs w-48 shrink-0 align-top">{label}</td>
                  <td className="py-1.5 align-top">
                    {slotKey ? <EditableCell slotKey={slotKey} /> : <Rich text={value} />}
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
                <span className="mt-0.5 text-base leading-none shrink-0 text-gray-400 print:text-black">☐</span>
                <span><Rich text={item} /></span>
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
                <span><Rich text={item} /></span>
              </li>
            ))}
          </ol>
        </div>
      );
    case "closing":
      return <div key={section.id} className="mt-7 mb-8"><TextBlock text={section.content} /></div>;
    case "signature":
      return (
        <div key={section.id}>
          {section.content.split("\n").map((l, i) => <p key={i}><Rich text={l} /></p>)}
        </div>
      );
    default:
      return null;
  }
}

// ── Plain text export ─────────────────────────────────────────────────────────

function fillPlaceholders(text: string, slots: DocumentSlots): string {
  let output = text;
  for (const [key, placeholder] of Object.entries(PLACEHOLDER) as Array<[keyof DocumentSlots, string]>) {
    output = output.replaceAll(placeholder, slots[key] || placeholder);
  }
  return output;
}

function toPlainText(doc: RenderedDocument, slots: DocumentSlots): string {
  const lines: string[] = [doc.title, doc.subtitle, ""];
  for (const section of doc.sections) {
    if (section.label) lines.push(section.label, "");
    switch (section.type) {
      case "addresses": {
        const [sender, date, recipient] = section.content;
        lines.push(
          fillPlaceholders(sender, slots),
          "",
          fillPlaceholders(date, slots),
          "",
          fillPlaceholders(recipient, slots)
        );
        break;
      }
      case "info-rows":
        for (const [label, value] of section.content) {
          lines.push(`${label}: ${fillPlaceholders(value, slots)}`);
        }
        break;
      case "checklist":
      case "steps":
        for (const item of section.content) lines.push(`☐ ${fillPlaceholders(item, slots)}`);
        break;
      default:
        lines.push(fillPlaceholders(section.content as string, slots));
    }
    lines.push("");
  }
  return lines.join("\n");
}

// ── Count empty slots that appear as editable cells in this document ──────────

function countEmptySlots(doc: RenderedDocument, slots: DocumentSlots): number {
  const seen = new Set<keyof DocumentSlots>();
  for (const section of doc.sections) {
    if (section.type === "info-rows") {
      for (const [, , slotKey] of section.content) {
        if (slotKey) seen.add(slotKey);
      }
    }
  }
  return [...seen].filter((k) => !slots[k]).length;
}

// ── Main component ────────────────────────────────────────────────────────────

interface Props {
  slots: DocumentSlots;
  type: DocumentType;
  onSlotChange?: (key: keyof DocumentSlots, value: string) => void;
}

export function DocumentPreview({ slots, type, onSlotChange }: Props) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState<{ key: keyof DocumentSlots; id: string } | null>(null);
  const [draft, setDraft] = useState("");

  const doc = type === "formal_notice" ? renderFormalNotice(slots) : renderFilingPrepPacket(slots);
  const emptyCount = onSlotChange ? countEmptySlots(doc, slots) : 0;

  const openCell = useCallback((key: keyof DocumentSlots, id: string) => {
    setEditing({ key, id });
    setDraft(slots[key] || "");
  }, [slots]);

  const commitCell = useCallback(() => {
    if (editing) {
      const val = draft.trim();
      const prev = slots[editing.key] || "";
      if (val !== prev) onSlotChange?.(editing.key, val);
    }
    setEditing(null);
    setDraft("");
  }, [editing, draft, slots, onSlotChange]);

  const cancelCell = useCallback(() => {
    setEditing(null);
    setDraft("");
  }, []);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(toPlainText(doc, slots));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function emailFormalNotice() {
    const subject = slots.unitAddress
      ? `Formal notice - ${slots.unitAddress}`
      : "Formal notice";
    const body = toPlainText(doc, slots);
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const ctx: EditCtx = {
    slots,
    onSlotChange,
    editing,
    draft,
    openCell,
    setDraft,
    commitCell,
    cancelCell,
  };

  return (
    <EditContext.Provider value={ctx}>
      <div>
        {/* Toolbar */}
        <div className="flex flex-col gap-3 mb-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
          <div>
            {emptyCount > 0 && onSlotChange && (
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                {emptyCount} field{emptyCount !== 1 ? "s" : ""} to fill
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {type === "formal_notice" && (
              <button onClick={emailFormalNotice}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
                <Mail className="w-4 h-4" />
                Email landlord
              </button>
            )}
            <button onClick={copyText}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy text"}
            </button>
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900">
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Document */}
        <div className="rounded-xl bg-slate-100/80 p-3">
          <div id="print-letter"
            className="mx-auto max-h-[680px] overflow-auto rounded-sm border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            <div className="border-b border-slate-200 bg-white px-8 py-4 text-center print:bg-white">
              <p className="font-sans text-[9px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-0.5">{doc.subtitle}</p>
              <p className="text-xs font-bold tracking-widest uppercase text-slate-900">{doc.title}</p>
            </div>
            <div className="px-8 py-7 text-slate-900" style={{ fontSize: "11.5px", lineHeight: "1.7" }}>
              {doc.sections.map((section) => renderSection(section))}
            </div>
          </div>
        </div>

        {onSlotChange && (
          <p className="text-xs text-gray-400 mt-3 text-center print:hidden">
            Click any{" "}
            <span className="rounded border-b border-amber-300 bg-amber-50 px-1 font-medium text-amber-800">[bracketed field]</span>
            {" "}to fill it in, or any filled value to edit it.
          </p>
        )}
      </div>
    </EditContext.Provider>
  );
}
