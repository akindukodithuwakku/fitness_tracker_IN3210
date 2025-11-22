Core required features
    User authentication
        Registration screen with form validation
        Login screen with form validation
        Store authentication state (secure local storage)
        Display logged-in user's name/username in header/profile
        Navigate to home screen after successful login
    Navigation structure
        Bottom Tab Navigation (or Stack/Drawer)
        Screens: Home, Favourites, Profile/Settings
    Home screen (dynamic item list)
        Fetch exercises/workouts from API (API Ninjas Fitness API)
        Display items as cards with:
        Image/Icon
        Title
        Description or status (e.g., "Active", "Popular", "Beginner")
        Pull-to-refresh functionality
    Item details screen
        Show full details when user taps an item
        Display exercise information, instructions, etc.
        Option to add/remove from favourites
    State management
        Implement Redux Toolkit for global state
        Manage: authentication state, favourites list, API data
    Favourites
        Mark items as favourites from home/details screen
        Separate Favourites screen to view saved items
        Persist favourites data (AsyncStorage or similar)
        Remove from favourites functionality
    Styling and UI
        Consistent, clean design
        Use Feather Icons for all icons
        Responsive design for different screen sizes
        Modern, user-friendly interface