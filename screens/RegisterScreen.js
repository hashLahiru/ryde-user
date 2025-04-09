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

export default function RegisterScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleRegister = async () => {
        try {
            const requestBody = {
                function: 'CreateUser',
                data: {
                    mobile: phoneNumber,
                    email: email,
                    password: password,
                    firstname: firstName,
                    lastname: lastName,
                    address: address,
                },
            };

            const response = await fetch(
                'http://ryde100.introps.com/app_apiv2/app_api',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();

            if (result.status === 'success') {
                await AsyncStorage.setItem('login_token', result.login_token);
                setModalMessage('Your account has been successfully created!');
                setIsSuccess(true);
            } else {
                setModalMessage(
                    result.message || 'Registration Failed. Please Try Again'
                );
                setIsSuccess(false);
            }
        } catch (error) {
            setModalMessage('Error Registering: ' + error.message);
            setIsSuccess(false);
        } finally {
            setModalVisible(true);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.header}>
                <Text style={styles.title}>Create an Account</Text>
                <Text style={styles.subtitle}>
                    Join us to explore endless possibilities. Enter your details
                    to get started!
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleRegister}
                >
                    <Text style={styles.nextButtonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {isSuccess ? 'Success' : 'Error'}
                        </Text>
                        <Text style={styles.modalMessage}>{modalMessage}</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(false);
                                if (isSuccess)
                                    navigation.navigate('VerifyMobile');
                            }}
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
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        backgroundColor: '#ff9600',
        padding: 20,
        height: 180,
        borderBottomRightRadius: 50,
    },
    title: { color: '#fff', fontSize: 24, fontWeight: 'bold', paddingTop: 25 },
    subtitle: { color: '#fff', fontSize: 14, marginTop: 10 },
    inputContainer: { flex: 1, padding: 20 },
    textInput: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#f9f9f9',
    },
    nextButton: {
        backgroundColor: '#ff9600',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    cancelButton: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 0,
    },
    cancelButtonText: { color: '#666666', fontSize: 16, fontWeight: 'bold' },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    modalMessage: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
    modalButton: {
        backgroundColor: '#ff9600',
        paddingVertical: 10,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
