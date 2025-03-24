import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Animated, ActivityIndicator, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

export default function ConfirmRideScreen({ route, navigation }) {
    const { pickupLocation, dropLocation, duration, distance, price } = route.params;
    
    const [modalVisible, setModalVisible] = useState(true);
    const [riderFoundModal, setRiderFoundModal] = useState(false);
    const blinkAnim = new Animated.Value(1); // Blinking animation

    useEffect(() => {
        const blink = Animated.loop(
            Animated.sequence([
                Animated.timing(blinkAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
                Animated.timing(blinkAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            ])
        );
        blink.start();

        // Simulate driver search for 5 seconds, then show Rider Found modal
        const timer = setTimeout(() => {
            setModalVisible(false);
            setRiderFoundModal(true);
            
            // Auto close Rider Found modal after 3 seconds
            setTimeout(() => setRiderFoundModal(false), 3000);
        }, 5000);

        return () => {
            blink.stop();
            clearTimeout(timer);
        };
    }, []);

    return (
        <View style={styles.container}>
            {/* Map Section */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 7.2906, // Example: Kandy, Sri Lanka
                        longitude: 80.6337,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    <Marker coordinate={{ latitude: 7.2906, longitude: 80.6337 }} title="Pickup Location" />
                </MapView>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Ride Details */}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>Ride Details</Text>
                <View style={styles.detailRow}><Ionicons name="accessibility-outline" size={20} color="#ff8c00" /><Text style={styles.infoText}>{pickupLocation}</Text></View>
                <View style={styles.detailRow}><Ionicons name="location-outline" size={20} color="#ff8c00" /><Text style={styles.infoText}>{dropLocation}</Text></View>
                <View style={styles.detailRow}><Ionicons name="time-outline" size={20} color="#ff8c00" /><Text style={styles.infoText}>Duration: {duration} mins</Text></View>
                <View style={styles.detailRow}><Ionicons name="map-outline" size={20} color="#ff8c00" /><Text style={styles.infoText}>Distance: {distance} km</Text></View>
            </View>

            {/* Price Section */}
            <View style={styles.priceContainer}>
                <Text style={styles.priceText}>Estimated Price: LKR {price}</Text>
            </View>

            {/* Looking for Driver Modal */}
            <Modal transparent={true} visible={modalVisible} animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <ActivityIndicator size="large" color="#ff8c00" />
                        <Animated.Text style={[styles.modalText, { opacity: blinkAnim }]}>Looking for a Driver...</Animated.Text>
                    </View>
                </View>
            </Modal>

            {/* Rider Found Modal */}
            <Modal transparent={true} visible={riderFoundModal} animationType="fade">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Ionicons name="checkmark-circle" size={50} color="#ff8c00" />
                        <Text style={styles.modalText}>Rider Found!</Text>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    mapContainer: { flex: 1, position: 'relative' },
    map: { width: '100%', height: '100%' },
    backButton: { position: 'absolute', top: 40, left: 20, backgroundColor: 'rgba(0, 0, 0, 0.6)', padding: 10, borderRadius: 30 },
    infoContainer: { padding: 20, backgroundColor: '#f5f5f5', borderTopRightRadius: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: -3 }, shadowRadius: 5, elevation: 0 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    infoText: { fontSize: 16, marginLeft: 10, color: '#555' },
    priceContainer: { backgroundColor: 'rgb(102, 102, 102)', padding: 15, alignItems: 'center', justifyContent: 'center', margin: 15, marginTop: -10, borderRadius: 10 },
    priceText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)' },
    modalContainer: { backgroundColor: '#fff', padding: 30, borderRadius: 10, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 5 },
    modalText: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 10 },
});
