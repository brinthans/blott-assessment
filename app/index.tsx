import React, { useState } from 'react';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
    FormControlError,
    FormControlErrorText,
} from '@/components/ui/form-control';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { KeyboardAvoidingView } from '@/components/ui/keyboard-avoiding-view';
import { ScrollView } from '@/components/ui/scroll-view';
import { useUserStore } from '@/store/useUserStore';

type FormErrors = {
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};

export default function SignupScreen() {

    const [fullName, setFullName] = useState('Brinthan');
    const [email, setEmail] = useState('brinthsega@gmail.com');
    const [password, setPassword] = useState('12345678');
    const [confirmPassword, setConfirmPassword] = useState('12345678');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        if (!fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const router = useRouter();

    const handleSignUp = () => {
        if (!validate()) return;
        useUserStore.getState().setUser(fullName.trim(), email.trim());
        router.push('/setup-pin');
    };

    return (
        <Box className="flex-1 bg-background-0">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Top safe area spacing */}
                <Box className="pt-safe" />

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Title & Subtitle */}
                    <Box className="px-5 mb-6">
                        <Heading className="text-2xl font-normal text-typography-900 text-left mb-2">
                            Introduce yourself
                        </Heading>
                        <Text className="text-base text-typography-600 text-left">
                            We need to know a bit about you to get you up and running.
                        </Text>
                    </Box>

                    {/* Form */}
                    <VStack space="lg" className="px-5">
                        {/* Full Name */}
                        <FormControl isRequired isInvalid={!!errors.fullName}>
                            <FormControlLabel>
                                <FormControlLabelText>Full Name</FormControlLabelText>
                            </FormControlLabel>
                            <Input variant="outline" size="md">
                                <InputField
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChangeText={(text) => {
                                        setFullName(text);
                                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                                    }}
                                    autoCapitalize="words"
                                />
                            </Input>
                            {errors.fullName && (
                                <FormControlError>
                                    <FormControlErrorText>{errors.fullName}</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        {/* Email */}
                        <FormControl isRequired isInvalid={!!errors.email}>
                            <FormControlLabel>
                                <FormControlLabelText>Email</FormControlLabelText>
                            </FormControlLabel>
                            <Input variant="outline" size="md">
                                <InputField
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                                    }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </Input>
                            {errors.email && (
                                <FormControlError>
                                    <FormControlErrorText>{errors.email}</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>

                        {/* Password */}
                        <FormControl isRequired isInvalid={!!errors.password}>
                            <FormControlLabel>
                                <FormControlLabelText>Password</FormControlLabelText>
                            </FormControlLabel>
                            <Input variant="outline" size="md">
                                <InputField
                                    placeholder="Enter your Password"
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                                    }}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <InputSlot
                                    className="pr-3"
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <InputIcon
                                        as={showPassword ? EyeIcon : EyeOffIcon}
                                        className="text-typography-500"
                                    />
                                </InputSlot>
                            </Input>
                            {errors.password ? (
                                <FormControlError>
                                    <FormControlErrorText>{errors.password}</FormControlErrorText>
                                </FormControlError>
                            ) : (
                                <FormControlHelper>
                                    <FormControlHelperText size="sm">
                                        Must be at least 8 characters.
                                    </FormControlHelperText>
                                </FormControlHelper>
                            )}
                        </FormControl>

                        {/* Confirm Password */}
                        <FormControl isRequired isInvalid={!!errors.confirmPassword}>
                            <FormControlLabel>
                                <FormControlLabelText>Confirm Password</FormControlLabelText>
                            </FormControlLabel>
                            <Input variant="outline" size="md">
                                <InputField
                                    placeholder="Confirm your Password"
                                    value={confirmPassword}
                                    onChangeText={(text) => {
                                        setConfirmPassword(text);
                                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                                    }}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <InputSlot
                                    className="pr-3"
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <InputIcon
                                        as={showConfirmPassword ? EyeIcon : EyeOffIcon}
                                        className="text-typography-500"
                                    />
                                </InputSlot>
                            </Input>
                            {errors.confirmPassword && (
                                <FormControlError>
                                    <FormControlErrorText>{errors.confirmPassword}</FormControlErrorText>
                                </FormControlError>
                            )}
                        </FormControl>
                    </VStack>

                    {/* Spacer pushes button to bottom */}
                    <Box className="flex-1" />

                    {/* Sign Up Button */}
                    <Box className="px-5 pb-safe mb-4 mt-8">
                        <Button
                            size="lg"
                            className="bg-primary-500 rounded-3xl w-full h-11 px-6 gap-3 shrink-0 justify-center items-center"
                            onPress={handleSignUp}
                        >
                            <ButtonText className="text-typography-white font-semibold text-lg">
                                Sign Up
                            </ButtonText>
                        </Button>
                    </Box>
                </ScrollView>
            </KeyboardAvoidingView>
        </Box>
    );
}
