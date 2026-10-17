const APP_KEY = 'memora-local-demo-v1';
const FORMAT_LABELS = {
  'multiple-choice': 'Multiple choice',
  'true-false': 'True or false',
  written: 'Written answer',
  spelling: 'Spelling'
};
const MODES = [
  { id: 'practice', icon: '✦', name: 'Question practice', copy: 'Answer until every question is right.', color: '#f0eaff' },
  { id: 'flashcards', icon: '▱', name: 'Flashcards', copy: 'Flip, check, and sort each card.', color: '#eaf4ff' },
  { id: 'test', icon: '✓', name: 'Test', copy: 'Choose a length, then see your score.', color: '#eaf8f1' },
  { id: 'blockblast', icon: '▦', name: 'Block Blast', copy: 'Get a question right to earn shapes.', color: '#fff1e7' },
  { id: 'matching', icon: '⇄', name: 'Matching', copy: 'Pair the cards and beat your time.', color: '#fff0f5' }
];
const SHAPES = [
  [[0,0]],
  [[0,0],[0,1]],
  [[0,0],[1,0]],
  [[0,0],[0,1],[1,0]],
  [[0,0],[0,1],[0,2]],
  [[0,0],[1,0],[1,1]],
  [[0,0],[0,1],[1,1]],
  [[0,0],[0,1],[1,0],[1,1]]
];

function starterDecks() {
  return [
    {
      id: 'fractions-starter', title: 'Fractions made simple', subject: 'Math', icon: '➗', color: '#eee9ff', ink: '#6854c8', creator: 'Memora team', cards: [
        { id: 'f1', prompt: 'What is 1/2 + 1/4?', answer: '3/4', wrong: '1/6', options: ['1/6', '2/4', '3/4', '1/8'], formats: ['multiple-choice','true-false','written','spelling'] },
        { id: 'f2', prompt: 'What is 3/4 written as a decimal?', answer: '0.75', wrong: '0.34', options: ['0.25', '0.5', '0.75', '1.25'], formats: ['multiple-choice','true-false','written','spelling'] },
        { id: 'f3', prompt: 'Which fraction is equal to 2/3?', answer: '4/6', wrong: '2/6', options: ['2/6', '3/5', '4/6', '5/6'], formats: ['multiple-choice','true-false','written','spelling'] },
        { id: 'f4', prompt: 'What is 5/8 + 1/8?', answer: '3/4', wrong: '6/16', options: ['1/2', '3/4', '5/8', '7/8'], formats: ['multiple-choice','true-false','written','spelling'] },
        { id: 'f5', prompt: 'Which fraction is largest?', answer: '3/4', wrong: '1/4', options: ['1/4', '1/2', '2/3', '3/4'], formats: ['multiple-choice','true-false','written','spelling'] },
        { id: 'f6', prompt: 'What is 2/5 written as a decimal?', answer: '0.4', wrong: '0.25', options: ['0.2', '0.4', '0.5', '2.5'], formats: ['multiple-choice','true-false','written','spelling'] }
      ]
    },
    {
      id: 'space-starter', title: 'Our solar system', subject: 'Science', icon: '🪐', color: '#e8f4ff', ink: '#4772a7', creator: 'Skylar', cards: [
        { id: 's1', prompt: 'Which planet is closest to the Sun?', answer: 'Mercury', wrong: 'Mars', options: ['Earth', 'Mars', 'Mercury', 'Venus'], formats: ['multiple-choice','true-false','written','spelling'] },
        { id: 's2', prompt: 'Which planet is known for its rings?', answer: 'Saturn', wrong: 'Venus', options: ['Saturn', 'Mercury', 'Earth', 'Mars'], formats: ['multiple-choice','true-false','written','spelling'] },
        { id: 's3', prompt: 'What star is at the center of our solar system?', answer: 'The Sun', wrong: 'Polaris', options: ['The Moon', 'Polaris', 'The Sun', 'Sirius'], formats: ['multiple-choice','true-false','written','spelling'] },
        { id: 's4', prompt: 'Which planet is called the Red Planet?', answer: 'Mars', wrong: 'Neptune', options: ['Neptune', 'Mars', 'Jupiter', 'Earth'], formats: ['multiple-choice','true-false','written','spelling'] },
        { id: 's5', prompt: 'Which planet is the largest?', answer: 'Jupiter', wrong: 'Earth', options: ['Jupiter', 'Saturn', 'Venus', 'Neptune'], formats: ['multiple-choice','true-false','written','spelling'] }
      ]
    },
    {
      id: 'vocab-starter', title: 'Word power: starter set', subject: 'Vocabulary', icon: '📚', color: '#fff1e7', ink: '#b0703d', creator: 'Memora team', cards: [
        { id: 'v1', prompt: 'A word that means “very happy”', answer: 'Delighted', wrong: 'Tired', options: ['Confused', 'Delighted', 'Tired', 'Quiet'], formats: ['multiple-choice','true-false','written','spelling'] },
        { id: 'v2', prompt: 'A word that means “to look closely”', answer: 'Observe', wrong: 'Forget', options: ['Observe', 'Hurry', 'Forget', 'Whisper'], formats: ['multiple-choice','true-false','written','spelling'] },
        { id: 'v3', prompt: 'A word that means “brave”', answer: 'Courageous', wrong: 'Sleepy', options: ['Sleepy', 'Courageous', 'Tiny', 'Curious'], formats: ['multiple-choice','true-false','written','spelling'] },
        { id: 'v4', prompt: 'A word that means “to make something better”', answer: 'Improve', wrong: 'Ignore', options: ['Ignore', 'Improve', 'Scatter', 'Pause'], formats: ['multiple-choice','true-false','written','spelling'] }
      ]
    }
  ];
}

function initialState() {
  return { profile: null, decks: starterDecks(), classes: [], usage: {}, results: [], plan: 'free', planPrompt: null };
}
function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(APP_KEY));
    if (saved && Array.isArray(saved.decks) && saved.decks.length) {
      saved.classes ||= []; saved.usage ||= {}; saved.results ||= []; saved.plan ||= 'free'; saved.planPrompt ||= null;
      return saved;
    }
  } catch (error) { console.warn('Memora could not read its saved demo data.', error); }
  return initialState();
}
let state = readState();
let page = 'home';
let selectedDeckId = null;
let selectedClassId = null;
let editingDeckId = null;
let session = null;
let liveEvent = null;
let toastTimer = null;
let planPrompt = state.planPrompt || null;

const app = document.querySelector('#app');
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
const getDeck = (id) => state.decks.find((deck) => deck.id === id);
const getUsage = (id) => state.usage[id] ||= {};
const save = () => { try { localStorage.setItem(APP_KEY, JSON.stringify(state)); } catch (error) { console.warn('Memora could not save demo data.', error); } };
const nameInitial = () => (state.profile?.firstName || '?').trim().charAt(0).toUpperCase();
const displayName = () => state.profile?.username || state.profile?.firstName || 'Student';
const formatTime = (seconds) => `${(seconds / 60 | 0)}:${String(Math.floor(seconds % 60)).padStart(2,'0')}`;
const randomCode = (length = 6) => Array.from({ length }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
const shuffle = (items) => [...items].sort(() => Math.random() - .5);

function toast(message) {
  document.querySelector('.toast')?.remove();
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = message; document.body.append(el);
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.remove(), 2700);
}
function deckCard(deck) {
  return `<article class="deck-card" data-action="open-deck" data-id="${esc(deck.id)}" style="--deck-color:${esc(deck.color || '#eee9ff')};--deck-ink:${esc(deck.ink || '#6854c8')}">
    <div class="deck-cover"><span class="deck-symbol">${esc(deck.icon || '✦')}</span><span class="deck-subject">${esc(deck.subject || 'My set')}</span></div>
    <div class="deck-body"><h3>${esc(deck.title)}</h3><p>by ${esc(deck.creator || displayName())}</p><div class="deck-foot"><span>${deck.cards.length} cards</span><span class="deck-arrow">↗</span></div></div>
  </article>`;
}
function pageHeading(title, copy, action = '') {
  return `<div class="page-title"><div><h1>${title}</h1><p>${copy}</p></div>${action}</div>`;
}
function localNotice() {
  return `<div class="local-notice"><span>✦</span><span><strong>Local demo:</strong> your data stays in this browser. Class codes and live events are a preview and are not shared with other devices yet.</span></div>`;
}

function welcomePage() {
  return `<main class="welcome-screen"><section class="welcome-card">
    <div class="welcome-brand"><img src="assets/memora-mark.svg" alt="Memora symbol"><strong>Memora</strong></div>
    <h1>Make learning stick.</h1>
    <p>Create a local profile to try the study app. Your name helps make your profile symbol, and your username is what classmates would see.</p>
    <form data-form="profile">
      <div class="form-row"><div class="field"><label for="first-name">First name <span aria-hidden="true">*</span></label><input id="first-name" name="firstName" autocomplete="given-name" required maxlength="40" placeholder="Your first name"></div><div class="field"><label for="username">Username <span aria-hidden="true">*</span></label><input id="username" name="username" required minlength="2" maxlength="24" placeholder="Choose a username"></div></div>
      <div class="form-row"><div class="field"><label for="birthday">Birthday (optional)</label><input id="birthday" name="birthday" type="date"></div><div class="field"><label for="role">I am a…</label><select id="role" name="role"><option value="student">Student</option><option value="teacher">Teacher</option></select></div></div>
      <button class="button" type="submit">Create local profile <span>→</span></button>
    </form>
    <div class="welcome-small">This local demo does not create an online account or password. Data is saved only in this browser on this device.</div>
  </section></main>`;
}

