import React  from 'react';
import {Text, View, TouchableOpacity, StatusBar, StyleSheet, Alert } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Header = ({name, bgColor, alertMessage}) => {
    return (
			<View style={[styles.container, bgColor]}>
					<Text style={[styles.label, bgColor, styles.inputWrap]}>{name}</Text>
					<FontAwesome.Button name="info-circle" size={28} backgroundColor="lightgray"
						color="black" onPress={()=>{Alert.alert("CIP Project",alertMessage)}}/>
			</View>
    );
  }

  const styles = StyleSheet.create({
    label: {
			fontFamily:'sans-serif',
			textAlign: 'left',
			paddingLeft:15,
			paddingTop:3,
			paddingBottom:3,
			fontSize: 22,
			fontWeight: 'bold',
    },
		container: {
			flexDirection: 'row',
			alignItems: 'flex-start',
		},
		inputWrap: {
			flex: 1,
			justifyContent: 'space-between',
			flexDirection: 'column'
		},
  });

  export default Header;