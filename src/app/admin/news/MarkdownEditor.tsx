"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Bold, Code2, Eye, ImageIcon, Italic, List, Quote, Table2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const MarkdownRenderer = dynamic(() => import("@/components/ui/MarkdownRenderer"), {
  ssr: false,
  loading: () => <div className="rounded-xl border border-gray-border bg-gray-bg p-6 text-sm text-gray-text">Đang tải preview...</div>,
});

type Mode = "write" | "preview";

export function MarkdownEditor({
  value,
  onChange,
  draftKey,
}: {
  value: string;
  onChange: (value: string) => void;
  draftKey: string;
}) {
  const [mode, setMode] = useState<Mode>("write");

  useEffect(() => {
    const draft = window.localStorage.getItem(draftKey);
    if (draft && !value) onChange(draft);
  }, [draftKey, onChange, value]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.localStorage.setItem(draftKey, value);
    }, 600);
    return () => window.clearTimeout(timer);
  }, [draftKey, value]);

  const tools = useMemo(
    () => [
      { label: "Đậm", icon: Bold, insert: "**văn bản**" },
      { label: "Nghiêng", icon: Italic, insert: "*văn bản*" },
      { label: "Trích dẫn", icon: Quote, insert: "\n> Nội dung trích dẫn\n" },
      { label: "Danh sách", icon: List, insert: "\n- Ý chính\n- Ý phụ\n" },
      { label: "Code", icon: Code2, insert: "\n```txt\nNội dung code\n```\n" },
      { label: "Bảng", icon: Table2, insert: "\n| Cột 1 | Cột 2 |\n| --- | --- |\n| Nội dung | Nội dung |\n" },
    ],
    []
  );

  function appendMarkdown(markdown: string) {
    onChange(value ? `${value}\n${markdown}` : markdown.trimStart());
  }

  function insertImage() {
    const path = window.prompt("Nhập đường dẫn ảnh trong storage hoặc URL ảnh");
    if (path) appendMarkdown(`\n![Mô tả ảnh](${path})\n`);
  }

  return (
    <div className="rounded-2xl border border-gray-border bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-border p-3">
        <div className="flex flex-wrap items-center gap-1">
          {tools.map((tool) => (
            <button
              key={tool.label}
              type="button"
              onClick={() => appendMarkdown(tool.insert)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-text transition-colors hover:bg-gray-bg hover:text-navy"
              title={tool.label}
            >
              <tool.icon size={16} />
            </button>
          ))}
          <button
            type="button"
            onClick={insertImage}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-text transition-colors hover:bg-gray-bg hover:text-navy"
            title="Chèn ảnh"
          >
            <ImageIcon size={16} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setMode(mode === "write" ? "preview" : "write")}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-border px-3 py-1.5 text-sm font-semibold text-navy hover:bg-gray-bg"
        >
          <Eye size={15} />
          {mode === "write" ? "Preview" : "Soạn thảo"}
        </button>
      </div>

      {mode === "write" ? (
        <Textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={18}
          className="min-h-[420px] rounded-none border-0 font-mono text-sm focus-visible:ring-0"
          placeholder="Viết nội dung Markdown..."
        />
      ) : (
        <div className="min-h-[420px] p-6">
          {value ? <MarkdownRenderer content={value} /> : <p className="text-sm text-gray-muted">Chưa có nội dung để preview.</p>}
        </div>
      )}
    </div>
  );
}
