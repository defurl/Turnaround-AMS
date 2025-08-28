// Displays and manages tasks for a selected turnaround (flight).
// Workflow: Loads tasks from Firestore, allows marking as completed, delayed, or pending.
// Features: Role-based task actions, delay reporting (with modal), progress tracking, real-time updates.
// UI: Shows flight info, progress bar, task list with status indicators, delay details.

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { MessageSquare, AlertTriangle } from 'lucide-react-native';
import { db } from '../config/firebase';
import AppHeader from '../components/AppHeader';
import DelayModal from '../components/DelayModal';

const ChecklistScreen = ({ turnaround, onBack, currentUser }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const tasksRef = collection(db, 'turnarounds', turnaround.id, 'tasks');
    const q = query(tasksRef, orderBy('sequence'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [turnaround.id]);

  const handleTaskPress = (task) => {
    if (currentUser.uid !== task.assignedTo.uid && currentUser.role !== 'Supervisor') {
      Alert.alert("Authorization Failed", "This task is not assigned to you.");
      return;
    }
    setSelectedTask(task);

    // Choose actions based on current status
    // Push actions into an array to display
    let actions = [{ text: 'Cancel', style: 'cancel' }];

    if (task.status === 'Delayed') {
      actions.push({
        text: 'Mark as Pending',
        onPress: () => toggleTaskPending(task),
      });
    } else {
      actions.push({
        text: 'Mark as Delayed',
        onPress: () => setModalVisible(true),
        style: 'destructive',
      });
    }

    actions.push({
      text: `Mark as ${task.status === 'Completed' ? 'Pending' : 'Completed'}`,
      onPress: () => toggleTaskCompletion(task),
    });

    Alert.alert(
      `Update Task: ${task.name}`,
      'Choose an action for this task.',
      actions
    );
  };

  // Deal with pending task, 
  const toggleTaskPending = async (task) => {
    const taskRef = doc(db, 'turnarounds', turnaround.id, 'tasks', task.id);
    const isPending = task.status !== 'Pending';
    await updateDoc(taskRef, {
      status: 'Pending',
      isDelayed: false,
      delayReason: null,
      delayTimestamp: null,
      estimatedDelayMinutes: null,
      reportedBy: null,
      completedBy: null,
      completionTime: null,
    });
    setSelectedTask(null);
  }

  const toggleTaskCompletion = async (task) => {
    const taskRef = doc(db, 'turnarounds', turnaround.id, 'tasks', task.id);
    const isCompleting = task.status !== 'Completed';
    await updateDoc(taskRef, {
      status: isCompleting ? 'Completed' : 'Pending',
      completedBy: isCompleting ? { uid: currentUser.uid, name: currentUser.fullName } : null,
      completionTime: isCompleting ? new Date() : null,
      isDelayed: false,
      delayReason: null,
      delayTimestamp: null,
    });
  };

  const handleDelaySubmit = async ({ reason, estimatedMinutes }) => {
    if (!selectedTask) return;
    const taskRef = doc(db, 'turnarounds', turnaround.id, 'tasks', selectedTask.id);
    await updateDoc(taskRef, {
      status: 'Delayed',
      isDelayed: true,
      delayReason: reason,
      delayTimestamp: new Date(),
      estimatedDelayMinutes: estimatedMinutes,
      reportedBy: {
        uid: currentUser.uid,
        name: currentUser.fullName,
        role: currentUser.role
      }
    });
    
    // Also update turnaround status to Delayed if not already
    const turnaroundRef = doc(db, 'turnarounds', turnaround.id);
    if (turnaround.status !== 'Delayed') {
      await updateDoc(turnaroundRef, { status: 'Delayed' });
    }
    
    setModalVisible(false);
    setSelectedTask(null);
  };
  
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  useEffect(() => {
    const turnaroundRef = doc(db, 'turnarounds', turnaround.id);
    updateDoc(turnaroundRef, { progress: Math.round(progress) });
  }, [progress, turnaround.id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-900">
      <DelayModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSubmit={handleDelaySubmit} 
        task={selectedTask} 
      />
      <AppHeader title={`Flight ${turnaround.flightInfo.flightNumber}`} onBackPress={onBack} />
      <ScrollView>
        {/* Flight Information Panel */}
        <View className="bg-slate-800 mx-4 mt-4 p-4 rounded-lg shadow">
          <Text className="text-white text-lg font-bold mb-2">Flight Information</Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-400">Aircraft:</Text>
            <Text className="text-white">{turnaround.flightInfo.aircraftType}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-400">Origin:</Text>
            <Text className="text-white">{turnaround.flightInfo.origin}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-400">Gate:</Text>
            <Text className="text-white">{turnaround.gate}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-400">Status:</Text>
            <Text className={`font-bold ${turnaround.status === 'Delayed' ? 'text-red-500' : 
                              turnaround.status === 'Completed' ? 'text-green-500' : 'text-blue-500'}`}>
              {turnaround.status}
            </Text>
          </View>
        </View>

        <View className="p-4">
          <Text className="text-white text-lg font-bold mb-2">Turnaround at Gate {turnaround.gate}</Text>
          <View className="w-full bg-slate-700 rounded-full h-4 mb-4">
            <View style={{ width: `${progress}%` }} className="bg-green-500 h-4 rounded-full" />
          </View>
          <Text className="text-gray-300 text-right mb-4">{completedTasks} of {totalTasks} tasks completed</Text>
        </View>
        <View className="px-4">
          {tasks.map(task => {
            const isCompleted = task.status === 'Completed';
            const isDelayed = task.status === 'Delayed';
            const taskBg = isCompleted ? 'bg-slate-800' : isDelayed ? 'bg-red-900/50' : 'bg-slate-700';
            const taskBorder = isDelayed ? 'border-red-500' : 'border-transparent';

            return (
              <TouchableOpacity key={task.id} onPress={() => handleTaskPress(task)} className={`p-4 rounded-lg mb-3 border ${taskBg} ${taskBorder}`}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className={`text-lg ${isCompleted ? 'text-gray-500 line-through' : 'text-white'}`}>{task.name}</Text>
                    <Text className="text-gray-400 text-sm">Assigned to: {task.assignedTo.name}</Text>
                  </View>
                  <View className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isCompleted ? 'bg-green-500 border-green-500' : ( isDelayed ? 'bg-red-500 border-red-500' : 'border-gray-100')}`}>
                    {isCompleted && <Text className="text-white font-bold">✓</Text>}
                    {isDelayed && <Text className="text-white font-bold">!</Text>}
                  </View>
                </View>
                {isDelayed && (
                  <View className="mt-2 pt-2 border-t border-red-500/30">
                    <Text className="text-red-400 font-bold">Delay Reason:</Text>
                    <Text className="text-red-400">{task.delayReason}</Text>
                    
                    <Text className="text-red-400 font-bold mt-1">Estimated Delay:</Text>
                    <Text className="text-red-400">{task.estimatedDelayMinutes || '?'} minutes</Text>
                    
                    {task.reportedBy && (
                      <View className="mt-1">
                        <Text className="text-red-400 font-bold">Reported By:</Text>
                        <Text className="text-red-400">{task.reportedBy.name} ({task.reportedBy.role})</Text>
                      </View>
                    )}
                    
                    {task.delayTimestamp && (
                      <View className="mt-1">
                        <Text className="text-red-400 font-bold">Reported:</Text>
                        <Text className="text-red-400">
                          {new Date(task.delayTimestamp.seconds * 1000).toLocaleString()}
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
      <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg">
        <MessageSquare color="white" size={28} />
      </TouchableOpacity>
    </View>
  );
};

export default ChecklistScreen;