# Vanguards MMA Academy — deployment guide

This version is a static website for GitHub Pages with Firebase Authentication and Firestore.
The website files are hosted by GitHub. Firebase handles real member accounts, the video catalogue,
and each student's completion progress.

## Before you publish

You need:
- A GitHub account and a repository for the website.
- A Firebase account/project: https://console.firebase.google.com/
- A video host such as YouTube or Vimeo.

**Important limitation:** GitHub Pages cannot run a private backend or securely store uploaded videos.
This project lets an administrator publish video links from the website's admin panel. Upload the
actual video to YouTube/Vimeo first, then paste its share link into the form. Do not commit large
video files or private credentials to GitHub.

## 1. Create and configure Firebase

1. Open https://console.firebase.google.com/ and create a project.
2. In Project settings → General → Your apps, add a Web app.
3. Copy the Firebase web configuration.
4. In `index.html`, find `const firebaseConfig = { ... }` and replace:
   - `PASTE_API_KEY_HERE`
   - `YOUR_PROJECT_ID`
   - `PASTE_APP_ID_HERE`
   with the values from Firebase. Keep the quotes and commas.
5. In Firebase Authentication → Sign-in method, enable **Email/Password**.
6. In Firestore Database, create a database. Start in production mode.
7. Open Firestore → Rules, replace the rules with the contents of `firestore.rules`, and publish.

## 2. Make your account the administrator

1. Run the site locally or deploy it after completing Firebase setup.
2. Create your account through **Join Academy**.
3. In Firebase Console → Authentication → Users, copy your account's **User UID**.
4. In `index.html`, replace `PASTE_YOUR_ADMIN_UID_HERE` inside `ADMIN_UIDS` with that UID.
5. In `firestore.rules`, replace the same placeholder in `isAdmin()` with that UID.
6. Publish the updated files to GitHub and wait for Pages to redeploy.

The admin UID is intentionally checked by Firestore Security Rules as well as by the interface.
Do not rely on hiding the admin button alone for security. Never let users edit their own role.

## 3. Upload the website to GitHub Pages

1. Create a GitHub repository, for example `vanguards-mma`.
2. Upload `index.html` and `firestore.rules` to the repository's root folder.
3. Open the repository → Settings → Pages.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then Save.
6. Wait for deployment. Your website address will look like:
   `https://YOUR-GITHUB-USERNAME.github.io/vanguards-mma/`

If you use a repository named `YOUR-GITHUB-USERNAME.github.io`, the address is:
`https://YOUR-GITHUB-USERNAME.github.io/`

## 4. Add a training video

Recommended method — YouTube Unlisted:

1. Open YouTube Studio → Create → Upload videos.
2. Select your video file and upload it.
3. Set Visibility to **Unlisted** and save/publish.
4. Copy the regular share URL, for example `https://youtu.be/VIDEO_ID`.
5. Open your website and log in with the administrator account.
6. Click **Admin Panel** → **Add a video**.
7. Enter the title, category, difficulty, duration, YouTube URL, description, takeaways and drill.
8. Click **Publish Video**. It will appear in the student library.

Unlisted videos are not listed publicly on your channel, but anyone with the URL can watch and share them.
For stronger content protection, use a paid video platform with domain/privacy restrictions. An ordinary
YouTube embed is not DRM and does not prevent screen recording.

Vimeo links are also accepted. A direct `.mp4` URL is accepted in the video form, but the file must
already be hosted at a public HTTPS URL that permits playback. A local computer path will not work.

## 5. Manage the academy website

- **Add:** Admin Panel → Add a video → Publish Video.
- **Edit:** Admin Panel → Video library → Edit.
- **Delete:** Admin Panel → Video library → Delete.
- **Students:** Users register with email/password. Firebase Authentication stores accounts.
- **Progress:** Students mark lessons complete; progress is saved under their own account.
- **Website text/design:** Edit `index.html`, then commit and push to GitHub. Pages redeploys automatically.

## 6. Test before sharing

- Create a normal student account and verify it can see the library.
- Verify a student cannot see the Admin Panel.
- Log in as the admin and publish a test lesson.
- Open the website in a private/incognito window and test signup/login.
- Test on a phone as well as a desktop browser.

## Notes

- Firebase web API keys are identifiers, not server secrets. Firestore Security Rules are what protect data.
- Never place service-account JSON, private API secrets, or admin passwords in this repository.
- The site requires internet access for Firebase, Google Fonts and the video provider.
- If you later want actual video file uploads directly from the admin panel, add Firebase Storage or a
  dedicated video service. Check the current Firebase billing/plan requirements before enabling Storage.
