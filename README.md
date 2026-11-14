# A Planet of Her Own

Open `index.html` by double-clicking it. Keep `style.css`, `script.js`, and `assets/` beside it. No install, build, server, account, API, or internet connection is required. A modern browser with native HTML dialog support is recommended.

Optional local server: run `python3 -m http.server 8000` in this folder, then open http://localhost:8000.

Build: none. To distribute, copy or zip `index.html`, `style.css`, `script.js`, and `assets/` together, preserving their relative paths. The same files can be uploaded to any static host.

## Controls

Choose “Visit the planet,” then explore the three landmarks in any order, using the three illustrated paper invitations around the planet. Tab / Shift+Tab move between controls; Enter or Space activate buttons. Dialogs keep keyboard focus inside; Escape, the close button, or “Back to the planet” returns to the map. Each encounter has Replay. After all three discoveries, “Return to night” resets progress. Progress lasts for the current page session.

Sound starts off. “Sound off” enables the original local music-box composition with a short fade; toggling it off fades out. Audio pauses immediately when the tab is hidden and resumes only if sound remains enabled. Reduced-motion preferences disable decorative animation and show completed encounter illustrations immediately. Text is always steady and readable.

## Assets

The storybook planet was created with the built-in image-generation tool and bundled locally as `assets/storybook-planet.png`. The SVG encounter artwork and the original 48-second music-box composition were created for this project. See `assets/artwork-notes.txt` for the generation prompt. Cormorant Infant is bundled locally under the SIL Open Font License (`assets/fonts/OFL.txt`), with Georgia and Arial for body text and controls. Nothing is downloaded at runtime. The artwork uses layered washes, irregular contours, fine ink strokes, and local procedural paper grain.

## Verification

Checked in Chromium using a direct `file://` URL at 320, 375, 768, and 1440px widths: no horizontal overflow; all three encounters, replay, Escape, dialog keyboard focus wrapping, dawn, reset, and local audio toggling passed without JavaScript errors. Reduced-motion mode disables the constellation animation. Text/background contrast checks exceeded WCAG AA's 4.5:1 threshold for normal text, including the pale twilight and dawn palettes. Phone and desktop screenshots were visually inspected. Other browser engines and assistive technologies were not independently tested.
