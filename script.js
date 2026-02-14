// Smooth scroll helper
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

// Navbar navigation
document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.target;
        scrollToSection(target);
    });
});

// Enter portal button
const enterPortalBtn = document.getElementById("enterPortalBtn");
if (enterPortalBtn) {
    enterPortalBtn.addEventListener("click", () => scrollToSection("apps"));
}

// App switching (SPA feel)
const appButtons = document.querySelectorAll(".app-card");
const appSections = {
    anime: document.getElementById("animeHub"),
    nxtwave: document.getElementById("nxtwaveHub"),
    ai: document.getElementById("aiHub"),
    comet: document.getElementById("cometHub"),
    vscode: document.getElementById("vscodeHub"),
    youtube: document.getElementById("youtubeHub"),
};

function showApp(appKey) {
    Object.values(appSections).forEach((sec) => {
        if (sec) sec.classList.add("hidden");
    });
    if (appSections[appKey]) {
        appSections[appKey].classList.remove("hidden");
        scrollToSection("apps");
    }
}

appButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const appKey = btn.dataset.app;
        showApp(appKey);
    });
});

// -------------------- Anime Hub --------------------
const animeData = [
    { title: "Attack on Titan", genre: "action", rating: 9.0 },
    { title: "Jujutsu Kaisen", genre: "action", rating: 8.7 },
    { title: "Demon Slayer", genre: "action", rating: 8.8 },
    { title: "Your Name", genre: "fantasy", rating: 8.9 },
    { title: "Spirited Away", genre: "fantasy", rating: 9.0 },
    { title: "My Hero Academia", genre: "action", rating: 8.0 },
    { title: "Horimiya", genre: "slice", rating: 8.2 },
    { title: "March Comes in Like a Lion", genre: "slice", rating: 9.0 },
    { title: "Barakamon", genre: "slice", rating: 8.4 },
];

const animeCardsContainer = document.getElementById("animeCards");
const animeFilter = document.getElementById("animeFilter");
const randomAnimeBtn = document.getElementById("randomAnimeBtn");
const animeHighlight = document.getElementById("animeHighlight");

function renderAnimeCards(filter = "all") {
    animeCardsContainer.innerHTML = "";
    animeData
        .filter((a) => (filter === "all" ? true : a.genre === filter))
        .forEach((anime) => {
            const card = document.createElement("div");
            card.className =
                "bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs hover:border-cyan-400/60 transition";
            card.innerHTML = `
        <p class="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
          ${anime.genre.toUpperCase()}
        </p>
        <h4 class="font-semibold text-sm mb-1">${anime.title}</h4>
        <p class="text-[11px] text-slate-300">Rating: ${anime.rating}/10</p>
      `;
            animeCardsContainer.appendChild(card);
        });
}

if (animeFilter) {
    animeFilter.addEventListener("change", () => {
        renderAnimeCards(animeFilter.value);
        animeHighlight.classList.add("hidden");
    });
}

if (randomAnimeBtn) {
    randomAnimeBtn.addEventListener("click", () => {
        const list =
            animeFilter.value === "all"
                ? animeData
                : animeData.filter((a) => a.genre === animeFilter.value);
        if (list.length === 0) return;
        const picked = list[Math.floor(Math.random() * list.length)];
        animeHighlight.textContent = `Today's pick: ${picked.title} (${picked.rating}/10)`;
        animeHighlight.classList.remove("hidden");
    });
}

// Initial render
if (animeCardsContainer) renderAnimeCards();

// -------------------- NxtWave Hub --------------------
const todayTasksEl = document.getElementById("todayTasks");
const upcomingAssessmentsEl = document.getElementById("upcomingAssessments");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const addTaskBtn = document.getElementById("addTaskBtn");

let tasks = JSON.parse(localStorage.getItem("fdp_tasks") || "[]");

const defaultAssessments = [
    "JavaScript mini‑project review",
    "Frontend quiz – DOM & Events",
    "Mock interview – HTML/CSS basics",
];

function renderTasks() {
    if (!todayTasksEl) return;
    todayTasksEl.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className =
            "flex items-center justify-between gap-2 bg-slate-950 border border-slate-800 rounded px-2 py-1";
        li.innerHTML = `
      <span>${task}</span>
      <button data-index="${index}" class="text-[10px] text-pink-400 hover:text-pink-300 remove-task">Done</button>
    `;
        todayTasksEl.appendChild(li);
    });

    // simple fake progress
    const total = Math.max(tasks.length, 3);
    const completed = Math.max(0, 3 - tasks.length);
    const percent = Math.round((completed / total) * 100);
    if (progressBar) progressBar.style.width = `${Math.min(percent, 100)}%`;
    if (progressText)
        progressText.textContent = `Approx. progress for today: ${percent}%`;
}

