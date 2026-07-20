/**
 * Mask Off — site-wide theme & preferences (localStorage)
 */
(function (global) {
  const PREFIX = "maskoff-";
  const KEYS = {
    theme: PREFIX + "theme",
    accent: PREFIX + "accent",
    notifications: PREFIX + "notifications",
    autorefresh: PREFIX + "autorefresh",
    animations: PREFIX + "animations",
    compact: PREFIX + "compact",
    username: PREFIX + "username",
    email: PREFIX + "email",
  };

  const ThemeConfig = {
    default: {
      "--accent": "#5e3c66",
      "--accent-dark": "#4a2f52",
      "--accent-soft": "#f3e8ff",
      "--primary": "#5e3c66",
      "--primary-light": "#7a5b82",
      "--primary-dark": "#4a2f52",
      "--primary-soft": "#f3e8ff",
      "--bg": "#f6f7fb",
      "--surface": "#ffffff",
      "--card": "#ffffff",
      "--text": "#1f2937",
      "--muted": "#64748b",
      "--border": "#e5e7eb",
      "--panel": "#f4f6fb",
      "--nav-bg": "#5e3c66",
      "--white": "#ffffff",
      "--shadow": "0 16px 40px rgba(94, 60, 102, 0.12)",
      "--link": "#5e3c66",
      "--button-bg": "#5e3c66",
      "--button-text": "#ffffff",
    },
    dark: {
      "--accent": "#a78bfa",
      "--accent-dark": "#7c3aed",
      "--accent-soft": "#2e1065",
      "--primary": "#a78bfa",
      "--primary-light": "#c4b5fd",
      "--primary-dark": "#1e1b4b",
      "--primary-soft": "#312e81",
      "--bg": "#0f1419",
      "--surface": "#171c24",
      "--card": "#1c2330",
      "--text": "#e8eef7",
      "--muted": "#94a3b8",
      "--border": "#2d3748",
      "--panel": "#151b24",
      "--nav-bg": "#111827",
      "--white": "#ffffff",
      "--shadow": "0 20px 50px rgba(0, 0, 0, 0.45)",
      "--link": "#c4b5fd",
      "--button-bg": "#7c3aed",
      "--button-text": "#ffffff",
    },
    neon: {
      "--accent": "#22d3ee",
      "--accent-dark": "#0891b2",
      "--accent-soft": "#083344",
      "--primary": "#22d3ee",
      "--primary-light": "#67e8f9",
      "--primary-dark": "#0f172a",
      "--primary-soft": "#164e63",
      "--bg": "#030712",
      "--surface": "#0b1224",
      "--card": "#0f172a",
      "--text": "#e0f2fe",
      "--muted": "#94a3b8",
      "--border": "#155e75",
      "--panel": "#0b1628",
      "--nav-bg": "#0c4a6e",
      "--white": "#ffffff",
      "--shadow": "0 0 40px rgba(34, 211, 238, 0.18)",
      "--link": "#22d3ee",
      "--button-bg": "#06b6d4",
      "--button-text": "#0f172a",
    },
    calm: {
      "--accent": "#2563eb",
      "--accent-dark": "#1d4ed8",
      "--accent-soft": "#dbeafe",
      "--primary": "#2563eb",
      "--primary-light": "#60a5fa",
      "--primary-dark": "#1e40af",
      "--primary-soft": "#dbeafe",
      "--bg": "#f8fafc",
      "--surface": "#ffffff",
      "--card": "#ffffff",
      "--text": "#0f172a",
      "--muted": "#475569",
      "--border": "#cbd5e1",
      "--panel": "#f1f5f9",
      "--nav-bg": "#2563eb",
      "--white": "#ffffff",
      "--shadow": "0 16px 40px rgba(37, 99, 235, 0.14)",
      "--link": "#2563eb",
      "--button-bg": "#2563eb",
      "--button-text": "#ffffff",
    },
    rose: {
      "--accent": "#e11d48",
      "--accent-dark": "#be123c",
      "--accent-soft": "#ffe4e6",
      "--primary": "#e11d48",
      "--primary-light": "#fb7185",
      "--primary-dark": "#9f1239",
      "--primary-soft": "#ffe4e6",
      "--bg": "#fff1f2",
      "--surface": "#ffffff",
      "--card": "#ffffff",
      "--text": "#1f2937",
      "--muted": "#6b7280",
      "--border": "#fecdd3",
      "--panel": "#fff7f8",
      "--nav-bg": "#be123c",
      "--white": "#ffffff",
      "--shadow": "0 16px 40px rgba(225, 29, 72, 0.14)",
      "--link": "#e11d48",
      "--button-bg": "#e11d48",
      "--button-text": "#ffffff",
    },
    forest: {
      "--accent": "#059669",
      "--accent-dark": "#047857",
      "--accent-soft": "#d1fae5",
      "--primary": "#059669",
      "--primary-light": "#34d399",
      "--primary-dark": "#065f46",
      "--primary-soft": "#d1fae5",
      "--bg": "#f0fdf4",
      "--surface": "#ffffff",
      "--card": "#ffffff",
      "--text": "#14532d",
      "--muted": "#4b5563",
      "--border": "#bbf7d0",
      "--panel": "#ecfdf5",
      "--nav-bg": "#047857",
      "--white": "#ffffff",
      "--shadow": "0 16px 40px rgba(5, 150, 105, 0.14)",
      "--link": "#059669",
      "--button-bg": "#059669",
      "--button-text": "#ffffff",
    },
  };

  let autoRefreshTimer = null;
  let toastRoot = null;

  function storageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function storageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  }

  function getToggle(name) {
    const key = KEYS[name];
    const val = storageGet(key);
    if (val === null && name === "animations") return true;
    return val === "true";
  }

  function setToggle(name, checked) {
    storageSet(KEYS[name], checked ? "true" : "false");
    applyBehavior();
    global.dispatchEvent(
      new CustomEvent("maskoff:preference-changed", { detail: { name, checked } })
    );
  }

  function applyTheme(themeName) {
    const theme = ThemeConfig[themeName] || ThemeConfig.default;
    const root = document.documentElement;
    Object.entries(theme).forEach(([prop, value]) => {
      root.style.setProperty(prop, value);
    });
    root.dataset.theme = themeName;
    root.classList.add("maskoff-themed");
    storageSet(KEYS.theme, themeName);

    const accent = storageGet(KEYS.accent);
    if (accent) applyAccent(accent, false);

    const select = document.getElementById("themeSelect");
    if (select && select.value !== themeName) select.value = themeName;
  }

  function applyAccent(color, persist = true) {
    if (!color) return;
    const root = document.documentElement;
    root.style.setProperty("--accent", color);
    root.style.setProperty("--button-bg", color);
    root.style.setProperty("--nav-bg", color);
    root.style.setProperty("--primary", color);
    root.style.setProperty("--link", color);
    if (persist) storageSet(KEYS.accent, color);

    document.querySelectorAll(".accent-swatch").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.accentColor === color);
    });
  }

  function applyBehavior() {
    const root = document.documentElement;
    const notifications = getToggle("notifications");
    const autorefresh = getToggle("autorefresh");
    const animations = getToggle("animations");
    const compact = getToggle("compact");

    root.classList.toggle("maskoff-notifications", notifications);
    root.classList.toggle("maskoff-notifications-live", notifications);
    root.classList.toggle("maskoff-autorefresh", autorefresh);
    root.classList.toggle("maskoff-animations", animations);
    root.classList.toggle("maskoff-no-animations", !animations);
    root.classList.toggle("maskoff-compact", compact);

    syncSettingsUI();
    updateSettingsVisualState();
    setupAutoRefresh();
  }

  function getDashboardTarget() {
    const path = global.location.pathname.toLowerCase();
    if (path.includes(".php")) {
      return path.includes("/templates/") ? "dashboard.php" : "/dashboard.php";
    }
    return "/";
  }

  function isOnDashboardPage() {
    const path = global.location.pathname.replace(/\/+$/, "");
    return (
      path.endsWith("/dashboard.php") ||
      path.endsWith("/dashboard") ||
      path === "" ||
      path === "/"
    );
  }

  function setupLogoNavigation() {
    const logoRoots = Array.from(document.querySelectorAll(".logo, .logo-container"));
    if (!logoRoots.length) return;

    const target = getDashboardTarget();
    logoRoots.forEach((root) => {
      root.style.cursor = "pointer";
      root.addEventListener("click", (event) => {
        event.preventDefault();
        if (isOnDashboardPage()) {
          global.location.reload();
          return;
        }
        global.location.href = target;
      });
    });
  }

  function syncSettingsUI() {
    const map = {
      notificationsToggle: "notifications",
      autorefreshToggle: "autorefresh",
      animationsToggle: "animations",
      compactToggle: "compact",
    };
    Object.entries(map).forEach(([id, name]) => {
      const el = document.getElementById(id);
      if (el) el.checked = getToggle(name);
    });
  }

  function ensureToastRoot() {
    if (toastRoot) return toastRoot;
    toastRoot = document.getElementById("maskoff-toast-root");
    if (!toastRoot) {
      toastRoot = document.createElement("div");
      toastRoot.id = "maskoff-toast-root";
      toastRoot.setAttribute("aria-live", "polite");
      document.body.appendChild(toastRoot);
    }
    return toastRoot;
  }

  function showToast(title, message, options = {}) {
    if (!getToggle("notifications") && !options.force) return;

    const root = ensureToastRoot();
    const toast = document.createElement("div");
    toast.className = "maskoff-toast";
    toast.innerHTML =
      '<div class="maskoff-toast-icon" aria-hidden="true">🔔</div>' +
      "<div><strong></strong><span></span></div>";
    toast.querySelector("strong").textContent = title;
    toast.querySelector("span").textContent = message || "";
    root.appendChild(toast);

    const duration = options.duration || 4500;
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(12px)";
      setTimeout(() => toast.remove(), 280);
    }, duration);
  }

  async function requestNotificationPermission() {
    if (!("Notification" in global)) {
      showToast("Notifications unavailable", "Your browser does not support desktop alerts.", {
        force: true,
      });
      return false;
    }
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") {
      showToast(
        "Notifications blocked",
        "Enable notifications in your browser site settings.",
        { force: true }
      );
      return false;
    }
    const result = await Notification.requestPermission();
    return result === "granted";
  }

  function showBrowserNotification(title, body) {
    if (!getToggle("notifications")) return;
    if ("Notification" in global && Notification.permission === "granted") {
      try {
        new Notification(title, { body, icon: "/static/final logo.png" });
      } catch {
        /* ignore */
      }
    }
    showToast(title, body);
  }

  function setupAutoRefresh() {
    if (autoRefreshTimer) {
      clearInterval(autoRefreshTimer);
      autoRefreshTimer = null;
    }
    if (!getToggle("autorefresh")) return;

    const onHistory =
      /history/i.test(global.location.pathname) ||
      document.body.classList.contains("page-history");
    if (!onHistory) return;

    autoRefreshTimer = setInterval(() => {
      global.dispatchEvent(new CustomEvent("maskoff:history-refresh"));
      if (document.querySelector("[data-maskoff-live-history]")) {
        document.querySelector("[data-maskoff-live-history]").dispatchEvent(
          new Event("refresh")
        );
      } else {
        showToast("History updated", "Refreshing detection history…", { duration: 2500 });
        global.location.reload();
      }
    }, 45000);
  }

  function loadAll() {
    const themeName = storageGet(KEYS.theme) || "default";
    applyTheme(themeName);
    const accent = storageGet(KEYS.accent);
    if (accent) applyAccent(accent, false);
    applyBehavior();
  }

  function getSettings() {
    return {
      theme: storageGet(KEYS.theme) || "default",
      accent: storageGet(KEYS.accent) || "#5e3c66",
      notifications: getToggle("notifications"),
      autorefresh: getToggle("autorefresh"),
      animations: getToggle("animations"),
      compact: getToggle("compact"),
      username: storageGet(KEYS.username) || "",
      email: storageGet(KEYS.email) || "",
    };
  }

  function savePreferences(prefs) {
    if (prefs.theme) applyTheme(prefs.theme);
    if (prefs.accent) applyAccent(prefs.accent);
    if (typeof prefs.notifications === "boolean") {
      setToggle("notifications", prefs.notifications);
    }
    if (typeof prefs.autorefresh === "boolean") {
      setToggle("autorefresh", prefs.autorefresh);
    }
    if (typeof prefs.animations === "boolean") {
      setToggle("animations", prefs.animations);
    }
    if (typeof prefs.compact === "boolean") {
      setToggle("compact", prefs.compact);
    }
  }

  /** Preserve theme keys when logging out */
  function clearSessionStorageOnly() {
    const preserved = {};
    Object.values(KEYS).forEach((key) => {
      preserved[key] = storageGet(key);
    });
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
    Object.entries(preserved).forEach(([key, val]) => {
      if (val !== null) storageSet(key, val);
    });
    loadAll();
  }

  function migrateLegacyAccountKeys() {
    try {
      const legacyName = localStorage.getItem("maskoff_display_name");
      const legacyEmail = localStorage.getItem("maskoff_display_email");
      if (legacyName && !storageGet(KEYS.username)) storageSet(KEYS.username, legacyName);
      if (legacyEmail && !storageGet(KEYS.email)) storageSet(KEYS.email, legacyEmail);
    } catch {
      /* ignore */
    }
  }

  function getDisplayName(fallback) {
    const saved = storageGet(KEYS.username);
    return saved || fallback || "";
  }

  async function populateAccountFields() {
    migrateLegacyAccountKeys();
    const usernameInput = document.getElementById("usernameInput");
    const emailInput = document.getElementById("emailInput");
    if (usernameInput) usernameInput.value = storageGet(KEYS.username) || "";
    if (emailInput) emailInput.value = storageGet(KEYS.email) || "";

    try {
      const res = await fetch("/api/check-session", { credentials: "same-origin" });
      const data = await res.json();
      if (data.logged_in) {
        if (usernameInput && !usernameInput.value.trim() && data.name) {
          usernameInput.value = data.name;
        }
        if (emailInput && !emailInput.value.trim() && data.email) {
          emailInput.value = data.email;
        }
      }
    } catch {
      /* ignore */
    }
  }

  function bindSettingsPage() {
    const themeSelect = document.getElementById("themeSelect");
    const accentButtons = document.querySelectorAll(".accent-swatch");
    const toggles = [
      ["notificationsToggle", "notifications"],
      ["autorefreshToggle", "autorefresh"],
      ["animationsToggle", "animations"],
      ["compactToggle", "compact"],
    ];

    if (themeSelect) {
      themeSelect.value = storageGet(KEYS.theme) || "default";
      themeSelect.addEventListener("change", (e) => {
        applyTheme(e.target.value);
        updateSettingsStatus();
      });
    }

    accentButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        applyAccent(btn.dataset.accentColor);
        updateSettingsStatus();
      });
    });

    toggles.forEach(([id, name]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.checked = getToggle(name);
      el.addEventListener("change", async () => {
        if (name === "notifications" && el.checked) {
          await requestNotificationPermission();
        }
        setToggle(name, el.checked);
        if (name === "notifications" && el.checked) {
          showToast(
            "Notifications enabled",
            "You will see alerts when scans complete and history updates.",
            { force: true, duration: 5500 }
          );
          showBrowserNotification(
            "Mask Off notifications",
            "Alerts are on. Run a detection to see a sample alert."
          );
        }
        updateSettingsStatus();
        updateSettingsVisualState();
      });
    });

    const saveAccountBtn = document.getElementById("saveAccountBtn");
    if (saveAccountBtn) {
      saveAccountBtn.addEventListener("click", () => {
        const username = document.getElementById("usernameInput");
        const email = document.getElementById("emailInput");
        const nameVal = username ? username.value.trim() : "";
        const emailVal = email ? email.value.trim() : "";

        if (!nameVal && !emailVal) {
          showToast("Missing info", "Enter a display name or email.", { force: true });
          return;
        }

        if (username) storageSet(KEYS.username, nameVal);
        if (email) storageSet(KEYS.email, emailVal);

        const note = document.getElementById("accountSavedNote");
        if (note) {
          note.textContent = nameVal
            ? `Saved — dashboard will greet you as “${nameVal}”.`
            : "Saved — email updated on this device.";
          note.classList.add("is-saved");
        }

        showToast(
          "Account saved",
          nameVal ? `Display name: ${nameVal}` : "Email updated on this device.",
          { force: true }
        );

        global.dispatchEvent(
          new CustomEvent("maskoff:account-updated", {
            detail: { name: nameVal, email: emailVal },
          })
        );
        updateSettingsStatus();
      });
    }

    populateAccountFields();

    const accent = storageGet(KEYS.accent) || "#5e3c66";
    applyAccent(accent, false);
    updateSettingsStatus();
    updateSettingsVisualState();
  }

  function updateSettingsStatus() {
    const el = document.getElementById("settingsLiveStatus");
    if (!el) return;
    const s = getSettings();
    el.classList.toggle("is-live", s.notifications);
    if (s.username) {
      el.textContent = `Display name: ${s.username}`;
    } else if (s.notifications) {
      el.textContent = "Notifications active — scan alerts enabled";
    } else if (s.autorefresh || s.animations || s.compact) {
      const parts = [];
      if (s.autorefresh) parts.push("Auto-refresh");
      if (s.animations) parts.push("Animations");
      if (s.compact) parts.push("Compact");
      el.textContent = parts.join(" · ") + " enabled";
    } else {
      el.textContent = "Default experience — turn on notifications for scan alerts";
    }
  }

  function updateSettingsVisualState() {
    const map = {
      notificationsToggle: "notifications",
      autorefreshToggle: "autorefresh",
      animationsToggle: "animations",
      compactToggle: "compact",
    };
    Object.entries(map).forEach(([id, name]) => {
      const input = document.getElementById(id);
      if (!input) return;
      const row = input.closest(".toggle-row");
      if (row) row.classList.toggle("is-on", getToggle(name));
    });

    const notifPanel = document.getElementById("notificationsActivePanel");
    if (notifPanel) {
      notifPanel.hidden = !getToggle("notifications");
    }

    const bell = document.getElementById("settingsNotifBell");
    if (bell) {
      bell.hidden = !getToggle("notifications");
    }
  }

  global.addEventListener("storage", (e) => {
    if (e.key && e.key.startsWith(PREFIX)) loadAll();
  });

  global.addEventListener("DOMContentLoaded", () => {
    loadAll();
    bindSettingsPage();
    setupLogoNavigation();
    setupAutoRefresh();

    if (getToggle("notifications") && "Notification" in global && Notification.permission === "default") {
      /* don't prompt until user enables */
    }
  });

  global.MaskOff = {
    KEYS,
    ThemeConfig,
    applyTheme,
    applyAccent,
    getToggle,
    setToggle,
    getSettings,
    getDisplayName,
    savePreferences,
    loadAll,
    showToast,
    notify: showBrowserNotification,
    clearSessionStorageOnly,
    requestNotificationPermission,
    updateSettingsVisualState,
  };

  loadAll();
})(window);
