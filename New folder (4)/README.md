# Public Transport Management System

A real-time public transport schedule and complaint management system that helps users track buses/trains, view schedules, and report issues.

## Features

- Real-time schedule viewing
- Route finder with optimal path suggestions
- Live vehicle tracking
- Favorite routes management
- Push notifications for delays and updates
- Comprehensive complaint management system
- Admin dashboard for fleet management

## Tech Stack

### Frontend
- React.js
- Material-UI
- Redux for state management
- Google Maps API
- Socket.io for real-time updates

### Backend
- Node.js with Express
- MongoDB
- Socket.io
- JWT Authentication
- Firebase for notifications

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server
cd frontend
npm start
```

## Project Structure

```
├── frontend/               # React frontend application
│   ├── public/            # Static files
│   └── src/              # Source files
│       ├── components/   # React components
│       ├── pages/       # Page components
│       ├── redux/       # Redux store and actions
│       └── utils/       # Utility functions
│
├── backend/              # Node.js backend application
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
│
└── README.md           # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 