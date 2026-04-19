# 🔐 Escape the Professor's Study

A collaborative real-time escape room for 1–10 students.  
No roles, no competition — the whole group works together on every puzzle.

---

## The 5 Rooms

| # | Room | Skill Targeted |
|---|------|----------------|
| 1 | The Bookshelf | Pattern recognition |
| 2 | The Coded Safe | Factual reasoning / arithmetic |
| 3 | The Professor's Diary | Analytical reading |
| 4 | The Mirror Room | Spatial / lateral thinking |
| 5 | The Final Riddle | Creative / abstract thinking |

---

## How player count is handled

The game is fully collaborative — no fixed roles are assigned.  
Any number of players (even 1) can play. Everyone sees the same puzzle.  
Anyone can submit an answer. A live "attempts" feed shows all tries in real time,  
encouraging students to discuss before submitting.

---

## Deploy (5 min)

1. Create a free Firebase project → enable **Realtime Database** in **test mode**
2. Copy `.env.example` → `.env.local`, fill in your Firebase config
3. `vercel` (or push to GitHub and import on vercel.com)
4. Add env vars in Vercel → **Settings → Environment Variables**
5. Share the URL — everyone joins the same room automatically

## Firebase Rules

```json
{
  "rules": {
    "escape_room_v1": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Local dev

```bash
npm install
npm run dev
```
