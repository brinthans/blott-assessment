import React, { useState, useRef, useEffect } from 'react';
import { TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Pressable } from '@/components/ui/pressable';
import { Icon } from '@/components/ui/icon';
import { ChevronLeftIcon } from '@/components/ui/icon';

type PinStep = 'enter' | 'confirm';

export default function SetupPinScreen() {
    const router = useRouter();
    const [step, setStep] = useState<PinStep>('enter');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<TextInput>(null);

    const currentPin = step === 'enter' ? pin : confirmPin;
    const setCurrentPin = step === 'enter' ? setPin : setConfirmPin;

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 100);
    }, [step]);

    const handlePinChange = (text: string) => {
        const digits = text.replace(/[^0-9]/g, '').slice(0, 4);
        setCurrentPin(digits);
        setError('');

        if (digits.length === 4) {
            if (step === 'enter') {
                setTimeout(() => {
                    setStep('confirm');
                }, 300);
            } else {
                if (digits === pin) {
                    router.replace('/enable-faceid');
                } else {
                    setError('PINs do not match. Please try again.');
                    setConfirmPin('');
                }
            }
        }
    };

    const handleBack = () => {
        if (step === 'confirm') {
            setStep('enter');
            setPin('');
            setConfirmPin('');
            setError('');
        } else {
            router.back();
        }
    };

    return (
        <Box className="flex-1 bg-background-0">
            {/* Header with back button */}
            <Box className="pt-safe px-4 pb-2">
                <Pressable onPress={handleBack} className="py-3 self-start">
                    <Icon as={ChevronLeftIcon} size="lg" className="text-typography-900" />
                </Pressable>
            </Box>

            {/* Title & Subtitle */}
            <Box className="px-5 mb-6">
                <Heading className="text-2xl font-normal text-typography-900 text-left mb-2">
                    {step === 'enter' ? 'Set a PIN' : 'Confirm your PIN'}
                </Heading>
                <Text className="text-base text-typography-600 text-left">
                    {step === 'enter'
                        ? 'You can use this to log back in securely.'
                        : 'Enter you PIN one more time.'}
                </Text>
            </Box>

            {/* PIN Dots */}
            <Box className="mt-16 items-center">
                <HStack space="xl" className="justify-center items-center">
                    {[0, 1, 2, 3].map((i) => (
                        <Box
                            key={i}
                            className={`w-3.5 h-3.5 rounded-full ${i < currentPin.length
                                ? 'bg-typography-900'
                                : 'bg-typography-300'
                                }`}
                        />
                    ))}
                </HStack>

                {/* Error Message */}
                {error ? (
                    <Text className="text-error-700 text-sm leading-[21px] mt-6 text-center px-5">
                        {error}
                    </Text>
                ) : null}
            </Box>

            {/* Hidden input for native number pad */}
            <TextInput
                ref={inputRef}
                value={currentPin}
                onChangeText={handlePinChange}
                keyboardType="number-pad"
                maxLength={4}
                autoFocus
                caretHidden
                style={{
                    position: 'absolute',
                    opacity: 0,
                    height: 1,
                    width: 1,
                }}
            />
        </Box>
    );
}
