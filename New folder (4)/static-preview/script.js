// Initialize map
let map;
let userMarker;
let busStops = [];
let currentLocation = null;
let trackingMap;
let vehicleMarker;
let trackingInterval;
let notifications = [];
let searchMarker;
let routeLayer;
let watchId = null;

// OpenWeatherMap API key (free tier)
const WEATHER_API_KEY = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key

// Transport icons
const transportIcons = {
    bus: L.divIcon({
        className: 'transport-icon bus-icon',
        html: '<i class="material-icons">directions_bus</i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    }),
    train: L.divIcon({
        className: 'transport-icon train-icon',
        html: '<i class="material-icons">train</i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    }),
    metro: L.divIcon({
        className: 'transport-icon metro-icon',
        html: '<i class="material-icons">subway</i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    })
};

// Initialize the map when the page loads
function initMap() {
    // Default center (India)
    const defaultLocation = [20.5937, 78.9629];
    
    map = L.map('map').setView(defaultLocation, 5);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Initialize tracking map
    trackingMap = L.map('tracking-map').setView(defaultLocation, 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(trackingMap);

    // Get user's location
    getUserLocation();
}

// Get user's current location
function getUserLocation() {
    if (navigator.geolocation) {
        // Show loading state
        document.getElementById('current-location').textContent = 'Getting your location...';
        
        // Get initial position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                updateUserLocation([position.coords.latitude, position.coords.longitude]);
                
                // Start watching position for updates
                watchId = navigator.geolocation.watchPosition(
                    (position) => {
                        updateUserLocation([position.coords.latitude, position.coords.longitude]);
                    },
                    (error) => {
                        console.error('Error watching location:', error);
                        addNotification('Error updating location', 'error');
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                    }
                );
            },
            (error) => {
                console.error('Error getting location:', error);
                document.getElementById('current-location').textContent = 'Location access denied';
                addNotification('Please enable location access to use this feature', 'error');
            }
        );
    } else {
        document.getElementById('current-location').textContent = 'Geolocation not supported';
        addNotification('Your browser does not support geolocation', 'error');
    }
}

// Update user location on map
function updateUserLocation(location) {
    currentLocation = location;
    
    // Center map on user's location
    map.setView(location, 13);
    
    // Update or create user marker
    if (userMarker) {
        userMarker.setLatLng(location);
    } else {
        userMarker = L.circleMarker(location, {
            radius: 8,
            fillColor: "#4285F4",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 1
        }).addTo(map);

        // Add popup to user marker
        userMarker.bindPopup("Your Current Location").openPopup();
    }

    // Update location text
    updateLocationText(location);
    
    // Get weather information
    getWeatherInfo(location);
    
    // Find nearby transport stops
    findNearbyTransportStops(location);
}

// Get weather information
function getWeatherInfo(location) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location[0]}&lon=${location[1]}&units=metric&appid=${WEATHER_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('temperature').textContent = Math.round(data.main.temp);
            document.getElementById('weather-description').textContent = data.weather[0].description;
            document.getElementById('humidity').textContent = data.main.humidity;
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            document.getElementById('weather-details').innerHTML = '<p>Weather information unavailable</p>';
        });
}

// Update location text with address using Nominatim (OpenStreetMap's geocoding service)
function updateLocationText(location) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${location[0]}&lon=${location[1]}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('current-location').textContent = data.display_name;
        })
        .catch(error => {
            console.error('Error getting address:', error);
            document.getElementById('current-location').textContent = 'Location found, but address unavailable';
        });
}

// Initialize location search
function initLocationSearch() {
    const input = document.getElementById('location-search');
    const findRoutesBtn = document.getElementById('find-routes');
    
    // Handle Enter key press
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchLocation(input.value);
        }
    });

    // Handle Find Routes button click
    findRoutesBtn.addEventListener('click', () => {
        searchLocation(input.value);
    });

    // Add "Use Current Location" button
    const searchContainer = document.querySelector('.search-container');
    const currentLocationBtn = document.createElement('button');
    currentLocationBtn.className = 'secondary-button';
    currentLocationBtn.innerHTML = '<span class="material-icons">my_location</span> Use Current Location';
    currentLocationBtn.addEventListener('click', () => {
        if (currentLocation) {
            updateUserLocation(currentLocation);
            addNotification('Location updated to current position', 'info');
        } else {
            getUserLocation();
        }
    });
    searchContainer.appendChild(currentLocationBtn);
}

