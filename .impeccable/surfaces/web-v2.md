# Surface brief: WalkIn web v2 (apps/web-v2)

## Scope and mode

The whole customer and provider website, rebuilt as a new app beside `apps/web`.

- Front door `/`: **Persuade**. A first-time student should grasp "see open slots at campus shops, take one" within seconds and be able to do it from the first viewport.
- Shop page + booking `/shops/[slug]`, My bookings `/bookings`, sign-in: **Operate** (customer).
- Dashboard `/dashboard/*`: **Operate** (shop owner/staff, daily use, desktop and phone).

## Audience, job, action

Students and staff at a Ghanaian university campus, on phones between lectures, in bright daylight. Job: get a haircut, braids, laundry drop-off or print job without queueing. Action: pick an open slot and hold it. Shops: work today's bookings, approve or decline requests, keep services, hours and staff current.

## Proof and constraints

Real backend (Firebase emulators). All shops, people and prices are synthetic demo data and are labelled as such. No payments, reviews, maps, chat or delivery may be implied. Browsing uses an anonymous session; booking needs an account.

## Direction contract

THESIS: Availability on campus is a timetable, and every student already reads one. The surface is the photocopied timetable pinned on the hall notice board: you highlight your slot like you highlight your own courses, and the shop's approval lands as a rubber stamp. It refuses the category default of a search hero over a grid of photo cards.

OWN-WORLD: Green felt notice-board ground; photocopy-white sheets with heavy toner-black rules (2px, never hairlines); fluorescent highlighter swipes (yellow = yours, and only yours; blue, pink, green, orange and lilac code barber, salon, laundry, printing and other shops); violet office-stamp ink for confirmed, blue for received, red for declined/cancelled, green for ready. Type: Archivo expanded black caps for notice headings, Arimo (the Word/Arial voice every notice is typed in) for everything else, tabular figures for times. Pushpins and tear-off flyer tabs as the only ornament.

STORY: The visitor sees today's campus as one timetable of real open slots, understands that a highlighted cell becomes theirs, trusts the stamp (received vs confirmed) because it matches how approvals already work on campus, and books in two taps.

FIRST VIEWPORT: Felt ground edge to edge with a slim header (wordmark, Board, My bookings, For shops, Sign in). One large timetable sheet pinned across ~75% of the width: its typed title block is the headline ("CAMPUS SHOPS · OPEN SLOTS · THU 19 NOV"), a KEY legend that filters by shop type, day tabs, then the grid (shops as rows, hours 08–20 as columns, open cells with remaining count). Amended in build: slots start every 15 minutes, so counts read as noise; cells say "free" when most of the hour is open and list the last start minutes in red when it is nearly gone, with a key line under the grid explaining both. Tapping an open cell draws a yellow highlighter swipe and opens the booking slip. To the right, a "your slips" stack and a tear-off "Shop owners" flyer. On phones the sheet fills the width and the grid scrolls sideways under sticky shop names.

FORM: Notice-board timetable, ranked #2 of 7 on my list (rolled direction was #3 "Hall colours"; user chose this card). Signature interaction: highlighter-swipe selection plus stamp-on-confirm. Motion grammar: swipe 240ms ease-out, stamp 180ms thud, slips slide in like paper settling. Roll provenance: the impeccable launcher (concept-seed) is not installed on this machine, so the assignment was drawn with node crypto.randomInt(1, 8) over the seven-candidate list; it landed on #3 "Hall colours", and the user chose IMPECCABLE'S PICK instead. seed: none (unavailable)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
