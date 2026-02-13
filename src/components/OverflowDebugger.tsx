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

    // Create a small fixed banner to show first offender without opening DevTools
    const banner = document.createElement("div");
    Object.assign(banner.style, {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      zIndex: "999999",
      background: "rgba(0,0,0,0.7)",
      color: "#fff",
      fontSize: "12px",
      lineHeight: "1.4",
      padding: "6px 8px",
      fontFamily: "ui-monospace, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
      pointerEvents: "none",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    } as CSSStyleDeclaration);
    banner.textContent = "OverflowDebugger active: scanning...";
    document.body.appendChild(banner);

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
        const first = uniq[0] as HTMLElement;
        const r = first.getBoundingClientRect();
        banner.textContent = `Overflow offenders: ${uniq.length} | First: ${getSelectorPath(first)} | left=${Math.round(r.left)} right=${Math.round(r.right)} width=${Math.round(r.width)} vw=${vw}`;
      } else {
        // eslint-disable-next-line no-console
        console.log(`OverflowDebugger: no offenders @ ${vw}px`);
        banner.textContent = `Overflow OK @ vw=${vw}`;
      }
    };

    // Defer first scan to avoid React hydration mismatch (wait for paint + idle)
    const defer = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => scan(), 200);
        });
      });
    };
    defer();
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
      banner.remove();
    };
  }, []);

  return null;
}
