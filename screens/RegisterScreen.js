import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Modal,
    FlatList,
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
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({
        code: 'LK',
        name: 'Sri Lanka',
        flag: '🇱🇰',
        dialCode: '+94',
    });

    const countries = [
        { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94' },
        { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92' },
        { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
        { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
        {
            code: 'AE',
            name: 'United Arab Emirates',
            flag: '🇦🇪',
            dialCode: '+971',
        },
    ];

    const handleRegister = async () => {
        const fullPhoneNumber = selectedCountry.dialCode + phoneNumber;
        try {
            const requestBody = {
                function: 'CreateUser',
                data: {
                    mobile: fullPhoneNumber,
                    email: email,
                    password: password,
                    firstname: firstName,
                    lastname: lastName,
                    address: address,
                },
            };

            const response = await fetch(
                'http://ryde100.introps.com/User/app_api',
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
                <View style={styles.phoneInputContainer}>
                    {/* Country Code Selector */}
                    <TouchableOpacity
                        style={styles.countryCodeButton}
                        onPress={() => setShowCountryPicker(true)}
                    >
                        <Text style={styles.countryFlag}>
                            {selectedCountry.flag}
                        </Text>
                        <Text style={styles.countryCodeText}>
                            {selectedCountry.dialCode}
                        </Text>
                    </TouchableOpacity>

                    {/* Phone Number Input */}
                    <TextInput
                        style={styles.phoneInput}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                    />
                </View>
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

            <Modal
                visible={showCountryPicker}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.countryPickerModal}>
                    <View style={styles.countryPickerHeader}>
                        <Text style={styles.countryPickerTitle}>
                            Select Country
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowCountryPicker(false)}
                        >
                            <Text style={styles.countryPickerDone}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={countries}
                        keyExtractor={(item) => item.code}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.countryItem,
                                    selectedCountry.code === item.code &&
                                        styles.selectedCountryItem,
                                ]}
                                onPress={() => {
                                    setSelectedCountry(item);
                                    setShowCountryPicker(false);
                                }}
                            >
                                <Text style={styles.countryItemFlag}>
                                    {item.flag}
                                </Text>
                                <Text style={styles.countryItemName}>
                                    {item.name}
                                </Text>
                                <Text style={styles.countryItemCode}>
                                    {item.dialCode}
                                </Text>
                            </TouchableOpacity>
                        )}
                    ></FlatList>
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

    countryPickerModal: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 100,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    countryPickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    countryPickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    countryPickerDone: {
        color: '#FFC107',
        fontSize: 16,
        fontWeight: 'bold',
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    selectedCountryItem: {
        backgroundColor: '#FFF9E6',
    },
    countryItemFlag: {
        fontSize: 20,
        width: 30,
    },
    countryItemName: {
        flex: 1,
        fontSize: 16,
    },
    countryItemCode: {
        fontSize: 16,
        color: '#666',
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    countryCodeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 10,
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ccc',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        marginRight: -1, // Remove double border
    },
    countryFlag: {
        fontSize: 20,
        marginRight: 5,
    },
    countryCodeText: {
        fontSize: 16,
    },
    phoneInput: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: '#f9f9f9',
    },
});
