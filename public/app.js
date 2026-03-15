const previewEl = document.getElementById("preview");
const contentEl = document.getElementById("content");
const shareBtn = document.getElementById("shareBtn");
const shareResult = document.getElementById("shareResult");
const shareLink = document.getElementById("shareLink");
const copyBtn = document.getElementById("copyBtn");
const themeSelector = document.getElementById("themeSelector");
const socialShareBtn = document.getElementById("socialShareBtn");
const socialShareModal = document.getElementById("socialShareModal");
const closeModal = document.getElementById("closeModal");
const localizedPlatforms = {
  zh: ["wechat", "qq", "weibo"],
  other: ["twitter", "facebook", "telegram"]
};
const EDITOR_CACHE_KEY = "editor_cache_key";
const EDITOR_SESSION_KEY = "editor_session_active";

// 跟踪用户是否已经开始编辑内容
let hasUserEdited = false;

function getDefaultContent() {
  return window.I18n?.t("defaultContent") || "";
}

function getCachedEditorContent() {
  try {
    return localStorage.getItem(EDITOR_CACHE_KEY);
  } catch (err) {
    console.error("读取编辑器缓存失败:", err);
    return null;
  }
}

function saveEditorCache(content) {
  try {
    localStorage.setItem(EDITOR_CACHE_KEY, content);
  } catch (err) {
    console.error("保存编辑器缓存失败:", err);
  }
}

function clearEditorCache() {
  try {
    localStorage.removeItem(EDITOR_CACHE_KEY);
  } catch (err) {
    console.error("清除编辑器缓存失败:", err);
  }
}

function isExistingEditorSession() {
  try {
    return sessionStorage.getItem(EDITOR_SESSION_KEY) === "1";
  } catch (err) {
    console.error("读取编辑器会话状态失败:", err);
    return false;
  }
}

function markEditorSessionActive() {
  try {
    sessionStorage.setItem(EDITOR_SESSION_KEY, "1");
  } catch (err) {
    console.error("记录编辑器会话状态失败:", err);
  }
}

function initializeEditorContent() {
  const isExistingSession = isExistingEditorSession();
  const cachedContent = getCachedEditorContent();

  if (!isExistingSession) {
    clearEditorCache();
  }

  if (isExistingSession && cachedContent !== null) {
    contentEl.value = cachedContent;
    hasUserEdited = true;
  } else {
    contentEl.value = getDefaultContent();
    hasUserEdited = false;
  }

  markEditorSessionActive();
  renderPreview();
}

// 初始化多语言支持 - 等待 DOM 和所有脚本加载完成
document.addEventListener("DOMContentLoaded", function() {
  if (window.I18n) {
    // 设置当前语言并更新页面
    const savedLang = localStorage.getItem("language") || window.I18n.detectLanguage();
    window.I18n.setLanguage(savedLang);
    window.I18n.updatePageLanguage();
    updateVisibleSocialButtons();

    // 监听语言选择器变化
    const selector = document.getElementById("languageSelector");
    if (selector) {
      selector.value = window.I18n.currentLang;
      selector.addEventListener("change", function(e) {
        window.I18n.setLanguage(e.target.value);
        window.I18n.updatePageLanguage();
        updateVisibleSocialButtons();

        // 如果用户还没有编辑过内容，更新编辑框的默认内容
        if (!hasUserEdited) {
          contentEl.value = getDefaultContent();
          renderPreview();
        }
      });
    }
  }

  initializeEditorContent();
});

// 主题切换
const themeColors = ["day", "night", "ocean", "ember", "citrus", "forest", "ink", "rose"];
const themeStorageKey = "themeColor";
const themeStorageFallbackKey = "theme-color";

const baseDayVars = {
  "bg": "#f6f2ec",
  "panel": "#fffaf3",
  "ink": "#2b221c",
  "accent": "#0f6b6b",
  "accent-dark": "#0a5151",
  "accent-shadow": "rgba(15, 107, 107, 0.25)",
  "muted": "#7a6a5f",
  "border": "#e3d8cd",
  "shadow": "rgba(26, 18, 12, 0.08)",
  "input-bg": "#ffffff",
  "code-bg": "#f3ebe0",
  "bg-glow-1": "#faf5ed",
  "bg-glow-2": "#f1e5d8"
};

