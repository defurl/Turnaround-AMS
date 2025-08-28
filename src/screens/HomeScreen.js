// Main dashboard for viewing assigned turnarounds (flights).
// Workflow: Loads user data, fetches turnarounds from Firestore based on user role.
// Features: Role-based filtering (supervisor sees all, others see assigned), deduplication, real-time updates.
// UI: Renders FlightCard components for each turnaround, shows progress and status.

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import AppHeader from '../components/AppHeader';
import FlightCard from '../components/FlightCard';

const HomeScreen = ({ onFlightSelect }) => {
  const [turnarounds, setTurnarounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userAuth = auth.currentUser;
    if (userAuth) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, 'users', userAuth.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ uid: userAuth.uid, ...userDoc.data() });
        } else {
          console.log("User document not found in Firestore.");
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    
    let q;
    const turnaroundsRef = collection(db, 'turnarounds');
    
    if (user.role === 'Supervisor') {
      // Supervisors see all turnarounds, no need for filtering
      q = query(turnaroundsRef);
      console.log("Loading all turnarounds for supervisor");
    } else {
      // Other roles only see turnarounds they're assigned to
      const crewMemberQueryObject = { uid: user.uid, name: user.fullName, role: user.role };
      q = query(turnaroundsRef, where('assignedCrew', 'array-contains', crewMemberQueryObject));
      console.log(`Loading turnarounds for ${user.role} with uid: ${user.uid}`);
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      // Use a Map to ensure unique turnarounds (no duplicates)
      const turnaroundsMap = new Map();
      querySnapshot.docs.forEach(doc => {
        const turnaroundData = { id: doc.id, ...doc.data() };
        turnaroundsMap.set(doc.id, turnaroundData);
      });
      
      // Convert Map to Array for state
      const turnaroundsData = Array.from(turnaroundsMap.values());
      setTurnarounds(turnaroundsData);
      console.log(`Loaded ${turnaroundsData.length} turnarounds`);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching turnarounds: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-900">
      <AppHeader title="Dashboard" />
      <FlatList
        data={turnarounds}
        renderItem={({ item }) => <FlightCard turnaround={item} onFlightSelect={onFlightSelect} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text className="text-gray-400 text-center mt-10">No turnarounds assigned.</Text>}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
      />
    </View>
  );
};

export default HomeScreen;