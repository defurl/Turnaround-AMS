import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User, ArrowLeft, LogOut } from 'lucide-react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const AppHeader = ({ title, onBackPress }) => {
  const handleSignOut = () => signOut(auth).catch(error => console.error("Sign out error", error));
  
  return (
    <View className="flex-row justify-between items-center p-4 bg-slate-800">
      {onBackPress ? (
        <TouchableOpacity onPress={onBackPress}>
          <ArrowLeft color="white" size={28} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleSignOut}>
          <LogOut color="white" size={28} />
        </TouchableOpacity>
      )}
      <Text className="text-white text-xl font-bold">{title}</Text>
      <TouchableOpacity>
        <User color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
};

export default AppHeader;