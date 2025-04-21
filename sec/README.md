# Campus Eats Flow

A food ordering system for campus dining.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

### Supabase Configuration

This project uses Supabase for authentication and database. To set up the project on a new computer:

1. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Replace `your_supabase_url` and `your_supabase_anon_key` with your actual Supabase project credentials.

3. If you don't have a Supabase project:
   - Go to [Supabase](https://supabase.com/) and create an account
   - Create a new project
   - Get the URL and anon key from the project settings
   - Add them to your `.env` file

### Running the Application

1. Start the development server:
   ```
   npm start
   ```
   or
   ```
   yarn start
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Troubleshooting

### Login Issues

If you're experiencing login issues when transferring the project to another computer:

1. Make sure the `.env` file is properly configured with the correct Supabase credentials
2. Check the browser console for any error messages
3. Clear your browser's local storage and cookies for the application
4. Restart the development server

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/324e70de-8db3-46c2-95f0-7ddc66719c92

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/324e70de-8db3-46c2-95f0-7ddc66719c92) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/324e70de-8db3-46c2-95f0-7ddc66719c92) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes it is!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
