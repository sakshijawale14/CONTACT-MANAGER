# Testing Guide - Contact Manager

## How to Test Frequently Accessed Contacts Feature

### Step-by-Step Testing Instructions:

1. **Start the Application**
   - Run `npm start` in the contact directory
   - Login or register a new account
   - Navigate to the Dashboard

2. **Add Some Contacts**
   - Click "Add Contact" button
   - Add at least 3-4 contacts with different information
   - Save each contact

3. **Test Frequent Access Tracking**
   - **Click on any contact card** (this increments the access count)
   - Click the same contact **4-5 times** (clicking opens the edit modal, which tracks access)
   - After clicking a contact **more than 3 times**, you should see:
     - A purple "Frequent" badge on the top-left of the contact card
     - The card background changes to a purple/pink gradient
     - Text showing "Accessed X times" below the email

4. **Check Frequently Accessed Section**
   - Scroll to the top of the dashboard
   - Look for the "Frequently Accessed" section (appears after contacts have been accessed)
   - The top 5 most frequently accessed contacts will appear here
   - They are sorted by access count (highest first)

5. **Test Sorting by Frequency**
   - In the search/sort bar, select "Most Frequent" from the dropdown
   - All contacts will be sorted by access count (most frequent first)

6. **Verify in Browser Console (Optional)**
   - Open browser DevTools (F12)
   - Go to Application/Storage > Local Storage
   - Find your user's contact data
   - Check that contacts have `accessCount` and `lastAccessed` fields
   - The `accessCount` should increase each time you click a contact

### Visual Indicators:

- **Frequent Badge**: Purple/pink gradient badge with "Frequent" text (top-left of card)
- **Card Styling**: Purple border and gradient background for frequent contacts
- **Access Count**: Shows "Accessed X times" text below email
- **Stats Card**: "Frequent" stat card shows count of frequent contacts

### Expected Behavior:

- Each click on a contact card increments `accessCount` by 1
- Contacts with `accessCount > 3` are marked as "Frequent"
- Frequent contacts appear in the "Frequently Accessed" section
- The feature persists across page refreshes (stored in localStorage)

---

## Additional Features Testing

### Quick Actions (Copy, Call, Email)
- Hover over a contact card
- You'll see quick action buttons appear:
  - **Phone**: Call button (opens phone dialer) and Copy button
  - **Email**: Email button (opens email client) and Copy button
- Click copy buttons to copy phone/email to clipboard
- Green checkmark appears when copied successfully

### Export/Import
- Click "Export/Import" button in Dashboard
- **Export as JSON**: Downloads all contacts as JSON file
- **Export as CSV**: Downloads all contacts as CSV file
- **Import from JSON**: Upload a previously exported JSON file
- Duplicate contacts (by email) are automatically skipped during import

### Duplicate Detection
- Click "Find Duplicates" button
- System checks for duplicates by:
  - Email address
  - Phone number
  - Name (with similar details)
- Review duplicate results
- Click "Merge & Remove" to keep first contact and delete duplicates

---

## Troubleshooting

**Frequent badge not showing?**
- Make sure you've clicked the contact card at least 4 times
- Check browser console for any errors
- Verify localStorage is working (check Application tab in DevTools)

**Access count not incrementing?**
- Ensure you're clicking directly on the contact card (not just buttons)
- Check that `incrementAccessCount` is being called (check console)
- Refresh the page and try again

**Frequently Accessed section empty?**
- You need at least one contact with `accessCount > 0`
- Click on contacts multiple times to build up access counts
- The section only shows top 5, so make sure your contacts have different access counts

