"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ScrollReveal from "@/components/animations/ScrollReveal";
import SectionHeading from "@/components/ui/SectionHeading";

const contactSchema = z.object({
  name: z.string().min(2, "Введите имя (минимум 2 символа)"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
  message: z.string().min(5, "Сообщение слишком короткое"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const CONTACTS = [
  {
    label: "Адрес",
    value: "г. Махачкала, ул. Гагарина, д. 15",
    icon: "◈",
  },
  {
    label: "Телефон",
    value: "+7 (928) 000-00-00",
    href: "tel:+79280000000",
    icon: "◉",
  },
  {
    label: "Email",
    value: "info@mm-detailing.ru",
    href: "mailto:info@mm-detailing.ru",
    icon: "◎",
  },
  {
    label: "Время работы",
    value: "Пн–Сб: 9:00 – 20:00 · Вс: выходной",
    icon: "◷",
  },
];

const SOCIALS = [
  { label: "Instagram", icon: "IG", href: "https://instagram.com" },
  { label: "Telegram", icon: "TG", href: "https://t.me" },
  { label: "WhatsApp", icon: "WA", href: "https://wa.me" },
];

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  function onSubmit(_data: ContactFormData) {
    // TODO: подключить бэкенд (Resend API)
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 5000);
  }

  return (
    <main>
      {/* Hero */}
      <section className="flex h-[40vh] items-end bg-[var(--bg-primary)] pb-12">
        <div
          className="pointer-events-none absolute inset-0 h-[40vh]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(200,169,126,0.08) 0%, transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="СВЯЗЬ"
            title="КОНТАКТЫ"
            description="Мы всегда рады ответить на ваши вопросы"
          />
        </div>
      </section>

      {/* Content */}
      <section className="bg-[var(--bg-primary)] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

            {/* Left — Contact info */}
            <ScrollReveal>
              <div className="space-y-8">
                {CONTACTS.map((contact) => (
                  <div key={contact.label} className="flex gap-4">
                    <span className="mt-0.5 shrink-0 font-mono text-lg text-[var(--accent-primary)]">
                      {contact.icon}
                    </span>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                        {contact.label}
                      </p>
                      {contact.href ? (
                        <a
                          href={contact.href}
                          className="mt-1 font-body text-[var(--text-primary)] transition-colors hover:text-[var(--accent-primary)]"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="mt-1 font-body text-[var(--text-primary)]">
                          {contact.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {/* Socials */}
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                    Соцсети
                  </p>
                  <div className="mt-3 flex gap-3">
                    {SOCIALS.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] font-mono text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right — Form */}
            <ScrollReveal delay={0.1}>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-8">
                <h2 className="font-display text-2xl font-bold uppercase text-[var(--text-primary)]">
                  Написать нам
                </h2>

                {sent ? (
                  <div className="mt-6 rounded-lg border border-[var(--accent-primary)] bg-[var(--bg-primary)] p-6 text-center">
                    <p className="font-mono text-sm text-[var(--accent-primary)]">
                      ✓ Сообщение отправлено
                    </p>
                    <p className="mt-2 font-body text-xs text-[var(--text-secondary)]">
                      Мы свяжемся с вами в ближайшее время
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mt-6 space-y-4"
                    noValidate
                  >
                    {/* Name */}
                    <div>
                      <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                        Имя *
                      </label>
                      <input
                        {...register("name")}
                        type="text"
                        placeholder="Ваше имя"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent-primary)]"
                      />
                      {errors.name && (
                        <p className="mt-1 font-mono text-xs text-red-400">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                        Телефон *
                      </label>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent-primary)]"
                      />
                      {errors.phone && (
                        <p className="mt-1 font-mono text-xs text-red-400">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
                        Сообщение *
                      </label>
                      <textarea
                        {...register("message")}
                        rows={4}
                        placeholder="Расскажите о вашем автомобиле или задайте вопрос..."
                        className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-colors focus:border-[var(--accent-primary)]"
                      />
                      {errors.message && (
                        <p className="mt-1 font-mono text-xs text-red-400">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-[var(--accent-primary)] py-3 font-mono text-sm uppercase tracking-widest text-[var(--bg-primary)] transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {isSubmitting ? "Отправка..." : "Отправить"}
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* Map placeholder */}
          <ScrollReveal delay={0.15} className="mt-12">
            <div className="flex h-64 items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
              <div className="text-center">
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
                  Карта
                </p>
                <p className="mt-2 font-body text-sm text-[var(--text-secondary)]">
                  г. Махачкала, ул. Гагарина, д. 15
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
