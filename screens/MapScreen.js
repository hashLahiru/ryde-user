import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_API_KEY = Constants.expoConfig.extra.GOOGLE_API_KEY;
const GOOGLE_DIRECTIONS_API_KEY =
    Constants.expoConfig.extra.GOOGLE_DIRECTIONS_API_KEY;

export default function MapScreen({ navigation }) {
    const [pickup, setPickup] = useState(null);
    const [drop, setDrop] = useState(null);
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropLocation, setDropLocation] = useState('');
    const [showVehicleSelector, setShowVehicleSelector] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [region, setRegion] = useState(null);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [getVehicleSearchId, setVehicleSearchId] = useState(null);
    const [currentAddress, setCurrentAddress] = useState('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Allow location access to proceed!'
                );
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const initialLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            setPickup(initialLocation);
            setDrop(initialLocation);
            setRegion({
                ...initialLocation,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            const address = await Location.reverseGeocodeAsync(initialLocation);
            if (address.length > 0) {
                const fullAddress = `${address[0].name}, ${address[0].street}, ${address[0].city}`;
                setPickupLocation(fullAddress);
                setCurrentAddress(fullAddress);
            }
        })();
    }, []);

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

    const fetchLocationDetails = async (placeId) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${GOOGLE_API_KEY}`
            );
            const data = await response.json();
            if (data.status === 'OK') {
                const location = data.result.geometry.location;
                return location;
            } else {
                Alert.alert('Error', 'Unable to fetch location details.');
            }
        } catch (error) {
            console.error('Error fetching location details:', error);
            Alert.alert(
                'Error',
                'Something went wrong while fetching location details.'
            );
        }
    };

    const handlePickupLocationSelect = async (data, details = null) => {
        if (details && details.place_id) {
            const location = await fetchLocationDetails(details.place_id);
            setPickupLocation(data.description);
            const newPickup = {
                latitude: location.lat,
                longitude: location.lng,
            };
            setPickup(newPickup);
            setRegion({
                ...newPickup,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
            fetchRoute(newPickup, drop);
        } else {
            Alert.alert('Error', 'Location data not available');
        }
    };

    const handleDropLocationSelect = async (data, details = null) => {
        if (details && details.place_id) {
            const location = await fetchLocationDetails(details.place_id);
            setDropLocation(data.description);
            const newDrop = {
                latitude: location.lat,
                longitude: location.lng,
            };
            setDrop(newDrop);
            updateRegion(pickup, newDrop);
            fetchRoute(pickup, newDrop);
        }
    };

    const updateRegion = (pickup, drop) => {
        if (!pickup || !drop) return;

        const latMin = Math.min(pickup.latitude, drop.latitude);
        const latMax = Math.max(pickup.latitude, drop.latitude);
        const lngMin = Math.min(pickup.longitude, drop.longitude);
        const lngMax = Math.max(pickup.longitude, drop.longitude);

        const latitude = (latMin + latMax) / 2;
        const longitude = (lngMin + lngMax) / 2;
        const latitudeDelta = (latMax - latMin) * 1.5;
        const longitudeDelta = (lngMax - lngMin) * 1.5;

        setRegion({
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta,
        });
    };

    // Sample Vehicles Data
    const packages = [
        {
            id: '1',
            name: 'Blue',
            seats: 4,
            tripTime: '15 mins',
            price: `$${(duration * 10).toFixed(2)}`,
            image: require('../assets/sedan.png'),
        },
        {
            id: '2',
            name: 'Green',
            seats: 6,
            tripTime: '18 mins',
            price: `$${(duration * 15).toFixed(2)}`,
            image: require('../assets/suv.png'),
        },
        {
            id: '3',
            name: 'Gold',
            seats: 8,
            tripTime: '20 mins',
            price: `$${(duration * 25).toFixed(2)}`,
            image: require('../assets/van.png'),
        },
    ];

    const handleFindDriver = async () => {
        if (!pickupLocation || !dropLocation || !drop) {
            Alert.alert('Error', 'Please provide valid locations!');
            return;
        }
        setShowVehicleSelector(true);
    };

    const confirmRide = async () => {
        if (!selectedVehicle) {
            Alert.alert('Error', 'Please select a vehicle to proceed!');
            return;
        }

        const selectedVehicleData = packages.find(
            (vehiclePackage) => vehiclePackage.id === selectedVehicle
        );
        if (!selectedVehicleData) {
            Alert.alert('Error', 'Invalid package selected!');
            return;
        }

        const login_token = await AsyncStorage.getItem('login_token');
        if (!login_token) {
            Alert.alert('Error', 'Login token not found. Please log in again.');
            return;
        }
        console.log(login_token);

        const locationSearchApiData = {
            function: 'SearchVehicle',
            data: {
                login_token: login_token,
                start_lat: pickup.latitude.toString(), // Fix: Use toString()
                start_long: pickup.longitude.toString(), // Fix: Use toString()
                end_lat: drop.latitude.toString(), // Fix: Use toString()
                end_long: drop.longitude.toString(), // Fix: Use toString()
                vs_date_time: new Date().toISOString(),
                vehicle_type: selectedVehicleData.id,
            },
        };

        try {
            const response = await fetch(
                'http://ryde100.introps.com/UserRide/app_api',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Cookie: 'ci_session=2jb4rmpvr0jmlrh9s5noqvia1out7oj9; ci_session=g57pi09mlmfv9nen65c33tld4v7q5bdn',
                    },
                    body: JSON.stringify(locationSearchApiData),
                }
            );

            const result = await response.json();
            console.log(result);
            if (result && result.status === 'success') {
                await AsyncStorage.setItem(
                    'vcl_search_id',
                    result.search_id.toString()
                );
                setShowVehicleSelector(false);
                handleConfirmRide(result.search_id);
            } else {
                Alert.alert(
                    'Error',
                    result.message || 'Failed to confirm ride.'
                );
            }
        } catch (error) {
            console.error('API Error:', error);
            Alert.alert(
                'Error',
                'Something went wrong while confirming the ride.'
            );
        }
    };

    const handleConfirmRide = (searchId) => {
        if (!pickupLocation || !dropLocation || !selectedVehicle) {
            // Alert.alert(
            //     'Error',
            //     'Please select all details before confirming.'
            // );

            navigation.navigate('ConfirmRide');
            return;
        }

        navigation.navigate('ConfirmRide', {
            pickupLocation,
            dropLocation,
            selectedVehicle,
            duration: duration?.toFixed(2),
            distance: distance?.toFixed(2),
            pickupCoordinates: pickup,
            dropCoordinates: drop,
            vehicleSearchId: searchId,
        });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={26} color="#fff" />
                    </TouchableOpacity>

                    {/* Map View */}
                    <View style={styles.mapContainer}>
                        {region ? (
                            <MapView
                                style={styles.map}
                                region={region}
                                onPress={(e) => {
                                    const newDrop = e.nativeEvent.coordinate;
                                    setDrop(newDrop);
                                    updateRegion(pickup, newDrop);
                                    fetchRoute(pickup, newDrop);
                                }}
                            >
                                {pickup && (
                                    <Marker
                                        coordinate={pickup}
                                        title="Pickup"
                                        pinColor="#ff9600"
                                    />
                                )}
                                {drop && (
                                    <Marker
                                        coordinate={drop}
                                        title="Drop"
                                        pinColor="#1f1f1f"
                                    />
                                )}

                                {/* Draw Route */}
                                {pickup && drop && (
                                    <MapViewDirections
                                        origin={pickup}
                                        destination={drop}
                                        apikey={GOOGLE_DIRECTIONS_API_KEY}
                                        strokeWidth={5}
                                        strokeColor="#1f1f1f"
                                        onReady={(result) => {
                                            console.log(
                                                'Distance:',
                                                result.distance
                                            );
                                            console.log(
                                                'Duration:',
                                                result.duration
                                            );
                                            setDistance(result.distance);
                                            setDuration(result.duration);
                                        }}
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
                    </View>

                    {/* Distance & Duration Display */}
                    {distance && duration && (
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoText}>
                                Distance: {distance.toFixed(2)} km
                            </Text>
                            <Text style={styles.infoText}>
                                Duration: {duration.toFixed(2)} mins
                            </Text>
                        </View>
                    )}

                    {/* Bottom Sheet */}
                    <View style={styles.bottomSheet}>
                        {/* Location Inputs */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Pick Up</Text>
                            <GooglePlacesAutocomplete
                                placeholder="Pickup Location"
                                onPress={(data, details = null) => {
                                    const lat = details.geometry.location.lat;
                                    const lng = details.geometry.location.lng;
                                    const location = {
                                        latitude: lat,
                                        longitude: lng,
                                    };
                                    setPickup(location);
                                    setPickupLocation(data.description);
                                    updateRegion(location, drop); // Update map region
                                    fetchRoute(location, drop);
                                }}
                                fetchDetails={true}
                                query={{
                                    key: GOOGLE_API_KEY,
                                    language: 'en',
                                    components: 'country:lk',
                                }}
                                textInputProps={{
                                    value: pickupLocation,
                                    onChangeText: setPickupLocation,
                                    placeholderTextColor: '#999',
                                }}
                                styles={{
                                    textInput: styles.input,
                                }}
                                enablePoweredByContainer={false}
                            />

                            <Text style={styles.label}>Drop</Text>
                            <GooglePlacesAutocomplete
                                placeholder="Drop Location"
                                onPress={handleDropLocationSelect}
                                query={{
                                    key: GOOGLE_API_KEY,
                                    language: 'en',
                                    components: 'country:lk',
                                }}
                                styles={{
                                    textInput: styles.input,
                                }}
                            />
                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.laterButton}>
                                <Text style={styles.buttonText}>Schedule</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleFindDriver}
                            >
                                <Text style={styles.buttonText}>Start Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Vehicle Selector Modal */}
                    <Modal
                        isVisible={showVehicleSelector}
                        style={styles.modal}
                        onBackdropPress={() => setShowVehicleSelector(false)}
                    >
                        <View style={styles.modalContent}>
                            {distance && duration && (
                                <View style={styles.infoContainer}>
                                    <Ionicons
                                        name="time"
                                        size={20}
                                        color="#ff9600"
                                    />
                                    <Text style={styles.infoText}>
                                        {duration.toFixed(2)} mins
                                    </Text>

                                    <MaterialCommunityIcons
                                        name="map-marker-distance"
                                        size={20}
                                        color="#ff9600"
                                        style={styles.iconSpacing}
                                    />
                                    <Text style={styles.infoText}>
                                        {distance.toFixed(2)} km
                                    </Text>
                                </View>
                            )}

                            <Text style={styles.modalTitle}>
                                Select Your Ride
                            </Text>

                            {/* Vehicle List */}
                            <FlatList
                                horizontal
                                data={packages}
                                keyExtractor={(item) => item.id}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.vehicleCard,
                                            selectedVehicle === item.id &&
                                                styles.selectedVehicle,
                                        ]}
                                        onPress={() =>
                                            setSelectedVehicle(item.id)
                                        }
                                    >
                                        <Text style={styles.tripTime}>
                                            {item.tripTime}
                                        </Text>
                                        <Image
                                            source={item.image}
                                            style={styles.vehicleImage}
                                        />
                                        <Text style={styles.vehicleName}>
                                            {item.name} - {item.seats} Seats
                                        </Text>
                                        <Text style={styles.vehiclePrice}>
                                            {item.price}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />

                            {/* Confirm Button */}
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={confirmRide}
                            >
                                <Text style={styles.confirmText}>
                                    Confirm Ride
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1 },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 30,
        padding: 10,
        zIndex: 10,
    },
    mapContainer: { flex: 2 },
    map: { width: '100%', height: '100%' },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#F8F8F8',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 15,
        paddingVertical: 10,
    },
    inputContainer: { paddingHorizontal: 20 },
    label: { fontSize: 17, fontWeight: '500', color: '#212121', marginTop: 10 },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingLeft: 10,
        backgroundColor: '#f9f9f9',
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    laterButton: {
        backgroundColor: '#ababab',
        paddingVertical: 15,
        paddingHorizontal: 21,
        borderRadius: 10,
    },
    startButton: {
        backgroundColor: '#ff9600',
        paddingVertical: 15,
        paddingHorizontal: 70,
        borderRadius: 10,
    },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    modal: { justifyContent: 'flex-end', margin: 0 },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'center',
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    vehicleCard: {
        padding: 10,
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 10,
        backgroundColor: '#ececec',
    },
    selectedVehicle: {
        borderColor: '#ff9600',
        borderWidth: 2,
        backgroundColor: '#ff9600',
    },
    vehicleImage: { width: 80, height: 50, resizeMode: 'contain' },
    vehicleName: { fontSize: 14, fontWeight: 'bold', marginTop: 5 },
    vehiclePrice: { fontSize: 12, color: '#666' },
    confirmButton: {
        marginTop: 10,
        backgroundColor: '#ff9600',
        padding: 15,
        borderRadius: 10,
        paddingHorizontal: 50,
        marginLeft: 130,
    },
    confirmText: { color: '#fff', fontWeight: 'bold' },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Adjust as needed
        marginVertical: 10,
    },

    infoText: {
        marginHorizontal: 5, // Adds spacing between text and icons
        fontSize: 16,
        color: '#333',
    },

    iconSpacing: {
        marginLeft: 10, // Adjusts spacing between icons
    },
});
