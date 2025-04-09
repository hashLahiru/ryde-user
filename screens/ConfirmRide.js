import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    Animated,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_API_KEY = Constants.expoConfig.extra.GOOGLE_API_KEY;
const GOOGLE_DIRECTIONS_API_KEY =
    Constants.expoConfig.extra.GOOGLE_DIRECTIONS_API_KEY;

export default function ConfirmRideScreen({ route, navigation }) {
    const {
        pickupLocation,
        dropLocation,
        selectedVehicle,
        duration,
        distance,
        pickupCoordinates,
        dropCoordinates,
        vehicleSearchId,
    } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [riderFoundModal, setRiderFoundModal] = useState(false);
    const [modelMessage, setModalMessage] = useState('');
    const [region, setRegion] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [isDriverFound, setIsDriverFound] = useState(false);

    const intervalRef = useRef(null);

    const blinkAnim = new Animated.Value(1); // Blinking animation

    useEffect(() => {
        if (!region && pickupCoordinates && dropCoordinates) {
            const latMin = Math.min(
                pickupCoordinates.latitude,
                dropCoordinates.latitude
            );

            const latMax = Math.max(
                pickupCoordinates.latitude,
                dropCoordinates.latitude
            );
            const longMin = Math.min(
                pickupCoordinates.longitude,
                dropCoordinates.longitude
            );
            const longMax = Math.max(
                pickupCoordinates.longitude,
                dropCoordinates.longitude
            );

            setRegion({
                latitude: (latMin + latMax) / 2,
                longitude: (longMin + longMax) / 2,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
    }, [pickupCoordinates, dropCoordinates]);

    useEffect(() => {
        startDriverSearch();

        return () => {
            stopDriverSearch();
        };
    }, []);

    const startDriverSearch = () => {
        setTimeout(() => {
            fetchFindDriver();

            intervalRef.current = setInterval(fetchFindDriver, 30000);
        }, 15000);
    };

    const stopDriverSearch = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const fetchFindDriver = async () => {
        // If driver is already found or failed, stop sending requests
        if (isDriverFound) {
            stopDriverSearch();
            return;
        }

        const login_token = await AsyncStorage.getItem('login_token');
        const vehicleSearchId = await AsyncStorage.getItem('vcl_search_id');
        console.log('Vehicle Search ID : ', vehicleSearchId);

        const FindDriverData = {
            function: 'FindDriver',
            data: {
                login_token: login_token,
                vehicle_search_id: vehicleSearchId.toString(),
            },
        };

        try {
            const response = await fetch(
                'http://ryde100.introps.com/App_apiv2/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(FindDriverData),
                }
            );

            const result = await response.json();
            console.log('Driver search result:', result);

            if (result?.status === 'next') {
                setModalMessage('Looking for another driver...');
                setModalVisible(true);
            } else if (result?.status === 'found') {
                setModalMessage('Ryder found. Please wait...');
                setRiderFoundModal(true);
                setIsDriverFound(true);
                stopDriverSearch();

                setTimeout(() => {
                    setRiderFoundModal(false);
                }, 5000);
            } else if (result?.status === 'failed') {
                setModalMessage('No Ryders. Please try again later.');
                setModalVisible(true);
                setIsDriverFound(true);
                stopDriverSearch();
            }
        } catch (error) {
            console.error('Error finding driver:', error);
            setModalMessage('Error connecting to server. Please try again.');
            setModalVisible(true);
        }
    };

    const fetchRoute = async (origin, destination) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&mode=driving&key=${GOOGLE_DIRECTIONS_API_KEY}`
            );
            const data = await response.json();
            if (data.routes.length) {
                const points = data.routes[0].overview_polyline.points;
                const coordinates = decodePolyline(points);
                setRouteCoordinates(coordinates);
            }
        } catch (error) {
            console.error('Error fetching directions:', error);
        }
    };

    const decodePolyline = (encoded) => {
        let points = [];
        let index = 0,
            lat = 0,
            lng = 0;

        while (index < encoded.length) {
            let b,
                shift = 0,
                result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlat = result & 1 ? ~(result >> 1) : result >> 1;
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            let dlng = result & 1 ? ~(result >> 1) : result >> 1;
            lng += dlng;

            points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
        }
        return points;
    };

    return (
        <View style={styles.container}>
            {/* Map Section */}
            <View style={styles.mapContainer}>
                {region ? (
                    <MapView style={styles.map} region={region}>
                        {pickupCoordinates && (
                            <Marker
                                coordinate={pickupCoordinates}
                                title="Pickup"
                            />
                        )}
                        {dropCoordinates && (
                            <Marker
                                coordinate={dropCoordinates}
                                title="Drop"
                                pinColor="blue"
                            />
                        )}

                        {/* Draw Route */}
                        {pickupCoordinates && dropCoordinates && (
                            <MapViewDirections
                                origin={pickupCoordinates}
                                destination={dropCoordinates}
                                apikey={GOOGLE_DIRECTIONS_API_KEY}
                                strokeWidth={5}
                                strokeColor="blue"
                                onError={(errorMessage) =>
                                    console.error(
                                        'MapViewDirections Error:',
                                        errorMessage
                                    )
                                }
                            />
                        )}
                    </MapView>
                ) : null}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>
            </View>
            {/* Ride Details */}
            <View style={styles.infoContainer}>
                <Text style={styles.title}>Ride Details</Text>
                <View style={styles.detailRow}>
                    <Ionicons
                        name="accessibility-outline"
                        size={20}
                        color="#ff8c00"
                    />
                    <Text style={styles.infoText}>{pickupLocation}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons
                        name="location-outline"
                        size={20}
                        color="#ff8c00"
                    />
                    <Text style={styles.infoText}>{dropLocation}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={20} color="#ff8c00" />
                    <Text style={styles.infoText}>
                        Duration: {duration} mins
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="map-outline" size={20} color="#ff8c00" />
                    <Text style={styles.infoText}>Distance: {distance} km</Text>
                </View>
            </View>

            {/* Price Section */}
            <View style={styles.priceContainer}>
                <Text style={styles.priceText}>
                    Estimated Price: ${' '}
                    {distance ? (distance * 10).toFixed(2) : 'N/A'}
                </Text>
            </View>

            {/* Looking for Driver Modal */}
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <ActivityIndicator size="large" color="#ff8c00" />
                        <Animated.Text
                            style={[styles.modalText, { opacity: blinkAnim }]}
                        >
                            {modelMessage}
                        </Animated.Text>
                    </View>
                </View>
            </Modal>
            {/* Rider Found Modal */}
            <Modal
                transparent={true}
                visible={riderFoundModal}
                animationType="fade"
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Ionicons
                            name="checkmark-circle"
                            size={50}
                            color="#ff8c00"
                        />
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
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 10,
        borderRadius: 30,
    },
    infoContainer: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -3 },
        shadowRadius: 5,
        elevation: 0,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    infoText: { fontSize: 16, marginLeft: 10, color: '#555' },
    priceContainer: {
        backgroundColor: 'rgb(102, 102, 102)',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15,
        marginTop: -10,
        borderRadius: 10,
    },
    priceText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 10,
    },
});
