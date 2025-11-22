# Network Request Failed - Troubleshooting Guide

## What I Fixed

1. **Added Better Error Handling** (`services/api.ts`)
   - Added timeout configuration (10 seconds)
   - Added abort controller for request cancellation
   - Improved error messages
   - Added console logging for debugging

2. **Added Android Network Permissions** (`app.json`)
   - Added INTERNET permission
   - Added ACCESS_NETWORK_STATE permission
   - Enabled cleartext traffic (for development)

3. **Added API Connection Test** (`utils/apiTest.ts`)
   - Simple test function to verify API connectivity
   - Test button added to login screen

## How to Fix the Issue

### Step 1: Stop and Restart the App

```bash
# Press Ctrl+C to stop the current server
# Then restart:
npm start
```

### Step 2: Clear Cache (If still not working)

```bash
# Clear Expo cache
npx expo start -c
```

### Step 3: For Android Emulator/Device

If you're testing on Android:

1. **Make sure the device has internet access**
   - Open a browser in the emulator
   - Try accessing google.com
   - If that doesn't work, restart the emulator

2. **Restart the app completely**
   - Close the app completely
   - Reopen it from Expo Go or your launcher

### Step 4: Test API Connection

1. Open the login screen
2. Click the "Test API Connection" button at the bottom
3. This will tell you if the API is reachable

### Step 5: Check Console Logs

Look at your terminal/console for these logs:
- "Attempting login with: ..."
- "Login response status: ..."
- Any error messages

### Common Issues and Solutions

#### Issue 1: Timeout Error
**Symptom**: "Request timeout. Please check your internet connection."
**Solution**: 
- Check your internet connection
- Try using a different network
- Increase timeout in `services/api.ts` (currently 10 seconds)

#### Issue 2: Network Request Failed (Android)
**Symptom**: "Network error. Please check your internet connection"
**Solution**:
- Restart the Android emulator/device
- Make sure emulator has internet (test in browser)
- Check if you're behind a firewall/proxy

#### Issue 3: iOS Simulator Issues
**Symptom**: Network works on Android but not iOS
**Solution**:
- iOS might need additional network security settings
- Try restarting the simulator

#### Issue 4: DummyJSON API Down
**Symptom**: Connection test fails, but internet works
**Solution**:
- Check if dummyjson.com is accessible in your browser
- The API might be temporarily down
- Try again after a few minutes

### Step 6: Alternative Solution - Use Mock Data

If the API continues to fail, we can temporarily use mock authentication:

**Option A**: Test with the test button first to see if the API is reachable

**Option B**: If API is down, I can create a mock authentication mode for development

## Testing the Fix

1. **Clear the app cache**: `npx expo start -c`
2. **Open the login screen**
3. **Click "Test API Connection"** - Should show success
4. **Try logging in** with:
   - Username: `emilys`
   - Password: `emilyspass`

## Additional Debug Steps

If it still doesn't work, share:
1. The exact error message from the alert
2. Console logs from the terminal
3. Platform you're testing on (iOS/Android/Web)
4. Result of the "Test API Connection" button

## What Changed in the Code

### `services/api.ts`
- Added `fetchWithTimeout` helper function
- Added 10-second timeout for all requests
- Added better error messages
- Added console.log statements for debugging
- Added 'Accept' header to requests

### `app.json`
- Added Android INTERNET permission
- Added Android ACCESS_NETWORK_STATE permission
- Enabled cleartext traffic for development

### `app/(auth)/login.tsx`
- Added "Test API Connection" button
- Allows you to verify API is reachable before trying to login

## Next Steps After Fix

Once login works:
1. The credentials will be saved to AsyncStorage
2. You'll be navigated to the Exercises screen
3. Your name will appear in the header
4. You'll stay logged in even after restarting the app

