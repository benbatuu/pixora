"use client";

import { FormEvent, useRef, useState } from "react";
import { useFadeAnim } from "../useFadeAnim";
import {
  CONTACT_DEFAULTS,
  type ContactInquiry,
  type ContactOffice,
} from "@/app/data/contact";
import type { UiMessages } from "@/lib/i18n/ui";
import { getUi } from "@/lib/i18n/ui";
import type { SiteContactFormLocale } from "@/lib/admin/types";

/**
 * Contact — match https://pixora-nextjs-app.vercel.app/contact
 * Orange accents → #e11010. Full width + px-16. No header/footer.
 * Content props come from lib/content/pages (CMS); defaults keep UI stable.
 */

export type ContactPageContentProps = {
  title?: string;
  inquiries?: ContactInquiry[];
  offices?: ContactOffice[];
  socials?: string[];
  officesHeading?: string;
  ui?: UiMessages;
  /** CMS settings.contactForm[locale] — preferred over ui dict for form chrome. */
  contactForm?: SiteContactFormLocale;
};

function ArrowIcon() {
  return (
    <i
      aria-hidden
      className="relative ml-[7px] inline-flex h-3.5 w-3.5 overflow-hidden"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        className="absolute bottom-[-1px] left-px -translate-y-0.5 text-[#1e1e1e] transition-all duration-200 ease-out group-hover:translate-x-4 group-hover:-translate-y-4"
      >
        <path
          d="M1 9L9 1M9 1H1M9 1V9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        className="absolute bottom-[-12px] left-[-12px] text-[#1e1e1e] opacity-0 transition-all duration-200 ease-out group-hover:translate-x-[13px] group-hover:-translate-y-[13px] group-hover:opacity-100"
      >
        <path
          d="M1 9L9 1M9 1H1M9 1V9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </i>
  );
}

const lineHover =
  "inline bg-[linear-gradient(currentColor,currentColor),linear-gradient(currentColor,currentColor)] bg-size-[0%_1px,0_1px] bg-position-[100%_100%,0_100%] bg-no-repeat transition-[background-size] duration-300 ease-linear hover:bg-size-[0%_1px,100%_1px]";

export default function ContactPageContent({
  title = CONTACT_DEFAULTS.title,
  inquiries = CONTACT_DEFAULTS.inquiries,
  offices = CONTACT_DEFAULTS.offices,
  socials = CONTACT_DEFAULTS.socials,
  officesHeading = CONTACT_DEFAULTS.officesHeading,
  ui,
  contactForm,
}: ContactPageContentProps = {}) {
  const messages = ui ?? getUi("en");
  const form = {
    submitLabel: contactForm?.submitLabel || messages.sendLabel,
    successTitle: contactForm?.successTitle || messages.sentThanks,
    successBody: contactForm?.successBody || messages.sentThanksBody,
    sendAnother: contactForm?.sendAnother || messages.sendAnother,
    emailPh: contactForm?.fields?.email?.placeholder || messages.emailPh,
    namePh: contactForm?.fields?.name?.placeholder || messages.namePh,
    phonePh: contactForm?.fields?.phone?.placeholder || messages.phonePh,
    companyPh: contactForm?.fields?.company?.placeholder || messages.companyPh,
    budgetPh: contactForm?.fields?.budget?.placeholder || messages.budgetPh,
    messagePh: contactForm?.fields?.message?.placeholder || messages.messagePh,
  };
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useFadeAnim(rootRef);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      company: String(fd.get("company") || ""),
      budget: String(fd.get("budget") || ""),
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""),
    };
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Could not send message",
        );
      }
      setSent(true);
      form.reset();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not send message");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldCls =
    "mb-5 w-full resize-none rounded-none border-0 border-b border-[rgba(30,30,30,0.2)] bg-transparent py-3.5 text-lg text-[#1e1e1e] outline-none focus:border-[#e11010] placeholder:text-base placeholder:uppercase placeholder:tracking-[-0.8px] placeholder:text-[rgba(30,30,30,0.4)]";

  const contactTitle =
    "m-0 p-0 font-['Thunder',sans-serif] text-[86px] font-bold tracking-[0.04em] uppercase text-[#1e1e1e] min-[576px]:text-[120px] md:text-[180px] lg:text-[230px] xl:text-[300px] min-[1400px]:text-[350px] min-[1600px]:text-[400px] min-[1701px]:text-[450px] min-[1891px]:text-[480px]";
  return (
    <div ref={rootRef} className="bg-white text-px-black">
      <section className="py-16">
        <div className="w-full px-16">
          <div className="px-fade-anim text-center" data-delay="0">
            <h4 className={contactTitle}>{title}</h4>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="w-full px-16">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="px-fade-anim pb-[50px] lg:col-span-4" data-delay="0.08">
              <div>
                {inquiries.map((item, idx) => (
                  <div key={`${item.label}-${idx}`} className="mb-10 xl:mb-20">
                    <span className="mb-2 block text-lg font-semibold uppercase leading-none text-[#1e1e1e]">
                      {item.label}
                    </span>
                    {item.email ? (
                      <a
                        className={`${lineHover} text-lg font-normal tracking-[-0.8px] text-[#1e1e1e] no-underline leading-[1.45]`}
                        href={`mailto:${item.email}`}
                      >
                        {item.email}
                      </a>
                    ) : null}
                    {item.lines?.length ? (
                      <a
                        className={`${lineHover} text-lg font-normal tracking-[-0.8px] text-[#1e1e1e] no-underline leading-[1.45]`}
                        href={item.phone ? `tel:${item.phone}` : "#"}
                      >
                        {item.lines.map((line) => (
                          <span key={line}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </a>
                    ) : null}
                    {item.phone && !item.lines?.length ? (
                      <a
                        className={`${lineHover} text-lg font-normal tracking-[-0.8px] text-[#1e1e1e] no-underline leading-[1.45]`}
                        href={`tel:${item.phone}`}
                      >
                        {item.phone}
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-2 flex flex-wrap gap-x-10 gap-y-4">
                {socials.map((s) => (
                  <a
                    key={s}
                    className={`group inline-flex items-center ${lineHover} text-sm font-medium uppercase tracking-[-0.2px] text-[#1e1e1e] no-underline`}
                    href="#"
                  >
                    {s}
                    <ArrowIcon />
                  </a>
                ))}
              </div>
            </div>

            <div className="px-fade-anim lg:col-span-8" data-delay="0.12">
              <div className="rounded-[20px] bg-[#f7f7f7] p-[30px] md:px-[60px] md:pb-[55px] md:pt-[50px] xl:px-20 xl:pb-[65px] xl:pt-[60px]">
                {sent ? (
                  <div className="py-6 text-center md:py-10">
                    <p className="font-['Thunder',Impact,sans-serif] text-[clamp(40px,6vw,72px)] leading-none text-[#e11010]">
                      {form.successTitle}
                    </p>
                    <p className="mt-4 text-px-body">
                      {form.successBody}
                    </p>
                    <button
                      type="button"
                      className="mt-8 inline-flex min-h-[48px] items-center rounded-full bg-px-black px-7 text-sm font-semibold uppercase tracking-wide text-white"
                      onClick={() => { setSent(false); setSubmitError(null); }}
                    >
                      {form.sendAnother}
                    </button>
                  </div>
                ) : (
                  <form id="contact-form" onSubmit={onSubmit} noValidate>
                    {submitError ? (
                      <p className="mb-4 text-sm text-[#e11010]" role="alert">
                        {submitError}
                      </p>
                    ) : null}
                    {/* honeypot */}
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      className="absolute left-[-9999px] h-0 w-0 opacity-0"
                      aria-hidden
                    />
                    <div>
                      <input
                        className={fieldCls}
                        placeholder={form.emailPh}
                        type="email"
                        name="email"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2">
                      <div>
                        <input
                          className={fieldCls}
                          placeholder={form.namePh}
                          type="text"
                          name="name"
                          required
                        />
                      </div>
                      <div>
                        <input
                          className={fieldCls}
                          placeholder={form.phonePh}
                          type="text"
                          name="phone"
                          required
                        />
                      </div>
                      <div>
                        <input
                          className={fieldCls}
                          placeholder={form.companyPh}
                          type="text"
                          name="company"
                        />
                      </div>
                      <div>
                        <input
                          className={fieldCls}
                          placeholder={form.budgetPh}
                          type="text"
                          name="budget"
                        />
                      </div>
                    </div>
                    <div>
                      <textarea
                        className={`${fieldCls} h-[120px]`}
                        placeholder={form.messagePh}
                        name="message"
                        required
                      />
                    </div>
                    <div>
                      <button
                        className="group w-full cursor-pointer rounded-2xl border-0 bg-[#e11010] px-[54px] pt-6 pb-[13px] font-['Thunder',Impact,sans-serif] text-[clamp(30px,4vw,40px)] uppercase leading-none tracking-[0.08em] text-white transition-colors duration-300 hover:bg-[#0a0a0a] disabled:opacity-60"
                        type="submit"
                        disabled={submitting}
                        aria-label={form.submitLabel}
                      >
                        <span className="relative z-[1] inline-block overflow-hidden leading-none">
                          <span className="relative block transition-all duration-300 group-hover:-translate-y-[150%]">
                            {form.submitLabel}
                          </span>
                          <span className="absolute top-full left-0 block w-full text-center transition-all duration-300 group-hover:top-1/2 group-hover:-translate-y-1/2">
                            {form.submitLabel}
                          </span>
                        </span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F7F7F7] pt-20 pb-[90px] lg:pt-[120px] lg:pb-[130px]">
        <div className="w-full px-16">
          <div className="px-fade-anim mb-5" data-delay="0.05">
            <h2 className="m-0 font-['Thunder',Impact,sans-serif] text-[clamp(55px,10vw,140px)] font-semibold uppercase leading-none tracking-[-0.03em] text-[#1e1e1e]">
              {officesHeading}
            </h2>
          </div>
          <div className="border-t border-[rgba(30,30,30,0.08)]">
            {offices.map((o, i) => (
              <div
                key={`${o.city}-${i}`}
                className="px-fade-anim border-b border-[rgba(30,30,30,0.08)] py-[35px] lg:py-[46px]"
                data-delay={String(0.08 + i * 0.06)}
              >
                <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-6">
                  <div className="lg:col-span-4">
                    <span className="inline-block text-[clamp(28px,3vw,44px)] font-semibold leading-none tracking-[-1.32px] text-[#1e1e1e]">
                      {o.city}
                    </span>
                  </div>
                  <div className="lg:col-span-3">
                    <div>
                      <a
                        className={`${lineHover} text-base font-medium tracking-[-0.4px] text-[#686868] no-underline leading-normal hover:text-[#0a0a0a]`}
                        href="#"
                      >
                        {o.lines.map((line) => (
                          <span key={line}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </a>
                    </div>
                  </div>
                  <div className="lg:col-span-3">
                    <div>
                      <a
                        className={`${lineHover} text-base font-medium tracking-[-0.4px] text-[#686868] no-underline leading-normal hover:text-[#0a0a0a]`}
                        href={`tel:${o.phone}`}
                      >
                        {o.phone}
                      </a>
                      <br />
                      <a
                        className={`${lineHover} text-base font-medium tracking-[-0.4px] text-[#686868] no-underline leading-normal hover:text-[#0a0a0a]`}
                        href={`mailto:${o.email}`}
                      >
                        {o.email}
                      </a>
                    </div>
                  </div>
                  <div className="lg:col-span-2 lg:text-right">
                    <a
                      href="#"
                      className="inline-block rounded-[60px] border border-[#e5e5e5] px-[35px] py-[11px] text-base font-medium tracking-[-0.6px] text-[#686868] no-underline transition-all duration-300 hover:border-transparent hover:bg-[#e11010] hover:text-white"
                    >
                      {messages.directionsLabel}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
