import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Scroll runway: 600vh below 1440px, 500vh above (source section heights). */
export function getRunway() {
  return window.innerHeight * (window.innerWidth >= 1440 ? 5 : 6);
}

/**
 * Translates the track from 0 to the exact end of its content while the
 * section is pinned. The original moves the track by -87% of its width;
 * using the real distance keeps the last panel flush with the viewport.
 */
export function initHorizontal(root: HTMLElement, track: HTMLElement) {
  const distance = () =>
    Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: "none",
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: () => `+=${getRunway()}`,
      pin: true,
      pinSpacing: true,
      scrub: 0.9,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  return tween;
}
