import React, { useState, useRef, useEffect } from 'react';
import { TextInput, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

const biometricLabel = Platform.OS === 'ios' ? 'Face ID' : 'Fingerprint';

export default function LoginScreen() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<TextInput>(null);
    const shakeAnim = useRef(new Animated.Value(0)).current;

    const storedPin = useAuthStore((s) => s.pin);
    const faceIdEnabled = useAuthStore((s) => s.faceIdEnabled);

    // Auto-prompt biometric on mount
    useEffect(() => {
        if (faceIdEnabled) {
            attemptBiometric();
        } else {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, []);

    const attemptBiometric = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (hasHardware && isEnrolled) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: `Unlock with ${biometricLabel}`,
                    fallbackLabel: 'Use PIN',
                });

                if (result.success) {
                    useAuthStore.getState().setAuthenticated(true);
                    router.replace('/home');
                    return;
                }
            }
        } catch {
            // Fall through to PIN entry
        }
        setTimeout(() => inputRef.current?.focus(), 300);
    };

    const handlePinChange = (text: string) => {
        const digits = text.replace(/[^0-9]/g, '').slice(0, 4);
        setPin(digits);
        setError('');

        if (digits.length === 4) {
            if (digits === storedPin) {
                useAuthStore.getState().setAuthenticated(true);
                router.replace('/home');
            } else {
                setError('Incorrect PIN. Please try again.');
                setTimeout(() => setPin(''), 300);
            }
        }
    };

    const handleContinue = () => {
        if (pin.length < 4) {
            setError('Please enter your 4-digit PIN');
            return;
        }
        if (pin === storedPin) {
            useAuthStore.getState().setAuthenticated(true);
            router.replace('/home');
        } else {
            setError('Incorrect PIN. Please try again.');
            setTimeout(() => setPin(''), 300);
        }
    };

    return (
        <Box className="flex-1 bg-[#3B1578]">
            {/* Content */}
            <Box className="flex-1">
                <Box className="pt-safe" />

                {/* Title */}
                <Box className="items-center mt-20 mb-8 px-5">
                    <Heading className="text-center text-primary-0 text-[32px] font-bold leading-[40px]">
                        Welcome to{'\n'}Finance Digest
                    </Heading>
                </Box>

                {/* Subtitle */}
                <Text className="text-center text-lg font-normal text-primary-0 mb-8 leading-[27px]">
                    Enter your passcode
                </Text>

                {/* PIN Dots */}
                <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                    <HStack className="justify-center items-center mb-4 gap-2">
                        {[0, 1, 2, 3].map((i) => (
                            <Box
                                key={i}
                                className={`items-center justify-center w-[60.25px] h-[40px] rounded-lg border border-[#D3D3D3] px-3 ${i < pin.length ? 'bg-white/20' : 'bg-transparent'}`}
                            >
                                <Text className="text-primary-0 text-2xl font-semibold">
                                    {i < pin.length ? '•' : '-'}
                                </Text>
                            </Box>
                        ))}
                    </HStack>
                </Animated.View>

                {/* Error Message */}
                {error ? (
                    <Text className="text-center mt-4 px-5 text-[#FF6B6B] text-sm"
                    >
                        {error}
                    </Text>
                ) : null}

                {/* Spacer */}
                <Box className="flex-1" />

                {/* Continue Button */}
                <Box className="px-5 pb-safe mb-4">
                    <Button
                        size="lg"
                        className="bg-secondary-500 rounded-3xl w-full h-14 justify-center items-center"
                        onPress={handleContinue}
                    >
                        <ButtonText className="text-typography-800 text-lg font-semibold">
                            Continue
                        </ButtonText>
                    </Button>

                    {/* Biometric retry link */}
                    {faceIdEnabled && (
                        <Button
                            variant="link"
                            className="mt-4 self-center"
                            onPress={attemptBiometric}
                        >
                            <ButtonText className="text-primary-0/70 text-sm">
                                Use {biometricLabel} instead
                            </ButtonText>
                        </Button>
                    )}
                </Box>

                {/* Hidden input for native number pad */}
                <TextInput
                    ref={inputRef}
                    value={pin}
                    onChangeText={handlePinChange}
                    keyboardType="number-pad"
                    maxLength={4}
                    caretHidden
                    className="absolute opacity-0 h-px w-px"
                />
            </Box>
        </Box>
    );
}
