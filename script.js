// ----------------------------------------LIKE BUTTON - MANUAL FEATURE---------------------------------------------

const likeButtons = document.querySelectorAll(".like-btn");

function attachLikeButtonBehavior(button) {
  let liked = false;
  let count = parseInt(button.querySelector(".like-count").textContent);

  button.addEventListener("click", function () {
    const likeCount = button.querySelector(".like-count");

    liked = !liked;
    count += liked ? 1 : -1;

    // toggle color - color change using class instead of inline styles
    button.classList.toggle("liked");

    likeCount.textContent = count;

    // trigger heart burst ONLY when liking
    if (liked) {
      createHearts(button);
    }
  });
}

likeButtons.forEach((button) => {
  attachLikeButtonBehavior(button);
});

// // heart burst function when like button is clicked
function createHearts(button) {
  for (let i = 0; i < 6; i++) {
    const heart = document.createElement("span");

    heart.classList.add("heart-particle");
    heart.textContent = "❤️";

    // random direction
    const x = (Math.random() - 0.5) * 60 + "px";
    const y = (Math.random() - 0.5) * 60 + "px";

    heart.style.setProperty("--x", x);
    heart.style.setProperty("--y", y);

    // position from center of button
    heart.style.left = "10%";
    heart.style.top = "0%";

    button.appendChild(heart);

    // remove after animation
    setTimeout(() => {
      heart.remove();
    }, 600);
  }
}

// -------------------------------------TWEET MODAL POP UP + PUBLISH TWEET - AI FEATURE 1-------------------------------//

// Tweet modal + publish flow
const postTrigger = document.getElementById("post-trigger");
const modalOverlay = document.getElementById("tweet-modal-overlay");
const modalClose = document.getElementById("tweet-modal-close");
const modalCancel = document.getElementById("tweet-modal-cancel");
const modalInput = document.getElementById("tweet-modal-input");
const modalPost = document.getElementById("tweet-modal-post");
const charCounter = document.getElementById("tweet-char-counter");
const userFeedInsert = document.getElementById("user-feed-insert");
const inlineComposerInput = document.querySelector(".tweet-box .prompt-input");
const inlineComposerPost = document.querySelector(".tweet-box .post-button button");

function openTweetModal() {
  if (!modalOverlay) return;

  modalOverlay.classList.add("open");
  modalOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  setTimeout(() => {
    modalInput?.focus();
  }, 50);
}