// Search location and find nearby transport
function searchLocation(searchText) {
    if (!searchText) return;

    // Use Nominatim for geocoding
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchText)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const location = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                
                // Update map center
                map.setView(location, 13);
                
                // Update current location
                currentLocation = location;

                // Update user marker
                if (userMarker) {
                    userMarker.setLatLng(location);
                } else {
                    userMarker = L.circleMarker(location, {
                        radius: 8,
                        fillColor: "#4285F4",
                        color: "#fff",
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 1
                    }).addTo(map);
                }

                // Add search marker
                if (searchMarker) {
                    searchMarker.remove();
                }
                searchMarker = L.marker(location).addTo(map);
                searchMarker.bindPopup(`<b>Searched Location:</b><br>${data[0].display_name}`).openPopup();

                // Update location text
                updateLocationText(location);
                
                // Get weather information
                getWeatherInfo(location);
                
                // Find nearby transport stops
                findNearbyTransportStops(location);

                // Add notification
                addNotification(`Location updated to: ${data[0].display_name}`, 'info');
            }
        })
        .catch(error => {
            console.error('Error searching location:', error);
            alert('Error finding location. Please try again.');
        });
}

// Find nearby transport stops
function findNearbyTransportStops(location) {
    // Clear existing markers
    busStops.forEach(marker => marker.remove());
    busStops = [];

    // Mock data for demonstration (in real app, this would come from a transport API)
    const transportStops = [
        {
            type: 'bus',
            name: 'Bus Stop 1',
            location: [location[0] + 0.01, location[1] + 0.01],
            routes: ['101', '202'],
            nextArrival: '5 mins'
        },
        {
            type: 'train',
            name: 'Train Station 1',
            location: [location[0] - 0.01, location[1] - 0.01],
            routes: ['303', '404'],
            nextArrival: '8 mins'
        },
        {
            type: 'metro',
            name: 'Metro Station 1',
            location: [location[0] + 0.02, location[1] - 0.01],
            routes: ['505', '606'],
            nextArrival: '12 mins'
        }
    ];

    // Add markers for transport stops
    transportStops.forEach(stop => {
        const marker = L.marker(stop.location, {
            icon: transportIcons[stop.type]
        }).addTo(map);

        // Create popup content
        const popupContent = `
            <div class="transport-popup">
                <h3>${stop.name}</h3>
                <p><strong>Type:</strong> ${stop.type.charAt(0).toUpperCase() + stop.type.slice(1)}</p>
                <p><strong>Routes:</strong> ${stop.routes.join(', ')}</p>
                <p><strong>Next Arrival:</strong> ${stop.nextArrival}</p>
                <button onclick="trackRoute('${stop.routes[0]}')" class="track-btn">Track Route</button>
            </div>
        `;

        // Add popup to marker
        marker.bindPopup(popupContent);

        busStops.push(marker);
    });

    // Find and display nearest stop
    const nearestStop = findNearestStop(location, transportStops);
    document.getElementById('nearest-stop').textContent = `${nearestStop.name} (${nearestStop.nextArrival})`;
}

