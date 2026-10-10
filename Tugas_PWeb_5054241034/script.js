// ═══════════════════════════════════════════════
// ZYRA WEB3 INTERACTIVE ENGINE
// Course Web Programming — Full Interactivity
// ═══════════════════════════════════════════════

// ─── DOM REFS ─────────────────────────────────
const body = document.body;
const cards = document.querySelectorAll(".card, .course-item, .dashboard-card, .hero-card, .login-box");
const progressBars = document.querySelectorAll(".progress-bar");

let pointerX = window.innerWidth / 2;
let pointerY = window.innerHeight / 2;

// ═══════════════════════════════════════════════
// 1. MOUSE TRACKING (for card effects)
// ═══════════════════════════════════════════════
document.addEventListener("mousemove", (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  body.style.setProperty("--mouse-x", `${pointerX}px`);
  body.style.setProperty("--mouse-y", `${pointerY}px`);
});

// ─── 3D Card Tilt ─────────────────────────────
cards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ─── Liquid Progress Bar Hover Effects ─────────────────
function initLiquidProgressBars() {
  const liquidBars = document.querySelectorAll('.liquid-progress-bar');
  liquidBars.forEach(bar => {
    const fill = bar.querySelector('.liquid-fill');
    const percentText = bar.querySelector('.liquid-percent-text');
    const targetPercent = parseInt(bar.getAttribute('data-percent')) || 0;
    
    // Create extra bubble elements on hover
    bar.addEventListener('mouseenter', () => {
      // Spawn multiple bubbles
      for (let i = 0; i < 4; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'liquid-bubble-particle';
        bubble.style.left = `${10 + Math.random() * 60}%`;
        bubble.style.animationDelay = `${Math.random() * 0.8}s`;
        bubble.style.width = bubble.style.height = `${3 + Math.random() * 5}px`;
        fill.appendChild(bubble);
        setTimeout(() => bubble.remove(), 2000);
      }
    });
  });
}
initLiquidProgressBars();

// ═══════════════════════════════════════════════
// 2. SCROLL REVEAL ANIMATIONS
// ═══════════════════════════════════════════════
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach((el) => {
  revealObserver.observe(el);
});

