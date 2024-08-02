import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

function CustomButton({ onPress, title }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#008CBA',
    borderRadius: 5,
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
