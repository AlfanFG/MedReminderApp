import React from 'react';
import {StyleSheet, View, Text, TextInput, Button, Alert} from 'react-native';
import {NavigationActions} from 'react-navigation';
import auth from '@react-native-firebase/auth';
import {apiDevIp} from '../../constants';

export default class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      phone_number: '',
      uuid: '',
      email: '',
      password: '',
      passwordConfirm: '',
    };
  }

  onSignupPress = () => {
    if (this.state.password !== this.state.passwordConfirm) {
      Alert.alert('Passwords do not match');
      return;
    }
    const body = {
      name: this.state.name,
      phone_number: this.state.phone_number + '@c.us',
      email: this.state.email,
      password: this.state.password,
    };
    auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(
         () => {
          fetch(apiDevIp + '/user/create', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          })
            .then(res => res.json())
            .then(
             result => {
                // await Keychain.setGenericPassword()
                console.log(result);
                Alert.alert('Account inserted successfully');
                this.props.navigation.navigate('LoginScreen');
              },
              error => {
                console.log(error);
              },
            );
        },
        error => {
          Alert.alert(error.message);
        },
      );
  };

  onBackToLoginPress = () => {
    var navActions = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Login'})],
    });
    this.props.navigation.dispatch(navActions);
  };

  render() {
    return (
      <View style={{paddingTop: 50, alignItems: 'center'}}>
        <Text>Signup</Text>

        <TextInput
          style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.name}
          onChangeText={text => {
            this.setState({name: text});
          }}
          placeholder="Name"
        />

        <View style={{paddingTop: 10}} />

        <TextInput
          style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.phone_number}
          onChangeText={text => {
            // Menghilangkan karakter selain angka
            let phoneNumber = text.replace(/\D/g, '');
            // Menghilangkan angka 0 di depan (prefix)
            // Kemudian diganti dengan 62
            if (phoneNumber.startsWith('0')) {
              phoneNumber = '62' + phoneNumber.substr(1);
            }
            this.setState({phone_number: phoneNumber});
          }}
          placeholder="Phone Number"
          keyboardType="numeric"
        />

        <View style={{paddingTop: 10}} />

        <TextInput
          style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.email}
          onChangeText={text => {
            this.setState({email: text});
          }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={{paddingTop: 10}} />

        <TextInput
          style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.password}
          onChangeText={text => {
            this.setState({password: text});
          }}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={{paddingTop: 10}} />

        <TextInput
          style={{width: 200, height: 40, borderWidth: 1}}
          value={this.state.passwordConfirm}
          onChangeText={text => {
            this.setState({passwordConfirm: text});
          }}
          placeholder="Password (confirm)"
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Button title="Signup" onPress={this.onSignupPress} />

        <Button title="Back to Login" onPress={this.onBackToLoginPress} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
