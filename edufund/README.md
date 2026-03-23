# 🎓 EduFund – Student Project Portal

A full-stack-ready, single-page application for managing student project funding applications. Built with vanilla HTML, CSS, and JavaScript — no frameworks required, easy to extend.

---

## 🚀 Features

### Student Portal
- 🔐 Login & 3-step registration flow
- 📊 Personal dashboard with stats
- ✏️ Submit new project applications (title, category, amount, team, timeline, outcomes)
- 📁 View & search all personal applications
- 💰 Funding overview (requested vs approved vs pending)
- 💬 AI chatbot assistant

### Admin Console
- 📊 Overview dashboard (totals, pending count, approved funding)
- 📋 Full applications table with search + status filter
- ✅ One-click Approve / Reject / Mark-for-Review actions
- 💰 Amount management — set approved funding per application with notes
- 📥 CSV export (filter by status / date range)
- 💬 AI admin assistant

---

## 📁 Project Structure

```
edufund/
├── index.html          # Main entry point (all screens)
├── css/
│   └── style.css       # All styles & CSS variables
├── js/
│   ├── data.js         # Sample data + chatbot knowledge base
│   └── app.js          # All application logic
└── README.md
```

---

## 🏃 Quick Start

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/edufund.git
   cd edufund
   ```

2. Open in browser — **no build step needed**:
   ```bash
   open index.html
   # or serve locally:
   npx serve .
   ```

3. Demo credentials:
   - **Student** → click "Student Portal" → any email + password
   - **Admin** → click "Admin Dashboard" → any email + password

---

## 🎨 Customisation Guide

### Change colours / theme
Edit CSS variables at the top of `css/style.css`:
```css
:root {
  --accent:  #4f8ef7;   /* primary blue */
  --accent2: #22d3a5;   /* success green */
  --warn:    #f7a84f;   /* warning orange */
  --danger:  #f75f5f;   /* danger red */
  --bg:      #0b0f1a;   /* page background */
  --surface: #131929;   /* sidebar / card background */
}
```

### Add / edit chatbot responses
Open `js/data.js` and add entries to `botReplies`:
```js
const botReplies = {
  'your keyword here': 'Your response here',
  // dynamic responses can be functions:
  'pending count': () => `There are ${applications.filter(a => a.status === 'pending').length} pending.`,
};
```

### Add real application categories
In `index.html`, find the `<select id="app-cat">` element and add `<option>` tags.

### Connect to a real backend
Replace the `applications` array in `js/data.js` with API calls.
In `js/app.js`, swap functions like `submitApplication()` to POST to your server:
```js
async function submitApplication() {
  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newApp),
  });
  // handle response...
}
```

---

## 🛠️ Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Markup     | HTML5                       |
| Styling    | CSS3 + CSS Variables        |
| Logic      | Vanilla JavaScript (ES6+)   |
| Fonts      | Google Fonts (Syne + DM Sans) |
| No build   | ✅ Works without Node/npm   |

---

## 📌 Roadmap / TODO

- [ ] Connect to real database (Supabase / Firebase / custom API)
- [ ] JWT authentication
- [ ] Email notifications on status change
- [ ] File upload (attach project documents)
- [ ] Admin analytics charts
- [ ] Dark/light mode toggle
- [ ] Multi-language support

---

## 📄 License

MIT — free to use, modify, and distribute.

---

Made with ❤️ for student innovators.
