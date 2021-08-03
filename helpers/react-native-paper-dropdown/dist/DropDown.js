import { ScrollView, View, } from "react-native";
import { Menu, TextInput, TouchableRipple, useTheme } from "react-native-paper";
import React, { forwardRef, useEffect, useState } from "react";
const DropDown = forwardRef((props, ref) => {
    const activeTheme = useTheme();
    const { visible, onDismiss, showDropDown, value, setValue, activeColor, mode, label, placeholder, inputProps, list, dropDownContainerMaxHeight, dropDownContainerHeight, theme, dropDownStyle, dropDownItemStyle, dropDownItemSelectedStyle, dropDownItemTextStyle, dropDownItemSelectedTextStyle, accessibilityLabel, } = props;
    const [displayValue, setDisplayValue] = useState("");
    const [inputLayout, setInputLayout] = useState({
        height: 0,
        width: 0,
        x: 0,
        y: 0,
    });
    const onLayout = (event) => {
        setInputLayout(event.nativeEvent.layout);
    };
    useEffect(() => {
        const _label = list.find((_) => _.value === value)?.label;
        if (_label) {
            setDisplayValue(_label);
        }
    }, [list, value]);
    return (<Menu visible={visible} onDismiss={onDismiss} theme={theme} anchor={<TouchableRipple ref={ref} onPress={showDropDown} onLayout={onLayout} accessibilityLabel={accessibilityLabel}>
            <View pointerEvents={"none"}>
              <TextInput value={displayValue} mode={mode} label={label} placeholder={placeholder} pointerEvents={"none"} theme={theme} {...inputProps}/>
            </View>
          </TouchableRipple>} style={{
            maxWidth: inputLayout?.width,
            width: inputLayout?.width,
            marginTop: 0,
            ...dropDownStyle,
        }}>
        <ScrollView style={{
            ...(dropDownContainerHeight
                ? {
                    height: dropDownContainerHeight,
                }
                : {
                    maxHeight: dropDownContainerMaxHeight || 200,
                }),
        }}>
          {list.map((_item, _index) => (<Menu.Item key={_index} accessibilityLabel={`${accessibilityLabel} option ${_index}`} titleStyle={{
                color: value === _item.value
                    ? activeColor || (theme || activeTheme).colors.primary
                    : (theme || activeTheme).colors.text,
                ...(value === _item.value
                    ? dropDownItemSelectedTextStyle
                    : dropDownItemTextStyle),
            }} onPress={() => {
                setValue(_item.value);
                if (onDismiss) {
                    onDismiss();
                }
            }} title={_item.custom || _item.label} style={{
                maxWidth: inputLayout?.width,
                ...(value === _item.value
                    ? dropDownItemSelectedStyle
                    : dropDownItemStyle),
            }}/>))}
        </ScrollView>
      </Menu>);
});
export default DropDown;
