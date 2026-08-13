# Part 2 — Product Understanding: Caseload / Take Data Workflow

## Methodology

This document distinguishes three types of statements throughout:

- **[Observed]** — directly visible in the provided AbleSpace screenshot(s)
- **[Interpretation]** — a reasonable inference from the observed UI, not explicitly confirmed
- **[Suggestion]** — my own proposed improvement, not a claim about current or planned functionality

This section is based on **one screenshot** of the Caseload list view. The
actual "Take Data" entry flow (what appears after clicking the button) has
not yet been reviewed and is marked as a gap below.

## What the Caseload Screen Appears to Be For

**[Observed]** The Caseload screen is accessed from a left-hand navigation
sidebar, grouped under a "CAPTURE" section alongside Calendar, Data,
Accommodations, and Service Time. It displays a table of students with
columns for Full Name, Last Name, IEP Due, Eval Due, Collaborators,
Service Time, School, and an Actions column.

**[Observed]** The header shows three counts: "Students (15) · Groups (12)
· Unassigned (39)," along with a search bar and an "Add Student" button.

**[Interpretation]** This appears to be a special-education or related-services
case management tool (the "IEP Due" and "Eval Due" columns strongly suggest
this — IEP stands for Individualized Education Program, a standard special
education term), where a provider (therapist, teacher, or service coordinator)
manages a roster of students they are responsible for, tracks compliance
deadlines (IEP/Eval due dates), and logs service delivery.

## Where the "Take Data" Action Appears

**[Observed]** A "Take Data" button appears in the Actions column, once per
student row, alongside a vertical three-dot overflow menu. Every visible
row (Demo Student1, Demo Student2, Max Planck, Albert Einstein, Tim David,
Charles Darwin, Marie Curie, Dwight Schrute) has its own "Take Data" button.

## Step-by-Step Workflow

**[Observed]** Based on this screenshot alone, only the entry point is
confirmed:
1. User navigates to the Caseload tab from the left sidebar.
2. User locates a specific student in the table (via the search bar or
   by scrolling the list).
3. User clicks that student's "Take Data" button in the Actions column.

**[Gap — needs additional screenshots]** What happens after step 3 is not
yet documented. I do not know whether "Take Data" opens a modal, navigates
to a new page, presents a form, a list of goals/targets, or something else
entirely. I am not going to guess at this step, since it's the core of
what this section is meant to explain.

## What the User Is Expected to Do

**[Interpretation, limited]** Based only on the list view, the user is
expected to first identify the correct student from a caseload of at
least 15 (with 12 groups and 39 unassigned students also tracked
elsewhere), then initiate a data-logging action for that specific student.
Beyond that, I cannot describe expected user behavior without seeing the
actual data-entry screen.

## UX/UI Observations

**[Observed]**
- The table is dense — eight+ columns visible at standard width, which
  will be difficult to fit on smaller screens.
- Collaborators are shown as small circular avatars with a "+N" overflow
  indicator (e.g. "+1", "+3") rather than full names, keeping the row compact.
- "Take Data" buttons use a light-blue filled style, visually distinct
  from the plain-text student name links (which appear as blue hyperlinks).
- Some rows show dashes ("-") for missing Eval Due or Service Time data.

**[Interpretation]** The consistent placement of "Take Data" as a primary
action per row (rather than buried in the overflow menu) suggests this is
the single most common action a user takes from this screen.

## Functionality Observations

**[Observed]** The screen offers search ("Search students...") and what
appears to be a keyboard shortcut hint (⌘ + K) next to the search bar.
Two view-toggle icons appear near the top right (table view vs. an
alternate view — likely list/card, though the icon alone doesn't confirm this).

**[Gap]** Sorting, filtering by IEP/Eval due date, and bulk actions are
not confirmed as present or absent from this single screenshot.

## Practical UX/UI Improvements

**[Suggestion]** The IEP Due and Eval Due columns could benefit from
color-coded urgency (e.g. a red or amber indicator for dates approaching
or past due) rather than plain text — this is a common pattern in
compliance-heavy tools and would let a provider triage their caseload
at a glance rather than reading every date.

**[Suggestion]** On smaller screens, this eight-column table will likely
need to collapse into a card-based layout (similar to how I've implemented
responsive task cards in Part 1) rather than a horizontally-scrolling table,
to remain usable on tablet/mobile.

## Practical Functionality Improvements

**[Suggestion]** A bulk "Take Data" flow (select multiple students,
log a shared data point like group attendance) could reduce repetitive
clicking for providers who run group sessions — this is speculative,
since the screenshot doesn't show whether "Groups (12)" already covers
this use case elsewhere in the product.

**[Suggestion]** Surfacing "days until due" as a sortable column (rather
than a raw date) would let a provider immediately sort their caseload by
urgency.

## Screenshots

- Figure 1: Caseload list view showing the "Take Data" action (provided)
- Figure 2: [Needed] — the screen/modal that appears after clicking "Take Data"
- Figure 3: [Needed] — the resulting state after data is logged (if applicable)

## Outstanding Gap

This document is genuinely incomplete without screenshots of the actual
"Take Data" flow. Everything past the entry point is a documented gap,
not a guess.
