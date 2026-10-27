import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const REVEAL_START = "left 100%";

/**
 * Reveals measured from the source:
 * - quote, identity and statement blocks rise 100px and fade in (1s)
 * - "care of details" rises 100px and fades in (1s)
 * - the text window fades its image (0.8s) and slides/fades its headings in
 *   from x:-100 (1.5s, 0.3s delay)
 *
 * There is no reveal on the hero, the vineyard photo, the picker, the glass,
 * the gallery, the marquee or the newsletter.
 */
export function initReveals(tween: gsap.core.Tween) {
  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-l3="up"]').forEach((el) => {
      gsap.from(el, {
        y: 100,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          containerAnimation: tween,
          start: REVEAL_START,
          toggleActions: "play none none none",
        },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-l3="heading"]').forEach((el) => {
      gsap.from(el, {
        y: 100,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          containerAnimation: tween,
          start: REVEAL_START,
          toggleActions: "play none none none",
        },
      });
    });

    const windowPanel = document.querySelector<HTMLElement>(
      '[data-l3="window"]'
    );
    if (windowPanel) {
      const image = windowPanel.querySelector<HTMLElement>(
        "[data-window-image]"
      );
      const headings =
        windowPanel.querySelectorAll<HTMLElement>(".black-heading");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: windowPanel,
          containerAnimation: tween,
          start: REVEAL_START,
          toggleActions: "play none none none",
        },
      });

      if (image) {
        tl.from(image, { autoAlpha: 0, duration: 0.8, ease: "power2.out" }, 0);
      }

      tl.from(
        headings,
        { x: -100, autoAlpha: 0, duration: 1.5, ease: "power3.out" },
        0.3
      );
    }
  });

  return () => ctx.revert();
}

/** Vertical reveals for the stacked (mobile / reduced / no-JS) layout. */
export function initStackedReveals() {
  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-l3="up"], [data-l3="heading"]').forEach(
      (el) => {
        gsap.from(el, {
          y: 60,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      }
    );

    const windowPanel = document.querySelector<HTMLElement>(
      '[data-l3="window"]'
    );
    if (windowPanel) {
      const image = windowPanel.querySelector<HTMLElement>(
        "[data-window-image]"
      );
      const headings =
        windowPanel.querySelectorAll<HTMLElement>(".black-heading");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: windowPanel,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      if (image) {
        tl.from(image, { autoAlpha: 0, duration: 0.8, ease: "power2.out" }, 0);
      }

      tl.from(
        headings,
        { x: -60, autoAlpha: 0, duration: 1.2, ease: "power3.out" },
        0.2
      );
    }
  });

  return () => ctx.revert();
}
