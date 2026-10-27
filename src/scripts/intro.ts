import { gsap } from "gsap"

/**
 * Load intro, measured from the source at 1440x900:
 * - the bottle starts full size, centred and transparent, then shrinks to
 *   scale .75 and slides half a frame to the left (~1.6s)
 * - the three headline lines rise out of their masks, staggered (~1.2s)
 */
export function initIntro(root: HTMLElement) {
  const bottle = root.querySelector<HTMLElement>("[data-hero-bottle]")
  const lines = gsap.utils.toArray<HTMLElement>("[data-line]", root)

  const tl = gsap.timeline()

  if (bottle) {
    tl.fromTo(
      bottle,
      { xPercent: 0, scale: 1, autoAlpha: 0 },
      {
        xPercent: -50,
        scale: 1.5,
        autoAlpha: 1,
        duration: 1.6,
        ease: "power2.inOut"
      },
      0
    )
  }

  if (lines.length) {
    tl.fromTo(
      lines,
      { yPercent: 100, y: 0 },
      {
        yPercent: 0,
        y: 0,
        duration: 1.3,
        ease: "power4.out",
        stagger: 0.15
      },
      0.9
    )
  }

  return tl
}
