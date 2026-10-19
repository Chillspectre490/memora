# Memora local demo

Memora is a small study app demo that runs on your computer. The app itself does not need packages or an online account; browser tests use Node.js, pnpm, and Playwright.

## Open it on your computer

1. Open Terminal in this folder.
2. Run `python3 -m http.server 4173 --bind 127.0.0.1`.
3. Open `http://localhost:4173` in your browser.
4. To stop the local website, go back to Terminal and press Control+C.

## Run browser tests

Playwright checks the app in Chromium.

1. Install Node.js, then run `pnpm install`.
2. Run `pnpm exec playwright install chromium` once.
3. Run `pnpm test`.

The Playwright config starts the Memora server for you on port 4173, so you do not need to start a second server in another Terminal window.

Useful commands:

```bash
# Run every Playwright test
pnpm test

# Run one test file
pnpm exec playwright test tests/smoke.spec.js

# Open the browser while the test runs
pnpm run test:headed

# Run one test by its name
pnpm exec playwright test -g "Memora loads"

# Open the HTML report after a test run
pnpm exec playwright show-report
```

Test files belong in `tests/` and should end in `.spec.js`. Use accessible locators such as roles, labels, and placeholders when finding buttons and form fields. Add new tests when an important user flow needs a repeatable check.

## What this version can do

- Create a local student or teacher profile.
- Create and edit study sets, with a choice of question styles for each card.
- Try question practice, flashcards, tests, Block Blast, and matching.
- Create a class with a chosen name and a generated code, or join a class by code.
- Set up a separate solo or team live-event screen with a 12-answer streak.
- Save profile, class, study-set, and result information in this browser.

## Local demo notes

The data stays in the current browser on this computer. A class code or live-event code cannot connect another computer yet. Profiles are demo profiles without passwords. All study modes can be used for unlimited rounds.
