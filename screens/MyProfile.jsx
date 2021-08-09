import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Pressable,
  Text,
  Platform,
  Button,
  ImageBackground
} from "react-native";
import { dateFormatter } from "../helpers/dateFormatter.js";
import SpendSummary from "../components/spendSummary";
import EarnedBadges from "../components/EarnedBadges";
import ModalBadge from "../components/AllBadges";
import NumberFormat from "react-number-format";
import { FAB } from 'react-native-paper';

const Separator = () => <View style={styles.separator} />;

export default function MyProfile({
  navigation,
  route,
  user,
  earnedBadges,
  allBadges,
  activeTarget,
}) {
  const today = dateFormatter(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalHelpVisible, setModalHelpVisible] = useState(false);


  return (
    // <View>
    <ScrollView contentContainerStyle={styles.pageScrollContainer}>
      <ImageBackground
        style={{ flex: 1 }}
        //We are using online image to set background
        source={{
          uri:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZiUTun3fuJmLmAJfTGM7Hl32p5Wt9zVV7Ww&usqp=CAU',
        }}
        //You can also set image from your project folder
        //require('./images/background_image.jpg')        //
      >
      <View style={styles.pageViewContainer}>
        <View style={styles.pageTitle}>
          <View style={styles.userName}>
            <Text style={styles.pageTitleName}>Hi {user.firstName}!</Text>

          </View>
          <View style={styles.date}>
            <Text style={styles.pageTitleDate}>{today}</Text>
          </View>
        </View>

        <View style={styles.userDetails}>
          <Image
            style={styles.userProfilePicture}
            resizeMode="cover"
            borderRadius={50}
            source={{ uri: `${user.photoProfile}` }}
          />
          <View style={styles.userDetailTexts}>
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.userBalance}>
              Balance:{" "}
              <NumberFormat
                value={user.balance}
                decimalScale={0}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"Rp "}
                renderText={(formattedValue) => (
                  <Text style={styles.userBalanceText}>{formattedValue}</Text>
                )}
              />
            </Text>
            <View style={{ marginTop: 15 }} />
            <Separator />
            <View style={{ marginTop: 15 }} />
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeTitle}>My Badges</Text>
              <View style={{ flexDirection: "row" }}>
                {earnedBadges.map((badge, indexRow) => (
                  <EarnedBadges key={indexRow} badge={badge} />
                ))}
              </View>
              <Pressable
                style={styles.seeBadges}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.seeBadgesText}>See All Badges</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 15 }} />

        {user.Transactions ? 
         <SpendSummary allSpending={user.Transactions} activeTarget={activeTarget} user={user}/>
         :
        null
        }

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ModalBadge allBadges={allBadges} earnedBadges={earnedBadges} />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
      </ImageBackground>
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={modalHelpVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalHelpVisible(!modalHelpVisible);
        }}
      >
        <View style={styles.centeredViewHelp}>
          <View style={styles.modalViewHelp}>
            <Text style={styles.modalTextHelpBold}>Income & Expense</Text>
            <Text style={styles.modalTextHelp}>The total income & expense recorded for the current month only</Text>
            <Text style={styles.modalTextHelpBold}>Balance</Text>
            <Text style={styles.modalTextHelp}>The total ending balance recorded until today, includes all previous months</Text>
            <Text style={styles.modalTextHelpBold}>Individual Record Items</Text>
            <Text style={styles.modalTextHelp}>Only current month's record is shown in homepage. To change the month view, click on the month name on the upper left hand side of the page</Text>
            <Text style={styles.modalTextHelpBold}>See record details</Text>
            <Text style={styles.modalTextHelp}>To see record details, click on each of the individual items</Text>
            <Text style={styles.modalTextHelpBold}>Add a Record</Text>
            <Text style={styles.modalTextHelp}>Click on the floating + button on the bottom right hand side of the page to add a record</Text>
            <Text style={styles.modalTextHelpBold}>User Profile & Analytics</Text>
            <Text style={styles.modalTextHelp}>Navigate to user dashboard by clicking on user profile picture in homepage, or via burger button on the left side header</Text>
            <Pressable
              style={[styles.button, styles.buttonModalClose]}
              onPress={() => setModalHelpVisible(!modalHelpVisible)}
            >
              <Text style={styles.textStyle}>Understood</Text>
            </Pressable>
          </View>
        </View>
      </Modal> */}
    </ScrollView>
    /* <FAB
      style={styles.fabQuestion}
      small
      color='white'
      icon="help"
      onPress={() => setModalHelpVisible(true)}
      />
    </View> */
  );
}

const styles = StyleSheet.create({
  image: {
    height: 500,
    width: 500,
  },
  separator: {
    borderBottomColor: "lightgrey",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pageScrollContainer: {
    flexGrow: 1,
  },
  pageViewContainer: {
    flex: 1,
    paddingHorizontal: 20,
    // backgroundColor: "#04009A",
  },
  pageTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "white",
    alignItems: "center",
  },
  pageTitleName: {
    color: "white",
    fontSize: 18,
    marginTop: 15,
    fontWeight: "bold",
  },
  pageTitleDate: {
    color: "white",
    fontSize: 18,
    marginTop: 15,
    fontWeight: "bold",
    marginRight: 10,
  },
  userProfilePicture: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: "white",
  },
  userDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 35,
    color: "white",
  },
  userDetailTexts: {
    flex: 1,
    marginLeft: 15,
    // borderWidth: 1,
    // borderColor: 'white',
  },
  userName: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  userBalance: {
    color: "white",
    fontSize: 16,
  },
  userBalanceText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  userBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  userBadgeTitle: {
    color: "white",
    fontSize: 14,
    marginRight: 10,
  },
  badgeImage: {
    borderColor: "gold",
    borderWidth: 2,
    borderRadius: 10,
    width: 20,
    height: 20,
    resizeMode: "cover",
    marginRight: 5,
  },
  seeBadges: {
    backgroundColor: "green",
    borderRadius: 15,
    padding: 5,
    elevation: 2,
    shadowColor: "white",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
  },
  seeBadgesText: {
    fontSize: 9,
    color: "gold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
    textAlign: "center",
  },
  modalText: {
    marginBottom: 9,
    fontSize: 7,
    textAlign: "center",
  },
  modalTitle: {
    color: "brown",
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  badgeImageModal: {
    borderColor: "gold",
    borderWidth: 2,
    borderRadius: 25,
    width: 50,
    height: 50,
    resizeMode: "cover",
    marginBottom: 8,
  },
  centeredViewHelp: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalViewHelp: {
    margin: 20,
    backgroundColor: "black",
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
  modalTextHelp: {
    marginBottom: 15,
    textAlign: "center",
    color: 'white'
  },
  modalTextHelpBold: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold',
    color: 'white'
  },
  fabQuestion: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: 'darkred'
  },
  buttonModalClose: {
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    marginRight: 10,
    elevation: 2,
    backgroundColor: "green",
  },
});
