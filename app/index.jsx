import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { images } from '../constants'

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const { Role } = JSON.parse(user);
          setUserRole(Role);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (userRole === 'student') {
        router.replace('(student)/(tabs)/attendance-history');
      } else if (userRole === 'teacher') {
        router.replace('(teacher)/(tabs)/grades');
      }
    }
  }, [loading, userRole]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{
        height: '100%'
      }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image 
            source={images.logo}
            className="w-40 h-40"
            resizeMode='contain'
          />
          <Text className="font-psemibold text-gray-500 text-2xl">Present!</Text>
          <Text className="font-pregular text-center">
            This app will help teachers and students to have a manageable attendance system in their class and can store information about the students.
          </Text>
          <TouchableOpacity 
            className="bg-secondary rounded-xl min-h-[62px] justify-center items-center w-full mt-7"
            onPress={() => router.push('/sign-in')}
          >
            <Text className="text-white font-psemibold text-lg">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
