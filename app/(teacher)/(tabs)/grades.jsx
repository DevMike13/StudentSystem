import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Modal, Button, ScrollView, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { firestore } from '../../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Toast from 'react-native-toast-message';
import Ionicons from '@expo/vector-icons/Ionicons';

import { images } from '../../../constants'

const sectionList = ['STEM A', 'STEM B', 'STEM C', 'STEM D', 'STEM E', 'STEM F', 'STEM G', 'STEM H'];

const Grades = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(sectionList[0]);
  const [students, setStudents] = useState([]);

  const [selectedSemester, setSelectedSemester] = useState('1st Semester');
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState({});

  const [quarter1Avg, setQuarter1Avg] = useState(0);
  const [quarter2Avg, setQuarter2Avg] = useState(0);
  const [totalGrade, setTotalGrade] = useState(0);

  const semesters = ["1st Semester", "2nd Semester"];

  const subjectsBySemester = {
    "1st Semester": [
      "Gen Physics 1", "CPAR", "UCSP", "Piling-Larang", "Gen Chem 1", "3I's", "HOPE", "Philosophy"
    ],
    "2nd Semester": [
      "Gen Chem 2", "Work Immersion", "Gen Physics 2", "MIL", "Entrep", "HOPE 2"
    ]
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

  const openModal = (student) => {
    setSelectedStudent(student);
    setIsModalVisible(true);
    setSelectedSemester("1st Semester"); // Default to 1st Semester
    setSubjects(subjectsBySemester["1st Semester"]); // Default subjects for 1st Semester
    setGrades({}); // Reset grades for the student
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedStudent(null);
    setGrades({});
  };

  useEffect(() => {
    if (selectedStudent && selectedSemester) {
      const fetchGrades = async () => {
        try {
          const gradesRef = firestore
            .collection('Grades')
            .where('studentId', '==', selectedStudent.id)
            .where('semester', '==', selectedSemester);
          const querySnapshot = await gradesRef.get();
          
          if (!querySnapshot.empty) {
            const gradesData = querySnapshot.docs[0].data().grades;
            const gradesMap = {};
  
            gradesData.forEach((grade) => {
              gradesMap[grade.subjectName] = {
                quarter1: grade.quarter1,
                quarter2: grade.quarter2,
                generalAvg: grade.generalAvg || 0
              };
            });
            
            setGrades(gradesMap); 
            calculateAverages(gradesMap);
          } else {
            setGrades({});
            calculateAverages({}); // Recalculate averages for empty grades
          }
        } catch (error) {
          setError('Error fetching grades');
        }
      };
  
      fetchGrades();
    }
  }, [selectedStudent, selectedSemester]);
  
  const calculateAverages = (gradesMap) => {
    let totalQuarter1 = 0;
    let totalQuarter2 = 0;
    let numberOfSubjects = 0;
  
    // If gradesMap is empty or has no valid entries, set default averages
    if (Object.keys(gradesMap).length === 0) {
      setQuarter1Avg(0);
      setQuarter2Avg(0);
      setTotalGrade(0);
      return;
    }

    Object.values(gradesMap).forEach((grade) => {
      if (grade.quarter1) {
        totalQuarter1 += grade.quarter1;
        numberOfSubjects++;
      }
      if (grade.quarter2) {
        totalQuarter2 += grade.quarter2;
      }
    });
  
    const quarter1Avg = roundToTwoDecimalPlaces(totalQuarter1 / numberOfSubjects);
    const quarter2Avg = roundToTwoDecimalPlaces(totalQuarter2 / numberOfSubjects);
    const totalGrade = roundToTwoDecimalPlaces((quarter1Avg + quarter2Avg) / 2);
  
    setQuarter1Avg(quarter1Avg);
    setQuarter2Avg(quarter2Avg);
    setTotalGrade(totalGrade);
};

  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
    setSubjects(subjectsBySemester[semester]); // Change subjects based on selected semester
    setGrades({}); // Reset grades
  };

  const handleGradeChange = (subject, quarter, value) => {
    const numericValue = parseFloat(value) || 0;
    setGrades(prevGrades => {
      const updatedGrades = {
        ...prevGrades,
        [subject]: {
          ...prevGrades[subject],
          [quarter]: numericValue
        }
      };
  
      // Calculate general average (quarter1 + quarter2) / 2
      const quarter1 = updatedGrades[subject]?.quarter1 || 0;
      const quarter2 = updatedGrades[subject]?.quarter2 || 0;
      const generalAvg = (quarter1 + quarter2) / 2;
  
      updatedGrades[subject].generalAvg = generalAvg; // Add general average to grades
  
      // Calculate Quarter 1 average
      const quarter1Grades = Object.values(updatedGrades).map((grade) => grade.quarter1 || 0);
      const totalQuarter1 = quarter1Grades.reduce((sum, grade) => sum + grade, 0);
      const quarter1Avg = totalQuarter1 / quarter1Grades.length; // Average of Quarter 1 grades
      setQuarter1Avg(quarter1Avg);

      const quarter2Grades = Object.values(updatedGrades).map((grade) => grade.quarter2 || 0);
      const totalQuarter2 = quarter2Grades.reduce((sum, grade) => sum + grade, 0);
      const quarter2Avg = totalQuarter2 / quarter2Grades.length; // Average of Quarter 1 grades
      setQuarter2Avg(quarter2Avg); // Update the quarter1Avg state

      const totalGrade = (quarter1Avg + quarter2Avg) / 2;
      setTotalGrade(totalGrade);
  
      return updatedGrades;
    });
  };

  const saveGrades = async () => {
    try {
      const gradesRef = firestore.collection('Grades');
      const querySnapshot = await gradesRef
        .where('studentId', '==', selectedStudent.id)
        .where('semester', '==', selectedSemester)
        .get();
  
      // Sanitize grades to remove undefined values
      const sanitizedGrades = Object.keys(grades).reduce((result, subject) => {
        const quarter1 = grades[subject]?.quarter1 ?? null;
        const quarter2 = grades[subject]?.quarter2 ?? null;
        const generalAvg = grades[subject]?.generalAvg ?? null;
  
        // Only add subjects with at least one valid value
        if (quarter1 !== null || quarter2 !== null || generalAvg !== null) {
          result[subject] = { quarter1, quarter2, generalAvg };
        }
        return result;
      }, {});
  
      if (!querySnapshot.empty) {
        // Update existing document
        const docId = querySnapshot.docs[0].id;
        await gradesRef.doc(docId).update({
          grades: Object.keys(sanitizedGrades).map(subject => ({
            subjectName: subject,
            ...sanitizedGrades[subject],
          })),
          quarter1Avg, // Save the Quarter 1 Average
          quarter2Avg,
          totalGrade
        });
      } else {
        // Add new document
        await gradesRef.add({
          studentId: selectedStudent.id,
          semester: selectedSemester,
          grades: Object.keys(sanitizedGrades).map(subject => ({
            subjectName: subject,
            ...sanitizedGrades[subject],
          })),
          quarter1Avg, // Save the Quarter 1 Average
          quarter2Avg,
          totalGrade
        });
      }
  
      console.log('Grades saved successfully!');
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Grade has been saved.',
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error('Error saving grades:', error);
      setError('Error saving grades');
    }
  };
 
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

  const roundToTwoDecimalPlaces = (value) => parseFloat(value.toFixed(2));

  return (
    <SafeAreaView className="h-full">
      <View className="p-6">
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
                          name="duplicate-outline"
                          size={28}
                          color='blue' 
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
            <View className="w-[90%] h-[80%] bg-white rounded-xl p-4">
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
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
                      <Text className="absolute -top-4 font-psemibold text-lg bg-secondary rounded-lg text-white">{"  "}Input Grade{"  "}</Text>
                      {/* Semester Selection */}
                      <View className="mt-4 w-full">
                        <Text className="font-psemibold text-sm">Select Semester:</Text>
                        <FlatList
                          data={semesters}
                          horizontal={true}
                          keyExtractor={(item) => item}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              onPress={() => handleSemesterChange(item)}
                              
                              className={`${ selectedSemester === item ? 'bg-secondary text-white' : 'bg-gray-200'} p-3 mr-2 rounded-full`}
                            >
                              <Text className={`${selectedSemester === item ? ' text-white' : 'bg-gray-200'} font-pregular text-sm`}>{item}</Text>
                            </TouchableOpacity>
                          )}
                        />
                      </View>

                      {/* Subject Inputs */}
                      <View className="mt-6 w-full">
                        {subjects.map((subject) => (
                          <View key={subject} className="mb-4">
                            <Text className="font-psemibold">{subject}</Text>
                            <View className="flex-row gap-4 w-full">
                              <View>
                                <Text className="font-pregular">Quarter 1:</Text>
                                <TextInput
                                  className="border-2 rounded-lg w-[85px] font-pregular text-sm"
                                  keyboardType="numeric"
                                  value={grades[subject]?.quarter1 != null ? grades[subject]?.quarter1.toString() : ''}
                                  onChangeText={(value) => handleGradeChange(subject, 'quarter1', value)}
                                />
                              </View>
                              <View>
                                <Text className="font-pregular">Quarter 2:</Text>
                                <TextInput
                                  className="border-2 rounded-lg w-[85px] font-pregular text-sm"
                                  keyboardType="numeric"
                                  value={grades[subject]?.quarter2 != null ? grades[subject]?.quarter2.toString() : ''}
                                  onChangeText={(value) => handleGradeChange(subject, 'quarter2', value)}
                                />
                              </View>
                              <View>
                                <Text className="font-pregular">General Avg.:</Text>
                                <TextInput
                                  value={grades[subject]?.generalAvg?.toFixed(2) || ''}
                                  editable={false}
                                  className="border-2 border-gray-200 rounded-lg w-[85px] font-psemibold text-sm text-center"
                                />
                              </View>
                            </View>
                          </View>
                        ))}
                        <View className="mt-4 flex-row w-full">
                          <View className="w-1/2">
                            <Text className="font-psemibold">Q1 Average:</Text>
                            <Text className="font-pregular">{quarter1Avg.toFixed(2) || '0.00'}%</Text>
                          </View>
                          <View className="w-1/2">
                            <Text className="font-psemibold">Q2 Average:</Text>
                            <Text className="font-pregular">{quarter2Avg.toFixed(2) || '0.00'}%</Text>
                          </View>
                        </View>
                        <View className="w-full border-t-2 border-gray-500 mt-1 flex-row items-center">
                          <Text className="font-pbold mt-2 w-1/2">
                            Total Grade
                          </Text>
                          <Text className="w-1/2 mt-2 text-right font-pblack text-3xl">{totalGrade.toFixed(2) || '0.00'}%</Text>
                        </View>
                      </View>
                      
                    </View>
                  </View>
                )}
              </ScrollView>
              <View className="flex-row justify-end items-end">
                <TouchableOpacity onPress={saveGrades} className="flex-row items-center bg-green-600 h-10 justify-center px-2 rounded-lg mr-3">
                  <Text className="font-pmedium text-white text-base">Save</Text>
                  <Ionicons name="checkmark" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => closeModal()} 
                  className="flex-row items-center bg-red-600 h-10 justify-center px-2 rounded-lg"
                >
                  <Text className="font-pmedium text-white text-base">Close</Text>
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
               
              </View>
              
            </View>
          </View>
          <Toast position="top"/>
        </Modal>
      </View>
    </SafeAreaView>
  )
}

export default Grades