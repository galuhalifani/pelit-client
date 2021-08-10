import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert
} from "react-native";
import { Camera } from "expo-camera";
import CameraPreview from "../components/CameraPreview";
import { useDispatch } from "react-redux";
import { postOcr } from "../store/actions";
import * as ImagePicker from "expo-image-picker";
let camera;

export default function AddRecord({ navigation, route }) {
  const dispatch = useDispatch();
  const [startCamera, setStartCamera] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function startCameraHandler() {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === "granted") {
      // start the camera
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  }

  async function takePictureHandler() {
    if (!camera) return;
    const photo = await camera.takePictureAsync({ quality: 0.1 });
    console.log(photo, "foto mentah");
    setPreviewVisible(true);
    setCapturedImage(photo);
  }

  const savePhotoHandler = async () => {
    const payload = new FormData();
    // payload.append("imageUrl", capturedImage.uri);
    const fileName = "receiptImage";
    const mimeType = "image/jpeg";
    console.log(capturedImage, "capture image di save photo handler");

    payload.append("receiptImage", {
      uri: capturedImage.uri,
      name: fileName,
      type: mimeType,
    });
    payload.append("dummyText", "dummy");

    // !kirim data ke ocr
    // const result = await dispatch(postOcr(payload))
    setIsLoading(true);

    // console.log('SEBELUM DIKIRIM KE SERVER DARI STATE',capturedImage)]

    const processedImage = await postToServer(capturedImage);
    if (processedImage.message == 'image is too large') {
      Alert.alert('Image is too large', 'Max. size is 350kB')
      setIsLoading(false);
    } else if (processedImage == 'error timed out') {
      Alert.alert('Request Timed Out', 'Please use other method or pick smaller file size')
      setIsLoading(false)
    } else if (processedImage) {
      console.log("SEBELUM DIKIRIM KE SERVER DARI STATE", capturedImage);
      console.log("siap-siap sebelum navigate", processedImage);
      setIsLoading(false);
      navigation.navigate("AddExpense", {
        data: processedImage,
        image: capturedImage,
      });
    }
  };

  const retakePictureHandler = () => {
    setCapturedImage(null);
    setPreviewVisible(false);
    startCameraHandler();
  };

  async function imagePickerHandler() {
    // console.log('gottem')
    // (async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }
    //   })();

    const photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.8,
    });

    if (!photo.cancelled) {
      console.log("imagePicker photo", photo);
      setCapturedImage(photo);
      setIsLoading(true);

      const processedImage = await postToServer(photo);
      console.log(processedImage)
      if (processedImage.message == 'image is too large') {
        Alert.alert('Image is too large', 'Max. size is 350kB')
        setIsLoading(false);
      } else if (processedImage == 'error timed out') {
        Alert.alert('Request Timed Out', 'Please use other method or pick smaller file size')
        setIsLoading(false)
      } else if (processedImage) {
        // e.preventDefault()
        // console.log("CAPTURED IMAGE", photo);
        console.log("siap-siap sebelum naviagate", processedImage);
        setIsLoading(false);
        navigation.navigate("AddExpense", {
          data: processedImage,
          image: photo,
        });
      }
    }
  }

  async function postToServer(photo) {
    // !lanjut ke ocr
    try {
      // console.log('FOTO SETELAT SAMPE DI KIRIM KE POST TO SERVER', capturedImage);

      const payload = new FormData();
      // payload.append("imageUrl", capturedImage.uri);
      const fileName = "receiptImage";
      const mimeType = "image/jpeg";
      // console.log('capturedImage',result)
      payload.append("receiptImage", {
        uri: photo.uri,
        name: fileName,
        type: mimeType,
      });
      console.log(payload, "ini photo post to server");
      // payload.append("dummyText", "dummy");
      // const data = await dispatch(postOcr(payload));
      // console.log("INI DATAAAAAAAA DARI OCR", data);

      return await dispatch(postOcr(payload));
    } catch (error) {
      console.log('ERROR CATCH NIH', error)
      console.error(error);
      return;
    }
  }

  function toAddExpense() {
    navigation.navigate("AddExpense");
  }

  if (isLoading)
    return (
      <View style={styles.containerLoading}>
          <Text style={{ color: "black", marginHorizontal: 10, marginBottom: 10, fontSize: 12 }}>
            Scanning Image. This might take a while.
          </Text>
          <Text style={{ color: "red", marginBottom: 10, textAlign: 'center', marginHorizontal: 10, fontSize: 16, fontWeight: 'bold'}}>
            Before submitting, please re-check your transaction date.
          </Text>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );

  return (
    <View style={styles.container}>
      {startCamera ? (
        previewVisible && capturedImage ? (
          <CameraPreview
            photo={capturedImage}
            savePhoto={savePhotoHandler}
            retakePicture={retakePictureHandler}
          />
        ) : (
          <Camera
            style={{ flex: 1, width: "100%" }}
            ref={(r) => {
              camera = r;
            }}
          >
            <View
              style={{
                flex: 1,
                width: "100%",
                backgroundColor: "transparent",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  flexDirection: "row",
                  flex: 1,
                  width: "100%",
                  padding: 20,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={takePictureHandler}
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 0,
                      borderRadius: 50,
                      backgroundColor: "#fff",
                    }}
                  />
                </View>
              </View>
            </View>
          </Camera>
        )
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={startCameraHandler}
            style={{
              width: 230,
              marginBottom: 10,
              borderRadius: 4,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Take picture
            </Text>
            {/* <Button onPress={testFetch} title='test for post'  style={{marginBottom:5}}/> */}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={imagePickerHandler}
            style={{
              width: 230,
              marginBottom: 10,
              borderRadius: 4,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Upload from phone
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toAddExpense}
            style={{
              width: 230,
              padding: 10,
              height: 200,
              backgroundColor: "#14274e",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: 40,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: "#fff",
                padding: 10,
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Input Manually
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  loading: {
    flex: 1,
  },
  containerLoading: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
});
