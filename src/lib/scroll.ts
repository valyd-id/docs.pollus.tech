const NAV_H = 56; // 3.5rem (h-14) — must stay in sync with Layout.tsx NAV_H

/** Scroll an element into view with room for the sticky navbar. */
export const scrollToElement = (el: HTMLElement) => {
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_H - 8;
  window.scrollTo({ top, behavior: "smooth" });
};

/** Convenience wrapper — scrolls to the element with the given id if it exists. */
export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) scrollToElement(el);
};
