import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';

const DelayModal = ({ visible, onClose, onSubmit, task }) => {
  const [reason, setReason] = useState('');
  const [estimatedDelay, setEstimatedDelay] = useState('15');
  
  const handleSubmit = () => {
    if (!reason.trim()) {
      Alert.alert('Invalid Input', 'Please provide a reason for the delay.');
      return;
    }
    
    if (isNaN(parseInt(estimatedDelay)) || parseInt(estimatedDelay) <= 0) {
      Alert.alert('Invalid Input', 'Please provide a valid estimated delay time in minutes.');
      return;
    }
    
    onSubmit({
      reason: reason,
      estimatedMinutes: parseInt(estimatedDelay)
    });
    
    setReason('');
    setEstimatedDelay('15');
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="bg-slate-800 p-6 rounded-lg w-11/12">
          <Text className="text-white text-xl font-bold mb-2">Report Delay</Text>
          <Text className="text-gray-300 mb-4">Task: {task?.name}</Text>
          
          <Text className="text-white mb-2">Reason for delay:</Text>
          <TextInput
            className="bg-slate-700 text-white p-3 rounded-md mb-4 h-24"
            placeholder="Enter reason for delay..."
            placeholderTextColor="#9ca3af"
            multiline
            value={reason}
            onChangeText={setReason}
          />
          
          <Text className="text-white mb-2">Estimated delay (minutes):</Text>
          <TextInput
            className="bg-slate-700 text-white p-3 rounded-md mb-4"
            placeholder="Estimated minutes of delay"
            placeholderTextColor="#9ca3af"
            keyboardType="number-pad"
            value={estimatedDelay}
            onChangeText={setEstimatedDelay}
          />
          
          <View className="flex-row justify-end space-x-3">
            <TouchableOpacity onPress={onClose} className="bg-slate-600 py-2 px-4 rounded-md">
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} className="bg-red-600 py-2 px-4 rounded-md">
              <Text className="text-white font-semibold">Submit Delay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DelayModal;