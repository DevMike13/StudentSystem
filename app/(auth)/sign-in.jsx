import { View, Text, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { images } from '../../constants'

const SignIn = () => {

  const [rfidNo, setRfidNo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center px-4 my-6">
          <View className="w-full items-center">
            <Image 
              source={images.logo}
              className="w-40 h-40"
              resizeMode='contain'
            />
          </View>
          <Text className="text-2xl text-secondary mt-10 font-psemibold">Log in to <Text className="text-primary">Present!</Text></Text>
          <View className="space-y-2 mt-7">
            <Text className="text-base text-secondary font-pmedium">RFID No.</Text>
            <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
              <TextInput
                value={rfidNo}
                onChangeText={setRfidNo}
                placeholder="Enter RFID No."
                className="flex-1 text-secondary font-psemibold text-base"
              />
            </View>
          </View>

          <View className="space-y-2 mt-7">
            <Text className="text-base text-secondary font-pmedium">Password</Text>
            <View className="w-full h-16 px-4 border-2 border-secondary rounded-2xl focus:border-primary items-center flex-row">
              <TextInput
                placeholder="Enter password"
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
          <TouchableOpacity 
            className="bg-secondary rounded-xl min-h-[62px] justify-center items-center w-full mt-7"
            onPress={() => {}}
          >
            <Text className="text-white font-psemibold text-lg">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn