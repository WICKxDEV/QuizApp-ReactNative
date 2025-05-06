// HomeScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const buttonScale = new Animated.Value(1);
  const titlePosition = new Animated.Value(30);
  const buttonOpacity = new Animated.Value(0);
  const buttonY = new Animated.Value(20);

  useEffect(() => {
    // Staggered animations
    Animated.sequence([
      Animated.timing(titlePosition, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonY, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handlePressIn = (scaleValue) => {
    Animated.spring(buttonScale, {
      toValue: scaleValue,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const startQuiz = (difficulty) => {
    navigation.navigate('Quiz', { difficulty });
  };

  return (
    <LinearGradient
      colors={['#6C63FF', '#8E85FF', '#B6AFFF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.header, { transform: [{ translateY: titlePosition }] }]}>
          <LottieView
            source={require('../assets/animations/brain.json')}
            autoPlay
            loop
            style={styles.brainAnimation}
          />
          <Text style={styles.title}>QuizMaster</Text>
          <Text style={styles.subtitle}>Test your knowledge across various topics</Text>
        </Animated.View>

        <View style={styles.buttonContainer}>
          {['easy', 'medium', 'hard'].map((difficulty, index) => (
            <Animated.View
              key={difficulty}
              style={[
                styles.buttonWrapper,
                {
                  opacity: buttonOpacity,
                  transform: [
                    { translateY: buttonY },
                    { scale: buttonScale },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.button, styles[`${difficulty}Button`]]}
                onPressIn={() => handlePressIn(0.96)}
                onPressOut={handlePressOut}
                onPress={() => startQuiz(difficulty)}
                activeOpacity={0.85}
              >
                <View style={styles.emojiContainer}>
                  <Text style={styles.emoji}>
                    {getDifficultyIcon(difficulty)}
                  </Text>
                </View>
                <View style={styles.buttonTextContainer}>
                  <Text style={styles.buttonText}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Text>
                  <Text style={styles.buttonSubtext}>
                    {getDifficultyDescription(difficulty)}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

const getDifficultyIcon = (difficulty) => {
  switch(difficulty) {
    case 'easy': return '🌱'; // Sprout emoji
    case 'medium': return '⭐️'; // Star emoji
    case 'hard': return '🔥'; // Fire emoji
    default: return '❓'; // Question mark for fallback
  }
};

const getDifficultyDescription = (difficulty) => {
  switch(difficulty) {
    case 'easy': return 'Great for beginners';
    case 'medium': return 'Balanced challenge';
    case 'hard': return 'Expert level only';
    default: return '';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: height * 0.08,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: height * 0.08,
  },
  brainAnimation: {
    width: 140,
    height: 140,
    marginBottom: 18,
  },
  title: {
    fontSize: 44,
    color: 'white',
    fontFamily: 'Poppins-Bold',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.95)',
    fontFamily: 'Poppins-Medium',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 26,
    letterSpacing: 0.3,
  },
  buttonContainer: {
    marginTop: 10,
  },
  buttonWrapper: {
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 6,
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 28,
    textAlign: 'center',
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#2D3748',
    marginBottom: 2,
  },
  buttonSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#718096',
  },
  easyButton: {
    borderLeftWidth: 6,
    borderLeftColor: '#48BB78',
    backgroundColor: '#F0FFF4',
  },
  mediumButton: {
    borderLeftWidth: 6,
    borderLeftColor: '#ECC94B',
    backgroundColor: '#FFFAF0',
  },
  hardButton: {
    borderLeftWidth: 6,
    borderLeftColor: '#F56565',
    backgroundColor: '#FFF5F5',
  },
});

export default HomeScreen;