export default {
  expo: {
    orientation: "portrait",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash_icon.jpg",
      resizeMode: "contain",
      backgroundColor: "#FFFFFF"
    },
    extra: {
      eas: {
        projectId: "65984631-3435-4066-a48f-6cd4dbdc2bd5"
      },
      router: {
        origin: false
      }
    },
    owner: "gokul1734",
    runtimeVersion: {
      policy: "appVersion"
    },
    updates: {
      url: "https://u.expo.dev/65984631-3435-4066-a48f-6cd4dbdc2bd5"
    },
    android: {
      package: "com.gokul1734.NatiCoco"
    },
    ios: {
      bundleIdentifier: "com.gokul1734.NatiCoco"
    },
    scheme: "naticoco"
  }
};
