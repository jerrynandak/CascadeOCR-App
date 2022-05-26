import React, {useState, useEffect}  from 'react';
import {Text, View, TouchableOpacity, StatusBar, StyleSheet, Alert, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import * as MediaLibrary from 'expo-media-library';
import * as FS from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

import Header from './Header';

const Homescreen = ({ navigation }) => {  
  const [pickedImagePath, setPickedImagePath] = useState('');
  const [disableUpload, setDisableUpload] = useState(true);
  const [image, setImage] = useState(null);
  const [scannedImagePath, setScannedImagePath] = useState('');
  const [scannedImagePathPDF, setScannedImagePathPDF] = useState('');
  const [scannedImagePathDoc, setScannedImagePathDoc] = useState('');
  const [didMount, setDidMount] = useState(true)

  useEffect(() => {
    if(pickedImagePath != '') {
      setDisableUpload(false)
    }
  });

  const hostMain = "192.168.43.104";
  const schema = "http://";
  const port = "5000";

  const toServer = async () => {
    let route = "/image";
    let content_type = "image/jpeg";
    let url = "";
    url = schema + hostMain + ":" + port + route;

    let response = await FS.uploadAsync(url, image.uri, {
      headers: {
        "content-type": content_type,
      },
      httpMethod: "POST",
      uploadType: FS.FileSystemUploadType.BINARY_CONTENT,
    });
    console.log("calling toserver");
    let result = await downloadFile();
  };
  
  useEffect(()=>{
    if(didMount){
        setDidMount(false);
        return;
    }
    navigation.navigate('Outputscreen',{scannedImageP: scannedImagePath, scannedImagePDF: scannedImagePathPDF, scannedImageDoc: scannedImagePathDoc});
  }, [scannedImagePathDoc])

	const downloadFile = async () => {
		let uri = "";
		let route = "/images/corrected.png";
    let route_pdf = "/pdfs/result.pdf";
    let route_doc = "/docs/result.docx";
		uri = schema + hostMain + ":" + port + route;
    uri_pdf = schema + hostMain + ":" + port + route_pdf;
    uri_doc = schema + hostMain + ":" + port + route_doc;

		let fileUri = FS.cacheDirectory + "corrected" + Math.random().toString(36).slice(2) + ".png";
    console.log("out", fileUri);
		let result = await FS.downloadAsync(uri, fileUri)
		.then(({ uri }) => {
      console.log("in", uri)
      setScannedImagePath(uri);
      //navigation.navigate('Outputscreen',{scannedImageP: uri});
		})
		.catch(error => {
			console.error(error);
		});

    fileUri = FS.cacheDirectory + "corrected" + Math.random().toString(36).slice(2) + ".pdf";
    console.log("out", fileUri);
		result = await FS.downloadAsync(uri_pdf, fileUri)
		.then(({ uri }) => {
      console.log("in", uri)
      setScannedImagePathPDF(uri);
      //navigation.navigate('Outputscreen',{scannedImageP: uri});
		})
		.catch(error => {
			console.error(error);
		});

    fileUri = FS.cacheDirectory + "corrected" + Math.random().toString(36).slice(2) + ".doc";
    console.log("out", fileUri);
		result = await FS.downloadAsync(uri_doc, fileUri)
		.then(({ uri }) => {
      console.log("in", uri)
      setScannedImagePathDoc(uri);
      //navigation.navigate('Outputscreen',{scannedImageP: uri});
		})
		.catch(error => {
			console.error(error);
		});
    
	}

  const clearImage = () => {
    setDisableUpload(true);
    setPickedImagePath('');
  }

  const uriToBase64 = async (uri) => {
    let base64 = await FS.readAsStringAsync(uri, {
      encoding: FS.EncodingType.Base64,
    });
    return base64;
  };

  const showImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      let base64 = await uriToBase64(result.uri);
      setImage({
        type: result.type,
        base64: base64,
        uri: result.uri,});
    } 
    else {
      return;
    }
  }

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    console.log(result);

    if (!result.cancelled) {
      setPickedImagePath(result.uri);
      let base64 = await uriToBase64(result.uri);
      setImage({
        type: result.type,
        base64: base64,
        uri: result.uri,});
    } 
    else {
      return;
    }
  }

  return (
      <SafeAreaView style={{flex: 1, flexDirection: "column"}}>
        <StatusBar backgroundColor="lightgray" barStyle="dark-content"/>
        <Header name="CascadeOCR" bgColor={{backgroundColor: 'lightgray'}} alertMessage="Document Scanner Application"/>
        
        <View style={styles.horizontalLine}></View>
        
        <View style={{flex: 1, flexDirection: "row", justifyContent:"space-evenly", backgroundColor:"lightgray", alignItems: "center"}}>
          
          <TouchableOpacity style={styles.button} onPress={openCamera}>
            <FontAwesome name="camera" size={90}  color="black"/>
            <Text style={styles.buttonLabel}>From Camera</Text>
          </TouchableOpacity>
          <View style={styles.verticleLine}></View>
          
          <TouchableOpacity style={styles.button} onPress={showImagePicker}>
            <FontAwesome name="file-picture-o" size={90} color="black" />
            <Text style={styles.buttonLabel}>From Gallery</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: .3, flexDirection:"row", backgroundColor:"white", elevation: 10, justifyContent: 'center', alignItems: 'flex-start'}}>
          <Text style={styles.label2}>Image picked</Text>
					<FontAwesome.Button name="remove" size={28} backgroundColor="white"
						color="black" onPress={clearImage}/>
        </View>
        <View style={{flex: 3, backgroundColor:"white"}}>

          <View style={styles.imageContainer}>
          {
            pickedImagePath !== '' && <Image
              source={{ uri: pickedImagePath }}
              style={styles.image}
            />
          }
          </View>
        </View>
        <View style={{flex: .4, backgroundColor:"white", justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={styles.round} disabled={disableUpload} onPress={toServer}>
            <Text style={styles.buttonLabel2}>Upload Image</Text>
          </TouchableOpacity>
        </View >

      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    textAlign: "left",
    paddingLeft:15,
    paddingTop:3,
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor:"lightgray",
    flex: 3
  },
  label2: {
      paddingLeft:15,
      paddingTop:5,
      textAlign: "left",
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'space-between',
      flex: 1,
    },
  button: {
    borderRadius:10,
    alignItems: "center",
  },

  buttonLabel: {
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  buttonLabel2: {
    textAlign: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 20,
    color:"white",
  },

  verticleLine: {
    height: '90%',
    width: 1,
    backgroundColor: '#909090',
  },
  horizontalLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#909090',
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
  SubmitButtonStyle: {
    marginTop:10,
    paddingTop:15,
    paddingBottom:15,
    marginLeft:30,
    marginRight:30,
    backgroundColor:'#00BCD4',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },

  round: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    width: 300,
    borderRadius: 40,
    backgroundColor: '#34b4eb',
  }
});

export default Homescreen;