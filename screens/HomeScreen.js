import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Modal,
    Alert,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
    const [sideMenuVisible, setSideMenuVisible] = useState(false);

    // useEffect(() => {
    //     removeLoginToken();
    // });

    // const removeLoginToken = async () => {
    //     try {
    //         await AsyncStorage.removeItem('login_token');
    //         console.log('Login token removed');
    //     } catch (error) {
    //         console.error('Error removing login token:', error);
    //     }
    // };

    const toggleSideMenu = () => {
        setSideMenuVisible(!sideMenuVisible);
    };

    const handleMenuItemClick = (item) => {
        setSideMenuVisible(false);

        switch (item) {
            case 'User':
                navigation.navigate('UserScreen');
                break;
            case 'Notifications':
                navigation.navigate('NotificationsScreen');
                break;
            case 'Payments':
                navigation.navigate('PaymentsScreen');
                break;
            case 'History':
                navigation.navigate('HistoryScreen');
                break;
            case 'Support':
                navigation.navigate('SupportScreen');
                break;
            case 'Driver':
                navigation.navigate('DriverScreen');
                break;
            case 'Logout':
                Alert.alert('Logged out');
                break;
            case 'Exit':
                Alert.alert('Exiting app');
                break;
            default:
                break;
        }
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <TouchableOpacity
                        onPress={toggleSideMenu}
                        accessibilityLabel="Menu"
                    >
                        <MaterialIcons
                            name="menu"
                            size={30}
                            style={styles.menuIcon}
                        />
                    </TouchableOpacity>
                    <Image
                        source={require('../assets/images/adaptive-icon.png')}
                        style={styles.logo}
                    />
                    <Text style={styles.logoText}>Ryde.lk</Text>
                </View>
                <View style={styles.icons}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('NotificationsScreen')
                        }
                        accessibilityLabel="Menu"
                    >
                        <MaterialIcons
                            name="notifications-none"
                            size={26}
                            style={styles.notificationIcon}
                            accessibilityLabel="Notifications"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Side Menu */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={sideMenuVisible}
                onRequestClose={toggleSideMenu}
            >
                <View style={styles.sideMenu}>
                    {/* Logo and Name */}
                    <View style={styles.sideMenuHeader}>
                        <Image
                            source={require('../assets/images/adaptive-icon.png')}
                            style={styles.sideMenuLogo}
                        />
                        <Text style={styles.sideMenuTitle}>Ryde.lk</Text>
                    </View>

                    {/* Menu Items */}
                    <View style={styles.menuItemsContainer}>
                        {[
                            'Home',
                            'User',
                            'Notifications',
                            'Payments',
                            'History',
                            'Support',
                            'Logout',
                            'Exit',
                        ].map((item, index) => (
                            <Text
                                key={index}
                                style={styles.menuItem}
                                onPress={() => handleMenuItemClick(item)} // Handle click for each menu item
                            >
                                {item}
                            </Text>
                        ))}
                    </View>

                    {/* Footer */}
                    <View style={styles.sideMenuFooter}>
                        <Text style={styles.footerText}>
                            Powered by Introps IT
                        </Text>
                    </View>
                </View>
            </Modal>

            {/* ScrollView content */}
            <ScrollView style={styles.container}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search destinations"
                    />
                    <MaterialIcons name="location-on" size={24} color="#333" />
                </View>

                {/* Banner */}
                <View style={styles.banner}>
                    <Image
                        source={require('../assets/images/bcar.png')}
                        style={styles.bannerImage}
                    />
                    <Text style={styles.bannerText}>
                        Ready?{'\n'}Let's Start
                    </Text>
                    <View style={styles.bannerArrow}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('MapScreen')}
                            accessibilityLabel="Navigate to map screen"
                        >
                            <FontAwesome
                                name="arrow-right"
                                size={24}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Top Categories */}
                <Text style={styles.sectionTitle}>My locations</Text>
                <View style={styles.categories}>
                    <CategoryCard
                        title="Home"
                        image="https://cdn1.iconfinder.com/data/icons/real-estate-building-flat-vol-1/104/building__house__home__real__estate-512.png"
                    />
                    <CategoryCard
                        title="Office"
                        image="https://cdn1.iconfinder.com/data/icons/real-estate-building-flat-vol-1/104/91__building__house__home__real__estate-512.png"
                    />
                    <CategoryCard
                        title="Shop"
                        image="https://cdn1.iconfinder.com/data/icons/city-flat-2/512/urban_city_shop_sale_purchase_shopping_store-512.png"
                    />
                </View>

                {/* My Saved Rides */}
                <View style={styles.savedRidesContainer}>
                    <Text style={styles.savedRidesTitle}>My Saved Rides</Text>
                    <View style={styles.savedRidesCard}>
                        <MaterialIcons
                            name="bookmark"
                            size={30}
                            color="#ff9600"
                            style={styles.savedRidesIcon}
                        />
                        <Text style={styles.savedRidesText}>
                            No saved rides yet. Start adding now!
                        </Text>
                    </View>
                </View>

                {/* Add Location Button */}
                <TouchableOpacity style={styles.addLocationButton}>
                    <MaterialIcons name="add-location" size={24} color="#fff" />
                    <Text style={styles.addLocationText}>Add Location</Text>
                </TouchableOpacity>

                {/* Today's Offer */}
                <Text style={styles.sectionTitle}>Today's Offer</Text>
                <View style={styles.offerCard}>
                    <View style={styles.offerDiscount}>
                        <Text style={styles.discountText}>30% off</Text>
                    </View>
                    <View style={styles.offerDetails}>
                        <Text style={styles.offerTitle}>
                            Johnson Smithkover
                        </Text>
                        <Text style={styles.offerSubtitle}>
                            Up to 10 km from Wankover city area
                        </Text>
                        <Text style={styles.offerInfo}>
                            Mini sedan | 4 person
                        </Text>
                        <Text style={styles.offerValid}>
                            Valid till : 20/11/2023
                        </Text>
                    </View>
                    <FontAwesome name="star" size={24} color="#FFD700" />
                    <Text style={styles.offerRating}>4.5</Text>
                </View>
            </ScrollView>
        </View>
    );
};

