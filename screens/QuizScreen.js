import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from 'react-native';
import Toast from 'react-native-toast-message';

const questions = [
  {
    question: 'What is the capital of France?',
    options: ['Paris', 'London', 'Berlin', 'Madrid'],
    answer: 'Paris'
  },
  {
    question: 'What is 5 + 3?',
    options: ['5', '8', '9', '7'],
    answer: '8'
  },
  {
    question: 'Which language is used for Android development?',
    options: ['Swift', 'Kotlin', 'JavaScript', 'Python'],
    answer: 'Kotlin'
  }
];

const QuizScreen = ({ navigation }) => {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);

  const currentQuestion = questions[current];

  const startTimer = () => {
    setTimeLeft(15);
    progress.setValue(1);

    Animated.timing(progress, {
      toValue: 0,
      duration: 15000,
      useNativeDriver: false
    }).start();

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          clearInterval(intervalRef.current);
          Toast.show({ type: 'info', text1: "⏰ Time's up!" });
          setTimeout(() => moveToNext(), 800);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const checkAnswer = option => {
    setSelected(option);
    clearInterval(intervalRef.current);
    const isCorrect = option === currentQuestion.answer;
  
    if (isCorrect) {
      setScore(prev => {
        const newScore = prev + 1;
        setTimeout(() => moveToNext(newScore), 1000);
        return newScore;
      });
    } else {
      setTimeout(() => moveToNext(score), 1000);
    }
  
    Toast.show({
      type: isCorrect ? 'success' : 'error',
      text1: isCorrect ? '✅ Correct!' : '❌ Wrong!'
    });
  };
  
  const moveToNext = (updatedScore = score) => {
    setSelected(null);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setTimeLeft(15);
      fadeIn();
    } else {
      navigation.navigate('Result', { score: updatedScore, total: questions.length });
    }
  };
  

  useEffect(() => {
    startTimer();
    fadeIn();
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(intervalRef.current);
    };
  }, [current]);

  const getOptionStyle = option => {
    if (!selected) return styles.option;
    if (option === currentQuestion.answer) return styles.correctOption;
    if (option === selected) return styles.wrongOption;
    return styles.optionDisabled;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.question}>
          {current + 1}. {currentQuestion.question}
        </Text>

        <View style={styles.timerContainer}>
          <Text style={styles.timeText}>⏱ {timeLeft}s</Text>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  })
                }
              ]}
            />
          </View>
        </View>

        <FlatList
          data={currentQuestion.options}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={getOptionStyle(item)}
              onPress={() => !selected && checkAnswer(item)}
              activeOpacity={0.8}
              disabled={!!selected}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  question: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
  timerContainer: { marginBottom: 15 },
  timeText: { fontSize: 16 },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 5
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2196f3'
  },
  option: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#eee'
  },
  correctOption: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#4caf50'
  },
  wrongOption: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#f44336'
  },
  optionDisabled: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#e0e0e0'
  },
  optionText: {
    fontSize: 18,
    color: '#000'
  }
});

export default QuizScreen;
