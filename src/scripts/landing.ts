import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { initHorizontal } from "./horizontal";
import { initIntro } from "./intro";
import { initMicro } from "./micro";
import { initParallax } from "./parallax";
import { initReveals, initStackedReveals } from "./reveals";
import { initSmoothScroll } from "./smooth";

gsap.registerPlugin(ScrollTrigger);

export function initLanding() {
  const root = document.querySelector<HTMLElement>("[data-landing]");
  const track = root?.querySelector<HTMLElement>("[data-track]");
  if (!root || !track) return;

  const mm = gsap.matchMedia();

  mm.add(
    "(min-width: 992px) and (prefers-reduced-motion: no-preference)",
    () => {
      const destroySmooth = initSmoothScroll();
      const tween = initHorizontal(root, track);
      const destroyReveals = initReveals(tween);
      const destroyParallax = initParallax(root, tween);
      const intro = initIntro(root);
      const destroyMicro = initMicro();

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh).catch(() => {});
      window.addEventListener("load", refresh, { once: true });
      const refreshTimer = window.setTimeout(refresh, 700);

      return () => {
        window.clearTimeout(refreshTimer);
        window.removeEventListener("load", refresh);
        destroyMicro();
        destroyParallax();
        destroyReveals();
        intro.kill();
        destroySmooth();
      };
    }
  );

  mm.add(
    "(max-width: 991px), (prefers-reduced-motion: reduce)",
    () => {
      const destroyReveals = initStackedReveals();
      const destroyMicro = initMicro();

      return () => {
        destroyMicro();
        destroyReveals();
      };
    }
  );
}
