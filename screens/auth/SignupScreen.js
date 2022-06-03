import React from "react";
import { StyleSheet, View, Text, TextInput, Button, Alert } from "react-native";
import { NavigationActions } from "react-navigation";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default class SignupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      passwordConfirm: "",
    };
  }

  onSignupPress = () => {
    if (this.state.password !== this.state.passwordConfirm) {
      Alert.alert("Passwords do not match");
      return;
    }
    const auth = getAuth();
    createUserWithEmailAndPassword(
      auth,
      this.state.email,
      this.state.password
    ).then(
      () => {
        Alert.alert("Account inserted successfully");
        this.props.navigation.navigate("LoginScreen");
      },
      (error) => {
        Alert.alert(error.message);
      }
    );
  };

  onBackToLoginPress = () => {
    var navActions = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: "Login" })],
    });
    this.props.navigation.dispatch(navActions);
  };

  render() {
    return (
      <View style={{ paddingTop: 50, alignItems: "center" }}>
        <Text>Signup</Text>

        <TextInput
          style={{ width: 200, height: 40, borderWidth: 1 }}
          value={this.state.email}
          onChangeText={(text) => {
            this.setState({ email: text });
          }}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={{ paddingTop: 10 }} />

        <TextInput
          style={{ width: 200, height: 40, borderWidth: 1 }}
          value={this.state.password}
          onChangeText={(text) => {
            this.setState({ password: text });
          }}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <View style={{ paddingTop: 10 }} />

        <TextInput
          style={{ width: 200, height: 40, borderWidth: 1 }}
          value={this.state.passwordConfirm}
          onChangeText={(text) => {
            this.setState({ passwordConfirm: text });
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