function renderApp() {
  if (!state.profile) { app.innerHTML = welcomePage(); return; }
  const nav = [
    ['home','⌂','Home'], ['sets','▤','My sets'], ['classes','▣','Classes'], ['events','✦','Live events'], ['profile','◉','Profile']
  ];
  const title = page === 'deck' ? (getDeck(selectedDeckId)?.title || 'My sets') : ({ home:'Home', sets:'My sets', classes:'Classes', events:'Live events', profile:'Profile', 'new-set':'Create a set' }[page] || 'Study');
  app.innerHTML = `<div class="app-shell">
    <aside class="sidebar"><a class="brand" href="#" data-action="go" data-page="home"><img src="assets/memora-mark.svg" alt=""><span class="brand-name">Memora<span class="brand-small">Study anything</span></span></a>
      <div class="nav-label">Your space</div><nav class="nav-list">${nav.map(([id,icon,label]) => `<button class="nav-button ${page === id ? 'active' : ''}" data-action="go" data-page="${id}"><span class="nav-icon">${icon}</span><span>${label}</span></button>`).join('')}</nav>
    </aside>
    <div class="main-area"><header class="topbar"><div class="crumb">Memora <span> / </span> <strong>${esc(title)}</strong></div><div class="top-actions"><span class="local-chip"><span class="local-dot"></span>Local only</span><button class="profile-button" data-action="go" data-page="profile"><span class="avatar">${esc(nameInitial())}</span><span class="profile-meta"><strong>${esc(displayName())}</strong><span>${state.profile.role === 'teacher' ? 'Teacher profile' : 'Student profile'}</span></span></button></div></header>
      <main class="content">${localNotice()}${renderPage()}</main>
    </div>
  </div>${planPrompt ? renderPlanPrompt() : ''}`;
}

function renderPlanPrompt() {
  const isLimit = planPrompt === 'limit';
  return `<div class="plan-overlay" role="dialog" aria-modal="true" aria-labelledby="plan-prompt-title"><section class="plan-dialog"><p class="eyebrow">${isLimit ? 'Free limit reached' : 'Welcome to Memora'}</p><h2 id="plan-prompt-title">${isLimit ? 'Keep learning without limits' : 'Choose your study plan'}</h2><p>${isLimit ? 'You used the free round for this set. Choose a plan to keep taking tests and question practice.' : 'Pick the plan that fits you. This local demo does not take payment.'}</p><div class="plan-options"><button class="plan-option" data-action="choose-plan" data-plan="free"><strong>Free</strong><span>1 test and 1 question-practice round per set</span><b>$0</b></button><button class="plan-option featured" data-action="choose-plan" data-plan="monthly"><strong>Monthly membership</strong><span>Unlimited tests and question practice</span><b>$2/mo</b></button><button class="plan-option" data-action="choose-plan" data-plan="yearly"><strong>Yearly membership</strong><span>Unlimited tests and question practice</span><b>$18/yr</b></button></div><p class="helper">You can change your demo choice later from Plans in the side menu. No payment is taken.</p></section></div>`;
}

function renderPage() {
  if (page === 'home') return renderHome();
  if (page === 'sets') return renderSets();
  if (page === 'deck') return renderDeck();
  if (page === 'new-set') return renderNewSet();
  if (page === 'classes') return renderClasses();
  if (page === 'teacher-progress') return renderTeacherProgress();
  if (page === 'events') return renderEvents();

  if (page === 'profile') return renderProfile();
  if (page === 'practice') return renderPracticePage();
  if (page === 'flashcards') return renderFlashcards();
  if (page === 'test') return renderTestPage();
  if (page === 'matching') return renderMatching();
  if (page === 'blockblast') return renderBlockBlast();
  return renderHome();
}

function renderHome() {
  const first = state.profile.firstName || displayName();
  const mySets = state.decks.filter((deck) => deck.creator === displayName() || deck.creator === 'Memora team');
  const recent = mySets.slice(0, 3);
  return `<section class="hero"><div class="hero-copy"><p class="eyebrow">A little progress adds up</p><h1>Hey ${esc(first)}, ready to learn?</h1><p>Study with cards you make or find a set that someone has already shared.</p><button class="button white" data-action="go" data-page="sets">Explore study sets <span>→</span></button></div><div class="hero-mark"><img src="assets/memora-mark.svg" alt="Memora star symbol"></div></section>
    <div class="section-head"><div><h2>Pick up where you left off</h2><p>Choose a set to see all five ways to study it.</p></div><button class="link-button" data-action="go" data-page="sets">View all sets ↗</button></div>
    ${recent.length ? `<div class="grid cols-3">${recent.map(deckCard).join('')}</div>` : empty('▤','Your library is ready for its first set.','Make a set or explore ones other people shared.','Create a set','new-set')}
    <div class="section-head"><div><h2>Join your class</h2><p>Enter the code from your teacher.</p></div><button class="link-button" data-action="go" data-page="classes">My classes ↗</button></div>
    <div class="card quick-card"><div class="quick-icon" style="background:#eaf8f1">▣</div><div style="flex:1"><h3>Have a class code?</h3><p>Join a teacher’s class using the code they gave you.</p></div><form class="join-inline" data-form="join-class"><input class="input" name="code" maxlength="8" placeholder="Enter class code" aria-label="Class code" required><button class="button small" type="submit">Join class</button></form></div>
    <div class="section-head"><div><h2>Live events</h2></div><button class="link-button" data-action="go" data-page="events">Open live events ↗</button></div>
    <div class="grid cols-2"><div class="card quick-card"><div class="quick-icon" style="background:#f1edff">✦</div><div style="flex:1"><h3>Play with a 12-answer streak</h3><p>A separate place for quick solo or team games. Join with an event code or host a practice round.</p></div><button class="button small soft" data-action="go" data-page="events">Go to events</button></div><div class="card quick-card"><div class="quick-icon" style="background:#fff1e6">＋</div><div style="flex:1"><h3>Make a study set</h3><p>Add questions for your own practice or class.</p></div><button class="button small outline" data-action="go" data-page="new-set">Create set</button></div></div>`;
}
function empty(icon, title, copy, button, pageName) {
  return `<div class="empty-state"><div class="empty-icon">${icon}</div><h3>${esc(title)}</h3><p>${esc(copy)}</p>${button ? `<button class="button small" data-action="go" data-page="${pageName}">${esc(button)}</button>` : ''}</div>`;
}
function renderSets() {
  return `${pageHeading('Study sets','Search a creator’s name to find all of their sets, or search by title or subject.', '<button class="button" data-action="go" data-page="new-set">＋ Create a set</button>')}
    <div class="search-wrap"><span class="search-icon">⌕</span><input class="input" id="set-search" placeholder="Search creator, title, or subject" aria-label="Search creators and study sets"></div><p class="helper" id="set-search-results" style="margin:8px 0 0">Search includes creator names, titles, and subjects.</p>
    <div class="section-head"><div><h2>All sets</h2><p>${state.decks.length} sets available in this browser.</p></div></div>
    <div class="grid cols-3" id="deck-list">${state.decks.map(deckCard).join('')}</div>`;
}
function usagePill(used) { return used ? '<span class="pill orange">Free try used</span>' : '<span class="pill green">1 free try per set</span>'; }
function renderDeck() {
  const deck = getDeck(selectedDeckId);
  if (!deck) { page = 'sets'; return renderSets(); }
  const usage = getUsage(deck.id);
  return `<button class="back-link" data-action="go" data-page="sets">← Back to sets</button>
    <section class="deck-detail-hero"><div><span class="deck-kicker">${esc(deck.subject)} · ${deck.cards.length} cards</span><h1>${esc(deck.title)}</h1><p>Created by ${esc(deck.creator || displayName())}. Pick a way to study this set.</p></div><span class="deck-symbol">${esc(deck.icon || '✦')}</span></section>
    <div class="section-head"><div><h2>Study modes</h2><p>Question practice and tests have one free round per set. The other three modes have unlimited rounds.</p></div></div>
    <div class="mode-grid">${MODES.map((mode) => {
      const used = mode.id === 'practice' ? usage.practiceStarted : mode.id === 'test' ? usage.testStarted : false;
      const info = mode.id === 'practice' ? (used ? 'Continue your set' : 'One free round') : mode.id === 'test' ? (used ? 'Free test used' : 'One free test') : 'Unlimited rounds';
      return `<button class="mode-card" data-action="mode" data-mode="${mode.id}" style="--mode-color:${mode.color}"><span class="mode-icon">${mode.icon}</span><strong>${mode.name}</strong><span>${mode.copy}</span><span class="mode-status">${info} →</span></button>`;
    }).join('')}</div>
    <p class="mode-caption">A paid plan will allow unlimited question-practice and test rounds. Plans are shown in this demo, but checkout is not connected.</p>
    ${deck.creator === displayName() ? `<div class="section-head"><div><h2>Manage this set</h2><p>Update the cards in your own set.</p></div><button class="button small outline" data-action="edit-deck" data-id="${esc(deck.id)}">Edit set</button></div>` : ''}
    ${renderDeckBoard(deck)}`;
}
function renderDeckBoard(deck) {
  const classNames = state.classes.filter((klass) => klass.deckIds?.includes(deck.id)).map((klass) => klass.name);
  if (!classNames.length) return '';
  const results = state.results.filter((result) => result.deckId === deck.id);
  const tests = results.filter((result)=>result.kind==='test').sort((a,b)=>b.score-a.score||a.time-b.time).slice(0,5);
  const matches = results.filter((result)=>result.kind==='matching').sort((a,b)=>b.score-a.score||a.time-b.time).slice(0,5);
  const rows = (items,kind) => items.length ? items.map((result,index)=>`<div class="setting-line"><div><strong>${index+1}. ${esc(result.username)}</strong><span>${kind==='test'?'Test grade':'Matching time'}</span></div><b>${kind==='test'?`${result.score}%`:`${formatTime(result.time)}`}</b></div>`).join('') : '<span class="helper">No results yet.</span>';
  return `<div class="section-head"><div><h2>Class results for this set</h2><p>Used in ${classNames.map(esc).join(', ')}. Boards are separate for tests and matching.</p></div></div><div class="grid cols-2"><section class="card"><h3 style="font-size:14px">Test leaderboard</h3><div class="settings-list">${rows(tests,'test')}</div></section><section class="card"><h3 style="font-size:14px">Matching leaderboard</h3><div class="settings-list">${rows(matches,'matching')}</div></section></div>`;
}

