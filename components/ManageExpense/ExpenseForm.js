import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {View, StyleSheet, Text, Dimensions, ScrollView} from 'react-native';
import Input from './Input';
import Button from '../UI/Button';
import {getFormattedDate} from '../../util/date';
import {GlobalStyles} from '../../constants/styles';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-date-picker';
import {IconButton, Colors} from 'react-native-paper';
import * as Keychain from 'react-native-keychain';
const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full heigth
function ExpenseForm({submitButtonLabel, onCancel, onSubmit, defaultValues}) {
  const [showTimePicker, setShowTimePicker] = useState([false]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mode, setMode] = useState('date');
  const [modalVisible, setModalVisible] = useState(false);
  const [arrKey, setArrKey] = useState(0);

  const daily = [
    {label: 'Once a day', value: 1},
    {label: 'Twice a day', value: 2},
    {label: '3 times a day', value: 3},
    {label: 'More', value: 4},
  ];
  const takeMed = [1 / 2, 1, 2, 3, 4, 'More'];

  const [singleInputs, setSingleInputs] = useState({
    treatment: {
      value: '',
      isValid: true,
    },
    reminderTimes: {
      value: defaultValues ? defaultValues.reminderTimes : 1,
      isValid: true,
    },
    startDate: new Date(),
    durationType: 'onGoingTreatment',
    numberOfDays: 30,
    // days: {
    //   everyDay: defaultValues ? defaultValues.everyDay : true,
    //   specificDays: defaultValues ? defaultValues.specificDays : [],
    // },
  });

  const [inputs, setInputs] = useState([
    {
      id: 1,
      time: {
        value: new Date(),
        isValid: true,
      },
      takePill: {
        value: defaultValues ? defaultValues.takePill : 1,
        isValid: true,
      },
      medName: {
        value: '',
        isValid: true,
      },
    },
  ]);

  useEffect(() => {
    setShowTimePicker(false);
  }, [showTimePicker]);

  async function submitHandler() {
    let arrSchedule = [];
    inputs.map(item => {
      arrSchedule.push({
        time: new Date(item.time.value),
        takePill: item.takePill.value,
        medName: item.medName.value,
      });
    });

    const credentials = await Keychain.getGenericPassword();
    const singleInputsData = {
      treatment: singleInputs.treatment.value,
      reminderTimes: singleInputs.reminderTimes.value,
      startDate: new Date(singleInputs.startDate),
      durationType: singleInputs.durationType,
      numberOfDays: singleInputs.numberOfDays,
      user_id: credentials.username,
    };
    const expenseData = {
      ...singleInputsData,
      schedule: arrSchedule,
    };

    // console.log(expenseData);
    // const treatmentIsValid = expenseData.treatment.trim().length > 0;
    // const dateIsValid = expenseData.date !== "Invalid Date";
    // const descriptionIsValid = expenseData.description.trim().length > 0;
    // const reminderIsValid = expenseData.reminderTimes.trim().length > 0;

    // if (
    //   !treatmentIsValid ||
    //   !dateIsValid ||
    //   !reminderIsValid
    //   // ||
    //   // !descriptionIsValid
    // ) {
    //   // show feedback
    //   // Alert.alert("Invalid input", "Please check your input values");
    //   setInputs((currInputs) => {
    //     return {
    //       treatment: { value: currInputs.treatment.value, isValid: treatmentIsValid },
    //       time: { value: currInputs.date.value, isValid: dateIsValid },
    //       description: {
    //         value: currInputs.description.value,
    //         isValid: descriptionIsValid,
    //       },
    //       reminderTimes: {
    //         value: currInputs.reminderTimes.value,
    //         isValid: reminderIsValid,
    //       },
    //     };
    //   });
    //   return;
    // }
    console.log(expenseData);
    // onSubmit(expenseData);
  }

  function singleInputsHandler(inputIdentifier, enteredValue) {
    let validity = true;
    if (inputIdentifier === 'treatment' && enteredValue.trim().length > 0)
      validity = true;
    else validity = false;
    if (inputIdentifier === 'reminderTimes') {
      handleValidReminderTimes(enteredValue);
      handleAdd(enteredValue);
      // console.log(formInputs);
    }

    if (inputIdentifier === 'numberOfDays') {
      setSingleInputs(curinputs => {
        return {
          ...curinputs,
          [inputIdentifier]: enteredValue,
        };
      });
    } else {
      setSingleInputs(curinputs => {
        return {
          ...curinputs,
          [inputIdentifier]: {value: enteredValue, isValid: validity},
        };
      });
    }
  }

  function radioInputHandler(inputIdentifier, enteredValue) {
    if (enteredValue === 'numberOfDays') {
      setModalVisible(true);
    }

    setSingleInputs(curinputs => {
      return {
        ...curinputs,
        [inputIdentifier]: enteredValue,
      };
    });
  }

  //Validation userId Input Values
  const handleValidTimes = (text, index) => {
    const formInputs = [...inputs];
    const time = new Date(text);

    if (time !== 'Invalid Date') {
      formInputs[index].time.isValid = false;
    } else {
      formInputs[index].time.isValid = true;
    }

    setInputs(formInputs);
  };

  const handleValidReminderTimes = text => {
    const formInputs = singleInputs;

    if (text === 0) {
      formInputs.reminderTimes.isValid = true;
    } else {
      formInputs.reminderTimes.isValid = false;
    }

    setSingleInputs(formInputs);
  };

  const handleAdd = length => {
    const _inputs = [...inputs];
    const showTime = [];
    if (length < _inputs.length) {
      _inputs.splice(-_inputs.length + length, _inputs.length - length);
    } else {
      for (let i = _inputs.length; i <= length - 1; i++) {
        _inputs.push({
          id: _inputs.length + 1,
          time: {
            value: new Date(),
            isValid: true,
          },
          takePill: {
            value: defaultValues ? defaultValues.takePill : 0,
            isValid: true,
          },
          description: {
            value: defaultValues ? defaultValues.description : '',
            isValid: true,
          },
          medName: {
            value: '',
            isValid: true,
          },
        });
      }
      showTime.push(false);
    }
    setShowTimePicker(showTime);
    setInputs(_inputs);
  };
  const inputChangedHandler = (inputIdentifier, enteredValue, index) => {
    if (inputIdentifier === 'time') {
      const arr = [showTimePicker];
      arr[index] = false;
      setShowTimePicker(arr);
      const tmpDate = new Date(enteredValue);
      enteredValue = tmpDate.toISOString();

      // handleValidTimes(enteredValue, index);
    }
    if (inputIdentifier === 'date') {
      setShowDatePicker(false);
    }

    const formInputs = [...inputs];
    formInputs[index][inputIdentifier].value = enteredValue;
    setInputs(formInputs);
  };

  const timePickerValue = dateTime => {
    const time = `${new Date(dateTime).getHours()}:${new Date(
      dateTime,
    ).getMinutes()}`;
    // return time;
    return time;
    // console.log(
    //   `${parseInt(new Date(inputConfig.value).getHours())}:${parseInt(
    //     new Date(inputConfig.value).getMinutes()
    //   )}`
    // );
  };

  return (
    <View style={[styles.form]}>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{paddingVertical: 200}}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 6,
          }}>
          <Text>Durasi hari</Text>

          <Input
            Type="numeric"
            inputConfig={{
              value: singleInputs.numberOfDays,
              onChange: value => singleInputsHandler('numberOfDays', value),
              onLimitReached: (isMax, msg) => {},
              maxValue: 31,
              totalWidth: 240,
              totalHeight: 50,
              iconSize: 25,
              step: 1,
              valueType: 'real',
              textColor: '#B0228C',
              iconStyle: {color: 'white'},
              rightButtonBackgroundColor: GlobalStyles.colors.primary700,
              leftButtonBackgroundColor: GlobalStyles.colors.primary700,
            }}
          />
        </View>
      </Modal>

      <Text style={styles.title}>Your Expense</Text>
      <View style={styles.inputsRow}>
        <Input
          label="Treatment"
          Type="text"
          invalid={!singleInputs.treatment.isValid}
          style={styles.rowInput}
          inputConfig={{
            onChangeText: text => singleInputsHandler('treatment', text),
            value: singleInputs.treatment.value,
          }}
        />
      </View>
      <Text style={styles.subTitle}>Reminder Times</Text>

      <View style={[styles.card]}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Input
            label="Waktu Meminum Obat"
            Type="dropdown"
            inputConfig={{
              data: daily,
              defaultButtonText: 'Once Daily',
              buttonStyle: {
                backgroundColor: GlobalStyles.colors.white,
                padding: 6,
                borderRadius: 6,
                fontSize: 10,
                color: GlobalStyles.colors.primary500,
                width: width / 1.4,
              },
              buttonTextStyle: {fontSize: 16},
              defaultValue: singleInputs.reminderTimes.value,
              buttonTextAfterSelection: (selectedItem, index) => {
                return selectedItem.label;
              },
              rowTextForSelection: (item, index) => {
                return item.label;
              },
              onSelect: (selectedItem, index) => {
                singleInputsHandler('reminderTimes', selectedItem.value);
              },
              // buttonTextAfterSelection: (selectedItem, index) => {
              //   // text represented after item is selected
              //   // if data array is an array of objects then return selectedItem.property to render after item is selected
              //   return selectedItem;
              // },
              // rowTextForSelection: (item, index) => {
              //   // text represented for each item in dropdown
              //   // if data array is an array of objects then return item.property to represent item in dropdown
              //   return item;
              // },
            }}
          />

          {inputs.length > 0 &&
            inputs.map((input, key) => {
              return (
                <View style={[styles.inputsRow]} key={key}>
                  {/* <View style={styles.inputsRow}>
                    <Input
                      label="Medicine Name"
                      Type="text"
                      // invalid={!singleInputs.medName.isValid}
                      style={styles.rowInput}
                      inputConfig={{
                        onChangeText: text =>
                          singleInputsHandler('medName', text),
                        value: input.medName.value,
                      }}
                    />
                  </View> */}
                  <View
                    style={
                      ([styles.inputContainer],
                      {flexDirection: 'column', flex: 1})
                    }>
                    <Input
                      label="Medicine Name"
                      Type="text"
                      // invalid={!singleInputs.medName.isValid}
                      style={{width: width / 1.4}}
                      inputConfig={{
                        onChangeText: text => {
                          inputChangedHandler('medName', text, key);
                        },
                        value: input.medName.value,
                      }}
                    />

                    <View style={{flexDirection: 'row'}}>
                      <View style={{flexDirection: 'column', flex: 1}}>
                        <Text
                          style={[
                            styles.label,
                            input.time.isValid && styles.invalidLabel,
                          ]}>
                          Time
                        </Text>

                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.dateInput}>
                            {timePickerValue(input.time.value)}
                          </Text>
                          <IconButton
                            icon="clock"
                            color={Colors.red500}
                            size={20}
                            onPress={() => {
                              const arr = [showTimePicker];
                              arr[key] = true;
                              setShowTimePicker(arr);
                            }}
                          />
                        </View>
                      </View>

                      <DatePicker
                        modal
                        mode="time"
                        open={showTimePicker[key]}
                        date={new Date(input.time.value)}
                        onConfirm={date => {
                          inputChangedHandler('time', date, key);
                        }}
                        onCancel={() => {
                          const arr = [showTimePicker];
                          arr[key] = false;
                          setShowTimePicker(arr);
                        }}
                      />

                      <Input
                        label="Take Pil"
                        Type="dropdown"
                        inputConfig={{
                          data: takeMed,
                          defaultButtonText: 1,
                          buttonStyle: {
                            backgroundColor: '#f5f6fa',
                            padding: 6,
                            borderRadius: 6,
                            fontSize: 10,
                            color: GlobalStyles.colors.primary500,
                            width: 100,
                          },
                          buttonTextStyle: {fontSize: 16, color: 'blue'},
                          defaultValue: input.takePill.value,
                          onSelect: (selectedItem, index) => {
                            inputChangedHandler('takePill', selectedItem, key);
                          },
                          buttonTextAfterSelection: (selectedItem, index) => {
                            // text represented after item is selected
                            // if data array is an array of objects then return selectedItem.property to render after item is selected
                            return selectedItem;
                          },
                          rowTextForSelection: (item, index) => {
                            // text represented for each item in dropdown
                            // if data array is an array of objects then return item.property to represent item in dropdown
                            return item;
                          },
                        }}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
        </View>
        {/* <Input
          label="Description"
          Type="text"
          invalid={!inputs.description.isValid}
          inputConfig={{
            multiline: true,
            onChangeText: inputChangedHandler.bind(this, "description"),
            value: inputs.description.value,
          }}
        />
        {formIsValid && (
          <Text style={styles.errorText}>
            Invalid input values - please check your entered data
          </Text>
        )} */}
      </View>

      <Text style={styles.subTitle}>Scheduling</Text>
      <View style={[styles.card]}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}>
          <Input
            label="Start Date"
            style={styles.rowInput}
            Type="date"
            onPress={() => {
              setShowDatePicker(true);
              setShowTimePicker(false);
            }}
            dateShow={showDatePicker}
            pickerShow={showTimePicker}
            inputConfig={{
              value:
                singleInputs.startDate === ''
                  ? new Date()
                  : new Date(singleInputs.startDate),
              mode: 'date',
              onChange: (event, selectedDate) => {
                inputChangedHandler('startDate', selectedDate, key);
              },
            }}
          />
          <Text>Duration</Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: -25,
            }}>
            <Input
              // label={"Every Day"}
              Type="radio"
              inputConfig={{
                value: 'onGoingTreatment',
                status:
                  singleInputs.durationType === 'onGoingTreatment'
                    ? 'checked'
                    : 'unchecked',
                onPress: () =>
                  radioInputHandler('durationType', 'onGoingTreatment'),
              }}
            />
            <Text style={{marginTop: 20}}>Ongoing Treatment</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: -35,
            }}>
            <Input
              // label={"Number Of Days"}
              Type="radio"
              inputConfig={{
                value: 'numberOfDays',
                status:
                  singleInputs.durationType === 'numberOfDays'
                    ? 'checked'
                    : 'unchecked',
                onPress: () =>
                  radioInputHandler('durationType', 'numberOfDays'),
              }}
            />
            <Text style={{marginTop: 20}}>Number Of Days</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttons}>
        <Button style={styles.button} mode="flat" onPress={onCancel}>
          Cancel
        </Button>
        <Button style={styles.button} onPress={submitHandler}>
          {submitButtonLabel}
        </Button>
      </View>
    </View>
  );
}
export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 12,
  },
  card: {
    backgroundColor: '#f5f6fa',
    padding: 20,
    marginVertical: 20,
    borderRadius: 6,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
  scrollView: {
    flexGrow: 1,
    // height: height / 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 12,
    color: 'black',
    marginBottom: 4,
  },
  invalidLabel: {
    color: GlobalStyles.colors.error500,
  },
  invalidInput: {
    backgroundColor: GlobalStyles.colors.error50,
  },
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  dateInput: {
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    color: GlobalStyles.colors.primary700,
  },
  input: {
    backgroundColor: GlobalStyles.colors.primary100,
    padding: 6,
    borderRadius: 6,
    fontSize: 18,
    color: GlobalStyles.colors.primary700,
  },
});
