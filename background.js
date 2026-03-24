const DEFAULT_SETTINGS = {
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

async function triggerFill() {
  const data = await browser.storage.local.get("settings");
  const settings = data.settings || DEFAULT_SETTINGS;
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]) {
    try {
      await browser.tabs.sendMessage(tabs[0].id, {
        action: "fill",
        settings: settings
      });
    } catch (e) {
      console.warn("Form Filler: could not send message to tab:", e);
    }
  }
}

browser.browserAction.onClicked.addListener(triggerFill);

browser.commands.onCommand.addListener((command) => {
  if (command === "fill-forms") {
    triggerFill();
  }
});

browser.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") {
    const data = await browser.storage.local.get("settings");
    if (!data.settings) {
      await browser.storage.local.set({ settings: DEFAULT_SETTINGS });
    }
  }
});