// ═══════════════════════════════════════════════
// 3. FLOATING PARTICLES (Google Antigravity style)
// ═══════════════════════════════════════════════
function initParticleCanvas() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let w, h;
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  // Particle shapes: circle, square, triangle, diamond, line
  const SHAPES = ["circle", "square", "triangle", "diamond", "line"];

  // Green color palette (various shades)
  const COLORS = [
    "rgba(204, 255, 0, 0.7)",    // lime green
    "rgba(180, 230, 0, 0.6)",    // yellow-green
    "rgba(100, 200, 50, 0.55)",  // forest green
    "rgba(150, 255, 50, 0.5)",   // bright green
    "rgba(80, 180, 30, 0.45)",   // dark green
    "rgba(200, 255, 100, 0.6)",  // pale lime
    "rgba(120, 220, 0, 0.5)",    // mid green
    "rgba(60, 160, 60, 0.4)",    // deep green
  ];

  const NUM_PARTICLES = 90;
  const particles = [];

  // Mouse influence radius
  const MOUSE_RADIUS = 120;
  const MOUSE_FORCE = 0.8;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = 2 + Math.random() * 5;
      this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;

      // Slow drifting velocity (antigravity-like)
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;

      // Gentle floating oscillation
      this.floatAmplitude = 0.3 + Math.random() * 0.5;
      this.floatFrequency = 0.005 + Math.random() * 0.01;
      this.floatOffset = Math.random() * Math.PI * 2;
      this.time = 0;
    }

    update() {
      this.time++;
      this.rotation += this.rotationSpeed;

      // Gentle floating oscillation
      const floatY = Math.sin(this.time * this.floatFrequency + this.floatOffset) * this.floatAmplitude;
      const floatX = Math.cos(this.time * this.floatFrequency * 0.7 + this.floatOffset) * this.floatAmplitude * 0.5;

      this.x += this.vx + floatX * 0.1;
      this.y += this.vy + floatY * 0.1;

      // Mouse repulsion (hover pushes particles away)
      const dx = this.x - pointerX;
      const dy = this.y - (pointerY + window.scrollY * 0); // fixed position, use client coords
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }

      // Wrap around screen edges with padding
      const pad = 20;
      if (this.x < -pad) this.x = w + pad;
      if (this.x > w + pad) this.x = -pad;
      if (this.y < -pad) this.y = h + pad;
      if (this.y > h + pad) this.y = -pad;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;

      const s = this.size;

      switch (this.shape) {
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, s / 2, 0, Math.PI * 2);
          ctx.fill();
          break;

        case "square":
          ctx.fillRect(-s / 2, -s / 2, s, s);
          break;

        case "triangle":
          ctx.beginPath();
          ctx.moveTo(0, -s / 2);
          ctx.lineTo(-s / 2, s / 2);
          ctx.lineTo(s / 2, s / 2);
          ctx.closePath();
          ctx.fill();
          break;

        case "diamond":
          ctx.beginPath();
          ctx.moveTo(0, -s / 2);
          ctx.lineTo(s / 2, 0);
          ctx.lineTo(0, s / 2);
          ctx.lineTo(-s / 2, 0);
          ctx.closePath();
          ctx.fill();
          break;

        case "line":
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-s / 2, 0);
          ctx.lineTo(s / 2, 0);
          ctx.stroke();
          break;
      }

      ctx.restore();
    }
  }

  // Initialize particles
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.update();
      p.draw(ctx);
    });

    requestAnimationFrame(animate);
  }

  animate();
}
initParticleCanvas();

// ═══════════════════════════════════════════════
// 4. NAVIGATION ACTIVE STATE
// ═══════════════════════════════════════════════
const navLinks = document.querySelectorAll(".nav-menu a");
const sections = document.querySelectorAll("section[id]");

function updateActiveNav() {
  const scrollY = window.scrollY + 150;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
}
window.addEventListener("scroll", updateActiveNav);

// ═══════════════════════════════════════════════
// 5. TOAST NOTIFICATION SYSTEM
// ═══════════════════════════════════════════════
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon = type === "success" ? "✅" : "ℹ️";
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("removing");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ═══════════════════════════════════════════════
// 6. COURSE COMPLETION & PROGRESS
// ═══════════════════════════════════════════════
let completedCourses = JSON.parse(localStorage.getItem("completedCourses") || "[]");

function initCourseState() {
  completedCourses.forEach((courseId) => {
    const btn = document.querySelector(`[data-course="${courseId}"]`);
    if (btn) {
      btn.classList.add("completed");
      btn.textContent = "Completed";
    }
  });
  updateDashboardProgress();
  updateHistoryList();
  updateCertificateStatus();
}

function toggleCourseComplete(btn) {
  const courseId = btn.getAttribute("data-course");

  if (completedCourses.includes(courseId)) {
    completedCourses = completedCourses.filter((id) => id !== courseId);
    btn.classList.remove("completed");
    btn.textContent = "Mark Complete";
    showToast(`Materi ditandai belum selesai`, "info");
  } else {
    completedCourses.push(courseId);
    btn.classList.add("completed");
    btn.textContent = "Completed";
    showToast(`✨ Materi "${courseId}" selesai!`);
    addNotification(`🎯 Kamu menyelesaikan materi: ${courseId}`);
  }

  localStorage.setItem("completedCourses", JSON.stringify(completedCourses));
  updateDashboardProgress();
  updateHistoryList();
  updateCertificateStatus();
}

