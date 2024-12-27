import { StatusBar } from 'expo-status-bar';
import { ScrollView, Text, View, Image, TouchableOpacity } from 'react-native';
import { Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../constants'

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{
        height: '100%'
      }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image 
            source={images.logo}
            className="w-40 h-40"
            resizeMode='contain'
          />
          <Text className="font-psemibold text-gray-500 text-2xl">Present!</Text>
          <Text className="font-pregular text-center">
            This app will help teachers and students to have a manageable attendance system in their class and can store information about the students.
          </Text>
          <TouchableOpacity 
            className="bg-secondary rounded-xl min-h-[62px] justify-center items-center w-full mt-7"
            onPress={() => router.push('/sign-in')}
          >
            <Text className="text-white font-psemibold text-lg">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
