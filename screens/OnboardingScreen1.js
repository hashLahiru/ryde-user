import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function OnboardingScreen1({ navigation }) {
 return (
  <View style={styles.container}>
   {/* Image Section */}
   <Image
    source={require('../assets/images/logo.png')} // Replace with your image URL
    style={styles.image}
   />

   {/* Text Section */}
   <View style={styles.textContainer}>
    <Text style={styles.title}>Welcome to Ryde.lk</Text>
    <Text style={styles.subtitle}>
     Your reliable travel companion to get you where you need to go, quickly and
     safely.
    </Text>

    {/* Pagination Indicator */}
    <View style={styles.pagination}>
     <View style={[styles.dot, styles.activeDot]} />
     <View style={styles.dot} />
     <View style={styles.dot} />
    </View>

    {/* Buttons */}
    <TouchableOpacity
     style={styles.nextButton}
     onPress={() => navigation.navigate('Onboarding2')}
    >
     <Text style={styles.nextButtonText}>Next</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={() => navigation.navigate('Onboarding2')}>
     <Text style={styles.skipText}>Skip</Text>
    </TouchableOpacity>
   </View>
  </View>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
 },
 image: {
  width: '100%',
  height: '50%',
  resizeMode: 'cover',
 },
 textContainer: {
  flex: 1,
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingTop: 20,
 },
 title: {
  fontSize: 24,
  fontWeight: 'bold',
  marginTop: 20,
 },
 subtitle: {
  fontSize: 16,
  color: '#666',
  textAlign: 'center',
  marginVertical: 10,
 },
 pagination: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 20,
 },
 dot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: '#ddd',
  marginHorizontal: 5,
 },
 activeDot: {
  backgroundColor: '#ff9600', // Green color for the active dot
 },
 nextButton: {
  backgroundColor: '#ff9600', // Green button
  paddingVertical: 12,
  paddingHorizontal: 130,
  borderRadius: 10,
  marginTop: 30,
  height: 45,
 },
 nextButtonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  alignItems: 'center',
 },
 skipText: {
  color: '#666',
  fontSize: 16,
  marginTop: 20,
 },
});
