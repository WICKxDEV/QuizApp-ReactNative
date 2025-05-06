import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

const ProgressTimer = ({ duration, onTimeUp, currentQuestion }) => {
  const progress = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);
  const [timeLeft, setTimeLeft] = React.useState(duration);

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [currentQuestion]);

  const startTimer = () => {
    setTimeLeft(duration);
    progress.setValue(1);

    Animated.timing(progress, {
      toValue: 0,
      duration: duration * 1000,
      useNativeDriver: false
    }).start();

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          clearInterval(intervalRef.current);
          onTimeUp();
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <View style={styles.timerContainer}>
      <Text style={[styles.timeText, timeLeft < 5 && { color: 'red' }]}>
        ⏱ {timeLeft}s
      </Text>
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
  );
};

const styles = StyleSheet.create({
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
  }
});

export default ProgressTimer;