// Track specific route
function trackRoute(routeId) {
    // Clear existing tracking
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }
    if (vehicleMarker) {
        vehicleMarker.remove();
    }

    // Mock route data (in real app, this would come from a transport API)
    const routeData = {
        '101': { name: 'Bus Route 101', stops: ['Stop 1', 'Stop 2', 'Stop 3'] },
        '202': { name: 'Bus Route 202', stops: ['Stop 4', 'Stop 5', 'Stop 6'] },
        '303': { name: 'Train Route 303', stops: ['Station 1', 'Station 2', 'Station 3'] },
        '404': { name: 'Train Route 404', stops: ['Station 4', 'Station 5', 'Station 6'] },
        '505': { name: 'Metro Route 505', stops: ['Metro 1', 'Metro 2', 'Metro 3'] },
        '606': { name: 'Metro Route 606', stops: ['Metro 4', 'Metro 5', 'Metro 6'] }
    };

    const route = routeData[routeId];
    if (!route) return;

    // Update tracking info
    document.getElementById('tracking-route-name').textContent = route.name;
    document.getElementById('next-stop').textContent = route.stops[0];
    document.getElementById('eta').textContent = '5 mins';

    // Create vehicle marker
    vehicleMarker = L.circleMarker(currentLocation, {
        radius: 8,
        fillColor: "#FF5722",
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    }).addTo(trackingMap);

    // Center tracking map
    trackingMap.setView(currentLocation, 13);

    // Simulate vehicle movement
    let currentStop = 0;
    trackingInterval = setInterval(() => {
        // Move vehicle
        const newPosition = [
            currentLocation[0] + (Math.random() - 0.5) * 0.001,
            currentLocation[1] + (Math.random() - 0.5) * 0.001
        ];
        vehicleMarker.setLatLng(newPosition);

        // Update next stop
        currentStop = (currentStop + 1) % route.stops.length;
        document.getElementById('next-stop').textContent = route.stops[currentStop];
        document.getElementById('eta').textContent = `${Math.floor(Math.random() * 10) + 1} mins`;

        // Add notification for stop arrival
        if (currentStop === 0) {
            addNotification(`Vehicle has arrived at ${route.stops[currentStop]}`, 'info');
        }
    }, 5000);

    // Add notification
    addNotification(`Now tracking ${route.name}`, 'info');
}

// Add notification
function addNotification(message, type = 'info') {
    const notification = {
        id: Date.now(),
        message,
        type,
        time: new Date()
    };

    notifications.unshift(notification);
    updateNotificationPanel();
    updateNotificationBadge();

    // Show browser notification if permitted
    if (Notification.permission === 'granted') {
        new Notification('Public Transport Update', {
            body: message,
            icon: '/path/to/icon.png' // Add your icon path
        });
    }
}

// Update notification panel
function updateNotificationPanel() {
    const notificationList = document.getElementById('notification-list');
    notificationList.innerHTML = '';

    notifications.forEach(notification => {
        const item = document.createElement('div');
        item.className = `notification-item ${notification.type}`;
        item.innerHTML = `
            <h4>${notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}</h4>
            <p>${notification.message}</p>
            <div class="time">${notification.time.toLocaleTimeString()}</div>
        `;
        notificationList.appendChild(item);
    });
}

// Update notification badge
function updateNotificationBadge() {
    const badge = document.getElementById('notification-count');
    badge.textContent = notifications.length;
    badge.style.display = notifications.length > 0 ? 'block' : 'none';
}

// Initialize notification system
function initNotifications() {
    const notificationBtn = document.getElementById('notification-btn');
    const notificationPanel = document.getElementById('notification-panel');
    const clearBtn = document.getElementById('clear-notifications');

    // Toggle notification panel
    notificationBtn.addEventListener('click', () => {
        notificationPanel.classList.toggle('active');
    });

    // Clear notifications
    clearBtn.addEventListener('click', () => {
        notifications = [];
        updateNotificationPanel();
        updateNotificationBadge();
    });

    // Request notification permission
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
}

// Track route button click handler
document.querySelectorAll('.track-button').forEach(button => {
    button.addEventListener('click', function() {
        const routeCard = this.closest('.route-card');
        const routeName = routeCard.querySelector('h3').textContent;
        alert(`Tracking started for ${routeName}`);
        // In a real app, this would start real-time tracking of the selected route
    });
});

// Initialize everything when the page loads
window.onload = function() {
    initMap();
    initLocationSearch();
    initNotifications();

    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Simple form handling
    document.querySelector('.login-form form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Login functionality will be implemented in the full version');
    });

    // Add active class to navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}; 