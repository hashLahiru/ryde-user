import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  FlatList
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

export default function MapScreen({ navigation }) {
  const [pickup, setPickup] = useState({ latitude: 7.2906, longitude: 80.6337 });
  const [drop, setDrop] = useState(null);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Sample Vehicles Data
  const vehicles = [
    { id: "5", name: "Tuk", seats: 2, tripTime: "12 mins", price: "$5", image: require("../assets/tuk2.png") },
    { id: "1", name: "Sedan", seats: 4, tripTime: "15 mins", price: "$10", image: require("../assets/sedan.png") },
    { id: "2", name: "SUV", seats: 6, tripTime: "18 mins", price: "$15", image: require("../assets/suv.png") },
    { id: "3", name: "Van", seats: 8, tripTime: "20 mins", price: "$20", image: require("../assets/van.png") },
    { id: "4", name: "Mini", seats: 3, tripTime: "12 mins", price: "$8", image: require("../assets/mini.png") }
  ];
  
  const handleFindDriver = () => {
    if (!pickupLocation || !dropLocation || !drop) {
      Alert.alert("Error", "Please provide valid locations!");
      return;
    }
    setShowVehicleSelector(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: pickup.latitude,
            longitude: pickup.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={(e) => setDrop(e.nativeEvent.coordinate)}
        >
          <Marker coordinate={pickup} title="Pickup" />
          {drop && <Marker coordinate={drop} title="Drop" pinColor="blue" />}
        </MapView>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Location Inputs */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pick Up</Text>
          <TextInput style={styles.input} value={pickupLocation} onChangeText={setPickupLocation} placeholder="Your Location" />
          <Text style={styles.label}>Drop</Text>
          <TextInput style={styles.input} value={dropLocation} onChangeText={setDropLocation} placeholder="Where are you going?" />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.laterButton}><Text style={styles.buttonText}>Schedule</Text></TouchableOpacity>
          <TouchableOpacity style={styles.startButton} onPress={handleFindDriver}><Text style={styles.buttonText}>Start Now</Text></TouchableOpacity>
        </View>
      </View>

      {/* Vehicle Selector Modal */}
      <Modal isVisible={showVehicleSelector} style={styles.modal} onBackdropPress={() => setShowVehicleSelector(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Your Ride</Text>

          {/* Vehicle List */}
          <FlatList
            horizontal
            data={vehicles}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.vehicleCard,
                  selectedVehicle === item.id && styles.selectedVehicle,
                ]}
                onPress={() => setSelectedVehicle(item.id)}
              >
                {/* Trip Time Above Image */}
                <Text style={styles.tripTime}>{item.tripTime}</Text>

                {/* Vehicle Image */}
                <Image source={item.image} style={styles.vehicleImage} />

                {/* Vehicle Name & Seat Count Below Image */}
                <Text style={styles.vehicleName}>{item.name} - {item.seats} Seats</Text>

                {/* Trip Cost */}
                <Text style={styles.vehiclePrice}>{item.price}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmButton} onPress={() => setShowVehicleSelector(false)}>
            <Text style={styles.confirmText}>Confirm Ride</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 1 },
  mapContainer: { flex: 2 },
  map: { width: "100%", height: "100%" },
  bottomSheet: { position: "absolute", bottom: 0, width: "100%", backgroundColor: "#F8F8F8", borderTopLeftRadius: 10, borderTopRightRadius: 15, paddingVertical: 10 },
  inputContainer: { paddingHorizontal: 20 },
  label: { fontSize: 17, fontWeight: "500", color: "#212121", marginTop: 10 },
  input: { height: 40, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingLeft: 10, backgroundColor: "#f9f9f9", marginTop: 5 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", padding: 20 },
  laterButton: { backgroundColor: "#ababab", paddingVertical: 15, paddingHorizontal: 21, borderRadius: 10 },
  startButton: { backgroundColor: "#ff9600", paddingVertical: 15, paddingHorizontal: 70, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modal: { justifyContent: "flex-end", margin: 0 },
  modalContent: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 15, borderTopRightRadius: 15, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  vehicleCard: { padding: 10, alignItems: "center", marginRight: 10, borderRadius: 10, backgroundColor: "#ececec" },
  selectedVehicle: { borderColor: "#ff9600", borderWidth: 2, backgroundColor: "#ff9600" },
  vehicleImage: { width: 80, height: 50, resizeMode: "contain" },
  vehicleName: { fontSize: 14, fontWeight: "bold", marginTop: 5 },
  vehiclePrice: { fontSize: 12, color: "#666" },
  confirmButton: { marginTop: 10, backgroundColor: "#ff9600", padding: 15, borderRadius: 10, paddingHorizontal: 50, marginLeft: 130 },
  confirmText: { color: "#fff", fontWeight: "bold" }
});
