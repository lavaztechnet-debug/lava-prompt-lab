// Drawer controls

function openDrawer() {
  document.getElementById("drawer").classList.add("drawer-open");
  document.getElementById("backdrop").classList.add("backdrop-visible");
}

function closeDrawer() {
  document.getElementById("drawer").classList.remove("drawer-open");
  document.getElementById("backdrop").classList.remove("backdrop-visible");
}

// Section switching

function switchSection(sectionId) {
  document
    .querySelectorAll(".section")
    .forEach(sec => sec.classList.remove("section-active"));

  const section = document.getElementById(sectionId);
  if (section) section.classList.add("section-active");

  document
    .querySelectorAll(".drawer-link")
    .forEach(btn => btn.classList.remove("drawer-link-active"));

  const activeButton = document.querySelector(
    `.drawer-link[data-section="${sectionId}"]`
  );
  if (activeButton) activeButton.classList.add("drawer-link-active");

  closeDrawer();
}

// Prompt builder

function buildPrompt() {
  const model = document.getElementById("modelSelect").value;
  const style = document.getElementById("styleSelect").value;
  const task = document.getElementById("taskSelect").value;
  const tone = document.getElementById("toneSelect").value;
  const goal = document.getElementById("goalInput").value.trim();
  const constraints = document.getElementById("constraintsInput").value.trim();

  const lines = [];

  lines.push("SYSTEM / ROLE:");
  if (style === "cinematic-8k") {
    lines.push(
      "- Act as a cinematic 8K visual synthesizer with volumetric lighting, high contrast, and physically grounded detail."
    );
  } else if (style === "system-architect") {
    lines.push(
      "- Act as a senior Android / web systems architect focused on APK builds, CI/CD, and performance."
    );
  } else if (style === "horror-archivist") {
    lines.push(
      "- Act as a horror and found-footage archivist, mapping lore, tension, and visual language."
    );
  } else if (style === "nashville") {
    lines.push(
      "- Act as a Nashville producer, arranging, annotating, and structuring sessions and tracks."
    );
  }

  lines.push("");
  lines.push("TARGET MODEL FAMILY:");
  lines.push(`- Target: ${model}`);

  lines.push("");
  lines.push("PRIMARY TASK:");
  lines.push(`- Task archetype: ${task}`);

  lines.push("");
  lines.push("TONE / STYLE:");
  lines.push(`- Tone: ${tone}`);

  if (goal) {
    lines.push("");
    lines.push("USER GOAL / CONTEXT:");
    lines.push(goal);
  }

  if (constraints) {
    lines.push("");
    lines.push("CONSTRAINTS / HARD RULES:");
    lines.push(constraints);
  }

  lines.push("");
  lines.push("OUTPUT FORMAT:");
  lines.push("- Use clear headings and bullet points.");
  lines.push("- Keep steps explicit and actionable.");
  lines.push("- Explain tradeoffs when proposing options.");

  const finalPrompt = lines.join("\n");
  const out = document.getElementById("promptOutput");
  out.value = finalPrompt;

  maybeAutosaveDraft();
}

// Prompt actions

function copyPrompt() {
  const text = document.getElementById("promptOutput").value;
  if (!text) return;
  navigator.clipboard
    .writeText(text)
    .catch(() => {
      // no-op, clipboard may be restricted
    });
}

function clearPrompt() {
  document.getElementById("promptOutput").value = "";
}

// Settings, theme, autosave

function switchTheme() {
  const theme = document.getElementById("themeSelect").value;
  document.body.classList.toggle("theme-light", theme === "light");
  saveLocal("lava_theme", theme);
}

function saveSettings() {
  const theme = document.getElementById("themeSelect").value;
  const defaultModel = document.getElementById("defaultModelSelect").value;
  const autosave = document.getElementById("autosaveSelect").value;

  saveLocal("lava_theme", theme);
  saveLocal("lava_default_model", defaultModel);
  saveLocal("lava_autosave", autosave);
}

function maybeAutosaveDraft() {
  const autosave = loadLocal("lava_autosave", "on");
  if (autosave !== "on") return;

  const data = {
    model: document.getElementById("modelSelect").value,
    style: document.getElementById("styleSelect").value,
    task: document.getElementById("taskSelect").value,
    tone: document.getElementById("toneSelect").value,
    goal: document.getElementById("goalInput").value,
    constraints: document.getElementById("constraintsInput").value,
    prompt: document.getElementById("promptOutput").value
  };

  saveLocal("lava_draft", JSON.stringify(data));
}

function restoreDraft() {
  const raw = loadLocal("lava_draft", null);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (data.model) document.getElementById("modelSelect").value = data.model;
    if (data.style) document.getElementById("styleSelect").value = data.style;
    if (data.task) document.getElementById("taskSelect").value = data.task;
    if (data.tone) document.getElementById("toneSelect").value = data.tone;
    if (data.goal) document.getElementById("goalInput").value = data.goal;
    if (data.constraints)
      document.getElementById("constraintsInput").value = data.constraints;
    if (data.prompt)
      document.getElementById("promptOutput").value = data.prompt;
  } catch {
    // ignore
  }
}

// Local storage helpers

function saveLocal(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function loadLocal(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v;
  } catch {
    return fallback;
  }
}

// Initial bootstrap

document.addEventListener("DOMContentLoaded", () => {
  const theme = loadLocal("lava_theme", "dark");
  document.getElementById("themeSelect").value = theme;
  document.body.classList.toggle("theme-light", theme === "light");

  const defaultModel = loadLocal("lava_default_model", "gpt-4");
  document.getElementById("defaultModelSelect").value = defaultModel;
  document.getElementById("modelSelect").value = defaultModel;

  const autosave = loadLocal("lava_autosave", "on");
  document.getElementById("autosaveSelect").value = autosave;

  restoreDraft();
});

// Expose drawer funcs globally for inline handlers
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.switchSection = switchSection;
window.buildPrompt = buildPrompt;
window.copyPrompt = copyPrompt;
window.clearPrompt = clearPrompt;
window.switchTheme = switchTheme;
window.saveSettings = saveSettings;
