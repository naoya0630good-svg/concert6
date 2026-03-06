let currentView = "home";

/* ===============================
   タブ切り替え
================================ */
const tabs = document.querySelectorAll(".tab");
const programLists = document.querySelectorAll(".program-list");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const targetId = tab.dataset.target;
    programLists.forEach((list) => {
      list.classList.toggle("hidden", list.id !== targetId);
    });

    setupSongToggle();
  });
});

/* ===============================
   曲説明トグル
================================ */
function setupSongToggle() {
  const songs = document.querySelectorAll(".program-list:not(.hidden) .song");

  songs.forEach((song) => {
    const toggle = song.querySelector(".toggle");
    if (!toggle) return;

    toggle.onclick = (e) => {
      e.stopPropagation();

      const isOpen = song.classList.contains("open");

      // いったん全部閉じる
      songs.forEach((s) => s.classList.remove("open"));

      // もともと閉じてた場合だけ開く
      if (!isOpen) {
        song.classList.add("open");
      }
    };
  });
}
setupSongToggle();

/* ===============================
   MEMBER モーダル（モード管理）
================================ */
const memberBtn = document.getElementById("memberBtn");
const memberModal = document.getElementById("memberModal");
const closeMember = document.getElementById("closeMember");
const gradeNav = document.getElementById("gradeNav");
const gradeTitles = document.querySelectorAll(".grade-title");

const MODE = {
  MEMBER: "member",
};

/* ===== 初期化 ===== */
function resetMemberModal() {
  document.querySelectorAll(".member").forEach((m) => {
    m.style.display = "block";
  });
}

/* ===== モーダルを開く ===== */
function openMemberModal(mode) {
  resetMemberModal();

  memberModal.classList.remove("member-mode", "song-mode");
  memberModal.classList.add(mode + "-mode");
  memberModal.classList.remove("hidden");
}

/* ===== 閉じる ===== */
function closeMemberModal() {
  memberModal.classList.add("hidden");
  resetMemberModal();
}

closeMember.addEventListener("click", closeMemberModal);
memberModal.addEventListener("click", (e) => {
  if (e.target === memberModal) closeMemberModal();
});

/* ===============================
   MEMBER ボタン
================================ */
memberBtn.addEventListener("click", () => {
  openMemberModal(MODE.MEMBER);
});

/* ===============================
   人 → 曲
================================ */
document.querySelectorAll(".member").forEach((member) => {
  member.addEventListener("click", () => {
    const songs = member.dataset.songs.split(" ");
    const name = member.textContent.trim();

    // ===== 学年判定（←ここ重要！）=====
    const grade = name.charAt(0);

    const noMsg = document.getElementById("noAppearanceMsg");

    if (grade === "1" || grade === "2") {
      noMsg.classList.remove("hidden");
    } else {
      noMsg.classList.add("hidden");
    }

    // ===== 曲フィルタ =====
    document.querySelectorAll(".song").forEach((song) => {
      song.style.display = songs.includes(song.dataset.song) ? "block" : "none";
    });

    closeMemberModal();

    history.classList.add("hidden");
    hero.classList.remove("hidden");
    tabsArea.classList.remove("hidden");
    program.classList.remove("hidden");

    // ヒーロー書き換え
    document.getElementById("heroTitle").textContent = name;
    document.getElementById("hellow").innerHTML = "▶ この部員の出演曲を表示中";
    updateStar(name);
  });
});

/* ===============================
   SEARCH モーダル
================================ */
const searchBtn = document.getElementById("searchBtn");
const searchModal = document.getElementById("searchModal");
const closeSearch = document.getElementById("closeSearch");

searchBtn.addEventListener("click", () => {
  const history = document.getElementById("historySection");
  if (history) history.classList.add("hidden");

  const member = document.getElementById("memberModal");
  if (member) member.classList.add("hidden");

  searchModal.classList.remove("hidden");
});

closeSearch.addEventListener("click", () => {
  searchModal.classList.add("hidden");

  if (currentView === "home") {
    hero.classList.remove("hidden");
    tabsArea.classList.remove("hidden");
    program.classList.remove("hidden");
  }

  if (currentView === "history") {
    history.classList.remove("hidden");
  }
});

searchModal.addEventListener("click", (e) => {
  if (e.target === searchModal) {
    searchModal.classList.add("hidden");

    if (currentView === "home") {
      hero.classList.remove("hidden");
      tabsArea.classList.remove("hidden");
      program.classList.remove("hidden");
    }

    if (currentView === "history") {
      history.classList.remove("hidden");
    }
  }
});

