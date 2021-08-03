import React, {useEffect, useState} from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Image, TextInput, ScrollView, Button, Alert, Animated, Modal, Pressable } from 'react-native';

export default function ModalBadge({allBadges, earnedBadges}) {
    const myBadges = []

    for (let i = 0; i < earnedBadges.length; i++) {
      myBadges.push(earnedBadges[i].name)
    }

    return (
        <View>
        <View style={{flexDirection:'row', justifyContent: 'center'}}>
        {
            allBadges.map((badgeItem, indexNo) => (
                indexNo < 2 ?
                    <View key={indexNo} style={{flexDirection:'column', width: '30%', alignItems: 'center', paddingHorizontal: 7}}>
                    <Text style={styles.modalTitle}>{badgeItem.name}</Text>
                    <Image 
                        style={myBadges.includes(badgeItem.name) ? styles.badgeImageModal : styles.badgeImageModalTransparent}
                        source={{uri: `${badgeItem.imgUrl}`}}/>
                    <Text style={styles.modalText}>{badgeItem.description}</Text>
                    </View>
                :
                null
            ))
        }
        </View>
        <View style={{flexDirection:'row', justifyContent: 'center'}}>
        {
            allBadges.map((badgeItem, indexNo) => (
                indexNo > 1 ?
                    <View key={indexNo} style={{flexDirection:'column', width: '30%', marginTop: 20, alignItems: 'center', paddingHorizontal: 7}}>
                    <Text style={styles.modalTitle}>{badgeItem.name}</Text>
                    <Image 
                        style={myBadges.includes(badgeItem.name) ? styles.badgeImageModal : styles.badgeImageModalTransparent}
                        source={{uri: `${badgeItem.imgUrl}`}}/>
                    <Text style={styles.modalText}>{badgeItem.description}</Text>
                    </View>
                :
                null
            ))
        }
        </View>  
        </View> 
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
    modalView: {
        margin: 5,
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: 2,
        paddingVertical: 15,
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
        marginTop: 20,
        backgroundColor: "green",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 9,
        fontSize: 7,
        textAlign: "center",
      },
      modalTitle: {
        color: 'brown',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: "center"
      },
      badgeImageModal: {
        borderColor: 'gold',
        borderWidth: 2,
        borderRadius: 25,
        width: 50,
        height: 50,
        resizeMode: 'cover',
        marginBottom: 8,
    },
    badgeImageModalTransparent: {
      borderColor: 'gold',
      borderWidth: 2,
      borderRadius: 25,
      width: 50,
      height: 50,
      resizeMode: 'cover',
      marginBottom: 8,
      opacity: 0.3
  },
})