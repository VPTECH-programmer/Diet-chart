# Shape Squad Diet Chart Generator

A fast, installable diet chart builder for **Shape Squad Fitness Centre** (Rewa, MP, India). Trainers can create a branded, macro-tracked meal plan for a client, then export it as a print-ready PDF or Excel sheet and share it straight from a phone. It is built with plain HTML, CSS and JavaScript, with no framework and no build step.

**Live app:** `https://<your-username>.github.io/<your-repo>/](https://vptech-programmer.github.io/Diet-chart/`

## Features

- **Editable meal table:** add, duplicate, delete and reorder meals, with timing, food item, quantity, protein, fats, carbs and calories for each row.
- **Food suggestions:** autocomplete for common Indian foods that can fill in the nutrition values for you.
- **Automatic totals:** daily protein, fats, carbs and calories are calculated as you type, with an optional auto-calculate toggle for calories.
- **Macro breakdown charts:** an interactive donut chart and a proportional bar chart (D3) show the protein, fats and carbs split.
- **Client details and trainer notes:** client name, goal, date and trainer, plus a notes and instructions box.
- **PDF export:** A4 landscape layout that never cuts a meal row across two pages, with the header repeated on continued pages.
- **Share from your phone:** uses the native share sheet (WhatsApp, Drive and so on) where supported, and downloads the file otherwise.
- **Excel export:** the chart is saved as an `.xlsx` file.
- **Responsive layout:** table view on desktop and print, stacked meal cards on phones, and a sticky action bar on mobile.
- **Your branding:** edit the gym name, tagline, address, phone, email and trainer, and use `logo.png` or upload a different logo.
- **Works offline:** installable as an app (PWA), with the app and its libraries cached after the first visit.
- **Saved on your device:** your chart and gym profile are stored in the browser's local storage, so nothing is sent to a server.

## Project structure

```
index.html      App layout and modals
style.css       Screen, print and mobile styles
app.js          All app logic (table, totals, charts, PDF, Excel, PWA)
sw.js           Service worker (offline cache)
manifest.json   PWA manifest (name, colors, icons)
logo.png        Gym logo (see below)
```

## Logo

Add a square `logo.png` (at least 512x512 px) to the same folder as `index.html`. It is used as the header logo, the watermark, the favicon and the app icon. Any square image is cropped to a circle.

## Run locally

Service workers need HTTP, so don't open `index.html` by double-clicking it. Serve the folder instead:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Customize

- **Default gym details:** edit `DEFAULT_GYM_PROFILE` near the top of `app.js`. These can also be changed in the app with the **Edit Info** button.
- **Colors and fonts:** edit the CSS variables at the top of `style.css`.
- **Default meal rows:** edit `DEFAULT_MEAL_ROWS` in `app.js`.


## Built with

HTML, CSS and vanilla JavaScript, plus these libraries loaded from cdnjs:
[D3](https://d3js.org/), [html2canvas](https://html2canvas.hertzen.com/), [jsPDF](https://github.com/parallax/jsPDF) and [SheetJS](https://sheetjs.com/). Fonts are Barlow Condensed and DM Sans from Google Fonts.

## License

All rights reserved by Shape Squad Fitness Centre unless you add a license file to this repository.