/* ===============================
   SEARCH 処理
================================ */
const gradeInput = document.getElementById("searchGrade");
const classInput = document.getElementById("searchClass");
const nameInput = document.getElementById("searchName");
const resultsBox = document.getElementById("searchResults");

function runSearch() {
  const grade = gradeInput.value;
  const cls = classInput.value.trim();
  const name = nameInput.value.trim();

  resultsBox.innerHTML = "";
  if (!grade && !cls && !name) return;

  document.querySelectorAll(".member").forEach((member) => {
    const text = member.textContent;

    const clean = text.trim(); // 先頭の見えないスペース対策

    const ok =
      (!grade || clean.startsWith(grade)) &&
      (!cls || clean.includes(cls + "組")) &&
      (!name || clean.includes(name));

    if (ok) {
      const div = document.createElement("div");
      div.className = "search-result";
      div.textContent = text;
      div.dataset.songs = member.dataset.songs;
      resultsBox.appendChild(div);
    }
  });
}

[gradeInput, classInput, nameInput].forEach((el) =>
  el.addEventListener("input", runSearch),
);

resultsBox.addEventListener("click", (e) => {
  const item = e.target.closest(".search-result");
  if (!item) return;

  const songs = item.dataset.songs.split(" ");
  const text = item.textContent.trim(); // ← これ超大事

  searchModal.classList.add("hidden");
  history.classList.add("hidden");
  hero.classList.remove("hidden");
  tabsArea.classList.remove("hidden");
  program.classList.remove("hidden");

  // ===== 学年を“確実に”取得 =====
  const grade = text.trim().charAt(0);

  const tab1 = document.querySelector('[data-target="concert6"]');
  const tab2 = document.querySelector('[data-target="graduation11"]');

  // ===== 第2部メッセージ制御 =====
  const noMsg = document.getElementById("noAppearanceMsg");

  if (grade === "1" || grade === "2") {
    // メッセージ表示
    noMsg.classList.remove("hidden");
  } else {
    // 3年はメッセージ消す
    noMsg.classList.add("hidden");
  }

  // ===== 曲フィルタ =====
  document.querySelectorAll(".song").forEach((song) => {
    song.style.display = songs.includes(song.dataset.song) ? "block" : "none";
  });

  //ヒーロー部分書き換え
  document.getElementById("heroTitle").textContent = item.textContent;
  document.getElementById("heroSub").innerHTML =
    "Members of the Kyushu Sangyo High School Japanese Drum Club";
  document.getElementById("hellow").innerHTML = "▶ この部員の出演曲を表示中";
});

/* ===============================
   HOME（修正版）
================================ */

document.getElementById("homeBtn").addEventListener("click", () => {
  currentView = "home";
  document.querySelector('[data-target="graduation11"]').style.display = "";

  document.querySelectorAll(".song").forEach((song) => {
    song.style.display = "block";
  });

  document.getElementById("hellow").textContent = "The 6th Annual Concert of";
  document.getElementById("heroTitle").textContent = "SHIENRAKU";

  updateStar("SHIENRAKU");

  document.getElementById("heroSub").innerHTML = `
    The Japanese Drum Club<br>
    of Kyushu Sangyo High School.
  `;
});

document.querySelectorAll(".grade-nav button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const grade = btn.dataset.grade;

    if (grade === "all") {
      memberModal
        .querySelector(".member-list")
        .scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = memberModal.querySelector(
      `.grade-group[data-grade="${grade}"]`,
    );

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

/* ===============================
   HISTORY 切り替え（最終安全版）
================================ */

// 要素取得（存在チェックつき）
const historyBtn = document.getElementById("historyBtn");
const homeBtn = document.getElementById("homeBtn");

const hero = document.querySelector(".hero");
const tabsArea = document.querySelector(".tabs");
const program = document.querySelector(".program");
const history = document.getElementById("historySection");

console.log("診断:", {
  historyBtn,
  homeBtn,
  hero,
  tabsArea,
  program,
  history,
});

// ===== HISTORYを開く =====
if (historyBtn) {
  historyBtn.addEventListener("click", () => {
    currentView = "history";
    hero.classList.add("hidden");
    tabsArea.classList.add("hidden");
    program.classList.add("hidden");

    history.classList.remove("hidden");
  });
}

// ===== HOMEで戻る =====
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    history.classList.add("hidden");

    hero.classList.remove("hidden");
    tabsArea.classList.remove("hidden");
    program.classList.remove("hidden");

    // --- ① 第2部を元通り表示 ---
    document.querySelector('[data-target="graduation11"]').style.display = "";

    // --- ② すべての曲を表示 ---
    document.querySelectorAll(".song").forEach((song) => {
      song.style.display = "block";
    });

    // --- ★★★ ここが今回の本命 ★★★ ---
    const noMsg = document.getElementById("noAppearanceMsg");
    if (noMsg) {
      noMsg.classList.add("hidden"); // メッセージを消す！
    }
    // --- ★★★ ここまで ★★★ ---

    // --- ③ ヒーロー表示を初期に戻す ---
    document.getElementById("hellow").textContent = "The 6th Annual Concert of";

    document.getElementById("heroTitle").textContent = "SHIENRAKU";

    document.getElementById("heroSub").innerHTML = `
    The Japanese Drum Club<br>
    of Kyushu Sangyo High School.`;

    updateStar("SHIENRAKU");
  });
}

