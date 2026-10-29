# TechForward Insights - Accessible Web Portal Project

> **Project Goal:** Infuse modern web interfaces with accessibility best practices, conforming to W3C WCAG 2.1 & 2.2 Level AA standards and WAI-ARIA Authoring Practices.

---

## 📁 Project Directory Structure

```text
accessible_portal/
├── index.html                      # Remediated production accessible interface
├── css/
│   └── style.css                   # Accessible stylesheet (high-contrast, responsive, focus rings)
├── js/
│   └── app.js                      # Accessible JavaScript (keyboard nav, ARIA live, focus traps)
├── before_audit/                   # Baseline un-audited prototype for comparative analysis
│   ├── index_inaccessible.html     # Baseline HTML exhibiting common accessibility anti-patterns
│   └── style_inaccessible.css      # Baseline CSS with outline:none, low contrast, fixed units
├── ACCESSIBILITY_AUDIT_REPORT.md   # Comprehensive audit report, WCAG mapping & justifications
└── README.md                       # Project overview and testing documentation
```

---

## 🚀 Quick Start & How to View

1. **Viewing in Browser:**
   - Open `index.html` directly in any modern web browser (Chrome, Firefox, Safari, Edge).
   - To inspect the baseline un-audited state, open `before_audit/index_inaccessible.html`.

2. **Testing Keyboard Navigation:**
   - Press <kbd>Tab</kbd> on page load to reveal the **"Skip to main content"** link.
   - Use <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> to move sequentially through navigation, filter chips, article links, accordions, and form fields.
   - Press <kbd>Enter</kbd> or <kbd>Space</kbd> on any accordion trigger or button.
   - In the **FAQ Accordion**, use <kbd>↑</kbd>, <kbd>↓</kbd>, <kbd>Home</kbd>, and <kbd>End</kbd> to cycle between accordion headers.
   - Open the **"Share Article"** dialog: verify that focus shifts inside the dialog, <kbd>Tab</kbd> cycles only within the modal (focus trap), and pressing <kbd>Esc</kbd> closes the modal and returns focus to the triggering button.

3. **Testing Screen Readers:**
   - Compatible with NVDA (Windows), JAWS (Windows), VoiceOver (macOS / iOS), and TalkBack (Android).
   - Observe live region announcements when typing in the search bar or toggling topic filters (`aria-live="polite"`).
   - Observe validation error announcements on form submission (`role="alert"` and `aria-invalid="true"`).

4. **Testing Display Modes:**
   - Use the top accessibility toolbar to toggle:
     - **Dark Mode** (`aria-pressed` state change, high-contrast dark palette)
     - **High Contrast Mode** (Windows High Contrast Mode compatible, pure black/white borders)
     - **Text Sizing** (Scales typography cleanly to 120% without horizontal scroll)

---

## 📋 Summary of Key Accessibility Improvements

| Feature / Domain | Baseline Flaw (Before Audit) | Remediated Implementation (After) | WCAG SC |
| :--- | :--- | :--- | :--- |
| **Document Landmarks** | Generic `<div>` soup (`#header`, `.main`) | Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`) | 1.3.1 Info and Relationships |
| **Heading Structure** | Skipped levels (`<h1>` &rarr; `<h4>` &rarr; `<h2>`) | Logical hierarchical nesting (`<h1>` &rarr; `<h2>` &rarr; `<h3>`) | 1.3.1, 2.4.6 Headings & Labels |
| **Bypass Blocks** | No skip link; repetitive tabbing required | Visually hidden Skip to Main Content link revealed on focus | 2.4.1 Bypass Blocks |
| **Keyboard Operability** | Clickable `<div>` buttons without keyboard listeners | Native `<button>` elements with Enter/Space keyboard support | 2.1.1 Keyboard |
| **Focus Indication** | `* { outline: none !important; }` | High-contrast `3px` outline with `3px` offset via `:focus-visible` | 2.4.7 Focus Visible |
| **Text Contrast** | Low contrast text (`#94a3b8` on white = 2.56:1) | High-contrast AAA-level palette (`#0f172a` on white = 17.85:1) | 1.4.3 Contrast (Minimum) |
| **Form Accessibility** | Inputs without `<label>`; reliance on placeholders | Explicit `<label for="...">`, hints via `aria-describedby`, `role="alert"` | 3.3.1, 3.3.2 Labels & Errors |
| **Modal Dialog** | Floating `<div>` without focus trap or escape key | WAI-ARIA Dialog (`role="dialog"`, `aria-modal="true"`, focus trap & restore) | 2.1.2 No Keyboard Trap |
| **Dynamic Updates** | Search results updated silently | Polite live region (`aria-live="polite"`, `role="status"`) announces result counts | 4.1.3 Status Messages |
| **Motion Sensitivity** | Abrupt unconstrained transitions | Respects `@media (prefers-reduced-motion: reduce)` | 2.3.3 Animation from Interactions |

For the complete technical analysis, tool audit logs, and accessibility justifications, refer to **`ACCESSIBILITY_AUDIT_REPORT.md`**.
