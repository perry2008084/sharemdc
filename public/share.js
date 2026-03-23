const previewEl = document.getElementById("preview");
const metaEl = document.getElementById("meta");
const themeSelector = document.getElementById("themeSelector");
const socialShareBtn = document.getElementById("socialShareBtn");
const socialShareModal = document.getElementById("socialShareModal");
const closeModal = document.getElementById("closeModal");
const exportBtn = document.getElementById("exportBtn");
const localizedPlatforms = {
  zh: ["wechat", "qq", "weibo"],
  other: ["twitter", "facebook", "telegram"]
};

// 存储加载的 Markdown 内容（用于导出）
let loadedMarkdownContent = "";

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
      });
    }
  }

  // 初始化导出按钮
  if (exportBtn && window.ExportModule) {
    exportBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      const filename = `shared-${id}`;
      window.ExportModule.showExportMenu(
        this,
        loadedMarkdownContent,
        previewEl,
        filename,
        function() {
          // 菜单关闭回调
        }
      );
    });
  }

  // 加载分享内容
  loadShare();
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

document.querySelectorAll(".social-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    const platform = btn.dataset.platform;
    const url = location.href;
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

const parts = location.pathname.split("/");
const id = parts[parts.length - 1];

async function loadShare() {
  try {
    const res = await fetch(`/api/share/${id}`);
    if (!res.ok) {
      throw new Error(window.I18n?.t("加载中...") || "加载中...");
    }
    const data = await res.json();
    // 保存 Markdown 内容用于导出
    loadedMarkdownContent = data.content;

    const previewRes = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: data.content })
    });
    const previewData = await previewRes.json();
    previewEl.innerHTML = previewData.html;
    const time = new Date(data.createdAt).toLocaleString();
    const shareText = window.I18n?.t("查看我的 Markdown 分享") || "查看我的 Markdown 分享";
    metaEl.textContent = `${shareText} · ${time}`;
  } catch (err) {
    metaEl.textContent = err.message || (window.I18n?.t("加载中...") || "加载中...");
  }
}

// 复制到剪贴板（供社交媒体分享使用）
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
