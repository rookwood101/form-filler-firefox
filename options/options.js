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

  // All available generators with human-readable labels
  const GENERATORS = [
    { value: "",                label: "(none)" },
    { value: "title",           label: "Title (Mr/Mrs/Dr)" },
    { value: "firstName",       label: "First Name" },
    { value: "middleInitial",   label: "Middle Initial" },
    { value: "lastName",        label: "Last Name" },
    { value: "fullName",        label: "Full Name" },
    { value: "company",         label: "Company" },
    { value: "position",        label: "Position / Job Title" },
    { value: "address1",        label: "Address Line 1" },
    { value: "address2",        label: "Address Line 2" },
    { value: "city",            label: "City" },
    { value: "state",           label: "State (abbrev)" },
    { value: "stateFull",       label: "State (full)" },
    { value: "country",         label: "Country" },
    { value: "zip",             label: "Zip / Postal Code" },
    { value: "homePhone",       label: "Home Phone" },
    { value: "workPhone",       label: "Work Phone" },
    { value: "cellPhone",       label: "Cell Phone" },
    { value: "fax",             label: "Fax" },
    { value: "phone",           label: "Phone (generic)" },
    { value: "email",           label: "Email" },
    { value: "website",         label: "Website" },
    { value: "userId",          label: "User ID / Username" },
    { value: "password",        label: "Password" },
    { value: "creditCardType",  label: "Credit Card Type" },
    { value: "creditCardNumber",label: "Credit Card Number" },
    { value: "cvv",             label: "CVV / CVC" },
    { value: "cardExpiry",      label: "Card Expiry (MM/YY)" },
    { value: "cardExpiryDate",  label: "Card Expiry (YYYY-MM)" },
    { value: "cardHolderName",  label: "Card Holder Name" },
    { value: "cardBank",        label: "Card Issuing Bank" },
    { value: "cardServicePhone",label: "Card Service Phone" },
    { value: "sex",             label: "Sex / Gender" },
    { value: "ssn",             label: "SSN" },
    { value: "driverLicense",   label: "Driver License" },
    { value: "dateOfBirth",     label: "Date of Birth" },
    { value: "age",             label: "Age" },
    { value: "birthPlace",      label: "Birth Place" },
    { value: "income",          label: "Income" },
    { value: "comments",        label: "Comments / Message" },
    { value: "lorem",           label: "Lorem Ipsum" },
    { value: "number",          label: "Random Number" },
    { value: "url",             label: "Random URL" },
    { value: "text",            label: "Random Text" },
    { value: "date",            label: "Random Date" },
    { value: "time",            label: "Random Time" },
    { value: "color",           label: "Random Color" },
    { value: "month",           label: "Random Month" },
    { value: "week",            label: "Random Week" },
    { value: "datetimeLocal",   label: "Random DateTime" },
  ];

  // Name-based default fields grouped by category
  const NAME_DEFAULT_GROUPS = {
    personal: {
      targetId: "nameDefaultsPersonal",
      fields: [
        { key: "title",         label: "Title" },
        { key: "firstName",     label: "First Name" },
        { key: "middleInitial", label: "Middle Initial" },
        { key: "lastName",      label: "Last Name" },
        { key: "fullName",      label: "Full Name" },
        { key: "company",       label: "Company" },
        { key: "position",      label: "Position" },
      ]
    },
    address: {
      targetId: "nameDefaultsAddress",
      fields: [
        { key: "address1", label: "Address Line 1" },
        { key: "address2", label: "Address Line 2" },
        { key: "city",     label: "City" },
        { key: "state",    label: "State / Province" },
        { key: "country",  label: "Country" },
        { key: "zip",      label: "Zip / Postal Code" },
      ]
    },
    phone: {
      targetId: "nameDefaultsPhone",
      fields: [
        { key: "homePhone", label: "Home Phone" },
        { key: "workPhone", label: "Work Phone" },
        { key: "fax",       label: "Fax" },
        { key: "cellPhone", label: "Cell Phone" },
        { key: "phone",     label: "Phone (generic)" },
      ]
    },
    online: {
      targetId: "nameDefaultsOnline",
      fields: [
        { key: "email",    label: "Email" },
        { key: "website",  label: "Website" },
        { key: "userId",   label: "User ID" },
        { key: "password", label: "Password" },
      ]
    },
    payment: {
      targetId: "nameDefaultsPayment",
      fields: [
        { key: "creditCardType",   label: "Card Type" },
        { key: "creditCardNumber", label: "Card Number" },
        { key: "cvv",              label: "CVV / CVC" },
        { key: "cardExpiry",       label: "Card Expiry" },
        { key: "cardHolderName",   label: "Card Holder Name" },
        { key: "cardBank",         label: "Issuing Bank" },
        { key: "cardServicePhone", label: "Service Phone" },
      ]
    },
    identity: {
      targetId: "nameDefaultsIdentity",
      fields: [
        { key: "sex",           label: "Sex / Gender" },
        { key: "ssn",           label: "SSN" },
        { key: "driverLicense", label: "Driver License" },
        { key: "dateOfBirth",   label: "Date of Birth" },
        { key: "age",           label: "Age" },
        { key: "birthPlace",    label: "Birth Place" },
        { key: "income",        label: "Income" },
      ]
    },
    other: {
      targetId: "nameDefaultsOther",
      fields: [
        { key: "comments", label: "Comments / Message" },
      ]
    }
  };

  let settings = null;
  let saveTimeout = null;

  // ── Load / Save ────────────────────────────────────────────────────

  async function loadSettings() {
    const data = await browser.storage.local.get("settings");
    settings = data.settings || getDefaultSettings();

    // Ensure new fields exist for upgraded settings
    if (!settings.nameDefaults) settings.nameDefaults = getDefaultSettings().nameDefaults;
    if (settings.nameMatching === undefined) settings.nameMatching = true;
    if (!settings.presets) settings.presets = [];

    // Ensure all name default keys exist
    const defaults = getDefaultSettings().nameDefaults;
    for (const key of Object.keys(defaults)) {
      if (!settings.nameDefaults[key]) {
        settings.nameDefaults[key] = defaults[key];
      }
    }

    // Ensure generator field exists on fieldTypeDefaults
    for (const type of FIELD_TYPES) {
      if (settings.fieldTypeDefaults[type] && settings.fieldTypeDefaults[type].generator === undefined) {
        settings.fieldTypeDefaults[type].generator = "";
      }
    }

    render();
  }

  function getDefaultSettings() {
    return {
      fieldTypeDefaults: {
        text:     { enabled: true, value: "",              isExpression: false, generator: "" },
        email:    { enabled: true, value: "",              isExpression: false, generator: "email" },
        tel:      { enabled: true, value: "",              isExpression: false, generator: "phone" },
        number:   { enabled: true, value: "",              isExpression: false, generator: "number" },
        url:      { enabled: true, value: "",              isExpression: false, generator: "url" },
        date:     { enabled: true, value: "",              isExpression: false, generator: "date" },
        textarea: { enabled: true, value: "",              isExpression: false, generator: "lorem" },
        select:   { enabled: true, value: "",              isExpression: false, generator: "" },
        checkbox: { enabled: true, value: "true",          isExpression: false, generator: "" },
        radio:    { enabled: true, value: "",              isExpression: false, generator: "" },
        password: { enabled: true, value: "",              isExpression: false, generator: "password" },
        search:   { enabled: true, value: "search query",  isExpression: false, generator: "" },
        color:    { enabled: true, value: "",              isExpression: false, generator: "color" },
        range:    { enabled: true, value: "50",            isExpression: false, generator: "" },
        time:     { enabled: true, value: "",              isExpression: false, generator: "time" },
        month:    { enabled: true, value: "",              isExpression: false, generator: "month" },
        week:     { enabled: true, value: "",              isExpression: false, generator: "week" },
        "datetime-local": { enabled: true, value: "",      isExpression: false, generator: "datetimeLocal" },
      },
      nameMatching: true,
      nameDefaults: {
        title:            { enabled: true, value: "", generator: "title" },
        firstName:        { enabled: true, value: "", generator: "firstName" },
        middleInitial:    { enabled: true, value: "", generator: "middleInitial" },
        lastName:         { enabled: true, value: "", generator: "lastName" },
        fullName:         { enabled: true, value: "", generator: "fullName" },
        company:          { enabled: true, value: "", generator: "company" },
        position:         { enabled: true, value: "", generator: "position" },
        address1:         { enabled: true, value: "", generator: "address1" },
        address2:         { enabled: true, value: "", generator: "address2" },
        city:             { enabled: true, value: "", generator: "city" },
        state:            { enabled: true, value: "", generator: "state" },
        country:          { enabled: true, value: "", generator: "country" },
        zip:              { enabled: true, value: "", generator: "zip" },
        homePhone:        { enabled: true, value: "", generator: "homePhone" },
        workPhone:        { enabled: true, value: "", generator: "workPhone" },
        fax:              { enabled: true, value: "", generator: "fax" },
        cellPhone:        { enabled: true, value: "", generator: "cellPhone" },
        phone:            { enabled: true, value: "", generator: "phone" },
        email:            { enabled: true, value: "", generator: "email" },
        website:          { enabled: true, value: "", generator: "website" },
        userId:           { enabled: true, value: "", generator: "userId" },
        password:         { enabled: true, value: "", generator: "password" },
        creditCardType:   { enabled: true, value: "", generator: "creditCardType" },
        creditCardNumber: { enabled: true, value: "", generator: "creditCardNumber" },
        cvv:              { enabled: true, value: "", generator: "cvv" },
        cardExpiry:       { enabled: true, value: "", generator: "cardExpiry" },
        cardHolderName:   { enabled: true, value: "", generator: "cardHolderName" },
        cardBank:         { enabled: true, value: "", generator: "cardBank" },
        cardServicePhone: { enabled: true, value: "", generator: "cardServicePhone" },
        sex:              { enabled: true, value: "", generator: "sex" },
        ssn:              { enabled: true, value: "", generator: "ssn" },
        driverLicense:    { enabled: true, value: "", generator: "driverLicense" },
        dateOfBirth:      { enabled: true, value: "", generator: "dateOfBirth" },
        age:              { enabled: true, value: "", generator: "age" },
        birthPlace:       { enabled: true, value: "", generator: "birthPlace" },
        income:           { enabled: true, value: "", generator: "income" },
        comments:         { enabled: true, value: "", generator: "comments" },
      },
      randomFallback: true,
      customRules: [],
      presets: []
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
    renderNameDefaults();
    renderTypeDefaults();
    renderCustomRules();
    renderPresets();
  }

  function renderGlobalOptions() {
    const rfCb = document.getElementById("randomFallback");
    rfCb.checked = settings.randomFallback;
    rfCb.addEventListener("change", () => {
      settings.randomFallback = rfCb.checked;
      scheduleSave();
    });

    const nmCb = document.getElementById("nameMatching");
    nmCb.checked = settings.nameMatching;
    nmCb.addEventListener("change", () => {
      settings.nameMatching = nmCb.checked;
      scheduleSave();
    });
  }

  // ── Name Defaults ──────────────────────────────────────────────────

  function renderNameDefaults() {
    for (const [, group] of Object.entries(NAME_DEFAULT_GROUPS)) {
      const tbody = document.getElementById(group.targetId);
      tbody.innerHTML = "";
      for (const field of group.fields) {
        tbody.appendChild(createNameDefaultRow(field));
      }
    }
  }

  function createNameDefaultRow(field) {
    const def = settings.nameDefaults[field.key] || { enabled: true, value: "", generator: field.key };
    const tr = document.createElement("tr");

    // Enabled checkbox
    const tdEnabled = document.createElement("td");
    tdEnabled.className = "col-enabled";
    const enabledCb = document.createElement("input");
    enabledCb.type = "checkbox";
    enabledCb.checked = def.enabled;
    enabledCb.addEventListener("change", () => {
      def.enabled = enabledCb.checked;
      settings.nameDefaults[field.key] = def;
      scheduleSave();
    });
    tdEnabled.appendChild(enabledCb);

    // Label
    const tdLabel = document.createElement("td");
    tdLabel.className = "col-label";
    tdLabel.textContent = field.label;

    // Generator / Value
    const tdGen = document.createElement("td");
    tdGen.className = "col-generator";

    const wrapper = document.createElement("div");
    wrapper.className = "gen-value-wrapper";

    const genSelect = document.createElement("select");
    genSelect.className = "gen-select";
    for (const gen of GENERATORS) {
      const o = document.createElement("option");
      o.value = gen.value;
      o.textContent = gen.label;
      if (gen.value === (def.generator || "")) o.selected = true;
      genSelect.appendChild(o);
    }
    genSelect.addEventListener("change", () => {
      def.generator = genSelect.value;
      settings.nameDefaults[field.key] = def;
      // If generator is set, clear value
      if (genSelect.value) {
        def.value = "";
        valueInput.value = "";
      }
      scheduleSave();
    });

    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.value = def.value || "";
    valueInput.placeholder = "or fixed value";
    valueInput.className = "gen-value-input";
    valueInput.addEventListener("input", () => {
      def.value = valueInput.value;
      // If value is set, clear generator
      if (valueInput.value) {
        def.generator = "";
        genSelect.value = "";
      }
      settings.nameDefaults[field.key] = def;
      scheduleSave();
    });

    wrapper.append(genSelect, valueInput);
    tdGen.appendChild(wrapper);

    tr.append(tdEnabled, tdLabel, tdGen);
    return tr;
  }

  // ── Type Defaults ──────────────────────────────────────────────────

  function renderTypeDefaults() {
    const tbody = document.querySelector("#typeDefaults tbody");
    tbody.innerHTML = "";

    for (const type of FIELD_TYPES) {
      if (!settings.fieldTypeDefaults[type]) {
        settings.fieldTypeDefaults[type] = { enabled: true, value: "", isExpression: false, generator: "" };
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

      // Generator
      const tdGen = document.createElement("td");
      tdGen.className = "col-gen";
      const genSelect = document.createElement("select");
      genSelect.className = "gen-select";
      for (const gen of GENERATORS) {
        const o = document.createElement("option");
        o.value = gen.value;
        o.textContent = gen.label;
        if (gen.value === (def.generator || "")) o.selected = true;
        genSelect.appendChild(o);
      }
      genSelect.addEventListener("change", () => {
        def.generator = genSelect.value;
        scheduleSave();
      });
      tdGen.appendChild(genSelect);

      // Value
      const tdValue = document.createElement("td");
      tdValue.className = "col-value";
      const valueInput = document.createElement("input");
      valueInput.type = "text";
      valueInput.value = def.value;
      valueInput.placeholder = type === "select" || type === "radio" ? "(empty = random)" : "overrides generator";
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

      tr.append(tdEnabled, tdType, tdGen, tdValue, tdExpr);
      tbody.appendChild(tr);
    }
  }

  // ── Custom Rules ───────────────────────────────────────────────────

  function renderCustomRules() {
    const container = document.getElementById("customRules");
    container.innerHTML = "";
    settings.customRules.forEach((rule, index) => {
      container.appendChild(createRuleCard(rule, index, settings.customRules, renderCustomRules));
    });
  }

  function createRuleCard(rule, index, rulesArray, rerenderFn) {
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
        [rulesArray[index - 1], rulesArray[index]] =
          [rulesArray[index], rulesArray[index - 1]];
        scheduleSave();
        rerenderFn();
      });
      actions.appendChild(upBtn);
    }

    if (index < rulesArray.length - 1) {
      const downBtn = document.createElement("button");
      downBtn.className = "btn btn-sm btn-move";
      downBtn.textContent = "\u2193";
      downBtn.title = "Move down";
      downBtn.addEventListener("click", () => {
        [rulesArray[index], rulesArray[index + 1]] =
          [rulesArray[index + 1], rulesArray[index]];
        scheduleSave();
        rerenderFn();
      });
      actions.appendChild(downBtn);
    }

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      rulesArray.splice(index, 1);
      scheduleSave();
      rerenderFn();
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
    }, "e.g. agree_to_terms"));

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

    // Action
    const actionOptions = [
      { value: "fill", label: "Fill" },
      { value: "skip", label: "Skip (leave empty)" },
    ];
    grid.appendChild(createSelectField("Action", actionOptions, rule.action || "fill", (val) => {
      rule.action = val;
      scheduleSave();
      rerenderFn();
    }));

    // Value row (only show if action is "fill")
    if (rule.action !== "skip") {
      const valueRow = document.createElement("div");
      valueRow.className = "rule-value-row";

      const valLabel = document.createElement("label");
      valLabel.textContent = "Value:";
      valLabel.style.fontSize = "12px";
      valLabel.style.color = "var(--text-secondary)";

      // Generator select
      const genSelect = document.createElement("select");
      genSelect.className = "rule-gen-select";
      for (const gen of GENERATORS) {
        const o = document.createElement("option");
        o.value = gen.value;
        o.textContent = gen.label;
        if (gen.value === (rule.generator || "")) o.selected = true;
        genSelect.appendChild(o);
      }
      genSelect.addEventListener("change", () => {
        rule.generator = genSelect.value;
        scheduleSave();
      });

      const valInput = document.createElement("input");
      valInput.type = "text";
      valInput.value = rule.value;
      valInput.placeholder = "or static value / JS expression";
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

      valueRow.append(valLabel, genSelect, valInput, jsLabel);
      card.append(header, grid, valueRow);
    } else {
      card.append(header, grid);
    }

    return card;
  }

  // ── Website Presets ────────────────────────────────────────────────

  function renderPresets() {
    const container = document.getElementById("presets");
    container.innerHTML = "";
    settings.presets.forEach((preset, index) => {
      container.appendChild(createPresetCard(preset, index));
    });
  }

  function createPresetCard(preset, index) {
    const card = document.createElement("div");
    card.className = "preset-card";

    // Header
    const header = document.createElement("div");
    header.className = "preset-header";

    const headerLeft = document.createElement("div");
    headerLeft.className = "preset-header-left";

    const enabledCb = document.createElement("input");
    enabledCb.type = "checkbox";
    enabledCb.checked = preset.enabled;
    enabledCb.addEventListener("change", () => {
      preset.enabled = enabledCb.checked;
      scheduleSave();
    });

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = preset.name;
    nameInput.placeholder = "Preset name";
    nameInput.className = "preset-name-input";
    nameInput.addEventListener("input", () => {
      preset.name = nameInput.value;
      scheduleSave();
    });

    headerLeft.append(enabledCb, nameInput);

    const actions = document.createElement("div");
    actions.className = "rule-actions";

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => {
      settings.presets.splice(index, 1);
      scheduleSave();
      renderPresets();
    });
    actions.appendChild(delBtn);

    header.append(headerLeft, actions);

    // URL Pattern
    const urlRow = document.createElement("div");
    urlRow.className = "preset-url-row";
    const urlLabel = document.createElement("label");
    urlLabel.textContent = "URL Pattern:";
    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.value = preset.urlPattern;
    urlInput.placeholder = "e.g. *example.com* or *://shop.example.com/*";
    urlInput.className = "preset-url-input";
    urlInput.addEventListener("input", () => {
      preset.urlPattern = urlInput.value;
      scheduleSave();
    });
    urlRow.append(urlLabel, urlInput);

    // Rules for this preset
    const rulesSection = document.createElement("div");
    rulesSection.className = "preset-rules";

    const rulesLabel = document.createElement("div");
    rulesLabel.className = "preset-rules-label";
    rulesLabel.textContent = "Rules for this preset:";

    const rulesContainer = document.createElement("div");
    rulesContainer.className = "preset-rules-container";

    function renderPresetRules() {
      rulesContainer.innerHTML = "";
      preset.rules.forEach((rule, rIdx) => {
        rulesContainer.appendChild(createRuleCard(rule, rIdx, preset.rules, renderPresetRules));
      });
    }
    renderPresetRules();

    const addRuleBtn = document.createElement("button");
    addRuleBtn.className = "btn btn-add btn-sm";
    addRuleBtn.textContent = "+ Add Rule";
    addRuleBtn.addEventListener("click", () => {
      preset.rules.push({
        id: crypto.randomUUID(),
        enabled: true,
        matchString: "",
        matchMethod: "name",
        fieldType: "any",
        action: "fill",
        value: "",
        generator: "",
        isExpression: false
      });
      scheduleSave();
      renderPresetRules();
    });

    rulesSection.append(rulesLabel, rulesContainer, addRuleBtn);
    card.append(header, urlRow, rulesSection);
    return card;
  }

  // ── Shared UI Helpers ──────────────────────────────────────────────

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

  // ── Add Rule / Preset ─────────────────────────────────────────────

  document.getElementById("addRule").addEventListener("click", () => {
    settings.customRules.push({
      id: crypto.randomUUID(),
      enabled: true,
      matchString: "",
      matchMethod: "name",
      fieldType: "any",
      action: "fill",
      value: "",
      generator: "",
      isExpression: false
    });
    scheduleSave();
    renderCustomRules();
    const container = document.getElementById("customRules");
    container.lastElementChild.scrollIntoView({ behavior: "smooth" });
  });

  document.getElementById("addPreset").addEventListener("click", () => {
    settings.presets.push({
      id: crypto.randomUUID(),
      enabled: true,
      name: "New Preset",
      urlPattern: "",
      rules: []
    });
    scheduleSave();
    renderPresets();
    const container = document.getElementById("presets");
    container.lastElementChild.scrollIntoView({ behavior: "smooth" });
  });

  // ── Init ───────────────────────────────────────────────────────────

  loadSettings();
})();
