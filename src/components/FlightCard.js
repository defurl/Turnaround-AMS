import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const FlightCard = ({ turnaround, onFlightSelect }) => {
  const statusColors = { 
    'On Time': 'bg-green-500', 
    'In Progress': 'bg-blue-500', 
    'Delayed': 'bg-red-500', 
    'Completed': 'bg-gray-500' 
  };
  const statusColor = statusColors[turnaround.status] || 'bg-yellow-500';
  
  // Check if any tasks are delayed
  const hasDelayedTasks = turnaround.status === 'Delayed';
  
  return (
    <TouchableOpacity onPress={() => onFlightSelect(turnaround)} className="bg-slate-800 rounded-lg mx-4 mb-3 shadow-md">
      <View className="flex-row items-stretch">
        <View className={`w-2 ${statusColor} rounded-l-lg`} />
        <View className="flex-1 p-4">
          <View className="flex-row justify-between">
            <Text className="text-white font-bold text-lg">{turnaround.flightInfo.flightNumber}</Text>
            <Text className="text-gray-300">Gate {turnaround.gate}</Text>
          </View>
          <Text className="text-gray-400 mt-1">From: {turnaround.flightInfo.origin}</Text>
          {turnaround.flightInfo.aircraftType && (
            <Text className="text-gray-400 text-sm">Aircraft: {turnaround.flightInfo.aircraftType}</Text>
          )}
          {hasDelayedTasks && (
            <View className="mt-1 bg-red-900/30 rounded px-2 py-1">
              <Text className="text-red-400 text-xs">⚠️ Has delayed tasks</Text>
            </View>
          )}
          <View className="w-full bg-slate-700 rounded-full h-2.5 mt-3">
            <View style={{ width: `${turnaround.progress}%` }} className={`${statusColor} h-2.5 rounded-full`} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FlightCard;