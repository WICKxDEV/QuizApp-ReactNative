import React, { useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';

const OptionButton = ({ 
  option, 
  isCorrect, 
  isSelected, 
  isDisabled, 
  onPress 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true })
    ]).start();
    onPress();
  };

  const getStyle = () => {
    if (!isSelected) return styles.option;
    if (isCorrect) return styles.correctOption;
    return styles.wrongOption;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[getStyle(), isDisabled && styles.optionDisabled]}
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={isDisabled}
      >
        <Text style={styles.optionText}>{option}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  option: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#eee',
    elevation: 2
  },
  correctOption: {
    backgroundColor: '#4caf50'
  },
  wrongOption: {
    backgroundColor: '#f44336'
  },
  optionDisabled: {
    backgroundColor: '#e0e0e0'
  },
  optionText: {
    fontSize: 18,
    color: '#000'
  }
});

export default OptionButton;