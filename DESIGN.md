---
name: WalkIn
description: Open slots at campus shops, posted as a photocopied timetable on the hall notice board.
colors:
  felt: "#1c5845"
  felt-deep: "#134232"
  felt-raised: "#236650"
  on-felt: "#eef6f1"
  on-felt-2: "#c3ddd1"
  paper: "#fbfbf9"
  paper-2: "#eff0ec"
  paper-3: "#e2e4de"
  ink: "#161616"
  ink-2: "#3f4143"
  ink-3: "#5f6265"
  rule: "#161616"
  rule-soft: "#b9bcb5"
  hl-yellow: "#fff04a"
  hl-wash: "#fffbd0"
  hl-blue: "#8fd5ff"
  hl-pink: "#ff92c8"
  hl-green: "#8eef9f"
  hl-orange: "#ffbd59"
  hl-lilac: "#d6b8ff"
  ink-violet: "#5a35a8"
  ink-blue: "#1d47b3"
  ink-red: "#c11f2e"
  ink-green: "#17723a"
  ink-black: "#2a2a2a"
  pen: "#1b3a9b"
  pin: "#d63a3a"
  pin-yellow: "#e6b800"
  pin-blue: "#2f6fd6"
  pin-green: "#2a9d55"
typography:
  display:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "clamp(2.25rem, 1.4rem + 3.2vw, 4.25rem)"
    fontWeight: 850
    lineHeight: 0.98
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "clamp(1.6rem, 1.05rem + 2.4vw, 2.375rem)"
    fontWeight: 850
    lineHeight: 0.98
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    lineHeight: 1.15
    fontVariation: "'wdth' 112"
  time:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 850
    lineHeight: 1.1
    fontVariation: "'wdth' 118"
  body:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "'tnum' 1"
  lede:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
  meta:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  caption:
    fontFamily: "Arimo, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1
  button:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 800
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 115"
  stamp:
    fontFamily: "Archivo, 'Arial Narrow', sans-serif"
    fontSize: "0.95rem"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 112"
rounded:
  tag: "1px"
  radius: "2px"
  stamp: "4px"
  bottom-sheet: "6px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
  s-8: "64px"
  s-9: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.radius}"
    padding: "0 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "#000000"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.radius}"
    padding: "0 24px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.hl-yellow}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.ink-red}"
    typography: "{typography.button}"
    rounded: "{rounded.radius}"
    padding: "0 24px"
    height: "44px"
  button-danger-hover:
    backgroundColor: "{colors.ink-red}"
    textColor: "{colors.paper}"
  button-sm:
    padding: "0 12px"
    height: "36px"
  icon-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.radius}"
    size: "40px"
  icon-button-hover:
    backgroundColor: "{colors.hl-yellow}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.radius}"
    padding: "10px 12px"
    height: "44px"
  input-focus:
    backgroundColor: "#fffde0"
  choice:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.radius}"
    padding: "0 12px"
    height: "40px"
  choice-hover:
    backgroundColor: "{colors.paper-2}"
  choice-selected:
    backgroundColor: "{colors.hl-yellow}"
  time-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.radius}"
    padding: "4px 10px"
    height: "44px"
    width: "82px"
  time-button-hover:
    backgroundColor: "{colors.hl-wash}"
  tag:
    backgroundColor: "{colors.hl-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.tag}"
    padding: "5px 7px 4px"
  tag-barber:
    backgroundColor: "{colors.hl-blue}"
  tag-salon:
    backgroundColor: "{colors.hl-pink}"
  tag-laundry:
    backgroundColor: "{colors.hl-green}"
  tag-printing:
    backgroundColor: "{colors.hl-orange}"
  stamp-confirmed:
    textColor: "{colors.ink-violet}"
    typography: "{typography.stamp}"
    rounded: "{rounded.stamp}"
    padding: "6px 12px 5px"
  stamp-received:
    textColor: "{colors.ink-blue}"
  stamp-ready:
    textColor: "{colors.ink-green}"
  stamp-declined:
    textColor: "{colors.ink-red}"
  stamp-done:
    textColor: "{colors.ink-black}"
  stamp-sm:
    padding: "4px 8px 3px"
  stamp-lg:
    padding: "10px 20px 8px"
  sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.radius}"
    padding: "clamp(16px, 2.6vw, 32px)"
  slip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.radius}"
    padding: "24px"
    width: "min(460px, calc(100vw - 24px))"
  slip-phone:
    rounded: "{rounded.bottom-sheet}"
  timetable-cell:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    height: "58px"
  timetable-cell-hover:
    backgroundColor: "{colors.hl-wash}"
  timetable-cell-full:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink-3}"
  timetable-cell-past:
    backgroundColor: "{colors.paper-3}"
  timetable-header:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink}"
    height: "40px"
  nav-link:
    textColor: "{colors.on-felt}"
    typography: "{typography.label}"
    padding: "8px 0"
  dash-rail:
    backgroundColor: "{colors.felt}"
    textColor: "{colors.on-felt}"
    width: "252px"
  dash-nav-item:
    textColor: "{colors.on-felt}"
    typography: "{typography.label}"
    rounded: "{rounded.radius}"
    padding: "0 12px"
    height: "44px"
  dash-nav-item-hover:
    backgroundColor: "{colors.felt-raised}"
  dash-nav-item-active:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  segmented-option:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0 16px"
    height: "36px"
  segmented-option-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