function renderNewSet() {
  const editing = getDeck(editingDeckId);
  return `<button class="back-link" data-action="go" data-page="${editing ? 'deck' : 'sets'}">← Back ${editing ? 'to set' : 'to sets'}</button><section class="card form-card"><h2>${editing ? 'Edit your study set' : 'Create a study set'}</h2><p>${editing ? 'Update the title, subject, or cards in your set.' : 'Add question and answer cards. You can choose which question styles are used for each card.'}</p>
    <form data-form="create-deck"><div class="form-row"><div class="field"><label>Set title</label><input name="title" placeholder="For example: Cell biology" required maxlength="70" value="${esc(editing?.title || '')}"></div><div class="field"><label>Subject</label><input name="subject" placeholder="Science, history, language…" required maxlength="35" value="${esc(editing?.subject || '')}"></div></div><div class="field"><span class="helper">Your set is saved in this browser. It is not uploaded or shared online yet.</span></div>
    <div id="card-editors">${editing ? editing.cards.map((card,index)=>cardEditor(index+1,card)).join('') : cardEditor(1)}</div><button class="button small outline" type="button" data-action="add-card">＋ Add another card</button><div class="session-actions"><span class="helper">Choose one or more question styles for each card.</span><button class="button" type="submit">${editing ? 'Save changes' : 'Save set'}</button></div></form></section>`;
}
function cardEditor(index, values = {}) {
  const formats=values.formats || Object.keys(FORMAT_LABELS);
  return `<section class="card-editor" data-card-editor><input type="hidden" name="cardId" value="${esc(values.id || '')}"><div class="card-editor-head"><span>Card ${index}</span>${index > 1 ? `<button class="link-button" type="button" data-action="remove-card">Remove</button>` : ''}</div><div class="field"><label>Question or front of card</label><input name="prompt" required maxlength="220" placeholder="Write a question or key idea" value="${esc(values.prompt || '')}"></div><div class="form-row"><div class="field"><label>Correct answer</label><input name="answer" required maxlength="160" placeholder="The answer" value="${esc(values.answer || '')}"></div><div class="field"><label>Wrong answer for true/false and choices</label><input name="wrong" maxlength="160" placeholder="Another answer" value="${esc(values.wrong || '')}"></div></div><div class="field"><label>Other accepted answers (optional)</label><input name="alternatives" placeholder="Separate answers with commas" value="${esc((values.alternatives || []).join(', '))}"></div><div class="field"><span class="field-label">Question styles for this card</span><div class="check-row">${Object.entries(FORMAT_LABELS).map(([id,label])=>`<label class="check-label"><input type="checkbox" name="formats" value="${id}" ${formats.includes(id)?'checked':''}>${label}</label>`).join('')}</div></div></section>`;
}

function renderClasses() {
  const cards = state.classes.map((klass) => `<article class="class-card"><div class="class-card-top"><div><h3>${esc(klass.name)}</h3><p>${klass.teacher ? `Teacher: ${esc(klass.teacher)}` : 'Your class'} · ${klass.members.length} member${klass.members.length === 1 ? '' : 's'}</p></div><span class="pill">${klass.teacher === displayName() ? 'Teacher' : 'Joined'}</span></div><div class="class-code">${esc(klass.code)}</div><p>Class sets: ${klass.deckIds?.length ? klass.deckIds.map((id) => esc(getDeck(id)?.title || 'Study set')).join(', ') : 'No sets assigned yet.'}</p><div class="class-links"><button class="button small soft" data-action="copy-code" data-code="${esc(klass.code)}">Copy code</button>${klass.teacher === displayName() ? `<button class="button small outline" data-action="assign-set" data-id="${esc(klass.id)}">Choose class sets</button><button class="button small outline" data-action="teacher-progress" data-id="${esc(klass.id)}">View student progress</button>` : ''}</div></article>`).join('');
  return `${pageHeading('Classes','Join a teacher’s class with a code, or make a class and choose its name.', '')}
    <div class="grid cols-2"><section class="card"><h2 style="font-size:16px;margin-bottom:6px">Join a class</h2><p class="helper" style="margin-bottom:15px">Enter the class code your teacher gave you.</p><form data-form="join-class"><div class="field"><label>Class code</label><input name="code" required maxlength="8" placeholder="For example: MATH24"></div><button class="button" type="submit">Join class</button></form></section>
    <section class="card"><h2 style="font-size:16px;margin-bottom:6px">Create a teacher class</h2><p class="helper" style="margin-bottom:15px">Choose the class name. Memora makes a join code for you.</p><form data-form="create-class"><div class="field"><label>Class name</label><input name="name" required maxlength="55" placeholder="For example: Ms. Lee’s Science Class"></div><div class="field"><label>Starting study sets</label><select name="deckIds" multiple size="3" aria-label="Choose starting study sets">${state.decks.map((deck) => `<option value="${esc(deck.id)}">${esc(deck.title)}</option>`).join('')}</select><span class="helper">Hold Command (⌘) or Control while clicking to select more than one.</span></div><button class="button" type="submit">Create class and code</button></form></section></div>
    <div class="section-head"><div><h2>Your classes</h2><p>Codes and classes here are saved only in this browser.</p></div></div>${cards ? `<div class="grid cols-2">${cards}</div>` : empty('▣','No classes yet','Create a class or join one with your teacher’s code.')}`;
}

function renderTeacherProgress() {
  const klass = state.classes.find((item) => item.id === selectedClassId);
  if (!klass || klass.teacher !== displayName()) { page = 'classes'; return renderClasses(); }
  const assigned = (klass.deckIds || []).map(getDeck).filter(Boolean);
  const students = klass.members.filter((member) => member !== klass.teacher);
  const rows = students.length ? students.map((student) => {
    const completed = state.results.filter((result) => result.username === student && assigned.some((deck) => deck.id === result.deckId) && ['test','practice'].includes(result.kind));
    const best = completed.reduce((top, result) => Math.max(top, Number(result.score) || 0), 0);
    const percent = assigned.length ? Math.round(completed.length / assigned.length * 100) : 0;
    return `<div class="progress-row"><div><strong>${esc(student)}</strong><span>${completed.length} of ${assigned.length} set${assigned.length === 1 ? '' : 's'} completed</span></div><div class="progress-track"><span style="width:${percent}%"></span></div><b>${best}%</b></div>`;
  }).join('') : '<p class="helper">No students have joined this class yet.</p>';
  const average = students.length ? Math.round(students.reduce((sum, student) => { const completed = state.results.filter((result) => result.username === student && assigned.some((deck) => deck.id === result.deckId) && ['test','practice'].includes(result.kind)); return sum + (assigned.length ? completed.length / assigned.length * 100 : 0); }, 0) / students.length) : 0;
  return `${pageHeading(`${klass.name} progress`, 'See who completed assigned study sets and their best score percentage.', '<button class="button small outline" data-action="go" data-page="classes">← Back to classes</button>')}<div class="grid cols-3"><section class="card"><p class="eyebrow">Students</p><div class="result-score">${students.length}</div><p class="helper">Students in this class</p></section><section class="card"><p class="eyebrow">Average completion</p><div class="result-score">${average}%</div><p class="helper">Assigned sets completed</p></section><section class="card"><p class="eyebrow">Assigned sets</p><div class="result-score">${assigned.length}</div><p class="helper">Tests and question practice count</p></section></div><section class="card teacher-progress-card"><div class="section-head"><div><h2>Student chart</h2><p>Bars show completion. The percentage on the right is each student’s best score.</p></div></div><div class="progress-chart">${rows}</div></section>`;
}

