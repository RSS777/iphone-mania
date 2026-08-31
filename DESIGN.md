---
name: iPhone Mania
description: A repair-bench work order for a two-partner used-iPhone resale business — the ticket book, not the SaaS card.
colors:
  paper: "#f2f0ea"
  paper-line: "#d8d3c4"
  carbon: "#b9b4a5"
  carbon-backdrop: "#ada58f"
  ink: "#22201c"
  ink-soft: "rgb(34 32 28 / 74%)"
  ink-faint: "rgb(34 32 28 / 66%)"
  stamp: "#3a6b52"
  stamp-dark: "#2c5340"
  errata: "#c9463c"
  errata-soft: "rgb(201 70 60 / 12%)"
typography:
  display:
    fontFamily: "Courier Prime, monospace"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Public Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Courier Prime, monospace"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.18em"
rounded:
  none: "0px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "36px"
components:
  button-stamp:
    backgroundColor: "transparent"
    textColor: "{colors.stamp}"
    typography: "{typography.label}"
    padding: "10px"
  button-stamp-pending:
    backgroundColor: "transparent"
    textColor: "{colors.stamp-dark}"
  field-ticket:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "8px 0"
  card-ticket:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px 28px 36px"
---

# Design System: iPhone Mania

## Overview

**Creative North Star: "Ordem de Serviço de Bancada" (Repair-Bench Work Order)**

iPhone Mania is a private two-partner tool, used mid-transaction on a phone in daylight, that wants to feel like the paper work-order ticket a repair bench hands you, not a generic SaaS auth card. Every surface is a single talão (ticket) torn from a carbon-paper pad: a paper card with hand-torn top/bottom edges, pinned under a metal clipboard clip, carrying a stapled-looking corner tag, sitting on a warm carbon-paper backdrop. The world is built from paper, ink, and one sparingly-used stamp of institutional green; it has confirmed no dark mode (see Layout) and no decorative iconography — the only genuinely metallic, non-paper object in the whole world is the clip.

Confirmed visual rejection: no generic rounded-corner SaaS card, no drop-shadow-heavy "modern dashboard" chrome, no blue focus rings or link colors (focus and caret are re-themed to stamp-green so nothing breaks the paper/ink/stamp/errata palette).

**Key Characteristics:**
- Paper-and-carbon material world: torn edges, ruled lines, carbon-fiber cross-hatch texture, a single metal clip
- One monospace "ticket voice" (Courier Prime) reserved for titles, labels, and the stamp button; Public Sans carries all reading body copy
- A hand-stamped button as the system's signature interactive gesture, deliberately imperfect (rotated, double-ringed, ink-bled)
- Errata-red is reserved strictly for error/correction states — never decorative
- Corner tags replace kickers/eyebrows: they read as a stapled paper label pinned to the ticket's corner, not as inline text sitting above a title

## Colors

Palette is a paper ledger: warm off-white paper, near-black ink, a muted institutional stamp-green, and an errata-red held back for correction states only.

### Primary
- **Ink** (`#22201c`): primary text color, ticket titles, borders when at full strength. This is the "ink" the whole ticket is written in.

### Secondary
- **Stamp Green** (`#3a6b52`): the sparse accent — the sign-in/submit stamp, focus rings, caret color, "turno aberto" state tag, hover states on secondary links. Deep variant **Stamp Dark** (`#2c5340`) marks pending/active stamp states.

### Tertiary
- **Errata Red** (`#c9463c`): reserved strictly for error and correction states (`ErrataNote`, sign-out hover as a "this ends the session" cue). Never used for emphasis, brand, or decoration. Its soft wash (`rgb(201 70 60 / 12%)`) is the only fill it gets, as the backdrop of an errata note.

### Neutral
- **Paper** (`#f2f0ea`): the ticket surface itself — every card's background, and the body background at the page level.
- **Carbon Backdrop** (`#ada58f`): the page-level background behind the ticket, standing in for the desk/carbon-pad the ticket sits on.
- **Carbon** (`#b9b4a5`): a lighter step of the same backdrop family, used where the carbon tone needs to sit lighter than the full backdrop.
- **Paper Line** (`#d8d3c4`): dashed section rules, field underlines, torn-edge drop-shadow reference — the ruled-notebook line color.
- **Ink Soft** (`rgb(34 32 28 / 74%)`): secondary reading text (subheads, helper copy, secondary link color).
- **Ink Faint** (`rgb(34 32 28 / 66%)`): tertiary text — field placeholders, footnote/legal-line copy, corner-tag default tone.

### Named Rules
**The Errata-Only Rule.** Errata-red never appears outside an actual error, correction, or destructive-action hint (e.g., sign-out hover). If a screen has no error, it has no red.

**The One Stamp Rule.** Stamp-green is the only accent color in the system. It marks exactly one primary action's identity (the submit stamp) plus focus/active state — it does not proliferate into multiple competing accent uses on one screen.

## Typography

**Display/Label Font:** Courier Prime (with monospace fallback)
**Body Font:** Public Sans (with sans-serif fallback)

