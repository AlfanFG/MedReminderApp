import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {GlobalStyles} from '../../constants/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {IconButton, Colors, RadioButton} from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import {getFormattedDate} from '../../util/date';
import NumericInput from 'react-native-numeric-input';

function Input({
  label,
  style,
  invalid,
  onPress,
  inputConfig,
  Type,
  pickerShow,
  dateShow,
}) {
  let inputStyles = Type === 'dropdown' ? [styles.dropdown] : [styles.input];
  if (inputConfig && inputConfig.multiline) {
    inputStyles.push(styles.inputMultiline);
  }

  if (invalid) {
    inputStyles.push(styles.invalidInput);
  }

  const showMode = currentMode => {
    setShow(true);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const togglePicker = () => {
    setShow(false);
  };

  function timePickerValue() {
    const time = `${new Date(inputConfig.value).getHours()}:${new Date(
      inputConfig.value,
    ).getMinutes()}`;
    // return time;
    return time;
    // console.log(
    //   `${parseInt(new Date(inputConfig.value).getHours())}:${parseInt(
    //     new Date(inputConfig.value).getMinutes()
    //   )}`
    // );
  }

  function element() {
    if (Type === 'date') {
      return (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.dateInput}>
            {getFormattedDate(inputConfig.value)}
          </Text>
        </TouchableOpacity>
      );
    } else if (Type === 'text') {
      return <TextInput style={inputStyles} {...inputConfig} />;
    } else if (Type === 'dropdown') {
      return <SelectDropdown {...inputConfig} data={inputConfig.data} />;
    } else if (Type === 'radio') {
      return <RadioButton {...inputConfig} />;
    } else if (Type === 'numeric') {
      return <NumericInput {...inputConfig} rounded />;
    }
  }

  // useEffect(() => {
  //   setShow(false);
  // }, [show]);

  return (
    <View style={[styles.inputContainer, style]}>
      <Text style={[styles.label, invalid && styles.invalidLabel]}>
        {label}
      </Text>
      {/* {Type === "time" ? (
        <View style={{ flexDirection: "row" }}>
          <TextInput style={styles.dateInput} {...inputConfig} />
          <IconButton
            icon="calendar"
            color={Colors.red500}
            size={20}
            onPress={Type === "time" ? showTimepicker : showDatepicker}
            onChange={togglePicker}
          />
        </View>
      ) : (
        <TextInput style={inputStyles} {...inputConfig} />
      )} */}
      {element()}

      {dateShow && Type === 'date' && (
        <DateTimePicker style={inputStyles} {...inputConfig} />
      )}
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  datePickerStyle: {
    width: 200,
    marginTop: 20,
  },
  label: {
    fontSize: 12,
    color: 'black',
    marginBottom: 4,
  },
  input: {
    backgroundColor: GlobalStyles.colors.primary100,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    color: GlobalStyles.colors.primary700,
  },
  dropdown: {
    backgroundColor: GlobalStyles.colors.white,
    padding: 12,
    borderRadius: 6,
    fontSize: 14,
    color: GlobalStyles.colors.primary500,
  },
  dateInput: {
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    color: GlobalStyles.colors.primary700,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  invalidLabel: {
    color: GlobalStyles.colors.error500,
  },
  invalidInput: {
    backgroundColor: GlobalStyles.colors.error50,
  },
});
