import React, {useContext, useLayoutEffect, useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from '../components/UI/Button';
import {GlobalStyles} from '../constants/styles';
import {ExpensesContext} from '../store/expenses-context';
import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import {apiDev} from '../constants';
import ApiKeys from '../constants/ApiKeys';
import {initializeApp} from 'firebase/app';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import PushNotification, {Importance} from 'react-native-push-notification';
import {
  ref,
  getDatabase,
  onValue,
  child,
  update,
  push,
  set,
} from 'firebase/database';
import moment from 'moment';

// PushNotification.createChannel(
//   {
//     channelId: 'channel-id', // (required)
//     channelName: 'My channel', // (required)
//     channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
//     playSound: false, // (optional) default: true
//     soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
//     importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
//     vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
//   },
//   created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
// );

function ManageExpense({route, navigation}) {
  const expensesCtx = useContext(ExpensesContext);
  const [enableNotification, setEnableNotification] = useState(false);
  const [notificationTime, setNotificationTime] = useState(moment(new Date()));
  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const selectedExpense = expensesCtx.expenses.find(
    expense => expense.id === editedExpenseId,
  );

  function setNotifications(data) {
    const length = data.schedule.length;
    const arr = data.schedule;
    let date = data.startDate.toISOString().slice(0, 10);
    let addedForTomorrow = false;
    for (let i = 0; i < length; i++) {
      const hours = new Date(arr[i].time).getHours();
      const hoursNow = new Date().getHours();

      if (hours < hoursNow && !addedForTomorrow) {
        date = new Date(date).setDate(new Date(date).getDate() + 1);
        date = new Date(date).toISOString().slice(0, 10);
      }

      const dateTime = moment(
        date +
          ' ' +
          ('0' + new Date(arr[i].time).getHours()).slice(-2) +
          ':' +
          ('0' + new Date(arr[i].time).getMinutes()).slice(-2),
      );

      PushNotification.localNotificationSchedule({
        //... You can use all the options from localNotifications
        channelId: 'channel-id',
        message: data.medName, // (required)
        date: new Date(dateTime),
        allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
        /* Android Only Properties */
        repeatType: 'day',
        repeatTime: 2, // (optional) Increment of configured repeatType. Check 'Repeating Notifications' section for more info.
      });
    }
  }

  useEffect(() => {
    // var timeAndDate = moment(date + ' ' + time);
    // console.log(timeAndDate);
    // registerForPushNotifications();
    // scheduleNotificationHandler();
  }, []);

  async function registerForPushNotifications() {
    const {status} = await Notifications.getPermissionsAsync();
    let finalStatus = status;
    if (finalStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert(
        'permission required',
        'Push notification need the appropriate permissions',
      );
      return;
    }
    const pushTokenData = await Notifications.getExpoPushTokenAsync();

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    let token = await Notifications.getExpoPushTokenAsync();
    let uid = getAuth().currentUser.uid;
    const db = getDatabase();

    set(ref(db, 'users/' + uid), {
      expoPushToken: token,
    })
      .then(() => {
        // Data saved successfully!
      })
      .catch(error => {
        // The write failed...
      });
    // ref("users").child(uid).update({
    //   expoPushToken: token,
    // });

    // console.log(pushTokenData.data.ExponentPushToken[0]);

    // let uid = auth().currentUser.uid;
    // const user = auth.currentUser;

    // database().ref("users").child(uid).update({
    //   expoPushToken: pushTokenData,
    // });
  }

  async function scheduleNotificationHandler(token) {
    const localNotification = {
      title: 'Delayed testing Title',
      body: 'Testing body',
      data: {type: 'delayed'},
    };
    const schedulingOptions = {
      time: new Date().getTime() + 5000,
    };

    // fetch("https://exp.host/--/api/v2/push/send", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "appllication/json",
    //   },
    //   body: JSON.stringify({
    //     to: token.data,
    //     title: "Test - sent from a device!",
    //     body: "This is a test!",
    //   }),
    // });
    // Notifications.scheduleNotificationAsync({
    //   content: {
    //     title: "My first local notification",
    //     body: "This is the body of the notification",
    //     data: { userName: "Alfan" },
    //   },
    //   trigger: {
    //     seconds: 5,
    //   },
    // });
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expense' : 'Add Expense',
    });
  }, [navigation, isEditing]);

  function deleteExpenseHandler() {
    expensesCtx.deleteExpense(editedExpenseId);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  // buildNotification = () => {
  //   const title = Platform.OS === 'android' ? 'Daily Reminder' : '';
  //   const notification = new firebase.notifications.Notification()
  //     .setNotificationId('1') // Any random ID
  //     .setTitle(title) // Title of the notification
  //     .setBody('This is a notification') // body of notification
  //     .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
  //     .android.setChannelId('reminder') // should be the same when creating channel for Android
  //     .android.setAutoCancel(true); // To remove notification when tapped on it
  //   return notification;
  // };

  // setReminder = async () => {
  //   console.log('wef');
  //   if (enableNotification) {
  //     // schedule notification
  //     firebase.notifications().scheduleNotification(buildNotification(), {
  //       fireDate: notificationTime.valueOf(),
  //       repeatInterval: 'day',
  //       exact: true,
  //     });
  //   } else {
  //     return false;
  //   }
  // };

  // buildNotification = () => {
  //   const title = Platform.OS === 'android' ? 'Daily Reminder' : '';
  //   const notification = new firebase.notifications.Notification()
  //     .setNotificationId('1') // Any random ID
  //     .setTitle(title) // Title of the notification
  //     .setBody('This is a notification') // body of notification
  //     .android.setPriority(firebase.notifications.Android.Priority.High) // set priority in Android
  //     .android.setChannelId('reminder') // should be the same when creating channel for Android
  //     .android.setAutoCancel(true); // To remove notification when tapped on it

  //   return notification;
  // };

  function confirmHandler(expenseData) {
    const dataString = JSON.stringify(expenseData);

    setNotifications(expenseData);
    // fetch(apiDev + '/posts/', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: dataString,
    // })
    //   .then(res => res.json())
    //   .then(
    //     result => {
    //       setNotifications(expenseData);
    //       // Alert.alert({
    //       //   title: 'Information',
    //       //   message: 'Data berhasil dimasukan!',
    //       // });
    //     },
    //     error => {
    //       console.log(error);
    //     },
    //   );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <ExpenseForm
          onCancel={cancelHandler}
          onSubmit={confirmHandler}
          submitButtonLabel={isEditing ? 'Update' : 'Add'}
          defaultValues={selectedExpense}
        />

        {isEditing && (
          <View style={styles.deleteContainer}>
            <IconButton
              icon="trash"
              color={GlobalStyles.colors.error500}
              size={36}
              onPress={deleteExpenseHandler}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.white,
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
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
  scrollView: {
    flexGrow: 1,
    // height: height / 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
