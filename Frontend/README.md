# ReDocs — Legal Document Assistant

A futuristic chat UI wired to your FastAPI backend at `http://localhost:8000`.

## Setup

```bash
npm install
npm run dev
```

Then open the printed local URL. Your FastAPI server (with `/upload` and `/ask`
endpoints, CORS enabled for the Vite dev origin) needs to be running separately.

## Structure

```
aether-chat/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # State + backend calls (/upload, /ask)
    ├── index.css          # Design tokens + all styling
    └── components/
        ├── Rail.jsx        # Leftmost icon rail
        ├── Sidebar.jsx     # Shows uploaded document + "new session"
        ├── Topbar.jsx      # Backend status + theme toggle
        ├── ThreadView.jsx  # Scrollable message list
        ├── Message.jsx     # Message bubble; renders animated
        │                   # waveform in place of "Thinking..." text
        └── Composer.jsx    # Text input + send + file-upload button
```

## Backend contract

- `POST /upload` — multipart `FormData` with a `file` field. Expects
  `{ "message": "..." }` back.
- `POST /ask` — JSON body `{ "question": "..." }`. Expects
  `{ "answer": "..." }` back.

If either endpoint lives somewhere other than `localhost:8000`, change
`BACKEND_URL` at the top of `src/App.jsx`.

## Notes

- Any bot message with the exact text `"Thinking..."` renders as an animated
  waveform instead of plain text — that's how the loading state ties into the
  rest of `App.jsx`'s logic without a separate loading flag.
- Color tokens, fonts, and spacing all live in `src/index.css` under `:root`.
