import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from 'react-native';
import Toast from 'react-native-toast-message';
import { fetchQuizQuestions } from '../services/quizService';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

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
    
    if (option === currentQuestion?.answer) {
      return styles.correctOption;
    }
    
    if (option === selected && option !== currentQuestion?.answer) {
      return styles.wrongOption;
    }
    
    return styles.optionDisabled;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
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
        <Text style={styles.noQuestionsText}>No questions available</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#F8FAFF', '#EFF2FF']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header with score and difficulty */}
        <View style={styles.header}>
          <View style={[styles.difficultyBadge, styles[`${difficulty}Badge`]]}>
            <Text style={styles.difficultyText}>{difficulty.toUpperCase()}</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {score}/{questions.length}</Text>
          </View>
        </View>

        {/* Question and timer */}
        <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Question {current + 1}/{questions.length}</Text>
            <View style={styles.timerContainer}>
              <Feather name="clock" size={18} color="#6C63FF" />
              <Text style={styles.timeText}>{timeLeft}s</Text>
            </View>
          </View>
          
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          {/* Progress bar */}
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
        </Animated.View>

        {/* Options list with improved answer feedback */}
        <FlatList
          data={currentQuestion.options}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.optionsContainer}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={getOptionStyle(item)}
              onPress={() => !selected && checkAnswer(item)}
              activeOpacity={0.85}
              disabled={!!selected}
            >
              <View style={styles.optionContent}>
                <View style={[
                  styles.optionBullet,
                  selected && {
                    backgroundColor: item === currentQuestion?.answer 
                      ? '#4CAF50' 
                      : item === selected 
                        ? '#F44336' 
                        : '#E0E0E0'
                  }
                ]}>
                  <Text style={styles.optionBulletText}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[
                  styles.optionText,
                  selected && item === currentQuestion?.answer && styles.correctText,
                  selected && item === selected && item !== currentQuestion?.answer && styles.wrongText
                ]}>
                  {item}
                </Text>
              </View>
              
              {selected && (
                <View style={[
                  styles.feedbackBadge,
                  item === currentQuestion?.answer 
                    ? styles.correctBadge 
                    : item === selected 
                      ? styles.wrongBadge 
                      : null
                ]}>
                  <Feather 
                    name={item === currentQuestion?.answer ? 'check' : 'x'} 
                    size={16} 
                    color="white" 
                  />
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    marginHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6C63FF',
    fontFamily: 'Poppins-Medium',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    padding: 30,
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    paddingHorizontal: 25,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  noQuestionsText: {
    fontSize: 18,
    color: '#6C63FF',
    textAlign: 'center',
    fontFamily: 'Poppins-Medium',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  easyBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  mediumBadge: {
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  hardBadge: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  scoreContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreText: {
    color: '#6C63FF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  questionNumber: {
    color: '#6C63FF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#6C63FF',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginLeft: 5,
  },
  questionText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#2D3748',
    lineHeight: 28,
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#EDF2F7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
  },
  optionsContainer: {
    paddingBottom: 30,
  },
  option: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  correctOption: {
    backgroundColor: '#E8F5E9',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: '#FFEBEE',
    borderWidth: 2,
    borderColor: '#F44336',
  },
  optionDisabled: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E2E8F0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionBulletText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#2D3748',
    flex: 1,
  },
  correctText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  wrongText: {
    color: '#C62828',
    fontWeight: '600',
  },
  feedbackBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctBadge: {
    backgroundColor: '#4CAF50',
  },
  wrongBadge: {
    backgroundColor: '#F44336',
  },
});

export default QuizScreen;