const nightVars = {
  "bg": "#161616",
  "panel": "#262626",
  "ink": "#e6e6e6",
  "muted": "#a6a6a6",
  "border": "#3b3b3b",
  "shadow": "rgba(0, 0, 0, 0.35)",
  "input-bg": "#262626",
  "code-bg": "#3a3a3a",
  "accent": "#63c7c0",
  "accent-dark": "#4aa9a3",
  "accent-shadow": "rgba(99, 199, 192, 0.28)",
  "bg-glow-1": "#1f1f1f",
  "bg-glow-2": "#232323"
};

const accentThemes = {
  day: {
    "accent": "#0f6b6b",
    "accent-dark": "#0a5151",
    "accent-shadow": "rgba(15, 107, 107, 0.25)"
  },
  night: {
    "accent": "#63c7c0",
    "accent-dark": "#4aa9a3",
    "accent-shadow": "rgba(99, 199, 192, 0.28)"
  },
  ocean: {
    "accent": "#1a6fa0",
    "accent-dark": "#145580",
    "accent-shadow": "rgba(26, 111, 160, 0.25)"
  },
  ember: {
    "accent": "#c45a2c",
    "accent-dark": "#a0441f",
    "accent-shadow": "rgba(196, 90, 44, 0.25)"
  },
  citrus: {
    "accent": "#b8860b",
    "accent-dark": "#8b6a08",
    "accent-shadow": "rgba(184, 134, 11, 0.25)"
  },
  forest: {
    "accent": "#2f6b4f",
    "accent-dark": "#24533d",
    "accent-shadow": "rgba(47, 107, 79, 0.25)"
  },
  ink: {
    "accent": "#2d5b9a",
    "accent-dark": "#224373",
    "accent-shadow": "rgba(45, 91, 154, 0.25)"
  },
  rose: {
    "accent": "#b8455e",
    "accent-dark": "#8e3247",
    "accent-shadow": "rgba(184, 69, 94, 0.25)"
  }
};

function setCssVars(vars) {
  Object.entries(vars).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--${key}`, value);
  });
}

function applyThemeColor(color) {
  const safeColor = themeColors.includes(color) ? color : "day";
  const baseVars = safeColor === "night" ? nightVars : baseDayVars;
  setCssVars(baseVars);
  const accentVars = accentThemes[safeColor] || accentThemes.day;
  if (accentVars) {
    setCssVars(accentVars);
  }
  document.body.dataset.themeColor = safeColor;
  document.documentElement.dataset.themeColor = safeColor;
  if (themeSelector && themeSelector.value !== safeColor) {
    themeSelector.value = safeColor;
  }
}

function setThemeColor(color) {
  const safeColor = themeColors.includes(color) ? color : "day";
  applyThemeColor(safeColor);
  localStorage.setItem(themeStorageKey, safeColor);
  localStorage.setItem(themeStorageFallbackKey, safeColor);
}

function initTheme() {
  const savedColor =
    localStorage.getItem(themeStorageKey) ||
    localStorage.getItem(themeStorageFallbackKey) ||
    "day";
  applyThemeColor(savedColor);
}

initTheme();
if (themeSelector) {
  themeSelector.addEventListener("change", (e) => {
    setThemeColor(e.target.value);
  });
  themeSelector.addEventListener("input", (e) => {
    setThemeColor(e.target.value);
  });
}

window.addEventListener("storage", (e) => {
  if ((e.key === themeStorageKey || e.key === themeStorageFallbackKey) && e.newValue) {
    applyThemeColor(e.newValue);
  }
});


// 触摸手势支持
let lastTouchEnd = 0;
document.addEventListener("touchend", (e) => {
  const now = Date.now();
  if (now - lastTouchEnd < 300) {
    // 双击放大
    if (e.target.closest(".preview-body")) {
      togglePreviewZoom(e.target.closest(".preview-body"));
    }
  }
  lastTouchEnd = now;
}, false);

function togglePreviewZoom(element) {
  if (element.style.fontSize === "18px") {
    element.style.fontSize = "14px";
  } else {
    element.style.fontSize = "18px";
  }
}

// 社交媒体分享
function openSocialShare() {
  socialShareModal.classList.remove("hidden");
}

function closeSocialShare() {
  socialShareModal.classList.add("hidden");
}

socialShareBtn.addEventListener("click", openSocialShare);
closeModal.addEventListener("click", closeSocialShare);
socialShareModal.addEventListener("click", (e) => {
  if (e.target === socialShareModal) {
    closeSocialShare();
  }
});

Array.from(document.querySelectorAll(".social-btn")).forEach((btn) => {
  btn.addEventListener("click", async () => {
    const platform = btn.dataset.platform;
    const url = shareLink.href || location.href;
    const title = window.I18n?.t("查看我的 Markdown 分享") || "查看我的 Markdown 分享";
    await shareToSocial(platform, url, title);
  });
});

function updateVisibleSocialButtons() {
  const socialButtons = Array.from(document.querySelectorAll(".social-btn"));
  const currentLang = window.I18n?.currentLang || localStorage.getItem("language") || "en";
  const visiblePlatforms = new Set(
    currentLang === "zh" ? localizedPlatforms.zh : localizedPlatforms.other
  );

  socialButtons.forEach((btn) => {
    const platform = btn.dataset.platform;
    const shouldHide = !visiblePlatforms.has(platform);
    btn.hidden = shouldHide;
  });
}

function openShareWindow(shareUrl) {
  window.open(shareUrl, "_blank", "noopener,noreferrer");
}

async function shareToSocial(platform, url, title) {
  const shareUrls = {
    wechat: async () => {
      // 微信需要复制链接
      const copied = await copyToClipboard(url);
      if (copied) {
        alert(window.I18n?.t("链接已复制，请在微信中粘贴分享") || "链接已复制，请在微信中粘贴分享");
      }
    },
    qq: () => {
      openShareWindow(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
    },
    weibo: () => {
      openShareWindow(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`);
    },
    twitter: () => {
      openShareWindow(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
    },
    facebook: () => {
      openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    },
    telegram: () => {
      openShareWindow(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
    }
  };

  if (shareUrls[platform]) {
    await shareUrls[platform]();
    closeSocialShare();
  }
}

