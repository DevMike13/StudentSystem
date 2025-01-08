import { View, Text, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Redirect, router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString !== null) {
          const parsedUserData = JSON.parse(userDataString);
          setUserData(parsedUserData); 
        } else {
          Alert.alert('No data', 'No user data found.');
        }
      } catch (error) {
        console.error('Error retrieving user data', error);
        Alert.alert('Error', 'Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      router.replace('/');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl">No user data found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-5">
      <StatusBar style="dark" />
      <Text className="text-3xl font-pbold text-center mb-4">Profile</Text>
      <View className="w-full flex justify-center items-center text-center">
        <View className="w-fit h-fit">
          <Ionicons
            name="person-circle-outline"
            size={120}
            color='gray' 
          />
        </View>
      </View>
      <View className="space-y-2">
        <Text className="text-lg font-psemibold text-secondary">Name: <Text className="text-gray-500">{userData.LastName}, {userData.FirstName}</Text></Text>
        <Text className="text-lg font-psemibold text-secondary">Username: <Text className="text-gray-500">{userData.RFIDNo}</Text></Text>
        <Text className="text-lg font-psemibold text-secondary">Mobile No.: <Text className="text-gray-500">{userData.MobileNo}</Text></Text>
        <Text className="text-lg font-psemibold text-secondary">Role: <Text className="text-gray-500 capitalize">{userData.Role}</Text></Text>
      </View>
      <View className="mt-5">
        <TouchableOpacity 
          onPress={logout}
          className="bg-red-500 rounded-full py-2 px-4 justify-center items-center"
        >
          <Text className="text-white text-lg font-pmedium">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