function renderAssessments() {
    if (!upcomingAssessmentsEl) return;
    upcomingAssessmentsEl.innerHTML = "";
    defaultAssessments.forEach((a) => {
        const li = document.createElement("li");
        li.textContent = a;
        upcomingAssessmentsEl.appendChild(li);
    });
}

if (addTaskBtn) {
    addTaskBtn.addEventListener("click", () => {
        const text = prompt("Enter a new task for today:");
        if (text && text.trim().length > 0) {
            tasks.push(text.trim());
            localStorage.setItem("fdp_tasks", JSON.stringify(tasks));
            renderTasks();
        }
    });
}

if (todayTasksEl) {
    todayTasksEl.addEventListener("click", (e) => {
        const btn = e.target.closest(".remove-task");
        if (!btn) return;
        const index = Number(btn.dataset.index);
        tasks.splice(index, 1);
        localStorage.setItem("fdp_tasks", JSON.stringify(tasks));
        renderTasks();
    });
}

renderTasks();
renderAssessments();

// -------------------- AI Chat Hub --------------------
const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

const aiReplies = [
    "Hello! I am your Future Dev AI assistant.",
    "Remember: small projects, built consistently, create big skills.",
    "Practice DOM, events, and localStorage. They show up everywhere.",
    "Take breaks, stay hydrated, and keep coding.",
    "Anime + Code = Perfect combo for a study session.",
];

function addMessage(text, sender = "user") {
    if (!chatWindow) return;
    const wrapper = document.createElement("div");
    wrapper.className =
        sender === "user"
            ? "flex justify-end"
            : "flex justify-start";

    const bubble = document.createElement("div");
    bubble.className =
        "max-w-[70%] px-3 py-2 rounded-lg text-xs " +
        (sender === "user"
            ? "bg-cyan-500 text-slate-950"
            : "bg-slate-800 text-slate-100");

    bubble.textContent = text;
    wrapper.appendChild(bubble);
    chatWindow.appendChild(wrapper);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;
        addMessage(text, "user");
        chatInput.value = "";

        setTimeout(() => {
            const reply =
                aiReplies[Math.floor(Math.random() * aiReplies.length)];
            addMessage(reply, "ai");
        }, 700);
    });
}

// -------------------- Comet Streaks --------------------
const streakGrid = document.getElementById("streakGrid");
const markTodayBtn = document.getElementById("markTodayBtn");
const streakInfo = document.getElementById("streakInfo");

let streakData = JSON.parse(localStorage.getItem("fdp_streaks") || "[]"); // array of ISO dates

function isSameDay(a, b) {
    const da = new Date(a);
    const db = new Date(b);
    return (
        da.getFullYear() === db.getFullYear() &&
        da.getMonth() === db.getMonth() &&
        da.getDate() === db.getDate()
    );
}

function renderStreakGrid() {
    if (!streakGrid) return;
    streakGrid.innerHTML = "";
    const today = new Date();
    const daysToShow = 28; // 4 weeks

    for (let i = daysToShow - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const iso = d.toISOString();
        const done = streakData.some((dateStr) => isSameDay(dateStr, iso));

        const cell = document.createElement("div");
        cell.className =
            "w-6 h-6 rounded border border-slate-700 flex items-center justify-center text-[9px] cursor-default " +
            (done ? "bg-pink-500/70 text-slate-950" : "bg-slate-900 text-slate-500");
        cell.title = d.toDateString();
        cell.textContent = d.getDate();
        streakGrid.appendChild(cell);
    }

    const streakLength = streakData.length;
    if (streakInfo) {
        streakInfo.textContent = `You have ${streakLength} coding day${streakLength === 1 ? "" : "s"
            } recorded in the last ${daysToShow} days.`;
    }
}

if (markTodayBtn) {
    markTodayBtn.addEventListener("click", () => {
        const today = new Date().toISOString();
        const already = streakData.some((d) => isSameDay(d, today));
        if (!already) {
            streakData.push(today);
            localStorage.setItem("fdp_streaks", JSON.stringify(streakData));
            renderStreakGrid();
            alert("Nice! Today marked as a coding day 🚀");
        } else {
            alert("Today is already counted as a coding day!");
        }
    });
}

