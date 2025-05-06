// screens/QuizScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import Toast from 'react-native-toast-message';
import { fetchQuizQuestions } from '../services/quizService';

const QuizScreen = ({ navigation, route }) => {
  const { difficulty } = route.params;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selected, setSelected] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuizQuestions(10, difficulty);
        setQuestions(fetchedQuestions);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Failed to load quiz',
          text2: err.message
        });
      }
    };

    loadQuestions();
  }, [difficulty]);

  const currentQuestion = questions[current];

  const startTimer = () => {
    if (!currentQuestion) return;
    
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

  const checkAnswer = (option) => {
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
      navigation.navigate('Result', { 
        score: updatedScore, 
        total: questions.length,
        difficulty 
      });
    }
  };

  useEffect(() => {
    if (questions.length > 0) {
      startTimer();
      fadeIn();
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [current, questions]);

  const getOptionStyle = (option) => {
    if (!selected) return styles.option;
    if (option === currentQuestion?.answer) return styles.correctOption;
    if (option === selected) return styles.wrongOption;
    return styles.optionDisabled;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.container}>
        <Text>No questions available</Text>
      </View>
    );
  }

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
          keyExtractor={(item, index) => index.toString()}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20
  },
  retryButton: {
    backgroundColor: '#2196f3',
    padding: 15,
    borderRadius: 10
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16
  },
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