// ===== ポリシー表示 =====
document.getElementById("openPolicy").onclick = () =>
  document.getElementById("policyModal").classList.remove("hidden");

document.getElementById("closePolicy").onclick = () =>
  document.getElementById("policyModal").classList.add("hidden");

// ===== 利用規約 =====
document.getElementById("openTerms").onclick = () =>
  document.getElementById("termsModal").classList.remove("hidden");

document.getElementById("closeTerms").onclick = () =>
  document.getElementById("termsModal").classList.add("hidden");

/* ===============================
   OPENING（ボタン式）
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const opening = document.getElementById("opening");
  const openingImage = document.getElementById("openingImage");
  openingImage.loading = "lazy";
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const helpBtn = document.querySelector(".icon");

  if (!opening) return;

  const slides = [
    "https://i.postimg.cc/hGXr8g72/IMG-0167.webp",
    "https://i.postimg.cc/x8BYC9H5/IMG-0166.webp",
    "https://i.postimg.cc/5tpVzBLj/IMG-0165.webp",
    "https://i.postimg.cc/LhdKSNFH/IMG-0164.webp",
  ];
  let current = 0;

  function updateSlide() {
    openingImage.src = slides[current];

    prevBtn.style.visibility = current === 0 ? "hidden" : "visible";

    nextBtn.textContent = current === slides.length - 1 ? "ホームへ" : "次へ →";
  }

  prevBtn.addEventListener("click", () => {
    if (current > 0) {
      current--;
      updateSlide();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (current < slides.length - 1) {
      current++;
      updateSlide();
    } else {
      opening.classList.add("hidden");
      localStorage.setItem("visited", "true");
    }
  });

  // 初回だけ表示
  if (!localStorage.getItem("visited")) {
    opening.classList.remove("hidden");
  }

  // ?ボタンで再表示
  if (helpBtn) {
    helpBtn.addEventListener("click", () => {
      opening.classList.remove("hidden");
      current = 0;
      updateSlide();
    });
  }

  updateSlide();
});

const yearGalleryData = {
  2021: [
    "https://i.postimg.cc/B6ZyHtGR/IMG-0208.webp",
    "https://i.postimg.cc/6Q6JLMrb/IMG-0210.webp",
    "https://i.postimg.cc/nL5xFvmG/IMG-0299.webp",
    "https://i.postimg.cc/Qdyw1jdR/IMG-0300.webp",
    "https://i.postimg.cc/fyffKfjF/IMG-0209.webp",
  ],

  2022: [
    "https://i.postimg.cc/ydPThTTk/IMG-0301.jpg",
    "https://i.postimg.cc/fT6Y9FNw/IMG-0302.jpg",
    "https://i.postimg.cc/fbbXnh7y/IMG-0303.jpg",
    "https://i.postimg.cc/7h4Z438r/IMG-0304.webp",
    "https://i.postimg.cc/bwSc6ZWs/IMG-0305.webp",
    "https://i.postimg.cc/VNPTDDXg/IMG-0306.webp",
    "https://i.postimg.cc/6q8Y9vdn/IMG-0307.webp",
    "https://i.postimg.cc/sXXJchHT/IMG-0308.webp",
    "https://i.postimg.cc/k40fg5ww/IMG-0310.webp",
    "https://i.postimg.cc/5y5q9SX3/IMG-0311.webp",
    "https://i.postimg.cc/MHtMrPcC/IMG-0312.webp",
  ],

  2023: [
    "https://i.postimg.cc/fL1DWY66/IMG-0313.webp",
    "https://i.postimg.cc/MGTSysxZ/IMG-0252.webp",
    "https://i.postimg.cc/0NZTj7Jt/IMG-0249.webp",
    "https://i.postimg.cc/FsmwyPgD/IMG-0314.webp",
    "https://i.postimg.cc/BbCY70cd/IMG-0315.webp",
    "https://i.postimg.cc/sXdTVXn2/IMG-0251.webp",
    "https://i.postimg.cc/B642Y1Yf/IMG-0316.webp",
    "https://i.postimg.cc/kX6RycJx/IMG-0317.webp",
    "https://i.postimg.cc/2SYv8WYb/IMG-0318.webp",
    "https://i.postimg.cc/mkxkpx2Y/IMG-0319.webp",
    "https://i.postimg.cc/k5B5nM2F/IMG-0320.webp",
  ],

  2024: [
    "https://i.postimg.cc/Jhcf9RpJ/IMG-0250.webp",
    "https://i.postimg.cc/kgPh9k6k/IMG-0248.webp",
    "https://i.postimg.cc/jdyYz6yZ/IMG-0247.webp",
    "https://i.postimg.cc/NGr3c8CL/IMG-0198.webp",
    "https://i.postimg.cc/5NVRWhFk/IMG-0257.webp",
    "https://i.postimg.cc/508SPtp2/IMG-0196.webp",
    "https://i.postimg.cc/Jn3jN27S/IMG-0243.webp",
    "https://i.postimg.cc/pTvFLJQq/IMG-0231.webp",
    "https://i.postimg.cc/NFzFm6T2/IMG-0197.webp",
    "https://i.postimg.cc/15V5bNwv/IMG-0253.webp",
    "https://i.postimg.cc/tgBjsXWK/IMG-0240.webp",
    "https://i.postimg.cc/Fsbs9XC9/IMG-0232.webp",
    "https://i.postimg.cc/VLf2CyLQ/IMG-0246.webp",
    "https://i.postimg.cc/L5HQLfSk/IMG-0234.webp",
    "https://i.postimg.cc/BvrdLXtY/IMG-0262.webp",
  ],

  2025: [
    "https://i.postimg.cc/qMr3rTXY/IMG-0201.webp",
    "https://i.postimg.cc/d36tvzw9/IMG-0226.webp",
    "https://i.postimg.cc/m2KKkmk6/IMG-0229.webp",
    "https://i.postimg.cc/28LXsnG0/IMG-0223.webp",
    "https://i.postimg.cc/Vs2c0fH4/IMG-0225.webp",
    "https://i.postimg.cc/wTDnthNH/IMG-0227.webp",
    "https://i.postimg.cc/CMkcJwx4/IMG-0221.webp",
    "https://i.postimg.cc/jSpW8Y5Q/IMG-0245.webp",
    "https://i.postimg.cc/HsjVdk8P/IMG-0244.webp",
    "https://i.postimg.cc/wTSTzcdC/IMG-0260.webp",
    "https://i.postimg.cc/HnFHpHFP/IMG-0215.webp",
    "https://i.postimg.cc/Hxh12dYv/IMG-0216.webp",
    "https://i.postimg.cc/FHVRxd26/IMG-0220.webp",
    "https://i.postimg.cc/brnYSsxg/IMG-0217.webp",
    "https://i.postimg.cc/yYFYV3Yn/IMG-0218.webp",
    "https://i.postimg.cc/QCcsxvD2/IMG-0219.webp",
    "https://i.postimg.cc/zvwZ1WSL/IMG-0239.webp",
    "https://i.postimg.cc/Gmg0rbYJ/IMG-0238.webp",
    "https://i.postimg.cc/QCJPzDhc/IMG-0222.webp",
    "https://i.postimg.cc/7LJRk0qr/IMG-0199.webp",
    "https://i.postimg.cc/7ZdBmh0C/IMG-0205.webp",
    "https://i.postimg.cc/Y2RbTbQ2/IMG-0256.webp",
    "https://i.postimg.cc/hjr1WtQS/IMG-0241.webp",
    "https://i.postimg.cc/J4tcvmrV/IMG-0236.webp",
    "https://i.postimg.cc/DZ21g3jL/IMG-0237.webp",
  ],

  2026: [
    "https://i.postimg.cc/L8xSYkzg/IMG-0202.webp",
    "https://i.postimg.cc/vBDyM4jp/IMG-0206.webp",
    "https://i.postimg.cc/P5Vqcs5b/IMG-0394.webp",
    "https://i.postimg.cc/BZ5n31vB/IMG-0393.webp",
    "https://i.postimg.cc/V6QzQYQq/IMG-0391.webp",
    "https://i.postimg.cc/9QD2D4cy/IMG-0392.webp",
  ],
};

const yearModal = document.getElementById("yearGalleryModal");
const yearBox = document.getElementById("yearGalleryImages");

document.querySelectorAll(".year-gallery-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const year = btn.dataset.year;
    yearBox.innerHTML = "";

    yearGalleryData[year].forEach((src) => {
      const img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      yearBox.appendChild(img);
    });

    yearModal.classList.remove("hidden");
  });
});

document.getElementById("closeYearGallery").onclick = () =>
  yearModal.classList.add("hidden");
