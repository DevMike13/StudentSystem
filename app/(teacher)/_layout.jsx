import { View, Text } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const TeacherLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle:{
           borderTopWidth: 2,
           borderTopColor: 'white',
           height: 70
          }
        }}
      >
        <Tabs.Screen name="(tabs)/grades" 
          options={{
             title: 'Grades',
             headerShown: false,
             tabBarLabel: ({ focused }) => (
              <Text
                className={`${focused ? 'font-pbold text-blue-700' : 'font-pregular text-gray-400'} text-xs`}
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
        <Tabs.Screen name="(tabs)/student-attendance" 
          options={{
             title: 'Student Attendance',
             headerShown: false,
             tabBarLabel: ({ focused }) => (
              <Text
                className={`${focused ? 'font-pbold text-blue-700' : 'font-pregular text-gray-400'} text-xs`}
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
        <Tabs.Screen name="(tabs)/student-info" 
          options={{
             title: 'Student Info',
             headerShown: false,
             tabBarLabel: ({ focused }) => (
              <Text
                className={`${focused ? 'font-pbold text-blue-700' : 'font-pregular text-gray-400'} text-xs`}
              >
                Student Info
              </Text>
            ),
             tabBarIcon: ({ focused }) => (
              <Ionicons
                name={`${focused ? 'body' : "body-outline"}`}
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

export default TeacherLayout