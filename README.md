# LenaDena

A small app to remember who owes you money, and who you owe.

The name is from Urdu/Hindi: *lena* means taking, *dena* means giving. That give and take is the whole app.

## Why I am building this

I lend money to friends and family all the time. Small amounts. 500 here, 2000 there, "till salary" most of the time. Two months later nobody remembers the exact number, and asking again feels awkward. Sometimes a small fight starts over a number that was never written down.

I kept notes on my phone for a while. Then I tried some apps. Most of them wanted an account, or my data on their server, or they were built for shops tracking customer credit. That is not my problem. My problem is only this: Ali took 3000 in March, he returned 1000, so 2000 is left. That's it.

So LenaDena does that one job. No account. No server. Everything stays on the phone, where it belongs.

## What it does

- Add a person, tap gave or took, write the amount and a small note
- A running balance for every person, always up to date
- Full history with each person, so nothing is "he said, she said"
- Settle up when a balance is closed
- Share a clean summary on WhatsApp when it is time to settle
- A gentle reminder when a balance gets old
- A guide card on the home screen that looks at your book and tells you the one next step that makes sense — add a person, add a first entry, remind someone, or enjoy that everything is settled

Later, if this goes well: share a ledger with family or a small group, with access control like Google Sheets. First the simple version has to earn it.

## How the screens flow

Navigation is kept loose on purpose. You can start from anywhere:

- Home → add a person → the app takes you straight to their first entry
- Home → add an entry → pick a person on the spot if you have not yet
- A person's page → add entry, settle up, share summary, send a reminder
- Add-person and add-entry open as sheets, so one back tap always brings you home

## Tech stack

- React Native with Expo. I preview live on my Android phone with Expo Go, no heavy setup
- expo-router for screens (feels like Next.js, which is my day job world)
- expo-sqlite for the database on the phone itself (two tables: `people`, `entries`)
- Plain StyleSheet styling with a warm paper-notebook theme, close to Tailwind habits
- EAS Build when it is time to ship to the Play Store

## Run it on your phone

You need Node.js on your computer and the Expo Go app on your Android phone. Both on the same Wi-Fi.

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go. Change any file, save, and the phone updates in seconds. That is the whole setup.

## Status

MVP in progress. Building in the open, a few days at a time.
