(function () {
  "use strict";

  const FIELD_TYPES = [
    "text", "email", "tel", "password", "number", "url", "search",
    "date", "time", "month", "week", "datetime-local",
    "color", "range", "textarea", "select", "checkbox", "radio"
  ];

  const MATCH_METHODS = [
    { value: "id", label: "ID" },
    { value: "name", label: "Name" },
    { value: "label", label: "Label text" },
    { value: "aria-label", label: "aria-label" },
    { value: "aria-labelledby", label: "aria-labelledby" },
    { value: "class", label: "Class" },
    { value: "placeholder", label: "Placeholder" },
  ];

  let settings = null;
  let saveTimeout = null;

  // ── Load / Save ────────────────────────────────────────────────────

  async function loadSettings() {
    const data = await browser.storage.local.get("settings");
    settings = data.settings || getDefaultSettings();
    render();
  }

  function getDefaultSettings() {
    return {
      fieldTypeDefaults: {
        text:     { enabled: true, value: "Test User",              isExpression: false },
        email:    { enabled: true, value: "test@example.com",       isExpression: false },
        tel:      { enabled: true, value: "+1-555-000-1234",        isExpression: false },
        number:   { enabled: true, value: "42",                     isExpression: false },
        url:      { enabled: true, value: "https://example.com",    isExpression: false },
        date:     { enabled: true, value: "2025-01-15",             isExpression: false },
        textarea: { enabled: true, value: "Sample text for testing.", isExpression: false },
        select:   { enabled: true, value: "",                       isExpression: false },
        checkbox: { enabled: true, value: "true",                   isExpression: false },
        radio:    { enabled: true, value: "",                       isExpression: false },
        password: { enabled: true, value: "TestPass123!",           isExpression: false },
        search:   { enabled: true, value: "search query",           isExpression: false },
        color:    { enabled: true, value: "#3366cc",                isExpression: false },
        range:    { enabled: true, value: "50",                     isExpression: false },
        time:     { enabled: true, value: "12:00",                  isExpression: false },
        month:    { enabled: true, value: "2025-01",                isExpression: false },
        week:     { enabled: true, value: "2025-W03",               isExpression: false },
        "datetime-local": { enabled: true, value: "2025-01-15T12:00", isExpression: false },
      },
      randomFallback: true,
      customRules: []
    };
  }

  function scheduleSave() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      await browser.storage.local.set({ settings });
      showStatus("Settings saved");
    }, 400);
  }

  function showStatus(msg) {
    const el = document.getElementById("status");
    el.textContent = msg;
    el.classList.add("visible");
    setTimeout(() => el.classList.remove("visible"), 2000);
  }

  // ── Render ─────────────────────────────────────────────────────────

  function render() {
    renderGlobalOptions();
    renderTypeDefaults();
    renderCustomRules();
  }

  function renderGlobalOptions() {
    const cb = document.getElementById("randomFallback");
    cb.checked = settings.randomFallback;
    cb.addEventListener("change", () => {
      settings.randomFallback = cb.checked;
      scheduleSave();
    });
  }

  function renderTypeDefaults() {
    const tbody = document.querySelector("#typeDefaults tbody");
    tbody.innerHTML = "";

    for (const type of FIELD_TYPES) {
      // Ensure the type exists in settings
      if (!settings.fieldTypeDefaults[type]) {
        settings.fieldTypeDefaults[type] = { enabled: true, value: "", isExpression: false };
      }

      const def = settings.fieldTypeDefaults[type];
      const tr = document.createElement("tr");

      // Enabled
      const tdEnabled = document.createElement("td");
      tdEnabled.className = "col-enabled";
      const enabledCb = document.createElement("input");
      enabledCb.type = "checkbox";
      enabledCb.checked = def.enabled;
      enabledCb.addEventListener("change", () => {
        def.enabled = enabledCb.checked;
        scheduleSave();
      });
      tdEnabled.appendChild(enabledCb);

      // Type label
      const tdType = document.createElement("td");
      tdType.className = "col-type";
      tdType.textContent = type;

      // Value
      const tdValue = document.createElement("td");
      tdValue.className = "col-value";
      const valueInput = document.createElement("input");
      valueInput.type = "text";
      valueInput.value = def.value;
      valueInput.placeholder = type === "select" || type === "radio" ? "(empty = random)" : "value or JS expression";
      valueInput.addEventListener("input", () => {
        def.value = valueInput.value;
        scheduleSave();
      });
      tdValue.appendChild(valueInput);

      // Expression toggle
      const tdExpr = document.createElement("td");
      tdExpr.className = "col-expr";
      const exprCb = document.createElement("input");
      exprCb.type = "checkbox";
      exprCb.checked = def.isExpression;
      exprCb.title = "Evaluate as JavaScript expression";
      exprCb.addEventListener("change", () => {
        def.isExpression = exprCb.checked;
        scheduleSave();
      });
      tdExpr.appendChild(exprCb);

      tr.append(tdEnabled, tdType, tdValue, tdExpr);
      tbody.appendChild(tr);
    }
  }

  function renderCustomRules() {
    const container = document.getElementById("customRules");
    container.innerHTML = "";

    settings.customRules.forEach((rule, index) => {
      container.appendChild(createRuleCard(rule, index));
    });
  }

  function createRuleCard(rule, index) {
    const card = document.createElement("div");
    card.className = "rule-card";

    // Header
    const header = document.createElement("div");
    header.className = "rule-header";

    const headerLabel = document.createElement("label");
    const enabledCb = document.createElement("input");
    enabledCb.type = "checkbox";
    enabledCb.checked = rule.enabled;
    enabledCb.addEventListener("change", () => {
      rule.enabled = enabledCb.checked;
      scheduleSave();
    });
    headerLabel.append(enabledCb, "Rule #" + (index + 1));

    const actions = document.createElement("div");
    actions.className = "rule-actions";

    if (index > 0) {
      const upBtn = document.createElement("button");
      upBtn.className = "btn btn-sm btn-move";
      upBtn.textContent = "\u2191";
      upBtn.title = "Move up";
      upBtn.addEventListener("click", () => {
        [settings.customRules[index - 1], settings.customRules[index]] =
          [settings.customRules[index], settings.customRules[index - 1]];
        scheduleSave();
        renderCustomRules();
      });
      actions.appendChild(upBtn);
    }

    if (index < settings.customRules.length - 1) {
      const downBtn = document.createElement("button");
      downBtn.className = "btn btn-sm btn-move";
      downBtn.textContent = "\u2193";
      downBtn.title = "Move down";
      downBtn.addEventListener("click", () => {
        [settings.customRules[index], settings.customRules[index + 1]] =
          [settings.customRules[index + 1], settings.customRules[index]];
        scheduleSave();
        renderCustomRules();
      });
      actions.appendChild(downBtn);
    }

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      settings.customRules.splice(index, 1);
      scheduleSave();
      renderCustomRules();
    });
    actions.appendChild(delBtn);

    header.append(headerLabel, actions);

    // Fields grid
    const grid = document.createElement("div");
    grid.className = "rule-fields";

    // Match String
    grid.appendChild(createField("Match string", "text", rule.matchString, (val) => {
      rule.matchString = val;
      scheduleSave();
    }, "e.g. agree to terms"));

    // Match Method
    grid.appendChild(createSelectField("Match by", MATCH_METHODS, rule.matchMethod, (val) => {
      rule.matchMethod = val;
      scheduleSave();
    }));

    // Field Type
    const typeOptions = [{ value: "any", label: "Any type" }].concat(
      FIELD_TYPES.map((t) => ({ value: t, label: t }))
    );
    grid.appendChild(createSelectField("Field type", typeOptions, rule.fieldType || "any", (val) => {
      rule.fieldType = val;
      scheduleSave();
    }));

    // Value row
    const valueRow = document.createElement("div");
    valueRow.className = "rule-value-row";

    const valLabel = document.createElement("label");
    valLabel.textContent = "Value:";
    valLabel.style.fontSize = "12px";
    valLabel.style.color = "var(--text-secondary)";

    const valInput = document.createElement("input");
    valInput.type = "text";
    valInput.value = rule.value;
    valInput.placeholder = "value or JS expression";
    valInput.addEventListener("input", () => {
      rule.value = valInput.value;
      scheduleSave();
    });

    const jsLabel = document.createElement("label");
    const jsCb = document.createElement("input");
    jsCb.type = "checkbox";
    jsCb.checked = rule.isExpression;
    jsCb.addEventListener("change", () => {
      rule.isExpression = jsCb.checked;
      scheduleSave();
    });
    jsLabel.append(jsCb, "JS");

    valueRow.append(valLabel, valInput, jsLabel);

    card.append(header, grid, valueRow);
    return card;
  }

  function createField(label, type, value, onChange, placeholder) {
    const div = document.createElement("div");
    div.className = "rule-field";
    const lbl = document.createElement("label");
    lbl.textContent = label;
    const input = document.createElement("input");
    input.type = type;
    input.value = value || "";
    if (placeholder) input.placeholder = placeholder;
    input.addEventListener("input", () => onChange(input.value));
    div.append(lbl, input);
    return div;
  }

  function createSelectField(label, options, value, onChange) {
    const div = document.createElement("div");
    div.className = "rule-field";
    const lbl = document.createElement("label");
    lbl.textContent = label;
    const select = document.createElement("select");
    for (const opt of options) {
      const o = document.createElement("option");
      o.value = opt.value;
      o.textContent = opt.label;
      if (opt.value === value) o.selected = true;
      select.appendChild(o);
    }
    select.addEventListener("change", () => onChange(select.value));
    div.append(lbl, select);
    return div;
  }

  // ── Add Rule ───────────────────────────────────────────────────────

  document.getElementById("addRule").addEventListener("click", () => {
    settings.customRules.push({
      id: crypto.randomUUID(),
      enabled: true,
      matchString: "",
      matchMethod: "label",
      fieldType: "any",
      value: "",
      isExpression: false
    });
    scheduleSave();
    renderCustomRules();
    // Scroll to the new rule
    const container = document.getElementById("customRules");
    container.lastElementChild.scrollIntoView({ behavior: "smooth" });
  });

  // ── Init ───────────────────────────────────────────────────────────

  loadSettings();
})();
