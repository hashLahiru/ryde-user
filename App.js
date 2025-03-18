import React, { useState, useEffect } from 'react';
import 'react-native-get-random-values';

import 'dotenv/config'; // Load environment variables from .env file
import Constants from 'expo-constants';

// Access environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_DIRECTIONS_API_KEY = process.env.GOOGLE_DIRECTIONS_API_KEY;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

console.log('Google API Key:', GOOGLE_API_KEY);
console.log('Google Directions API Key:', GOOGLE_DIRECTIONS_API_KEY);
console.log('Google Places API Key:', GOOGLE_PLACES_API_KEY);

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

// Splash and Onboarding Screens
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen1 from './screens/OnboardingScreen1';
import OnboardingScreen2 from './screens/OnboardingScreen2';

// Authentication Screens
import SignInScreen from './screens/SignInScreen';
import VerifyMobileScreen from './screens/VerifyMobile';
import RegisterScreen from './screens/RegisterScreen';
import LoginOtpScreen from './screens/LoginOtp';

// Main Screens
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';

// Additional Screens (Side Menu Items)
import UserScreen from './screens/UserScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PaymentsScreen from './screens/PaymentsScreen';
import HistoryScreen from './screens/HistoryScreen';
import SupportScreen from './screens/SupportScreen';
import DriverScreen from './screens/DriverScreen';

// Create Stack Navigator
const Stack = createStackNavigator();

export default function App() {
 const [isLoggedIn, setIsLoggedIn] = useState(null);

 useEffect(() => {
  const checkLogginState = async () => {
   const token = await AsyncStorage.getItem('login_token');

   if (token) {
    setIsLoggedIn(true);
   } else {
    setIsLoggedIn(false);
   }
  };

  checkLogginState();
 }, []);

 if (isLoggedIn === null) {
  return (
   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#ff9600" />
   </View>
  );
 }

 return (
  <NavigationContainer>
   <Stack.Navigator
    initialRouteName={isLoggedIn ? 'Home' : 'Splash'} // Define the starting screen
    screenOptions={{
     headerShown: false, // Globally hide headers for all screens
    }}
   >
    {/* Splash and Onboarding Screens */}
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
    <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />

    {/* Authentication Screens */}
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="VerifyMobile" component={VerifyMobileScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="LoginOtp" component={LoginOtpScreen} />

    {/* Main App Screens */}
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="MapScreen" component={MapScreen} />

    {/* Side Menu Screens */}
    <Stack.Screen name="UserScreen" component={UserScreen} />
    <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
    <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} />
    <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
    <Stack.Screen name="SupportScreen" component={SupportScreen} />
    <Stack.Screen name="DriverScreen" component={DriverScreen} />
   </Stack.Navigator>
  </NavigationContainer>
 );
}
