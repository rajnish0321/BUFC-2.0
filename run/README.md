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