const CategoryCard = ({ title, image }) => (
    <TouchableOpacity style={styles.categoryCard}>
        <Image source={{ uri: image }} style={styles.categoryImage} />
        <Text style={styles.categoryText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 18,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 35,
        backgroundColor: '#fff',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    logo: {
        width: 30,
        height: 30,
        marginRight: 5,
    },
    logoText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: -5,
    },
    icons: {
        flexDirection: 'row',
    },
    notificationIcon: {
        marginLeft: 10,
        color: '#333333',
    },
    menuIcon: {
        marginRight: 0,
        marginLeft: -10,
        color: '#333333',
    },
    sideMenu: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '70%',
        height: '100%',
        backgroundColor: '#333333',
        padding: 20,
    },
    sideMenuHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sideMenuLogo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    sideMenuTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    menuItemsContainer: {
        flex: 1,
    },
    menuItem: {
        fontSize: 18,
        paddingVertical: 15,
        color: '#fff',
        fontColor: '#fff',
    },
    sideMenuFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#444',
        paddingVertical: 10,
    },
    footerText: {
        color: '#fff',
        fontSize: 12,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        marginRight: 10,
    },
    banner: {
        flexDirection: 'row',
        backgroundColor: '#ff9600',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    bannerImage: {
        width: 150,
        height: 90,
        resizeMode: 'contain',
        marginRight: 10,
    },
    bannerText: {
        flex: 1,
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bannerArrow: {
        borderRadius: 0,
        padding: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    categories: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    categoryCard: {
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 10,
        width: '30%',
    },
    categoryImage: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    savedRidesContainer: {
        marginBottom: 20,
    },
    savedRidesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    savedRidesCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 15,
    },
    savedRidesIcon: {
        marginRight: 10,
    },
    savedRidesText: {
        color: '#555',
        fontSize: 14,
    },
    addLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#333333',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
    },
    addLocationText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    offerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    offerDiscount: {
        backgroundColor: '#FF6347',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
    },
    discountText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    offerDetails: {
        flex: 1,
    },
    offerTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    offerSubtitle: {
        color: '#555',
    },
    offerInfo: {
        color: '#777',
        fontSize: 12,
    },
    offerValid: {
        color: '#999',
        fontSize: 12,
        marginTop: 5,
    },
    offerRating: {
        fontSize: 14,
        marginLeft: 5,
    },
});

export default HomeScreen;
