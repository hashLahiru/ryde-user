import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const UserScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Profile</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require('../assets/user-avatar.png')} // Add a user avatar image here
          style={styles.profileImage}
        />
        <Text style={styles.username}>John Doe</Text>
        <Text style={styles.userLocation}>Location: Downtown</Text>
      </View>

      {/* User Options */}
      <View style={styles.optionsSection}>
        <TouchableOpacity style={styles.optionButton}>
          <MaterialIcons name="history" size={24} color="#666666" />
          <Text style={styles.optionText}>Booking History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <MaterialIcons name="payment" size={24} color="#666666" />
          <Text style={styles.optionText}>Payment Methods</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <MaterialIcons name="notifications" size={24} color="#666666" />
          <Text style={styles.optionText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <MaterialIcons name="settings" size={24} color="#666666" />
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.LogoutButton}>
          <MaterialIcons name="logout" size={24} color="#666666" />
          <Text style={styles.optionText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#ff9600', // Dark green header background
    padding: 25,
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomRightRadius: 40,
    paddingTop: 30,
  },
  iconButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  profileSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userLocation: {
    fontSize: 16,
    color: '#555',
  },
  optionsSection: {
    marginHorizontal: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4e4e4',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  LogoutButton:{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4e4e4',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,

  },
  optionText: {
    marginLeft: 15,
    color: '#666666',
    fontSize: 18,
  },
});

export default UserScreen;
