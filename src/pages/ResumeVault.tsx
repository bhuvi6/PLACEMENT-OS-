import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Download,
  Trash2,
  Pencil,
  Eye,
  Check,
  X,
} from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import { useResumes } from "@/store/useResumes";
import { useToast } from "@/components/ui/toast";
import type { ResumeCategory } from "@/types";
import { RESUME_CATEGORIES } from "@/types";
import { cn, formatBytes } from "@/lib/utils";

const CATEGORY_COLORS: Record<ResumeCategory, "red" | "yellow" | "blue" | "green" | "default"> = {
  SDE: "red",
  AI: "yellow",
  GenAI: "blue",
  Frontend: "green",
  Backend: "default",
  ML: "yellow",
};

export default function ResumeVault() {
  const { resumes, addResume, renameResume, recategorize, deleteResume } = useResumes();
  const { push } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [dragActive, setDragActive] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState<ResumeCategory>("SDE");

  const filtered =
    categoryFilter === "All" ? resumes : resumes.filter((r) => r.category === categoryFilter);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (file.type !== "application/pdf") {
        push(`${file.name} is not a PDF. Only PDF files are supported.`, "error");
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        push(`${file.name} exceeds the 8MB limit.`, "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        addResume({
          name: file.name.replace(/\.pdf$/i, ""),
          fileName: file.name,
          category: uploadCategory,
          dataUrl: reader.result as string,
          sizeBytes: file.size,
        });
        push(`${file.name} uploaded.`);
      };
      reader.onerror = () => push(`Failed to read ${file.name}.`, "error");
      reader.readAsDataURL(file);
    });
  };

  const startRename = (id: string, current: string) => {
    setRenamingId(id);
    setRenameValue(current);
  };
  const commitRename = (id: string) => {
    if (renameValue.trim()) {
      renameResume(id, renameValue.trim());
      push("Resume renamed.");
    }
    setRenamingId(null);
  };

  const handleDownload = (id: string) => {
    const r = resumes.find((x) => x.id === id);
    if (!r) return;
    const a = document.createElement("a");
    a.href = r.dataUrl;
    a.download = r.fileName || `${r.name}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDelete = (id: string) => {
    deleteResume(id);
    setConfirmDeleteId(null);
    push("Resume deleted.");
  };

  const previewResume = resumes.find((r) => r.id === previewId);

  return (
    <div>
      <Topbar title="Resume Vault" subtitle="Every version, categorized and ready to deploy." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value as ResumeCategory)} className="w-40">
          {RESUME_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <span className="text-xs text-[var(--color-text-faint)]">Category applied to next upload</span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "carbon flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border-hi)] px-6 py-10 text-center transition-colors",
          dragActive && "border-[var(--color-red)] bg-red-950/10"
        )}
      >
        <UploadCloud className="h-8 w-8 text-[var(--color-red-glow)]" />
        <p className="text-sm font-semibold text-white">Drop PDF resumes here or click to browse</p>
        <p className="text-xs text-[var(--color-text-faint)]">PDF only, up to 8MB per file</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <FilterChip label="All" active={categoryFilter === "All"} onClick={() => setCategoryFilter("All")} />
        {RESUME_CATEGORIES.map((c) => (
          <FilterChip key={c} label={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)} />
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filtered.map((r) => (
            <motion.div
              key={r.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="flex h-full flex-col p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-900/40 bg-red-950/20 text-[var(--color-red-glow)]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    {renamingId === r.id ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && commitRename(r.id)}
                          autoFocus
                          className="h-8 text-sm"
                        />
                        <button onClick={() => commitRename(r.id)} className="rounded p-1 text-emerald-400 hover:bg-emerald-950/40">
                          <Check className="h-4 w-4" />
                        </button>
                        <button onClick={() => setRenamingId(null)} className="rounded p-1 text-red-400 hover:bg-red-950/40">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="truncate text-sm font-semibold text-white">{r.name}</p>
                    )}
                    <p className="truncate text-xs text-[var(--color-text-faint)]">
                      {formatBytes(r.sizeBytes)} • {new Date(r.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <Select
                    value={r.category}
                    onChange={(e) => recategorize(r.id, e.target.value as ResumeCategory)}
                    className="h-8 w-28 text-xs"
                  >
                    {RESUME_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                  <Badge variant={CATEGORY_COLORS[r.category]}>{r.category}</Badge>
                </div>

                <div className="mt-3 flex gap-1.5 border-t border-[var(--color-border)] pt-3">
                  <Button variant="ghost" size="sm" onClick={() => setPreviewId(r.id)} className="flex-1">
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => startRename(r.id, r.name)} aria-label="Rename">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(r.id)} aria-label="Download">
                    <Download className="h-4 w-4" />
                  </Button>
                  {confirmDeleteId === r.id ? (
                    <div className="flex items-center gap-1">
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)}>
                        Confirm
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={() => setConfirmDeleteId(r.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardContent className="py-10 text-center text-sm text-[var(--color-text-faint)]">
              No resumes in this category yet.
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog
        open={Boolean(previewResume)}
        onClose={() => setPreviewId(null)}
        title={previewResume?.name ?? "Preview"}
        className="max-w-3xl"
      >
        {previewResume && (
          <iframe
            src={previewResume.dataUrl}
            title={previewResume.name}
            className="h-[70vh] w-full rounded-md border border-[var(--color-border)] bg-white"
          />
        )}
      </Dialog>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
        active
          ? "border-[var(--color-red)] bg-[var(--color-red)] text-white"
          : "border-[var(--color-border)] bg-[var(--color-surface-2)] text-[var(--color-text-dim)] hover:border-[var(--color-border-hi)]"
      )}
    >
      {label}
    </button>
  );
}