function updateDashboardProgress() {
  const moduleMap = {
    "html-dasar": { bar: "progress-html", percent: "html-percent", value: 100 },
    css: { bar: "progress-css", percent: "css-percent", value: 100 },
    javascript: { bar: "progress-js", percent: "js-percent", value: 100 },
    php: { bar: "progress-php", percent: "php-percent", value: 100 },
  };

  Object.keys(moduleMap).forEach((key) => {
    const config = moduleMap[key];
    const isComplete = completedCourses.includes(key);
    const fill = document.getElementById(config.bar);
    const percentEl = document.getElementById(config.percent);
    const val = isComplete ? config.value : 0;

    if (fill) {
      const liquidBar = fill.closest('.liquid-progress-bar');
      if (liquidBar) {
        // For liquid bars, override the data-percent if course is completed
        if (isComplete) {
          liquidBar.setAttribute('data-percent', val);
          fill.style.width = `${val}%`;
          const pText = liquidBar.querySelector('.liquid-percent-text');
          if (pText) pText.textContent = `${val}%`;
        }
      } else {
        // Fallback for regular progress bars
        fill.style.width = `${val}%`;
        fill.textContent = `${val}%`;
      }
    }
    if (percentEl) {
      percentEl.textContent = `${val}%`;
    }
  });
}

const courseNames = {
  "html-dasar": "HTML: Struktur Dokumen Dasar",
  css: "CSS: Selector, Layout, Flexbox",
  javascript: "JavaScript: DOM, Event, Function",
  php: "PHP: Backend Dasar, CRUD",
};

function updateHistoryList() {
  const list = document.getElementById("history-list");
  if (!list) return;

  if (completedCourses.length === 0) {
    list.innerHTML = '<li class="empty-state">Belum ada materi yang diselesaikan. Mulai belajar sekarang!</li>';
    return;
  }

  list.innerHTML = completedCourses
    .map(
      (id) => `<li><span></span> ${courseNames[id] || id}</li>`
    )
    .join("");
}

function updateCertificateStatus() {
  const status = document.getElementById("cert-status");
  const btn = document.getElementById("btn-view-cert");
  const allComplete = completedCourses.length >= 4;

  if (status) {
    if (allComplete) {
      status.className = "certificate-status eligible";
      status.textContent = "🎉 Selamat! Semua modul selesai. Sertifikat siap!";
    } else {
      status.className = "certificate-status";
      status.textContent = `Selesaikan ${4 - completedCourses.length} modul lagi untuk mendapatkan sertifikat`;
    }
  }

  if (btn) {
    btn.disabled = !allComplete;
    btn.textContent = allComplete ? "🏆 Lihat Sertifikat" : `🔒 Lihat Sertifikat`;
  }
}

