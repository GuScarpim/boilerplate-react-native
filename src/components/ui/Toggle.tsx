import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated } from 'react-native';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ value, onValueChange, disabled = false }) => {
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22], // Ajustado para melhor posicionamento
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#9CA3AF', '#10B981'], // gray-400 para green-500
  });

  return (
    <TouchableOpacity
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      activeOpacity={0.7}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <Animated.View
        className="w-12 h-7 rounded-full justify-center"
        style={{ backgroundColor }}
      >
        <Animated.View
          className="w-5 h-5 rounded-full bg-white shadow-sm"
          style={{
            transform: [{ translateX }],
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

