// Know Him More — Application Controller
// Handles daily devotionals, cram mode, scripture reader, quizzes, spaced repetition, notes, and local storage.

(function() {
  'use strict';

  // --- STATE MANAGEMENT ---
  const STORAGE_KEY = 'know_him_more_state_v1';

  const defaultState = {
    currentDay: 1,
    startDate: new Date().toISOString().split('T')[0],
    theme: 'light',
    fontSize: 'medium',
    completedDays: [],          // array of completed day numbers [1, 2, ...]
    readChapters: {},           // { "d1_ch1": true, "d1_ch2": true }
    memorizedVerses: {},        // { "1": { date: "...", intervals: [1,3,7,14,30], reviewsDone: [] } }
    cramCounters: {},           // { "1": 3 }
    quizResults: {},            // { "1": { score: 5, total: 5, answers: { q1: 1, ... } } }
    notes: {},                  // { "1": "text" }
    customPrayers: {},          // { "1": "text" }
    prayedDays: {},             // { "1": true }
    weeklyReflections: {},      // { "1": "What God taught me..." }
    reminderTime: '07:00',
    notificationsEnabled: false
  };

  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return Object.assign({}, defaultState, JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load state from localStorage:', e);
    }
    return Object.assign({}, defaultState);
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state to localStorage:', e);
    }
  }

  // --- DOM ELEMENTS CACHE ---
  const el = {
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    themeIcon: document.getElementById('theme-icon'),
    streakCounter: document.getElementById('streak-counter'),
    streakCountText: document.getElementById('streak-count-text'),
    headerDayLabel: document.getElementById('header-day-label'),
    openDayJumperBtn: document.getElementById('open-day-jumper-btn'),
    dayJumperModal: document.getElementById('day-jumper-modal'),
    closeJumperBtn: document.getElementById('close-jumper-btn'),
    modalDaysGrid: document.getElementById('modal-days-grid'),

    // Day navigation
    prevDayBtn: document.getElementById('prev-day-btn'),
    nextDayBtn: document.getElementById('next-day-btn'),
    dayPillTag: document.getElementById('day-pill-tag'),
    currentDateIndicator: document.getElementById('current-date-indicator'),
    characterNameDisplay: document.getElementById('character-name-display'),
    characterSeasonDisplay: document.getElementById('character-season-display'),
    dayThemeDisplay: document.getElementById('day-theme-display'),

    // Checklist
    checkReading: document.getElementById('check-reading'),
    checkVerse: document.getElementById('check-verse'),
    checkQuiz: document.getElementById('check-quiz'),
    checkPrayer: document.getElementById('check-prayer'),

    // Review alert
    reviewDueAlert: document.getElementById('review-due-alert'),
    reviewVersesList: document.getElementById('review-verses-list'),

    // Memory verse & Cram
    verseTextDisplay: document.getElementById('verse-text-display'),
    verseRefDisplay: document.getElementById('verse-ref-display'),
    verseWhyDisplay: document.getElementById('verse-why-display'),
    audioTtsBtn: document.getElementById('audio-tts-btn'),
    audioBtnIcon: document.getElementById('audio-btn-icon'),
    tapCounterCircle: document.getElementById('tap-counter-circle'),
    tapCountNum: document.getElementById('tap-count-num'),
    blanksContainer: document.getElementById('blanks-container'),
    checkBlanksBtn: document.getElementById('check-blanks-btn'),
    revealBlanksBtn: document.getElementById('reveal-blanks-btn'),
    firstLettersBox: document.getElementById('first-letters-box'),
    recallInput: document.getElementById('recall-input'),
    checkRecallBtn: document.getElementById('check-recall-btn'),
    recallDiffResult: document.getElementById('recall-diff-result'),
    memorizedBtn: document.getElementById('memorized-btn'),
    memorizedCheckIcon: document.getElementById('memorized-check-icon'),
    memorizedBtnText: document.getElementById('memorized-btn-text'),

    // Profile
    profileTitleDisplay: document.getElementById('profile-title-display'),
    profileWho: document.getElementById('profile-who'),
    profileWhenWhere: document.getElementById('profile-when-where'),
    profileFamily: document.getElementById('profile-family'),
    profileKeyMoments: document.getElementById('profile-key-moments'),
    profileStrengths: document.getElementById('profile-strengths'),
    profileFailures: document.getElementById('profile-failures'),

    // Reading
    enterDfBtn: document.getElementById('enter-df-btn'),
    exitDfBtn: document.getElementById('exit-df-btn'),
    ch1Title: document.getElementById('ch1-title'),
    ch1Sub: document.getElementById('ch1-sub'),
    ch1ReadBtn: document.getElementById('ch1-read-btn'),
    ch1Text: document.getElementById('ch1-text'),
    ch2Title: document.getElementById('ch2-title'),
    ch2Sub: document.getElementById('ch2-sub'),
    ch2ReadBtn: document.getElementById('ch2-read-btn'),
    ch2Text: document.getElementById('ch2-text'),

    // Reflection & Lessons
    reflectionHeadline: document.getElementById('reflection-headline'),
    reflectionBody: document.getElementById('reflection-body'),
    lessonsContainer: document.getElementById('lessons-container'),

    // Notes
    notesTextarea: document.getElementById('notes-textarea'),
    notesSaveStatus: document.getElementById('notes-save-status'),
    notesWordCount: document.getElementById('notes-word-count'),

    // Quiz
    quizQuestionsContainer: document.getElementById('quiz-questions-container'),
    quizScoreBanner: document.getElementById('quiz-score-banner'),
    quizScoreText: document.getElementById('quiz-score-text'),
    quizScoreSub: document.getElementById('quiz-score-sub'),
    retakeQuizBtn: document.getElementById('retake-quiz-btn'),

    // Prayer
    guidedPrayerText: document.getElementById('guided-prayer-text'),
    customPrayerInput: document.getElementById('custom-prayer-input'),
    amenPrayerBtn: document.getElementById('amen-prayer-btn'),

    // Navigation & Views
    navTabItems: document.querySelectorAll('.nav-tab-item'),
    viewPanels: document.querySelectorAll('.view-panel'),
    logoHomeBtn: document.getElementById('logo-home-btn'),

    // Calendar view
    calendarProgressBar: document.getElementById('calendar-progress-bar'),
    calendarProgressLabel: document.getElementById('calendar-progress-label'),
    calendarPercentLabel: document.getElementById('calendar-percent-label'),
    fullDaysGrid: document.getElementById('full-days-grid'),

    // Other views
    versesLibraryList: document.getElementById('verses-library-list'),
    charactersStudiedList: document.getElementById('characters-studied-list'),
    quizMetricsContainer: document.getElementById('quiz-metrics-container'),
    weeklyReviewContainer: document.getElementById('weekly-review-container'),

    // Settings
    settingsStartDate: document.getElementById('settings-start-date'),
    settingsReminderTime: document.getElementById('settings-reminder-time'),
    enableNotificationsBtn: document.getElementById('enable-notifications-btn'),
    exportBackupBtn: document.getElementById('export-backup-btn'),
    importBackupTriggerBtn: document.getElementById('import-backup-trigger-btn'),
    importBackupInput: document.getElementById('import-backup-input')
  };

  // --- SPEECH SYNTHESIS HELPER ---
  let isSpeaking = false;
  function speakVerse(text) {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      el.audioBtnIcon.textContent = '🔊';
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => {
      isSpeaking = true;
      el.audioBtnIcon.textContent = '⏹️';
    };
    utterance.onend = utterance.onerror = () => {
      isSpeaking = false;
      el.audioBtnIcon.textContent = '🔊';
    };
    
    window.speechSynthesis.speak(utterance);
  }

  // --- DATE CALCULATIONS ---
  function getCalculatedDateForDay(dayNumber) {
    try {
      const [year, month, day] = state.startDate.split('-').map(Number);
      const start = new Date(year, month - 1, day);
      const targetDate = new Date(start);
      targetDate.setDate(targetDate.getDate() + (dayNumber - 1));
      
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      return targetDate.toLocaleDateString(undefined, options);
    } catch (e) {
      return `Day ${dayNumber}`;
    }
  }

  function getCalculatedDayNumberForToday() {
    try {
      const [year, month, day] = state.startDate.split('-').map(Number);
      const start = new Date(year, month - 1, day);
      const today = new Date();
      start.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffTime = today - start;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return Math.max(1, Math.min(365, diffDays));
    } catch (e) {
      return 1;
    }
  }

  // --- STREAK CALCULATION ---
  function updateStreakCounter() {
    const completed = new Set(state.completedDays);
    let streak = 0;
    
    // Calculate backwards from today's day number or current day
    const currentDayNum = state.currentDay;
    let day = currentDayNum;
    
    // If today is completed or yesterday was completed, count consecutive days
    while (day >= 1 && completed.has(day)) {
      streak++;
      day--;
    }

    el.streakCountText.textContent = `${streak} ${streak === 1 ? 'day' : 'days'}`;
  }

  // --- SPACED REPETITION ENGINE ---
  function getVersesDueForReview() {
    const due = [];
    const todayStr = new Date().toISOString().split('T')[0];

    for (const [dayStr, data] of Object.entries(state.memorizedVerses)) {
      if (!data || !data.date) continue;
      const dayNum = parseInt(dayStr, 10);
      if (dayNum === state.currentDay) continue; // Don't review today's verse as spaced review

      const memDate = new Date(data.date);
      const today = new Date(todayStr);
      const diffDays = Math.floor((today - memDate) / (1000 * 60 * 60 * 24));

      // Standard intervals: 1, 3, 7, 14, 30 days
      const intervals = [1, 3, 7, 14, 30];
      for (const intv of intervals) {
        if (diffDays >= intv && (!data.reviewsDone || !data.reviewsDone.includes(intv))) {
          // Get verse metadata from plan
          const planDay = (window.PLAN_365 || [])[dayNum - 1];
          if (planDay) {
            due.push({
              day: dayNum,
              interval: intv,
              reference: planDay.memoryVerse.reference,
              character: planDay.character,
              verse: planDay.memoryVerse.text
            });
          }
          break; // Show once per due threshold
        }
      }
    }
    return due;
  }

  function renderSpacedReviewBanner() {
    const dueVerses = getVersesDueForReview();
    if (dueVerses.length === 0) {
      el.reviewDueAlert.style.display = 'none';
      return;
    }

    el.reviewDueAlert.style.display = 'flex';
    el.reviewVersesList.innerHTML = '';
    
    dueVerses.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'review-tag-btn';
      btn.textContent = `Day ${item.day}: ${item.reference} (${item.interval}d review)`;
      btn.onclick = () => {
        // Jump to day to review
        loadDay(item.day);
      };
      el.reviewVersesList.appendChild(btn);
    });
  }

  // --- DAY COMPLETION EVALUATION ---
  function checkDayCompletion(dayNum) {
    const dCh1Key = `d${dayNum}_ch1`;
    const dCh2Key = `d${dayNum}_ch2`;

    const ch1Read = !!state.readChapters[dCh1Key];
    const ch2Read = !!state.readChapters[dCh2Key];
    const readingDone = ch1Read && ch2Read;

    const verseDone = !!state.memorizedVerses[dayNum] || (state.cramCounters[dayNum] >= 3);
    const quizDone = !!state.quizResults[dayNum];
    const prayerDone = !!state.prayedDays[dayNum];

    // Update checklist UI
    el.checkReading.classList.toggle('done', readingDone);
    el.checkVerse.classList.toggle('done', verseDone);
    el.checkQuiz.classList.toggle('done', quizDone);
    el.checkPrayer.classList.toggle('done', prayerDone);

    const isFullyCompleted = readingDone && verseDone && quizDone && prayerDone;

    if (isFullyCompleted) {
      if (!state.completedDays.includes(dayNum)) {
        state.completedDays.push(dayNum);
        state.completedDays.sort((a, b) => a - b);
        saveState();
        updateStreakCounter();
        renderCalendarGrid();
      }
    } else {
      // Remove from completed if toggled off
      const idx = state.completedDays.indexOf(dayNum);
      if (idx !== -1) {
        state.completedDays.splice(idx, 1);
        saveState();
        updateStreakCounter();
        renderCalendarGrid();
      }
    }
  }

  // --- CRAM IT PRACTICE CONTROLLER ---
  function setupCramMode(dayData) {
    const mv = dayData.memoryVerse;
    const dayNum = dayData.day;
    const fullText = mv.text;
    const cramData = mv.cramData || {
      readTarget: 3,
      blankWords: ['God', 'Lord'],
      firstLetters: ''
    };

    // 1. Read Aloud 3x Counter
    let currentTapCount = state.cramCounters[dayNum] || 0;
    el.tapCountNum.textContent = currentTapCount;
    el.tapCounterCircle.classList.toggle('completed', currentTapCount >= 3);

    el.tapCounterCircle.onclick = () => {
      currentTapCount = (currentTapCount + 1) % 4;
      state.cramCounters[dayNum] = currentTapCount;
      el.tapCountNum.textContent = currentTapCount;
      el.tapCounterCircle.classList.toggle('completed', currentTapCount >= 3);
      saveState();
      checkDayCompletion(dayNum);
    };

    // 2. Fill-in-the-Blank
    const blankWords = cramData.blankWords || [];
    const words = fullText.split(/\s+/);
    el.blanksContainer.innerHTML = '';

    words.forEach((rawWord, idx) => {
      const cleanWord = rawWord.replace(/[^\w]/g, '');
      const isBlank = blankWords.some(bw => bw.toLowerCase() === cleanWord.toLowerCase());

      if (isBlank) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'blank-input';
        input.dataset.expected = cleanWord.toLowerCase();
        input.placeholder = `[${cleanWord.length} letters]`;
        
        // Punctuation suffix
        const suffix = rawWord.slice(rawWord.lastIndexOf(cleanWord) + cleanWord.length);
        const span = document.createElement('span');
        span.appendChild(input);
        if (suffix) span.appendChild(document.createTextNode(suffix + ' '));
        else span.appendChild(document.createTextNode(' '));
        
        el.blanksContainer.appendChild(span);
      } else {
        el.blanksContainer.appendChild(document.createTextNode(rawWord + ' '));
      }
    });

    el.checkBlanksBtn.onclick = () => {
      const inputs = el.blanksContainer.querySelectorAll('.blank-input');
      let allCorrect = true;
      inputs.forEach(inp => {
        const val = inp.value.trim().toLowerCase();
        const expected = inp.dataset.expected;
        if (val === expected) {
          inp.classList.add('correct');
          inp.classList.remove('wrong');
        } else {
          inp.classList.add('wrong');
          inp.classList.remove('correct');
          allCorrect = false;
        }
      });
      if (allCorrect && inputs.length > 0) {
        alert('🎉 Excellent! You filled in all the blanks correctly.');
      }
    };

    el.revealBlanksBtn.onclick = () => {
      const inputs = el.blanksContainer.querySelectorAll('.blank-input');
      inputs.forEach(inp => {
        inp.value = inp.dataset.expected;
        inp.classList.add('correct');
      });
    };

    // 3. First Letters Trigger
    if (cramData.firstLetters) {
      el.firstLettersBox.textContent = cramData.firstLetters;
    } else {
      // Auto-generate first letters
      const fl = words.map(w => w.charAt(0) + (w.match(/[.,!?;:]/g) || '')).join(' ');
      el.firstLettersBox.textContent = fl;
    }

    // 4. Full Recall (Diff Checker)
    el.recallInput.value = '';
    el.recallDiffResult.style.display = 'none';

    el.checkRecallBtn.onclick = () => {
      const userText = el.recallInput.value.trim();
      if (!userText) {
        alert('Please type what you remember before checking.');
        return;
      }

      const expectedWords = fullText.split(/\s+/);
      const userWords = userText.split(/\s+/);
      
      const diffContainer = document.createElement('div');
      let matches = 0;

      expectedWords.forEach((expWord, i) => {
        const usrWord = userWords[i];
        const expClean = expWord.replace(/[^\w]/g, '').toLowerCase();
        const usrClean = usrWord ? usrWord.replace(/[^\w]/g, '').toLowerCase() : '';

        if (expClean === usrClean) {
          matches++;
          const span = document.createElement('span');
          span.className = 'diff-correct';
          span.textContent = expWord + ' ';
          diffContainer.appendChild(span);
        } else {
          const span = document.createElement('span');
          span.className = 'diff-missed';
          span.textContent = expWord + ' ';
          diffContainer.appendChild(span);
        }
      });

      const accuracy = Math.round((matches / expectedWords.length) * 100);
      const scoreBadge = document.createElement('div');
      scoreBadge.style.fontSize = '0.9rem';
      scoreBadge.style.fontWeight = '700';
      scoreBadge.style.marginTop = '0.5rem';
      scoreBadge.style.color = accuracy >= 80 ? 'var(--success)' : 'var(--accent)';
      scoreBadge.textContent = `Recall Accuracy: ${accuracy}% (${matches}/${expectedWords.length} words)`;
      
      el.recallDiffResult.innerHTML = '';
      el.recallDiffResult.appendChild(diffContainer);
      el.recallDiffResult.appendChild(scoreBadge);
      el.recallDiffResult.style.display = 'block';

      if (accuracy >= 90) {
        // Automatically suggest marking memorized
        if (!state.memorizedVerses[dayNum]) {
          markVerseMemorized(dayNum);
        }
      }
    };

    // Cram Step Tabs Switching
    const tabBtns = document.querySelectorAll('.cram-tab-btn');
    const tabPanels = {
      'read': document.getElementById('cram-step-read'),
      'blanks': document.getElementById('cram-step-blanks'),
      'letters': document.getElementById('cram-step-letters'),
      'recall': document.getElementById('cram-step-recall')
    };

    tabBtns.forEach(btn => {
      btn.onclick = () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const step = btn.dataset.step;
        Object.keys(tabPanels).forEach(k => {
          tabPanels[k].style.display = (k === step) ? 'block' : 'none';
        });
      };
    });

    // Memorized button toggle
    updateMemorizedButton(dayNum);
    el.memorizedBtn.onclick = () => {
      if (state.memorizedVerses[dayNum]) {
        delete state.memorizedVerses[dayNum];
      } else {
        markVerseMemorized(dayNum);
      }
      saveState();
      updateMemorizedButton(dayNum);
      checkDayCompletion(dayNum);
      renderSpacedReviewBanner();
    };
  }

  function markVerseMemorized(dayNum) {
    state.memorizedVerses[dayNum] = {
      date: new Date().toISOString().split('T')[0],
      intervals: [1, 3, 7, 14, 30],
      reviewsDone: []
    };
  }

  function updateMemorizedButton(dayNum) {
    const isMem = !!state.memorizedVerses[dayNum];
    el.memorizedBtn.classList.toggle('is-memorized', isMem);
    el.memorizedCheckIcon.textContent = isMem ? '✓' : '○';
    el.memorizedBtnText.textContent = isMem
      ? 'Memorized! (Scheduled for Spaced Review)'
      : "I've Got It — Mark as Memorized Today";
  }

  // --- CHAPTER READER SETUP ---
  function setupChapterReader(dayData) {
    const dayNum = dayData.day;
    const chapters = dayData.scripture || [];

    const ch1 = chapters[0] || { reference: 'Chapter 1', title: '', verses: [] };
    const ch2 = chapters[1] || { reference: 'Chapter 2', title: '', verses: [] };

    const ch1Key = `d${dayNum}_ch1`;
    const ch2Key = `d${dayNum}_ch2`;

    // Chapter 1
    el.ch1Title.textContent = ch1.reference;
    el.ch1Sub.textContent = ch1.title || '';
    renderVerses(el.ch1Text, ch1.verses);
    updateReadButton(el.ch1ReadBtn, !!state.readChapters[ch1Key]);
    
    el.ch1ReadBtn.onclick = () => {
      state.readChapters[ch1Key] = !state.readChapters[ch1Key];
      saveState();
      updateReadButton(el.ch1ReadBtn, !!state.readChapters[ch1Key]);
      checkDayCompletion(dayNum);
    };

    // Chapter 2
    el.ch2Title.textContent = ch2.reference;
    el.ch2Sub.textContent = ch2.title || '';
    renderVerses(el.ch2Text, ch2.verses);
    updateReadButton(el.ch2ReadBtn, !!state.readChapters[ch2Key]);

    el.ch2ReadBtn.onclick = () => {
      state.readChapters[ch2Key] = !state.readChapters[ch2Key];
      saveState();
      updateReadButton(el.ch2ReadBtn, !!state.readChapters[ch2Key]);
      checkDayCompletion(dayNum);
    };
  }

  function renderVerses(container, versesList) {
    container.innerHTML = '';
    versesList.forEach(v => {
      const p = document.createElement('p');
      p.className = 'scripture-verse';
      
      const numSpan = document.createElement('span');
      numSpan.className = 'verse-num';
      numSpan.textContent = v.number;
      
      p.appendChild(numSpan);
      p.appendChild(document.createTextNode(v.text));
      container.appendChild(p);
    });
  }

  function updateReadButton(btn, isRead) {
    btn.classList.toggle('is-read', isRead);
    btn.innerHTML = isRead ? '<span>✓</span> Marked as Read' : '<span>○</span> Mark as Read';
  }

  // --- QUIZ CONTROLLER ---
  function setupQuiz(dayData) {
    const dayNum = dayData.day;
    const questions = dayData.quiz || [];
    el.quizQuestionsContainer.innerHTML = '';
    
    const savedResult = state.quizResults[dayNum];
    let userAnswers = (savedResult && savedResult.answers) ? Object.assign({}, savedResult.answers) : {};
    let isCompleted = !!savedResult;

    questions.forEach((q, qIndex) => {
      const card = document.createElement('div');
      card.className = 'quiz-question-card';
      card.id = `quiz-card-${q.id}`;

      const prompt = document.createElement('div');
      prompt.className = 'question-prompt';
      prompt.textContent = `${qIndex + 1}. ${q.question}`;
      card.appendChild(prompt);

      const optionsList = document.createElement('div');
      optionsList.className = 'quiz-options-list';

      q.options.forEach((optText, optIdx) => {
        const optBtn = document.createElement('button');
        optBtn.className = 'quiz-option-btn';
        optBtn.textContent = optText;

        const previouslySelected = userAnswers[q.id] === optIdx;

        if (isCompleted) {
          optBtn.disabled = true;
          if (optIdx === q.correctIndex) {
            optBtn.classList.add('selected-correct');
          } else if (previouslySelected && optIdx !== q.correctIndex) {
            optBtn.classList.add('selected-wrong');
          }
        }

        optBtn.onclick = () => {
          if (isCompleted) return;
          
          userAnswers[q.id] = optIdx;
          const isCorrect = (optIdx === q.correctIndex);
          
          // Disable all buttons in this question
          const allBtns = optionsList.querySelectorAll('.quiz-option-btn');
          allBtns.forEach((b, i) => {
            b.disabled = true;
            if (i === q.correctIndex) b.classList.add('selected-correct');
            else if (i === optIdx && !isCorrect) b.classList.add('selected-wrong');
          });

          // Show explanation
          explanationBox.style.display = 'block';

          // Check if all questions are answered
          if (Object.keys(userAnswers).length === questions.length) {
            finishQuiz(dayNum, questions, userAnswers);
          }
        };

        optionsList.appendChild(optBtn);
      });

      card.appendChild(optionsList);

      // Explanation box
      const explanationBox = document.createElement('div');
      explanationBox.className = 'quiz-explanation-box';
      explanationBox.style.display = isCompleted ? 'block' : 'none';
      explanationBox.innerHTML = `<strong>Reference: ${q.reference}</strong><br>${q.explanation}`;
      card.appendChild(explanationBox);

      el.quizQuestionsContainer.appendChild(card);
    });

    if (isCompleted) {
      showQuizScoreBanner(savedResult.score, savedResult.total);
    } else {
      el.quizScoreBanner.style.display = 'none';
    }

    el.retakeQuizBtn.onclick = () => {
      delete state.quizResults[dayNum];
      saveState();
      checkDayCompletion(dayNum);
      setupQuiz(dayData);
    };
  }

  function finishQuiz(dayNum, questions, answers) {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        score++;
      }
    });

    state.quizResults[dayNum] = {
      score: score,
      total: questions.length,
      answers: answers,
      date: new Date().toISOString()
    };
    saveState();
    checkDayCompletion(dayNum);
    showQuizScoreBanner(score, questions.length);
  }

  function showQuizScoreBanner(score, total) {
    el.quizScoreText.textContent = `Score: ${score} / ${total} (${Math.round((score/total)*100)}%)`;
    el.quizScoreSub.textContent = score === total
      ? 'Outstanding! You mastered today\'s reading.'
      : 'Good effort! Review the Scripture references to strengthen your retention.';
    el.quizScoreBanner.style.display = 'block';
  }

  // --- LOAD DAY DEVOTIONAL ---
  function loadDay(dayNumber) {
    state.currentDay = Math.max(1, Math.min(365, dayNumber));
    saveState();

    const dayNum = state.currentDay;
    el.headerDayLabel.textContent = `Day ${dayNum}`;
    el.dayPillTag.textContent = `Day ${dayNum} of 365`;
    el.currentDateIndicator.textContent = getCalculatedDateForDay(dayNum);

    // Disable/enable arrows
    el.prevDayBtn.disabled = (dayNum <= 1);
    el.nextDayBtn.disabled = (dayNum >= 365);

    // Check if day exists in Days 1 to 7 content
    const fullContent = (window.DAYS_CONTENT || {})[dayNum];

    if (fullContent) {
      renderFullDay(fullContent);
    } else {
      renderPreviewDay(dayNum);
    }

    checkDayCompletion(dayNum);
    renderSpacedReviewBanner();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderFullDay(day) {
    // Header
    el.characterNameDisplay.textContent = day.character;
    el.characterSeasonDisplay.textContent = day.season;
    el.dayThemeDisplay.textContent = day.theme;

    // Memory Verse
    el.verseTextDisplay.textContent = day.memoryVerse.text;
    el.verseRefDisplay.textContent = day.memoryVerse.reference;
    el.verseWhyDisplay.textContent = day.memoryVerse.whyItMatters;

    // TTS Audio
    el.audioTtsBtn.onclick = () => {
      speakVerse(`${day.memoryVerse.reference}. ${day.memoryVerse.text}`);
    };

    // Cram Mode
    setupCramMode(day);

    // Character Profile
    const p = day.profile;
    el.profileTitleDisplay.textContent = p.title || `Profile: ${day.character}`;
    el.profileWho.textContent = p.who || '';
    el.profileWhenWhere.textContent = p.whenAndWhere || '';
    el.profileFamily.textContent = p.family || '';

    el.profileKeyMoments.innerHTML = '';
    (p.keyMoments || []).forEach(m => {
      const li = document.createElement('li');
      li.textContent = m;
      el.profileKeyMoments.appendChild(li);
    });

    el.profileStrengths.innerHTML = '';
    (p.strengths || []).forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      el.profileStrengths.appendChild(li);
    });

    el.profileFailures.innerHTML = '';
    (p.failures || []).forEach(f => {
      const li = document.createElement('li');
      li.textContent = f;
      el.profileFailures.appendChild(li);
    });

    // Scripture Reading
    setupChapterReader(day);

    // What God Is Saying
    el.reflectionHeadline.textContent = day.whatGodIsSaying.headline || 'What God Is Saying Today';
    el.reflectionBody.innerHTML = '';
    const paragraphs = (day.whatGodIsSaying.reflection || '').split('\n\n');
    paragraphs.forEach(para => {
      const pEl = document.createElement('p');
      pEl.textContent = para;
      el.reflectionBody.appendChild(pEl);
    });

    // Lessons
    el.lessonsContainer.innerHTML = '';
    (day.lessons || []).forEach(lesson => {
      const card = document.createElement('div');
      card.className = 'lesson-card';
      card.innerHTML = `
        <div class="lesson-header">
          <span class="lesson-title">${lesson.lesson}</span>
          <span class="lesson-verse-cite">${lesson.verse}</span>
        </div>
        <p class="lesson-detail">${lesson.detail}</p>
        <div class="lesson-app-question">
          <strong>Personal Application:</strong> ${lesson.question}
        </div>
      `;
      el.lessonsContainer.appendChild(card);
    });

    // Notes auto-save
    el.notesTextarea.value = state.notes[day.day] || '';
    updateNotesWordCount();
    el.notesTextarea.oninput = () => {
      state.notes[day.day] = el.notesTextarea.value;
      saveState();
      updateNotesWordCount();
      el.notesSaveStatus.textContent = 'Auto-saved just now';
    };

    // Quiz
    setupQuiz(day);

    // Closing Prayer
    el.guidedPrayerText.textContent = day.closingPrayer.guidedPrayer;
    el.customPrayerInput.value = state.customPrayers[day.day] || '';
    el.customPrayerInput.oninput = () => {
      state.customPrayers[day.day] = el.customPrayerInput.value;
      saveState();
    };

    updateAmenButton(day.day);
    el.amenPrayerBtn.onclick = () => {
      state.prayedDays[day.day] = !state.prayedDays[day.day];
      saveState();
      updateAmenButton(day.day);
      checkDayCompletion(day.day);
    };
  }

  function updateAmenButton(dayNum) {
    const isPrayed = !!state.prayedDays[dayNum];
    el.amenPrayerBtn.classList.toggle('is-prayed', isPrayed);
    el.amenPrayerBtn.innerHTML = isPrayed
      ? '<span>✓</span> Amen, I Have Prayed'
      : '<span>🙏</span> Amen, I\'ve Prayed';
  }

  function updateNotesWordCount() {
    const text = el.notesTextarea.value.trim();
    const count = text ? text.split(/\s+/).length : 0;
    el.notesWordCount.textContent = `${count} ${count === 1 ? 'word' : 'words'}`;
  }

  // --- PREVIEW DAY FOR DAYS 8–365 ---
  function renderPreviewDay(dayNum) {
    const planItem = (window.PLAN_365 || [])[dayNum - 1];
    if (!planItem) return;

    el.characterNameDisplay.textContent = planItem.character;
    el.characterSeasonDisplay.textContent = planItem.season;
    el.dayThemeDisplay.textContent = planItem.theme;

    el.verseTextDisplay.textContent = planItem.memoryVerse.text;
    el.verseRefDisplay.textContent = planItem.memoryVerse.reference;
    el.verseWhyDisplay.textContent = planItem.memoryVerse.whyItMatters;

    el.audioTtsBtn.onclick = () => {
      speakVerse(`${planItem.memoryVerse.reference}. ${planItem.memoryVerse.text}`);
    };

    // Reset cram and profile for preview
    el.tapCountNum.textContent = '0';
    el.blanksContainer.innerHTML = `<p style="font-style: italic; color: var(--text-muted);">Cram practice will unlock with the full devotional batch for Day ${dayNum}.</p>`;
    el.firstLettersBox.textContent = planItem.memoryVerse.text.split(/\s+/).map(w => w[0]).join(' ');

    el.profileTitleDisplay.textContent = `Overview: ${planItem.character}`;
    el.profileWho.textContent = `Focus: ${planItem.season}`;
    el.profileWhenWhere.textContent = 'Scripture Narrative Arc';
    el.profileFamily.textContent = 'Biblical Lineage';
    el.profileKeyMoments.innerHTML = `<li>Assigned Readings: ${planItem.chapters.join(' and ')}</li>`;
    el.profileStrengths.innerHTML = '<li>Upcoming in full curriculum batch</li>';
    el.profileFailures.innerHTML = '<li>Upcoming in full curriculum batch</li>';

    // Chapters placeholder
    el.ch1Title.textContent = planItem.chapters[0];
    el.ch1Sub.textContent = 'Assigned Bible Chapter';
    el.ch1Text.innerHTML = `<p style="color: var(--text-secondary); font-style: italic;">Full text for ${planItem.chapters[0]} will be loaded in the batch generation. Read this reference in your Bible or app.</p>`;
    
    el.ch2Title.textContent = planItem.chapters[1];
    el.ch2Sub.textContent = 'Assigned Bible Chapter';
    el.ch2Text.innerHTML = `<p style="color: var(--text-secondary); font-style: italic;">Full text for ${planItem.chapters[1]} will be loaded in the batch generation. Read this reference in your Bible or app.</p>`;

    el.reflectionHeadline.textContent = `Knowing God Through ${planItem.character}`;
    el.reflectionBody.innerHTML = `<p>${planItem.theme}</p><p><em>Complete mentor reflection and interactive quiz for Day ${dayNum} are queued for generation after Day 1–7 approval.</em></p>`;

    el.lessonsContainer.innerHTML = `
      <div class="lesson-card">
        <div class="lesson-header">
          <span class="lesson-title">Core Theme</span>
          <span class="lesson-verse-cite">${planItem.memoryVerse.reference}</span>
        </div>
        <p class="lesson-detail">${planItem.theme}</p>
        <div class="lesson-app-question">
          <strong>Reflection Question:</strong> What does ${planItem.character}'s life teach you about God's steadfast character?
        </div>
      </div>
    `;

    el.notesTextarea.value = state.notes[dayNum] || '';
    el.quizQuestionsContainer.innerHTML = '<p style="color: var(--text-muted); padding: 1rem; text-align: center;">Interactive 5-question quiz for this day will unlock in the 30-day batch release.</p>';
    el.quizScoreBanner.style.display = 'none';

    el.guidedPrayerText.textContent = `Lord God, thank You for the life and testimony of ${planItem.character}. As I study Your Word in ${planItem.chapters.join(' and ')}, teach me to know You more deeply. Ground my faith in Your promises and let ${planItem.memoryVerse.reference} take deep root in my heart today. Amen.`;
    el.customPrayerInput.value = state.customPrayers[dayNum] || '';
    updateAmenButton(dayNum);
  }

  // --- CALENDAR & 365 DAYS GRID ---
  function renderCalendarGrid() {
    const totalDays = 365;
    const completedCount = state.completedDays.length;
    const pct = Math.round((completedCount / totalDays) * 100);

    el.calendarProgressLabel.textContent = `${completedCount} of ${totalDays} days completed`;
    el.calendarPercentLabel.textContent = `${pct}%`;
    el.calendarProgressBar.style.width = `${pct}%`;

    const grids = [el.fullDaysGrid, el.modalDaysGrid];

    grids.forEach(grid => {
      if (!grid) return;
      grid.innerHTML = '';

      for (let d = 1; d <= totalDays; d++) {
        const btn = document.createElement('button');
        btn.className = 'day-grid-btn';
        btn.textContent = d;

        if (state.completedDays.includes(d)) {
          btn.classList.add('completed');
        }
        if (d === state.currentDay) {
          btn.classList.add('current');
        }

        btn.onclick = () => {
          loadDay(d);
          switchView('daily');
          el.dayJumperModal.style.display = 'none';
        };

        grid.appendChild(btn);
      }
    });
  }

  // --- MEMORY VERSES LIBRARY ---
  function renderVersesLibrary() {
    const plan = window.PLAN_365 || [];
    el.versesLibraryList.innerHTML = '';

    plan.forEach(item => {
      const isMem = !!state.memorizedVerses[item.day];
      const card = document.createElement('div');
      card.className = 'lesson-card';
      card.style.marginBottom = '0.75rem';

      card.innerHTML = `
        <div class="lesson-header">
          <span class="lesson-title">Day ${item.day}: ${item.character}</span>
          <span class="lesson-verse-cite" style="color: ${isMem ? 'var(--success)' : 'var(--text-muted)'};">
            ${isMem ? '✓ Memorized' : '○ Not yet'}
          </span>
        </div>
        <p style="font-family: var(--font-serif); font-size: 1.05rem; margin: 0.4rem 0;">"${item.memoryVerse.text}"</p>
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.82rem;">
          <strong style="color: var(--accent);">${item.memoryVerse.reference}</strong>
          <button class="btn-secondary" style="padding: 0.25rem 0.6rem; font-size: 0.78rem;" onclick="window.appLoadDay(${item.day})">Study Day ${item.day}</button>
        </div>
      `;
      el.versesLibraryList.appendChild(card);
    });
  }

  // --- CHARACTERS STUDIED DIRECTORY ---
  function renderCharactersStudied() {
    const plan = window.PLAN_365 || [];
    el.charactersStudiedList.innerHTML = '';

    plan.slice(0, 35).forEach(item => {
      const isDone = state.completedDays.includes(item.day);
      const userNote = state.notes[item.day] || '';

      const card = document.createElement('div');
      card.className = 'lesson-card';
      card.style.marginBottom = '0.75rem';

      card.innerHTML = `
        <div class="lesson-header">
          <span class="lesson-title">Day ${item.day}: ${item.character}</span>
          <span style="font-size: 0.8rem; color: ${isDone ? 'var(--success)' : 'var(--text-muted)'};">
            ${isDone ? '✓ Completed' : 'Pending'}
          </span>
        </div>
        <div style="font-size: 0.86rem; color: var(--accent); font-weight: 600; margin-bottom: 0.35rem;">${item.season}</div>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 0.5rem;">${item.theme}</p>
        ${userNote ? `<div style="background: var(--bg-card); padding: 0.5rem; border-radius: var(--radius-sm); font-size: 0.82rem; margin-top: 0.4rem;"><strong>My Notes:</strong> ${userNote}</div>` : ''}
        <button class="btn-secondary" style="margin-top: 0.5rem; padding: 0.25rem 0.6rem; font-size: 0.78rem;" onclick="window.appLoadDay(${item.day})">Open Day ${item.day}</button>
      `;
      el.charactersStudiedList.appendChild(card);
    });
  }

  // --- QUIZ SCORES & METRICS ---
  function renderQuizMetrics() {
    const results = Object.values(state.quizResults);
    el.quizMetricsContainer.innerHTML = '';

    if (results.length === 0) {
      el.quizMetricsContainer.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No quizzes taken yet. Complete a daily devotional quiz to see your scores here!</p>';
      return;
    }

    let totalScore = 0;
    let totalQuestions = 0;
    results.forEach(r => {
      totalScore += r.score;
      totalQuestions += r.total;
    });

    const avgPct = Math.round((totalScore / totalQuestions) * 100);

    const summary = document.createElement('div');
    summary.className = 'quiz-score-banner';
    summary.innerHTML = `
      <div class="score-display-text">${avgPct}%</div>
      <p style="color: var(--text-secondary);">Average Comprehension Score across ${results.length} ${results.length === 1 ? 'quiz' : 'quizzes'}</p>
      <div style="font-size: 0.88rem; margin-top: 0.5rem; color: var(--text-muted);">Total questions answered correctly: ${totalScore} of ${totalQuestions}</div>
    `;
    el.quizMetricsContainer.appendChild(summary);
  }

  // --- WEEKLY REVIEW ---
  function renderWeeklyReview() {
    el.weeklyReviewContainer.innerHTML = '';
    const totalWeeks = 52;

    for (let w = 1; w <= 4; w++) {
      const startDay = (w - 1) * 7 + 1;
      const endDay = w * 7;
      const savedReflection = state.weeklyReflections[w] || '';

      const card = document.createElement('div');
      card.className = 'lesson-card';
      card.style.marginBottom = '1.25rem';

      card.innerHTML = `
        <div class="lesson-header">
          <span class="lesson-title">Week ${w}: Days ${startDay}–${endDay}</span>
          <span class="lesson-verse-cite">Weekly Consolidation</span>
        </div>
        <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
          What is one thing God taught you about His character this week?
        </p>
        <textarea class="notes-textarea" id="weekly-reflect-${w}" placeholder="This week, God revealed to me that...">${savedReflection}</textarea>
        <div style="text-align: right; margin-top: 0.4rem;">
          <button class="btn-primary" style="padding: 0.35rem 0.8rem; font-size: 0.82rem;" id="save-weekly-${w}">Save Reflection</button>
        </div>
      `;

      el.weeklyReviewContainer.appendChild(card);

      const saveBtn = card.querySelector(`#save-weekly-${w}`);
      const txtArea = card.querySelector(`#weekly-reflect-${w}`);
      saveBtn.onclick = () => {
        state.weeklyReflections[w] = txtArea.value;
        saveState();
        alert('Saved your weekly reflection!');
      };
    }
  }

  // --- NAVIGATION / VIEWS ROUTER ---
  function switchView(viewName) {
    el.viewPanels.forEach(p => p.style.display = 'none');
    el.navTabItems.forEach(t => t.classList.toggle('active', t.dataset.view === viewName));

    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.style.display = 'block';
    }

    if (viewName === 'calendar') renderCalendarGrid();
    else if (viewName === 'verses') renderVersesLibrary();
    else if (viewName === 'characters') renderCharactersStudied();
    else if (viewName === 'scores') renderQuizMetrics();
    else if (viewName === 'weekly') renderWeeklyReview();
  }

  // Global window hook for buttons rendered dynamically
  window.appLoadDay = function(dayNum) {
    loadDay(dayNum);
    switchView('daily');
  };

  // --- SETTINGS, THEMES, AND BACKUP ---
  function setupSettings() {
    // Start date
    el.settingsStartDate.value = state.startDate;
    el.settingsStartDate.onchange = () => {
      state.startDate = el.settingsStartDate.value;
      saveState();
      el.currentDateIndicator.textContent = getCalculatedDateForDay(state.currentDay);
    };

    // Theme toggle
    document.documentElement.dataset.theme = state.theme;
    el.themeIcon.textContent = state.theme === 'dark' ? '☀️' : '🌙';

    el.themeToggleBtn.onclick = () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = state.theme;
      el.themeIcon.textContent = state.theme === 'dark' ? '☀️' : '🌙';
      saveState();
    };

    // Font size controls
    const fontBtns = document.querySelectorAll('.font-size-btn');
    document.documentElement.dataset.fontSize = state.fontSize || 'medium';

    fontBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === state.fontSize);
      btn.onclick = () => {
        fontBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.fontSize = btn.dataset.size;
        document.documentElement.dataset.fontSize = state.fontSize;
        saveState();
      };
    });

    // Distraction-free mode
    el.enterDfBtn.onclick = () => {
      document.body.classList.add('distraction-free');
    };
    el.exitDfBtn.onclick = () => {
      document.body.classList.remove('distraction-free');
    };

    // Notifications
    el.settingsReminderTime.value = state.reminderTime || '07:00';
    el.settingsReminderTime.onchange = () => {
      state.reminderTime = el.settingsReminderTime.value;
      saveState();
    };

    el.enableNotificationsBtn.onclick = () => {
      if (!('Notification' in window)) {
        alert('Notifications are not supported in this browser.');
        return;
      }
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          state.notificationsEnabled = true;
          saveState();
          alert(`Daily devotional reminder set for ${state.reminderTime} every morning.`);
          new Notification('Know Him More', {
            body: 'Daily reminders are enabled! We will prompt you to spend time in God\'s Word.',
            icon: './public/icon-192.png'
          });
        }
      });
    };

    // Export JSON Backup
    el.exportBackupBtn.onclick = () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `know_him_more_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    };

    // Import JSON Backup
    el.importBackupTriggerBtn.onclick = () => {
      el.importBackupInput.click();
    };

    el.importBackupInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          if (imported && typeof imported === 'object') {
            state = Object.assign({}, defaultState, imported);
            saveState();
            alert('Backup successfully restored!');
            location.reload();
          }
        } catch (err) {
          alert('Failed to parse backup file. Please ensure it is a valid JSON file.');
        }
      };
      reader.readAsText(file);
    };
  }

  // --- INITIALIZATION ---
  function init() {
    setupSettings();

    // Setup Nav tabs
    el.navTabItems.forEach(tab => {
      tab.onclick = () => switchView(tab.dataset.view);
    });

    el.logoHomeBtn.onclick = () => {
      loadDay(state.currentDay);
      switchView('daily');
    };

    // Day jumper modal
    el.openDayJumperBtn.onclick = () => {
      renderCalendarGrid();
      el.dayJumperModal.style.display = 'flex';
    };
    el.closeJumperBtn.onclick = () => {
      el.dayJumperModal.style.display = 'none';
    };

    // Prev / Next day buttons
    el.prevDayBtn.onclick = () => {
      if (state.currentDay > 1) loadDay(state.currentDay - 1);
    };
    el.nextDayBtn.onclick = () => {
      if (state.currentDay < 365) loadDay(state.currentDay + 1);
    };

    // Load initial day
    loadDay(state.currentDay);
    updateStreakCounter();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