function renderEvents() {
  if (liveEvent) return renderLiveEvent();
  const deckOptions = state.decks.map((deck) => `<option value="${esc(deck.id)}">${esc(deck.title)}</option>`).join('');
  return `${pageHeading('Live events','','')}
    <div class="grid cols-2"><section class="card"><h2 style="font-size:16px;margin-bottom:6px">Host an event</h2><p class="helper" style="margin-bottom:16px">Choose a set and how people will play. You get a code to share.</p><form data-form="create-event"><div class="field"><label>Question set</label><select name="deckId" required>${deckOptions}</select></div><div class="field"><span class="field-label">Game type</span><div class="team-options"><label class="team-option"><input type="radio" name="gameType" value="solo" checked><span><strong>Solo</strong><span>Each player gets their own 12-answer streak.</span></span></label><label class="team-option"><input type="radio" name="gameType" value="teams"><span><strong>Teams</strong><span>Up to four players on a team. A wrong answer resets that team’s streak.</span></span></label></div></div><div class="field hidden" id="team-settings"><label>Team setup</label><select name="teamSetup"><option value="random">Random teams</option><option value="choose">Players choose teams</option></select><label style="margin-top:6px">Players per team (up to four)</label><select name="teamSize"><option>2</option><option>3</option><option selected>4</option></select></div><button class="button" type="submit">Create event code <span>→</span></button></form></section>
    <section class="card"><h2 style="font-size:16px;margin-bottom:6px">Join an event</h2><p class="helper" style="margin-bottom:16px">Enter the code from the host.</p><form data-form="join-event"><div class="field"><label>Event code</label><input name="code" maxlength="8" required placeholder="Enter event code"></div><button class="button soft" type="submit">Join event</button></form><div class="helper" style="margin-top:13px">In this local demo, the event must have been created in this same browser.</div></section></div>
    <div class="section-head"><div><h2>How the streak works</h2><p>Questions come from the chosen study set.</p></div></div><div class="grid cols-3"><div class="card quick-card"><div class="quick-icon" style="background:#f1edff">1</div><div><h3>Answer a question</h3><p>Event questions are multiple choice.</p></div></div><div class="card quick-card"><div class="quick-icon" style="background:#eaf8f1">12</div><div><h3>Keep the streak</h3><p>One wrong answer resets the streak.</p></div></div><div class="card quick-card"><div class="quick-icon" style="background:#fff1e6">★</div><div><h3>Claim the win</h3><p>Reach 12 correct answers in a row.</p></div></div></div>`;
}
function renderLiveEvent() {
  const event = liveEvent;
  const deck = getDeck(event.deckId);
  if (event.phase === 'lobby') return `<button class="back-link" data-action="leave-event">← Live events</button><section class="result-card"><p class="eyebrow">Event lobby · ${event.gameType === 'teams' ? 'Team game' : 'Solo game'}</p><h2>${esc(deck?.title || 'Study set')}</h2><p>Share this code with players who are in this local demo.</p><div class="event-code">${esc(event.code)}</div><p>${event.gameType === 'teams' ? `${event.teamSize} players per team · ${event.teamSetup === 'random' ? 'random teams' : 'players choose teams'}` : 'Each player has their own streak.'}</p><div class="result-actions"><button class="button" data-action="start-event">Start event</button><button class="button soft" data-action="join-host-event">Join as a player</button><button class="button outline" data-action="leave-event">Cancel</button></div></section>`;
  if (event.phase === 'finished') return `<button class="back-link" data-action="leave-event">← Live events</button><section class="result-card"><div style="font-size:32px">🏆</div><p class="eyebrow">Event finished</p><h2>${esc(event.winner || displayName())} won!</h2><p>Reached 12 correct answers in a row.</p><div class="event-streak"><strong>12 / 12</strong><span>winning streak</span></div><div class="result-actions"><button class="button" data-action="leave-event">Back to live events</button></div></section>`;
  const card = deck?.cards[event.questionIndex % (deck?.cards.length || 1)];
  const options = card ? card.options || deck.cards.map((item) => item.answer).slice(0,4) : [];
  return `<button class="back-link" data-action="leave-event">← Leave event</button><div class="session-wrap"><div class="session-top"><div class="session-progress"><span style="width:${Math.min(100,event.streak / 12 * 100)}%"></span></div><span class="session-counter">${event.streak} / 12 streak</span></div><section class="question-card"><p class="eyebrow">${event.gameType === 'teams' ? 'Team round' : 'Live event'} · Question ${event.questionIndex + 1}</p><h2>${esc(card?.prompt || '')}</h2>${event.feedback ? `<p class="session-feedback ${event.feedback === 'Correct!' ? 'good' : 'bad'}">${event.feedback} ${event.feedback === 'Correct!' ? `Streak: ${event.streak}` : 'Your streak is back to zero.'}</p>` : ''}<form data-form="event-answer" class="answer-list">${shuffle(options).map((option) => `<label class="answer-choice"><input type="radio" name="answer" value="${esc(option)}" required> ${esc(option)}</label>`).join('')}<div class="session-actions"><span class="helper">A wrong answer resets the streak.</span><button class="button" type="submit">Lock in answer</button></div></form></section></div>`;
}

function renderPlans() {
  const plans = [
    { id: 'free', name: 'Free', price: '$0', period: 'forever', copy: 'A good way to try Memora.', features: ['One practice test per set', 'One question-practice round per set', 'Unlimited flashcards, Block Blast, and matching'] },
    { id: 'monthly', name: 'Monthly', price: '$2', period: 'per month', copy: 'More practice whenever you need it.', features: ['Unlimited tests and question practice', 'Unlimited flashcards, Block Blast, and matching', 'Use all available question styles'] },
    { id: 'yearly', name: 'Yearly', price: '$18', period: 'per year', copy: 'The same membership for a year.', features: ['Everything in Monthly', 'Unlimited tests and question practice', 'One yearly price'] }
  ];
  return `${pageHeading('Membership plans', 'Choose the plan you want to use for your account.', '')}
    <div class="plan-demo-note"><strong>Local demo:</strong> selecting a plan updates this browser’s demo access. This page does not collect payment details or start real billing.</div>
    <div class="grid cols-3 plan-page-grid">${plans.map((plan) => `<section class="card plan-page-card ${plan.id === 'monthly' ? 'featured' : ''}">
      <div class="plan-card-top"><div><p class="eyebrow">${plan.id === 'monthly' ? 'Most flexible' : plan.id === 'yearly' ? 'Best for a year' : 'Start here'}</p><h2>${plan.name}</h2></div>${state.plan === plan.id ? '<span class="pill green">Current</span>' : ''}</div>
      <div class="plan-price"><strong>${plan.price}</strong><span>${plan.period}</span></div><p class="plan-copy">${plan.copy}</p>
      <ul class="plan-features">${plan.features.map((feature) => `<li><span aria-hidden="true">✓</span>${feature}</li>`).join('')}</ul>
      <button class="button ${state.plan === plan.id ? 'soft' : ''}" data-action="choose-plan" data-plan="${plan.id}">${state.plan === plan.id ? `Keep ${plan.name}` : `Choose ${plan.name}`}</button>
    </section>`).join('')}</div>
    <p class="helper plan-teacher-note">For a future teacher membership, the teacher’s plan can cover their own sets used by students in that teacher’s class. A student’s plan can cover sets made by other people.</p>`;
}

function renderProfile() {
  const myPlan = state.plan === 'free' ? 'Free' : state.plan;
  return `${pageHeading('Profile and plans','Your local profile and the study plans you described.','')}
    <div class="grid cols-2"><section class="card"><div style="display:flex;align-items:center;gap:13px;margin-bottom:18px"><span class="avatar" style="width:52px;height:52px;border-radius:17px;font-size:18px">${esc(nameInitial())}</span><div><h2 style="font-size:16px;margin:0 0 4px">${esc(displayName())}</h2><p class="helper" style="margin:0">${esc(state.profile.role)} profile · ${esc(state.profile.firstName)}</p></div></div><div class="settings-list"><div class="setting-line"><div><strong>First name</strong><span>Used for the profile symbol</span></div><b>${esc(state.profile.firstName)}</b></div><div class="setting-line"><div><strong>Birthday</strong><span>Optional</span></div><b>${state.profile.birthday ? esc(state.profile.birthday) : 'Not added'}</b></div><div class="setting-line"><div><strong>Current plan</strong><span>Payments are not connected in this local demo</span></div><b>${myPlan}</b></div></div></section>
    <section class="card"><h2 style="font-size:16px;margin-bottom:5px">Plans</h2><p class="helper" style="margin-bottom:15px">The amounts below are a preview only. No payment will be taken.</p><div class="settings-list"><div class="setting-line"><div><strong>Free</strong><span>One test and one question-practice session per set. Unlimited flashcards, Block Blast, and matching.</span></div><b>$0</b></div><div class="setting-line"><div><strong>Monthly membership</strong><span>Unlimited question-practice and tests.</span></div><b>$2/mo</b></div><div class="setting-line"><div><strong>Yearly membership</strong><span>Same membership, paid yearly.</span></div><b>$18/yr</b></div></div><p class="helper" style="margin:12px 0 0">Teacher membership will apply to that teacher’s own sets in their class. A student’s plan applies to sets made by other people.</p><button class="button small soft" style="margin-top:14px" data-action="go" data-page="plans">View and choose a plan</button></section></div>
    <div class="section-head"><div><h2>Local data</h2><p>Your profile and study sets are saved in this browser on this device.</p></div></div><div class="card"><div class="setting-line"><div><strong>Switch profile</strong><span>Return to the local profile setup screen.</span></div><button class="button small outline" data-action="switch-profile">Switch</button></div><div class="setting-line"><div><strong>Reset the demo</strong><span>Remove this browser’s Memora demo profile and sets.</span></div><button class="button small danger" data-action="reset-demo">Reset demo</button></div></div>`;
}

