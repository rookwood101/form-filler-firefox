// List of all built-in generator names (for reference in settings)
const GENERATOR_NAMES = [
  "title", "firstName", "middleInitial", "lastName", "fullName",
  "company", "position",
  "address1", "address2", "city", "state", "stateFull", "country", "zip",
  "homePhone", "workPhone", "cellPhone", "fax", "phone",
  "email", "website", "userId", "password",
  "creditCardType", "creditCardNumber", "cvv", "cardExpiry", "cardExpiryDate",
  "cardHolderName", "cardBank", "cardServicePhone",
  "sex", "ssn", "driverLicense", "dateOfBirth", "age", "birthPlace", "income",
  "comments", "lorem",
  "number", "url", "text", "date", "time", "color", "month", "week", "datetimeLocal"
];

const DEFAULT_SETTINGS = {
  fieldTypeDefaults: {
    text:     { enabled: true, value: "",                       isExpression: false, generator: "" },
    email:    { enabled: true, value: "",                       isExpression: false, generator: "email" },
    tel:      { enabled: true, value: "",                       isExpression: false, generator: "phone" },
    number:   { enabled: true, value: "",                       isExpression: false, generator: "number" },
    url:      { enabled: true, value: "",                       isExpression: false, generator: "url" },
    date:     { enabled: true, value: "",                       isExpression: false, generator: "date" },
    textarea: { enabled: true, value: "",                       isExpression: false, generator: "lorem" },
    select:   { enabled: true, value: "",                       isExpression: false, generator: "" },
    checkbox: { enabled: true, value: "true",                   isExpression: false, generator: "" },
    radio:    { enabled: true, value: "",                       isExpression: false, generator: "" },
    password: { enabled: true, value: "",                       isExpression: false, generator: "password" },
    search:   { enabled: true, value: "search query",           isExpression: false, generator: "" },
    color:    { enabled: true, value: "",                       isExpression: false, generator: "color" },
    range:    { enabled: true, value: "50",                     isExpression: false, generator: "" },
    time:     { enabled: true, value: "",                       isExpression: false, generator: "time" },
    month:    { enabled: true, value: "",                       isExpression: false, generator: "month" },
    week:     { enabled: true, value: "",                       isExpression: false, generator: "week" },
    "datetime-local": { enabled: true, value: "",               isExpression: false, generator: "datetimeLocal" },
  },
  nameMatching: true,
  nameDefaults: {
    // Each entry can have: enabled, value, generator, isExpression
    // By default all use their built-in generator
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

async function triggerFill() {
  const data = await browser.storage.local.get("settings");
  const settings = data.settings || DEFAULT_SETTINGS;

  // Ensure new fields exist for upgraded settings
  if (!settings.nameDefaults) settings.nameDefaults = DEFAULT_SETTINGS.nameDefaults;
  if (settings.nameMatching === undefined) settings.nameMatching = true;
  if (!settings.presets) settings.presets = [];

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
