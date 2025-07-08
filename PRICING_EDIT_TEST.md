# Pricing Edit Feature Test Plan

## Test Case 1: Manual Price Override
- [ ] Click edit button next to any room rate
- [ ] Modify direct price (e.g., KNP1 from $107 to $99)
- [ ] Save changes successfully
- [ ] Verify new price appears in green with "Custom" label
- [ ] Check accommodation page reflects new pricing

## Test Case 2: Price History Tracking
- [ ] API stores original auto-calculated price
- [ ] API stores custom override price
- [ ] API tracks modification timestamp
- [ ] API records who made the change

## Test Case 3: Sunday Auto-Review
- [ ] Custom prices marked for Sunday review
- [ ] System flags manual overrides older than 7 days
- [ ] Admin gets notification of pending price reviews
- [ ] Option to keep custom price or revert to auto-calculation

## Test Case 4: Data Integrity
- [ ] Custom prices never exceed Airbnb rates
- [ ] Minimum 5% discount maintained from Airbnb
- [ ] Savings calculations update correctly
- [ ] Price changes reflect across all pages immediately

## API Endpoints to Test:
- PATCH `/api/admin/pricing/override` - Set custom price
- GET `/api/admin/pricing/history` - View price changes
- POST `/api/admin/pricing/review` - Sunday review process