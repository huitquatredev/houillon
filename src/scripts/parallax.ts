import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getRunway } from "./horizontal";

/**
 * Scroll-linked parallax of the original page:
 * - marquee        x: -67%  ->  +6%   (59% -> 100% of the pin)
 * - gallery        y: +20%  ->  -11%  (59% -> 100% of the pin)
 * - body           #fff     ->  #0d0d0d (80% -> 100% of the pin)
 *
 * The source drives these with a single "page scroll" interaction with 95%
 * smoothing; one scrubbed timeline keeps them in sync.
 */
export function initParallax(root: HTMLElement, tween: gsap.core.Tween) {
  const ctx = gsap.context(() => {
    const marquee = root.querySelector<HTMLElement>("[data-marquee]");
    const gallery = root.querySelector<HTMLElement>("[data-gallery]");

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${getRunway()}`,
        scrub: 0.9,
        invalidateOnRefresh: true,
      },
    });

    if (marquee) {
      timeline.fromTo(
        marquee,
        { xPercent: -67 },
        { xPercent: 6, duration: 0.41 },
        0.59
      );
    }

    if (gallery) {
      timeline.fromTo(
        gallery,
        { yPercent: 20 },
        { yPercent: -11, duration: 0.41 },
        0.59
      );
    }

    timeline.to(
      document.body,
      { backgroundColor: "#0d0d0d", duration: 0.2 },
      0.8
    );

    // Only decode/render the video while its panel is on screen.
    const video = root.querySelector<HTMLVideoElement>("[data-video]");
    if (video) {
      const panel = video.closest<HTMLElement>("[data-video-panel]") ?? video;
      video.pause();
      ScrollTrigger.create({
        trigger: panel,
        containerAnimation: tween,
        start: "left right",
        end: "right left",
        onToggle: (self) => {
          if (self.isActive) {
            void video.play().catch(() => {});
          } else {
            video.pause();
          }
        },
      });
    }
  }, root);

  return () => ctx.revert();
}
