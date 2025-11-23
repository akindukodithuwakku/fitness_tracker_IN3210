import { Button } from "@/components/Button";
import { FormInput } from "@/components/FormInput";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "@/store/slices/authSlice";
import { RegisterFormData, registerSchema } from "@/utils/validation";
import { useRouter } from "expo-router";
import { useFormik } from "formik";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Activity } from "react-native-feather";

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const formik = useFormik<RegisterFormData>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      const { confirmPassword, ...registerData } = values;
      const result = await dispatch(registerUser(registerData));
      if (registerUser.fulfilled.match(result)) {
        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => {
              setTimeout(() => {
                router.replace("/(tabs)");
              }, 100);
            },
          },
        ]);
      } else {
        Alert.alert("Registration Failed", result.payload as string);
      }
    },
  });

  // Navigate to login screen
  const handleNavigateToLogin = () => {
    router.push("/(auth)/login");
  };

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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
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
            placeholder="Choose a username"
          />

          <FormInput
            label="Email"
            value={formik.values.email}
            onChangeText={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            error={formik.errors.email}
            touched={formik.touched.email}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Enter your email"
          />

          <FormInput
            label="First Name (Optional)"
            value={formik.values.firstName}
            onChangeText={formik.handleChange("firstName")}
            onBlur={formik.handleBlur("firstName")}
            error={formik.errors.firstName}
            touched={formik.touched.firstName}
            placeholder="Enter your first name"
          />

          <FormInput
            label="Last Name (Optional)"
            value={formik.values.lastName}
            onChangeText={formik.handleChange("lastName")}
            onBlur={formik.handleBlur("lastName")}
            error={formik.errors.lastName}
            touched={formik.touched.lastName}
            placeholder="Enter your last name"
          />

          <FormInput
            label="Password"
            value={formik.values.password}
            onChangeText={formik.handleChange("password")}
            onBlur={formik.handleBlur("password")}
            error={formik.errors.password}
            touched={formik.touched.password}
            secureTextEntry
            placeholder="Create a password"
          />

          <FormInput
            label="Confirm Password"
            value={formik.values.confirmPassword}
            onChangeText={formik.handleChange("confirmPassword")}
            onBlur={formik.handleBlur("confirmPassword")}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
            secureTextEntry
            placeholder="Confirm your password"
          />

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Button
            title="Sign Up"
            onPress={() => formik.handleSubmit()}
            loading={isLoading}
            disabled={!formik.isValid || isLoading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Text style={styles.linkText} onPress={handleNavigateToLogin}>
              Sign In
            </Text>
          </View>
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
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
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
});
