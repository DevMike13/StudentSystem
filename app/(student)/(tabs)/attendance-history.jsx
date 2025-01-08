import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal, Button, ScrollView, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react'
import Toast from 'react-native-toast-message';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

const AttendanceHistory = () => {
  return (
    <SafeAreaView>
      <StatusBar style="dark" />
      <Text>AttendanceHistory</Text>
    </SafeAreaView>
  )
}

export default AttendanceHistory