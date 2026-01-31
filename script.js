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
      songs.forEach((s) => s.classList.remove("open"));
      song.classList.toggle("open");
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
    const name = member.textContent;

    document.querySelectorAll(".song").forEach((song) => {
      song.style.display = songs.includes(song.dataset.song) ? "block" : "none";
    });

    closeMemberModal();

    document.getElementById("heroTitle").textContent = name;
    document.getElementById("hellow").innerHTML = "▶ この部員の出演曲を表示中";
  });
});

/* ===============================
   SEARCH モーダル
================================ */
const searchBtn = document.getElementById("searchBtn");
const searchModal = document.getElementById("searchModal");
const closeSearch = document.getElementById("closeSearch");

searchBtn.addEventListener("click", () => {
  searchModal.classList.remove("hidden");
});

closeSearch.addEventListener("click", () => {
  searchModal.classList.add("hidden");
});

searchModal.addEventListener("click", (e) => {
  if (e.target === searchModal) searchModal.classList.add("hidden");
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

    const ok =
      (!grade || text.startsWith(grade)) &&
      (!cls || text.includes(cls + "組")) &&
      (!name || text.includes(name));

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
  const text = item.textContent;

  searchModal.classList.add("hidden");

  // --- 学年判定 ---
  const grade = text.charAt(0); // "3普10組..." → "3"

  // 1・2年なら第1部だけに固定
  if (grade === "1" || grade === "2") {
    document.querySelector('[data-target="concert6"]').click();
    document.querySelector('[data-target="graduation11"]').style.display =
      "none";
  } else {
    // 3年 or 不明 → 両方OK
    document.querySelector('[data-target="graduation11"]').style.display = "";
  }

  // 曲フィルタ
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
   HOME
================================ */
const homeBtn = document.querySelector(".nav-left span:nth-child(2)");

homeBtn.addEventListener("click", () => {
  document.querySelector('[data-target="graduation11"]').style.display = "";
  document.querySelectorAll(".song").forEach((song) => {
    song.style.display = "block";
  });

  document.getElementById("hellow").textContent = "The 6th Annual Concert of";
  document.getElementById("heroTitle").textContent = "SHIENRAKU";
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