// Debounce preview rendering to avoid excessive updates during fast typing
let _previewDebounceTimer;
contentEl.addEventListener("input", function() {
  hasUserEdited = true;
  saveEditorCache(contentEl.value);

  clearTimeout(_previewDebounceTimer);
  _previewDebounceTimer = setTimeout(() => {
    renderPreview();
  }, 300);
});

shareBtn.addEventListener("click", async () => {
  shareBtn.disabled = true;
  shareBtn.textContent = window.I18n?.t("生成中...") || "生成中...";
  shareResult.hidden = true;

  try {
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: contentEl.value })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || (window.I18n?.t("分享失败") || "分享失败"));
    }

    const data = await res.json();
    const fullUrl = `${location.origin}${data.url}`;
    clearEditorCache();
    shareLink.textContent = fullUrl;
    shareLink.href = fullUrl;
    shareResult.hidden = false;
  } catch (err) {
    alert(err.message || (window.I18n?.t("分享失败") || "分享失败"));
  } finally {
    shareBtn.disabled = false;
    shareBtn.textContent = window.I18n?.t("分享") || "分享";
  }
});

copyBtn.addEventListener("click", async () => {
  const text = shareLink.textContent;
  if (!text) return;

  // 优先使用现代 API，失败时降级到传统方法
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      showCopySuccess();
    } else {
      fallbackCopy(text);
    }
  } catch (err) {
    // HTTPS 环境可能也不允许，使用降级方案
    fallbackCopy(text);
  }
});

function showCopySuccess() {
  copyBtn.textContent = window.I18n?.t("已复制") || "已复制";
  setTimeout(() => {
    copyBtn.textContent = window.I18n?.t("复制") || "复制";
  }, 1200);
}

function fallbackCopy(text) {
  // 创建临时 textarea
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);

  try {
    textarea.select();
    const success = document.execCommand("copy");
    if (success) {
      showCopySuccess();
    } else {
      alert(window.I18n?.t("复制失败，请手动复制链接") || "复制失败，请手动复制链接");
    }
  } catch (err) {
    console.error("复制失败:", err);
    alert(window.I18n?.t("复制失败，请手动复制链接") || "复制失败，请手动复制链接");
  } finally {
    document.body.removeChild(textarea);
  }
}

// 供社交媒体分享使用
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (!success) {
        throw new Error("copy command failed");
      }
    }
    return true;
  } catch (err) {
    console.error("复制失败:", err);
    alert(window.I18n?.t("复制失败，请手动复制链接") || "复制失败，请手动复制链接");
    return false;
  }
}

// Render Markdown preview locally using marked + DOMPurify (no server round-trip)
function renderPreview() {
  try {
    const rawHtml = marked.parse(contentEl.value || "");
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    previewEl.innerHTML = cleanHtml;
  } catch (err) {
    console.error("Preview render failed:", err);
  }
}
