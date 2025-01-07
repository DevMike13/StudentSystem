import { View, Text, Alert, BackHandler } from 'react-native'
import React, { useEffect } from 'react'
import { Tabs, Redirect, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const TeacherLayout = () => {

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
        <Tabs.Screen name="(tabs)/grades" 
          options={{
             title: 'Grades',
             headerShown: false,
             tabBarLabel: ({ focused }) => (
              <Text
                className={`${focused ? 'font-pbold text-blue-700' : 'font-pregular text-gray-400'} text-[11px]`}
              >
                Grades
              </Text>
            ),
             tabBarIcon: ({ focused }) => (
              <Ionicons
                name={`${focused ? 'ribbon' : "ribbon-outline"}`}
                size={25}
                color={focused ? 'blue' : 'gray'}
              />
             ),
          }}
        />
        <Tabs.Screen name="(tabs)/student-attendance" 
          options={{
             title: 'Student Attendance',
             headerShown: false,
             tabBarLabel: ({ focused }) => (
              <Text
                className={`${focused ? 'font-pbold text-blue-700' : 'font-pregular text-gray-400'} text-[11px]`}
              >
                Attendance
              </Text>
            ),
             tabBarIcon: ({ focused }) => (
              <Ionicons
                name={`${focused ? 'timer' : "timer-outline"}`}
                size={25}
                color={focused ? 'blue' : 'gray'}
              />
             ),
          }}
        />
        <Tabs.Screen name="(tabs)/student-info" 
          options={{
             title: 'Student Info',
             headerShown: false,
             tabBarLabel: ({ focused }) => (
              <Text
                className={`${focused ? 'font-pbold text-blue-700' : 'font-pregular text-gray-400'} text-[11px]`}
              >
                Student Info
              </Text>
            ),
             tabBarIcon: ({ focused }) => (
              <Ionicons
                name={`${focused ? 'body' : "body-outline"}`}
                size={25}
                color={focused ? 'blue' : 'gray'}
              />
             ),
          }}
        />
        <Tabs.Screen name="(tabs)/register" 
          options={{
             title: 'Registration',
             headerShown: false,
             tabBarLabel: ({ focused }) => (
              <Text
                className={`${focused ? 'font-pbold text-blue-700' : 'font-pregular text-gray-400'} text-[11px]`}
              >
                Registration
              </Text>
            ),
             tabBarIcon: ({ focused }) => (
              <Ionicons
                name={`${focused ? 'person-add' : "person-add-outline"}`}
                size={25}
                color={focused ? 'blue' : 'gray'}
              />
             ),
          }}
        />
        <Tabs.Screen name="(tabs)/profile" 
          options={{
             title: 'Profile',
             headerShown: false,
             tabBarLabel: ({ focused }) => (
              <Text
                className={`${focused ? 'font-pbold text-blue-700' : 'font-pregular text-gray-400'} text-[11px]`}
              >
                Profile
              </Text>
            ),
             tabBarIcon: ({ focused }) => (
              <Ionicons
                name={`${focused ? 'person-circle' : "person-circle-outline"}`}
                size={25}
                color={focused ? 'blue' : 'gray'}
              />
             ),
          }}
        />
      </Tabs>
    </>
  )
}

export default TeacherLayout