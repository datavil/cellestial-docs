# AGENTS.md

Read this file fully before touching the docs. It is the contract for every agent
(human or AI) working on **cellestial-docs**, the Sphinx site for
[cellestial](https://github.com/datavil/cellestial) at cellestial.datavil.org.
Design philosophy lives in [philosophy.md](philosophy.md). Lessons learned live in
[MEMORY.md](MEMORY.md). The library's own contract is cellestial's `AGENTS.md`.

## Vision

- The site shows cellestial as users meet it: biologists in notebooks. Every
  example is real code run at build time (`jupyter-execute`) on a dataset from
  `cellestial.datasets`, so the docs never drift from the library.
- Backend: [ggrust](https://github.com/datavil/ggrust), a grammar of graphics engine
  with a lets-plot compatible API. Examples import `from ggrust import *`, never
  `lets_plot`. Plots render as interactive HTML in the pages and as static SVG for
  mobile.
- Inputs: AnnData, MuData and SpatialData. Singular functions return `PlotSpec`,
  plural ones `SupPlotsSpec`.

## Golden rules

1. **Think before writing.** State assumptions. If a request has more than one
   reading, say so and ask. Do not pick one silently.
2. **Simplicity first.** Short pages, short examples. No speculative sections.
3. **Be surgical.** Every changed line traces to the request. Do not "improve"
   adjacent pages, wording or formatting. If you must touch anything outside the
   requested part, **ask the user first**.
4. **Goal-driven.** Turn fuzzy tasks into checks ("add a page" -> "it builds with no
   new warnings and its plots render").
5. **Build before handing over.** Run a full build and compare warnings with the
   previous build. No new warnings, no missing references.
6. **Verify visuals.** Open the built pages and look: plots render, no console
   errors, labels and legends stay inside the plot area. Render PNGs of new examples
   and read them.
7. **Commit each significant step, then push.** Never deploy unless the user asks.
8. Robustness over flexibility. Ask the user when unsure.

## Writing style

- Brief. One idea per paragraph, examples over prose.
- No em dashes anywhere: pages, code, comments, chat.
- Full words in example code: `group_index` not `grp_idx`, `frame` not `df`.
- Single backticks in docstrings, double backticks for literals in `.rst`.
- Never name AnnData slots (`adata.obs`, `uns`) or scanpy APIs as the way to use
  cellestial. Show the cellestial call.
- Polars over pandas in examples, lets-plot style `+` composition for styling.

## Layout

```
sphinx/
  conf.py           extensions, theme, ggrust stand-ins for autodoc
  index.rst         landing page and gallery
  API.rst           autosummary of every public export (keep in sync with __all__)
  *.rst             guides (quickstart, features, migration, mudata, ...)
  _templates/       autosummary templates for the generated API pages
  _static/          css, js, images; generated SVGs (gitignored)
assets/             README images
build.sh            local build against a cellestial checkout
deploy.sh           build and publish to gh-pages (only when asked)
```

## Commands

Package management is **uv**.

```bash
./build.sh                                   # build against $CELLESTIAL_PATH, open it
CELLESTIAL_PATH=/path/to/cellestial ./build.sh -E
uv run --no-sync --group docs sphinx-build sphinx/ _build/html/ -a -j auto
```

To build against an unreleased cellestial branch, check it out with
`git worktree add` and point `CELLESTIAL_PATH` at it. Never switch the branches of
someone else's checkout.
