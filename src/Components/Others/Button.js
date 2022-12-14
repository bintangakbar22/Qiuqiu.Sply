import React from 'react';
import {Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {COLORS} from '../../Utils/Colors';
import {FONTS} from '../../Utils/Fonts';

const Button = ({caption, onPress,disabled,style,styleText}) => {
  return (
    <TouchableOpacity style={[styles.Container,{width:caption=="Preview"||caption=="Posting"?window.width * 0.75:window.width * 0.75,marginHorizontal:5,backgroundColor:caption=="Delete"?"#871f1b":'#666666'},style]} onPress={onPress} disabled={disabled}>
      <Text style={[styles.Text,styleText]}>{caption}</Text>
    </TouchableOpacity>
  );
};

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  Container: {
    backgroundColor: '#E7E7E7',
    width: window.width * 0.75,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 15,
    marginTop: 10,
  },
  Text: {
    fontFamily: FONTS.Bold,
    fontSize: 15,
    color: COLORS.white,
  },
});

export default Button;
