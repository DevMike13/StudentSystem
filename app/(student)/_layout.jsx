import { View, Text, Alert, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import { Tabs, Redirect, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const StudentLayout = () => {

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Exit App', 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle:{
           borderTopWidth: 2,
           borderTopColor: 'white',
           height: 70,
          }
        }}
      >
        <Tabs.Screen name="(tabs)/attendance-history" 
          options={{
             title: 'Attendance',
             headerShown: false,
             tabBarLabel: ({ focused }) => (
              <Text
                className={`${focused ? 'font-pbold text-blue-700' : 'font-pregular text-gray-400'} text-sm`}
              >
                Attendance
              </Text>
            ),
             tabBarIcon: ({ focused }) => (
              <Ionicons
                name={`${focused ? 'timer' : "timer-outline"}`}
                size={28}
                color={focused ? 'blue' : 'gray'}
              />
             ),
          }}
        />
        <Tabs.Screen name="(tabs)/grades" 
          options={{
             title: 'Grades',
             headerShown: false,
             tabBarLabel: ({ focused }) => (
              <Text
                className={`${focused ? 'font-pbold text-blue-700' : 'font-pregular text-gray-400'} text-sm`}
              >
                Grades
              </Text>
            ),
             tabBarIcon: ({ focused }) => (
              <Ionicons
                name={`${focused ? 'ribbon' : "ribbon-outline"}`}
                size={28}
                color={focused ? 'blue' : 'gray'}
              />
             ),
          }}
        />
        <Tabs.Screen name="(tabs)/student-profile" 
          options={{
             title: 'Profile',
             headerShown: false,
             tabBarLabel: ({ focused }) => (
              <Text
                className={`${focused ? 'font-pbold text-blue-700' : 'font-pregular text-gray-400'} text-sm`}
              >
                Profile
              </Text>
            ),
             tabBarIcon: ({ focused }) => (
              <Ionicons
                name={`${focused ? 'person-circle' : "person-circle-outline"}`}
                size={28}
                color={focused ? 'blue' : 'gray'}
              />
             ),
          }}
        />
      </Tabs>
    </>
  )
}

export default StudentLayout