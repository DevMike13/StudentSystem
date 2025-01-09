import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal, Button, ScrollView, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { firestore } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';

import { images } from '../../../constants'

const sectionList = ['STEM A', 'STEM B', 'STEM C', 'STEM D', 'STEM E', 'STEM F', 'STEM G', 'STEM H'];

const StudentAttendance = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(sectionList[0]);

  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // const openModal = async (student) => {
  //   setSelectedStudent(student);
  //   setIsModalVisible(true);

  //   try {
  //     const attendanceRef = collection(firestore, 'Attendance');
  //     const q = query(attendanceRef, where('RFIDNo', '==', student.RFIDNo));
  //     const querySnapshot = await getDocs(q);
  //     const attendanceData = querySnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  
  //     setSelectedStudent((prevStudent) => ({
  //       ...prevStudent,
  //       attendance: attendanceData,
  //     }));
  //   } catch (error) {
  //     console.error('Error fetching attendance data', error);
  //   }
  // };
  const openModal = async (student) => {
    setSelectedStudent(student);
    setIsModalVisible(true);
  
    if (!selectedMonth || !selectedYear) {
      console.error('Please select both month and year.');
      return;
    }
  
    try {
      const attendanceRef = collection(firestore, 'Attendance');
      
      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
      const endDate = new Date(selectedYear, selectedMonth, 0);

      const startDateString = startDate.toISOString().split('T')[0] + 'T00:00:00Z';
      const endDateString = endDate.toISOString().split('T')[0] + 'T23:59:59Z';
      
      const q = query(
        attendanceRef,
        where('RFIDNo', '==', student.RFIDNo),
        where('DateAndTime', '>=', startDateString),
        where('DateAndTime', '<=', endDateString)
      );
      const querySnapshot = await getDocs(q);
      const attendanceData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const groupedAttendance = attendanceData.reduce((acc, record) => {
        const date = new Date(record.DateAndTime);
        const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(record);
        return acc;
      }, {});
  
      const latestAttendance = Object.keys(groupedAttendance).map((dateKey) => {
        const records = groupedAttendance[dateKey];
        records.sort((a, b) => new Date(a.DateAndTime) - new Date(b.DateAndTime));
  
        const latestDateRecord = {
          date: new Date(dateKey),
          records: [],
        };
  
        let timeInRecord = null;
        let timeOutRecord = null;
  
        records.forEach((record) => {
          if (record.Status === 'Time In' && !timeInRecord) {
            timeInRecord = record;
          } else if (record.Status === 'Time Out') {
            timeOutRecord = record;
          }
        });
  
        if (timeInRecord) latestDateRecord.records.push(timeInRecord);
        if (timeOutRecord) latestDateRecord.records.push(timeOutRecord);
  
        return latestDateRecord;
      });

      setSelectedStudent((prevStudent) => ({
        ...prevStudent,
        attendance: latestAttendance,
      }));
  
    } catch (error) {
      console.error('Error fetching attendance data', error);
    }
  };

  useEffect(() => {
    if (selectedMonth && selectedYear && selectedStudent) {
        openModal(selectedStudent);
    }
  }, [selectedMonth, selectedYear]);

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedStudent(null);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const usersRef = collection(firestore, 'Users');
        const q = query(
          usersRef,
          where('Role', '==', 'student'),
          where('Section', '==', activeTab)
        );
  
        const querySnapshot = await getDocs(q);
        const studentsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setStudents(studentsData);
      } catch (error) {
        setError('Error fetching students');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStudents();
  }, [activeTab]);

  const profileImages = [
    'https://images.pexels.com/photos/261895/pexels-photo-261895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/8653544/pexels-photo-8653544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/5905479/pexels-photo-5905479.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/8500358/pexels-photo-8500358.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];

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

  // const formatDate = (dateTime) => {
  //   const parsedDate = new Date(dateTime);
    
  //   // Format date as 'Jan 9, 2025 at 4:53 PM'
  //   const formattedDate = parsedDate.toLocaleString('en-US', {
  //     month: 'short',
  //     day: 'numeric',
  //     year: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: true,
  //   });
  
  //   return formattedDate.replace(',', ' at');
  // };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await openModal(selectedStudent);
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView className="h-full">
      <StatusBar style="dark" />
      <View className="w-full min-h-[85vh] justify-center px-4 my-6">
        <View className="items-center flex-row justify-center gap-5 mb-5">
          <Text className="w-auto font-pbold text-2xl">Student Attendance</Text>
          <Image 
            source={images.logo}
            className="w-10 h-10"
            resizeMode='contain'
          />
        </View>
        <View className="w-full h-auto mb-4 bg-primary rounded-full p-2">
          <FlatList
            data={sectionList}
            horizontal={true} // Enable horizontal scrolling
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setActiveTab(item)}
                className={`py-2 px-6 w-auto rounded-full mr-1 ${activeTab === item ? 'bg-secondary' : 'bg-gray-300'}`}
              >
                <Text className={`text-lg font-psemibold text-center ${activeTab === item ? 'text-white' : 'text-gray-500'}`}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            className="rounded-full"
          />
        </View>
        
        {
          loading ? (
            <View className="w-full min-h-[69vh]">
              <ActivityIndicator size="large" color="blue" />
            </View>
          ) : (
            <FlatList
              data={students}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                // Pick a random image from the profileImages array
                const randomImage = profileImages[Math.floor(Math.random() * profileImages.length)];
        
                return (
                  <View className="mb-5 rounded-xl border-2 border-primary flex-row justify-center items-center pr-5">
                    <View className="w-full flex flex-row items-center justify-center gap-3 px-4 py-2">
                      <Image
                        source={{ uri: randomImage }}
                        className="w-14 h-14 rounded-full"
                      />
                      <View>
                        <Text className="font-psemibold text-sm text-secondary">Name: <Text className="text-gray-500">{item.LastName}, {item.FirstName}</Text></Text>
                        <Text className="font-psemibold text-sm text-secondary">RFID No: <Text className="text-gray-500">{item.RFIDNo}</Text></Text>
                        <Text className="font-psemibold text-sm text-secondary">Guardian No: <Text className="text-gray-500">{item.MobileNo}</Text></Text>
                      </View>
                      
                    </View>
                    <View className="flex flex-col gap-2 px-1 justify-center items-center">
                        <TouchableOpacity onPress={() => openModal(item)}>
                          <Ionicons
                            name="alarm-outline"
                            size={28}
                            color='blue' 
                          />
                        </TouchableOpacity>
                        {/* <TouchableOpacity>
                          <Ionicons
                            name="trash-outline"
                            size={28}
                            color='red' 
                          />
                        </TouchableOpacity> */}
                      </View>
                  </View>
                );
              }}
            />
          )
        }
        
        {/* Modal to display student details */}
        <Modal
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
          animationType="slide"
          transparent={true}
        >
          <View className="flex-1 justify-center items-center bg-gray-800/70">
            <View className="w-[90%] h-[80%] bg-white rounded-xl p-4">
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }} refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
                }>
                {selectedStudent && (
                  <View>
                    <View className="border-2 border-secondary border-dashed w-full px-4 py-5 items-center relative mt-7">
                      <Text className="absolute -top-4 font-psemibold text-lg bg-secondary rounded-lg text-white">{"  "}Student Info{"  "}</Text>
                      <View className="flex-row w-full items-center gap-2">
                        <View className="border-4 border-primary w-auto h-auto rounded-full mt-3 p-1 relative">
                          <Image
                            source={{ uri: profileImages[Math.floor(Math.random() * profileImages.length)] }}
                            className="w-10 h-10 rounded-full"
                          />
                          <View className="absolute bg-white -right-1 -top-2 rounded-full border-2 border-primary p-1">
                            <Ionicons
                              name={`${
                                selectedStudent.Gender === "Male"  
                                  ? 'male-outline' 
                                  : selectedStudent.Gender === "Female" 
                                    ? 'female-outline' 
                                    : 'male-female-outline'
                              }`}
                              size={10}
                              color='blue' 
                            />
                          </View>
                        </View>
                        <View className="w-full mt-3">
                          <Text className="font-psemibold text-sm">Full Name: <Text className="font-pregular">{selectedStudent.LastName}, {selectedStudent.FirstName}</Text></Text>
                          <Text className="font-psemibold text-sm">RFID No: <Text className="font-pregular">{selectedStudent.RFIDNo}</Text></Text>
                          <Text className="font-psemibold text-sm">LRN: <Text className="font-pregular">{selectedStudent.LRN}</Text></Text>
                        </View>
                      </View>
                    </View>
                    
                    <View className="border-2 border-secondary border-dashed w-full px-4 py-5 items-center relative mt-7">
                      <Text className="absolute -top-4 font-psemibold text-lg bg-secondary rounded-lg text-white">{"  "}Attendance Records{"  "}</Text>
                      
                      <View className="w-full flex flex-row gap-2 mb-3 border-b-2 border-gray-300 pb-5 border-dashed">
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
                      
                      {selectedStudent && selectedStudent.attendance && selectedStudent.attendance.length > 0 ? (
                        selectedStudent.attendance.map((day) => (
                          <View key={day.date} className="border-b border-gray-300 py-2 w-full">
                            {day.records.map((record, index) => (
                              <View key={index} className="flex flex-row justify-between">
                                <Text className="font-pregular">{record.Status}</Text>
                                <Text className="font-pregular">{formatDate(record.DateAndTime)}</Text>
                              </View>
                            ))}
                          </View>
                          
                        ))
                      ) : (
                        <Text className="font-pregular italic">No attendance records found</Text>
                      )}
                    </View>
                  </View>
                )}
              </ScrollView>
              <TouchableOpacity 
                onPress={() => closeModal()} 
                style={{ marginTop: 20, alignSelf: 'center' }}
              >
                <Ionicons name="close-circle" size={28} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

export default StudentAttendance