# ✅ Ko Lake Villa — Test Case Validation Plan

This document validates key functionality for the Ko Lake Villa website across guest and admin flows. Each test is linked to a related requirement and validation status.

---

## 🧪 Guest Functionality Tests

| ID     | Function                            | Expected Behaviour                                      | Status |
|--------|-------------------------------------|----------------------------------------------------------|--------|
| G001   | View gallery                        | Loads images/videos with correct tags & captions         | 🟢 Passed |
| G002   | Book room from direct site          | Discounted price shown (10% off Airbnb)                  | 🟢 Passed |
| G003   | View dynamic pricing                | Rates update based on Sunday–Tuesday Airbnb values       | 🟢 Passed |
| G004   | Last-minute deal (3-day window)     | Applies 15% discount when within 72 hours of stay        | 🟢 Passed |
| G005   | View accommodation descriptions     | Room titles match Airbnb listings                        | 🟢 Passed |

---

## 🛠️ Admin Panel Functionality

| ID     | Function                            | Expected Behaviour                                      | Status |
|--------|-------------------------------------|----------------------------------------------------------|--------|
| A001   | Upload image or video               | Media appears in gallery with tag suggestion             | 🟢 Passed |
| A002   | Refresh Airbnb pricing              | Pulls current rates and updates pricing calendar         | 🟢 Passed |
| A003   | Update room name & description      | Modifies text on accommodation page                      | 🟢 Passed |
| A004   | View Pricing Manager dashboard      | Displays direct vs Airbnb price + buttons                | 🟢 Passed |
| A005   | Sync with GitHub                    | Auto-generates issues, markdown logs                     | 🟢 Passed |

---

## 🔍 Validation Legend

- 🔵 Fully Validated – Confirmed via UI or logs
- 🟢 Largely Validated – Mostly working, some assumptions
- 🟡 Partially Validated – Some uncertainty or not live yet
- 🔴 Not Yet Validated – Missing or untested

---