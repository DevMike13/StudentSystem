import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal, Button, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { firestore } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

import { images } from '../../../constants'

const sectionList = ['STEM A', 'STEM B', 'STEM C', 'STEM D', 'STEM E', 'STEM F', 'STEM G', 'STEM H'];

const StudentInfo = () => {

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(sectionList[0]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'STEM A':
        return (
          <ScrollView>
            <View className="w-full h-full">
            <Text className="text-xl text-gray-800">This is Tab 1 content</Text>
            <Text className="text-xl text-gray-800">This is Tab 1 content</Text>
            <Text className="text-xl text-gray-800">This is Tab 1 content</Text>
            <Text className="text-xl text-gray-800">This is Tab 1 content</Text>
            <Text className="text-xl text-gray-800">This is Tab 1 content</Text>
            </View>
          </ScrollView>
        );
      case 'STEM B':
        return (
          <ScrollView>
            <Text className="text-xl text-gray-800">This is Tab 2 content</Text>
          </ScrollView>
        );
      case 'STEM C':
        return (
          <ScrollView>
            <Text className="text-xl text-gray-800">This is Tab 2 content</Text>
          </ScrollView>
        );
      case 'STEM D':
        return (
          <ScrollView>
            <Text className="text-xl text-gray-800">This is Tab 2 content</Text>
          </ScrollView>
        );
      case 'STEM E':
        return (
          <ScrollView>
            <Text className="text-xl text-gray-800">This is Tab 2 content</Text>
          </ScrollView>
        ); 
      case 'STEM F':
        return (
          <ScrollView>
            <Text className="text-xl text-gray-800">This is Tab 2 content</Text>
          </ScrollView>
        );
      case 'STEM G':
        return (
          <ScrollView>
            <Text className="text-xl text-gray-800">This is Tab 2 content</Text>
          </ScrollView>
        );
      case 'STEM H':
        return (
          <ScrollView>
            <Text className="text-xl text-gray-800">This is Tab 2 content</Text>
          </ScrollView>
        );
      default:
        return null;
    }
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedStudent(null);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true); // Show loading indicator while fetching data
        const usersRef = collection(firestore, 'Users');
        const q = query(
          usersRef,
          where('Role', '==', 'student'),
          where('Section', '==', activeTab) // Query based on selected section
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
        setLoading(false); // Hide loading indicator after fetching data
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

  const profileImagesGuardians = [
    'https://images.pexels.com/photos/28206849/pexels-photo-28206849/free-photo-of-a-woman-in-a-green-turtle-neck-sweater.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/4226462/pexels-photo-4226462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  ];

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
 
  return (
    <SafeAreaView className="h-full">
      <StatusBar style="dark" />
      <View className="w-full min-h-[85vh] justify-center px-4 my-6">
        <View className="items-center flex-row justify-center gap-5 mb-5">
          <Text className="w-auto font-pbold text-2xl">Student Info</Text>
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
                            name="newspaper-outline"
                            size={28}
                            color='blue' 
                          />
                        </TouchableOpacity>
                        <TouchableOpacity>
                          <Ionicons
                            name="trash-outline"
                            size={28}
                            color='red' 
                          />
                        </TouchableOpacity>
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
            <View className="w-4/5 h-3/5 bg-white rounded-xl p-4">
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {selectedStudent && (
                  <View>
                    <View className="border-2 border-secondary border-dashed w-full px-4 py-5 items-center relative mt-7">
                      <Text className="absolute -top-4 font-psemibold text-lg bg-secondary rounded-lg text-white">{"  "}Student Info{"  "}</Text>
                      <View className="border-4 border-primary w-auto h-auto rounded-full mt-3 p-1 relative">
                        <Image
                          source={{ uri: profileImages[Math.floor(Math.random() * profileImages.length)] }}
                          className="w-20 h-20 rounded-full"
                        />
                        <View className="absolute bg-white -right-1 -top-2 rounded-full border-2 border-primary p-1">
                          <Ionicons
                            name={`${
                              selectedStudent.Gender === "Male"  
                                ? 'male-outline' 
                                : selectedStudent.Gender === "Female" 
                                  ? 'female-outline' 
                                  : 'male-female-outline' // Fallback for other genders
                            }`}
                            size={20}
                            color='blue' 
                          />
                        </View>
                      </View>
                      <View className="w-full mt-3">
                        <Text className="font-psemibold text-base">Full Name: <Text className="font-pregular">{selectedStudent.LastName}, {selectedStudent.FirstName}</Text></Text>
                        <Text className="font-psemibold text-base">RFID No: <Text className="font-pregular">{selectedStudent.RFIDNo}</Text></Text>
                        <Text className="font-psemibold text-base">LRN: <Text className="font-pregular">{selectedStudent.LRN}</Text></Text>
                        <Text className="font-psemibold text-base">Mobile No: <Text className="font-pregular">{selectedStudent.MobileNo}</Text></Text>
                        <Text className="font-psemibold text-base">Birthdate: <Text className="font-pregular">{formatDate(selectedStudent.Birthdate)}</Text></Text>
                        <View className="w-full border-2 border-dashed border-primary p-2 mt-2">
                          <Text className="font-psemibold text-base">Address</Text>
                          <Text className="font-pmedium">Permanent Address</Text>
                          <Text className="font-pregular italic ml-3">{selectedStudent.Address}</Text>
                          <Text className="font-pmedium mt-5">Current Address</Text>
                          <Text className="font-pregular italic ml-3">{selectedStudent.CurrentAddress}</Text>
                        </View>
                      </View>
                    </View>
                    <View className="border-2 border-secondary border-dashed w-full px-4 py-5 items-center relative mt-7">
                      <Text className="absolute -top-4 font-psemibold text-lg bg-secondary rounded-lg text-white">{"  "}Guardian Info{"  "}</Text>
                      <View className="border-4 border-primary w-auto h-auto rounded-full mt-3 p-1 relative">
                        <Image
                          source={{ uri: profileImagesGuardians[Math.floor(Math.random() * profileImagesGuardians.length)] }}
                          className="w-20 h-20 rounded-full"
                        />
                      </View>
                      <View className="w-full mt-3">
                        <Text className="font-psemibold text-base">Full Name: <Text className="font-pregular">{selectedStudent.GuardianLastName}, {selectedStudent.GuardianFirstName}</Text></Text>
                        <Text className="font-psemibold text-base">Mobile No: <Text className="font-pregular">{selectedStudent.GuardianMobileNo}</Text></Text>
                        
                        <View className="w-full border-2 border-dashed border-primary p-2 mt-2">
                          <Text className="font-psemibold text-base">Address</Text>
                          <Text className="font-pregular italic ml-3">{selectedStudent.GuardianAddress}</Text>
                        </View>
                      </View>
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

export default StudentInfo