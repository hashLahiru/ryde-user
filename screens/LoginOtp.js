import React, { useState } from 'react';
import {
 View,
 Text,
 TextInput,
 StyleSheet,
 TouchableOpacity,
 KeyboardAvoidingView,
 Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginOtpScreen({ navigation }) {
 const [code, setCode] = useState(['', '', '', '', '', '']); // Store individual code digits for 6 fields
 const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
 const [modalMessage, setModalMessage] = useState(''); // State for dynamic modal message

 const handleChange = (text, index) => {
  const newCode = [...code];
  newCode[index] = text;
  setCode(newCode);
 };

 const handleSubmit = async () => {
  const verificationCode = code.join('');
  console.log('Verification Code:', verificationCode);

  // Retrieve the phone number from AsyncStorage
  const mobile = await AsyncStorage.getItem('phoneNumber');
  console.log('Phone Number:', mobile);

  if (mobile) {
   try {
    const requestBody = {
     function: 'VerifyLoginOtp',
     data: {
      mobile: mobile,
      otp: verificationCode,
     },
    };

    const response = await fetch(
     'http://ryde100.introps.com/App_apiv2/app_api',
     {
      method: 'POST',
      headers: {
       'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
     }
    );

    if (!response.ok) {
     throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Response from API:', result);

    if (result.status === 'success') {
     // Show success modal and navigate to Home after clicking OK
     setModalMessage('You have successfully verified your phone number!');
     setModalVisible(true);
    } else {
     // OTP verification failed
     setModalMessage('OTP is incorrect. Please try again.');
     setModalVisible(true);
    }
   } catch (error) {
    // Handle errors like network issues or unexpected response
    setModalMessage('An error occurred. Please try again.');
    setModalVisible(true);
   }
  } else {
   // No token or mobile available
   setModalMessage('Token or mobile number not found. Please login again.');
   setModalVisible(true);
  }
 };

 const handleModalClose = () => {
  setModalVisible(false);
  if (modalMessage === 'You have successfully verified your phone number!') {
   navigation.navigate('Home'); // Navigate to Home screen after closing the modal on success
  }
 };

 return (
  <KeyboardAvoidingView style={styles.container} behavior="padding">
   {/* Header Section */}
   <View style={styles.header}>
    <Text style={styles.title}>Verify Mobile Number</Text>
    <Text style={styles.subtitle}>
     Enter the 6-digit verification code sent to your phone.
    </Text>
   </View>

   {/* Input Section */}
   <View style={styles.inputContainer}>
    <Text style={styles.label}>Enter Verification Code</Text>

    <View style={styles.codeInputContainer}>
     {code.map((digit, index) => (
      <TextInput
       key={index}
       style={styles.input}
       value={digit}
       onChangeText={(text) => handleChange(text, index)}
       keyboardType="numeric"
       maxLength={1}
      />
     ))}
    </View>

    {/* Verify Button */}
    <TouchableOpacity
     style={styles.nextButton}
     onPress={handleSubmit} // Show modal on verify
    >
     <Text style={styles.nextButtonText}>Verify</Text>
    </TouchableOpacity>

    {/* Back Button */}
    <TouchableOpacity
     style={styles.backButton}
     onPress={() => navigation.goBack()} // Navigate back to the previous screen
    >
     <Text style={styles.backButtonText}>Back</Text>
    </TouchableOpacity>
   </View>

   {/* Verification Modal */}
   <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={handleModalClose} // Close modal on back press
   >
    <View style={styles.modalContainer}>
     <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>
       {modalMessage === 'You have successfully verified your phone number!'
        ? 'Login Successful'
        : 'Verification Failed'}
      </Text>
      <Text style={styles.modalMessage}>{modalMessage}</Text>
      <TouchableOpacity
       style={styles.modalButton}
       onPress={handleModalClose} // Close modal and navigate to Home screen
      >
       <Text style={styles.modalButtonText}>OK</Text>
      </TouchableOpacity>
     </View>
    </View>
   </Modal>
  </KeyboardAvoidingView>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#f5f5f5', // Light gray background
 },
 header: {
  backgroundColor: '#ff9600', // Dark green header background
  borderBottomRightRadius: 40,
  padding: 25,
  paddingTop: 60,
  height: 180,
 },
 title: {
  color: '#fff',
  fontSize: 28,
  fontWeight: 'bold',
 },
 subtitle: {
  color: '#fff',
  fontSize: 16,
  marginTop: 15,
  lineHeight: 22,
 },
 inputContainer: {
  flex: 1,
  padding: 20,
  alignItems: 'center',
 },
 label: {
  fontSize: 18,
  fontWeight: '600',
  color: '#333',
  marginBottom: 12,
 },
 codeInputContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '80%',
  marginBottom: 30,
 },
 input: {
  width: 50,
  height: 50,
  borderColor: '#d1d1d1',
  borderWidth: 1,
  textAlign: 'center',
  fontSize: 24,
  fontWeight: 'bold',
  backgroundColor: '#fff',
  borderRadius: 8,
 },
 nextButton: {
  backgroundColor: '#ff9600', // Matching the dark green button color
  paddingVertical: 16,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 30,
  height: 50,
  width: 300,
 },
 nextButtonText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
 },
 backButton: {
  backgroundColor: '#eaeaea', // Gray button to indicate "Back"
  paddingVertical: 16,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 15, // Space between buttons
  height: 50,
  width: 300,
 },
 backButtonText: {
  color: '#666666', // Dark text for the back button
  fontSize: 18,
  fontWeight: 'bold',
 },
 // Modal Styles
 modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
 },
 modalContent: {
  backgroundColor: '#fff',
  padding: 25,
  borderRadius: 10,
  alignItems: 'center',
  width: '80%',
 },
 modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 15,
 },
 modalMessage: {
  fontSize: 16,
  marginBottom: 20,
  textAlign: 'center',
 },
 modalButton: {
  backgroundColor: '#ff9600', // Button color
  paddingVertical: 10,
  borderRadius: 10,
  width: '100%',
  alignItems: 'center',
 },
 modalButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
 },
});
