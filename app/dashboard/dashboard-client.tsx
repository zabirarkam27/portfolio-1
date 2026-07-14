"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  BriefcaseBusiness,
  Contact,
  Inbox,
  ExternalLink,
  FileText,
  GraduationCap,
  GripVertical,
  ImageIcon,
  KeyRound,
  Layers3,
  LinkIcon,
  LogOut,
  Plus,
  Save,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { uploadAsset } from "@/lib/blob-client";
import type { HomeContent } from "@/lib/content-types";
import type { ContactMessage } from "@/generated/prisma/client";
import type { UploadKind } from "@/lib/upload-assets";
import { zodFormResolver } from "@/lib/zod-form-resolver";

type SectionKey =
  | "profile"
  | "about"
  | "socials"
  | "skills"
  | "education"
  | "experience"
  | "projects"
  | "inbox"
  | "contact"
  | "security";

type Row = Record<string, unknown> & { id?: string; order?: number };

const sections: Array<{ key: SectionKey; label: string; icon: React.ElementType }> = [
  { key: "profile", label: "Profile", icon: UserRound },
  { key: "about", label: "About", icon: FileText },
  { key: "socials", label: "Social links", icon: LinkIcon },
  { key: "skills", label: "Skills", icon: Layers3 },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "experience", label: "Experience", icon: BriefcaseBusiness },
  { key: "projects", label: "Projects", icon: ImageIcon },
  { key: "inbox", label: "Inbox", icon: Inbox },
  { key: "contact", label: "Contact", icon: Contact },
  { key: "security", label: "Security", icon: KeyRound },
];

