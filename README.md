# Know Him More (365-Day Character Study Devotion)

> *"That I may know him, and the power of his resurrection, and the fellowship of his sufferings, being conformed to his death."* — Philippians 3:10

**Know Him More** is a mobile-first, installable Progressive Web App (PWA) designed for deep daily devotion, Bible study, and scripture memorization. All **365 days of complete, uncurtailed content** are generated and bundled directly into the app—no live AI or API calls required. Across 365 days, users journey through the biblical storyline by exploring the lives of men and women across Scripture—not merely collecting Bible trivia, but getting to know God's character, heart, and redemptive ways.

---

## 🌟 Key Features

### 1. The Daily Screen (Ordered Flow)
1. **Header**: Day number (e.g., Day 47 of 365), calendar date, character name, and one-line daily theme.
2. **Memory Verse & "Cram It" Mode**:
   - Verse text in full (World English Bible translation) with reference and a *"Why It Matters"* contextual note.
   - **4-Step Practice Routine**:
     - **Read It Aloud**: Interactive 3x tap counter.
     - **Fill in the Blank**: Interactive inputs hiding key keywords.
     - **First-Letter Recital**: Recite the verse aided by initial letter prompts (`H, I: Y i o G...`).
     - **Full Recall Check**: Type from memory with immediate diff-checking highlighting missed words.
   - **TTS Audio**: Listen to the verse read aloud using browser text-to-speech.
   - **"I've got it"**: Marks the verse memorized for today.
3. **Character Profile**:
   - Who they were, when and where they lived, family lineage, key scriptural moments, strengths, and failures.
4. **Today's Reading**:
   - Exactly two assigned Bible chapters per day in clean, readable World English Bible (WEB) text.
   - Independent "Mark as read" buttons for each chapter.
5. **What God Is Saying**:
   - Warm, conversational mentor-style reflection revealing God's holiness, mercy, justice, patience, and faithfulness.
6. **Practical Lessons**:
   - 3 to 5 actionable takeaways, each tied to a supporting verse with a probing personal reflection question.
7. **My Notes**:
   - Auto-saving journal with real-time word count and searchable local history.
8. **Daily Quiz**:
   - 5 questions per day (mix of multiple choice and true/false) with instant feedback, explanations, and verse citations.
   - Full retake capability and score tracking.
9. **Closing Prayer**:
   - Guided written prayer weaving the memory verse back to God, with space for personal prayer and an *"Amen, I've prayed"* button.

### 2. Habits, Spaced Repetition & Offline Capability
- **Completion Tracking**: A day is marked complete only when both chapters are read, memory verse practiced, quiz completed, and prayer offered.
- **Spaced Review Engine**: Memorized verses resurface automatically after **1, 3, 7, 14, and 30 days** so they stick permanently.
- **Progress & Streak**: Visual calendar view, streak counter, and percentage of the 365 days completed.
- **Comprehensive Library Pages**:
  - **Memory Verses**: Complete catalog of all 365 verses with memorization status.
  - **Characters Studied**: Searchable index of all studied characters with notes.
  - **Quiz Performance**: Analytics on accuracy and challenging topics.
  - **Weekly Review**: Highlights from each 7-day cycle with prompts for spiritual growth.
- **Data Privacy & Backup**: 100% offline-ready, stored in `localStorage` without requiring an account, with full JSON Export & Import backup buttons.
- **Design & Typography**: Calm, warm neutral tones, light/dark mode switch, distraction-free reading mode, and adjustable font sizing.

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, and Modern JavaScript (ES6+).
- **Offline / PWA**: Service Worker (`sw.js`) and Web App Manifest (`manifest.json`).
- **Bible Translation**: Public domain World English Bible (WEB).
- **Data Architecture**: Structured JSON curriculum in `data/` (`plan365.json`, `days_content.json`, `days_content.js`).

---

## 🚀 Getting Started

### 📱 Mobile App for Android

You can run **Know Him More** on your Android phone in two easy ways:

#### Option 1: Standalone Android App (APK File) — Recommended
A pre-built native Android APK is included directly in this repository:
- **Direct Download Link**: Download [**`know-him-more.apk`**](./know-him-more.apk) (8.6 MB, offline-ready).
- **How to Install on Your Android Phone**:
  1. Download `know-him-more.apk` directly to your phone (via mobile browser, WhatsApp, Google Drive, or USB cable).
  2. Tap the downloaded file in your phone's notification bar or Files app.
  3. If prompted to *"Install unknown apps"*, tap **Settings** and toggle **"Allow from this source"**.
  4. Tap **Install**, then **Open**.
  5. The app launches with the full-screen interface, the gold open-Bible icon, and works 100% offline.

#### Option 2: Progressive Web App (PWA 1-Tap Install)
1. Open the hosted web app or your local IP in Google Chrome on your Android phone.
2. Tap the **three dots menu (⋮)** in the top right corner of Chrome.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. Android will generate a native WebAPK with its own launcher icon, running full-screen without address bars.

---

### Run Locally

You can serve the app with any static web server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js npx
npx serve .
```

Open your browser to:
```
http://localhost:8080
```

---

## 📂 Repository Structure

```
.
├── index.html                  # Main application single-page interface
├── manifest.json               # Web App Manifest for PWA installation
├── sw.js                       # Service Worker for offline caching
├── src/
│   ├── app.js                  # Application logic, router, quiz engine, cram mode
│   └── styles/
│       └── main.css            # Responsive, warm neutral styling & dark mode
├── data/
│   ├── plan365.json            # Master 365-day curriculum specification
│   ├── plan365.js              # Master plan JS module
│   ├── days_content.json       # Generated full devotional content
│   └── days_content.js         # Pre-bundled browser-ready day content
├── scripts/                    # Curriculum generators, parsers, and validation test suite
└── icons/                      # App icon assets
```

---

## 📖 License

This project is open-source. Scripture quotations are taken from the World English Bible (WEB), which is in the Public Domain.

