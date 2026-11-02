# Project CALM: Hosting & Handover Guide

This guide covers everything needed to put the Project CALM website live on **Hostinger** and run it day to day. It also covers managing the doctor videos and QR codes.

You don't need to write any code. Every step is done in Hostinger's control panel (hPanel) and on the site's own admin page.

---

## 1. What the website is

| | |
|---|---|
| **Built with** | Next.js 16 (React 19), TypeScript, Tailwind CSS |
| **Runs on** | Node.js **20.9 or newer** (22 or 24 recommended) |
| **Database** | MySQL. It only stores the doctor-video list. |
| **Pages** | Home (`/`), Treatment (`/treatment`), Resources (`/resources`), one page per doctor QR (`/resources/<doctor>`), and Admin (`/admin`) |

> ⚠️ **This is not a plain HTML site.** It needs a host that can **run Node.js**. Uploading the files to `public_html` will not work.

---

## 2. What you need before starting

- [ ] A Hostinger plan that supports **Node.js Web Apps**. That's **Business Web Hosting** or any **Cloud** plan. In hPanel, check that **Add Website** offers a **Node.js Web App** option. (A VPS also works but needs manual server setup; see section 9.)
- [ ] The domain the site will use, e.g. `www.yourdomain.com`
- [ ] Access to the code: the GitHub repository, or the zip file of it
- [ ] An admin PIN of your choosing. **Don't use 1234**, which is the built-in default.

---

## 3. Create the database (about 2 minutes)

1. In hPanel, open **Databases → MySQL Databases**.
2. Create a new database. Write down the four values Hostinger shows you:

   | Hostinger shows | Example | You'll enter it as |
   |---|---|---|
   | Database name | `u123456789_calm` | `DB_NAME` |
   | Username | `u123456789_calm` | `DB_USER` |
   | Password | *(the one you set)* | `DB_PASSWORD` |
   | Host | usually `localhost` | `DB_HOST` |

You don't need to create any tables or import anything. **The site sets up the database by itself** the first time it runs, and fills it with every video already in the code.

---

## 4. Deploy the website

### Option A: From GitHub (recommended, so updates deploy automatically)

1. In hPanel, go to **Websites → Add Website → Node.js Web App**.
2. Choose **Import Git repository / GitHub**, sign in to GitHub, and pick this repository with branch **`main`**.
3. Hostinger detects Next.js and fills in the build settings. Check they match:

   | Setting | Value |
   |---|---|
   | Framework | Next.js |
   | Node.js version | **22** (or 24; 20 also works) |
   | Install command | `npm install` |
   | Build command | `npm run build` |
   | Output directory | `.next` |
   | Start command | `npm start` (Hostinger may fill in `next start`; both are fine) |

   **Don't choose a "static export" option.** The admin page and doctor QR pages need the server.

4. Open **Environment Variables** and add these (all names in capitals, exactly as written):

   | Name | Value |
   |---|---|
   | `ADMIN_PIN` | Your chosen admin PIN |
   | `NEXT_PUBLIC_SITE_URL` | Your live address, e.g. `https://www.yourdomain.com` (no `/` at the end) |
   | `DB_HOST` | From step 3 (usually `localhost`) |
   | `DB_PORT` | `3306` |
   | `DB_NAME` | From step 3 |
   | `DB_USER` | From step 3 |
   | `DB_PASSWORD` | From step 3 |

   The file `.env.example` in the code lists the same settings.

5. Click **Deploy** and wait for the build to finish, usually 2–5 minutes.
6. Connect your domain to the app and turn on **SSL** (free) in hPanel.

### Option B: From the zip file

Same as Option A, but choose **Upload files / zip** in step 2 instead of GitHub. Every later update means uploading a new zip, so GitHub is easier in the long run.

---

## 5. Check that everything works

After the first deploy, go through this list:

- [ ] The home page loads, and the artery video plays as you scroll.
- [ ] `/resources` shows the doctor videos under **"Hear It From Your Doctors"**.
- [ ] Open `/admin`, enter your PIN, and look under the video count. It must say **🟢 "Saved in: database"**.
  - If it says **🟠 "Saved in: … local file"**, the `DB_` settings are missing or misspelled. Fix them and redeploy.
