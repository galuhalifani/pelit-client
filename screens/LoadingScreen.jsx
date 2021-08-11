import React, {useEffect} from 'react'
import {StyleSheet, View, Text} from 'react-native'
import LottieView from 'lottie-react-native';

export default function LoadingScreen({message}){
    let animation = React.createRef();

    useEffect(() => {
      animation.current.play()
    }, [])

    if (message == 'Login') {
      return (
        <View style={styles.containerLoading}>
        <Text style={{ color: "white", marginBottom: 20, fontSize: 16 }}>
        Arranging Your Wallet...
        </Text>
        <LottieView
            ref={animation}
            loop={true}
            style={{
            width: 300,
            height: 300
            }}
            // source={require('../animations/52873-money-period')}
            source={require('../animations/38313-money')}
            // source={require('../animations/70036-milestone-completed-2')}
        />
        </View>
      )
    } else if (message == 'AddExpense') {
      return (
        <View style={styles.containerLoading}>
        <Text style={{ color: "white", marginBottom: 20, fontSize: 16 }}>
        Adjusting Your Cash...
        </Text>
        <LottieView
            ref={animation}
            loop={true}
            style={{
            width: 300,
            height: 300
            }}
            // source={require('../animations/52873-money-period')}
            // source={require('../animations/38313-money')}
            source={require('../animations/50854-cash-or-card')}
        />
        </View>
      )
    } else if (message == 'AddRecord') {
      return (
        <View style={styles.containerLoading}>
        <Text style={{ color: "white", marginHorizontal: 10, marginBottom: 10, fontSize: 12 }}>
            Scanning Image. This might take a while.
          </Text>
          <Text style={{ color: "lightsalmon", marginBottom: 10, textAlign: 'center', marginHorizontal: 10, fontSize: 16, fontWeight: 'bold'}}>
            Before submitting, please re-check your transaction date.
          </Text>
        <LottieView
            ref={animation}
            loop={true}
            style={{
            width: 300,
            height: 300
            }}
            // source={require('../animations/52873-money-period')}
            // source={require('../animations/38313-money')}
            source={require('../animations/38287-scanning-searching-for-data')}
        />
        </View>
      )
    } else {
      return (
        <View style={styles.containerLoading}>
        <Text style={{ color: "white", marginBottom: 20, fontSize: 16 }}>
        Arranging Your Wallet...
        </Text>
        <LottieView
            ref={animation}
            loop={true}
            style={{
            width: 300,
            height: 300
            }}
            // source={require('../animations/52873-money-period')}
            source={require('../animations/38313-money')}
            // source={require('../animations/70036-milestone-completed-2')}
        />
        </View>
      )
    }
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: "midnightblue",
      alignItems: "center",
      paddingTop: 50,
    },
    containerLoading: {
      flex: 1,
      backgroundColor: "#04009A",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: 50,
    }
})