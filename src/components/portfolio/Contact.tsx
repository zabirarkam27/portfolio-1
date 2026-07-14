import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, ArrowUpRight } from "lucide-react";
import type { ContactInfo } from "@/generated/prisma/client";
import { SectionHeader } from "./SectionHeader";

export function Contact({ contactInfo }: { contactInfo: ContactInfo }) {
  const channels = [
    {
      icon: Mail,
      label: "Email",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Message me →",
      href: contactInfo.whatsapp,
    },
  ];

  return (
    <section id="contact" className="relative border-t border-border py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-primary/10 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          index="06 / Contact"
          eyebrow="Let's talk"
          title={<>Have a project in mind, or just a good idea?</>}
        >
          Currently taking on one new engagement for Q4 — engineering, product, or both.
        </SectionHeader>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          {/* Left: channels */}
          <div className="space-y-3">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <c.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
                      {c.label}
                    </div>
                    <div className="truncate text-sm font-medium">{c.value}</div>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </a>
            ))}

            <div className="mt-6 rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
              <div className="font-display text-sm font-semibold text-foreground">
                Typical response
              </div>
              Within 24 hours on weekdays. I read every message.
            </div>
          </div>

          {/* Right: form */}
          <motion.form
            onSubmit={(e) => e.preventDefault()}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-border bg-card p-6 sm:p-8"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Name" placeholder="Ada Lovelace" />
              <Field label="Email" placeholder="ada@algorithm.co" type="email" />
            </div>
            <Field className="mt-5" label="Subject" placeholder="A new product for…" />
            <div className="mt-5">
              <label className="mb-2 block font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Tell me a little about what you're building."
                className="w-full resize-none rounded-2xl border border-border bg-background/40 p-4 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-all hover:gap-3 hover:shadow-[0_10px_40px_-10px_var(--color-primary)] sm:w-auto"
            >
              Send message
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  className = "",
}: {
  label: string;
  placeholder: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block font-mono-tight text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-full border border-border bg-background/40 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
