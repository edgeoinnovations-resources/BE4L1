# Google Apps Script Setup — Big Era 4 Email Backend

## What This Does
When students click "Send My Work" on the lesson page, their responses are sent to a tiny free web app on your personal Google account, which then forwards a beautifully formatted email to the selected teacher's school inbox at asdubai.org.

## One-Time Setup (Takes ~3 minutes)

### Step 1: Open Google Apps Script
1. Go to [https://script.google.com](https://script.google.com)
2. Make sure you're logged in as **paul.strootman@gmail.com**
3. Click **"New project"** (the big + button)

### Step 2: Paste the Code
1. You'll see a file called `Code.gs` with some default code
2. **Select all** the default code and **delete it**
3. Open the file called `google-apps-script.js` (provided with this package)
4. **Copy the entire contents** and **paste** it into the `Code.gs` editor
5. Click the floppy disk icon (or Ctrl+S) to **save**
6. Name the project something like "Big Era 4 Email Backend"

### Step 3: Deploy as Web App
1. Click **Deploy** → **New deployment** (top right)
2. Click the gear icon next to "Select type" → choose **Web app**
3. Set these options:
   - **Description:** "Big Era 4 Student Submissions"
   - **Execute as:** "Me" (paul.strootman@gmail.com)
   - **Who has access:** "Anyone"
4. Click **Deploy**
5. Google will ask you to authorize — click **"Authorize access"**
   - Choose your personal Google account
   - If you see "Google hasn't verified this app," click **"Advanced"** → **"Go to Big Era 4 Email Backend (unsafe)"**
   - Click **"Allow"**
6. You'll see a **Web app URL** — it looks like:
   `https://script.google.com/macros/s/AKfycbx.../exec`
7. **Copy this URL** — you need it for the next step!

### Step 4: Update the Webpage
1. Open the `index.html` file
2. Find the line that says: `GOOGLE_APPS_SCRIPT_URL`
3. Replace it with the URL you copied in Step 3
4. Save the file and push to GitHub

### Step 5: Test It
1. Go to your GitHub Pages site
2. Fill in a test student name, pick a teacher, enter a section
3. Do at least one activity
4. Click "Send My Work"
5. Check the teacher's school email — the formatted submission should arrive within a minute

## How the Email Routing Works

```
Student clicks "Send" → GitHub Pages → Google Apps Script (your personal Gmail) → Teacher's school email
```

- **Students see:** A dropdown with teacher names (no email addresses visible)
- **Teachers receive:** A formatted email in their asdubai.org inbox
- **Your Gmail:** Sends the email on behalf of the system (teachers see it came from your Gmail)

## Teacher Email Configuration

These are pre-configured in the script:
| Teacher | Email |
|---------|-------|
| Ms. Singh | psingh@asdubai.org |
| Mr. Ghammoh | ggammoh@asdubai.org |
| Mr. Strootman | pstrootman@asdubai.org |

To add or change teachers, edit the `TEACHER_EMAILS` object at the top of the Apps Script code and also update the dropdown in `index.html`.

## Troubleshooting

**"Send failed" error:**
- Make sure the Apps Script URL is correct in index.html
- Make sure the Apps Script is deployed as "Anyone" access
- Check your Gmail's sent folder — if emails appear there, the script is working

**Teacher not receiving emails:**
- Check the teacher's spam/junk folder
- The email comes from paul.strootman@gmail.com — the school email filter might need to whitelist it
- Try sending a test to your own school email first

**Need to update the script:**
1. Go to script.google.com
2. Open the project
3. Make changes
4. Click Deploy → Manage deployments → Edit (pencil icon) → Version: "New version" → Deploy
