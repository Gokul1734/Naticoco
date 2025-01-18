import { View, StyleSheet, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const quotes = [
  "Fresh chicken, fresh happiness!",
  "Quality meat for quality moments",
  "Your taste, our passion",
  "Bringing freshness to your doorstep",
  "Where quality meets convenience",
];

const WelcomeIcon = ({ name, delay, size = 40 }) => (
  <MotiView
    from={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      type: "spring",
      delay,
      duration: 1000,
      scale: {
        type: "spring",
        delay,
        duration: 1000,
      },
    }}
  >
    <Ionicons name={name} size={size} color="#F8931F" />
  </MotiView>
);

export default function Welcome({ route }) {
  const navigation = useNavigation();
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);
  const [name, setName] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Location");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const fetchName = async () => {
    try {
      const loginData = await AsyncStorage.getItem("logincre"); // Fetch data from AsyncStorage

      if (loginData) {
        const parsedData = JSON.parse(loginData); // Parse the JSON string

        const name = parsedData.token.name || "Guest"; // Fetch the name or fallback to 'Guest'
        setName(name); // Assuming setName is a state setter function
      }
    } catch (error) {
      console.error("Error fetching login data:", error);
    }
  };

  // Call the function
  fetchName();

  return (
    <LinearGradient colors={["#fff", "#fff5e6"]} style={styles.container}>
      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: "timing",
            duration: 1000,
          }}
          style={styles.header}
        >
          <Text variant="displaySmall" style={styles.welcomeText}>
            Welcome
          </Text>
          <Text variant="headlineMedium" style={styles.nameText}>
            {name}
          </Text>
        </MotiView>

        <View style={styles.iconContainer}>
          <WelcomeIcon name="restaurant" delay={300} />
          <WelcomeIcon name="timer" delay={500} />
          <WelcomeIcon name="bicycle" delay={700} />
          <WelcomeIcon name="star" delay={900} />
        </View>

        <MotiView
          from={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            delay: 1000,
            duration: 1000,
          }}
          style={styles.quoteContainer}
        >
          <Text variant="titleMedium" style={styles.quote}>
            "{quote}"
          </Text>
        </MotiView>

        <View style={styles.loadingContainer}>
          <MotiView
            from={{ width: 0 }}
            animate={{ width: SCREEN_WIDTH * 0.8 }}
            transition={{
              type: "timing",
              duration: 2000,
            }}
            style={[styles.loadingBar, { backgroundColor: "#F8931F" }]}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 50,
  },
  welcomeText: {
    color: "#F8931F",
    fontWeight: "bold",
    marginBottom: 8,
  },
  nameText: {
    color: "#666",
    fontWeight: "500",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 50,
  },
  quoteContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 50,
  },
  quote: {
    color: "#F8931F",
    textAlign: "center",
    fontStyle: "italic",
  },
  loadingContainer: {
    width: SCREEN_WIDTH * 0.8,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingBar: {
    height: "100%",
    borderRadius: 2,
  },
});
