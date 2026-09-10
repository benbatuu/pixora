"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFadeAnim } from "../useFadeAnim";
import CapsulePhysics from "../CapsulePhysics";
import {
  SERVICES_DEFAULTS,
  type ServicesContent,
} from "@/app/data/services";
import type { UiMessages } from "@/lib/i18n/ui";
import { getUi } from "@/lib/i18n/ui";

gsap.registerPlugin(ScrollTrigger);
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function FlowerBadge() {
  return (
    <Link
      href="/contact"
      className="px-btn-zikzak relative ml-8 inline-flex h-[98px] w-[98px] shrink-0 -translate-y-2.5 items-center justify-center text-center font-['Thunder',Impact,sans-serif] text-[22px] uppercase leading-[0.95] text-[#e11010] md:ml-10"
      style={{ color: "#e11010" }}
      aria-label="Let's talk"
    >
      <span className="btn-text absolute top-1/2 left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 text-center text-[#e11010]">
        let&apos;s
        <br />
        talk
      </span>
      <i className="decorative-shape block leading-none [&_svg]:animate-[px-zikzak-spin_10s_cubic-bezier(1,0.99,0.03,0.01)_infinite] hover:[&_svg]:[animation-play-state:paused]" aria-hidden>
        <svg width="98" height="98" viewBox="0 0 98 98" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M49 0C41.1522 0 34.79 6.36216 34.79 14.21V14.6941L34.448 14.3516C28.8982 8.80236 19.9014 8.80236 14.3516 14.3516C8.80236 19.9009 8.80236 28.8982 14.3516 34.448L14.6941 34.79H14.21C6.36216 34.79 0 41.1522 0 49C0 56.8478 6.36216 63.21 14.21 63.21H14.6941L14.3516 63.552C8.80236 69.1018 8.80236 78.0986 14.3516 83.6484C19.9009 89.1976 28.8982 89.1976 34.448 83.6484L34.79 83.3059V83.79C34.79 91.6378 41.1522 98 49 98C56.8478 98 63.21 91.6378 63.21 83.79V83.3059L63.5525 83.6484C69.1018 89.1976 78.0986 89.1976 83.6484 83.6484C89.1976 78.0986 89.1976 69.1018 83.6484 63.5525L83.3059 63.21H83.79C91.6378 63.21 98 56.8478 98 49C98 41.1522 91.6378 34.79 83.79 34.79H83.3059L83.6484 34.448C89.1976 28.8982 89.1976 19.9009 83.6484 14.3516C78.0986 8.80236 69.1018 8.80236 63.5525 14.3516L63.21 14.6941V14.21C63.21 6.36216 56.8478 0 49 0Z"
            fill="white"
          />
        </svg>
      </i>
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M1 9L9 1M9 1H2.5M9 1V7.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function DoubleArrow() {
  return (
    <>
      <ArrowIcon />
      <ArrowIcon />
    </>
  );
}

function TestiArrow({ dir }: { dir: "prev" | "next" }) {
  const flip = dir === "prev";
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      fill="none"
      aria-hidden
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M0 6H16M16 6L11 1M16 6L11 11" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" aria-hidden>
      <path
        d="M9.16722 10.6581L8.8971 11.6209L8.8971 11.6209L9.16722 10.6581ZM10.7613 12.3781L9.78467 12.5928L9.78467 12.5928L10.7613 12.3781ZM13.7014 19.9996L13.7455 19.0006L13.7455 19.0006L13.7014 19.9996ZM1.00001 7.051L1.99999 7.04455L1.00001 7.051ZM19.5477 1.55293L18.8149 2.23339L18.8149 2.23339L19.5477 1.55293ZM9.29286 10.2929C8.90233 10.6834 8.90233 11.3166 9.29286 11.7071C9.68338 12.0976 10.3165 12.0976 10.7071 11.7071L9.99996 11L9.29286 10.2929ZM14.2071 8.20709C14.5976 7.81656 14.5976 7.1834 14.2071 6.79287C13.8165 6.40235 13.1834 6.40235 12.7929 6.79287L13.5 7.49998L14.2071 8.20709ZM1.00001 7.051L2.9155e-05 7.05745C0.00710767 8.15531 0.755835 8.90738 1.48642 9.38526C2.23645 9.87586 3.20112 10.2387 4.14017 10.5188C5.09255 10.8028 6.09145 11.0221 6.94401 11.1988C7.83012 11.3824 8.49914 11.5092 8.8971 11.6209L9.16722 10.6581L9.43735 9.69523C8.95074 9.55871 8.15849 9.40795 7.34978 9.24039C6.50753 9.06588 5.57808 8.86053 4.71171 8.60218C3.83202 8.33985 3.08756 8.04271 2.58122 7.71152C2.05544 7.36761 2.00058 7.13613 1.99999 7.04455L1.00001 7.051ZM10.7613 12.3781L11.738 12.1633C11.6097 11.5796 11.4333 10.994 11.0044 10.5316C10.5709 10.0641 10.0016 9.85353 9.43735 9.69523L9.16722 10.6581L8.8971 11.6209C9.39675 11.7611 9.50186 11.8526 9.53805 11.8917C9.57897 11.9358 9.66771 12.0609 9.78467 12.5928L10.7613 12.3781ZM1.00001 7.051L1.99999 7.04455C2.0012 7.2324 1.91721 7.30282 1.97671 7.22496C2.02555 7.16106 2.13043 7.05233 2.32049 6.90343C2.69784 6.60778 3.28009 6.25438 4.03921 5.86852C5.54749 5.10188 7.61022 4.27909 9.75843 3.5876C11.9085 2.89552 14.0977 2.34998 15.8589 2.11897C16.7431 2.003 17.4782 1.97201 18.0289 2.02508C18.3028 2.05149 18.5034 2.09624 18.6417 2.146C18.7815 2.19631 18.8189 2.23766 18.8149 2.23339L19.5477 1.55293L20.2805 0.872468C19.748 0.299013 18.9355 0.103202 18.2208 0.0343096C17.4587 -0.0391483 16.5566 0.0103224 15.5988 0.135955C13.676 0.388155 11.3619 0.970393 9.14561 1.6838C6.92746 2.3978 4.7608 3.25821 3.13298 4.08562C2.32404 4.49679 1.61156 4.91812 1.08703 5.32908C0.826155 5.53347 0.57832 5.76101 0.38759 6.01059C0.207523 6.24623 -0.0028727 6.60738 2.91551e-05 7.05745L1.00001 7.051ZM13.7014 19.9996L13.6572 20.9987C14.1165 21.0189 14.4861 20.8094 14.7206 20.6352C14.9705 20.4496 15.1982 20.2064 15.4022 19.9515C15.8129 19.4386 16.2376 18.7378 16.6547 17.9406C17.4943 16.336 18.3801 14.1916 19.1284 11.9901C19.8762 9.78977 20.5017 7.48842 20.8038 5.56898C20.9543 4.61253 21.0308 3.71292 20.9884 2.9509C20.9488 2.23967 20.7968 1.42841 20.2805 0.872468L19.5477 1.55293L18.8149 2.23339C18.8106 2.22867 18.8511 2.27197 18.8961 2.42316C18.94 2.57104 18.9758 2.78098 18.9915 3.062C19.0229 3.62629 18.9677 4.37084 18.8281 5.25806C18.5499 7.02597 17.9609 9.21001 17.2348 11.3465C16.509 13.4817 15.6613 15.5253 14.8826 17.0134C14.4906 17.7626 14.135 18.3343 13.8409 18.7017C13.6925 18.887 13.5869 18.9859 13.5281 19.0296C13.4539 19.0847 13.5396 18.9915 13.7455 19.0006L13.7014 19.9996ZM10.7613 12.3781L9.78467 12.5928C10.3341 15.0916 10.765 17.0532 11.226 18.3887C11.4556 19.0541 11.7215 19.6538 12.0698 20.1059C12.4369 20.5824 12.9577 20.9677 13.6572 20.9987L13.7014 19.9996L13.7455 19.0006C13.8094 19.0034 13.7838 19.0536 13.6541 18.8852C13.5055 18.6924 13.3241 18.3376 13.1165 17.7362C12.703 16.538 12.2995 14.717 11.738 12.1633L10.7613 12.3781ZM9.99996 11L10.7071 11.7071L14.2071 8.20709L13.5 7.49998L12.7929 6.79287L9.29286 10.2929L9.99996 11Z"
        fill="white"
      />
    </svg>
  );
}

export type ServicesPageContentProps = {
  content?: ServicesContent;
  ui?: UiMessages;
};

export default function ServicesPageContent({
  content = SERVICES_DEFAULTS,
  ui,
}: ServicesPageContentProps = {}) {
  const messages = ui ?? getUi("en");
  const MARQUEE = content.marquee.tags;
  const SERVICE_CARDS = content.cards;
  const CAPSULES = content.capsules;
  const STEPS = content.steps;
  const stepsMeta = content.stepsMeta ?? SERVICES_DEFAULTS.stepsMeta;
  const viewDetailsLabel =
    content.viewDetailsLabel ?? messages.viewDetails;
  const stepLabel = stepsMeta?.stepLabel ?? messages.stepLabel;
  const howWeWork = stepsMeta?.title ?? messages.howWeWork;
  const craftingStories = stepsMeta?.subtitle ?? messages.craftingStories;
  const stepsEyebrow = stepsMeta?.eyebrow ?? messages.stepLabel;
  const FAQS = content.faqs;
  const BRANDS = content.brands;
  const TESTIMONIALS = content.testimonials;
  const hero = content.hero;
  const introRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLElement>(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [emailSub, setEmailSub] = useState("");
  const [subDone, setSubDone] = useState(false);
  const stepWrapRef = useRef<HTMLElement>(null);
  const stepCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [frac, setFrac] = useState("01 / 06");
  const [testiProgress, setTestiProgress] = useState((1 / 6) * 100);
  const swiperRef = useRef<SwiperType | null>(null);

  useFadeAnim(introRef);
  useFadeAnim(cardsRef);

  useEffect(() => {
    const area = stepWrapRef.current;
    if (!area) return;

    const item = area.querySelector<HTMLElement>(".px-step-item");
    const cards = stepCardsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!item || !cards.length) return;

    // Live service-1 uses min-width: 1199px
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1199px)", () => {
      const ctx = gsap.context(() => {
        // Pin gray item for the whole step-area scroll
        ScrollTrigger.create({
          trigger: item,
          pin: item,
          scrub: 1,
          start: "top 0%",
          end: "bottom 80%",
          endTrigger: area,
          pinSpacing: false,
        });

        // EVERY card pins until SAME area end (do NOT unpin when next arrives)
        cards.forEach((card, i) => {
          gsap.set(card, { zIndex: 10 + i });
          gsap.to(card, {
            rotate: i % 2 === 0 ? -5 : 5,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              pin: card,
              scrub: 1,
              start: "top 20%",
              end: "bottom 80%",
              endTrigger: area,
              pinSpacing: false,
            },
          });
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, area);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, []);

  const marqueeSlides = [...MARQUEE, ...MARQUEE, ...MARQUEE];

  return (
    <div className="px-services-page bg-white text-[var(--px-black)]">
      {/* 1. Hero — cream #FFF5F3 */}
      <section
        className="px-inner-service-2-ptb pt-[160px] pb-10 md:pt-[200px] md:pb-20"
        style={{ backgroundColor: "#FFF5F3" }}
      >
        <div className="w-full px-16">
          <div className="grid grid-cols-1 items-end gap-10 xl:grid-cols-12">
            <div className="xl:col-span-10">
              <div className="px-inner-service-2-heading">
                <h1 className="px-inner-service-2-title m-0 font-['Thunder',Impact,sans-serif] text-[clamp(96px,16vw,300px)] font-bold uppercase leading-[0.8] tracking-[-0.02em] text-px-black [&_br]:hidden lg:[&_br]:block [&_span]:text-[#e11010] whitespace-pre-line">
                  {hero.titleLine1}{" "}
                  <span>{hero.titleAccent}</span>
                </h1>
              </div>
            </div>
            <div className="xl:col-span-2">
              <div className="px-hero-4-video-wrap flex justify-end">
                <div className="px-hero-4-video [&_video]:ml-auto [&_video]:block [&_video]:h-[195px] [&_video]:w-full [&_video]:max-w-[300px] [&_video]:object-cover">
                  <div className="mb-5 hidden text-end xl:block">
                    <Image
                      src={hero.shapeUrl || "/assets/img/shape/shape-1.png"}
                      alt="shape"
                      width={171}
                      height={60}
                      className="ml-auto h-auto w-auto"
                    />
                  </div>
                  <video loop muted autoPlay playsInline preload="auto" controls={false}>
                    <source src={hero.videoUrl} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Red marquee style-5 */}
      <div className="px-text-slider-area">
        <div
          className="px-text-slider-wrap px-text-slider-style-5 overflow-hidden pt-6 md:pt-8"
          style={{ backgroundColor: "#e11010" }}
        >
          <Swiper
            modules={[Autoplay, FreeMode]}
            loop
            slidesPerView="auto"
            spaceBetween={40}
            speed={16000}
            allowTouchMove={false}
            freeMode={{ enabled: true, momentum: false }}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            className="!overflow-visible"
          >
            {marqueeSlides.map((text, i) => (
              <SwiperSlide key={`${text}-${i}`} className="!w-auto">
                <div className="px-text-slider-item flex items-center whitespace-nowrap [&_>span]:font-['Thunder',Impact,sans-serif] [&_>span]:text-[clamp(56px,9vw,140px)] [&_>span]:font-bold [&_>span]:uppercase [&_>span]:leading-none [&_>span]:tracking-normal [&_>span]:text-white">
                  <span>{text}</span>
                  <FlowerBadge />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* 3. Intro */}
      <section
        ref={introRef}
        className="px-about-4-area px-about-5-style px-inner-service-2-style pt-20 pb-14 md:pt-[120px] md:pb-[70px]"
      >
        <div className="w-full px-16">
          <div className="mb-10 grid grid-cols-1 xl:grid-cols-12 md:mb-[55px]">
            <div className="xl:col-span-10">
              <h2 className="px-section-title ff-inter px-fade-anim m-0 font-[Inter,system-ui,sans-serif] text-[clamp(28px,3.2vw,50px)] font-medium uppercase leading-[1.1] tracking-normal text-px-black whitespace-pre-line">
                {hero.introTitle}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            <div className="xl:col-span-5 xl:col-start-6">
              <div className="px-about-4-content [&_p]:text-base [&_p]:leading-[1.6] [&_p]:tracking-[-0.02em] [&_p]:text-[#6d6868] [&_p_span]:text-px-black">
                <div className="px-fade-anim">
                  <p className="whitespace-pre-line">
                    {hero.introBody}
                  </p>
                </div>
                <div className="px-fade-anim">
                  <Link
                    className="px-about-4-link px-doubble-effect mt-6 inline-flex items-center gap-2 text-base font-medium capitalize text-px-black no-underline hover:text-[#e11010]"
                    href={hero.introCtaHref}
                  >
                    <span>{hero.introCtaLabel}</span>
                    <i>
                      <DoubleArrow />
                    </i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Service cards */}
      <section ref={cardsRef} className="px-service-5-area pb-10 md:pb-16">
        <div className="w-full px-16">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {SERVICE_CARDS.map((c) => (
              <article key={c.title} className="px-service-5-item mb-6 flex h-full flex-col border border-[#1e1e1e1a] px-8 py-10 px-fade-anim">
                <div className="px-service-5-icon mb-12">
                  <Image src={c.icon} alt={c.title} width={90} height={60} className="h-auto w-auto" />
                </div>
                <div className="px-service-5-content mb-10 flex-1 [&_p]:m-0 [&_p]:text-base [&_p]:font-normal [&_p]:leading-normal [&_p]:tracking-[-0.04em] [&_p]:text-[#6d6868]">
                  <h4 className="px-service-5-title mb-4 text-[22px] font-semibold leading-none tracking-[-0.04em] text-px-black [&_a]:text-inherit [&_a]:no-underline hover:[&_a]:text-[#e11010]">
                    <Link className="px-line-lr" href="/services">
                      {c.title}
                    </Link>
                  </h4>
                  <p>{c.body}</p>
                </div>
                <div className="px-service-5-link [&_a]:text-base [&_a]:font-medium [&_a]:text-px-black [&_a]:no-underline hover:[&_a]:text-[#e11010]">
                  <Link className="px-doubble-effect inline-flex items-center gap-2" href="/services">
                    <span>{c.viewDetailsLabel ?? viewDetailsLabel}</span>
                    <i>
                      <DoubleArrow />
                    </i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Capsule scatter */}
      <section className="px-capsule-area pb-10">
        <div className="w-full px-16">
          <div className="px-capsule-inner relative overflow-hidden rounded-[20px] border border-[#1e1e1e1a] bg-[#f6f6f6]">
            <div className="px-capsule-top-wrapper p-relative">
              <div className="px-capsule-title-wrapper relative z-[2] px-6 pt-12 lg:pt-[60px] lg:pl-[60px] lg:pr-0">
                <span className="px-capsule-subtitle mb-6 inline-block text-lg font-normal leading-[1.6] tracking-[-0.05em] text-px-black">{hero.capsulesSubtitle}</span>
                <h3 className="px-capsule-title m-0 font-['Thunder',Impact,sans-serif] text-[clamp(48px,8vw,100px)] font-semibold uppercase leading-[0.85] tracking-[-0.01em] text-px-black whitespace-pre-line">
                  {hero.capsulesTitle}
                </h3>
              </div>
              <CapsulePhysics items={CAPSULES} />
            </div>
            <div className="px-line-shape px-line-bg-black m-2-top -mt-0.5 leading-none pb-2 [&_span]:mt-2 [&_span]:block [&_span]:h-2.5 [&_span]:w-full [&_span]:bg-[#111214] [&_span:nth-child(2)]:h-[9px] [&_span:nth-child(3)]:h-1.5 [&_span:nth-child(4)]:h-1 [&_span:nth-child(5)]:h-0.5 [&_span:nth-child(5)]:-translate-y-1 [&_span:first-child]:mt-0" aria-hidden>
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="ar-testimonial-area pt-20 pb-20 md:pt-[120px] md:pb-[120px]">
        <div className="w-full px-16">
          <div className="mx-auto grid grid-cols-1 justify-items-center xl:grid-cols-12">
            <div className="w-full xl:col-span-8 xl:col-start-3">
              <div className="ar-testimonial-slider-wrap relative px-0 pb-[72px] md:px-[72px]">
                <div className="ar-testimonial-active fix">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    loop
                    onSwiper={(s) => {
                      swiperRef.current = s;
                      const i = s.realIndex + 1;
                      const n = TESTIMONIALS.length;
                      setFrac(`${String(i).padStart(2, "0")} / ${String(n).padStart(2, "0")}`);
                      setTestiProgress((i / n) * 100);
                    }}
                    onSlideChange={(s) => {
                      const i = s.realIndex + 1;
                      const n = TESTIMONIALS.length;
                      setFrac(`${String(i).padStart(2, "0")} / ${String(n).padStart(2, "0")}`);
                      setTestiProgress((i / n) * 100);
                    }}
                  >
                    {TESTIMONIALS.map((t, i) => (
                      <SwiperSlide key={i}>
                        <div className="ar-testimonial-item text-center [&_p]:mb-7 [&_p]:text-[clamp(20px,2.4vw,32px)] [&_p]:leading-[1.35] [&_p]:tracking-[-0.02em] [&_p]:text-px-black">
                          <p>{t.body}</p>
                          <div className="ar-testimonial-client-info text-center [&_span]:text-sm [&_span]:text-[#6d6868]">
                            <h4 className="ar-testimonial-client-name mb-1.5 mt-0 text-xl font-semibold">{t.name}</h4>
                            <span>{t.role}</span>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className="ar-testimonial-fraction-wrap absolute bottom-2 left-1/2 flex w-[260px] -translate-x-1/2 items-center justify-center gap-0">
                    <span className="ar-testimonial-frac-current mr-3 min-w-[1.5em] shrink-0 text-right text-[15px] font-medium leading-none tracking-[-0.01em] text-[#111214]">{frac.split(" / ")[0]}</span>
                    <div className="ar-testimonial-progress relative h-0.5 flex-1 overflow-hidden bg-[#d9d9d9]" aria-hidden>
                      <span
                        className="ar-testimonial-progress-fill block h-full bg-[#e11010] transition-[width] duration-350 ease"
                        style={{ width: `${testiProgress}%` }}
                      />
                    </div>
                    <span className="ar-testimonial-frac-total ml-3 min-w-[1.5em] shrink-0 text-left text-[15px] font-medium leading-none tracking-[-0.01em] text-[#111214]">{frac.split(" / ")[1]}</span>
                  </div>
                </div>
                <div className="ar-testimonial-arrow mt-6 flex justify-center gap-3 md:mt-0 md:contents">
                  <button
                    type="button"
                    className="ar-testimonial-prev static inline-flex h-[50px] w-[50px] -translate-y-0 cursor-pointer items-center justify-center rounded-full border border-[#1919191a] bg-white text-lg leading-none text-px-black transition-all duration-300 hover:border-[#e11010] hover:bg-[#e11010] hover:text-white md:absolute md:top-[42%] md:left-0 md:z-[2] md:-translate-y-1/2"
                    aria-label="Previous testimonial"
                    onClick={() => swiperRef.current?.slidePrev()}
                  >
                    <TestiArrow dir="prev" />
                  </button>
                  <button
                    type="button"
                    className="ar-testimonial-next static inline-flex h-[50px] w-[50px] cursor-pointer items-center justify-center rounded-full border border-[#1919191a] bg-white text-lg leading-none text-px-black transition-all duration-300 hover:border-[#e11010] hover:bg-[#e11010] hover:text-white md:absolute md:top-[42%] md:right-0 md:z-[2] md:-translate-y-1/2"
                    aria-label="Next testimonial"
                    onClick={() => swiperRef.current?.slideNext()}
                  >
                    <TestiArrow dir="next" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Brands */}
      <section className="px-brand-area px-brand-style-5 pt-10 pb-20 md:pt-[120px] md:pb-[120px]">
        <div className="w-full px-16">
          <div className="grid grid-cols-2 gap-0 sm:grid-cols-3 xl:grid-cols-6">
            {BRANDS.map((src, i) => (
              <div key={src} className="px-brand-item grid min-h-[140px] w-full place-content-center border border-[#ececec] p-5 text-center">
                <Image
                  src={src}
                  alt={`brand-${i + 1}`}
                  width={90}
                  height={40}
                  className="img-fluid h-auto w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Steps — EXACT source DOM: item SIBLING card-wrap */}
      <section
        ref={stepWrapRef}
        className="px-step-area relative mb-[100px] overflow-visible bg-[#f7f7f7] md:mb-[140px] [&_.pin-spacer]:!bg-[#f7f7f7]"
        style={{ backgroundColor: "#F7F7F7" }}
      >
        <div
          className="px-step-item relative z-[1] flex h-[920px] w-full flex-col justify-end bg-[#f7f7f7] max-lg:h-auto max-lg:min-h-[70vh]"
          style={{ backgroundColor: "#F7F7F7" }}
        >
          <div className="px-step-video pointer-events-none absolute top-[11%] left-[9%] z-[1] bg-transparent leading-none mix-blend-multiply max-lg:left-[4%] max-lg:w-[min(70%,420px)] max-md:left-[-38%] [&_video]:block [&_video]:h-auto [&_video]:w-[1160px] [&_video]:bg-[#f7f7f7] [&_video]:mix-blend-multiply">
            <video loop muted autoPlay playsInline preload="auto" controls={false}>
              <source src="/assets/video/step-video.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="px-step-num pointer-events-none absolute top-[120px] left-14 z-[2] max-md:top-[60px] max-md:left-5 [&_span]:inline-block [&_span]:font-['Thunder',Impact,sans-serif] [&_span]:text-[160px] [&_span]:font-bold [&_span]:uppercase [&_span]:leading-[1.3] [&_span]:text-px-black max-lg:[&_span]:text-[110px]">
              <span>{stepsEyebrow}</span>
            </div>
          <div className="w-full relative z-10">
            <div className="px-step-bottom relative z-10 border-y border-[#1e1e1e] bg-[#f7f7f7] px-[45px] py-2.5 max-md:px-5" style={{ backgroundColor: "#F7F7F7" }}>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-12 md:items-center">
                <div className="md:col-span-8">
                  <div className="px-step-bottom-text [&_span]:text-xs [&_span]:font-medium [&_span]:uppercase [&_span]:leading-none [&_span]:text-px-black">
                    <span>{howWeWork}</span>
                  </div>
                </div>
                <div className="md:col-span-4">
                  <div className="px-step-bottom-text [&_span]:text-xs [&_span]:font-medium [&_span]:uppercase [&_span]:leading-none [&_span]:text-px-black">
                    <span className="text-2 -ml-[30px] inline-block max-md:ml-0">{craftingStories}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-step-card-wrap relative z-[5] mt-0 bg-transparent max-lg:mt-[30px] mr-0 xl:mr-[60px]">
          <div className="w-full px-16">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex justify-end xl:pl-[58.333%]">
                <div
                  ref={(el) => {
                    stepCardsRef.current[i] = el;
                  }}
                  className={`px-step-card relative mb-[250px] ml-auto flex w-full max-w-[530px] min-h-[600px] flex-col p-[60px] will-change-transform max-xl:max-w-[420px] max-xl:min-h-[520px] max-xl:px-8 max-xl:pb-10 max-xl:pt-[50px] max-lg:mb-6 max-lg:max-w-full max-lg:min-h-0 max-lg:px-[30px] max-lg:pb-[45px] max-lg:pt-[50px] last:mb-[80vh] max-lg:last:mb-10 ${s.bg === "#e11010" ? " is-red text-white [&_.px-step-card-badge_span]:bg-white [&_.px-step-card-badge_span]:text-px-black [&_.px-step-card-content_>span]:text-white [&_.px-step-card-content_p]:text-white [&_.px-step-title]:text-white" : ""}`}
                  style={{ backgroundColor: s.bg }}
                >
                  <div className="px-step-card-badge shrink-0 [&_span]:inline-block [&_span]:rounded-[27px] [&_span]:bg-px-black [&_span]:px-3.5 [&_span]:py-1.5 [&_span]:text-sm [&_span]:font-semibold [&_span]:uppercase [&_span]:leading-none [&_span]:text-white">
                    <span>{stepLabel}</span>
                  </div>
                  <div className="px-step-card-content mb-10 flex-1 text-end [&_>span]:block [&_>span]:font-['ThunderMed',Impact,sans-serif] [&_>span]:text-[clamp(140px,16vw,240px)] [&_>span]:font-medium [&_>span]:uppercase [&_>span]:leading-[0.7] [&_>span]:text-px-black max-lg:[&_>span]:text-[160px] [&_p]:mt-4 [&_p]:mb-0 [&_p]:text-lg [&_p]:font-normal [&_p]:leading-[26px] [&_p]:text-px-black [&_p_span]:inline [&_p_span]:text-inherit [&_p_span]:font-inherit [&_p_span]:text-[length:inherit] [&_p_span]:leading-[inherit] [&_p_span]:normal-case">
                    <span>{s.num}</span>
                    <p>
                      {s.bodyLines.map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                  <h4 className="px-step-title mt-auto font-['ThunderMed',Impact,sans-serif] text-[clamp(40px,5vw,72px)] font-medium uppercase leading-[0.9] text-px-black max-lg:text-[50px]">
                    {s.title.map((line) => (
                      <span key={line}>
                        {line} <br />
                      </span>
                    ))}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="px-inner-service-2-faq-ptb pt-10 pb-24 md:pt-[100px] md:pb-[140px]">
        <div className="w-full px-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5 xl:col-span-6">
              <div className="px-inner-service-2-heading mb-10">
                <span className="px-capsule-subtitle mb-6 inline-block text-lg font-normal leading-[1.6] tracking-[-0.05em] text-px-black">{hero.faqSubtitle}</span>
                <h3 className="px-section-title ff-thunder fs-100 mb-0 font-thunder text-[clamp(48px,8vw,100px)] leading-[0.9] tracking-[-0.03em] whitespace-pre-line">
                  {hero.faqTitle}
                </h3>
              </div>
            </div>
            <div className="lg:col-span-7 xl:col-span-6">
              <div className="px-inner-service-2-faq">
                <div className="px-service-accordion-wrap">
                  <div className="accordion" id="serviceFaqAccordion">
                    {FAQS.map((f, i) => {
                      const open = openFaq === i;
                      return (
                        <div key={f.q} className={`accordion-items mb-2 border border-transparent${open ? " faq-active border-[#1112141a]" : ""}`}>
                          <h2 className="accordion-header">
                            <button
                              type="button"
                              className={`accordion-buttons relative flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-[#f7f7f7] py-[22px] pr-10 pl-8 text-left text-lg font-medium tracking-[-0.6px] text-px-black${open ? " bg-transparent text-[#e11010]" : " collapsed"}`}
                              aria-expanded={open}
                              onClick={() => setOpenFaq(open ? -1 : i)}
                            >
                              {f.q}
                              <span className={`accordion-icon relative h-3.5 w-3.5 shrink-0 before:absolute before:top-1/2 before:left-1/2 before:h-0.5 before:w-3.5 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-current before:content-[''] after:absolute after:top-1/2 after:left-1/2 after:h-3.5 after:w-0.5 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-current after:content-['']${open ? " after:hidden" : ""}`} />
                            </button>
                          </h2>
                          <div
                            className={`accordion-body-wrapper${open ? " open" : ""}`}
                            hidden={!open}
                          >
                            <div className="accordion-body px-8 pb-10 [&_p]:mb-4 [&_p]:tracking-[-0.6px] [&_p]:text-[#6d6868]">
                              <p>{f.a}</p>
                              <ul className="px-inner-service-2-list m-0 list-disc pl-5 [&_li]:mb-1.5 [&_li]:text-base [&_li]:tracking-[-0.6px] [&_li]:text-[#6d6868]">
                                {f.bullets.map((b) => (
                                  <li key={b}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Social bar */}
      <section className="px-social-area p-relative">
        <span className="px-social-shape block -translate-y-1.5 leading-none" aria-hidden>
          <svg width="1920" height="63" viewBox="0 0 1920 63" fill="none" className="w-full h-auto block">
            <rect width="1920" height="2" fill="#e11010" />
            <rect y="10" width="1920" height="4" fill="#e11010" />
            <rect y="22" width="1920" height="6" fill="#e11010" />
            <rect y="36" width="1920" height="9" fill="#e11010" />
            <rect y="53" width="1920" height="10" fill="#e11010" />
          </svg>
        </span>
        <div className="px-social-bg" style={{ backgroundColor: "#e11010" }}>
          <div className="w-full px-16">
            <div className="grid grid-cols-1 items-center gap-6 py-[19px] md:grid-cols-2">
              <div className="px-social-mail [&_a]:inline-flex [&_a]:items-center [&_a]:text-[clamp(18px,2vw,26px)] [&_a]:font-semibold [&_a]:leading-none [&_a]:tracking-[-0.02em] [&_a]:text-white [&_a]:no-underline [&_a_span]:mr-2.5 [&_a_span]:inline-flex">
                <a className="px-line-lr text-white" href="mailto:hello@getpixoria.com">
                  <span>
                    <MailIcon />
                  </span>
                  hello@getpixoria.com
                </a>
              </div>
              <div className="px-social-subscribe flex w-full justify-start md:justify-end">
                <form
                  className="flex w-full flex-col gap-2 sm:flex-row sm:items-stretch"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!emailSub.trim()) return;
                    setSubDone(true);
                  }}
                >
                  <label className="sr-only" htmlFor="px-services-subscribe">
                    Email address
                  </label>
                  <input
                    id="px-services-subscribe"
                    type="email"
                    required
                    value={emailSub}
                    onChange={(e) => {
                      setEmailSub(e.target.value);
                      setSubDone(false);
                    }}
                    placeholder="Enter your email"
                    className="min-h-[52px] w-full flex-1 rounded-full border border-white/40 bg-white px-5 text-[15px] text-[var(--px-black)] outline-none placeholder:text-[#6d6868] focus:border-white focus:ring-2 focus:ring-white/40"
                  />
                  <button
                    type="submit"
                    className="px-social-subscribe-btn min-h-[52px] shrink-0 rounded-full border border-transparent bg-[#0a0a0a] px-7 text-[13px] font-medium uppercase tracking-[0.06em] text-white transition-[background-color,color,border-color] duration-250 hover:border-white hover:bg-white hover:text-[#e11010] focus-visible:border-white focus-visible:bg-white focus-visible:text-[#e11010]"
                  >
                    {subDone ? "Subscribed" : "Subscribe"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
