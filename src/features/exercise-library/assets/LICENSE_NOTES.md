# Exercise imagery — licensing note

**Decision: no third-party exercise photos ship in this app.**

## Background

A natural candidate for exercise data + demo photos was
[`yuhonas/free-exercise-db`](https://github.com/yuhonas/free-exercise-db).
Its **text** (exercise names, instruction steps, equipment, muscle
groupings) is effectively public-domain-style and was safe to draw
inspiration from for general exercise knowledge.

Its **images**, however, have long-open, unresolved licensing questions in
that repo's own issue tracker (e.g. issues #2, #12, #13 — provenance and
redistribution rights for the photos are unanswered by maintainers). That
risk isn't worth taking for a "free, local" app whose whole premise is not
subjecting the user to license surprises.

## What we did instead

- `Exercise.imageUrl` is left `undefined` for every exercise in
  `seedExercises` — the type already models this as optional, with the UI
  expected to fall back to a body-part icon.
- The UI (`ExerciseCard`, `BodyPartAccordion`) renders a small
  [lucide-react](https://lucide.dev) icon per body part instead of a photo
  (lucide-react is MIT-licensed and already a project dependency — see
  `bodyPartIcons` in `BodyPartAccordion.tsx`).
- Every exercise instead links out to a **YouTube search** (not a
  hardcoded video) via `Exercise.youtubeSearchUrl`, so users can find a
  demonstration themselves without us redistributing anyone's media.
- All instruction text in `exercisesSeedProposal.ts` was written from
  scratch for this app, not copied from `free-exercise-db` or any other
  source.

## If real photos/illustrations are wanted later

Prefer either: (a) commissioning/drawing original simple line-art per
exercise, or (b) a dataset with an explicit, unambiguous open license
covering the images specifically (not just the metadata). Re-run this same
license check before adding anything.
