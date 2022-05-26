import React, {useState, useEffect}  from 'react';
import {Text, View, TouchableOpacity, StatusBar, ToastAndroid, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import * as MediaLibrary from 'expo-media-library';
import * as FS from "expo-file-system";

import Header from './Header';

const OutputScreen = ({ route, navigation }) => {
	const [disableDownload, setDisableDownload] = useState(true);
  console.log(route)
  const scannedImageP = route.params.scannedImageP;
  const scannedImagePDF = route.params.scannedImagePDF;
  const scannedImageDoc = route.params.scannedImageDoc;
  console.log("inner", scannedImageP);
	
  const saveFile = async () => {
		const asset = await MediaLibrary.createAssetAsync(scannedImageP);
		await MediaLibrary.createAlbumAsync("CasecadeOCR", asset, false);
    showToast();
    navigation.goBack();
	}

  const saveFilePDF = async () => {
		const asset = await MediaLibrary.createAssetAsync(scannedImagePDF);
		await MediaLibrary.createAlbumAsync("CasecadeOCR", asset, false);
    showToast();
    navigation.goBack();
	}

  const saveFileDoc = async () => {
    console.log("downloading doc");
    console.log(scannedImageDoc);
		const asset = await MediaLibrary.createAssetAsync(scannedImageDoc);
		await MediaLibrary.createAlbumAsync("CasecadeOCR", asset, false);

    showToast();
    navigation.goBack();
	}

  useEffect(() => {
    if(scannedImageP != '') {
      setDisableDownload(false)
    }
  });

  function showToast() {
    ToastAndroid.show('Downloaded', ToastAndroid.SHORT);
  }

	return (
		<SafeAreaView style={{flex: 1, flexDirection: "column"}}>
			<StatusBar backgroundColor="lightgray" barStyle="dark-content"/>
			<Header name="Download Image" bgColor={{backgroundColor: 'lightgray'}} alertMessage="Download scanned document"/>
			<View style={{flex: 3, backgroundColor:"black"}}>
			<View style={styles.imageContainer}>
			{
				scannedImageP !== '' &&<Image
					source={{ uri: scannedImageP }}
					style={styles.image}
				/>
			}
			</View>
			</View>
			<View style={{flex: .3, flexDirection:"row", backgroundColor:"black", justifyContent: 'space-between', alignItems: 'center', resizeMode: 'contain'}}>
          <TouchableOpacity style={styles.round} onPress={saveFilePDF}>
            <Text style={styles.buttonLabel2} disabled={disableDownload}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.round} onPress={saveFileDoc}>
            <Text style={styles.buttonLabel2} disabled={disableDownload}>Download Doc</Text>
          </TouchableOpacity>
      </View >
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
  buttonLabel2: {
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 20,
    color:"white",
  },

  image: {
    height: "100%",
    width: "100%",
    alignSelf: 'center',
    justifyContent: 'center',
    resizeMode: 'contain',
    alignItems: 'center',

  },
  imageContainer: {
    height: "100%",
    width: "100%",
    padding:5,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
 },

  round: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: 190,
    borderRadius: 40,
    backgroundColor: '#34b4eb',
  }
});

export default OutputScreen;