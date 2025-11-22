import { Button } from "@/components/Button";
import { FormInput } from "@/components/FormInput";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError, loginUser } from "@/store/slices/authSlice";
import { testApiConnection } from "@/utils/apiTest";
import { LoginFormData, loginSchema } from "@/utils/validation";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import { useEffect } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Activity } from "react-native-feather";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const formik = useFormik<LoginFormData>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      console.log('Login: Submitting form...');
      const result = await dispatch(loginUser(values));
      if (loginUser.fulfilled.match(result)) {
        console.log('Login: Success! Navigating to tabs...');
        // Use setTimeout to ensure state is updated before navigation
        setTimeout(() => {
          router.replace("/(tabs)");
        }, 100);
      } else {
        console.error('Login: Failed', result.payload);
        Alert.alert("Login Failed", result.payload as string);
      }
    },
  });

  // Navigate to register screen
  const handleNavigateToRegister = () => {
    router.push("/(auth)/register");
  };

  // Test API connection
  const handleTestConnection = async () => {
    const result = await testApiConnection();
    Alert.alert(
      result.success ? "Connection Test Successful" : "Connection Test Failed",
      result.message
    );
  };

  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Activity width={48} height={48} color="#0a7ea4" />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <FormInput
            label="Username"
            value={formik.values.username}
            onChangeText={formik.handleChange("username")}
            onBlur={formik.handleBlur("username")}
            error={formik.errors.username}
            touched={formik.touched.username}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Enter your username"
          />

          <FormInput
            label="Password"
            value={formik.values.password}
            onChangeText={formik.handleChange("password")}
            onBlur={formik.handleBlur("password")}
            error={formik.errors.password}
            touched={formik.touched.password}
            secureTextEntry
            placeholder="Enter your password"
          />

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Button
            title="Sign In"
            onPress={() => formik.handleSubmit()}
            loading={isLoading}
            disabled={!formik.isValid || isLoading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <Text style={styles.linkText} onPress={handleNavigateToRegister}>
              Sign Up
            </Text>
          </View>

          <View style={styles.demoHint}>
            <Text style={styles.demoHintText}>Demo credentials:</Text>
            <Text style={styles.demoHintText}>Username: emilys</Text>
            <Text style={styles.demoHintText}>Password: emilyspass</Text>
          </View>

          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestConnection}
          >
            <Text style={styles.testButtonText}>Test API Connection</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    width: "100%",
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  linkText: {
    fontSize: 14,
    color: "#0a7ea4",
    fontWeight: "600",
  },
  errorContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  demoHint: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
  },
  demoHintText: {
    fontSize: 12,
    color: "#2e7d32",
    textAlign: "center",
  },
  testButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  testButtonText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
});
