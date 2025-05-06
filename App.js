import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import ResultScreen from './screens/ResultScreen';
import Toast from 'react-native-toast-message';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6C63FF',
              elevation: 0, // Remove shadow on Android
              shadowOpacity: 0, // Remove shadow on iOS
              height: 60, // Fixed header height
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontFamily: 'Poppins-SemiBold',
              fontSize: 18,
              letterSpacing: 0.5,
            },
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerBackButtonMenuEnabled: false,
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              headerShown: false 
            }} 
          />
          <Stack.Screen 
            name="Quiz" 
            component={QuizScreen} 
            options={({ route }) => ({
              title: `${route.params?.difficulty || 'Quiz'} Mode`,
              headerLeft: () => null, // Remove back button
            })}
          />
          <Stack.Screen 
            name="Result" 
            component={ResultScreen} 
            options={{
              headerShown: false,
              gestureEnabled: false, // Prevent swiping back
            }}
          />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </>
  );
}

// Optional: Custom header component for more control
const CustomHeader = ({ title }) => (
  <View style={headerStyles.container}>
    <Text style={headerStyles.title}>{title}</Text>
  </View>
);

const headerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
});