import { View, Text, Alert, ActivityIndicator, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Redirect, router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { firestore, firebase } from '../../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const StudentProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString !== null) {
          const parsedUserData = JSON.parse(userDataString);
          setUserData(parsedUserData);
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

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill out both password fields.',
      });
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match.',
      });
      return;
    }
  
    try {
      const currentStudent = firebase.auth().currentUser;
      if (currentStudent) {
        const cred = firebase.auth.EmailAuthProvider.credential(currentStudent.email, oldPassword);
        await currentStudent.reauthenticateWithCredential(cred);
        console.log(cred);
        await currentStudent.updatePassword(newPassword);
        

        await firebase.auth().signOut();
        logout();
        
        // Clear the modal and password fields
        setModalVisible(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
  
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Password updated successfully!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'User not logged in.',
        });
      }
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Incorrect current password.',
        });
      } else if (error.code === 'auth/weak-password') {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Password is too weak. Please choose a stronger password.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to update password.',
        });
      }
    }
  };
  

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      router.replace('/');
    } catch (error) {
      console.log('Error logging out', error);
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
    <SafeAreaView className="flex-1 p-5">
      <Text className="text-3xl font-pbold text-center mb-4">Profile</Text>
      <View className="w-full flex justify-center items-center text-center">
        <View className="w-fit h-fit">
          <Ionicons
            name="person-circle-outline"
            size={120}
            color='gray' 
          />
        </View>
      </View>
      <View className="space-y-2">
        <Text className="text-lg font-psemibold text-secondary">Name: <Text className="text-gray-500">{userData.LastName}, {userData.FirstName}</Text></Text>
        <Text className="text-lg font-psemibold text-secondary">Username: <Text className="text-gray-500">{userData.RFIDNo}</Text></Text>
        <Text className="text-lg font-psemibold text-secondary">Mobile No.: <Text className="text-gray-500">{userData.MobileNo}</Text></Text>
        <Text className="text-lg font-psemibold text-secondary">Role: <Text className="text-gray-500 capitalize">{userData.Role}</Text></Text>
      </View>
      <View className="mt-5">
        <TouchableOpacity
          className="bg-blue-500 rounded-full py-2 px-4 justify-center items-center mb-3"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white text-lg font-pmedium">Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={logout}
          className="bg-red-500 rounded-full py-2 px-4 justify-center items-center"
        >
          <Text className="text-white text-lg font-pmedium">Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for changing password */}
      <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          animationType="slide"
          transparent={true}
        >
          <View className="flex-1 justify-center items-center bg-gray-800/70">
            <View className="w-4/5 h-[65%] bg-white rounded-xl p-4">
              <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="border-2 border-secondary border-dashed w-full h-auto px-4 py-5 items-center relative mt-7">
                  <Text className="absolute -top-4 font-psemibold text-xl bg-secondary rounded-lg text-white">{"  "}Change Password{"  "}</Text>
                  <View className="space-y-2 mt-5">
                    <Text className="text-base text-secondary font-pmedium">Current Password</Text>
                    <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                      <TextInput
                        placeholder="Enter temporary password"
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        secureTextEntry={!isOldPasswordVisible}
                        className="flex-1 text-secondary font-psemibold text-base"
                      />
                      <TouchableOpacity onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)}>
                        <Ionicons
                          name={`${!isOldPasswordVisible ? 'eye-off-outline' : "eye-outline"}`}
                          size={28}
                          color='blue'
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="space-y-2 mt-5">
                    <Text className="text-base text-secondary font-pmedium">New Password</Text>
                    <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                      <TextInput
                        placeholder="New Password"
                        value={newPassword}
                        onChangeText={setNewPassword}
                        secureTextEntry={!isNewPasswordVisible}
                        className="flex-1 text-secondary font-psemibold text-base"
                      />
                      <TouchableOpacity onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
                        <Ionicons
                          name={`${!isNewPasswordVisible ? 'eye-off-outline' : "eye-outline"}`}
                          size={28}
                          color='blue'
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View className="space-y-2 mt-5">
                    <Text className="text-base text-secondary font-pmedium">Confirm New Password</Text>
                    <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                      <TextInput
                        placeholder="New Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!isConfirmPasswordVisible}
                        className="flex-1 text-secondary font-psemibold text-base"
                      />
                      <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                        <Ionicons
                          name={`${!isConfirmPasswordVisible ? 'eye-off-outline' : "eye-outline"}`}
                          size={28}
                          color='blue'
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                </View>
                
              </ScrollView>
              <View className="flex-row justify-end items-end mt-2">
                  <TouchableOpacity onPress={handleChangePassword} className="flex-row items-center bg-green-600 h-10 justify-center px-2 rounded-lg mr-3">
                    <Text className="font-pmedium text-white text-base">Save</Text>
                    <Ionicons name="checkmark" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity  
                    onPress={() => setModalVisible(false)}
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
    </SafeAreaView>
  )
}

export default StudentProfile