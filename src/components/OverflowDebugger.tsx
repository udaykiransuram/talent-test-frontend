"use client";

import { useEffect } from "react";

type Offender = {
  el: Element;
  rect: DOMRect;
  reason: string;
};

function getSelectorPath(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && parts.length < 5) {
    const name = node.nodeName.toLowerCase();
    const id = node.id ? `#${node.id}` : "";
    const cls = node.className && typeof node.className === "string"
      ? "." + node.className.trim().split(/\s+/).slice(0, 3).join(".")
      : "";
    parts.unshift(`${name}${id}${cls}`);
    node = node.parentElement;
  }
  return parts.join(" > ");
}

export default function OverflowDebugger() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const highlight = (els: Element[]) => {
      els.forEach((el) => {
        (el as HTMLElement).style.outline = "2px solid rgba(255,0,0,0.8)";
        (el as HTMLElement).style.outlineOffset = "-1px";
      });
    };

    const scan = () => {
      const offenders: Offender[] = [];
      const vw = document.documentElement.clientWidth;
      const all = document.querySelectorAll<HTMLElement>(
        "header, main, footer, section, div.cards-section, .container, .mx-auto, .max-w-7xl, video, nav, .Hero3D, body > *"
      );
      all.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const overRight = rect.right - vw;
        const overLeft = -rect.left;
        const scrollW = (el as HTMLElement).scrollWidth;
        const clientW = (el as HTMLElement).clientWidth;

        if (overRight > 1) {
          offenders.push({ el, rect, reason: `right overflow ${Math.round(overRight)}px` });
        }
        if (overLeft > 1) {
          offenders.push({ el, rect, reason: `left overflow ${Math.round(overLeft)}px` });
        }
        if (scrollW - clientW > 1) {
          offenders.push({ el, rect, reason: `scrollW>clientW by ${scrollW - clientW}px` });
        }
      });

      // Reset previous outlines
      all.forEach((el) => ((el as HTMLElement).style.outline = ""));

      const uniq = Array.from(new Set(offenders.map((o) => o.el)));
      highlight(uniq);

      if (uniq.length) {
        // Log concise offenders list
        // eslint-disable-next-line no-console
        console.groupCollapsed(`OverflowDebugger: ${uniq.length} offender(s) @ ${vw}px`);
        uniq.forEach((el) => {
          const rect = (el as HTMLElement).getBoundingClientRect();
          // eslint-disable-next-line no-console
          console.log(getSelectorPath(el), {
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
            scrollWidth: (el as HTMLElement).scrollWidth,
            clientWidth: (el as HTMLElement).clientWidth,
          });
        });
        // eslint-disable-next-line no-console
        console.groupEnd();
      } else {
        // eslint-disable-next-line no-console
        console.log(`OverflowDebugger: no offenders @ ${vw}px`);
      }
    };

    scan();
    const onResize = () => scan();
    const onScroll = () => scan();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => scan());
    ro.observe(document.documentElement);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  return null;
}
