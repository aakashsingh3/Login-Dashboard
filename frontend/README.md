# Frontend - React Application

Modern React application with authentication and productivity tools.

## 🚀 Features

- **Authentication UI** (Login, Register, Password Reset)
- **Google OAuth** integration
- **Protected Routes** with authentication guards
- **Responsive Dashboard** with profile management
- **Password Generator** tool
- **Currency Converter** with live rates

## 🛠️ Tech Stack

- React 18+ with hooks
- Vite for build tooling
- Tailwind CSS for styling
- Context API for state management
- React Router for navigation

## 📦 Installation

```
cd frontend
npm install
```

## 🔧 Environment Variables

Create `.env` file:

VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id



## 📁 Project Structure

```
src/
├── components/ # React components
├── context/ # Context API providers
├── hooks/ # Custom hooks
├── utils/ # Utility functions
└── App.jsx # Main app component
```


## 🔗 API Integration

The frontend communicates with the backend API at `/api` endpoints for authentication and data management.

