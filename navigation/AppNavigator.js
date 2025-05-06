// navigation/AppNavigator.js
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import ResultScreen from '../screens/ResultScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Quiz" 
        component={QuizScreen} 
        options={{ title: 'Quiz' }} 
      />
      <Stack.Screen 
        name="Result" 
        component={ResultScreen} 
        options={{ title: 'Results' }} 
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;