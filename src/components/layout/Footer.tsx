import Link from "next/link";
import { NAV_LINKS } from "@/lib/constants";

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Telegram", href: "#", icon: TelegramIcon },
  { label: "WhatsApp", href: "#", icon: WhatsAppIcon },
] as const;

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="font-display text-3xl font-bold text-[var(--text-primary)]">MM</span>
              <span className="mx-1 font-display text-3xl font-bold text-[var(--accent-red)]">✕</span>
              <span className="font-display text-3xl font-bold text-[var(--text-primary)]">DETAILING</span>
            </div>
            <p className="font-body text-sm leading-relaxed text-[var(--text-secondary)]">
              Премиум детейлинг в Махачкале.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-4 pt-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--accent-red)]"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Навигация
            </h3>
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-[var(--text-secondary)] transition-colors duration-200 hover:text-[var(--accent-red)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Contacts */}
          <div className="flex flex-col gap-4">
            <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
              Контакты
            </h3>
            <div className="flex flex-col gap-3 font-body text-sm text-[var(--text-secondary)]">
              <a
                href="tel:+79001234567"
                className="transition-colors duration-200 hover:text-[var(--accent-red)]"
              >
                +7 (900) 123-45-67
              </a>
              <address className="not-italic">
                г. Махачкала, ул. Примерная, д. 1
              </address>
              <a
                href="mailto:info@mm-detailing.ru"
                className="transition-colors duration-200 hover:text-[var(--accent-red)]"
              >
                info@mm-detailing.ru
              </a>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 border-t border-[var(--border)] pt-8">
          <p className="font-body text-xs text-[var(--text-muted)]">
            © 2026 MM Detailing. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
