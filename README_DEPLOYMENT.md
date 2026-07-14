# Store Intelligence - Deployment Guide

This guide explains how to deploy the Store Intelligence Full-Stack Next.js application from scratch on any new account (e.g., your office account).

## Prerequisites
You will need three free accounts:
1. **GitHub** (For hosting the code and running the daily scraper)
2. **Supabase** (For the free PostgreSQL database)
3. **Vercel** (For hosting the live website)

---

## Step 1: Database Setup (Supabase)
1. Go to [Supabase.com](https://supabase.com/) and create a new project.
2. Once the project is created, go to the **SQL Editor** on the left menu.
3. Open the `supabase_setup.sql` file included in this folder, copy all the code, paste it into the SQL Editor, and click **RUN**. (This creates the `daily_stats` table).
4. Go to **Project Settings (Gear Icon) -> API**. Keep this page open. You will need:
   - `Project URL`
   - `anon / public` key
   - `service_role / secret` key

---

## Step 2: Code Hosting & Automation (GitHub)
1. Go to [GitHub.com](https://github.com/) and create a new repository (e.g., `store-intelligence-office`). *Do not initialize it with a README or .gitignore*.
2. Open PowerShell/CMD on your computer, navigate to this project's folder, and run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_OFFICE_USERNAME/store-intelligence-office.git
   git push -u origin main
   ```
3. Now, go to your repository on GitHub.com. Go to **Settings -> Secrets and variables -> Actions**.
4. Click **New repository secret** and add:
   - Name: `NEXT_PUBLIC_SUPABASE_URL` | Secret: (Paste your Supabase Project URL)
   - Name: `SUPABASE_SERVICE_ROLE_KEY` | Secret: (Paste your Supabase service_role key)
*(This step ensures that the automated script runs every night at 12:00 AM to fetch Google Play data and securely saves it to your database).*

---

## Step 3: Website Hosting (Vercel)
1. Go to [Vercel.com](https://vercel.com/) and login with your office GitHub account.
2. Click **Add New -> Project** and select the repository you just created.
3. In the "Configure Project" screen, open the **Environment Variables** section and add:
   - Name: `NEXT_PUBLIC_SUPABASE_URL` | Value: (Paste your Supabase Project URL)
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Value: (Paste your Supabase anon/public key)
4. Click **Deploy**.

Congratulations! The app is now live, and the background tracker is fully automated.

---
### Technical Notes on the Daily Tracker
The GitHub Actions file is located at `.github/workflows/daily_scrape.yml`. 
It runs the Node.js script located at `scripts/daily_tracker.js`.
The script is configured to fetch the Top 50 apps for 5 major categories every day at Midnight UTC. You can change `NUM_APPS_PER_CATEGORY` inside `scripts/daily_tracker.js` if you wish to track more apps.