function closeTweetModal() {
  if (!modalOverlay) return;

  modalOverlay.classList.remove("open");
  modalOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function updateComposerState() {
  if (!modalInput || !modalPost || !charCounter) return;

  const remaining = 280 - modalInput.value.length;
  const isValid = modalInput.value.trim().length > 0 && remaining >= 0;

  charCounter.textContent = `${remaining}`;
  charCounter.style.color = remaining < 20 ? "#f4212e" : "#536471";
  modalPost.disabled = !isValid;
}

function updateInlineComposerState() {
  if (!inlineComposerInput || !inlineComposerPost) return;
  inlineComposerPost.disabled = inlineComposerInput.value.trim().length === 0;
}

function createTweetCard(tweetText) {
  if (!userFeedInsert) return;

  const wrapper = document.createElement("div");
  wrapper.className = "feed-container generated-tweet";
  wrapper.innerHTML = `
    <div class="profile-image feed-profile-image">
      <img src="resources/profile-img.png" alt="profile-picture">
    </div>
    <div class="feed-content">
      <div class="post-details">
        <div class="user-post-details">
          <a href="">Alyessa</a>
          <img src="resources/verified.svg" alt="verified">
          <span id="profile-tag" class="text-color">@Alyessa552983</span>
          <span class="text-color">·</span>
          <time>Now</time>
        </div>
        <div class="post-info-buttons generated-post-actions">
          <div class="tooltip post-button-tooltip">
            <button class="tweet-more-btn" aria-label="More">
              <svg viewBox="0 0 24 24" fill="#536471" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path>
              </svg>
            </button>
            <span class="tooltip-text">More</span>
          </div>
          <div class="tweet-more-menu" aria-hidden="true">
            <button class="tweet-more-action" data-action="edit">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 2.33H5v-.92l9.06-9.06.92.92L5.92 19.58zM20.71 7.04a1.003 1.003 0 000-1.42L18.37 3.29a1.003 1.003 0 00-1.42 0l-1.24 1.24 3.75 3.75 1.25-1.24z"></path>
              </svg>
              <span>Edit</span>
            </button>
            <button class="tweet-more-action danger" data-action="delete">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M9 3h6l1 1h4v2H4V4h4l1-1zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9zm-1 12h12a2 2 0 002-2V7H4v12a2 2 0 002 2z"></path>
              </svg>
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
      <div class="post-caption">
        <span>${escapeHtml(tweetText)}</span>
      </div>
      <div class="post-stats">
        <button class="post-stats-items reply-hover generated-stat-btn" data-stat="reply">
          <div class="tooltip stat-tooltip">
            <svg viewBox="0 0 24 24" fill="#536471" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path>
            </svg>
            <span class="tooltip-text">Reply</span>
          </div>
          <span class="stat-value" data-count>0</span>
        </button>
        <button class="post-stats-items repost-hover generated-stat-btn" data-stat="repost">
          <div class="tooltip stat-tooltip">
            <svg viewBox="0 0 24 24" fill="#536471" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
            </svg>
            <span class="tooltip-text">Repost</span>
          </div>
          <span class="stat-value" data-count>0</span>
        </button>
        <button class="post-stats-items like-hover like-btn">
          <div class="tooltip stat-tooltip">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
            </svg>
            <span class="tooltip-text">Like</span>
          </div>
          <span class="stat-value like-count">0</span>
        </button>
        <button class="post-stats-items view-hover generated-stat-btn" data-stat="view">
          <div class="tooltip stat-tooltip">
            <svg viewBox="0 0 24 24" fill="#536471" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z"></path>
            </svg>
            <span class="tooltip-text">View</span>
          </div>
          <span class="stat-value" data-count>0</span>
        </button>
        <div class="post-stats-items save-icons">
          <button class="generated-icon-btn" aria-label="Bookmark">
            <div class="tooltip stat-tooltip">
              <svg viewBox="0 0 24 24" fill="#536471" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path>
              </svg>
              <span class="tooltip-text">Bookmark</span>
            </div>
          </button>
          <button class="generated-icon-btn" aria-label="Share">
            <div class="tooltip stat-tooltip">
              <svg viewBox="0 0 24 24" fill="#536471" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path>
              </svg>
              <span class="tooltip-text">Share</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  `;

  userFeedInsert.prepend(wrapper);
  const generatedLikeButton = wrapper.querySelector(".like-btn");
  if (generatedLikeButton) {
    attachLikeButtonBehavior(generatedLikeButton);
  }
}

function publishTweet(tweetText, options = {}) {
  const { closeModalAfterPublish = false } = options;
  const trimmedTweet = tweetText.trim();
  if (!trimmedTweet) return false;

  createTweetCard(trimmedTweet);

  if (closeModalAfterPublish) {
    closeTweetModal();
  }

  return true;
}

if (postTrigger) {
  postTrigger.addEventListener("click", (event) => {
    event.preventDefault();
    openTweetModal();
  });
}

if (modalClose) {
  modalClose.addEventListener("click", closeTweetModal);
}

if (modalCancel) {
  modalCancel.addEventListener("click", closeTweetModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeTweetModal();
    }
  });
}

if (modalInput) {
  modalInput.addEventListener("input", updateComposerState);
  modalInput.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && !modalPost.disabled) {
      modalPost.click();
    }
  });
}

if (modalPost) {
  modalPost.addEventListener("click", () => {
    if (!modalInput) return;

    const wasPublished = publishTweet(modalInput.value, { closeModalAfterPublish: true });
    if (!wasPublished) return;

    modalInput.value = "";
    updateComposerState();
  });
}

if (inlineComposerInput) {
  inlineComposerInput.addEventListener("input", updateInlineComposerState);
  inlineComposerInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!inlineComposerPost?.disabled) {
        inlineComposerPost.click();
      }
    }
  });
}

if (inlineComposerPost) {
  inlineComposerPost.addEventListener("click", () => {
    if (!inlineComposerInput) return;

    const wasPublished = publishTweet(inlineComposerInput.value);
    if (!wasPublished) return;

    inlineComposerInput.value = "";
    updateInlineComposerState();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalOverlay?.classList.contains("open")) {
    closeTweetModal();
  }
});

