import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  Button,
  Alert,
  Animated,
  Modal,
  Pressable,
} from "react-native";
import NumberFormat from 'react-number-format'

export default function ModalItem({ item }) {
  return (
    <View style={{alignItems: 'center'}}>
      <View style={{ width: 100 }}>
        <Text
          style={[
            item.type === "Expense" ? styles.typeExpense : styles.typeIncome,
            styles.type,
          ]}
        >
          {item.type}
        </Text>
      </View>
      <Text style={styles.category}>{item.category}</Text>
      <Text style={styles.title}>{item.title}</Text>
      {
        item.type === "Expense" 
        ?
        <NumberFormat value={item.amount} style={styles.textListCard} displayType={'text'} thousandSeparator={true} decimalScale={0} renderText={formattedValue =>
          <Text style={[
            item.type === "Expense" ? styles.amountExpense : styles.amountIncome,
            styles.amount,
          ]}>{formattedValue}</Text>
        } />
        :
        <NumberFormat value={item.amount} style={styles.textListCard} displayType={'text'} thousandSeparator={true} decimalScale={0} renderText={formattedValue =>
          <Text style={[
            item.type === "Expense" ? styles.amountExpense : styles.amountIncome,
            styles.amount,
          ]}>{formattedValue}</Text>
        } />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  type: {
    borderWidth: 1,
    backgroundColor: "white",
    textAlign: "center",
    borderRadius: 5,
    color: "black",
    paddingVertical: 3,
    fontStyle: "italic",
    fontSize: 15,
  },
  typeExpense: {
    borderColor: "red",
  },
  typeIncome: {
    borderColor: "green",
  },
  category: {
    marginTop: 5,
    fontStyle: "italic",
    fontSize: 13,
    textAlign: "center",
  },
  title: {
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  amount: {
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
    fontStyle: "italic",
  },
  amountExpense: {
    color: "red",
  },
  amountIncome: {
    color: "green",
  },
});