- [ ] Add a test video from `/admin`, then **redeploy** the app. The test video must still be there. Delete it afterwards.
- [ ] Download one doctor's QR code from `/admin` and scan it with a phone. It should open `https://yourdomain.com/resources/<doctor-name>`.

---

## 6. Managing doctor videos (`/admin`)

Go to `https://yourdomain.com/admin` and enter the admin PIN. The PIN is never saved in the browser, so you're asked for it each visit.

### Add videos
1. Click **New Resource** and paste YouTube links, one per line (up to 25 at once).
2. **Generate QR** switch:
   - **On:** all the videos in this upload go under **one doctor with one QR code**. Type the doctor's name, or leave it blank to take it from the first video's title.
   - **Off:** the videos only appear in the general list, with no QR page.
3. Click **Upload**. The title, thumbnail, views, likes, length and upload date come from YouTube automatically.

> **One QR per doctor:** to give each doctor their own QR code, upload **each doctor's videos separately**, with Generate QR on each time.

> **Videos must be Public or Unlisted on YouTube.** Private videos are refused, because visitors couldn't play them.

### Other actions (icons on each video row)
| Icon | What it does |
|---|---|
| ✏️ **Edit** | Change the doctor name (and Hindi name), title or QR on/off, swap the YouTube link, or add more videos for the same doctor |
| ▦ **QR** | Shows the doctor's QR code: **Download PNG** for print, or **Copy link** |
| 🗑 **Remove** | Deletes the video from the site |
| ↑ ↓ or drag | Sets the order the videos appear on the Resources page |

> **A printed QR code keeps working after edits.** The link inside a QR is fixed when the doctor is first added, so renaming the doctor or changing the title later won't break printed codes.

---

## 7. Updating the website later

- **Code or text changes** (made by a developer): when they're pushed to GitHub branch `main`, Hostinger rebuilds and redeploys automatically with Option A. With Option B, upload the new zip.
- **Videos** are managed only through `/admin`. They're stored in the database, so redeploys **never** remove or reset them.
- After changing an environment variable, **redeploy**. `NEXT_PUBLIC_SITE_URL` especially only takes effect after a rebuild.

---

## 8. Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| Admin says *"Couldn't reach the video database…"* | A `DB_` value is wrong. Re-check host, name, user and password against hPanel → MySQL Databases, then redeploy. |
| Admin shows **"Saved in: … local file"** on the live site | `DB_HOST`, `DB_NAME` or `DB_USER` isn't set. Add them and redeploy. |
| Videos added in admin disappear after a redeploy | Same as above: the site isn't using the database. |
| Resources page loads but shows no videos | The database couldn't be reached when the page loaded. Check the `DB_` settings. |
| *"Wrong PIN."* | The PIN is the `ADMIN_PIN` value set in Hostinger. If it was never set, it's `1234`, so set one. |
| *"Couldn't find that video on YouTube"* | The video is private or deleted. Make it Public or Unlisted. |
| QR codes point to the wrong address | Set `NEXT_PUBLIC_SITE_URL` to the live domain and **redeploy**. Codes downloaded before the fix need downloading again. |
| Build fails with a Node.js version error | Set the app's Node.js version to 22 in hPanel. |

---

## 9. (Alternative) Hosting on a VPS

If you're using a Hostinger **VPS** instead of a Node.js Web App:

```bash
# On an Ubuntu VPS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
sudo apt install -y nodejs nginx mysql-server
sudo npm install -g pm2

git clone <repository-url> project-calm && cd project-calm
cp .env.example .env.local      # then fill in the values (see section 4)
npm install
npm run build
pm2 start npm --name project-calm -- start
pm2 save && pm2 startup
```

Then point Nginx at `http://localhost:3000` for your domain and add free SSL with `certbot --nginx`.

---

## 10. For developers: running it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Without `DB_` settings, the site reads and writes the video list in `data/doctor-videos.json`, so no database is needed locally. The admin PIN defaults to `1234` locally. If a database is configured and empty, this same file seeds it on first run.
