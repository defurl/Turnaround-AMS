// Handles user authentication (login) workflow.
// Features: Email/password login, error handling, network checks, debug mode for development.
// Workflow: On login, authenticates with Firebase Auth, loads user data, and transitions to dashboard.
// UI: Uses NativeWind for styling, provides debug tools for test credentials and user inspection.

import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, StatusBar, ScrollView } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Debug function to check available users in the database
  const checkAvailableUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await collection(db, 'users');
      const usersQuery = query(usersSnapshot);
      const querySnapshot = await getDocs(usersQuery);
      const usersList = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        email: doc.data().email || 'No email',
        role: doc.data().role || 'No role'
      }));
      setAvailableUsers(usersList);
      setLoading(false);
      console.log("Available users:", usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
      setError("Error fetching users: " + error.message);
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    // Show sample credentials when there's a connectivity issue
    const testCredentials = {
      'ramp@test.com': 'password123',
      'supervisor@test.com': 'password123',
      'maintenance@test.com': 'password123'
    };
    
    setLoading(true);
    setError('');
    console.log(`Attempting login with email: ${email}`);
    
    // Check for internet connectivity before attempting login
    fetch('https://www.google.com', { mode: 'no-cors', cache: 'no-store' })
      .then(() => {
        // Internet is available, proceed with login
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log("Login successful, user:", userCredential.user.uid);
          })
          .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Login error: ${errorCode} - ${errorMessage}`);
            
            // Provide more specific error messages to the user
            if (errorCode === 'auth/user-not-found') {
              setError('No account exists with this email. Please check your email or sign up.');
            } else if (errorCode === 'auth/wrong-password') {
              setError('Incorrect password. Please try again.');
            } else if (errorCode === 'auth/invalid-credential') {
              setError('Invalid login credentials. Please check your email and password.');
            } else if (errorCode === 'auth/user-disabled') {
              setError('This account has been disabled. Please contact support.');
            } else if (errorCode === 'auth/network-request-failed') {
              setError('Network connection issue. Please check your internet connection and try again.');
            } else {
              setError(`Login failed: ${errorMessage}`);
            }
          })
          .finally(() => setLoading(false));
      })
      .catch(() => {
        // No internet connection
        console.error("No internet connection detected");
        setError('No internet connection. Please check your network settings and try again.');
        setLoading(false);
        
        // Show available test accounts for offline debugging
        console.log("Available test accounts:", Object.keys(testCredentials));
      });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900 justify-center p-6">
      <StatusBar barStyle="light-content" />
      <View>
        <Text className="text-white text-4xl font-bold mb-2 text-center">TurnaroundAI</Text>
        <Text className="text-gray-400 text-lg mb-8 text-center">Ground Operations Login</Text>
        <TextInput
          className="bg-slate-800 text-white p-4 rounded-lg mb-4 text-lg"
          placeholder="Email (e.g., ramp@test.com)"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="bg-slate-800 text-white p-4 rounded-lg mb-6 text-lg"
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text className="text-red-500 text-center mb-4">{error}</Text> : null}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-blue-600 p-4 rounded-lg flex-row justify-center items-center"
        >
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white text-lg font-bold">Login</Text>}
        </TouchableOpacity>
        
        {/* Secret debug mode toggle - tap on version to enable debugging */}
        <TouchableOpacity 
          onPress={() => {
            if (!debugMode) {
              Alert.alert('Debug Mode Activated', 'Debug tools are now available.');
            }
            setDebugMode(prev => !prev);
          }}
          className="mt-8"
        >
          <Text className="text-gray-500 text-center">v1.0.0</Text>
        </TouchableOpacity>
        
        {debugMode && (
          <View className="mt-4 bg-gray-800 p-4 rounded-lg">
            <Text className="text-white text-center font-bold mb-2">Debug Mode</Text>
            <TouchableOpacity
              onPress={checkAvailableUsers}
              className="bg-gray-600 p-3 rounded-lg flex-row justify-center items-center"
            >
              <Text className="text-white text-sm font-bold">Check Available Users</Text>
            </TouchableOpacity>
            
            <View className="mt-4">
              <Text className="text-white font-bold mb-2">Test Credentials:</Text>
              <TouchableOpacity onPress={() => {
                setEmail('ramp@test.com');
                setPassword('password123');
              }}>
                <Text className="text-blue-400">Ramp Agent: ramp@test.com / password123</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                setEmail('supervisor@test.com');
                setPassword('password123');
              }}>
                <Text className="text-blue-400">Supervisor: supervisor@test.com / password123</Text>
              </TouchableOpacity>
            </View>
            
            {availableUsers.length > 0 && (
              <View className="mt-4">
                <Text className="text-white font-bold mb-2">Available Users in Firestore:</Text>
                <ScrollView style={{maxHeight: 200}} className="bg-gray-900 p-2 rounded">
                  {availableUsers.map(user => (
                    <Text key={user.uid} className="text-gray-400">{user.email || user.uid} ({user.role})</Text>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AuthScreen;