**Character:** A typewriter/carbon-copy voice (Courier Prime) is reserved for anything that reads as "part of the ticket's official print" — titles, field labels, the stamp button, tags, footnote copy — while ordinary reading text (helper sentences, form-adjacent prose) runs in the humanist, highly legible Public Sans. The pairing keeps the ticket world evocative without forcing every sentence through a monospace face.

### Hierarchy
- **Display** (bold/700, 1.875rem `text-3xl`, tight line-height, `.ink-title` double-strike text-shadow): the ticket's title (`iPhone Mania`) — appears once per surface, in the ticket header.
- **Label** (bold/700, 0.75rem `text-xs`–0.625rem `text-[10px]`, uppercase, 0.14–0.2em letter-spacing, Courier Prime): field labels, corner tags, stamp-button text, errata note lede, footnote copy under the ticket. This is the workhorse "printed on the ticket" voice.
- **Body** (regular/400, 0.875rem `text-sm`, Public Sans): helper sentences under the title, informational paragraphs, error message body text.
- **Field Input** (regular, 1.125rem `text-lg`, Public Sans): the actual typed value in a `TicketField`, sized larger than surrounding label/body text so it reads as the "filled-in" part of the form.

### Named Rules
**The Ticket-Voice Rule.** Courier Prime is used only for things that are "printed on the form" (titles, labels, tags, the stamp, footnotes) — never for paragraphs of prose. Reading copy stays in Public Sans so the product doesn't read as a monospace-everything gimmick.

## Layout

Single-column, single-card composition, centered on the viewport at all sizes — this is a mobile-first, one-hand-usable ticket, not a multi-column dashboard. The ticket card caps at `max-w-sm` (24rem) and is centered with generous vertical padding (`py-12`) on a full-height flex container. Internal card padding runs `px-7 pt-6 pb-9` (28px sides, 24px top, 36px bottom — bottom is deliberately deepest to leave room for the torn edge and give the stamp button breathing room). Form fields stack with a `gap-6` (24px) rhythm; the mobile and desktop screenshots show the identical composition just re-centered, confirming this is not a responsive redesign but the same ticket at any width.

**The Light-Only Rule.** The system commits to a single light "paper" mode with no dark-mode variant. This is a deliberate product fit, not an oversight: iPhones are evaluated outdoors in daylight during purchase, so a light, high-contrast paper ground is legible in direct sun where a dark surface would wash out.

## Elevation & Depth

The system is flat by material logic, not by absence of depth: depth comes from paper physicality (torn edges, a pinned metal clip, carbon fiber texture, dashed rule lines) rather than from drop shadows implying floating UI layers. The one shadow in use is a restrained "ticket resting on the desk" cue, not a hover/lift interaction shadow.

### Shadow Vocabulary
- **Ticket Rest** (`box-shadow: 0 1px 0 var(--paper-line), 0 18px 36px -24px rgb(34 32 28 / 45%)`): the ticket card's only shadow — a hairline paper-edge highlight plus a soft, tight ambient shadow that reads as the ticket resting slightly above the carbon backdrop, not floating.
- **Torn-Edge Drop** (`filter: drop-shadow(0 2px 2px rgb(34 32 28 / 22%))`): applied to the torn-edge SVG teeth so the paper tear itself casts a sliver of shadow onto the surface below.
- **Corner Tag Lip** (`box-shadow: 0 1px 0 var(--paper-line)`): a one-pixel paper-lip shadow under the stapled corner tag, reading as a small separate piece of paper pinned on top of the ticket.

### Named Rules
**The Material-Not-Elevation Rule.** Depth is conveyed by paper materials (torn edges, the metal clip, carbon texture, ruled lines) before it is conveyed by shadow. Do not add hover-lift or floating-card shadows to imply interactivity; use the stamp/ink/rotation vocabulary instead.

## Shapes

The dominant silhouette is the torn rectangle: a straight-sided card whose top and bottom edges are jagged (`TornEdge`, an SVG zig-zag path), never a rounded-corner card. Corner radius is otherwise unused (`rounded: none` — square corners everywhere except the deliberately organic stamp silhouette). The one exception is the stamp button, whose border uses an asymmetric compound `border-radius` (`255px 15px 225px 15px / 15px 225px 15px 255px`) to fake an irregular hand-stamped oval rather than a clean ellipse or rounded rect — this shape is unique to that one component and is not a general radius token. Borders are otherwise hairline or dashed: `border-dashed` marks section rules, corner tags, and the errata note; solid 2px borders mark the stamp's ink rings.

## Components