renderStreakGrid();

// -------------------- VS Code Hub --------------------
const codeEditor = document.getElementById("codeEditor");
const fileTabs = document.querySelectorAll(".file-tab");

const fileContents = {
    "portal.js": `// Single Page App nav example
const links = document.querySelectorAll(".nav-link");
links.forEach(link => {
  link.addEventListener("click", () => {
    const id = link.dataset.target;
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  });
});`,
    "anime.js": `// Anime filter example
const anime = [
  { title: "Attack on Titan", genre: "action" },
  { title: "Your Name", genre: "fantasy" },
];

function filterAnime(genre) {
  return genre === "all" ? anime : anime.filter(a => a.genre === genre);
}`,
    "aiHub.js": `// Simple fake AI chat
const replies = [
  "Keep coding!",
  "Small steps every day.",
];

function randomReply() {
  const index = Math.floor(Math.random() * replies.length);
  return replies[index];
}`,
};

function setActiveFile(fileKey) {
    if (!codeEditor) return;
    codeEditor.textContent = fileContents[fileKey] || "// file not found";
}

fileTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        fileTabs.forEach((t) => t.classList.remove("bg-slate-800", "text-cyan-300"));
        tab.classList.add("bg-slate-800", "text-cyan-300");
        const fileKey = tab.dataset.file;
        setActiveFile(fileKey);
    });
});

// default active file
if (fileTabs.length > 0) {
    fileTabs[0].click();
}

// -------------------- YouTube Hub --------------------
const videoCards = document.getElementById("videoCards");
const videoSearch = document.getElementById("videoSearch");

const videoData = [
    {
        title: "JavaScript DOM Crash Course",
        tag: "web dev",
        url: "https://www.youtube.com/results?search_query=javascript+dom",
    },
    {
        title: "Tailwind CSS in 15 Minutes",
        tag: "css",
        url: "https://www.youtube.com/results?search_query=tailwind+css+crash+course",
    },
    {
        title: "VS Code Tips and Tricks",
        tag: "vscode",
        url: "https://www.youtube.com/results?search_query=vs+code+tips",
    },
    {
        title: "Anime AMV Study Mix",
        tag: "anime",
        url: "https://www.youtube.com/results?search_query=anime+study+mix",
    },
    {
        title: "NxtWave / 100x Engineers Motivation",
        tag: "motivation",
        url: "https://www.youtube.com/results?search_query=developer+motivation",
    },
];

function renderVideos(filterText = "") {
    if (!videoCards) return;
    videoCards.innerHTML = "";
    const term = filterText.toLowerCase();

    videoData
        .filter(
            (v) =>
                v.title.toLowerCase().includes(term) ||
                v.tag.toLowerCase().includes(term)
        )
        .forEach((v) => {
            const card = document.createElement("div");
            card.className =
                "bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-xs flex flex-col justify-between";
            card.innerHTML = `
        <div>
          <p class="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
            ${v.tag}
          </p>
          <h4 class="font-semibold text-sm mb-2">${v.title}</h4>
        </div>
        <button class="mt-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-[11px] open-video">
          Open on YouTube
        </button>
      `;
            card.querySelector(".open-video").addEventListener("click", () => {
                window.open(v.url, "_blank");
            });
            videoCards.appendChild(card);
        });
}

if (videoSearch) {
    videoSearch.addEventListener("input", () => {
        renderVideos(videoSearch.value);
    });
}

renderVideos();

// -------------------- Contact form validation --------------------
const contactForm = document.getElementById("contactForm");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactMessage = document.getElementById("contactMessage");
const contactStatus = document.getElementById("contactStatus");

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = contactName.value.trim();
        const email = contactEmail.value.trim();
        const msg = contactMessage.value.trim();
        if (!name || !email || !msg) {
            contactStatus.textContent = "Please fill in all fields.";
            contactStatus.className = "text-xs text-pink-400";
            return;
        }
        if (!email.includes("@")) {
            contactStatus.textContent = "Please enter a valid email address.";
            contactStatus.className = "text-xs text-pink-400";
            return;
        }
        contactStatus.textContent = "Message sent (front‑end only demo).";
        contactStatus.className = "text-xs text-emerald-400";
        contactForm.reset();
    });
}
