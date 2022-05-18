import React  from "react";
import {Text, View, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';

import Homescreen from "./src/components/Homescreen";
import OutputScreen from "./src/components/OutputScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
      <NavigationContainer >
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Homescreen" component={Homescreen} />
          <Stack.Screen name="Outputscreen" component={OutputScreen} />
        </Stack.Navigator>  
      </NavigationContainer>
  );
}

export default App;