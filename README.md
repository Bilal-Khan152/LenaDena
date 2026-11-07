# LenaDena

A small app to remember who owes you money, and who you owe.

The name is from Urdu/Hindi: *lena* means taking, *dena* means giving. That give and take is the whole app.

## Why I am building this

I lend money to friends and family all the time. Small amounts. 500 here, 2000 there, "till salary" most of the time. Two months later nobody remembers the exact number, and asking again feels awkward. Sometimes a small fight starts over a number that was never written down.

I kept notes on my phone for a while. Then I tried some apps. Most of them wanted an account, or my data on their server, or they were built for shops tracking customer credit. That is not my problem. My problem is only this: Ali took 3000 in March, he returned 1000, so 2000 is left. That's it.

So LenaDena does that one job. No account. No server. Everything stays on the phone, where it belongs.

## What it will do

- Add a person, tap gave or took, write the amount and a small note
- A running balance for every person, always up to date
- Full history with each person, so nothing is "he said, she said"
- Settle up when a balance is closed
- Share a clean summary on WhatsApp when it is time to settle
- A gentle reminder when a balance gets old

Later, if this goes well: share a ledger with family or a small group, with access control like Google Sheets. First the simple version has to earn it.

## Tech stack

- React Native with Expo. I preview live on my Android phone with Expo Go, no heavy setup
- expo-router for screens (feels like Next.js, which is my day job world)
- expo-sqlite for the database on the phone itself
- NativeWind for styling, because Tailwind is what my hands know
- EAS Build when it is time to ship to the Play Store

## Status

Just started. Building in the open, a few days at a time.
