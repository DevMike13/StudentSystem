import { View, Text, TextInput, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { SelectList } from 'react-native-dropdown-select-list'
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/compat/auth';

import { firestore, auth } from '../../../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { images } from '../../../constants'
import DateTimePicker from '@react-native-community/datetimepicker';

const Register = () => {

    const [lrn, setLrn] = useState('');
    const [firstname, setFirstname] = useState('');
    const [middlename, setMiddlename] = useState('');
    const [lastname, setLastname] = useState('');
    const [rfidNo, setRfidNo] = useState('');
    const [mobileNo, setMobileNo] = useState('+63');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [gender, setGender] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());
    const [address, setAddress] = useState('');
    const [currentAddress, setCurrentAddress] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [guardianFirstname, setGuardianFirstname] = useState('');
    const [guardianLastname, setGuardianLastname] = useState('');
    const [guardianMobileNo, setGuardianMobileNo] = useState('+63');
    const [guardianAddress, setGuardianAddress] = useState('');

    const [course, setCourse] = useState('STEM');
    const [section, setSection] = useState('');

    const [loading, setLoading] = useState(false);

    const sections = [
      {key:'1', value:'STEM A'},
      {key:'2', value:'STEM B'},
      {key:'3', value:'STEM C'},
      {key:'4', value:'STEM D'},
      {key:'5', value:'STEM E'},
      {key:'6', value:'STEM F'},
      {key:'7', value:'STEM G'},
      {key:'8', value:'STEM H'},
    ]

    const handleChangeText = (text) => {
        if (!text.startsWith('+63')) {
          text = '+63';
        }
        const digitsOnly = text.slice(3).replace(/\D/g, '');
    
        if (digitsOnly.length > 10) {
          text = '+63' + digitsOnly.slice(0, 10);
        } else {
          text = '+63' + digitsOnly;
        }
    
        setMobileNo(text);
    };

    const handleChangeTextGuardian = (text) => {
      if (!text.startsWith('+63')) {
        text = '+63';
      }
      const digitsOnly = text.slice(3).replace(/\D/g, '');
  
      if (digitsOnly.length > 10) {
        text = '+63' + digitsOnly.slice(0, 10);
      } else {
        text = '+63' + digitsOnly;
      }
  
      setGuardianMobileNo(text);
  };

    const handleRegister = async () => {
        if (
          !firstname ||
          !middlename ||
          !lastname ||
          !rfidNo ||
          !lrn ||
          !mobileNo ||
          !gender ||
          !address ||
          !currentAddress ||
          !birthdate ||
          !guardianFirstname ||
          !guardianLastname ||
          !guardianMobileNo ||
          !guardianAddress ||
          !course ||
          !section
        ) {
          Alert.alert('Error', 'All fields are required!');
          return;
        }

        if (password !== confirmPassword) {
          Alert.alert('Error', 'Passwords do not match!');
          return;
        }
        
        try {
        
         setLoading(true);

          const userDoc = await firestore.collection('Users').doc(rfidNo).get();
          if (userDoc.exists) {
            Alert.alert('Error', 'RFID No. already registered!');
            setLoading(false);
            return;
          }
    
          await auth.createUserWithEmailAndPassword(rfidNo + '@example.com', password);
          await firestore.collection('Users').doc(rfidNo).set({
            FirstName: firstname,
            MiddleName: middlename,
            LastName: lastname,
            RFIDNo: rfidNo,
            LRN: lrn,
            MobileNo: mobileNo,
            Gender: gender,
            Address: address,
            CurrentAddress: currentAddress,
            Birthdate: birthdate.toISOString(),
            GuardianFirstName: guardianFirstname,
            GuardianLastName: guardianLastname,
            GuardianMobileNo: guardianMobileNo,
            GuardianAddress: guardianAddress,
            Course: course,
            Section: section,
            Role: "student"
          });
    
          Alert.alert('Success', 'Registration successful!');
          setFirstname('');
          setMiddlename('');
          setLastname('');
          setRfidNo('');
          setLrn('');
          setMobileNo('+63');
          setPassword('');
          setConfirmPassword('');
          setGender('');
          setAddress('');
          setCurrentAddress('');
          setBirthdate(new Date());
          setGuardianFirstname('');
          setGuardianLastname('');
          setGuardianMobileNo('+63');
          setGuardianAddress('');
          setLoading(false);

        } catch (error) {
          console.error("Error during registration: ", error);
          Alert.alert('Error', 'Something went wrong, please try again!');
          setLoading(false);
        }
      };
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center px-4 my-6">
          <View className="w-full items-center mb-5">
            <Image 
              source={images.logo}
              className="w-20 h-20"
              resizeMode='contain'
            />
          </View>
          <View className="border-2 border-secondary border-dashed w-full px-4 py-5 items-center relative">
            <Text className="absolute -top-4 font-psemibold text-xl bg-secondary rounded-lg text-white">{"  "}Student Info{"  "}</Text>
            <View className="flex flex-row gap-2 px-1">
              <View className="space-y-2 mt-7 w-1/2">
                <Text className="text-base text-secondary font-pmedium">Firstname</Text>
                <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                  <TextInput
                    value={firstname}
                    onChangeText={setFirstname}
                    placeholder="Enter Firstname"
                    className="flex-1 text-secondary font-psemibold text-base"
                  />
                </View>
              </View>

              <View className="space-y-2 mt-5 w-1/2">
                <Text className="text-base text-secondary font-pmedium">Middlename</Text>
                <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                  <TextInput
                    value={middlename}
                    onChangeText={setMiddlename}
                    placeholder="Enter Middlename"
                    className="flex-1 text-secondary font-psemibold text-base"
                  />
                </View>
              </View>
            </View>

            <View className="space-y-2 mt-3">
              <Text className="text-base text-secondary font-pmedium">Lastname</Text>
              <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                  value={lastname}
                  onChangeText={setLastname}
                  placeholder="Enter Lastname"
                  className="flex-1 text-secondary font-psemibold text-base"
                />
              </View>
            </View>

            <View className="space-y-2 mt-5">
              <Text className="text-base text-secondary font-pmedium">Gender</Text>
              <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={{
                    flex: 1
                  }}
                >
                  <Picker.Item label="Select Gender" value=""/>
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="N/A" value="N/A" />
                </Picker>
              </View>
            </View>

            <View className="space-y-2 mt-5">
              <Text className="text-base text-secondary font-pmedium">Birthdate</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row"
              >
                <Text className="flex-1 text-secondary font-psemibold text-base">
                  {birthdate ? birthdate.toDateString() : 'Select Birthdate'}
                </Text>
                <Ionicons name="calendar-outline" size={24} color="blue" />
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={birthdate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setBirthdate(selectedDate);
                }}
              />
            )}

            <View className="space-y-2 mt-5">
              <Text className="text-base text-secondary font-pmedium">Mobile No.</Text>
              <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                  placeholder="Enter Mobile No."
                  value={mobileNo}
                  onChangeText={handleChangeText}
                  keyboardType="phone-pad"
                  className="flex-1 text-secondary font-psemibold text-base"
                />
              </View>
            </View>
            
            <View className="space-y-2 mt-5">
              <Text className="text-base text-secondary font-pmedium">Permanent Address</Text>
              <View className="w-full h-32 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                   value={address}
                   onChangeText={setAddress}
                   placeholder="Enter your address"
                   multiline={true}  // This makes it a multiline input
                   numberOfLines={4}
                    className="flex-1 text-secondary font-psemibold text-base uppercase"
                />
              </View>
            </View>

            <View className="space-y-2 mt-5">
              <Text className="text-base text-secondary font-pmedium">Current Address</Text>
              <View className="w-full h-32 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                   value={currentAddress}
                   onChangeText={setCurrentAddress}
                   placeholder="Enter your current address"
                   multiline={true}  // This makes it a multiline input
                   numberOfLines={4}
                    className="flex-1 text-secondary font-psemibold text-base uppercase"
                />
              </View>
            </View>

            <View className="space-y-2 mt-5">
              <Text className="text-base text-secondary font-pmedium">RFID No.</Text>
              <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                  value={rfidNo}
                  onChangeText={(text) => setRfidNo(text.toUpperCase())}
                  placeholder="Enter RFID No."
                  className="flex-1 text-secondary font-psemibold text-base uppercase"
                />
              </View>
            </View>

            <View className="space-y-2 mt-5">
              <Text className="text-base text-secondary font-pmedium">LRN</Text>
              <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                  value={lrn}
                  onChangeText={setLrn}
                  placeholder="Enter LRN"
                  className="flex-1 text-secondary font-psemibold text-base uppercase"
                />
              </View>
            </View>
          </View>
          
          <View className="border-2 border-secondary border-dashed w-full px-4 py-5 items-center relative mt-7">
            <Text className="absolute -top-4 font-psemibold text-xl bg-secondary rounded-lg text-white">{"  "}Guardian Info{"  "}</Text>
            <View className="space-y-2 mt-3">
              <Text className="text-base text-secondary font-pmedium">Firstname</Text>
              <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                  value={guardianFirstname}
                  onChangeText={setGuardianFirstname}
                  placeholder="Enter Firstname"
                  className="flex-1 text-secondary font-psemibold text-base"
                />
              </View>
            </View>

            <View className="space-y-2 mt-3">
              <Text className="text-base text-secondary font-pmedium">Lastname</Text>
              <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                  value={guardianLastname}
                  onChangeText={setGuardianLastname}
                  placeholder="Enter Lastname"
                  className="flex-1 text-secondary font-psemibold text-base"
                />
              </View>
            </View>

            <View className="space-y-2 mt-5">
              <Text className="text-base text-secondary font-pmedium">Mobile No.</Text>
              <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                  placeholder="Enter Mobile No."
                  value={guardianMobileNo}
                  onChangeText={handleChangeTextGuardian}
                  keyboardType="phone-pad"
                  className="flex-1 text-secondary font-psemibold text-base"
                />
              </View>
            </View>

            <View className="space-y-2 mt-5">
              <Text className="text-base text-secondary font-pmedium">Address</Text>
              <View className="w-full h-32 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                  value={guardianAddress}
                  onChangeText={setGuardianAddress}
                  placeholder="Enter address"
                  multiline={true}
                  numberOfLines={4}
                  className="flex-1 text-secondary font-psemibold text-base uppercase"
                />
              </View>
            </View>

          </View>
        
          <View className="border-2 border-secondary border-dashed w-full h-auto px-4 py-5 items-center relative mt-7">
            <Text className="absolute -top-4 font-psemibold text-xl bg-secondary rounded-lg text-white">{"  "}Student Course Info{"  "}</Text>
            <View className="space-y-2 mt-3">
              <Text className="text-base text-secondary font-pmedium">Course</Text>
              <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                  value={course}
                  onChangeText={setCourse}
                  placeholder="Enter Course"
                  editable={false}
                  className="flex-1 text-secondary font-psemibold text-base"
                />
              </View>
            </View>

            <View className="space-y-2 mt-7 w-full">
              <Text className="text-base text-secondary font-pmedium mb-2">Confirm Temporary Password</Text>
                <SelectList 
                  setSelected={(val) => setSection(val)} 
                  data={sections} 
                  save="value"
                  fontFamily='font-pmedium'
                  search={false}
                  boxStyles={{ width: '100%', borderWidth: 2, borderColor: 'black', height: 60, borderRadius: 15  }}
                  dropdownStyles={{ width: '100%' }}
                  dropdownItemStyles={{ width: '100%' }}
                  inputStyles={{ justifyContent: 'center', alignItems: 'center', paddingTop: 5 }}
                />
            </View>
          </View>
          
          <View className="border-2 border-secondary border-dashed w-full px-4 py-5 items-center relative mt-7">
            <Text className="absolute -top-4 font-psemibold text-xl bg-secondary rounded-lg text-white">{"  "}Student Credentials{"  "}</Text>
            <View className="space-y-2 mt-5">
              <Text className="text-base text-secondary font-pmedium">Temporary Password</Text>
              <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                  placeholder="Enter temporary password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 text-secondary font-psemibold text-base"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={`${!showPassword ? 'eye-off-outline' : "eye-outline"}`}
                    size={28}
                    color='blue'
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="space-y-2 mt-7">
              <Text className="text-base text-secondary font-pmedium">Confirm Temporary Password</Text>
              <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
                <TextInput
                  placeholder="Enter password confirmation"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  className="flex-1 text-secondary font-psemibold text-base"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={`${!showConfirmPassword ? 'eye-off-outline' : "eye-outline"}`}
                    size={28}
                    color='blue'
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            className="bg-secondary rounded-xl min-h-[62px] justify-center items-center w-full mt-7"
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" /> 
            ) : (
              <Text className="text-white font-psemibold text-lg">Register</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Register