export function DashboardClient({
  adminEmail,
  initialContent,
}: {
  adminEmail: string;
  initialContent: HomeContent;
}) {
  const router = useRouter();
  const [active, setActive] = useState<SectionKey>("profile");
  const [content, setContent] = useState(initialContent);
  const [savedContent, setSavedContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const isDirty = useMemo(
    () => JSON.stringify(content) !== JSON.stringify(savedContent),
    [content, savedContent],
  );

  useEffect(() => {
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, [isDirty]);

  async function saveContent(nextContent = content) {
    const response = await fetch("/api/dashboard/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextContent),
    });

    if (!response.ok) {
      const data = (await response.json()) as {
        error?: string;
        details?: Array<{ path: string; message: string }>;
      };
      const firstIssue = data.details?.[0];
      toast.error(
        firstIssue
          ? `${firstIssue.path || "Content"}: ${firstIssue.message}`
          : (data.error ?? "Save failed"),
      );
      return;
    }

    const saved = (await response.json()) as HomeContent & { admin?: { email: string } };
    delete saved.admin;
    setContent(saved);
    setSavedContent(saved);
    toast.success("Saved");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-card/70 p-4 backdrop-blur lg:block">
        <div className="mb-6 px-2">
          <div className="font-display text-xl font-semibold">Portfolio Admin</div>
          <div className="mt-1 truncate text-xs text-muted-foreground">{adminEmail}</div>
        </div>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActive(section.key)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                active === section.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <section.icon className="h-4 w-4" />
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold">
                {sections.find((section) => section.key === active)?.label}
              </h1>
              <p className="text-sm text-muted-foreground">
                Edit live portfolio content from NeonDB.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <a href="/" target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Preview live site
                </a>
              </Button>
              <Button
                onClick={() => startTransition(() => void saveContent())}
                disabled={isPending}
              >
                <Save className="h-4 w-4" />
                {isPending ? "Saving..." : isDirty ? "Save all" : "Saved"}
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {sections.map((section) => (
              <Button
                key={section.key}
                size="sm"
                variant={active === section.key ? "default" : "outline"}
                onClick={() => setActive(section.key)}
              >
                {section.label}
              </Button>
            ))}
          </div>
        </header>

        <div className="mx-auto max-w-6xl p-4 sm:p-6">
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <StatCard label="Projects" value={content.projects.length} />
            <StatCard label="Skills" value={content.skillRows.length} />
            <StatCard label="Experience" value={content.experience.length} />
          </div>
          {active === "profile" && <ProfilePanel content={content} setContent={setContent} />}
          {active === "about" && <AboutPanel content={content} setContent={setContent} />}
          {active === "socials" && (
            <CollectionPanel
              title="Social links"
              rows={content.socialLinks}
              setRows={(rows) =>
                setContent({ ...content, socialLinks: rows as HomeContent["socialLinks"] })
              }
              fields={[
                ["platform", "Platform"],
                ["url", "URL"],
                ["order", "Order"],
              ]}
            />
          )}
          {active === "skills" && (
            <CollectionPanel
              title="Skills"
              rows={content.skillRows}
              setRows={(rows) =>
                setContent({ ...content, skillRows: rows as HomeContent["skillRows"] })
              }
              fields={[
                ["name", "Name"],
                ["category", "Category"],
                ["proficiency", "Proficiency"],
                ["tag", "Group subtitle"],
                ["icon", "Icon"],
                ["order", "Order"],
              ]}
            />
          )}
          {active === "education" && (
            <CollectionPanel
              title="Education"
              rows={content.education}
              setRows={(rows) =>
                setContent({ ...content, education: rows as HomeContent["education"] })
              }
              fields={[
                ["year", "Year"],
                ["school", "School"],
                ["degree", "Degree"],
                ["note", "Note"],
                ["icon", "Icon"],
                ["order", "Order"],
              ]}
            />
          )}
          {active === "experience" && <ExperiencePanel content={content} setContent={setContent} />}
          {active === "projects" && <ProjectPanel content={content} setContent={setContent} />}
          {active === "inbox" && <InboxPanel />}
          {active === "contact" && <ContactPanel content={content} setContent={setContent} />}
          {active === "security" && <SecurityPanel adminEmail={adminEmail} />}
        </div>
      </main>
    </div>
  );
}

function InboxPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/dashboard/messages");
    setLoading(false);

    if (!response.ok) {
      toast.error("Inbox could not be loaded");
      return;
    }

    const data = (await response.json()) as { messages: ContactMessage[] };
    setMessages(data.messages);

    if (!selected && data.messages[0]) {
      setSelected(data.messages[0]);
      setReplySubject(`Re: ${data.messages[0].subject}`);
    }
  }, [selected]);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  async function markStatus(message: ContactMessage, status: ContactMessage["status"]) {
    const response = await fetch(`/api/dashboard/messages/${message.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      toast.error("Status update failed");
      return;
    }

    const data = (await response.json()) as { message: ContactMessage };
    setMessages((items) =>
      items.map((item) => (item.id === data.message.id ? data.message : item)),
    );
    setSelected(data.message);
  }

  async function sendReply() {
    if (!selected) return;

    setSending(true);
    const response = await fetch(`/api/dashboard/messages/${selected.id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: replySubject || `Re: ${selected.subject}`,
        body: replyBody,
      }),
    });
    setSending(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      toast.error(data.error ?? "Reply failed");
      return;
    }

    toast.success("Reply sent");
    setReplyBody("");
    await loadMessages();
  }

  return (
    <CardShell title="Inbox">
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="rounded-lg border border-border">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading inbox...</div>
          ) : messages.length ? (
            messages.map((message) => (
              <button
                key={message.id}
                className={`block w-full border-b border-border p-4 text-left transition-colors last:border-b-0 ${
                  selected?.id === message.id ? "bg-muted" : "hover:bg-muted/60"
                }`}
                onClick={() => {
                  setSelected(message);
                  setReplySubject(`Re: ${message.subject}`);
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate text-sm font-semibold">{message.name}</div>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                    {message.status}
                  </span>
                </div>
                <div className="mt-1 truncate text-xs text-muted-foreground">{message.subject}</div>
                <div className="mt-2 truncate text-xs text-muted-foreground">{message.email}</div>
              </button>
            ))
          ) : (
            <div className="p-4 text-sm text-muted-foreground">No messages yet.</div>
          )}
        </div>

        {selected ? (
          <div className="space-y-4 rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-semibold">{selected.subject}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selected.name} · {selected.email}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Source: {selected.source}
                  {selected.inboundTo ? ` · To: ${selected.inboundTo}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void markStatus(selected, "read")}
                >
                  Mark read
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void markStatus(selected, "archived")}
                >
                  Archive
                </Button>
              </div>
            </div>

            <div className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm leading-relaxed">
              {selected.message}
            </div>

            <div className="grid gap-3">
              <TextInput
                label="Reply subject"
                value={replySubject}
                onChange={(value) => setReplySubject(value)}
              />
              <TextAreaInput
                label="Reply"
                rows={8}
                value={replyBody}
                onChange={(value) => setReplyBody(value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button disabled={sending || !replyBody.trim()} onClick={sendReply}>
                  {sending ? "Sending..." : "Send reply"}
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href={`mailto:${selected.email}?subject=${encodeURIComponent(
                      replySubject || `Re: ${selected.subject}`,
                    )}&body=${encodeURIComponent(replyBody)}`}
                  >
                    Open mail app
                  </a>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Select a message to read and reply.
          </div>
        )}
      </div>
    </CardShell>
  );
}

function CardShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h2 className="mb-4 font-display text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}

function ProfilePanel({
  content,
  setContent,
}: {
  content: HomeContent;
  setContent: (content: HomeContent) => void;
}) {
  const profile = content.profile;
  const statsText = profile.stats.map((stat) => `${stat.key}: ${stat.value}`).join("\n");

  function update(key: keyof typeof profile, value: unknown) {
    setContent({ ...content, profile: { ...profile, [key]: value } });
  }

  return (
    <CardShell title="Profile & hero">
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Name" value={profile.name} onChange={(value) => update("name", value)} />
        <TextInput
          label="Designation"
          value={profile.designation}
          onChange={(value) => update("designation", value)}
        />
        <TextInput
          label="Headline"
          value={profile.headline}
          onChange={(value) => update("headline", value)}
        />
        <TextInput
          label="Availability"
          value={profile.availability}
          onChange={(value) => update("availability", value)}
        />
        <TextInput
          label="Location"
          value={profile.location}
          onChange={(value) => update("location", value)}
        />
        <TextInput
          label="Current company"
          value={profile.currentCompany}
          onChange={(value) => update("currentCompany", value)}
        />
        <TextInput
          label="Photo URL"
          value={profile.photoUrl}
          onChange={(value) => update("photoUrl", value)}
        />
        <TextInput
          label="Resume URL"
          value={profile.resumeUrl}
          onChange={(value) => update("resumeUrl", value)}
        />
        <TextInput
          label="Footer tagline"
          value={profile.footerTagline}
          onChange={(value) => update("footerTagline", value)}
        />
        <TextAreaInput
          label="Tagline"
          value={profile.tagline}
          onChange={(value) => update("tagline", value)}
        />
        <TextAreaInput
          label="Stats, one per line as key: value"
          value={statsText}
          onChange={(value) =>
            update(
              "stats",
              value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                  const [key, ...rest] = line.split(":");
                  return { key: key.trim(), value: rest.join(":").trim() };
                }),
            )
          }
        />
        <div className="space-y-4">
          <UploadControl
            accept="image/jpeg,image/png,image/webp"
            kind="profile-photo"
            label="Upload profile photo"
            previewUrl={profile.photoUrl}
            onUploaded={(url) => update("photoUrl", url)}
          />
          <UploadControl
            accept="application/pdf"
            kind="resume"
            label="Upload resume PDF"
            onUploaded={(url) => update("resumeUrl", url)}
          />
        </div>
      </div>
    </CardShell>
  );
}

function AboutPanel({
  content,
  setContent,
}: {
  content: HomeContent;
  setContent: (content: HomeContent) => void;
}) {
  const about = content.aboutMe;
  const factsText = about.facts.map((fact) => `${fact.key}: ${fact.value}`).join("\n");

  function update(key: keyof typeof about, value: unknown) {
    setContent({ ...content, aboutMe: { ...about, [key]: value } });
  }

  return (
    <CardShell title="About me">
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="Image URL"
          value={about.imageUrl}
          onChange={(value) => update("imageUrl", value)}
        />
        <TextInput label="Since" value={about.since} onChange={(value) => update("since", value)} />
        <TextAreaInput
          className="md:col-span-2"
          label="Content paragraphs"
          rows={8}
          value={about.content}
          onChange={(value) => update("content", value)}
        />
        <TextAreaInput
          label="Facts, one per line as key: value"
          value={factsText}
          onChange={(value) =>
            update(
              "facts",
              value
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                  const [key, ...rest] = line.split(":");
                  return { key: key.trim(), value: rest.join(":").trim() };
                }),
            )
          }
        />
        <UploadControl
          accept="image/jpeg,image/png,image/webp"
          kind="profile-photo"
          label="Upload about image"
          previewUrl={about.imageUrl}
          onUploaded={(url) => update("imageUrl", url)}
        />
      </div>
    </CardShell>
  );
}

function ContactPanel({
  content,
  setContent,
}: {
  content: HomeContent;
  setContent: (content: HomeContent) => void;
}) {
  const contact = content.contactInfo;
  return (
    <CardShell title="Contact info">
      <div className="grid gap-4 md:grid-cols-3">
        <TextInput
          label="Email"
          value={contact.email}
          onChange={(value) =>
            setContent({ ...content, contactInfo: { ...contact, email: value } })
          }
        />
        <TextInput
          label="Phone"
          value={contact.phone}
          onChange={(value) =>
            setContent({ ...content, contactInfo: { ...contact, phone: value } })
          }
        />
        <TextInput
          label="WhatsApp URL"
          value={contact.whatsapp}
          onChange={(value) =>
            setContent({ ...content, contactInfo: { ...contact, whatsapp: value } })
          }
        />
      </div>
    </CardShell>
  );
}

function CollectionPanel({
  title,
  rows,
  setRows,
  fields,
}: {
  title: string;
  rows: Row[];
  setRows: (rows: Row[]) => void;
  fields: Array<[string, string]>;
}) {
  const [editing, setEditing] = useState<Row | null>(null);
  const [query, setQuery] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const ordered = useMemo(
    () => [...rows].sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0)),
    [rows],
  );
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) return ordered;

    return ordered.filter((row) =>
      fields.some(([key]) =>
        String(row[key] ?? "")
          .toLowerCase()
          .includes(needle),
      ),
    );
  }, [fields, ordered, query]);

  function upsert(row: Row) {
    const normalized = Object.fromEntries(
      Object.entries({ ...row, order: Number(row.order ?? rows.length + 1) }).map(
        ([key, value]) => {
          if (typeof value !== "string") {
            return [key, value];
          }

          const trimmed = value.trim();

          if (["githubUrl", "liveUrl", "icon", "tag"].includes(key) && !trimmed) {
            return [key, null];
          }

          return [key, trimmed];
        },
      ),
    ) as Row;
    setRows(
      row.id ? rows.map((item) => (item.id === row.id ? normalized : item)) : [...rows, normalized],
    );
    setEditing(null);
    toast.success(row.id ? "Updated locally" : "Added locally");
  }

  function rowKey(row: Row) {
    return String(row.id ?? row.name ?? row.platform ?? row.slug ?? row.order);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = ordered.findIndex((row) => rowKey(row) === active.id);
    const newIndex = ordered.findIndex((row) => rowKey(row) === over.id);
    const reordered = arrayMove(ordered, oldIndex, newIndex).map((row, index) => ({
      ...row,
      order: index + 1,
    }));

    setRows(reordered);
    toast.success("Order updated locally");
  }

  return (
    <CardShell title={title}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <label className="relative min-w-64 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder={`Search ${title.toLowerCase()}`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <Button onClick={() => setEditing({})}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {fields.slice(0, 4).map(([, label]) => (
              <TableHead key={label}>{label}</TableHead>
            ))}
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map(rowKey)} strategy={verticalListSortingStrategy}>
            <TableBody>
              {filtered.length ? (
                filtered.map((row) => (
                  <SortableRow
                    key={rowKey(row)}
                    id={rowKey(row)}
                    row={row}
                    fields={fields}
                    onEdit={() => setEditing(row)}
                    onDelete={() => setRows(rows.filter((item) => item !== row))}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={fields.slice(0, 4).length + 1}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No {title.toLowerCase()} found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </SortableContext>
        </DndContext>
      </Table>
      <RowDialog
        fields={fields}
        row={editing}
        title={title}
        onClose={() => setEditing(null)}
        onSave={upsert}
      />
    </CardShell>
  );
}

function SortableRow({
  id,
  row,
  fields,
  onEdit,
  onDelete,
}: {
  id: string;
  row: Row;
  fields: Array<[string, string]>;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  return (
    <TableRow ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
      {fields.slice(0, 4).map(([key], index) => (
        <TableCell key={key} className="max-w-xs truncate">
          {index === 0 ? (
            <span className="inline-flex items-center gap-2">
              <button
                className="cursor-grab rounded-md p-1 text-muted-foreground hover:bg-muted"
                type="button"
                aria-label="Drag to reorder"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="h-4 w-4" />
              </button>
              {String(row[key] ?? "")}
            </span>
          ) : (
            String(row[key] ?? "")
          )}
        </TableCell>
      ))}
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onEdit}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function ExperiencePanel({
  content,
  setContent,
}: {
  content: HomeContent;
  setContent: (content: HomeContent) => void;
}) {
  return (
    <CollectionPanel
      title="Experience"
      rows={content.experience.map((row) => ({ ...row, bullets: row.bullets.join("\n") }))}
      setRows={(rows) =>
        setContent({
          ...content,
          experience: rows.map((row) => ({
            ...(row as HomeContent["experience"][number]),
            bullets: String(row.bullets ?? "")
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          })),
        })
      }
      fields={[
        ["range", "Range"],
        ["company", "Company"],
        ["role", "Role"],
        ["location", "Location"],
        ["bullets", "Bullets"],
        ["stack", "Stack"],
        ["order", "Order"],
      ]}
    />
  );
}

function ProjectPanel({
  content,
  setContent,
}: {
  content: HomeContent;
  setContent: (content: HomeContent) => void;
}) {
  const rows = content.projects.map((row) => ({
    ...row,
    techStack: row.techStack.join("\n"),
  }));

  return (
    <CollectionPanel
      title="Projects"
      rows={rows}
      setRows={(nextRows) =>
        setContent({
          ...content,
          projects: nextRows.map((row) => ({
            ...(row as HomeContent["projects"][number]),
            techStack: String(row.techStack ?? "")
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean),
          })),
        })
      }
      fields={[
        ["name", "Name"],
        ["slug", "Slug"],
        ["year", "Year"],
        ["tag", "Tag"],
        ["imageUrl", "Image URL"],
        ["summary", "Summary"],
        ["techStack", "Tech stack"],
        ["liveUrl", "Live URL"],
        ["githubUrl", "GitHub URL"],
        ["challenges", "Challenges"],
        ["futurePlans", "Future plans"],
        ["order", "Order"],
      ]}
    />
  );
}

function RowDialog({
  fields,
  row,
  title,
  onClose,
  onSave,
}: {
  fields: Array<[string, string]>;
  row: Row | null;
  title: string;
  onClose: () => void;
  onSave: (row: Row) => void;
}) {
  const [draft, setDraft] = useState<Row>({});

  useMemo(() => {
    setDraft(row ?? {});
  }, [row]);

  return (
    <Dialog open={Boolean(row)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{row?.id ? `Edit ${title}` : `Add ${title}`}</DialogTitle>
          <DialogDescription>Changes are local until you click Save all.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map(([key, label]) =>
            key.toLowerCase().includes("summary") ||
            key.toLowerCase().includes("plans") ||
            key.toLowerCase().includes("challenges") ||
            key.toLowerCase().includes("bullets") ||
            key.toLowerCase().includes("stack") ? (
              <TextAreaInput
                key={key}
                className="md:col-span-2"
                label={label}
                value={String(draft[key] ?? "")}
                onChange={(value) => setDraft({ ...draft, [key]: value })}
              />
            ) : (
              <TextInput
                key={key}
                label={label}
                value={String(draft[key] ?? "")}
                onChange={(value) => setDraft({ ...draft, [key]: value })}
              />
            ),
          )}
          {"imageUrl" in draft && draft.id ? (
            <UploadControl
              accept="image/jpeg,image/png,image/webp"
              kind="project-image"
              label="Upload project image"
              previewUrl={String(draft.imageUrl ?? "")}
              projectId={String(draft.id)}
              onUploaded={(url) => setDraft({ ...draft, imageUrl: url })}
            />
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(draft)}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const securitySchema = z
  .object({
    email: z.string().email(),
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8).optional().or(z.literal("")),
    verificationCode: z.string().min(1),
  })
  .required();

function SecurityPanel({ adminEmail }: { adminEmail: string }) {
  const form = useForm<z.infer<typeof securitySchema>>({
    resolver: zodFormResolver(securitySchema),
    defaultValues: {
      email: adminEmail,
      currentPassword: "",
      newPassword: "",
      verificationCode: "",
    },
  });
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: z.infer<typeof securitySchema>) {
    setLoading(true);
    const response = await fetch("/api/dashboard/credentials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setLoading(false);

    if (!response.ok) {
      const data = (await response.json()) as { error?: string };
      toast.error(data.error ?? "Credential update failed");
      return;
    }

    toast.success("Credentials updated");
    form.reset({ email: values.email, currentPassword: "", newPassword: "", verificationCode: "" });
  }

  return (
    <CardShell title="Email & password">
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
        <TextInput label="Admin email" registration={form.register("email")} />
        <TextInput
          label="Current password"
          type="password"
          registration={form.register("currentPassword")}
        />
        <TextInput
          label="New password"
          type="password"
          registration={form.register("newPassword")}
        />
        <TextInput
          label="Verification code"
          type="password"
          registration={form.register("verificationCode")}
        />
        <p className="text-sm text-muted-foreground md:col-span-2">
          Verification requires your current password plus the private `ADMIN_CHANGE_CODE` from env.
        </p>
        <Button className="md:w-fit" disabled={loading} type="submit">
          {loading ? "Updating..." : "Update credentials"}
        </Button>
      </form>
    </CardShell>
  );
}

function TextInput({
  label,
  value,
  onChange,
  registration,
  type = "text",
}: {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  registration?: UseFormRegisterReturn;
  type?: string;
}) {
  return (
    <label className="block text-sm">
      {label}
      <Input
        className="mt-2"
        type={type}
        value={registration ? undefined : value}
        onChange={registration ? undefined : (event) => onChange?.(event.target.value)}
        {...registration}
      />
    </label>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  className,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  rows?: number;
}) {
  return (
    <label className={`block text-sm ${className ?? ""}`}>
      {label}
      <Textarea
        className="mt-2"
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function UploadControl({
  accept,
  kind,
  label,
  onUploaded,
  previewUrl,
  projectId,
}: {
  accept: string;
  kind: UploadKind;
  label: string;
  onUploaded: (url: string) => void;
  previewUrl?: string;
  projectId?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLocalPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    setUploading(true);

    try {
      const blob = await uploadAsset({ file, kind, projectId });
      onUploaded(blob.url);
      toast.success("Uploaded to Vercel Blob");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="block text-sm">
      {label}
      <Input
        accept={accept}
        className="mt-2"
        disabled={uploading}
        type="file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />
      {uploading ? (
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-2/3 animate-pulse rounded-full bg-primary" />
        </div>
      ) : null}
      {localPreview || previewUrl ? (
        <div className="relative mt-3 h-24 w-24 overflow-hidden rounded-md border border-border">
          {localPreview ? (
            <div
              aria-label="Upload preview"
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${localPreview})` }}
            />
          ) : previewUrl ? (
            <Image src={previewUrl} alt="" fill sizes="6rem" className="object-cover" />
          ) : null}
        </div>
      ) : null}
    </label>
  );
}
