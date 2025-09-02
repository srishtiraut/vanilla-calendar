# 📅 Vanilla Calendar

A lightweight, event-driven calendar application built with **HTML, CSS, and vanilla JavaScript**.  
It supports daily, weekly, and monthly views with smooth navigation, local storage persistence, and cross-tab synchronization — all without external frameworks.
---
🐱‍💻Deployed using Vercel: https://vanilla-calendar-puce.vercel.app/
---

##  Features
- 📆 Multiple views: **Day, Week, Month**
- ⏱️ Date navigation (previous/next/today)
- 🔄 Sync events across browser tabs with **BroadcastChannel**
- 📱 Responsive: switches to **Week view** on mobile
- 💾 Persistent events using **localStorage**
- 🔔 Toast notifications for create, edit, and delete actions
- 🎨 Smooth CSS animations

## Usage
- Use the hamburger menu (on mobile) to toggle the sidebar
- Select Day / Week / Month from the dropdown to change views
- Add events via the + Event button
Events will:
- Save automatically to localStorage
- Sync instantly across multiple tabs
- Show success/error toast notifications