// ═══════════════════════════════════════════════
// 7. CERTIFICATE MODAL
// ═══════════════════════════════════════════════
function openCertificateModal() {
  const modal = document.getElementById("certificate-modal");
  const nameEl = document.getElementById("cert-user-name");
  const dateEl = document.getElementById("cert-date");
  const userName = localStorage.getItem("userName") || "Student";

  if (nameEl) nameEl.textContent = userName;
  if (dateEl) dateEl.textContent = `Issued on ${new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}`;

  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeCertificateModal() {
  const modal = document.getElementById("certificate-modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

document.getElementById("cert-modal-close")?.addEventListener("click", closeCertificateModal);
document.getElementById("cert-modal-close-btn")?.addEventListener("click", closeCertificateModal);
document.getElementById("certificate-modal")?.addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeCertificateModal();
});

document.getElementById("cert-download")?.addEventListener("click", () => {
  // Generate canvas-based certificate
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, 1200, 800);

  // Border
  ctx.strokeStyle = "#CCFF00";
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 1120, 720);

  // Inner border
  ctx.strokeStyle = "rgba(204, 255, 0, 0.3)";
  ctx.lineWidth = 1;
  ctx.strokeRect(60, 60, 1080, 680);

  // Title
  ctx.fillStyle = "#CCFF00";
  ctx.font = "bold 48px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Certificate of Completion", 600, 180);

  // Divider
  ctx.strokeStyle = "rgba(204, 255, 0, 0.4)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(350, 210);
  ctx.lineTo(850, 210);
  ctx.stroke();

  // Course
  ctx.fillStyle = "#888";
  ctx.font = "22px Inter, sans-serif";
  ctx.fillText("Web Programming Course", 600, 270);

  // Name
  const userName = localStorage.getItem("userName") || "Student";
  ctx.fillStyle = "#f0f0f0";
  ctx.font = "bold 40px Inter, sans-serif";
  ctx.fillText(userName, 600, 370);

  // Description
  ctx.fillStyle = "#888";
  ctx.font = "18px Inter, sans-serif";
  ctx.fillText("has successfully completed all modules including", 600, 430);
  ctx.fillText("HTML, CSS, JavaScript, and PHP", 600, 460);

  // Date
  ctx.fillStyle = "#555";
  ctx.font = "16px Inter, sans-serif";
  ctx.fillText(
    `Issued on ${new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}`,
    600,
    540
  );

  // Badge
  ctx.fillStyle = "#CCFF00";
  ctx.font = "bold 28px Inter, sans-serif";
  ctx.fillText("🏆 CERTIFIED", 600, 630);

  // Download
  const link = document.createElement("a");
  link.download = "certificate-web-programming.png";
  link.href = canvas.toDataURL();
  link.click();

  showToast("Sertifikat berhasil didownload!");
});

// ═══════════════════════════════════════════════
// 8. FORUM SYSTEM
// ═══════════════════════════════════════════════
let forumPosts = JSON.parse(localStorage.getItem("forumPosts") || "[]");

function initForum() {
  renderForumPosts();
}

function postForumMessage() {
  const input = document.getElementById("forum-input");
  const text = input.value.trim();
  if (!text) return;

  const post = {
    id: Date.now(),
    author: localStorage.getItem("userName") || "Anonymous",
    content: text,
    timestamp: new Date().toISOString(),
    likes: 0,
    replies: [],
  };

  forumPosts.unshift(post);
  localStorage.setItem("forumPosts", JSON.stringify(forumPosts));
  input.value = "";

  renderForumPosts();
  showToast("Pertanyaan berhasil diposting!");
  addNotification(`💬 Post baru dari ${post.author}: "${text.substring(0, 40)}..."`);
}

function likePost(postId) {
  const post = forumPosts.find((p) => p.id === postId);
  if (post) {
    post.likes++;
    localStorage.setItem("forumPosts", JSON.stringify(forumPosts));
    renderForumPosts();
  }
}

function deletePost(postId) {
  forumPosts = forumPosts.filter((p) => p.id !== postId);
  localStorage.setItem("forumPosts", JSON.stringify(forumPosts));
  renderForumPosts();
  showToast("Post dihapus", "info");
}

