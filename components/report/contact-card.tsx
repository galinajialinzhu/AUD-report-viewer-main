import { Phone, Mail, ExternalLink, Building2 } from "lucide-react";
import type { ContactCardProps } from "@/lib/report-types";

export function ContactCard({ contacts }: ContactCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-report-border-light bg-report-surface">
      {contacts.map((contact, i) => (
        <div key={i} className={`flex gap-4 px-5 py-4 ${i > 0 ? "border-t border-report-border-light" : ""}`}>
          {/* Avatar / icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-report-accent/8">
            <Building2 className="h-5 w-5 text-report-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-report-accent/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-report-accent">
                {contact.category}
              </span>
            </div>
            <p className="mt-1 text-[14px] font-semibold text-report-text">
              {contact.department}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
              {contact.phone && (
                <span className="flex items-center gap-1.5 text-[12px] text-report-text-secondary">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-report-text-tertiary" />
                  {contact.phone}
                </span>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-1.5 text-[12px] text-report-accent hover:underline"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {contact.email}
                </a>
              )}
              {contact.website && (
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[12px] text-report-accent hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
