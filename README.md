vinayaga-billing/
│
├── client/ → React (UI)
│ ├── src/
│ ├── public/
│ └── package.json
│
├── server/ → Node + Express + SQLite
│ ├── db/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── app.js
│ └── package.json
│
├── electron/ → Electron main process
│ ├── main.js
│ └── preload.js
│
└── package.json → Root scripts

┌────────────┐
│ Electron │ ← Desktop window + OS access
└─────┬──────┘
│
▼
┌────────────┐
│ React UI │ ← Screens, buttons, forms
└─────┬──────┘
│ HTTP (fetch / axios)
▼
┌────────────┐
│ Node Server│ ← Logic + SQLite DB
└────────────┘