---

# Design System: WalkIn

## Overview

**Creative North Star: "The Hall Notice Board"**

WalkIn is the photocopied timetable pinned to a campus hall notice board. Availability is drawn the way every student already reads a course timetable: shops as rows, hours as columns, open cells you can mark. The ground is deep green felt from edge to edge. Everything a visitor reads sits on photocopy-white sheets held up by pushpins, each sheet set at a slight tilt and ruled in heavy toner black. You mark the slot you want with a fluorescent highlighter, the same way you mark your own courses. The shop's answer comes back as a rubber stamp in office ink.

Density matches a real timetable. Cell text is compact (13 to 14px) with tabular figures, rows are 58px, the shop column stays put, and on a phone the grid scrolls sideways under it. The display type is loud: expanded black Archivo caps, like a notice header run off on the department copier. Everything else is typed in Arimo, the Arial voice every printed notice is written in.

The world splits by mode. Persuade and customer surfaces (the board, shop page, my bookings, sign-in) are sheets pinned to felt. The shop dashboard is a working desk: a felt rail on the left and one flat, untilted paper work area. It uses ordinary controls (fields, segmented controls, data tables, drawers), and the world reaches them only through toner rules, highlighters and stamps. The system rejects the booking-app default of a search hero over a grid of photo cards. There are no photographs; availability is the picture.

**Key Characteristics:**
- Felt-green ground with a fine fractal-noise nap, and paper sheets pinned on top with soft, downward paper shadows.
- Toner-black rules, never hairlines: 3px closes a title block, 2px frames and divides every customer sheet.
- Five fluorescent highlighters: yellow marks what is yours, and blue, pink, green and orange code the shop types.
- Office-stamp inks carry booking status, with a speckled double border, multiply blend and a tilt.
- Archivo expanded caps for notices, Arimo for everything typed. No third face.
- Motion grammar: a highlighter swipe for selection, a stamp thud for a status change, a slip that slides in and settles like paper.

## Colors

A notice board in daylight: deep felt green, photocopy white and toner black, lit by fluorescent highlighters and stamped in office inks.

