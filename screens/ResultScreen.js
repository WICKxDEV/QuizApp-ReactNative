// screens/ResultScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ResultScreen = ({ route, navigation }) => {
  const score = route?.params?.score ?? 0;
  const total = route?.params?.total ?? 0;
  const percentage = ((score / total) * 100).toFixed(0);

  const getMessage = () => {
    if (percentage >= 80) return '🎉 Excellent!';
    if (percentage >= 50) return '👍 Good Job!';
    return '🧠 Keep Practicing!';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getMessage()}</Text>
      <Text style={styles.scoreText}>
        You scored {score} out of {total}
      </Text>
      <Text style={styles.percentage}>({percentage}%)</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Quiz')}
      >
        <Text style={styles.buttonText}>🔁 Retry Quiz</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>🏠 Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333'
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 8
  },
  percentage: {
    fontSize: 18,
    color: '#888',
    marginBottom: 30
  },
  button: {
    backgroundColor: '#2196f3',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 10
  },
  secondaryButton: {
    backgroundColor: '#4caf50'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default ResultScreen;
