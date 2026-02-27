"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { SERVICES, formatPrice, type ServiceData } from "@/lib/data/services";

// ---------------------------------------------------------------------------
// Zod schemas per step
// ---------------------------------------------------------------------------

const step1Schema = z.object({ serviceSlug: z.string().min(1, "Выберите услугу") });
const step2Schema = z.object({
  brand: z.string().min(1, "Введите марку"),
  model: z.string().min(1, "Введите модель"),
  year: z.coerce
    .number({ error: "Введите год" })
    .min(1990, "Год должен быть не ранее 1990")
    .max(new Date().getFullYear(), "Некорректный год"),
  isNew: z.boolean(),
});
const step3Schema = z.object({
  date: z.string().min(1, "Выберите дату"),
  timeSlot: z.string().min(1, "Выберите время"),
});
const step4Schema = z.object({
  name: z.string().min(2, "Введите имя (минимум 2 символа)"),
  phone: z.string().min(10, "Введите корректный номер"),
  notes: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------

interface FormState {
  serviceSlug: string;
  brand: string;
  model: string;
  year: string;
  isNew: boolean;
  date: string;
  timeSlot: string;
  name: string;
  phone: string;
  notes: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

// ---------------------------------------------------------------------------
// Calendar helper
// ---------------------------------------------------------------------------

const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

const STEP_TITLES = ["Услуга", "Автомобиль", "Дата и время", "Контакты", "Подтверждение"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Mon=0
}

// ---------------------------------------------------------------------------
// Step components
// ---------------------------------------------------------------------------

function Step1({
  form,
  setForm,
  errors,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  errors: FieldErrors;
}) {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold uppercase text-[var(--text-primary)]">
        Выберите услугу
      </h2>
      {errors.serviceSlug && (
        <p className="mb-4 font-mono text-xs text-red-400">{errors.serviceSlug}</p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SERVICES.map((service) => {
          const selected = form.serviceSlug === service.slug;
          return (
            <button
              key={service.slug}
              onClick={() => setForm({ ...form, serviceSlug: service.slug })}
              className={`relative flex items-start gap-4 rounded-xl border p-4 text-left transition-colors ${
                selected
                  ? "border-[var(--accent-primary)] bg-[var(--bg-elevated)]"
                  : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent-primary)]/50"
              }`}
            >
              {/* Color swatch */}
              <div
                className="mt-0.5 h-8 w-8 shrink-0 rounded-lg"
                style={{ background: service.gradient }}
              />
              <div className="min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-primary)]">
                  {service.category}
                </span>
                <p className="font-body text-sm font-medium text-[var(--text-primary)]">
                  {service.title}
                </p>
                <p className="font-mono text-xs text-[var(--text-muted)]">
                  от {formatPrice(service.priceNew)} ₽
                </p>
              </div>
              {selected && (
                <span className="absolute right-3 top-3 font-mono text-xs text-[var(--accent-primary)]">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step2({
  form,
  setForm,
  errors,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  errors: FieldErrors;
}) {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold uppercase text-[var(--text-primary)]">
        Данные об автомобиле
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
              Марка *
            </label>
            <input
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              type="text"
              placeholder="BMW, Toyota, Mercedes..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent-primary)]"
            />
            {errors.brand && (
              <p className="mt-1 font-mono text-xs text-red-400">{errors.brand}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
              Модель *
            </label>
            <input
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
              type="text"
              placeholder="X5, Camry, C-Class..."
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent-primary)]"
            />
            {errors.model && (
              <p className="mt-1 font-mono text-xs text-red-400">{errors.model}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Год выпуска *
          </label>
          <input
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
            type="number"
            min={1990}
            max={new Date().getFullYear()}
            placeholder={String(new Date().getFullYear())}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent-primary)]"
          />
          {errors.year && (
            <p className="mt-1 font-mono text-xs text-red-400">{errors.year}</p>
          )}
        </div>

        {/* New car toggle */}
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
          <div>
            <p className="font-body text-sm text-[var(--text-primary)]">Новый автомобиль</p>
            <p className="font-mono text-xs text-[var(--text-muted)]">влияет на итоговую цену</p>
          </div>
          <button
            onClick={() => setForm({ ...form, isNew: !form.isNew })}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              form.isNew ? "bg-[var(--accent-primary)]" : "bg-[var(--border)]"
            }`}
            role="switch"
            aria-checked={form.isNew}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                form.isNew ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

function Step3({
  form,
  setForm,
  errors,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  errors: FieldErrors;
}) {
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDayOffset = getFirstDayOfWeek(calYear, calMonth);

  function selectDate(day: number) {
    const d = new Date(calYear, calMonth, day);
    if (d < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return;
    const iso = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setForm({ ...form, date: iso, timeSlot: "" });
  }

  function isPast(day: number) {
    const d = new Date(calYear, calMonth, day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < todayStart;
  }

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  }

  function formatDisplayDate(iso: string) {
    const [y, m, d] = iso.split("-");
    return `${d} ${MONTH_NAMES[parseInt(m) - 1]} ${y}`;
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold uppercase text-[var(--text-primary)]">
        Дата и время
      </h2>

      {/* Calendar */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
        {/* Month header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <button onClick={prevMonth} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            ←
          </button>
          <span className="font-mono text-sm uppercase tracking-widest text-[var(--text-primary)]">
            {MONTH_NAMES[calMonth]} {calYear}
          </span>
          <button onClick={nextMonth} className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            →
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 border-b border-[var(--border)]">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
            <div key={d} className="py-2 text-center font-mono text-[10px] text-[var(--text-muted)]">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-px p-2">
          {Array.from({ length: firstDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const iso = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = form.date === iso;
            const past = isPast(day);
            return (
              <button
                key={day}
                onClick={() => selectDate(day)}
                disabled={past}
                className={`rounded-lg py-2 text-center font-mono text-sm transition-colors ${
                  isSelected
                    ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                    : past
                    ? "cursor-not-allowed text-[var(--text-muted)]"
                    : "text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
      {errors.date && (
        <p className="mt-2 font-mono text-xs text-red-400">{errors.date}</p>
      )}

      {/* Time slots */}
      {form.date && (
        <div className="mt-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Время — {formatDisplayDate(form.date)}
          </p>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setForm({ ...form, timeSlot: slot })}
                className={`rounded-full px-4 py-2 font-mono text-sm transition-colors ${
                  form.timeSlot === slot
                    ? "bg-[var(--accent-primary)] text-[var(--bg-primary)]"
                    : "border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
          {errors.timeSlot && (
            <p className="mt-2 font-mono text-xs text-red-400">{errors.timeSlot}</p>
          )}
        </div>
      )}
    </div>
  );
}

function Step4({
  form,
  setForm,
  errors,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  errors: FieldErrors;
}) {
  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, "");
    setForm({ ...form, phone: raw });
  }

  function formatPhoneDisplay(raw: string) {
    if (!raw) return "";
    const digits = raw.startsWith("7") ? raw : `7${raw}`;
    const parts = digits.match(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    if (!parts) return `+${digits}`;
    return [
      `+${parts[1]}`,
      parts[2] ? ` (${parts[2]}` : "",
      parts[3] ? `) ${parts[3]}` : "",
      parts[4] ? `-${parts[4]}` : "",
      parts[5] ? `-${parts[5]}` : "",
    ].join("");
  }

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold uppercase text-[var(--text-primary)]">
        Контактные данные
      </h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Имя *
          </label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            type="text"
            placeholder="Ваше имя"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent-primary)]"
          />
          {errors.name && (
            <p className="mt-1 font-mono text-xs text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Телефон *
          </label>
          <input
            value={formatPhoneDisplay(form.phone)}
            onChange={handlePhone}
            type="tel"
            placeholder="+7 (___) ___-__-__"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent-primary)]"
          />
          {errors.phone && (
            <p className="mt-1 font-mono text-xs text-red-400">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">
            Примечания
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            placeholder="Дополнительные пожелания..."
            className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4 py-3 font-body text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent-primary)]"
          />
        </div>
      </div>
    </div>
  );
}

function Step5({ form, service }: { form: FormState; service?: ServiceData }) {
  const price = service
    ? form.isNew
      ? service.priceNew
      : service.priceUsed
    : 0;

  function formatDate(iso: string) {
    const [y, m, d] = iso.split("-");
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря",
    ];
    return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
  }

  const rows = [
    { label: "Услуга", value: service?.title ?? "—" },
    { label: "Автомобиль", value: `${form.brand} ${form.model}, ${form.year}` },
    { label: "Тип", value: form.isNew ? "Новый" : "С пробегом" },
    { label: "Дата", value: form.date ? formatDate(form.date) : "—" },
    { label: "Время", value: form.timeSlot || "—" },
    { label: "Примерная цена", value: `${formatPrice(price)} ₽` },
  ];

  return (
    <div>
      <h2 className="mb-6 font-display text-2xl font-bold uppercase text-[var(--text-primary)]">
        Подтверждение записи
      </h2>

      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
        {rows.map(({ label, value }, i) => (
          <div
            key={label}
            className={`flex items-center justify-between px-5 py-3 ${
              i !== rows.length - 1 ? "border-b border-[var(--border)]" : ""
            }`}
          >
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
              {label}
            </span>
            <span
              className={`font-body text-sm ${
                label === "Примерная цена"
                  ? "font-mono text-[var(--accent-primary)]"
                  : "text-[var(--text-primary)]"
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
        <p className="font-body text-sm text-[var(--text-secondary)]">
          Контакт:{" "}
          <span className="text-[var(--text-primary)]">{form.name}</span>
          {" · "}
          <span className="text-[var(--text-primary)]">+7{form.phone.replace(/^7/, "")}</span>
        </p>
      </div>

      <p className="mt-4 font-mono text-xs text-[var(--text-muted)]">
        * Цена предварительная и может быть скорректирована после осмотра автомобиля
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main wizard
// ---------------------------------------------------------------------------

export default function BookingWizard() {
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("service") ?? "";

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [direction, setDirection] = useState<1 | -1>(1);

  const [form, setForm] = useState<FormState>({
    serviceSlug: preselectedSlug,
    brand: "",
    model: "",
    year: "",
    isNew: true,
    date: "",
    timeSlot: "",
    name: "",
    phone: "",
    notes: "",
  });

  const service = SERVICES.find((s) => s.slug === form.serviceSlug);

  const validate = useCallback(
    (targetStep: number): boolean => {
      try {
        if (targetStep === 1) {
          step1Schema.parse({ serviceSlug: form.serviceSlug });
        } else if (targetStep === 2) {
          step2Schema.parse({
            brand: form.brand,
            model: form.model,
            year: Number(form.year),
            isNew: form.isNew,
          });
        } else if (targetStep === 3) {
          step3Schema.parse({ date: form.date, timeSlot: form.timeSlot });
        } else if (targetStep === 4) {
          step4Schema.parse({ name: form.name, phone: form.phone, notes: form.notes });
        }
        setErrors({});
        return true;
      } catch (err) {
        if (err instanceof z.ZodError) {
          const newErrors: FieldErrors = {};
          err.issues.forEach((e) => {
            const field = e.path[0] as keyof FormState;
            if (field) newErrors[field] = e.message;
          });
          setErrors(newErrors);
        }
        return false;
      }
    },
    [form]
  );

  function next() {
    if (!validate(step)) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, 5));
  }

  function prev() {
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }

  function submit() {
    if (!validate(4)) return;
    // TODO: подключить Server Action / API
    setSubmitted(true);
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-4 pt-24">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--accent-primary)]">
            <span className="font-mono text-2xl text-[var(--accent-primary)]">✓</span>
          </div>
          <h1 className="font-display text-4xl font-bold uppercase text-[var(--text-primary)]">
            Запись создана!
          </h1>
          <p className="mt-4 font-body text-[var(--text-secondary)]">
            Мы свяжемся с вами в течение 30 минут для подтверждения записи.
          </p>
          <p className="mt-2 font-mono text-sm text-[var(--accent-primary)]">
            {service?.title} · {form.date} · {form.timeSlot}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] pt-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Page title */}
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--accent-primary)]">
            Онлайн-запись
          </span>
          <h1 className="mt-1 font-display text-4xl font-bold uppercase text-[var(--text-primary)] md:text-5xl">
            ЗАПИСЬ
          </h1>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex gap-1">
            {STEP_TITLES.map((title, i) => {
              const num = i + 1;
              const active = num === step;
              const done = num < step;
              return (
                <div key={title} className="flex-1">
                  <div
                    className={`h-0.5 rounded-full transition-colors ${
                      done || active
                        ? "bg-[var(--accent-primary)]"
                        : "bg-[var(--border)]"
                    }`}
                  />
                  <p
                    className={`mt-1 hidden font-mono text-[10px] uppercase tracking-widest transition-colors sm:block ${
                      active
                        ? "text-[var(--accent-primary)]"
                        : done
                        ? "text-[var(--text-secondary)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {title}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-xs text-[var(--text-muted)]">
            Шаг {step} из 5
          </p>
        </div>

        {/* Step content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {step === 1 && <Step1 form={form} setForm={setForm} errors={errors} />}
              {step === 2 && <Step2 form={form} setForm={setForm} errors={errors} />}
              {step === 3 && <Step3 form={form} setForm={setForm} errors={errors} />}
              {step === 4 && <Step4 form={form} setForm={setForm} errors={errors} />}
              {step === 5 && <Step5 form={form} service={service} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between border-t border-[var(--border)] pt-6 pb-16">
          {step > 1 ? (
            <button
              onClick={prev}
              className="font-mono text-sm uppercase tracking-widest text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              ← Назад
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={next}
              className="rounded-full bg-[var(--accent-primary)] px-8 py-3 font-mono text-sm uppercase tracking-widest text-[var(--bg-primary)] transition-opacity hover:opacity-90"
            >
              Далее →
            </button>
          ) : (
            <button
              onClick={submit}
              className="rounded-full bg-[var(--accent-primary)] px-8 py-3 font-mono text-sm uppercase tracking-widest text-[var(--bg-primary)] transition-opacity hover:opacity-90"
            >
              Подтвердить запись
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