### Buttons (Stamp Button — signature component)
The system's only button pattern, and its signature interaction: a submit control styled as a hand-stamped ink mark rather than a filled rectangle.
- **Shape:** irregular stamped-oval silhouette via compound border-radius (see Shapes), double concentric ring (2px outer at 70% opacity, 3px inner at full `--stamp`), both passed through the `ink-roughen` SVG `feTurbulence`/`feDisplacementMap` filter (`baseFrequency="0.018 0.05"`, `scale="7"`) for a hand-inked wobble.
- **Primary:** transparent fill, `--stamp` colored ring and label text, rotated `-2deg` at rest to read as slightly off the strike; label is Courier Prime, bold, uppercase, `0.2em` tracking.
- **States:** on press, scales to `0.94` and straightens toward `0.5deg` rotation; a radial `--stamp` glow fades in at 20% opacity on `:active`; while pending (form submission), the ring switches to `--stamp-dark`, label switches to the pending copy (e.g. "Carimbando…"), and the button disables/`aria-busy`s.
- **Ghost/Secondary:** plain text links (e.g. "Esqueci minha senha") — Courier Prime for form-adjacent action links styled bold/uppercase/underlined in `--stamp-dark`, or Public-Sans-weight inline text links underlined in `--paper-line` that shift to `--stamp-dark` (or `--errata` for a destructive action like sign-out) on hover. No button-shaped secondary control exists.

### Cards / Containers (Ticket Card)
- **Corner Style:** square (`rounded: none`); top and bottom edges replaced by the `TornEdge` SVG teeth rather than a border-radius.
- **Background:** `--paper`, with the `.carbon-texture` cross-hatch (two overlaid `repeating-linear-gradient`s at 128deg/38deg, reading as fiber grain not stripes) layered underneath.
- **Shadow Strategy:** see Elevation & Depth — Ticket Rest shadow only.
- **Border:** none on the card itself; internal sections are separated by `border-dashed border-paper-line`.
- **Internal Padding:** `28px` sides, `24px` top, `36px` bottom.
- **Pinning:** a `MetalClip` SVG is absolutely positioned straddling the card's top edge, the only chromed/metallic asset in the system, reinforcing "this ticket is pinned to a clipboard," not floating free.

### Inputs / Fields (Ticket Field)
- **Style:** no box, no fill — a ruled line: `border-b-2 border-paper-line`, transparent background, value text at `1.125rem` in ink. A faint second line (`.ruled-line-echo`, `--ink-faint` at 0.8 opacity, offset 4px below) doubles the rule to read as carbon-copy ghosting.
- **Label:** Courier Prime label sits above the line, bold/uppercase/`0.18em` tracking, in `--ink-soft`.
- **Focus:** underline switches to `--stamp-dark`; global `:focus-visible` also draws a `2px solid --stamp-dark` outline with 2px offset (browser default blue is fully overridden system-wide, as is caret color).
- **Error/Disabled:** no per-field inline error state observed; errors surface as a standalone `ErrataNote` block below the field group, not as field-level red borders.

### Errata Note
A correction/error callout styled as an errata stamp: `-rotate-1`, `border-2 border-dashed border-errata`, `bg-errata-soft` fill, Courier Prime body, bold-uppercase "Errata — " lede in `--errata`. Used only for actual error states (login failure, reset-password validation) — never decorative.

### Corner Tag
A small stapled-paper label pinned to the ticket's top-right corner (`absolute -top-3 right-5 rotate-3`), dashed border, Courier Prime, uppercase, `0.16em` tracking, with a one-line paper-lip shadow. Two tones: `ink` (default, `border-paper-line`/`text-ink-faint` — e.g. "OS Nº 002") and `stamp` (`border-stamp`/`text-stamp-dark` — e.g. "Turno aberto" status). This is the system's only per-screen status/identifier marker.

### Navigation
No persistent nav chrome exists yet (single-ticket screens only, per the shipped surfaces). The pattern established for wayfinding is minimal inline text links (underlined, Courier Prime or Public Sans depending on context) rather than button-styled nav — see Buttons/Ghost above.

## Do's and Don'ts

### Do:
- **Do** keep errata-red confined to actual error/correction/destructive states (`ErrataNote`, sign-out hover) — never as decoration or emphasis.
- **Do** use the torn-edge silhouette (`TornEdge`) for the top and bottom of any full ticket-style card; don't substitute a rounded corner there.
- **Do** route all focus/caret/selection styling through `--stamp`/`--stamp-dark` — never let default browser blue reappear.
- **Do** reserve Courier Prime for "printed on the ticket" elements (titles, labels, tags, the stamp, footnotes) and keep reading prose in Public Sans.
- **Do** treat the corner tag as the system's status/ID marker — a small dashed-border stapled label pinned at the card's top-right corner, not inline text stacked above the title.
- **Do** keep the world light-only; the paper ground is a deliberate outdoor-daylight legibility choice (see PRODUCT.md Operating Context), not an unfinished dark-mode gap.

### Don't:
- **Don't** add drop-shadow-heavy floating-card chrome or hover-lift shadows — depth comes from paper materials (torn edges, the metal clip, carbon texture), not shadow escalation.
- **Don't** introduce a second accent color alongside stamp-green; the palette's restraint (one accent, one error color, ink/paper neutrals) is load-bearing to the "real work order" read.
- **Don't** apply rounded corners to card containers; square corners plus the torn-edge tooth pattern are the system's only silhouette outside the one hand-stamped button.
- **Don't** reuse the stamp button's organic compound-radius/turbulence-filter treatment on other components; it is a one-time signature reserved for the primary submit action, not a general "distressed" style to sprinkle around.
