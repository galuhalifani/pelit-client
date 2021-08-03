import React, {useState, useEffect} from "react";
import { View, Image, StyleSheet, TextInput, Modal, Alert, TouchableOpacity, Text, ScrollView, Pressable, Button } from "react-native"

export default function EarnedBadges({navigation, route, badge}) {
    // let badgeURL = props.badge
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
        <View>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
            <Image 
                style={styles.badgeImage}
                source={{uri: `${badge.imgUrl}`}}/>
        </TouchableOpacity>
        </View>


        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
        }}>

            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>{badge.name}</Text>
                <Image 
                    style={styles.badgeImageModal}
                    source={{uri: `${badge.imgUrl}`}}/>
                <Text style={styles.modalText}>{badge.description}</Text>

                <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
                >
                <Text style={styles.textStyle}>Close</Text>
                </Pressable>
            </View>
            </View>
        </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 500,
        width: 500,
      },
    separator: {
        marginVertical: 7,
        borderBottomColor: 'lightgrey',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },  
    badgeImage: {
        borderColor: 'gold',
        borderWidth: 2,
        borderRadius: 10,
        width: 20,
        height: 20,
        resizeMode: 'cover',
        marginRight: 5
    },
    badgeImageModal: {
        borderColor: 'gold',
        borderWidth: 2,
        borderRadius: 40,
        width: 80,
        height: 80,
        resizeMode: 'cover',
        marginRight: 5,
        marginBottom: 15
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "green",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center",
      },
      modalTitle: {
        color: 'brown',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: "center"
      }
  });