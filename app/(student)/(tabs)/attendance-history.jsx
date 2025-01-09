import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal, Button, ScrollView, TextInput, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { firestore } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';

import { images } from '../../../constants'

const AttendanceHistory = () => {

  const [userData, setUserData] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const months = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString !== null) {
          const parsedUserData = JSON.parse(userDataString);
          setUserData(parsedUserData);
          if (selectedMonth && selectedYear) {
            fetchAttendanceData(parsedUserData.RFIDNo);
          }
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

  const fetchAttendanceData = async (RFIDNo) => {
    setLoading(true);
    try {
      const attendanceRef = collection(firestore, 'Attendance');
      
      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0);
  
      const startDateString = startDate.toISOString().split('T')[0] + 'T00:00:00Z';
      const endDateString = endDate.toISOString().split('T')[0] + 'T23:59:59Z';
  
      const q = query(
        attendanceRef,
        where('RFIDNo', '==', RFIDNo),
        where('DateAndTime', '>=', startDateString),
        where('DateAndTime', '<=', endDateString)
      );
  
      const querySnapshot = await getDocs(q);
      const attendanceData = [];
      querySnapshot.forEach((doc) => {
        attendanceData.push(doc.data());
      });
  
      // Group attendance records by date
      const groupedAttendance = attendanceData.reduce((acc, record) => {
        const date = new Date(record.DateAndTime);
        const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(record);
        return acc;
      }, {});
  
      // Build the latest attendance record for each date
      const latestAttendance = Object.keys(groupedAttendance).map((dateKey) => {
        const records = groupedAttendance[dateKey];
        records.sort((a, b) => new Date(a.DateAndTime) - new Date(b.DateAndTime));  // Sort by time
  
        const latestDateRecord = {
          date: new Date(dateKey),
          records: [],
        };
  
        let timeInRecord = null;
        let timeOutRecord = null;
  
        // Separate Time In and Time Out records
        records.forEach((record) => {
          if (record.Status === 'Time In' && !timeInRecord) {
            timeInRecord = record;
          } else if (record.Status === 'Time Out') {
            timeOutRecord = record;
          }
        });
  
        // Add the records to the final date record
        if (timeInRecord) latestDateRecord.records.push(timeInRecord);
        if (timeOutRecord) latestDateRecord.records.push(timeOutRecord);
  
        return latestDateRecord;
      });
  
      setAttendance(latestAttendance);
    } catch (error) {
      console.error('Error fetching attendance data', error);
      Toast.show({ type: 'error', text1: 'Failed to fetch attendance data' });
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    if (userData && selectedMonth && selectedYear) {
      fetchAttendanceData(userData.RFIDNo);
    }
    setRefreshing(false);
  };

  const formatDate = (dateTime) => {
    
    const parsedDate = new Date(dateTime);

    parsedDate.setHours(parsedDate.getHours() - 8);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
  
    const formattedDate = parsedDate.toLocaleString('en-US', options);
  
    return formattedDate.replace(/, (\d{1,2}:\d{2} [APM]{2})/, ' at $1');
  };

  useEffect(() => {
    if (!selectedMonth || !selectedYear || !userData) {
      console.error('Please select both month and year.');
      return;
    }
    fetchAttendanceData(userData.RFIDNo);
  }, [selectedMonth, selectedYear]);

  return (
    <SafeAreaView className="flex-1 px-4 pb-4">
      <StatusBar style="dark" />
      <View className="flex-row justify-center items-center">
        <Text className="text-xl font-pbold mb-4 flex-1 mt-4">Attendance</Text>
        <View>
          <Image 
            source={images.logo}
            className="w-10 h-10"
            resizeMode='contain'
          />
        </View> 
      </View>
      <View className="border-2 border-secondary border-dashed w-full px-4 py-5 items-center relative mt-7">
        <Text className="absolute -top-4 font-psemibold text-lg bg-secondary rounded-lg text-white">{"  "}Filter{"  "}</Text>
        <View className="w-full flex flex-row gap-2">
          <View className="space-y-2 flex-1">
            <Text className="text-base text-secondary font-pmedium">Month</Text>
            <View className="w-full h-10 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                style={{
                  flex: 1,
                  width: '100%'
                }}
              >

                <Picker.Item label="Select Month" value="" />
                {months.map((month) => (
                  <Picker.Item key={month.value} label={month.label} value={month.value} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Year Picker */}
          <View className="space-y-2 flex-1">
            <Text className="text-base text-secondary font-pmedium">Year</Text>
            <View className="w-full h-10 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
              <Picker
                selectedValue={selectedYear}
                onValueChange={(itemValue) => setSelectedYear(itemValue)}
                style={{
                  flex: 1,
                }}
              >
                <Picker.Item label="Select Year" value="" />
                {[2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029].map((year) => (
                  <Picker.Item key={year} label={`${year}`} value={year} />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </View>

      <View className="border-2 border-secondary border-dashed w-full max-h-[500px] px-4 py-5 items-center relative mt-7">
        <Text className="absolute -top-4 font-psemibold text-lg bg-secondary rounded-lg text-white">{"  "}Attendance Record{"  "}</Text>
        <View className="w-full flex-grow">
          <ScrollView className="w-full" contentContainerStyle={{ paddingBottom: 20 }} refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
            {Array.isArray(attendance) && attendance.length > 0 ? (
              attendance.map((day) => (
                <View key={day.date} className="border-b border-gray-300 py-2 w-full">
                  {day.records.map((record, index) => (
                    <View key={index} className="flex flex-row justify-between">
                      <Text className="font-psemibold">{record.Status}</Text>
                      <Text className="font-pregular">{formatDate(record.DateAndTime)}</Text>
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <Text className="font-pregular italic text-center">No attendance records found</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AttendanceHistory