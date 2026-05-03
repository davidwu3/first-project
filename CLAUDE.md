# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the project

No build step or package manager — open HTML files directly in a browser:

- `test.html` — local test harness for the FAQ carousel; loads `faq-carousel.js` and simulates how Convert.com will inject it after `#page-intro`
- `tictactoe.html` — standalone two-player tic-tac-toe game

To deploy the carousel A/B test to Convert.com:

```
node setup-convert.js
```

Requires Node.js v14+. Fill in the `CONFIG` block at the top of `setup-convert.js` before running.

## Architecture

The project has two independent parts:

**FAQ Carousel A/B test** (`faq-carousel.js` + `setup-convert.js`)

`faq-carousel.js` is a self-contained IIFE designed to be injected as variation JS by Convert.com. It builds the entire carousel DOM and styles programmatically (no external dependencies, no HTML template). Two placeholders are substituted at deploy time:
- `CONVERT_GOAL_ID_PLACEHOLDER` — replaced with the Convert goal ID by `setup-convert.js`
- `CONVERT_TARGET_SELECTOR_PLACEHOLDER` — replaced with the CSS selector to insert after

`setup-convert.js` automates the full Convert.com setup via their v3 REST API: creates the experiment, fetches variation IDs, uploads the carousel JS with placeholders substituted, creates a click-tracking goal, and attaches it — all in one run.

`test.html` simulates the live page (a medical education article about BFRBs) so the carousel can be tested locally before deploying to Convert.

**Tic-tac-toe** (`tictactoe.html`) — unrelated standalone file, all logic inline.
