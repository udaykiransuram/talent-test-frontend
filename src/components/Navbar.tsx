"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { 
    href: "/product", 
    label: "Solutions",
    dropdown: [
      { href: "/product#diagnostics", label: "Precision Diagnostics", icon: "🎯", desc: "Identify learning gaps" },
      { href: "/product#erp", label: "School ERP", icon: "🏫", desc: "Streamline operations" },
      { href: "/product#alumni", label: "Alumni Management", icon: "🎓", desc: "Connect with graduates" },
      { href: "/product#omr", label: "OMR Scanning", icon: "📄", desc: "Automate grading" },
    ]
  },
  { href: "/benefits", label: "Benefits" },
  { href: "/case-study", label: "Case Studies" },
  { href: "/about", label: "Company" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);
  const headerInnerRef = useRef<HTMLDivElement | null>(null);
  const [headerH, setHeaderH] = useState<number>(80); // fallback to 80px (h-20)
  // Horizontal alignment handled by mirroring header container paddings on inner nav
  // Removed dynamic horizontal alignment states in favor of matching header container classes directly

  // Ensure portal only renders on client
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Recompute header height precisely when mobile menu toggles or scroll state changes
  useEffect(() => {
    if (!headerRef.current) return;
    const update = () => setHeaderH(headerRef.current!.getBoundingClientRect().height);
    update();
    const id = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(id);
  }, [mobileMenuOpen, scrolled]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(null);
  }, [pathname]);
  // Lock body scroll when mobile menu is open (better iOS Safari behavior)
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      html.style.overflowX = "hidden";
      body.style.overflow = "hidden";
      body.style.position = "fixed";
      body.style.width = "100%";
      body.style.top = `-${scrollY}px`;
      body.style.left = `-${scrollX}px`;
      return () => {
        const top = body.style.top;
        const left = body.style.left;
        html.style.overflowX = "";
        body.style.overflow = "";
        body.style.position = "";
        body.style.width = "";
        body.style.top = "";
        body.style.left = "";
        const y = parseInt(top || "0", 10) * -1;
        const x = parseInt(left || "0", 10) * -1;
        window.scrollTo(x, y);
      };
    } else {
      // Ensure clean state if toggled quickly
      html.style.overflowX = "";
      body.style.overflow = "";
      body.style.position = "";
      body.style.width = "";
      body.style.top = "";
      body.style.left = "";
    }
  }, [mobileMenuOpen]);

  // Track header height for accurate mobile overlay positioning
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setH = () => setHeaderH(el.getBoundingClientRect().height);
    setH();
    const ro = new ResizeObserver(setH);
    ro.observe(el);
    window.addEventListener("scroll", setH, { passive: true });
    window.addEventListener("orientationchange", setH);
    window.addEventListener("resize", setH);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", setH);
      window.removeEventListener("orientationchange", setH);
      window.removeEventListener("resize", setH);
    };
  }, []);

  // No header box measurement required

  // Close desktop dropdown when clicking outside header
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!headerRef.current) return;
      if (openDropdown && !headerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openDropdown]);

  // Link styles for light glass navbar (dark text)
  const getTextColor = (_baseColor: string, active: boolean) => {
    return active
      ? "text-teal-700 bg-teal-50 ring-1 ring-teal-200"
      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/60";
  };

  // Keep logo readable regardless of page/scroll state
  const logoColor = "text-slate-900";
  const logoSubColor = "text-slate-600";

  return (
    <header
      suppressHydrationWarning
      ref={headerRef}
      className={cn(
        "fixed top-0 z-[1000] w-full transition-all duration-300 border-b text-slate-900",
        // Light glass for professional look; slightly denser when scrolled
        scrolled
          ? "border-slate-200/70 bg-white/85 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          : "border-slate-200/60 bg-white/70 backdrop-blur-2xl shadow-[0_4px_18px_rgba(0,0,0,0.06)]"
      )}
    >
      <div ref={headerInnerRef} className="mx-auto max-w-7xl px-5 sm:px-8 md:px-16 pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-lg shadow-teal-500/20">
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-6 w-6"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="hidden flex-col md:flex">
            <span className={cn("text-lg font-bold leading-none tracking-tight transition-colors", logoColor)}>Alyra Tech</span>
            <span className={cn("text-[10px] uppercase tracking-wider font-medium transition-colors", logoSubColor)}>Precision Diagnostics</span>
          </div>
        </Link>


        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const hasDropdown = 'dropdown' in item;
            const textColorClass = getTextColor("", isActive); // Base color ignored as function handles it

            if (hasDropdown) {
              return (
                <div 
                  key={item.href}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.href)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                      textColorClass
                    )}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === item.href}
                    onClick={() => setOpenDropdown(openDropdown === item.href ? null : item.href)}
                  >
                    {item.label}
                    <svg className={cn("h-4 w-4 transition-transform duration-200 text-slate-600", openDropdown === item.href && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Mega Menu Dropdown */}
                  <div 
                    className={cn(
                      "absolute left-1/2 top-full w-[22rem] -translate-x-1/2 pt-3 transition-all duration-200 will-change-transform z-[1100]",
                      openDropdown === item.href 
                        ? "opacity-100 translate-y-0 scale-100 visible" 
                        : "opacity-0 translate-y-2 scale-95 invisible pointer-events-none"
                    )}
                    data-dropdown-panel
                  >
                    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 backdrop-blur-xl p-2 shadow-2xl ring-1 ring-slate-900/10 text-slate-900">
                      <div className="px-2 py-1.5">
                        <div className="text-[11px] uppercase tracking-wide text-slate-500">Solutions</div>
                      </div>
                      <div className="grid gap-1 p-1">
                        {item.dropdown?.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="flex items-start gap-3 rounded-xl p-3 transition-colors border border-transparent hover:border-slate-200 hover:bg-white/90 group/item"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-lg shadow-sm">
                              {subItem.icon}
                            </span>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-slate-900 flex items-center justify-between">
                                {subItem.label}
                                <svg className="h-4 w-4 text-slate-400 opacity-0 group-hover/item:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>
                              </div>
                              <div className="text-xs text-slate-600">{subItem.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40",
                  textColorClass
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link 
            href="/contact"
            className={cn(
              "hidden text-sm font-medium transition-colors md:block text-slate-700 hover:text-slate-900"
            )}
          >
            Contact
          </Link>
          <Link
            href="/talent-test"
            className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full bg-teal-600 px-6 font-medium text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 hover:scale-[1.02] hover:shadow-teal-600/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-teal-500 dark:hover:bg-teal-400"
          >
            <span className="mr-2">Baseline Test</span>
            <svg 
              className="h-4 w-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className={cn(
              "flex items-center justify-center h-11 w-11 rounded-xl md:hidden transition-colors",
              "text-slate-700 hover:bg-slate-100"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (portaled to body for reliable stacking on mobile) */}
      {mounted && mobileMenuOpen && createPortal(
        <>
          {/* Dimmed backdrop to focus the sheet and close on tap */}
          <button
            aria-label="Close menu overlay"
            className="fixed inset-0 z-[9997] md:hidden bg-slate-900/40 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Bottom sheet panel */}
          <div
            className="fixed inset-x-0 bottom-0 z-[9999] md:hidden overflow-y-auto overflow-x-hidden overscroll-contain w-screen max-w-none bg-gradient-to-b from-teal-50/90 to-white/85 backdrop-blur-xl border-t border-teal-600/10 rounded-t-2xl shadow-2xl ring-1 ring-teal-600/10"
            style={{
              top: `${headerH}px`,
              left: 0,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Menu"
          >
            <div aria-hidden className="mx-auto mt-3 mb-3 h-1.5 w-12 rounded-full bg-slate-300/80" />
            <div className="flex items-center justify-between px-6 pb-2">
              <span className="text-base font-semibold text-teal-700">Menu</span>
              <button
                aria-label="Close menu"
                className="h-9 w-9 inline-flex items-center justify-center rounded-full text-teal-700 hover:bg-teal-50/70 ring-1 ring-teal-600/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav
              className="mx-auto max-w-7xl px-5 sm:px-6 md:px-16 pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)] flex flex-col text-slate-900 gap-2 pt-1 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
              role="menu"
              aria-label="Mobile Navigation"
            >
              {/* Optional Search Pill */}
              <div className="px-1 sm:px-2">
                <div className="mx-1 flex items-center gap-2 rounded-full border border-teal-600/20 bg-white/70 backdrop-blur-md px-4 py-2.5 shadow-sm ring-1 ring-teal-600/10">
                  <svg className="h-4 w-4 text-teal-700/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"/></svg>
                  <input type="search" placeholder="Search site" className="w-full bg-transparent text-[15px] text-teal-950 placeholder:text-teal-900/50 outline-none" />
                </div>
              </div>

              {/* Explore Section */}
              <div className="px-3 pt-3 pb-1 text-[11px] uppercase tracking-wide text-teal-800/70">Explore</div>
              {navItems.filter((it) => !('dropdown' in it)).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="mx-2 block rounded-full bg-teal-600 px-5 py-3 text-[15px] font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-teal-500/70"
                  onClick={() => setMobileMenuOpen(false)}
                  role="menuitem"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span>{item.label}</span>
                    <svg className="h-5 w-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </div>
                </Link>
              ))}

              {/* Solutions Section */}
              <div className="px-3 pt-4 pb-1 text-[11px] uppercase tracking-wide text-teal-800/70">Solutions</div>
              {navItems.filter((it) => ('dropdown' in it)).map((item) => (
                <div key={item.href} className="mx-2">
                  <div className="rounded-2xl border border-transparent bg-transparent ring-0 shadow-none">
                    <button
                      className="flex w-full items-center justify-between px-5 py-3 text-[15px] font-semibold rounded-full bg-teal-600 text-white shadow-lg shadow-teal-600/20 transition-all hover:bg-teal-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-teal-500/70"
                      onClick={() => setMobileDropdownOpen(mobileDropdownOpen === item.href ? null : item.href)}
                      aria-expanded={mobileDropdownOpen === item.href}
                      aria-controls={`mobile-dd-${item.href}`}
                      role="menuitem"
                    >
                      {item.label}
                      <svg className={cn("h-5 w-5 transition-transform duration-200 text-white/90", mobileDropdownOpen === item.href && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileDropdownOpen === item.href && (
                      <div id={`mobile-dd-${item.href}`} className="px-1 pt-2 pb-1 space-y-2">
                        {item.dropdown!.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="flex items-center justify-between gap-3 rounded-full py-3 px-4 text-[15px] text-white bg-teal-600 hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 focus:outline-none focus:ring-2 focus:ring-teal-500/70"
                            onClick={() => setMobileMenuOpen(false)}
                            role="menuitem"
                          >
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/10">{subItem.icon}</span>
                            <div className="flex-1 min-w-0 text-left">
                              <div className="font-semibold truncate">{subItem.label}</div>
                              <div className="text-xs text-white/90 truncate">{subItem.desc}</div>
                            </div>
                            <svg className="h-5 w-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Footer quick actions */}
              <div className="mt-3 px-2 grid grid-cols-2 gap-2">
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center justify-center rounded-2xl bg-teal-600 text-white py-3 font-semibold shadow-md hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
                  Register
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center justify-center rounded-2xl border border-teal-600/20 bg-white/70 backdrop-blur-md py-3 font-semibold text-teal-950 hover:bg-white/90 shadow-sm ring-1 ring-teal-600/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/40">
                  Contact
                </Link>
              </div>
            </nav>
          </div>
        </>,
        document.body
      )}
    </header>
  );
}
