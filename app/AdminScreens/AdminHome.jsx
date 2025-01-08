import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Card, Text, Surface } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 48 = padding (16) * 2 + gap between cards (16)

export default function AdminHome({ navigation }) {
  const adminFeatures = [
    {
      title: "Manage Stores",
      description: "Add and manage chicken stores",
      route: "ManageStore",
      iconName: "business",
      gradient: ["#FF6B6B", "#FF8E8E"],
    },
    {
      title: "Users",
      description: "Search and view user details",
      route: "UserManagement",
      iconName: "people",
      gradient: ["#4ECDC4", "#45B7AF"],
    },
    {
      title: "Order Analytics",
      description: "View and track store orders",
      route: "OrderAnalytics",
      iconName: "stats-chart",
      gradient: ["#FFD93D", "#FFE566"],
    },
    {
      title: "Delivery Partners",
      description: "Manage delivery partner details",
      route: "DeliveryPartners",
      iconName: "bicycle",
      gradient: ["#6C5CE7", "#8278ED"],
    },
  ];

  return (
    <LinearGradient colors={["#f0f2f5", "#ffffff"]} style={styles.container}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <Surface style={styles.header} elevation={4}>
            <LinearGradient
              colors={["#2E3192", "#1BFFFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
            >
              <Text variant="headlineMedium" style={styles.headerText}>
                Admin Dashboard
              </Text>
            </LinearGradient>
          </Surface>
        </MotiView>

        {/* <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 800 }}
          style={[styles.headerContainer]}
        >
          <View style={styles.adminInfo}>
            <Text style={styles.adminText}>Admin: Gokul</Text>
            <Text style={styles.cityText}>City: Chennai</Text>
          </View>
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem("stores");
              navigation.navigate("Login");
            }}
            style={styles.logoutButton}
          >
            <LinearGradient
              colors={["#FF4B2B", "#FF416C"]}
              style={styles.logoutGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView> */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "spring", damping: 15 }}
          style={styles.profileContainer}
        >
          <LinearGradient
            colors={["#ffffff", "#f8f9fa"]}
            style={styles.profileCard}
          >
            <MotiView
              from={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "timing", duration: 600, delay: 200 }}
              style={styles.avatarContainer}
            >
              <LinearGradient
                colors={["#2E3192", "#1BFFFF"]}
                style={styles.avatarGradient}
              >
                <MaterialCommunityIcons
                  name="account"
                  size={32}
                  color="white"
                />
              </LinearGradient>
            </MotiView>

            <View style={styles.infoContainer}>
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "spring", delay: 300 }}
              >
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="shield-account"
                    size={20}
                    color="#2E3192"
                  />
                  <Text style={styles.infoText}>
                    Admin: <Text style={styles.infoHighlight}>Gokul</Text>
                  </Text>
                </View>
              </MotiView>

              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: "spring", delay: 400 }}
              >
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="city"
                    size={20}
                    color="#2E3192"
                  />
                  <Text style={styles.infoText}>
                    City: <Text style={styles.infoHighlight}>Chennai</Text>
                  </Text>
                </View>
              </MotiView>
            </View>

            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 500 }}
            >
              <TouchableOpacity
                onPress={async () => {
                  await AsyncStorage.removeItem("stores");
                  navigation.navigate("Login");
                }}
                style={styles.logoutButton}
              >
                <LinearGradient
                  colors={["#FF4B2B", "#FF416C"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.logoutGradient}
                >
                  <MaterialCommunityIcons
                    name="logout"
                    size={20}
                    color="white"
                  />
                  <Text style={styles.logoutText}>Logout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          </LinearGradient>
        </MotiView>

        {/* Admin Image */}

        <AnimatePresence>
          <View style={styles.gridContainer}>
            {adminFeatures.map((feature, index) => (
              <MotiView
                key={feature.title}
                from={{ opacity: 0, scale: 0.5, translateY: 50 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{
                  type: "spring",
                  delay: index * 100,
                  damping: 20,
                  stiffness: 200,
                }}
                style={styles.gridItem}
              >
                <Card
                  style={styles.card}
                  onPress={() => navigation.navigate(feature.route)}
                >
                  <LinearGradient
                    colors={feature.gradient}
                    style={styles.cardGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Card.Content style={styles.cardContent}>
                      <View style={styles.iconContainer}>
                        <LinearGradient
                          colors={[
                            "rgba(255,255,255,0.2)",
                            "rgba(255,255,255,0.3)",
                          ]}
                          style={styles.iconGradient}
                        >
                          <Ionicons
                            name={feature.iconName}
                            size={28}
                            color="white"
                          />
                        </LinearGradient>
                      </View>
                      <Text variant="titleMedium" style={styles.cardTitle}>
                        {feature.title}
                      </Text>
                      <Text variant="bodyMedium" style={styles.cardDescription}>
                        {feature.description}
                      </Text>
                    </Card.Content>
                  </LinearGradient>
                </Card>
              </MotiView>
            ))}
          </View>
        </AnimatePresence>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  headerGradient: {
    padding: 24,
    borderRadius: 16,
  },
  headerText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: 28,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  adminInfo: {
    flex: 1,
  },
  adminText: {
    color: "#2E3192",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cityText: {
    color: "#2E3192",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  logoutGradient: {
    padding: 12,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  adminImage: {
    width: "100%",
    height: 200,
    borderRadius: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 16,
    justifyContent: "space-between",
    marginBottom: 100,
  },
  gridItem: {
    width: CARD_WIDTH,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
  },
  cardGradient: {
    borderRadius: 16,
  },
  cardContent: {
    alignItems: "center",
    padding: 16,
    minHeight: 180,
  },
  iconContainer: {
    marginBottom: 12,
    borderRadius: 50,
    overflow: "hidden",
  },
  iconGradient: {
    padding: 16,
    borderRadius: 50,
  },
  cardTitle: {
    marginTop: 8,
    fontWeight: "bold",
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  cardDescription: {
    textAlign: "center",
    marginTop: 8,
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  profileContainer: {
    padding: 16,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2E3192",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  infoContainer: {
    flex: 1,
    gap: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
  },
  infoHighlight: {
    color: "#2E3192",
    fontWeight: "bold",
  },
  logoutButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#FF416C",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