function renderForumPosts() {
  const container = document.getElementById("forum-posts");
  if (!container) return;

  if (forumPosts.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 20px 0;">Belum ada post. Jadilah yang pertama bertanya!</p>';
    return;
  }

  container.innerHTML = forumPosts
    .slice(0, 10)
    .map((post) => {
      const timeAgo = getTimeAgo(new Date(post.timestamp));
      return `
        <div class="forum-post-item">
          <div class="post-header">
            <span class="post-author">${escapeHtml(post.author)}</span>
            <span>${timeAgo}</span>
          </div>
          <div class="post-content">${escapeHtml(post.content)}</div>
          <div class="post-actions">
            <button onclick="likePost(${post.id})">❤️ ${post.likes}</button>
            <button onclick="deletePost(${post.id})">🗑 Hapus</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return "Baru saja";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
  return `${Math.floor(seconds / 86400)} hari lalu`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function addNotification(message) {
  const stack = document.getElementById("notification-stack");
  if (!stack) return;
  const item = document.createElement("div");
  item.className = "notification-item unread";
  item.textContent = message;
  item.style.animation = "slideInUp 0.3s ease";
  stack.insertBefore(item, stack.firstChild);

  // Remove old notifications (keep max 6)
  while (stack.children.length > 6) {
    stack.removeChild(stack.lastChild);
  }
}

// ═══════════════════════════════════════════════
// 9. INTERACTIVE QUIZ ENGINE
// ═══════════════════════════════════════════════
const quizQuestions = [
  {
    question: "Apa tag HTML yang digunakan untuk membuat judul halaman?",
    options: ["<head>", "<title>", "<h1>", "<header>"],
    correct: 1,
  },
  {
    question: "CSS property mana yang mengubah warna background?",
    options: ["color", "bg-color", "background-color", "bgcolor"],
    correct: 2,
  },
  {
    question: "Di JavaScript, bagaimana cara mendeklarasikan variabel?",
    options: ["var x = 5", "variable x = 5", "v x = 5", "int x = 5"],
    correct: 0,
  },
  {
    question: "Apa singkatan dari CSS?",
    options: ["Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets", "Colorful Style Sheets"],
    correct: 1,
  },
  {
    question: "PHP singkatan dari?",
    options: ["Personal Home Page", "PHP: Hypertext Preprocessor", "Pre-Hyper Processing", "Programming Hypertext Protocol"],
    correct: 1,
  },
  {
    question: "Tag HTML untuk membuat daftar terurut?",
    options: ["<ul>", "<list>", "<ol>", "<dl>"],
    correct: 2,
  },
  {
    question: "CSS Flexbox property untuk mengatur arah item?",
    options: ["flex-wrap", "flex-direction", "align-items", "justify-content"],
    correct: 1,
  },
  {
    question: "Method JavaScript untuk memilih elemen berdasarkan ID?",
    options: ["querySelector()", "getElementById()", "getElement()", "findById()"],
    correct: 1,
  },
];

let currentQuestion = 0;
let quizScore = 0;
let quizAnswered = new Array(quizQuestions.length).fill(false);

function initQuiz() {
  renderQuizProgress();
  renderQuizQuestion();
}

function renderQuizProgress() {
  const container = document.getElementById("quiz-progress");
  if (!container) return;
  container.innerHTML = quizQuestions
    .map(
      (_, i) =>
        `<div class="dot ${i === currentQuestion ? "active" : ""} ${quizAnswered[i] ? "answered" : ""}"></div>`
    )
    .join("");
}

function renderQuizQuestion() {
  const questionEl = document.getElementById("quiz-question");
  const optionsEl = document.getElementById("quiz-options");
  const nextBtn = document.getElementById("quiz-next");
  const restartBtn = document.getElementById("quiz-restart");
  const scoreEl = document.getElementById("quiz-score");

  if (!questionEl || !optionsEl) return;

  if (currentQuestion >= quizQuestions.length) {
    // Quiz finished
    questionEl.textContent = "Quiz Selesai!";
    optionsEl.innerHTML = "";
    if (nextBtn) nextBtn.style.display = "none";
    if (restartBtn) restartBtn.style.display = "inline-flex";
    if (scoreEl) {
      scoreEl.style.display = "block";
      document.getElementById("score-value").textContent = `${quizScore}/${quizQuestions.length}`;
    }
    showToast(`Quiz selesai! Skor: ${quizScore}/${quizQuestions.length}`);
    return;
  }

  const q = quizQuestions[currentQuestion];
  questionEl.textContent = `${currentQuestion + 1}. ${q.question}`;

  if (scoreEl) scoreEl.style.display = "none";
  if (restartBtn) restartBtn.style.display = "none";
  if (nextBtn) nextBtn.style.display = "none";

  optionsEl.innerHTML = q.options
    .map(
      (opt, i) =>
        `<button class="quiz-option-btn" onclick="answerQuiz(${i})">${String.fromCharCode(65 + i)}. ${opt}</button>`
    )
    .join("");

  renderQuizProgress();
}

function answerQuiz(selectedIndex) {
  const q = quizQuestions[currentQuestion];
  const buttons = document.querySelectorAll(".quiz-option-btn");
  const nextBtn = document.getElementById("quiz-next");

  buttons.forEach((btn, i) => {
    btn.classList.add("disabled");
    if (i === q.correct) {
      btn.classList.add("correct");
    } else if (i === selectedIndex && i !== q.correct) {
      btn.classList.add("incorrect");
    }
  });

  if (selectedIndex === q.correct) {
    quizScore++;
  }

  quizAnswered[currentQuestion] = true;
  renderQuizProgress();

  if (nextBtn) nextBtn.style.display = "inline-flex";
}

function nextQuizQuestion() {
  currentQuestion++;
  renderQuizQuestion();
}

function restartQuiz() {
  currentQuestion = 0;
  quizScore = 0;
  quizAnswered = new Array(quizQuestions.length).fill(false);
  renderQuizQuestion();
}

// ═══════════════════════════════════════════════
// 10. CODING EXERCISE
// ═══════════════════════════════════════════════
function runCode() {
  const editor = document.getElementById("code-editor");
  const outputFrame = document.getElementById("code-output");
  if (!editor || !outputFrame) return;

  const code = editor.value;
  const doc = outputFrame.contentDocument || outputFrame.contentWindow.document;
  doc.open();
  doc.write(code);
  doc.close();

  showToast("Code executed successfully!");
}

// ═══════════════════════════════════════════════
// 11. PROJECT CHECKLIST
// ═══════════════════════════════════════════════
function updateProjectProgress() {
  const checks = document.querySelectorAll(".project-check");
  const total = checks.length;
  const done = Array.from(checks).filter((c) => c.checked).length;
  const percent = Math.round((done / total) * 100);

  const bar = document.getElementById("project-progress");
  if (bar) {
    bar.style.width = `${percent}%`;
    bar.textContent = `${percent}%`;
  }

  if (percent === 100) {
    showToast("🎉 Project akhir selesai!");
  }
}

// ═══════════════════════════════════════════════
// 12. ADMIN PANEL
// ═══════════════════════════════════════════════
const mockUsers = [
  { name: "Andi Pratama", role: "student", progress: 85 },
  { name: "Budi Santoso", role: "student", progress: 72 },
  { name: "Citra Dewi", role: "instructor", progress: 100 },
  { name: "Diana Putri", role: "student", progress: 45 },
  { name: "Eko Wijaya", role: "student", progress: 91 },
  { name: "Fitri Handayani", role: "instructor", progress: 100 },
  { name: "Gita Nirmala", role: "student", progress: 33 },
  { name: "Hadi Kusuma", role: "student", progress: 67 },
  { name: "Indah Permata", role: "student", progress: 58 },
  { name: "Joko Widodo", role: "student", progress: 12 },
];

function initAdminTable(filter = "") {
  const tbody = document.getElementById("admin-user-tbody");
  if (!tbody) return;

  const filtered = mockUsers.filter((u) =>
    u.name.toLowerCase().includes(filter.toLowerCase())
  );

  tbody.innerHTML = filtered
    .map(
      (user) => `
      <tr>
        <td>${user.name}</td>
        <td><span class="role-badge ${user.role}">${user.role === "student" ? "Siswa" : "Instruktur"}</span></td>
        <td>${user.progress}%</td>
      </tr>
    `
    )
    .join("");
}

function filterUsers() {
  const search = document.getElementById("admin-search");
  initAdminTable(search ? search.value : "");
}

// Upload simulation
const uploadFileNames = [
  { name: "Tutorial-Flexbox.mp4", size: "18.3 MB", icon: "🎬" },
  { name: "Modul-Grid-CSS.pdf", size: "5.7 MB", icon: "📄" },
  { name: "Latihan-DOM.zip", size: "12.4 MB", icon: "📦" },
  { name: "Cheatsheet-PHP.docx", size: "2.1 MB", icon: "📝" },
];

function simulateUpload() {
  const file = uploadFileNames[Math.floor(Math.random() * uploadFileNames.length)];
  const container = document.getElementById("uploaded-files");
  if (!container) return;

  const el = document.createElement("div");
  el.className = "uploaded-file";
  el.innerHTML = `
    <span><span class="file-icon">${file.icon}</span> ${file.name}</span>
    <span class="file-size">${file.size}</span>
  `;
  container.insertBefore(el, container.firstChild);

  showToast(`📁 File "${file.name}" berhasil diupload!`);
}

// ═══════════════════════════════════════════════
// 13. ANIMATED COUNTERS (Scroll-triggered)
// ═══════════════════════════════════════════════
function animateCounter(el) {
  const target = parseInt(el.getAttribute("data-target"));
  const duration = 2000;
  const start = Date.now();

  function update() {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  update();
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll(".stat-counter");
        counters.forEach((el) => {
          if (!el.dataset.animated) {
            el.dataset.animated = "true";
            animateCounter(el);
          }
        });
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".admin-card, .dashboard-card").forEach((el) => {
  counterObserver.observe(el);
});

// ═══════════════════════════════════════════════
// 14. CHART BARS ANIMATION
// ═══════════════════════════════════════════════
const chartObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll(".chart-bar");
        bars.forEach((bar, i) => {
          setTimeout(() => {
            const value = bar.getAttribute("data-value");
            bar.style.height = `${value}%`;
          }, i * 150);
        });
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".stats-chart").forEach((el) => {
  chartObserver.observe(el);
});

// ═══════════════════════════════════════════════
// 15. LOGIN HANDLER
// ═══════════════════════════════════════════════
function handleLogin(event) {
  event.preventDefault();
  const name = document.getElementById("login-name").value;
  const email = document.getElementById("login-email").value;

  localStorage.setItem("userName", name);
  localStorage.setItem("userEmail", email);

  showToast(`Selamat datang, ${name}!`);

  // Scroll to dashboard
  setTimeout(() => {
    document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
  }, 500);
}

// ═══════════════════════════════════════════════
// 16. PROGRESS BAR SCROLL ANIMATION
// ═══════════════════════════════════════════════
const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Animate liquid progress bars
        const liquidBars = entry.target.querySelectorAll('.liquid-progress-bar');
        liquidBars.forEach((bar, i) => {
          const percent = parseInt(bar.getAttribute('data-percent')) || 0;
          const fill = bar.querySelector('.liquid-fill');
          const percentText = bar.querySelector('.liquid-percent-text');
          const labelPercent = bar.previousElementSibling?.querySelector('span:last-child');

          setTimeout(() => {
            if (fill) fill.style.width = `${percent}%`;

            // Animate percentage text counting up
            let current = 0;
            const duration = 2000;
            const start = performance.now();
            function animatePercent(now) {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              current = Math.round(percent * eased);
              if (percentText) percentText.textContent = `${current}%`;
              if (labelPercent) labelPercent.textContent = `${current}%`;
              if (progress < 1) requestAnimationFrame(animatePercent);
            }
            requestAnimationFrame(animatePercent);
          }, i * 200);
        });

        // Also handle regular progress bars (project checklist etc.)
        const bars = entry.target.querySelectorAll('.progress');
        bars.forEach((bar) => {
          const target = bar.getAttribute('data-target');
          if (target) {
            setTimeout(() => {
              bar.style.width = `${target}%`;
              bar.textContent = `${target}%`;
            }, 300);
          }
        });
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('#progress-card').forEach((el) => {
  progressObserver.observe(el);
});

// ═══════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", () => {
  initCourseState();
  initForum();
  initQuiz();
  initAdminTable();

  // Run code on load
  setTimeout(() => runCode(), 800);
});