document.addEventListener("click", (event) => {
  const moreButton = event.target.closest(".tweet-more-btn");
  if (moreButton) {
    const actionContainer = moreButton.closest(".generated-post-actions");
    const menu = actionContainer?.querySelector(".tweet-more-menu");
    if (!menu) return;

    const isOpen = menu.classList.contains("open");
    document.querySelectorAll(".tweet-more-menu.open").forEach((openMenu) => {
      openMenu.classList.remove("open");
      openMenu.setAttribute("aria-hidden", "true");
    });

    if (!isOpen) {
      menu.classList.add("open");
      menu.setAttribute("aria-hidden", "false");
    }
    return;
  }

  const menuAction = event.target.closest(".tweet-more-action");
  if (menuAction) {
    const card = menuAction.closest(".generated-tweet");
    const caption = card?.querySelector(".post-caption span");
    const action = menuAction.dataset.action;

    if (!card || !caption) return;
    if (action === "delete") {
      card.remove();
      return;
    }

    if (action === "edit") {
      const updated = window.prompt("Edit your post:", caption.textContent || "");
      if (updated !== null && updated.trim()) {
        caption.textContent = updated.trim();
      }
      const menu = menuAction.closest(".tweet-more-menu");
      if (menu) {
        menu.classList.remove("open");
        menu.setAttribute("aria-hidden", "true");
      }
    }
    return;
  }

  if (!event.target.closest(".generated-post-actions")) {
    document.querySelectorAll(".tweet-more-menu.open").forEach((openMenu) => {
      openMenu.classList.remove("open");
      openMenu.setAttribute("aria-hidden", "true");
    });
  }
});

document.addEventListener("click", (event) => {
  const statButton = event.target.closest(".generated-stat-btn");
  if (!statButton) return;

  const countTarget = statButton.querySelector("[data-count]");
  if (!countTarget) return;

  let count = parseInt(countTarget.textContent, 10) || 0;
  const statType = statButton.dataset.stat;

  if (statType === "repost") {
    const isReposted = statButton.classList.toggle("active-repost");
    count += isReposted ? 1 : -1;
  } else {
    count += 1;
  }

  countTarget.textContent = `${Math.max(0, count)}`;
});

updateComposerState();
updateInlineComposerState();


// -----------------------------------------EXPLORE PAGE - AI FEATURE 2---------------------------------------------------//

// Explore page: tab links scroll to sections; sync active tab with URL hash
(function initExploreTabs() {
  const tabs = document.querySelectorAll(".explore-tab");
  if (!tabs.length) return;

  function setActiveFromHash() {
    let hash = window.location.hash;
    if (!hash || hash === "#") {
      hash = "#explore-for-you";
    }
    tabs.forEach((tab) => {
      const href = tab.getAttribute("href") || "";
      tab.classList.toggle("active", href === hash);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      window.requestAnimationFrame(setActiveFromHash);
    });
  });

  window.addEventListener("hashchange", setActiveFromHash);
  setActiveFromHash();
})();


