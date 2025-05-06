// screens/ResultScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ResultScreen = ({ navigation, route }) => {
  const { score, total, difficulty } = route.params;
  const percentage = Math.round((score / total) * 100);

  const getResultMessage = () => {
    if (percentage >= 80) return 'Excellent! 🎉';
    if (percentage >= 60) return 'Good job! 👍';
    if (percentage >= 40) return 'Not bad! 😊';
    return 'Keep practicing! 💪';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Completed!</Text>
      <Text style={styles.difficulty}>Difficulty: {difficulty}</Text>
      <Text style={styles.score}>
        Your score: {score}/{total} ({percentage}%)
      </Text>
      <Text style={styles.message}>{getResultMessage()}</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },
  difficulty: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555'
  },
  score: {
    fontSize: 24,
    marginBottom: 20
  },
  message: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default ResultScreen;