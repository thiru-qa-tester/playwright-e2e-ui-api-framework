# 🎭 Playwright Automation Framework

> Senior-grade test automation framework built with **Playwright + TypeScript** for UI and API testing.

---

## 📁 Project Structure

```
playwright-automation-framework/
├── src/
│   ├── pages/                  # Page Object Model (POM)
│   │   ├── BasePage.ts         # Abstract base with shared utilities
│   │   ├── LoginPage.ts        # Login page interactions
│   │   ├── InventoryPage.ts    # Product listing page
│   │   ├── CartPage.ts         # Shopping cart page
│   │   ├── CheckoutPage.ts     # Checkout flow (step 1, 2, confirm)
│   │   └── index.ts            # Barrel exports
│   ├── tests/
│   │   ├── ui/
│   │   │   ├── login.spec.ts   # 12 login scenarios (valid, invalid, edge cases)
│   │   │   └── order.spec.ts   # 8 order flow scenarios (E2E)
│   │   └── api/
│   │       └── simpleBooks.spec.ts  # 15 API tests (GET, POST, PATCH, DELETE)
│   ├── utils/
│   │   └── ApiHelper.ts        # API request wrapper utility
│   └── data/
│       └── testData.ts         # Centralized test data & constants
├── playwright.config.ts        # Cross-browser, parallel, reporter config
├── tsconfig.json
├── package.json
└── .env                        # Environment variables (credentials)
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or above
- **npm** v9 or above

---

## 🚀 Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/playwright-automation-framework.git
cd playwright-automation-framework

# 2. Install dependencies
npm install

# 3. Install Playwright browsers
npx playwright install chromium firefox
```

---

## ▶️ Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests (UI + API) on Chrome & Firefox |
| `npm run test:ui` | Run UI tests only |
| `npm run test:api` | Run API tests only |
| `npm run test:chrome` | Run on Chrome only |
| `npm run test:firefox` | Run on Firefox only |
| `npm run test:parallel` | Run with 4 parallel workers |

---

## 📊 Reports

### Playwright HTML Report
```bash
npm test
npx playwright show-report
```

### Allure Report
```bash
npm test
npm run report:allure
```
> Allure report opens automatically in your browser.

---

## 🌐 Applications Under Test

### UI: SauceDemo
- **URL:** https://www.saucedemo.com
- **Credentials:** Stored in `.env` (pre-configured)

### API: Simple Books API
- **Docs:** https://github.com/vdespa/introduction-to-postman-course/blob/main/simple-books-api.md
- **Base URL:** https://simple-books-api.glitch.me

---

## 🧪 Test Coverage

### UI Tests – Login (`login.spec.ts`) — 12 scenarios
| Test ID | Scenario |
|---|---|
| TC_LOGIN_01 | Valid credentials → success |
| TC_LOGIN_02 | Performance glitch user → success |
| TC_LOGIN_03 | Locked out user → error |
| TC_LOGIN_04 | Invalid username & password → error |
| TC_LOGIN_05 | Empty username → required error |
| TC_LOGIN_06 | Empty password → required error |
| TC_LOGIN_07 | Both fields empty → username required |
| TC_LOGIN_08 | Error icons on fields for invalid login |
| TC_LOGIN_09 | Dismiss error message |
| TC_LOGIN_10 | Wrong username, correct password → error |
| TC_LOGIN_11 | SQL injection attempt → blocked |
| TC_LOGIN_12 | XSS injection → blocked |

### UI Tests – Order Flow (`order.spec.ts`) — 8 scenarios
| Test ID | Scenario |
|---|---|
| TC_ORDER_01 | Full E2E: add to cart → checkout → confirm |
| TC_ORDER_02 | Add button changes to Remove |
| TC_ORDER_03 | Cart badge count updates |
| TC_ORDER_04 | Continue shopping from cart |
| TC_ORDER_05 | Checkout requires first name |
| TC_ORDER_06 | Checkout requires last name |
| TC_ORDER_07 | Checkout requires postal code |
| TC_ORDER_08 | Logout redirects to login |

### API Tests – Simple Books (`simpleBooks.spec.ts`) — 15 scenarios
| Test ID | Scenario |
|---|---|
| TC_API_01 | GET /status → OK |
| TC_API_02 | GET /books → returns list |
| TC_API_03 | GET /books?type=fiction → fiction only |
| TC_API_04 | GET /books?type=non-fiction → non-fiction only |
| TC_API_05 | GET /books/:id → book details |
| TC_API_06 | GET /books/9999 → 404 |
| TC_API_07 | POST /api-clients → access token returned |
| TC_API_08 | POST /orders with token → 201 created |
| TC_API_09 | POST /orders without token → 401 |
| TC_API_10 | GET /orders → list |
| TC_API_11 | GET /orders/:id → specific order |
| TC_API_12 | PATCH /orders/:id → 204 + verify update |
| TC_API_13 | DELETE /orders/:id → 204 + verify 404 |
| TC_API_14 | DELETE without token → 401 |
| TC_API_15 | POST with invalid bookId → 404 |

---

## 🏗️ Framework Design Principles

- **Page Object Model (POM)** — Each page has its own class; tests remain clean and readable
- **BasePage** — Shared utility methods (navigate, waitForElement, assertions)
- **ApiHelper** — Centralized API request wrapper with auth header management
- **testData.ts** — All test data in one place; no magic strings in tests
- **Environment Variables** — `.env` for credentials; never hardcoded in tests
- **Parallel Execution** — `fullyParallel: true` with configurable workers
- **Cross-Browser** — Chrome and Firefox via Playwright projects
- **Retry Logic** — Auto-retry on failure (2x in CI, 1x locally)
- **Artifacts on Failure** — Screenshots, videos, and traces captured automatically

---

## 🛠️ Configuration

Edit `playwright.config.ts` to change:
- `workers` — parallel execution count
- `retries` — retry count on failure
- `timeout` — test/assertion timeouts
- `reporter` — add/remove reporters

---

## 👤 Author

**Thirunavukkarasu Muthusamy**  
Senior Automation Tester  
Built for: Ejada Systems Assignment