// Interactive page search (live suggestions + keyboard support)
(function initInteractiveSearch() {
  const searchForms = document.querySelectorAll(".search-bar, .explore-search-pill");
  if (!searchForms.length) return;

  function buildSearchIndex() {
    const sources = [
      { selector: "nav .nav-items span", type: "Menu" },
      { selector: ".explore-tab", type: "Tab" },
      { selector: "#timeline-feeds .user-post-details a:first-of-type", type: "Account" },
      { selector: "#timeline-feeds .post-caption span", type: "Post" },
      { selector: "#timeline-feeds .article-title span", type: "News" },
      { selector: "#timeline-feeds .hashtag span", type: "Trending" },
      { selector: "#timeline-feeds .account-name a", type: "Who to follow" },
      { selector: "#sidebar .article-title span", type: "News" },
      { selector: "#sidebar .hashtag span", type: "Trending" },
      { selector: "#sidebar .account-name a", type: "Who to follow" },
      { selector: "#sidebar footer a", type: "Footer" },
    ];

    const seen = new Set();
    const items = [];

    sources.forEach(({ selector, type }) => {
      document.querySelectorAll(selector).forEach((node) => {
        const label = (node.textContent || "").trim().replace(/\s+/g, " ");
        if (!label) return;

        const key = `${type}::${label.toLowerCase()}`;
        if (seen.has(key)) return;
        seen.add(key);

        const target =
          node.closest(
            "a, .feed-container, .article, .trending-topics, .account, .show-posts, .tweet-box, .todays-news, .whats-happening, .who-to-follow, .explore-header, .feeds-top-nav"
          ) || node;

        items.push({ label, type, target });
      });
    });

    return items;
  }

  let searchIndex = buildSearchIndex();
  let refreshTimer = null;
  function scheduleIndexRefresh() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      searchIndex = buildSearchIndex();
    }, 120);
  }

  const observerTarget = document.getElementById("timeline-feeds");
  if (observerTarget && "MutationObserver" in window) {
    const observer = new MutationObserver(scheduleIndexRefresh);
    observer.observe(observerTarget, { childList: true, subtree: true });
  }

  function scoreMatch(label, query) {
    const value = label.toLowerCase();
    const q = query.toLowerCase();
    const idx = value.indexOf(q);
    if (idx === -1) return Number.MAX_SAFE_INTEGER;
    return idx === 0 ? 0 : idx + 10;
  }

  function getMatches(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .map((item) => ({ item, rank: scoreMatch(item.label, q) }))
      .filter((entry) => entry.rank !== Number.MAX_SAFE_INTEGER)
      .sort((a, b) => a.rank - b.rank || a.item.label.length - b.item.label.length)
      .slice(0, 8)
      .map((entry) => entry.item);
  }

  let activeHit = null;
  function focusResult(item) {
    if (!item || !item.target) return;
    item.target.scrollIntoView({ behavior: "smooth", block: "center" });

    if (activeHit) activeHit.classList.remove("search-hit");
    activeHit = item.target;
    activeHit.classList.add("search-hit");
    setTimeout(() => {
      activeHit?.classList.remove("search-hit");
      activeHit = null;
    }, 1600);
  }

  searchForms.forEach((form, formIndex) => {
    const input = form.querySelector("input[type='search'], input[type='text']");
    if (!input) return;

    form.classList.add("interactive-search");
    const dropdown = document.createElement("ul");
    dropdown.className = "search-suggestions";
    dropdown.setAttribute("role", "listbox");
    dropdown.id = `search-suggestions-${formIndex}`;
    dropdown.hidden = true;
    form.appendChild(dropdown);

    const liveRegion = document.createElement("div");
    liveRegion.className = "visually-hidden";
    liveRegion.setAttribute("aria-live", "polite");
    form.appendChild(liveRegion);

    input.setAttribute("autocomplete", "off");
    input.setAttribute("aria-haspopup", "listbox");
    input.setAttribute("aria-controls", dropdown.id);
    input.setAttribute("aria-expanded", "false");

    let matches = [];
    let activeIndex = -1;

    function closeDropdown() {
      dropdown.hidden = true;
      input.setAttribute("aria-expanded", "false");
      activeIndex = -1;
      input.removeAttribute("aria-activedescendant");
    }

    function openDropdown() {
      dropdown.hidden = false;
      input.setAttribute("aria-expanded", "true");
    }

    function render() {
      dropdown.innerHTML = "";
      if (!matches.length) {
        closeDropdown();
        return;
      }

      matches.forEach((item, index) => {
        const option = document.createElement("li");
        option.className = "search-suggestion-item";
        option.id = `${dropdown.id}-option-${index}`;
        option.setAttribute("role", "option");
        option.setAttribute("aria-selected", index === activeIndex ? "true" : "false");
        if (index === activeIndex) option.classList.add("active");

        option.innerHTML = `<span class="search-suggestion-label">${item.label}</span><span class="search-suggestion-meta">${item.type}</span>`;
        option.addEventListener("mousedown", (event) => {
          event.preventDefault();
          input.value = item.label;
          closeDropdown();
          focusResult(item);
        });
        dropdown.appendChild(option);
      });

      if (activeIndex >= 0) {
        input.setAttribute("aria-activedescendant", `${dropdown.id}-option-${activeIndex}`);
      } else {
        input.removeAttribute("aria-activedescendant");
      }
      openDropdown();
    }

    function runSearch() {
      const value = input.value;
      form.classList.toggle("is-typing", value.trim().length > 0);
      matches = getMatches(value);
      activeIndex = matches.length ? 0 : -1;
      render();
      liveRegion.textContent = matches.length
        ? `${matches.length} suggestions available.`
        : "No suggestions.";
    }

    input.addEventListener("focus", () => {
      if (input.value.trim()) runSearch();
    });

    input.addEventListener("input", runSearch);

    input.addEventListener("keydown", (event) => {
      if (!matches.length) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        activeIndex = (activeIndex + 1) % matches.length;
        render();
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        activeIndex = (activeIndex - 1 + matches.length) % matches.length;
        render();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const selected = matches[Math.max(0, activeIndex)];
        if (!selected) return;
        input.value = selected.label;
        closeDropdown();
        focusResult(selected);
        return;
      }

      if (event.key === "Escape") {
        closeDropdown();
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!matches.length) return;
      const selected = matches[Math.max(0, activeIndex)];
      if (!selected) return;
      input.value = selected.label;
      closeDropdown();
      focusResult(selected);
    });

    document.addEventListener("click", (event) => {
      if (!form.contains(event.target)) {
        closeDropdown();
      }
    });
  });
})();

// -----------------------------------------------------------------------------------------------------------------------//


