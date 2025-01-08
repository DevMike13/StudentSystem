import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal, Button, ScrollView, TextInput, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { firestore } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

import { images } from '../../../constants'

const Grades = () => {
  const [userData, setUserData] = useState(null);
  const [gradesData, setGradesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGrades = async (rfidNo) => {
    try {
      setRefreshing(true);
      const q = query(
        collection(firestore, 'Grades'),
        where('studentId', '==', rfidNo)
      );
      const querySnapshot = await getDocs(q);
      const grades = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGradesData(grades);
      console.log(gradesData)
    } catch (error) {
      console.error('Error fetching grades', error);
      Alert.alert('Error', 'Failed to fetch grades.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString !== null) {
          const parsedUserData = JSON.parse(userDataString);
          setUserData(parsedUserData);
          await fetchGrades(parsedUserData.RFIDNo);
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

  const formatGrade = (value) => {
    return value === 0 || value === null ? 'N/A' : value;
  };

  const renderGradeDetails = (grades) => {
    return grades.map((grade, index) => (
      <View key={index} className="w-full p-2 border-b border-gray-300 flex-row justify-between">
        <View className="w-full flex-row justify-between">
          <Text className="flex-1 text-left text-xs font-pregular" numberOfLines={1}>{grade.subjectName}</Text>
          <Text className="flex-1 text-center text-xs font-pregular">{formatGrade(grade.quarter1)}</Text>
          <Text className="flex-1 text-center text-xs font-pregular">{formatGrade(grade.quarter2)}</Text>
          <Text className="flex-1 text-center text-xs font-pregular">{formatGrade(grade.generalAvg)}</Text>
        </View>
      </View>
    ));
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <View className="flex-row justify-center items-center">
        <Text className="text-xl font-pbold mb-4 flex-1 mt-4">Grades</Text>
        <View>
          <Image 
            source={images.logo}
            className="w-10 h-10"
            resizeMode='contain'
          />
        </View> 
      </View>
      {
        gradesData && gradesData.length > 0 ? (
          <FlatList
            data={gradesData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="p-4 mb-4 border border-gray-300 rounded">
                <Text className="text-lg font-pbold">Semester: <Text className="text-green-500">{" "}{item.semester}</Text></Text>
                <View className="w-full flex-row justify-between p-2 border-b border-gray-300">
                  <Text className="flex-1 text-left font-psemibold">Subject</Text>
                  <Text className="flex-1 text-center font-psemibold">Q1</Text>
                  <Text className="flex-1 text-center font-psemibold">Q2</Text>
                  <Text className="flex-1 text-center font-psemibold">General Avg.</Text>
                </View>
                {renderGradeDetails(item.grades)}
                <View className="w-full flex-row justify-between mt-4">
                  <Text className="flex-1 text-left font-psemibold"></Text>
                  <Text className="flex-1 text-center text-xs font-psemibold">Q1 Avg.</Text>
                  <Text className="flex-1 text-center text-xs font-psemibold">Q2 Avg.</Text>
                  <Text className="flex-1 text-center text-xs font-psemibold">Total Grade</Text>
                </View>
                <View className="flex-row p-2 items-center">
                  <Text className="flex-1 text-left font-pbold text-lg">TOTAL: </Text>
                  <Text className="flex-1 text-center text-base font-psemibold">
                    {typeof item.quarter1Avg === 'number' ? item.quarter1Avg.toFixed(2) : formatGrade(item.quarter1Avg)}
                  </Text>
                  <Text className="flex-1 text-center text-base font-psemibold">
                    {typeof item.quarter2Avg === 'number' ? item.quarter2Avg.toFixed(2) : formatGrade(item.quarter2Avg)}
                  </Text>
                  <Text className="flex-1 text-center text-2xl font-pbold">{typeof item.totalGrade === 'number' ? item.totalGrade.toFixed(1) : formatGrade(item.totalGrade)}%</Text>
                </View>
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  if (userData) {
                    fetchGrades(userData.RFIDNo);
                  }
                }}
              />
            }
          />
        ) : (
          <View className="w-full h-10 border-2 border-dashed border-gray-400 justify-center items-center">
            <Text className="text-center font-pmedium italic text-gray-400">No Grades Found!</Text>
          </View>
        )
      }
      
    </View>
  )
}

export default Grades