function practiceTaskTotal(deck, types) { return deck.cards.reduce((total,card)=>total+types.filter((type)=>(card.formats||Object.keys(FORMAT_LABELS)).includes(type)).length,0); }
function currentPracticeTask() {
  const deck = getDeck(session.deckId); const usage = getUsage(deck.id);
  const done = new Set(usage.practiceDone || []);
  for (const card of deck.cards) for (const type of session.types) if ((card.formats||Object.keys(FORMAT_LABELS)).includes(type) && !done.has(`${card.id}:${type}`)) return { card, type, key: `${card.id}:${type}` };
  return null;
}
function randomOtherAnswer(deck, card) { return deck.cards.find((item) => item.id !== card.id && item.answer !== card.answer)?.answer || card.wrong || 'None of these'; }
function getChoiceList(deck, card) {
  const pool = card.options?.length ? [...card.options] : [card.answer, card.wrong || randomOtherAnswer(deck, card), randomOtherAnswer(deck, card), 'Not sure'];
  const unique = [...new Set(pool)];
  while (unique.length < Math.min(4, deck.cards.length + 1)) unique.push(randomOtherAnswer(deck, card));
  return shuffle(unique.slice(0, Math.max(2, Math.min(4, unique.length))));
}
function practiceQuestion(task) {
  const { card, type } = task; const deck = getDeck(session.deckId);
  if (type === 'true-false') {
    const truth = session.truth ??= Math.random() > .5;
    return { prompt: `${card.prompt} ${truth ? card.answer : (card.wrong || randomOtherAnswer(deck, card))}`, truth };
  }
  return { prompt: card.prompt };
}
function renderPracticePage() {
  const deck = getDeck(selectedDeckId); if (!deck) { page = 'sets'; return renderSets(); }
  if (!session || session.kind !== 'practice') return renderPracticeSetup(deck);
  const task = currentPracticeTask();
  if (!task) { const usage=getUsage(deck.id); if (!usage.practiceComplete) { usage.practiceComplete = true; state.results.push({deckId:deck.id,kind:'practice',username:displayName(),score:100,time:0}); } if (state.plan === 'free') { state.planPrompt = 'limit'; planPrompt = 'limit'; } save(); return renderStudyResult('Question practice complete', `You answered all ${deck.cards.length} cards in each chosen style.`, 'Question practice'); }
  if (session.awaitingNext) return `<button class="back-link" data-action="stop-session">← ${esc(deck.title)}</button><section class="result-card"><div style="font-size:31px">✨</div><h2>Correct!</h2><p>That answer is done for this question style. Keep going until every selected style is complete.</p><div class="result-actions"><button class="button" data-action="continue-practice">Next question</button></div></section>`;
  const question = practiceQuestion(task); const index = (getUsage(deck.id).practiceDone || []).length; const total=practiceTaskTotal(deck,session.types);
  return `<button class="back-link" data-action="stop-session">← ${esc(deck.title)}</button><div class="session-wrap"><div class="session-top"><div class="session-progress"><span style="width:${Math.min(100,index / total * 100)}%"></span></div><span class="session-counter">${index + 1} of ${total}</span></div><section class="question-card"><p class="eyebrow">${esc(FORMAT_LABELS[task.type])}</p><h2>${esc(question.prompt)}</h2>
    <form data-form="practice-answer" class="answer-list" data-task="${esc(task.key)}">${answerInputs(deck, task.card, task.type)}<p class="session-feedback ${session.feedback ? (session.feedback === 'That’s right!' ? 'good' : 'bad') : ''}">${esc(session.feedback || '')}</p><div class="session-actions"><span class="helper">${task.type === 'spelling' ? (session.spelling === 'relaxed' ? 'Relaxed spelling is on.' : 'Spell it exactly.') : 'If you miss it, you can try again.'}</span><button class="button" type="submit">Check answer</button></div></form></section></div>`;
}
function renderPracticeSetup(deck) {
  const usage = getUsage(deck.id);
  if (state.plan === 'free' && usage.practiceComplete) return renderStudyResult('Question practice complete', 'You have used the free question-practice round for this set.', 'Question practice');
  if (usage.practiceStarted) return `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button><section class="result-card"><div style="font-size:30px">↗</div><h2>Continue your question practice</h2><p>Your progress is saved for this set. Keep going until each selected question style is answered correctly.</p><div class="result-actions"><button class="button" data-action="resume-practice" data-id="${esc(deck.id)}">Resume round</button></div></section>`;
  const available=Object.entries(FORMAT_LABELS).filter(([id])=>deck.cards.some((card)=>(card.formats||Object.keys(FORMAT_LABELS)).includes(id)));
  return `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button><section class="card form-card"><h2>Set up question practice</h2><p>Choose one or more styles. If you choose more than one, you will get each card once in every selected style.</p><form data-form="practice-setup" data-id="${esc(deck.id)}"><div class="field"><span class="field-label">Question styles</span><div class="check-row">${available.map(([id,label],index) => `<label class="check-label"><input type="checkbox" name="formats" value="${id}" ${index === 0 ? 'checked' : ''}>${label}</label>`).join('')}</div></div><div class="field"><label>Spelling check</label><select name="spelling"><option value="strict">Exact spelling</option><option value="relaxed">Relaxed spelling (allows a tiny typo)</option></select></div><p class="helper">A free account gets one question-practice session per set. Correct answers leave the round; missed answers stay until you get them right.</p><div class="session-actions"><span>${usagePill(false)}</span><button class="button" type="submit">Start practice</button></div></form></section>`;
}
function answerInputs(deck, card, type) {
  if (type === 'multiple-choice') return `<div class="answer-list">${getChoiceList(deck,card).map((choice) => `<label class="answer-choice"><input type="radio" name="answer" value="${esc(choice)}" required> ${esc(choice)}</label>`).join('')}</div>`;
  if (type === 'true-false') return `<div class="answer-list"><label class="answer-choice"><input type="radio" name="answer" value="true" required> True</label><label class="answer-choice"><input type="radio" name="answer" value="false" required> False</label></div>`;
  return `<div class="field"><label>Your answer</label><input name="answer" autocomplete="off" required maxlength="180" placeholder="Type your answer"></div>`;
}
function normalize(value) { return String(value).trim().toLocaleLowerCase().replace(/[.,!?;:'"“”‘’]/g,'').replace(/\s+/g,' '); }
function closeEnough(a,b) {
  a = normalize(a).replace(/\s/g,''); b = normalize(b).replace(/\s/g,'');
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let edits = 0, i = 0, j = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    edits++; if (edits > 1) return false;
    if (a.length > b.length) i++; else if (b.length > a.length) j++; else { i++; j++; }
  }
  return edits + (i < a.length || j < b.length ? 1 : 0) <= 1;
}
function isAnswerCorrect(answer, card, type, truth, spelling = 'strict') {
  if (type === 'true-false') return String(answer) === String(truth);
  if (type === 'multiple-choice') return normalize(answer) === normalize(card.answer);
  const possible = [card.answer, ...(card.alternatives || [])];
  return possible.some((accepted) => (type === 'spelling' && spelling === 'relaxed' ? closeEnough(answer, accepted) : normalize(answer) === normalize(accepted)));
}

function renderFlashcards() {
  const deck = getDeck(selectedDeckId); if (!deck) { page='sets'; return renderSets(); }
  if (!session || session.kind !== 'flashcards') return `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button><section class="card form-card"><h2>Flashcards</h2><p>Choose which side you want to see first. Flip each card, then sort it into a group.</p><form data-form="flashcard-setup" data-id="${esc(deck.id)}"><div class="field"><label>Show first</label><select name="front"><option value="prompt">Question / front</option><option value="answer">Answer / back</option></select></div><div class="session-actions"><span class="pill green">Unlimited rounds</span><button class="button" type="submit">Start flashcards</button></div></form></section>`;
  if (session.finished) return `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button>${renderStudyResult('Flashcard round complete', `${session.known.length} in Right · ${session.wrong.length} in Wrong`, 'Flashcards', `<button class="button soft" data-action="review-wrong">Review wrong cards</button>`)}`;
  const card = session.cards[session.index]; const isBack = session.flipped;
  const frontText = session.front === 'prompt' ? card.prompt : card.answer;
  const backText = session.front === 'prompt' ? card.answer : card.prompt;
  const faceLabel = isBack ? (session.front === 'prompt' ? 'Answer' : 'Question') : (session.front === 'prompt' ? 'Question' : 'Answer');
  return `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button><div class="session-wrap"><div class="session-top"><div class="session-progress"><span style="width:${(session.index / session.cards.length) * 100}%"></span></div><span class="session-counter">Card ${session.index + 1} of ${session.cards.length}</span></div><div class="flashcard" data-action="flip-card" role="button" tabindex="0"><div><div class="face-label">${faceLabel}</div><p class="face-text">${esc(isBack ? backText : frontText)}</p></div></div><p class="flashcard-hint">Flip to check your answer, or sort the card whenever you’re ready.</p><div class="flashcard-controls"><button class="button wrong" data-action="sort-card" data-result="wrong">✕ Wrong</button><button class="button right" data-action="sort-card" data-result="right">✓ Right</button></div></div>`;
}
function renderStudyResult(title, copy, mode, extra = '') {
  return `<section class="result-card"><div style="font-size:32px">✦</div><p class="eyebrow">${esc(mode)} finished</p><h2>${esc(title)}</h2><p>${esc(copy)}</p><div class="result-actions">${extra}<button class="button" data-action="go" data-page="deck">Back to set</button></div></section>`;
}

function renderTestPage() {
  const deck = getDeck(selectedDeckId); if (!deck) { page='sets'; return renderSets(); }
  const usage = getUsage(deck.id);
  if (!session || session.kind !== 'test') {
    if (state.plan === 'free' && usage.testStarted) return usage.testResult ? renderTestResult(deck, usage.testResult) : `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button><section class="result-card"><h2>This set’s free test is used</h2><p>You get one free test per set. A paid plan would allow more tries.</p><div class="result-actions"><button class="button" data-action="go" data-page="deck">Back to set</button></div></section>`;
    const available=Object.entries(FORMAT_LABELS).filter(([id])=>deck.cards.some((card)=>(card.formats||Object.keys(FORMAT_LABELS)).includes(id)));
    return `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button><section class="card form-card"><h2>Build a test</h2><p>Choose the question styles and how many cards to include.</p><form data-form="test-setup" data-id="${esc(deck.id)}"><div class="field"><span class="field-label">Question styles</span><div class="check-row">${available.map(([id,label],index) => `<label class="check-label"><input type="checkbox" name="formats" value="${id}" ${index===0?'checked':''}>${label}</label>`).join('')}</div></div><div class="field"><label>Number of questions</label><select name="count">${Array.from({length:deck.cards.length},(_,i)=>`<option value="${i+1}" ${i===Math.min(4,deck.cards.length)-1?'selected':''}>${i+1}</option>`).join('')}</select><span class="helper">This first version uses one selected style for each question.</span></div><div class="session-actions"><span>${usagePill(false)}</span><button class="button" type="submit">Start test</button></div></form></section>`;
  }
  if (session.result) return renderTestResult(deck, session.result);
  const question = session.tasks[session.index];
  if (!question) { finishTest(); return renderTestPage(); }
  if (session.awaitingNext) return `<button class="back-link" data-action="stop-session">← ${esc(deck.title)}</button><section class="result-card"><h2>Answer saved</h2><p>Keep going. You’ll see your score when you submit the test.</p><div class="result-actions"><button class="button" data-action="continue-test">Next question</button></div></section>`;
  return `<button class="back-link" data-action="stop-session">← ${esc(deck.title)}</button><div class="session-wrap"><div class="session-top"><div class="session-progress"><span style="width:${session.index / session.tasks.length * 100}%"></span></div><span class="session-counter">Question ${session.index + 1} of ${session.tasks.length}</span></div><section class="question-card"><p class="eyebrow">${esc(FORMAT_LABELS[question.type])} · Test</p><h2>${esc(question.prompt)}</h2><form data-form="test-answer" class="answer-list">${answerInputs(deck,question.card,question.type)}<div class="session-actions"><span class="helper">Your result appears after the last question.</span><button class="button" type="submit">${session.index === session.tasks.length - 1 ? 'Submit test' : 'Save answer'}</button></div></form></section></div>`;
}
function finishTest() {
  const deck = getDeck(session.deckId); const correct = session.answers.filter((answer) => answer.correct).length;
  const result = { score: Math.round(correct / session.tasks.length * 100), correct, total: session.tasks.length, time: (Date.now() - session.startedAt) / 1000 };
  session.result = result; const usage = getUsage(deck.id); usage.testStarted = true; usage.testComplete = true; usage.testResult = result;
  state.results.push({ deckId: deck.id, kind: 'test', username: displayName(), score: result.score, time: result.time });
  if (state.plan === 'free') { state.planPrompt = 'limit'; planPrompt = 'limit'; }
  save();
}
function renderTestResult(deck, result) {
  return `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button><section class="result-card"><p class="eyebrow">Test result</p><div class="result-score">${result.score}%</div><h2>${result.correct} out of ${result.total} correct</h2><p>Finished in ${formatTime(result.time)}. The class test board ranks higher scores first, then faster times.</p><div class="result-actions"><button class="button" data-action="go" data-page="deck">Back to set</button></div></section>`;
}

function renderMatching() {
  const deck = getDeck(selectedDeckId); if (!deck) { page='sets'; return renderSets(); }
  if (!session || session.kind !== 'matching') return `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button><section class="card form-card"><h2>Matching</h2><p>Match each question with its answer. Your class can compare correct matches and finish times.</p><div class="session-actions"><span class="pill green">Unlimited rounds</span><button class="button" data-action="start-matching" data-id="${esc(deck.id)}">Start matching</button></div></section>`;
  if (session.finished) return `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button><section class="result-card"><p class="eyebrow">Matching result</p><div class="result-score">${formatTime(session.time)}</div><h2>All ${session.cards.length} pairs matched</h2><p>${session.mistakes} wrong ${session.mistakes === 1 ? 'try' : 'tries'}. Your time is saved for this local class board.</p><div class="result-actions"><button class="button" data-action="go" data-page="deck">Back to set</button><button class="button soft" data-action="start-matching" data-id="${esc(deck.id)}">Play again</button></div></section>`;
  const left = session.leftOrder;
  const right = session.rightOrder;
  return `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button><div class="session-wrap"><div class="session-top"><div><strong>Find every pair</strong></div><span class="timer" data-match-timer>00:00</span></div><div class="match-board">${left.map((item) => `<button class="match-tile ${session.matched.includes(item.id)?'matched':''} ${session.selected?.side==='left'&&session.selected.id===item.id?'picked':''}" data-action="match-tile" data-side="left" data-id="${esc(item.id)}" ${session.matched.includes(item.id)?'disabled':''}>${esc(item.text)}</button>`).join('')}${right.map((item) => `<button class="match-tile ${session.matched.includes(item.id)?'matched':''} ${session.selected?.side==='right'&&session.selected.id===item.id?'picked':''}" data-action="match-tile" data-side="right" data-id="${esc(item.id)}" ${session.matched.includes(item.id)?'disabled':''}>${esc(item.text)}</button>`).join('')}</div><p class="helper" style="margin-top:12px">Matched ${session.matched.length} of ${session.cards.length} · Mistakes ${session.mistakes}</p></div>`;
}

function renderBlockBlast() {
  const deck = getDeck(selectedDeckId); if (!deck) { page='sets'; return renderSets(); }
  if (!session || session.kind !== 'blockblast') return `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button><section class="card form-card"><h2>Block Blast</h2><p>Answer a multiple-choice question to earn three shapes. Choose a shape, then click a spot on the board to place it.</p><div class="session-actions"><span class="pill green">Unlimited rounds</span><button class="button" data-action="start-blockblast" data-id="${esc(deck.id)}">Start round</button></div></section>`;
  if (session.finished) return `<button class="back-link" data-action="go" data-page="deck">← ${esc(deck.title)}</button><section class="result-card"><p class="eyebrow">Block Blast</p><div class="result-score">${session.score}</div><h2>Points</h2><p>Keep the board clear by completing full rows and columns.</p><div class="result-actions"><button class="button" data-action="start-blockblast" data-id="${esc(deck.id)}">Play again</button><button class="button outline" data-action="go" data-page="deck">Back to set</button></div></section>`;
  if (session.phase === 'question') return renderBlockQuestion(deck);
  return renderBlockBoard(deck);
}
function renderBlockQuestion(deck) {
  const card = session.card; return `<button class="back-link" data-action="stop-session">← ${esc(deck.title)}</button><div class="session-wrap"><section class="question-card"><p class="eyebrow">Multiple choice · Earn 3 shapes</p><h2>${esc(card.prompt)}</h2><form data-form="block-answer" class="answer-list">${getChoiceList(deck,card).map((choice) => `<label class="answer-choice"><input type="radio" name="answer" value="${esc(choice)}" required> ${esc(choice)}</label>`).join('')}<p class="session-feedback ${session.feedback ? (session.feedback === 'That’s right!' ? 'good' : 'bad') : ''}">${esc(session.feedback || '')}</p><div class="session-actions"><span class="helper">Score ${session.score}</span><button class="button" type="submit">Answer</button></div></form></section></div>`;
}
function renderBlockBoard(deck) {
  const shapeMarkup = (shape) => { const rows = Math.max(...shape.map((pos)=>pos[0])) + 1; const cols = Math.max(...shape.map((pos)=>pos[1])) + 1; return `<span class="shape-cells" style="grid-template-columns:repeat(${cols},13px)">${Array.from({length:rows*cols},(_,i)=>{const r=Math.floor(i/cols),c=i%cols;return `<i class="shape-cell" style="visibility:${shape.some((pos)=>pos[0]===r&&pos[1]===c)?'visible':'hidden'}"></i>`}).join('')}</span>`; };
  return `<button class="back-link" data-action="stop-session">← ${esc(deck.title)}</button><div class="session-wrap"><div class="session-top"><strong>Place all three shapes</strong><span class="timer">Score ${session.score}</span></div><div class="block-game"><div class="block-grid">${session.board.map((row,r)=>row.map((cell,c)=>`<button class="block-cell ${cell?'filled':''}" aria-label="Row ${r+1}, column ${c+1}" data-action="place-shape" data-row="${r}" data-col="${c}"></button>`).join('')).join('')}</div><div><p class="helper">Choose a shape, then click where its top-left corner should go. Full rows or columns clear.</p><div class="shape-list">${session.shapes.map((shape,index)=>`<button class="shape-button ${session.selectedShape===index?'selected':''}" data-action="select-shape" data-index="${index}">Shape ${index+1}${shapeMarkup(shape)}</button>`).join('')}</div><p class="session-feedback ${session.feedback?'bad':''}">${esc(session.feedback||'')}</p><button class="button small outline" data-action="skip-block">Leave game</button></div></div></div>`;
}
function canPlace(board, shape, row, col) { return shape.every(([dr,dc]) => row+dr < board.length && col+dc < board[0].length && !board[row+dr][col+dc]); }
function placeShape(board, shape, row, col) { shape.forEach(([dr,dc]) => { board[row+dr][col+dc] = 1; }); }
function clearBlockLines(board) {
  const rows = board.map((line,index) => line.every(Boolean) ? index : -1).filter((v)=>v>=0);
  const cols = board[0].map((_,index) => board.every((line)=>line[index]) ? index : -1).filter((v)=>v>=0);
  rows.forEach((r)=>board[r].fill(0)); cols.forEach((c)=>board.forEach((line)=>line[c]=0));
  return (rows.length + cols.length) * 10;
}

function onClick(event) {
  const target = event.target.closest('[data-action]'); if (!target) return;
  const action = target.dataset.action; const id = target.dataset.id;
  if (action === 'choose-plan') { state.plan = target.dataset.plan; state.planPrompt = null; planPrompt = null; save(); renderApp(); toast(`${state.plan === 'free' ? 'Free' : state.plan === 'monthly' ? 'Monthly' : 'Yearly'} plan selected.`); }
  else if (action === 'go') { page = target.dataset.page; session = null; selectedDeckId = page === 'deck' ? selectedDeckId : null; if (page==='new-set') editingDeckId=null; renderApp(); window.scrollTo(0,0); }
  else if (action === 'open-deck') { selectedDeckId = id; page='deck'; session=null; renderApp(); window.scrollTo(0,0); }
  else if (action === 'teacher-progress') { selectedClassId=id; page='teacher-progress'; session=null; renderApp(); window.scrollTo(0,0); }
  else if (action === 'edit-deck') { editingDeckId=id; selectedDeckId=id; page='new-set'; session=null; renderApp(); window.scrollTo(0,0); }
  else if (action === 'mode') { if (!selectedDeckId) return; const mode=target.dataset.mode; const usage=getUsage(selectedDeckId); const used=(mode==='practice'&&usage.practiceStarted)||(mode==='test'&&usage.testStarted); if (state.plan==='free' && used && (mode==='practice'||mode==='test')) { state.planPrompt='limit'; planPrompt='limit'; save(); renderApp(); return; } page = mode; session=null; renderApp(); window.scrollTo(0,0); }
  else if (action === 'add-card') { const holder = document.querySelector('#card-editors'); holder.insertAdjacentHTML('beforeend', cardEditor(holder.querySelectorAll('[data-card-editor]').length+1)); }
  else if (action === 'remove-card') { target.closest('[data-card-editor]').remove(); document.querySelectorAll('[data-card-editor] .card-editor-head span').forEach((el,index)=>el.textContent=`Card ${index+1}`); }
  else if (action === 'resume-practice') { selectedDeckId=id; page='practice'; const usage=getUsage(id); session={kind:'practice',deckId:id,types:usage.practiceTypes,spelling:usage.practiceSpelling||'strict'}; renderApp(); }
  else if (action === 'continue-practice') { session.awaitingNext=false; session.feedback=''; session.truth=null; renderApp(); }
  else if (action === 'stop-session') { session=null; page='deck'; renderApp(); }
  else if (action === 'flip-card') { if (session?.kind==='flashcards') { session.flipped=!session.flipped; renderApp(); } }
  else if (action === 'sort-card') sortFlashcard(target.dataset.result)
  else if (action === 'review-wrong') { if (session?.wrong?.length) { session={kind:'flashcards',deckId:selectedDeckId,cards:[...session.wrong],index:0,flipped:false,front:session.front,known:[],wrong:[]}; renderApp(); } }
  else if (action === 'start-matching') startMatching(id)
  else if (action === 'match-tile') matchTile(target.dataset.side,target.dataset.id)
  else if (action === 'start-blockblast') startBlock(id)
  else if (action === 'select-shape') { session.selectedShape=Number(target.dataset.index); renderApp(); }
  else if (action === 'place-shape') placeBlock(Number(target.dataset.row),Number(target.dataset.col))
  else if (action === 'skip-block') { session=null; page='deck'; renderApp(); }
  else if (action === 'copy-code') { if (navigator.clipboard?.writeText) navigator.clipboard.writeText(target.dataset.code).then(()=>toast('Class code copied.')).catch(()=>toast(`Class code: ${target.dataset.code}`)); else toast(`Class code: ${target.dataset.code}`); }
  else if (action === 'assign-set') assignSet(id)
  else if (action === 'start-event') { liveEvent.phase='playing'; renderApp(); }
  else if (action === 'join-host-event') { liveEvent.isHost=false; liveEvent.phase='playing'; renderApp(); }
  else if (action === 'leave-event') { liveEvent=null; page='events'; renderApp(); }
  else if (action === 'continue-test') { session.awaitingNext=false; renderApp(); }
  else if (action === 'switch-profile') { state.profile=null; save(); renderApp(); }
  else if (action === 'reset-demo') { if (confirm('Reset the local Memora demo on this browser? This removes the profile, sets, classes, and results saved here.')) { localStorage.removeItem(APP_KEY); state=initialState(); page='home'; session=null; selectedDeckId=null; renderApp(); } }
}

function sortFlashcard(result) {
  const card=session.cards[session.index]; (result==='right'?session.known:session.wrong).push(card);
  session.index++; session.flipped=false;
  if (session.index>=session.cards.length) session.finished=true;
  renderApp();
}
function startMatching(id) {
  const deck=getDeck(id); selectedDeckId=id; session={kind:'matching',deckId:id,cards:[...deck.cards],leftOrder:shuffle(deck.cards.map((card)=>({id:card.id,text:card.prompt}))),rightOrder:shuffle(deck.cards.map((card)=>({id:card.id,text:card.answer}))),matched:[],selected:null,mistakes:0,startedAt:Date.now()}; page='matching'; renderApp();
}
function matchTile(side,id) {
  if (session?.kind!=='matching' || session.matched.includes(id)) return;
  if (!session.selected || session.selected.side===side) session.selected={side,id};
  else {
    const leftId=side==='left'?session.selected.id:id; const rightId=side==='right'?session.selected.id:id;
    if (leftId===rightId) {
      session.matched.push(id); session.selected=null;
      if (session.matched.length===session.cards.length) {
        session.finished=true; session.time=(Date.now()-session.startedAt)/1000;
        state.results.push({deckId:session.deckId,kind:'matching',username:displayName(),score:session.cards.length,time:session.time}); save();
      }
    } else { session.mistakes++; session.selected={side,id}; }
  }
  renderApp();
}
function startBlock(id) {
  const deck=getDeck(id); selectedDeckId=id; session={kind:'blockblast',deckId:id,phase:'question',board:Array.from({length:8},()=>Array(8).fill(0)),score:0,shapes:[],selectedShape:null}; nextBlockQuestion(); page='blockblast'; renderApp();
}
function nextBlockQuestion() { const deck=getDeck(session.deckId); session.card=deck.cards[Math.floor(Math.random()*deck.cards.length)]; session.phase='question'; session.feedback=''; }
function placeBlock(row,col) {
  if (session?.kind!=='blockblast' || session.phase!=='place') return;
  const shape=session.shapes[session.selectedShape];
  if (!shape) { session.feedback='Choose a shape first.'; renderApp(); return; }
  if (!canPlace(session.board,shape,row,col)) { session.feedback='That shape does not fit there. Try another spot.'; renderApp(); return; }
  placeShape(session.board,shape,row,col); session.score += shape.length; session.score += clearBlockLines(session.board); session.shapes.splice(session.selectedShape,1); session.selectedShape=null; session.feedback='';
  const remainingCanFit=session.shapes.some((candidate)=>session.board.some((line,r)=>line.some((_,c)=>canPlace(session.board,candidate,r,c))));
  if (session.shapes.length && !remainingCanFit) session.finished=true;
  else if (!session.shapes.length) {
    const fits=session.board.some((line,r)=>line.some((_,c)=>SHAPES.some((candidate)=>canPlace(session.board,candidate,r,c))));
    if (!fits) session.finished=true; else nextBlockQuestion();
  }
  renderApp();
}

function onSubmit(event) {
  const form=event.target.closest('form[data-form]'); if (!form) return;
  event.preventDefault(); const data=new FormData(form); const kind=form.dataset.form;
  if (kind==='profile') {
    const firstName=String(data.get('firstName')).trim(); const username=String(data.get('username')).trim();
    if (!firstName || username.length<2) return;
    state.profile={firstName,username,birthday:String(data.get('birthday')||''),role:String(data.get('role')||'student')}; state.planPrompt='welcome'; planPrompt='welcome'; save(); renderApp(); toast(`Welcome to Memora, ${firstName}!`);
  } else if (kind==='create-deck') {
    const editors=[...form.querySelectorAll('[data-card-editor]')];
    const cards=editors.map((editor,index)=>({id:editor.querySelector('[name="cardId"]').value||`c-${Date.now()}-${index}`,prompt:editor.querySelector('[name="prompt"]').value.trim(),answer:editor.querySelector('[name="answer"]').value.trim(),wrong:editor.querySelector('[name="wrong"]').value.trim()||'Not sure',alternatives:editor.querySelector('[name="alternatives"]').value.split(',').map((s)=>s.trim()).filter(Boolean),formats:[...editor.querySelectorAll('[name="formats"]:checked')].map((input)=>input.value)}));
    if (cards.some((card)=>!card.formats.length)) { toast('Choose at least one question style for every card.'); return; }
    const title=String(data.get('title')).trim(); const subject=String(data.get('subject')).trim();
    let deck;
    if (editingDeckId) {
      deck=getDeck(editingDeckId); deck.title=title; deck.subject=subject; deck.cards=cards; deck.icon=subject.toLowerCase().includes('math')?'➗':subject.toLowerCase().includes('science')?'🧪':'✦';
    } else {
      deck={id:`deck-${Date.now()}`,title,subject,icon:subject.toLowerCase().includes('math')?'➗':subject.toLowerCase().includes('science')?'🧪':'✦',color:['#eee9ff','#eaf4ff','#fff1e7','#eaf8f1'][state.decks.length%4],ink:'#6854c8',creator:displayName(),cards};
      state.decks.unshift(deck);
    }
    const wasEditing=Boolean(editingDeckId); editingDeckId=null; save(); selectedDeckId=deck.id; page='deck'; renderApp(); toast(wasEditing?'Your changes are saved.':'Your study set is saved in this browser.');
  } else if (kind==='practice-setup') {
    const deckId=form.dataset.id; const formats=data.getAll('formats'); if (!formats.length) { toast('Choose at least one question style.'); return; }
    selectedDeckId=deckId; const usage=getUsage(deckId); usage.practiceStarted=true; usage.practiceTypes=formats; usage.practiceSpelling=String(data.get('spelling')); usage.practiceDone=[]; save(); session={kind:'practice',deckId,types:formats,spelling:usage.practiceSpelling}; page='practice'; renderApp();
  } else if (kind==='practice-answer') {
    const task=currentPracticeTask(); if (!task) return; const answer=String(data.get('answer')||''); const question=practiceQuestion(task);
    if (!isAnswerCorrect(answer,task.card,task.type,question.truth,session.spelling)) { session.feedback='Not quite — try again.'; session.truth=null; renderApp(); return; }
    const usage=getUsage(session.deckId); usage.practiceDone=[...(usage.practiceDone||[]),task.key]; session.awaitingNext=true; session.feedback=''; session.truth=null; save(); renderApp();
  } else if (kind==='flashcard-setup') {
    const deckId=form.dataset.id; selectedDeckId=deckId; session={kind:'flashcards',deckId,cards:[...getDeck(deckId).cards],index:0,flipped:false,front:String(data.get('front')),known:[],wrong:[]}; page='flashcards'; renderApp();
  } else if (kind==='test-setup') {
    const deckId=form.dataset.id; const deck=getDeck(deckId); const formats=data.getAll('formats'); if (!formats.length) { toast('Choose at least one question style.'); return; }
    const count=Number(data.get('count')); const cards=shuffle(deck.cards.filter((card)=>formats.some((type)=>(card.formats||Object.keys(FORMAT_LABELS)).includes(type)))).slice(0,count);
    const pool=cards.map((card)=>{
      const supported=formats.filter((type)=>(card.formats||Object.keys(FORMAT_LABELS)).includes(type));
      const type=supported[Math.floor(Math.random()*supported.length)];
      const truth=type==='true-false'?Math.random()>.5:null;
      const statement=type==='true-false'?`${card.prompt} ${truth?card.answer:(card.wrong||randomOtherAnswer(deck,card))}`:card.prompt;
      return {card,type,truth,prompt:statement};
    });
    selectedDeckId=deckId;
    session={kind:'test',deckId,tasks:pool.slice(0,count),index:0,answers:[],startedAt:Date.now()}; page='test'; renderApp();
  } else if (kind==='test-answer') {
    const task=session.tasks[session.index]; const answer=String(data.get('answer')||''); const truth=task.type==='true-false' ? true : null;
    session.answers.push({correct:isAnswerCorrect(answer,task.card,task.type,task.truth ?? truth,'strict')});
    session.index++;
    if (session.index>=session.tasks.length) finishTest(); else session.awaitingNext=true;
    renderApp();
  } else if (kind==='block-answer') {
    const answer=String(data.get('answer')||'');
    if (normalize(answer)!==normalize(session.card.answer)) { session.feedback='Not quite. Try another answer.'; renderApp(); return; }
    session.shapes=Array.from({length:3},()=>SHAPES[Math.floor(Math.random()*SHAPES.length)]); session.selectedShape=null; session.phase='place'; session.feedback='Correct! Pick a shape to place.'; renderApp();
  } else if (kind==='create-class') {
    const selected=[...form.querySelector('[name="deckIds"]').selectedOptions].map((option)=>option.value);
    const klass={id:`class-${Date.now()}`,name:String(data.get('name')).trim(),code:randomCode(),teacher:displayName(),deckIds:selected,members:[displayName()]};
    state.classes.push(klass); save(); renderApp(); toast(`Class created. Share code ${klass.code} with students.`);
  } else if (kind==='join-class') {
    const code=String(data.get('code')).trim().toUpperCase(); const klass=state.classes.find((item)=>item.code===code);
    if (!klass) { toast('That class code is not in this browser yet.'); return; }
    if (!klass.members.includes(displayName())) klass.members.push(displayName()); save(); renderApp(); toast(`You joined ${klass.name}.`);
  } else if (kind==='create-event') {
    const gameType=String(data.get('gameType')); liveEvent={code:randomCode(),deckId:String(data.get('deckId')),gameType,teamSetup:String(data.get('teamSetup')||'random'),teamSize:Number(data.get('teamSize')||4),phase:'lobby',streak:0,questionIndex:0,feedback:'',isHost:true}; page='events'; renderApp();
  } else if (kind==='join-event') {
    const code=String(data.get('code')).trim().toUpperCase();
    if (!liveEvent || liveEvent.code!==code) { toast('That event code is not active in this browser.'); return; }
    liveEvent.isHost=false; if (liveEvent.phase==='lobby') toast('You joined the local event preview.'); renderApp();
  } else if (kind==='event-answer') {
    const deck=getDeck(liveEvent.deckId); const card=deck.cards[liveEvent.questionIndex%deck.cards.length]; const answer=String(data.get('answer')||'');
    if (normalize(answer)===normalize(card.answer)) { liveEvent.streak++; liveEvent.feedback='Correct!'; } else { liveEvent.streak=0; liveEvent.feedback='Not quite.'; }
    if (liveEvent.streak>=12) { liveEvent.phase='finished'; liveEvent.winner=liveEvent.gameType==='teams'?'Your team':displayName(); }
    else liveEvent.questionIndex++;
    renderApp();
  }
}

function assignSet(classId) {
  const klass=state.classes.find((item)=>item.id===classId); if (!klass) return;
  const selected=prompt(`Enter study set numbers separated by commas for ${klass.name}:\n${state.decks.map((deck,index)=>`${index+1}. ${deck.title}`).join('\n')}`,klass.deckIds.map((id)=>state.decks.findIndex((d)=>d.id===id)+1).filter((n)=>n>0).join(', '));
  if (selected===null) return;
  klass.deckIds=selected.split(',').map((value)=>state.decks[Number(value.trim())-1]?.id).filter(Boolean); save(); renderApp(); toast('Class study sets updated.');
}

app.addEventListener('click',onClick);
app.addEventListener('submit',onSubmit);
app.addEventListener('change',(event)=>{
  if (event.target.name==='gameType') document.querySelector('#team-settings')?.classList.toggle('hidden',event.target.value!=='teams');
  if (event.target.id==='set-search') filterSets(event.target.value);
});
app.addEventListener('input',(event)=>{ if (event.target.id==='set-search') filterSets(event.target.value); });
function filterSets(value) {
  const query=normalize(value); const cards=[...document.querySelectorAll('#deck-list .deck-card')]; let visible=0;
  cards.forEach((card)=>{
    const deck=getDeck(card.dataset.id); const matches=normalize(`${deck?.title} ${deck?.subject} ${deck?.creator}`).includes(query);
    card.classList.toggle('hidden',!matches); if(matches) visible++;
  });
  const status=document.querySelector('#set-search-results');
  if(status) status.textContent=query ? `${visible} set${visible===1?'':'s'} found for “${value}”. Search checks creator names too.` : 'Search includes creator names, titles, and subjects.';
}
app.addEventListener('change',(event)=>{
  if (event.target.matches('input[type="radio"][name="answer"]')) {
    const form=event.target.closest('form'); if (form) form.querySelectorAll('.answer-choice').forEach((label)=>label.classList.toggle('selected',Boolean(label.querySelector('input:checked'))));
  }
});
app.addEventListener('click',(event)=>{
  if (event.target.matches('[data-match-timer]') || event.target.closest('[data-match-timer]')) return;
});

function tickMatchTimer() {
  if (session?.kind==='matching' && !session.finished) {
    const element=document.querySelector('[data-match-timer]'); if (element) element.textContent=formatTime((Date.now()-session.startedAt)/1000);
  }
  setTimeout(tickMatchTimer,1000);
}
renderApp();
tickMatchTimer();
