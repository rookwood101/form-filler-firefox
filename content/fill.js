(function () {
  "use strict";

  // ── Random Generators ──────────────────────────────────────────────

  function randomString(len) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let s = "";
    for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomDate() {
    const now = Date.now();
    const past = now - 365 * 24 * 60 * 60 * 1000;
    const d = new Date(randomInt(past, now));
    return d.toISOString().slice(0, 10);
  }

  const LOREM = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia."
  ];

  function generateRandom(fieldType, element) {
    switch (fieldType) {
      case "text":
      case "search":
        return randomString(8);
      case "email":
        return randomString(6) + "@example.com";
      case "tel":
        return "+1-555-" + randomInt(1000000, 9999999);
      case "password":
        return "Pass" + randomInt(1000, 9999) + "!";
      case "number":
      case "range": {
        const min = parseFloat(element.min) || 1;
        const max = parseFloat(element.max) || 100;
        return String(randomInt(Math.ceil(min), Math.floor(max)));
      }
      case "url":
        return "https://example.com/" + randomString(5);
      case "date":
        return randomDate();
      case "time":
        return String(randomInt(0, 23)).padStart(2, "0") + ":" + String(randomInt(0, 59)).padStart(2, "0");
      case "month":
        return "2025-" + String(randomInt(1, 12)).padStart(2, "0");
      case "week":
        return "2025-W" + String(randomInt(1, 52)).padStart(2, "0");
      case "datetime-local":
        return randomDate() + "T" + String(randomInt(0, 23)).padStart(2, "0") + ":" + String(randomInt(0, 59)).padStart(2, "0");
      case "color":
        return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
      case "textarea":
        return LOREM.slice(0, randomInt(1, LOREM.length)).join(" ");
      case "select":
        return pickRandomOption(element);
      case "checkbox":
        return Math.random() > 0.5 ? "true" : "false";
      case "radio":
        return ""; // empty triggers "pick first" in applyValue
      default:
        return randomString(8);
    }
  }

  function pickRandomOption(select) {
    const options = Array.from(select.options).filter(
      (o) => o.value && !o.disabled && !o.hidden
    );
    if (options.length === 0) return null;
    return options[randomInt(0, options.length - 1)].value;
  }

  // ── Field Attribute Extraction ─────────────────────────────────────

  function getLabelText(element) {
    // via for attribute
    if (element.id) {
      const label = document.querySelector('label[for="' + CSS.escape(element.id) + '"]');
      if (label) return label.textContent.trim();
    }
    // via ancestor
    const ancestor = element.closest("label");
    if (ancestor) return ancestor.textContent.trim();
    return "";
  }

  function getAriaLabelledByText(element) {
    const ids = element.getAttribute("aria-labelledby");
    if (!ids) return "";
    return ids
      .split(/\s+/)
      .map((id) => {
        const el = document.getElementById(id);
        return el ? el.textContent.trim() : "";
      })
      .join(" ")
      .trim();
  }

  function getMatchAttribute(element, method) {
    switch (method) {
      case "id":
        return element.id || "";
      case "name":
        return element.name || "";
      case "class":
        return element.className || "";
      case "placeholder":
        return element.placeholder || "";
      case "aria-label":
        return element.getAttribute("aria-label") || "";
      case "aria-labelledby":
        return getAriaLabelledByText(element);
      case "label":
        return getLabelText(element);
      default:
        return "";
    }
  }

  // ── Value Resolution ───────────────────────────────────────────────

  function resolveValue(valueDef) {
    if (!valueDef) return null;
    if (valueDef.isExpression) {
      try {
        return String(new Function("return " + valueDef.value)());
      } catch (e) {
        console.warn("Form Filler: expression error:", e);
        return null;
      }
    }
    return valueDef.value;
  }

  // ── Value Application ──────────────────────────────────────────────

  function dispatchEvents(element, events) {
    for (const eventName of events) {
      element.dispatchEvent(new Event(eventName, { bubbles: true, cancelable: true }));
    }
  }

  function setNativeValue(element, value) {
    // Use native setter to work with React and other frameworks
    const proto =
      element instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
    if (descriptor && descriptor.set) {
      descriptor.set.call(element, value);
    } else {
      element.value = value;
    }
    dispatchEvents(element, ["input", "change"]);
  }

  function applyValue(element, fieldType, value) {
    if (value === null || value === undefined) return;

    switch (fieldType) {
      case "checkbox": {
        const shouldCheck = value === "true" || value === true || value === "1";
        if (element.checked !== shouldCheck) {
          element.checked = shouldCheck;
          dispatchEvents(element, ["click", "input", "change"]);
        }
        break;
      }
      case "radio": {
        // value is the radio value to select, or empty to select first
        const name = element.name;
        if (!name) {
          element.checked = true;
          dispatchEvents(element, ["click", "input", "change"]);
          break;
        }
        const radios = document.querySelectorAll('input[type="radio"][name="' + CSS.escape(name) + '"]');
        let target = null;
        if (value) {
          target = Array.from(radios).find((r) => r.value === value);
        }
        if (!target) {
          // pick first non-disabled
          target = Array.from(radios).find((r) => !r.disabled);
        }
        if (target && !target.checked) {
          target.checked = true;
          dispatchEvents(target, ["click", "input", "change"]);
        }
        break;
      }
      case "select": {
        const option = Array.from(element.options).find((o) => o.value === value);
        if (option) {
          element.value = value;
          dispatchEvents(element, ["change"]);
        } else if (value === "" || value === null) {
          // random fallback already resolved to a specific value
        }
        break;
      }
      case "color": {
        element.value = value;
        dispatchEvents(element, ["input", "change"]);
        break;
      }
      default: {
        setNativeValue(element, value);
        break;
      }
    }
  }

  // ── Field Type Detection ───────────────────────────────────────────

  function getFieldType(element) {
    if (element.tagName === "TEXTAREA") return "textarea";
    if (element.tagName === "SELECT") return "select";
    return element.type || "text";
  }

  // ── Custom Rule Matching ───────────────────────────────────────────

  function matchesRule(element, fieldType, rule) {
    if (!rule.enabled) return false;
    if (rule.fieldType && rule.fieldType !== "any" && rule.fieldType !== fieldType) return false;

    const attrValue = getMatchAttribute(element, rule.matchMethod);
    if (!attrValue) return false;

    const needle = rule.matchString.toLowerCase();
    return attrValue.toLowerCase().includes(needle);
  }

  // ── Main Fill Logic ────────────────────────────────────────────────

  const SKIP_TYPES = new Set(["hidden", "submit", "button", "reset", "image", "file"]);

  // Track which radio groups we've already filled
  const filledRadioGroups = new Set();

  function fillAllFields(settings) {
    filledRadioGroups.clear();

    const fields = document.querySelectorAll(
      'input, textarea, select, [contenteditable="true"], [contenteditable=""]'
    );

    let filledCount = 0;

    for (const element of fields) {
      // Handle contenteditable
      if (element.getAttribute("contenteditable") !== null && element.tagName !== "INPUT" && element.tagName !== "TEXTAREA" && element.tagName !== "SELECT") {
        if (!element.isContentEditable) continue;
        const textDefault = settings.fieldTypeDefaults.textarea;
        if (textDefault && textDefault.enabled) {
          const val = resolveValue(textDefault) || (settings.randomFallback ? generateRandom("textarea", element) : null);
          if (val) {
            element.textContent = val;
            dispatchEvents(element, ["input", "change"]);
            filledCount++;
          }
        }
        continue;
      }

      const fieldType = getFieldType(element);

      // Skip non-fillable types
      if (SKIP_TYPES.has(fieldType)) continue;

      // Skip disabled or readonly
      if (element.disabled || element.readOnly) continue;

      // For radios, only handle each group once
      if (fieldType === "radio" && element.name) {
        if (filledRadioGroups.has(element.name)) continue;
        filledRadioGroups.add(element.name);
      }

      // Check custom rules first (order matters, first match wins)
      let value = null;
      let matched = false;

      if (settings.customRules && settings.customRules.length > 0) {
        for (const rule of settings.customRules) {
          if (matchesRule(element, fieldType, rule)) {
            value = resolveValue({ value: rule.value, isExpression: rule.isExpression });
            matched = true;
            break;
          }
        }
      }

      if (!matched) {
        // Check field type defaults
        const typeDef = settings.fieldTypeDefaults[fieldType];
        if (!typeDef || !typeDef.enabled) continue;

        if (typeDef.value !== "" && typeDef.value !== null && typeDef.value !== undefined) {
          value = resolveValue(typeDef);
        } else if (settings.randomFallback) {
          value = generateRandom(fieldType, element);
        } else {
          continue;
        }
      }

      applyValue(element, fieldType, value);
      filledCount++;
    }

    console.log("Form Filler: filled " + filledCount + " field(s)");
  }

  // ── Message Listener ───────────────────────────────────────────────

  browser.runtime.onMessage.addListener((message) => {
    if (message.action === "fill") {
      fillAllFields(message.settings);
    }
  });
})();
