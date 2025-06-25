
# Real Estate CRM Mobile App

This is the React Native mobile version of the Real Estate CRM application. It connects to the same backend as the web application and works with the same Supabase database.

## Features

- Authentication (login, signup, profile management)
- Client/lead management
- Calendar and appointment scheduling
- Messaging with clients
- Integrated with Supabase and FastAPI backend

## Getting Started

### Prerequisites

- Node.js (LTS version)
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. Clone the repository
2. Navigate to the mobile directory:
```bash
cd mobile
```
3. Install dependencies:
```bash
npm install
#install Node.js first
#/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
#brew install node
#node --version
#npm --version
#npm install
#npm install -g npm@11.4.1
#brew update
#brew install watchman
```

### Running the App

```bash
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open in iOS simulator (Mac only)
- Press `a` to open in Android emulator
- Scan the QR code with the Expo Go app on your physical device

### Environment Configuration

Update the `.env` file with your actual API URL and Supabase credentials:

```
API_URL=http://your-api-url/api
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

- `/src/screens` - All application screens
- `/src/components` - Reusable UI components
- `/src/contexts` - React contexts including authentication
- `/src/lib` - Utility libraries and API clients
- `/src/navigation` - Navigation configuration

## Integration with Backend

This mobile app uses the same FastAPI backend and Supabase database as the web application. The API routes are the same, ensuring consistent data across both platforms.

## Building for Production

To build the app for production deployment:

```bash
expo build:android
```

or 

```bash
expo build:ios
```

Follow the Expo prompts to complete the build process.