### Primary
- **Highlighter Yellow** (#fff04a): the viewer's mark. It fills the selected timetable cell, day tab, time and choice, underlines the current nav link and active tab, colours text selection and the focus ring, sits behind the "In" of the wordmark, and fills ghost buttons, icon buttons and link buttons on hover. On the shop's calendar it marks a booked (confirmed or in-progress) block, like a taken slot on a highlighted timetable.
- **Highlighter Wash** (#fffbd0): the faint yellow tint before the swipe lands. Shown on hover over open cells, time buttons and price-list rows, on a dropzone during drag-over, and on today's column header in the shop calendar.

### Secondary
The shop-type highlighters. They are always fills behind ink text, blended with multiply over paper.
- **Barber Blue** (#8fd5ff): barbershops.
- **Salon Pink** (#ff92c8): salons.
- **Laundry Green** (#8eef9f): laundry. On the shop calendar it also fills a block that is ready for pickup.
- **Print Orange** (#ffbd59): printing. In the dashboard rail it also sets the "Draft" status line, which sits on felt.
- **Other Lilac** (#d6b8ff): other shops, such as tailoring.

Yellow is never a shop type: it is reserved for the viewer's own marks, so every shop-type highlighter is a different ink.

### Tertiary
Stamp inks and the pen.
- **Confirmed Violet** (#5a35a8): the stamp for confirmed and in-progress bookings.
- **Received Blue** (#1d47b3): the stamp for pending bookings ("Received", held while the shop checks). It also outlines pending blocks on the shop calendar and frames the requests count badge in the dashboard rail.
- **Declined Red** (#c11f2e): the stamp for declined, expired and cancelled bookings. It is also the colour of danger buttons, alerts, the "last starts left" minute marks in timetable cells, and the calendar's now-line.
- **Ready Green** (#17723a): the stamp for ready-for-pickup bookings.
- **Done Black** (#2a2a2a): the stamp for completed bookings.
- **Ballpoint Blue** (#1b3a9b): the pen. Used for the text caret.
- **Pushpin Red** (#d63a3a), **Pushpin Yellow** (#e6b800), **Pushpin Blue** (#2f6fd6), **Pushpin Green** (#2a9d55): pushpin heads. Red is the default; a sheet with two pins mixes colours.

### Neutral
- **Notice-Board Felt** (#1c5845): the page ground behind every customer surface and the dashboard rail. It is also the browser theme colour.
- **Deep Felt** (#134232): the site footer band.
- **Raised Felt** (#236650): hover on items in the dashboard rail.
- **Chalk** (#eef6f1) and **Faded Chalk** (#c3ddd1): text on felt. Chalk is primary and Faded Chalk is secondary (the account name, rail status).
- **Photocopy White** (#fbfbf9): sheets, slips, drawers, inputs and the dashboard work area.
- **Copier Grey** (#eff0ec): table header rows, full cells, notes, stepper buttons, dropzones and choice hover.
- **Shaded Copy** (#e2e4de): past cells, completed calendar blocks and skeleton lines.
- **Toner Black** (#161616): text, primary buttons, field borders and every structural rule (`rule` holds the same value).
- **Toner 2** (#3f4143): lede and secondary copy. **Toner 3** (#5f6265): meta, hints, placeholders and inactive tabs.
- **Pencil Grey** (#b9bcb5): perforations, tear lines, the calendar's hour ticks and the dash in a closed cell.

### Named Rules
**The Yellow Is Yours Rule.** Highlighter Yellow means "yours, or chosen right now": the selected cell, day, time or option, the current page, the focused control, and a booked slot. It is never decoration.

**The Highlighter-Behind-Ink Rule.** On paper, highlighters are fills under ink text, multiplied into the sheet. They are never set as text colour on paper.

**The Stamp Ink Rule.** A booking status word is always a stamp in its ink: blue Received, violet Confirmed and In progress, green Ready, red Declined, Expired and Cancelled, black Done.

## Typography

**Display Font:** Archivo, a variable font with a width axis, set at 112 to 125% width (fallback: Arial Narrow, sans-serif)
**Body Font:** Arimo (fallback: Arial, sans-serif)
**Character:** Expanded black caps shout the way a notice header does. Arimo is metrically identical to Arial, so everything else reads as a typed notice.

### Hierarchy
- **Display** (Archivo 850 at 125% width, clamp(2.25rem, 1.4rem + 3.2vw, 4.25rem), line-height 0.98, -0.01em, uppercase): the title of a sheet, such as "Open slots on campus", a shop's name or "My bookings". It wraps at about 14ch on the board and 18ch on a shop page.
- **Headline** (the same voice at clamp(1.6rem, 1.05rem + 2.4vw, 2.375rem), uppercase): section notices on the front door (set in Chalk when they sit on felt) and dashboard page titles such as "Today", "Requests" and "Price list".
- **Title** (Archivo 800 at 112%, 1.375rem, line-height 1.15, sentence case): headings inside a sheet ("Your slips", "Price list"), slip and drawer titles. Request slips use it at 1.125rem.
- **Time** (Archivo 850 at 118%, 1.75rem, line-height 1.1, lowercase "10am"): the large time on booking rows and request slips. Day tabs use the same voice at 800 and 1.375rem.
- **Body** (Arimo 400, 1rem, line-height 1.55, tabular figures): all running text. **Lede** is 1.125rem in Toner 2, capped at 60ch, and dashboard summaries cap at 64ch.
- **Label** (Arimo 700, 0.875rem): field labels, nav links and choices. Section labels and table heads use 800, and timetable heads use 800 at 0.8125rem.
- **Meta** (Arimo 400, 0.875rem, Toner 3): supporting lines and footnotes. Timetable sub-rows and hints use 0.8125rem.
- **Caption** (Arimo 700, 0.8125rem, line-height 1): shop-type tags.
- **Button** (Archivo 800 at 115%, 0.875rem, 0.02em, uppercase): all `.btn` labels. The small size uses 0.8125rem.
- **Stamp** (Archivo 900 at 112%, 0.95rem, 0.08em, uppercase): status stamps. The small stamp is 0.75rem and the large one 1.6rem. An optional note line is set in Arimo 700 at 0.72rem.

### Named Rules
**The Two Typefaces Rule.** Things that are posted or stamped use Archivo expanded caps: notice headings, buttons, stamps and big times. Everything typed is Arimo.

**The Tabular Rule.** Figures are tabular everywhere (the body sets them), so times, prices and counts line up in columns.

## Layout

The page is a board you look at, not a scrolling feed of cards. A centred container (max 1440px, side padding clamp(16px, 3vw, 40px)) holds a 68px header that sits directly on the felt. Below it, sheets are placed the way they would be pinned.

- **Front door:** the board sheet takes the main column, and a 300px aside holds "Your slips" and the shop-owner flyer, with a gap of clamp(24px, 2.5vw, 48px). At 1100px and below, the aside drops under the board and becomes an auto-fit grid of 280px-minimum columns. Two more sections follow: three lifecycle steps (a 3-up grid that stacks at 860px and below) and a wide "every shop books its own way" table sheet.
- **Sheets:** padding clamp(16px, 2.6vw, 32px). A sheet's title block ends with a 3px rule after 24px of padding. Content inside a sheet is spaced 24px apart (s-5), and page blocks are spaced 32px apart (s-6).
- **Timetable:** fixed table layout, hours 7am to 8pm as columns, a sticky 214px shop column (138px at 640px and below), min width 900px (760px on phones). It scrolls sideways inside its own 2px frame, and on today's date a narrow board opens already scrolled to the current hour.
- **Shop page:** a price list of 280 to 380px beside a week timetable (days across, hours down, 40px cells). The two stack at 960px and below.
- **My bookings:** rows of a 112px date column, the body, then the actions. At 680px and below, the date and actions span the full width.
- **Dashboard:** a sticky full-height felt rail of 252px beside a paper work area. Work-area padding is clamp(24px, 3vw, 48px) on top, clamp(16px, 3vw, 48px) at the sides and 96px at the bottom, with content capped at 1320px. At 900px and below, the rail moves to the top, its nav becomes a horizontal scroller and its footer hides. Request slips run 110px when, the body, then actions of at least 220px, and stack at 760px and below.
- **Slip:** a fixed panel on the right, up to 460px wide, inset 16px top and bottom. At 640px and below it becomes a bottom sheet inset 8px at the sides, at most 92dvh tall.
- **Spacing rhythm:** a 4/8 scale (s-1 to s-9: 4, 8, 12, 16, 24, 32, 48, 64, 96px). Pages end with 96px of bottom padding.
- **Overflow:** grid tracks start at minmax(0, 1fr), so wide tables scroll inside their own box and never widen the page.

### Named Rules
**The Pinned Sheet Rule.** Customer surfaces put their content on paper sheets pinned to the felt. Only the header, section notices, short captions, the crumb and the footer sit directly on felt, and they are set in Chalk.

**The Flat Desk Rule.** The dashboard work area is one untilted paper surface with no pins. The board's ornament stops at the rail.

## Elevation & Depth

Depth is physical, not tonal. Paper lifted off the felt casts a soft, downward shadow, and everything printed on the paper is flat, separated by toner rules and grey fills. Tilt adds to the sense of real objects. Sheets rotate between -1.6° and 1.2°, and large sheets stay within ±0.4°. Stamps tilt between -4° and -9° (default -5°).

### Shadow Vocabulary
- **Sheet** (`box-shadow: 0 1px 1px rgb(0 0 0 / 0.22), 0 10px 22px -8px rgb(0 0 0 / 0.5)`): every pinned sheet.
- **Slip** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.2), 0 16px 34px -10px rgb(0 0 0 / 0.45)`): the booking slip and dashboard drawers. They sit over a felt-tinted scrim (`rgb(10 30 22 / 0.42)`).
- **Desk edge** (`box-shadow: -10px 0 30px -16px rgb(0 0 0 / 0.55)`): the dashboard's paper work area where it meets the rail.
- **Pin** (`filter: drop-shadow(1px 3px 2px rgb(0 0 0 / 0.35))`): pushpin heads.

### Named Rules
**The Paper Lifts, Nothing Else Rule.** Shadows describe paper lifted off the board and nothing else. Buttons, fields, tables and stamps are flat, and depth inside a sheet comes from rules and grey fills.

## Shapes

The geometry is nearly square, like cut paper. Sheets, slips, buttons, fields, choices and segmented controls share a 2px radius. Highlighter tags use 1px. Stamps use 4px, because rubber stamps have softened corners. The bottom-sheet slip on phones rounds its top corners to 6px. The deliberate irregularities are the highlighter stroke (corner radii of 1, 3, 2 and 4px, skewed -6° and rotated -0.8°), the stamp's speckled ink mask, and the tilt of sheets and stamps.

Line work carries the structure:
- **3px solid toner:** the rule that closes a title block on a sheet, a shop head or a dashboard page head.
- **2px solid toner:** table and timetable frames, the slip's head divider, the baseline under tabs, request-slip frames, button borders, and the right edge of the sticky shop column.
- **2px solid toner:** interior grid lines in the customer timetables, the shop-type table, the price list and booking lists. Only the dashboard's dense data tables and calendar columns divide at 1px toner, for Operate density.
- **1.5px solid toner:** the borders of fields, choices, steppers, segmented controls and icon buttons.
- **Dashed tear lines:** 2px dashed Toner 3 on a request slip's top edge and between the flyer's tear-off tabs. 2px dashed Pencil Grey above a slip's footer and around empty states. 2px dashed Pencil Grey between items in the "Your slips" list.
- **Stamp border:** 3px double (5px on the large stamp).

The wordmark is "Walk" in Chalk, with "In" in ink on a skewed yellow highlighter block.

### Named Rules
**The Toner Weight Rule.** Structure is drawn in toner black at three weights: 3px to close a title block, 2px to frame and divide on every customer sheet; the dashboard's dense tables and calendar columns divide at 1px. Pencil Grey is only for perforations, tear lines, empty-state outlines and the calendar's hour ticks.

## Components

### Buttons
Typed and stamped: black toner blocks with expanded caps.
- **Shape:** squared (2px radius) with a 2px ink border. Minimum height is 44px (36px small), padding is 0 24px (0 12px small), and icons are 18px at a 2.25 stroke.
- **Primary:** a Toner Black fill with Photocopy White label.
- **Hover / Focus:** on hover the fill goes pure black and the button lifts 1px over 160ms on ease-out. On press it settles back. Focus-visible draws a 3px Highlighter Yellow outline offset 2px, around a 2px ink ring. Disabled buttons drop to 45% opacity.
- **Ghost:** transparent with an ink border, filling Highlighter Yellow on hover. It is used for secondary actions such as Change time, Today and Keep it. **Danger:** a Declined Red outline and label that fills red with a paper label on hover. It is used for Decline and for confirming a cancellation. **Link button:** bold underlined text that gets a yellow background on hover. It is used for Refresh, Try again, and the first, red Cancel on a booking row.
- **Icon button:** a 40px square with a 1.5px ink border on paper, turning yellow on hover. It closes a slip, pages through the calendar, and edits or removes a row.

### Chips
- **Choice:** 40px high, with a 1.5px ink border, a paper fill and Arimo 700 at 0.875rem. Hover fills Copier Grey. When selected, it takes a flat highlighter fill: yellow by default, or the shop type's highlighter for service choices in a slip. Choices cover day, staff, service type and confirmation mode in the slip and the dashboard editors.
- **Key items** (the board legend): borderless 36px toggles, each with a 22×18px highlighter swatch holding the type icon. When pressed, an item gains an ink border and a paper fill.
- **Shop-type tag:** a highlighter fill with ink text (Arimo 700 at 0.8125rem), a 1px radius and a 14px line icon: scissors for barbers, brush for salons, washing machine for laundry, printer for printing, ruler for other.
- **Segmented control:** a 1.5px ink frame around 36px options. The pressed option is inked solid (Toner Black fill, paper label). It is used for the dashboard's Day/Week switch.

### Cards / Containers
- **Corner Style:** squared paper (2px).
- **Background:** Photocopy White on felt. Inside a sheet, Copier Grey marks headers and notes.
- **Shadow Strategy:** the Sheet shadow for pinned sheets and the Slip shadow for drawers (see Elevation & Depth). Containers inside a sheet are flat.
- **Border:** pinned sheets have no border; a sheet is held by one or two pushpins along its top edge (at positions between 10% and 90%). A request slip is a 2px toner frame whose top edge is dashed, as if torn from a pad. An empty state is a 2px dashed Pencil Grey box holding a stamp and one sentence. An alert has a 2px Declined Red border and bold red text on a pale red fill.
- **Internal Padding:** clamp(16px, 2.6vw, 32px) on sheets, 24px on slips and request slips.

### Inputs / Fields
- **Style:** at least 44px tall, with a 1.5px ink border, a 2px radius, a Photocopy White fill, 10px 12px padding and Arimo at 1rem. Textareas start at 88px. Selects use a custom square-capped chevron. Labels sit above in Arimo 700 at 0.875rem, and hints sit below in Toner 3 at 0.8125rem.
- **Focus:** the outline is removed, the fill warms to a pale yellow (#fffde0) and the field gains a 3px Highlighter Yellow ring, as if the field has been highlighted.
- **Error / Disabled:** errors appear as an alert block in Declined Red. Disabled hour inputs drop to 40% opacity.
- **Stepper:** a bordered group with Copier Grey ± buttons that turn yellow on hover, and a bold count between 1.5px rules.
- **Dropzone:** a 2px dashed Toner 3 border on Copier Grey. On hover or drag-over it gains an ink border and Highlighter Wash.

### Navigation
- **Site header (on felt):** the wordmark is on the left, set in Archivo 900 at 125% width and 1.5rem. Links sit on the right in Arimo 700 at 0.875rem, in Chalk. The current or hovered link gets a 5px skewed yellow highlighter bar under the word. At 720px and below, "For shops" and the account name are hidden.
- **Tabs (on paper):** Archivo 800 at 115% and 1.125rem, in Toner 3. The selected tab is set in ink with a 5px yellow underline that sits on the 2px toner baseline.
- **Day tabs (board):** Archivo 800 at 118% and 1.375rem, inactive in Toner 3, each with its date below in Arimo. The selected day gets a highlighter swipe.
- **Dashboard rail:** felt, 252px wide. Items are 44px high, with Chalk labels and 18px line icons. Hover shows Raised Felt, and the current page is a Photocopy White fill with ink text. The requests count is a small badge with a 2px Received Blue border on paper, set in Archivo 900.
- **Crumb (on felt):** "Back to the board" in bold Chalk with a leading arrow.

### Timetable (signature)
The board itself, and the system's primary data view.
- **Frame:** a 2px toner frame with 2px toner interior lines. The header row is Copier Grey with a 2px bottom rule, labelled in Arimo 800 at 0.8125rem. The sticky shop column has a 2px right rule, the shop name in 800 at 0.875rem, and below it a type tag plus the lead service and price.
- **Cells:** 58px tall (40px in the shop's week view). An open cell shows "free" in bold Toner 2 when three or more start times remain. Otherwise it shows the remaining start minutes (":00 :15") in Declined Red 800. A full cell shows "full" in Toner 3 on Copier Grey. A closed cell shows an en dash in Pencil Grey, and a past cell is Shaded Copy.
- **States:** hovering an open cell shows Highlighter Wash. Selecting it swipes yellow highlighter across the cell, then the booking slip opens.

### Stamp (signature)
- **Form:** a 3px double border in the stamp's ink, 4px radius, Archivo 900 caps at 0.08em, multiply blend at 0.9 opacity, a speckled noise mask so the ink lands unevenly, and a -5° tilt by default. An optional note line in Arimo carries details such as "held for 2 hours" or "shop answers by 2:38am". Sizes are small, default and large.
- **Thud:** when the viewer's own action has just changed a status (booking, approving, declining, moving), the stamp lands. It scales from 1.7 to 1 and fades in over 180ms on a thud curve. A settled request stays in the pile for 1.4s after its stamp lands, then leaves.
- **Accessibility:** each stamp is an image with a plain-language label, such as "Status: Waiting for the shop to approve".

### Highlighter Swipe
- **Form:** a stroke behind the text, inset 14% top and 10% bottom with 3px of overhang at the sides, blended with multiply, with uneven corners and a slight skew and rotation.
- **Motion:** a clip-path reveals the stroke left to right over 240ms on ease-out. It appears on the selected day, timetable cell and time, on the selected service in a shop's price list, and in the front door's lifecycle demonstration.

### Booking Slip
- **Form:** a paper panel fixed at the right edge, up to 460px wide, with the Slip shadow over the felt scrim. The head holds the title, a type tag and the shop name above a 2px rule. The body scrolls with 24px gaps. The foot sits below a dashed tear line and holds a full-width primary button. Dashboard drawers (booking detail, service editor) use the same panel.
- **Motion:** the slip slides in from 40px to the right with a 1.5° rotation, fading in over 320ms on ease-out, like paper settling. The scrim fades in over 200ms. On phones the slip rises 48px from the bottom instead.
- **Time buttons:** at least 82px by 44px, with a 1.5px border. The time is bold, with the staff name small beneath. When selected, the border thickens to 2px and the button gets a swipe.

### Shop Calendar
- **Grid:** time runs down and staff (or days) run across, inside a 2px frame with 1px column lines and Pencil Grey hour ticks. Column heads stay sticky on Copier Grey, and today's head shows Highlighter Wash.
- **Blocks:** confirmed and in-progress blocks are yellow highlighter fills, and ready blocks are green. A pending block is paper with a 2px Received Blue inset ring and blue text, and a done block is Shaded Copy. On hover a block lifts 1px and gains a 2px ink outline. The now-line is a 2px Declined Red rule, and a key legend sits beneath the grid.

### Data Tables
- **Form:** a 2px toner frame with a Copier Grey header on a 2px rule and rows divided by 1px toner lines. Cells are padded 10px 12px, numbers align right, and a hovered row tints pale yellow. Fact lists inside drawers use a 96px Toner 3 term column with bold values.

### Flyer
- **Form:** the "Run a shop near campus?" sheet ends in five vertical tear-off tabs separated by 2px dashed Toner 3. On hover a tab fills yellow and lifts 6px over 200ms.

## Do's and Don'ts

### Do:
- **Do** set every customer surface on Notice-Board Felt, with content on pinned Photocopy White sheets: Sheet shadow, 2px radius, a tilt within ±1.6°, and within ±0.4° for large sheets.
- **Do** draw structure in toner black: 3px to close a title block, 2px for frames and interior lines on customer sheets (1px only inside the dashboard's dense tables).
- **Do** mark the viewer's choice with Highlighter Yellow: a 240ms ease-out swipe on cells, days and times, a flat yellow fill on choices, and a yellow bar under the current nav link or tab.
- **Do** code shop types with their highlighter and line icon (blue barber, pink salon, green laundry, orange printing) as a tag, legend swatch or row marker.
- **Do** say a booking's status with a stamp in its ink, with a plain-language accessible label, and thud it (180ms) only when the viewer's own action has just changed it.
- **Do** keep Operate surfaces on standard controls: 44px fields with 1.5px ink borders, choices, segmented controls, data tables and drawers. The world reaches them only through rules, highlighters and stamps.
- **Do** let wide tables scroll inside their own frame with a sticky first column, so the page never widens.
- **Do** collapse all animation and transition to 1ms under prefers-reduced-motion.

### Don't:
- **Don't** present availability as a search hero over photo cards; availability is a timetable grid of open cells.
- **Don't** frame tables, sheets or columns in Pencil Grey; grey is for perforations, tear lines, empty-state outlines and hour ticks.
- **Don't** set highlighter colours as text on paper; they are fills behind ink, multiplied.
- **Don't** show a booking status word as a flat pill or coloured badge; a status word is a stamp.
- **Don't** add ornament beyond the board's own: pushpins and tear-off tabs.
- **Don't** give buttons, fields or tables a shadow, and don't give anything a hard offset shadow; only paper lifts.
- **Don't** tilt the dashboard work area or individual controls; tilt belongs to whole sheets and stamps.
- **Don't** add a third typeface or handwritten notes; they turn the board into a costume.
