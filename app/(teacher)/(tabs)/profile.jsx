import { View, Text, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Redirect, router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          console.log(parsedUserData)
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
    <View className="flex-1 p-5">
      <Text className="text-3xl font-bold text-center mb-4">Profile</Text>
      <View className="space-y-2">
        <Text className="text-lg font-semibold">Name: <Text className="text-gray-700">{userData.name}</Text></Text>
        <Text className="text-lg font-semibold">Email: <Text className="text-gray-700">{userData.email}</Text></Text>
        <Text className="text-lg font-semibold">Role: <Text className="text-gray-700">{userData.Role}</Text></Text>
      </View>
      <View className="mt-5">
        <TouchableOpacity 
          onPress={logout}
          className="bg-red-500 rounded-md py-2 px-4 justify-center items-center"
        >
          <Text className="text-white text-lg">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
