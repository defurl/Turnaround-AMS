import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './src/config/firebase';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import ChecklistScreen from './src/screens/ChecklistScreen';
import './global.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [selectedTurnaround, setSelectedTurnaround] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData({ uid: user.uid, ...userDoc.data() });
        }
      } else {
        setUserData(null);
      }
      if (initializing) {
        setInitializing(false);
      }
    });
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={styles.container} className="justify-center items-center">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  const renderContent = () => {
    if (!user || !userData) {
      return <AuthScreen />;
    }
    if (selectedTurnaround) {
      return (
        <ChecklistScreen 
          turnaround={selectedTurnaround} 
          onBack={() => setSelectedTurnaround(null)} 
          currentUser={userData} 
        />
      );
    }
    return <HomeScreen onFlightSelect={(turnaround) => setSelectedTurnaround(turnaround)} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
});