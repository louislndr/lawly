"use client";

import * as React from "react";
import { Send } from "lucide-react";

type ClassValue = string | number | boolean | null | undefined;
function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}

export interface PromptBoxProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onMicClick?: () => void;
  isListening?: boolean;
}

export const PromptBox = React.forwardRef<HTMLTextAreaElement, PromptBoxProps>(
  ({ className, onChange, value: controlledValue, onMicClick, isListening, ...props }, ref) => {
    const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = React.useState(controlledValue ?? "");

    React.useImperativeHandle(ref, () => internalTextareaRef.current!, []);

    React.useLayoutEffect(() => {
      const textarea = internalTextareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        const newHeight = Math.min(textarea.scrollHeight, 200);
        textarea.style.height = `${newHeight}px`;
      }
    }, [value]);

    React.useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue);
      }
    }, [controlledValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      onChange?.(e);
    };

    const currentValue = controlledValue ?? value;
    const hasValue = String(currentValue).trim().length > 0;

    return (
      <div className={cn(
        "flex items-end gap-2 rounded-[28px] border bg-white p-2 shadow-sm transition-colors dark:bg-[#303030] dark:border-transparent",
        className
      )}>
        <textarea
          ref={internalTextareaRef}
          rows={1}
          value={currentValue}
          onChange={handleInputChange}
          placeholder={props.placeholder}
          className="custom-scrollbar flex-1 resize-none border-0 bg-transparent p-3 text-slate-950 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-300 focus:ring-0 focus-visible:outline-none min-h-12"
          {...props}
        />

        <button
          type="submit"
          disabled={!hasValue || props.disabled}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-black/80 disabled:bg-gray-400 dark:bg-white dark:text-black dark:hover:bg-white/80 dark:disabled:bg-gray-600"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </button>
      </div>
    );
  }
);

PromptBox.displayName = "PromptBox";