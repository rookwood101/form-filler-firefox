(function () {
  "use strict";

  // ── Built-in Generators ─────────────────────────────────────────────
  // Each generator returns a random realistic value.

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomPick(arr) {
    return arr[randomInt(0, arr.length - 1)];
  }

  function randomString(len) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let s = "";
    for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  }

  function randomDate(startYear, endYear) {
    const y = randomInt(startYear, endYear);
    const m = randomInt(1, 12);
    const d = randomInt(1, 28);
    return String(y) + "-" + String(m).padStart(2, "0") + "-" + String(d).padStart(2, "0");
  }

  const FIRST_NAMES = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen", "Emily", "Daniel", "Laura", "Matthew",
    "Nancy", "Anthony", "Lisa", "Mark", "Betty", "Steven", "Margaret", "Andrew",
    "Sandra", "Paul", "Ashley", "Joshua", "Dorothy", "Kenneth", "Kimberly", "Kevin"
  ];

  const LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
    "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
    "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
    "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Adams"
  ];

  const STREET_NAMES = [
    "Main St", "Oak Ave", "Cedar Ln", "Maple Dr", "Pine St", "Elm St", "Washington Ave",
    "Park Blvd", "Lake Dr", "Hill Rd", "River Rd", "Sunset Blvd", "Broadway",
    "Highland Ave", "Meadow Ln", "Forest Dr", "Valley Rd", "Church St", "Spring St"
  ];

  const CITIES = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
    "San Antonio", "San Diego", "Dallas", "Austin", "Jacksonville", "San Jose",
    "Fort Worth", "Columbus", "Charlotte", "Indianapolis", "Denver", "Seattle",
    "Portland", "Nashville", "Memphis", "Louisville", "Milwaukee", "Baltimore"
  ];

  const STATES = [
    { abbr: "AL", name: "Alabama" }, { abbr: "AK", name: "Alaska" },
    { abbr: "AZ", name: "Arizona" }, { abbr: "AR", name: "Arkansas" },
    { abbr: "CA", name: "California" }, { abbr: "CO", name: "Colorado" },
    { abbr: "CT", name: "Connecticut" }, { abbr: "DE", name: "Delaware" },
    { abbr: "FL", name: "Florida" }, { abbr: "GA", name: "Georgia" },
    { abbr: "HI", name: "Hawaii" }, { abbr: "ID", name: "Idaho" },
    { abbr: "IL", name: "Illinois" }, { abbr: "IN", name: "Indiana" },
    { abbr: "IA", name: "Iowa" }, { abbr: "KS", name: "Kansas" },
    { abbr: "KY", name: "Kentucky" }, { abbr: "LA", name: "Louisiana" },
    { abbr: "ME", name: "Maine" }, { abbr: "MD", name: "Maryland" },
    { abbr: "MA", name: "Massachusetts" }, { abbr: "MI", name: "Michigan" },
    { abbr: "MN", name: "Minnesota" }, { abbr: "MS", name: "Mississippi" },
    { abbr: "MO", name: "Missouri" }, { abbr: "MT", name: "Montana" },
    { abbr: "NE", name: "Nebraska" }, { abbr: "NV", name: "Nevada" },
    { abbr: "NH", name: "New Hampshire" }, { abbr: "NJ", name: "New Jersey" },
    { abbr: "NM", name: "New Mexico" }, { abbr: "NY", name: "New York" },
    { abbr: "NC", name: "North Carolina" }, { abbr: "ND", name: "North Dakota" },
    { abbr: "OH", name: "Ohio" }, { abbr: "OK", name: "Oklahoma" },
    { abbr: "OR", name: "Oregon" }, { abbr: "PA", name: "Pennsylvania" },
    { abbr: "RI", name: "Rhode Island" }, { abbr: "SC", name: "South Carolina" },
    { abbr: "SD", name: "South Dakota" }, { abbr: "TN", name: "Tennessee" },
    { abbr: "TX", name: "Texas" }, { abbr: "UT", name: "Utah" },
    { abbr: "VT", name: "Vermont" }, { abbr: "VA", name: "Virginia" },
    { abbr: "WA", name: "Washington" }, { abbr: "WV", name: "West Virginia" },
    { abbr: "WI", name: "Wisconsin" }, { abbr: "WY", name: "Wyoming" }
  ];

  const COUNTRIES = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany",
    "France", "Japan", "Brazil", "Mexico", "India", "Italy", "Spain",
    "Netherlands", "Sweden", "Norway", "Denmark", "Switzerland", "Ireland"
  ];

  const COMPANIES = [
    "Acme Corp", "Globex Inc", "Initech", "Umbrella Corp", "Stark Industries",
    "Wayne Enterprises", "Cyberdyne Systems", "Soylent Corp", "Wonka Industries",
    "Vandelay Industries", "Pied Piper", "Hooli", "Sterling Cooper",
    "Dunder Mifflin", "Prestige Worldwide", "TechNova Solutions",
    "BlueSky Analytics", "NorthStar Consulting", "Summit Digital", "Apex Dynamics"
  ];

  const POSITIONS = [
    "Software Engineer", "Product Manager", "Designer", "Data Analyst",
    "Marketing Manager", "Sales Representative", "Accountant", "HR Manager",
    "Project Manager", "Operations Director", "CTO", "CEO", "VP of Engineering",
    "DevOps Engineer", "Business Analyst", "Consultant", "Team Lead"
  ];

  const TITLES = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];

  const DOMAINS = [
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "protonmail.com",
    "mail.com", "email.com", "fastmail.com", "icloud.com"
  ];

  const CARD_TYPES = ["Visa", "MasterCard", "American Express", "Discover"];

  const BANKS = [
    "Chase", "Bank of America", "Wells Fargo", "Citibank", "Capital One",
    "US Bank", "PNC Bank", "TD Bank", "BB&T", "SunTrust"
  ];

  const BIRTH_PLACES = [
    "New York, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX",
    "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA",
    "Dallas, TX", "San Jose, CA", "Austin, TX", "Jacksonville, FL",
    "Denver, CO", "Seattle, WA", "Boston, MA", "Portland, OR"
  ];

  const LOREM = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia."
  ];

  // Generator functions map - each returns a random value
  const GENERATORS = {
    title: () => randomPick(TITLES),
    firstName: () => randomPick(FIRST_NAMES),
    middleInitial: () => String.fromCharCode(65 + randomInt(0, 25)),
    lastName: () => randomPick(LAST_NAMES),
    fullName: () => randomPick(FIRST_NAMES) + " " + randomPick(LAST_NAMES),
    company: () => randomPick(COMPANIES),
    position: () => randomPick(POSITIONS),
    address1: () => randomInt(100, 9999) + " " + randomPick(STREET_NAMES),
    address2: () => randomPick(["Apt ", "Suite ", "Unit ", "#"]) + randomInt(1, 999),
    city: () => randomPick(CITIES),
    state: () => {
      const s = randomPick(STATES);
      return s.abbr;
    },
    stateFull: () => randomPick(STATES).name,
    country: () => randomPick(COUNTRIES),
    zip: () => String(randomInt(10000, 99999)),
    homePhone: () => "+1-" + randomInt(200, 999) + "-" + randomInt(200, 999) + "-" + String(randomInt(1000, 9999)),
    workPhone: () => "+1-" + randomInt(200, 999) + "-" + randomInt(200, 999) + "-" + String(randomInt(1000, 9999)) + " x" + randomInt(100, 999),
    cellPhone: () => "+1-" + randomInt(200, 999) + "-" + randomInt(200, 999) + "-" + String(randomInt(1000, 9999)),
    fax: () => "+1-" + randomInt(200, 999) + "-" + randomInt(200, 999) + "-" + String(randomInt(1000, 9999)),
    email: () => {
      const first = randomPick(FIRST_NAMES).toLowerCase();
      const last = randomPick(LAST_NAMES).toLowerCase();
      return first + "." + last + randomInt(1, 99) + "@" + randomPick(DOMAINS);
    },
    website: () => "https://www." + randomPick(LAST_NAMES).toLowerCase() + randomPick([".com", ".org", ".net", ".io"]),
    userId: () => {
      const first = randomPick(FIRST_NAMES).toLowerCase();
      const last = randomPick(LAST_NAMES).toLowerCase();
      return first + last.charAt(0) + randomInt(10, 999);
    },
    password: () => "P@ss" + randomInt(1000, 9999) + randomPick(["!", "#", "$", "%", "&"]),
    creditCardType: () => randomPick(CARD_TYPES),
    creditCardNumber: () => {
      // Generate Luhn-valid test numbers
      const prefixes = { "Visa": "4", "MasterCard": "5" + randomInt(1, 5), "American Express": "37", "Discover": "6011" };
      const type = randomPick(CARD_TYPES);
      const prefix = prefixes[type] || "4";
      const len = type === "American Express" ? 15 : 16;
      let num = prefix;
      while (num.length < len - 1) num += randomInt(0, 9);
      // Luhn checksum
      let sum = 0;
      for (let i = 0; i < num.length; i++) {
        let d = parseInt(num[num.length - 1 - i]);
        if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
        sum += d;
      }
      num += String((10 - (sum % 10)) % 10);
      return num;
    },
    cvv: () => String(randomInt(100, 999)),
    cardExpiry: () => String(randomInt(1, 12)).padStart(2, "0") + "/" + String(randomInt(26, 32)),
    cardExpiryDate: () => String(randomInt(2026, 2032)) + "-" + String(randomInt(1, 12)).padStart(2, "0"),
    cardHolderName: () => randomPick(FIRST_NAMES) + " " + randomPick(LAST_NAMES),
    cardBank: () => randomPick(BANKS),
    cardServicePhone: () => "1-800-" + randomInt(200, 999) + "-" + String(randomInt(1000, 9999)),
    sex: () => randomPick(["Male", "Female"]),
    ssn: () => String(randomInt(100, 999)) + "-" + String(randomInt(10, 99)) + "-" + String(randomInt(1000, 9999)),
    driverLicense: () => String.fromCharCode(65 + randomInt(0, 25)) + String(randomInt(1000000, 9999999)),
    dateOfBirth: () => randomDate(1960, 2000),
    age: () => String(randomInt(18, 75)),
    birthPlace: () => randomPick(BIRTH_PLACES),
    income: () => String(randomInt(3, 20) * 10000),
    comments: () => LOREM.slice(0, randomInt(1, LOREM.length)).join(" "),
    lorem: () => LOREM.slice(0, randomInt(1, LOREM.length)).join(" "),
    // generic fallbacks
    phone: () => "+1-" + randomInt(200, 999) + "-" + randomInt(200, 999) + "-" + String(randomInt(1000, 9999)),
    number: (el) => {
      const min = parseFloat(el && el.min) || 1;
      const max = parseFloat(el && el.max) || 100;
      return String(randomInt(Math.ceil(min), Math.floor(max)));
    },
    url: () => "https://example.com/" + randomString(5),
    text: () => randomString(8),
    date: () => randomDate(2023, 2026),
    time: () => String(randomInt(0, 23)).padStart(2, "0") + ":" + String(randomInt(0, 59)).padStart(2, "0"),
    color: () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
    month: () => String(randomInt(2024, 2027)) + "-" + String(randomInt(1, 12)).padStart(2, "0"),
    week: () => String(randomInt(2024, 2027)) + "-W" + String(randomInt(1, 52)).padStart(2, "0"),
    datetimeLocal: () => randomDate(2024, 2026) + "T" + String(randomInt(0, 23)).padStart(2, "0") + ":" + String(randomInt(0, 59)).padStart(2, "0"),
  };

  // Execute a generator by name, with optional element context
  function runGenerator(name, element) {
    const gen = GENERATORS[name];
    if (!gen) return null;
    return gen(element);
  }

  // ── Name-based Pattern Matching ─────────────────────────────────────
  // Maps field name/id/label patterns to generator names.
  // Order matters: more specific patterns should come first.

  const NAME_PATTERNS = [
    // Credit card fields (check before generic name/number)
    { patterns: ["card_type", "cardtype", "cc_type", "cctype", "credit_card_type", "creditcardtype", "card-type", "credit-card-type"], generator: "creditCardType" },
    { patterns: ["card_number", "cardnumber", "cc_number", "ccnumber", "credit_card", "creditcard", "card-number", "cc-number", "credit-card-number"], generator: "creditCardNumber" },
    { patterns: ["cvv", "cvc", "cvv2", "cvc2", "card_verification", "verification_code", "security_code", "securitycode", "card-verification", "security-code"], generator: "cvv" },
    { patterns: ["card_exp", "cardexp", "cc_exp", "ccexp", "expir", "exp_date", "expdate", "card-exp", "exp-date", "expiration"], generator: "cardExpiry" },
    { patterns: ["card_name", "cardname", "cardholder", "card_holder", "nameoncard", "name_on_card", "card-holder", "card-name", "name-on-card"], generator: "cardHolderName" },
    { patterns: ["issuing_bank", "issuingbank", "card_bank", "cardbank", "issuing-bank", "card-bank"], generator: "cardBank" },
    { patterns: ["card_phone", "cardphone", "card_service", "cardservice", "customer_service_phone", "card-phone", "card-service", "customer-service-phone"], generator: "cardServicePhone" },

    // Personal identity
    { patterns: ["title", "prefix", "salutation", "honorific"], generator: "title" },
    { patterns: ["middle_initial", "middleinitial", "middle_i", "mi", "m_initial", "middle-initial"], generator: "middleInitial" },
    { patterns: ["middle_name", "middlename", "middle-name"], generator: "middleInitial" },
    { patterns: ["first_name", "firstname", "fname", "first-name", "given_name", "givenname", "given-name"], generator: "firstName" },
    { patterns: ["last_name", "lastname", "lname", "surname", "family_name", "familyname", "last-name", "family-name"], generator: "lastName" },
    { patterns: ["full_name", "fullname", "full-name", "your_name", "yourname", "your-name"], generator: "fullName" },
    { patterns: ["company", "organization", "organisation", "org_name", "orgname", "company_name", "companyname", "employer", "business", "company-name", "org-name"], generator: "company" },
    { patterns: ["position", "job_title", "jobtitle", "occupation", "role", "designation", "job-title"], generator: "position" },

    // Address fields
    { patterns: ["address_2", "address2", "addressline2", "address_line_2", "address_line2", "apt", "suite", "unit", "addr2", "street2", "address-2", "address-line-2"], generator: "address2" },
    { patterns: ["address_1", "address1", "addressline1", "address_line_1", "address_line1", "street_address", "streetaddress", "street1", "addr1", "address-1", "address-line-1", "street-address"], generator: "address1" },
    { patterns: ["address", "street", "addr"], generator: "address1" },
    { patterns: ["city", "town", "locality"], generator: "city" },
    { patterns: ["state", "province", "region", "administrative_area", "administrative-area"], generator: "state" },
    { patterns: ["country", "nation"], generator: "country" },
    { patterns: ["zip", "zipcode", "zip_code", "postal", "postal_code", "postalcode", "postcode", "zip-code", "postal-code"], generator: "zip" },

    // Phone fields
    { patterns: ["home_phone", "homephone", "phone_home", "phonehome", "home_tel", "hometel", "home-phone"], generator: "homePhone" },
    { patterns: ["work_phone", "workphone", "phone_work", "phonework", "work_tel", "worktel", "business_phone", "businessphone", "office_phone", "officephone", "work-phone", "business-phone", "office-phone", "work_telephone", "worktelephone", "work-telephone"], generator: "workPhone" },
    { patterns: ["fax", "fax_number", "faxnumber", "fax-number"], generator: "fax" },
    { patterns: ["cell", "cellphone", "cell_phone", "mobile", "mobile_phone", "mobilephone", "cell-phone", "mobile-phone"], generator: "cellPhone" },
    { patterns: ["phone", "tel", "telephone"], generator: "phone" },

    // Online
    { patterns: ["email", "e_mail", "e-mail", "emailaddress", "email_address", "email-address"], generator: "email" },
    { patterns: ["website", "web_site", "homepage", "home_page", "blog", "url", "web-site", "home-page", "personal_url", "personal-url"], generator: "website" },
    { patterns: ["user_id", "userid", "username", "user_name", "login", "login_id", "loginid", "user-id", "user-name", "login-id", "screen_name", "screenname", "screen-name"], generator: "userId" },
    { patterns: ["password", "passwd", "pass", "pwd", "passw"], generator: "password" },

    // Sensitive/identity
    { patterns: ["sex", "gender"], generator: "sex" },
    { patterns: ["ssn", "social_security", "socialsecurity", "social-security", "ss_number", "ssnumber", "ss-number", "social_security_number"], generator: "ssn" },
    { patterns: ["driver_license", "driverlicense", "drivers_license", "driverslicense", "dl_number", "dlnumber", "license_number", "licensenumber", "driver-license", "license-number"], generator: "driverLicense" },
    { patterns: ["dob", "date_of_birth", "dateofbirth", "birthdate", "birth_date", "birthday", "date-of-birth", "birth-date"], generator: "dateOfBirth" },
    { patterns: ["age"], generator: "age" },
    { patterns: ["birth_place", "birthplace", "placeofbirth", "place_of_birth", "born_in", "birth-place", "place-of-birth"], generator: "birthPlace" },
    { patterns: ["income", "salary", "annual_income", "annualincome", "annual-income", "yearly_income"], generator: "income" },

    // Text fields
    { patterns: ["comment", "comments", "feedback", "message", "custom_message", "custommessage", "custom-message", "notes", "note", "description", "remarks", "remark"], generator: "comments" },

    // Fuzzy fallbacks (checked last - these match if the name *contains* the keyword)
    // These are handled separately in matchFieldByName
  ];

  // Fuzzy fallback patterns: if the field identifier contains the keyword
  const FUZZY_PATTERNS = [
    { keyword: "name", generator: "fullName" },
    { keyword: "phone", generator: "phone" },
    { keyword: "tel", generator: "phone" },
    { keyword: "addr", generator: "address1" },
    { keyword: "street", generator: "address1" },
    { keyword: "city", generator: "city" },
    { keyword: "state", generator: "state" },
    { keyword: "province", generator: "state" },
    { keyword: "country", generator: "country" },
    { keyword: "zip", generator: "zip" },
    { keyword: "postal", generator: "zip" },
    { keyword: "company", generator: "company" },
    { keyword: "org", generator: "company" },
    { keyword: "email", generator: "email" },
    { keyword: "mail", generator: "email" },
    { keyword: "comment", generator: "comments" },
    { keyword: "message", generator: "comments" },
    { keyword: "note", generator: "comments" },
  ];

  // Get all identifying text for a field (combined for matching)
  function getFieldIdentifiers(element) {
    const parts = [];
    if (element.id) parts.push(element.id);
    if (element.name) parts.push(element.name);
    if (element.placeholder) parts.push(element.placeholder);
    if (element.getAttribute("aria-label")) parts.push(element.getAttribute("aria-label"));
    const label = getLabelText(element);
    if (label) parts.push(label);
    const ariaLabelledBy = getAriaLabelledByText(element);
    if (ariaLabelledBy) parts.push(ariaLabelledBy);
    if (element.getAttribute("autocomplete")) parts.push(element.getAttribute("autocomplete"));
    return parts.map(s => s.toLowerCase());
  }

  // Try to match a field to a generator by its name/id/label/placeholder
  function matchFieldByName(element) {
    const identifiers = getFieldIdentifiers(element);
    if (identifiers.length === 0) return null;

    const joined = identifiers.join(" ");

    // First try exact pattern matches (more specific)
    for (const entry of NAME_PATTERNS) {
      for (const pattern of entry.patterns) {
        // Check if any identifier matches the pattern exactly or contains it as a word boundary
        for (const id of identifiers) {
          // Exact match
          if (id === pattern) return entry.generator;
          // Word-boundary-ish match: the pattern appears surrounded by non-alphanumeric chars or at start/end
          const regex = new RegExp("(?:^|[^a-z0-9])" + pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "(?:$|[^a-z0-9])");
          if (regex.test(id)) return entry.generator;
        }
      }
    }

    // Then try fuzzy fallback patterns
    for (const entry of FUZZY_PATTERNS) {
      if (joined.includes(entry.keyword)) return entry.generator;
    }

    return null;
  }

  // ── Random Fallback (by input type) ─────────────────────────────────

  function generateRandomByType(fieldType, element) {
    switch (fieldType) {
      case "text":
      case "search":
        return randomString(8);
      case "email":
        return runGenerator("email");
      case "tel":
        return runGenerator("phone");
      case "password":
        return runGenerator("password");
      case "number":
      case "range":
        return runGenerator("number", element);
      case "url":
        return runGenerator("url");
      case "date":
        return runGenerator("date");
      case "time":
        return runGenerator("time");
      case "month":
        return runGenerator("month");
      case "week":
        return runGenerator("week");
      case "datetime-local":
        return runGenerator("datetimeLocal");
      case "color":
        return runGenerator("color");
      case "textarea":
        return runGenerator("lorem");
      case "select":
        return pickRandomOption(element);
      case "checkbox":
        return Math.random() > 0.5 ? "true" : "false";
      case "radio":
        return "";
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
    if (element.id) {
      const label = document.querySelector('label[for="' + CSS.escape(element.id) + '"]');
      if (label) return label.textContent.trim();
    }
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

  function resolveValue(valueDef, element) {
    if (!valueDef) return null;

    // Check if it's a generator reference
    if (valueDef.generator && GENERATORS[valueDef.generator]) {
      return runGenerator(valueDef.generator, element);
    }

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
          // no match
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

  // ── Visibility Check ───────────────────────────────────────────────

  function isHiddenField(element) {
    // Skip input type="hidden"
    if (element.type === "hidden") return true;

    // Check if element or ancestor has display:none, visibility:hidden, or hidden attribute
    if (element.hidden) return true;

    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") return true;

    // Check if any ancestor is hidden (walk up a few levels for performance)
    let parent = element.parentElement;
    let depth = 0;
    while (parent && depth < 10) {
      if (parent.hidden) return true;
      const parentStyle = window.getComputedStyle(parent);
      if (parentStyle.display === "none" || parentStyle.visibility === "hidden") return true;
      parent = parent.parentElement;
      depth++;
    }

    // Check for zero dimensions (common way to hide fields)
    if (element.offsetWidth === 0 && element.offsetHeight === 0) {
      // But allow checkboxes/radios which are sometimes styled with 0 dimensions
      if (element.type !== "checkbox" && element.type !== "radio") return true;
    }

    return false;
  }

  // ── Preset Matching ────────────────────────────────────────────────

  function getMatchingPreset(settings) {
    if (!settings.presets || settings.presets.length === 0) return null;
    const currentUrl = window.location.href;
    for (const preset of settings.presets) {
      if (!preset.enabled) continue;
      try {
        // Support wildcard patterns: * matches anything
        const pattern = preset.urlPattern
          .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
          .replace(/\*/g, ".*");
        const regex = new RegExp(pattern, "i");
        if (regex.test(currentUrl)) return preset;
      } catch (e) {
        // invalid pattern, skip
      }
    }
    return null;
  }

  // ── Main Fill Logic ────────────────────────────────────────────────

  const SKIP_TYPES = new Set(["submit", "button", "reset", "image", "file"]);

  const filledRadioGroups = new Set();

  function fillAllFields(settings) {
    filledRadioGroups.clear();

    // Check for matching website preset
    const preset = getMatchingPreset(settings);
    const presetRules = preset ? preset.rules : [];

    const fields = document.querySelectorAll(
      'input, textarea, select, [contenteditable="true"], [contenteditable=""]'
    );

    let filledCount = 0;

    for (const element of fields) {
      // Handle contenteditable
      if (element.getAttribute("contenteditable") !== null && element.tagName !== "INPUT" && element.tagName !== "TEXTAREA" && element.tagName !== "SELECT") {
        if (!element.isContentEditable) continue;
        if (isHiddenField(element)) continue;
        const textDefault = settings.fieldTypeDefaults.textarea;
        if (textDefault && textDefault.enabled) {
          const val = resolveValue(textDefault, element) || (settings.randomFallback ? generateRandomByType("textarea", element) : null);
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

      // Skip hidden fields (CSS hidden, display:none, visibility:hidden, etc.)
      if (isHiddenField(element)) continue;

      // Skip disabled or readonly
      if (element.disabled || element.readOnly) continue;

      // For radios, only handle each group once
      if (fieldType === "radio" && element.name) {
        if (filledRadioGroups.has(element.name)) continue;
        filledRadioGroups.add(element.name);
      }

      // Resolution order:
      // 1. Preset rules (if a website preset matches)
      // 2. Custom rules
      // 3. Name-based matching (smart defaults)
      // 4. Field type defaults
      // 5. Random fallback

      let value = null;
      let matched = false;

      // 1. Check preset rules
      if (presetRules.length > 0) {
        for (const rule of presetRules) {
          if (matchesRule(element, fieldType, rule)) {
            if (rule.action === "skip") {
              matched = true;
              value = undefined; // signal to skip
              break;
            }
            if (rule.generator) {
              value = runGenerator(rule.generator, element);
            } else {
              value = resolveValue({ value: rule.value, isExpression: rule.isExpression }, element);
            }
            matched = true;
            break;
          }
        }
      }

      // 2. Check custom rules
      if (!matched && settings.customRules && settings.customRules.length > 0) {
        for (const rule of settings.customRules) {
          if (matchesRule(element, fieldType, rule)) {
            if (rule.action === "skip") {
              matched = true;
              value = undefined; // signal to skip
              break;
            }
            if (rule.generator) {
              value = runGenerator(rule.generator, element);
            } else {
              value = resolveValue({ value: rule.value, isExpression: rule.isExpression }, element);
            }
            matched = true;
            break;
          }
        }
      }

      // If skip was signaled, continue to next field
      if (value === undefined) continue;

      // 3. Name-based matching (smart defaults)
      if (!matched && settings.nameMatching !== false) {
        const generatorName = matchFieldByName(element);
        if (generatorName) {
          // Check if this name pattern is disabled in settings
          const nameDefaults = settings.nameDefaults || {};
          const nameConfig = nameDefaults[generatorName];
          if (nameConfig && nameConfig.enabled === false) {
            // Name pattern is disabled, fall through
          } else if (nameConfig && nameConfig.value !== undefined && nameConfig.value !== "" && !nameConfig.generator) {
            // Use static value from name defaults
            value = resolveValue(nameConfig, element);
            matched = true;
          } else if (nameConfig && nameConfig.generator) {
            // Use configured generator
            value = runGenerator(nameConfig.generator, element);
            matched = true;
          } else {
            // Use the matched generator
            value = runGenerator(generatorName, element);
            matched = true;
          }
        }
      }

      // 4. Check field type defaults
      if (!matched) {
        const typeDef = settings.fieldTypeDefaults[fieldType];
        if (!typeDef || !typeDef.enabled) continue;

        if (typeDef.generator) {
          value = runGenerator(typeDef.generator, element);
        } else if (typeDef.value !== "" && typeDef.value !== null && typeDef.value !== undefined) {
          value = resolveValue(typeDef, element);
        } else if (settings.randomFallback) {
          value = generateRandomByType(fieldType, element);
        } else {
          continue;
        }
      }

      applyValue(element, fieldType, value);
      filledCount++;
    }

    console.log("Form Filler: filled " + filledCount + " field(s)" + (preset ? " (preset: " + preset.name + ")" : ""));
  }

  // ── Message Listener ───────────────────────────────────────────────

  browser.runtime.onMessage.addListener((message) => {
    if (message.action === "fill") {
      fillAllFields(message.settings);
    }
  });
})();
