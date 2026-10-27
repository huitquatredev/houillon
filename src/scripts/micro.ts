type BottleState = "red" | "white";

/**
 * Micro-interactions of the original page:
 * - Red / White picker: hovering previews the colour, clicking selects it.
 *   Selecting White swaps the picker bottle and reveals the matching glass
 *   photo in the next panel.
 * - Dead links and the visual-only newsletter form never navigate/submit.
 */
export function initMicro() {
  const root = document.querySelector<HTMLElement>("[data-landing]");
  if (!root) return () => {};

  const onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-noop]")) event.preventDefault();
  };

  const onSubmit = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-newsletter]")) event.preventDefault();
  };

  root.addEventListener("click", onClick);
  root.addEventListener("submit", onSubmit);

  const picker = root.querySelector<HTMLElement>("[data-picker]");
  const buttons = Array.from(
    root.querySelectorAll<HTMLElement>("[data-bottle-btn]")
  );

  let selected: BottleState =
    picker?.dataset.selected === "white" ? "white" : "red";
  let preview: BottleState | null = null;

  const render = () => {
    if (picker) {
      const shown = preview ?? selected;
      picker.classList.toggle("is-white", shown === "white");
      picker.classList.toggle("is-preview-red", preview === "red");
      picker.classList.toggle("is-preview-white", preview === "white");
    }

    buttons.forEach((button) => {
      const active = button.dataset.bottleBtn === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const cleanups: Array<() => void> = [];

  buttons.forEach((button) => {
    const state: BottleState =
      button.dataset.bottleBtn === "white" ? "white" : "red";

    const enter = () => {
      preview = state;
      render();
    };
    const leave = () => {
      preview = null;
      render();
    };
    const focus = () => {
      preview = state;
      render();
    };
    const blur = () => {
      preview = null;
      render();
    };
    const click = () => {
      selected = state;
      preview = null;
      render();
    };

    button.addEventListener("pointerenter", enter);
    button.addEventListener("pointerleave", leave);
    button.addEventListener("focus", focus);
    button.addEventListener("blur", blur);
    button.addEventListener("click", click);

    cleanups.push(() => {
      button.removeEventListener("pointerenter", enter);
      button.removeEventListener("pointerleave", leave);
      button.removeEventListener("focus", focus);
      button.removeEventListener("blur", blur);
      button.removeEventListener("click", click);
    });
  });

  render();

  return () => {
    cleanups.forEach((cleanup) => cleanup());
    root.removeEventListener("click", onClick);
    root.removeEventListener("submit", onSubmit);
  };
}
