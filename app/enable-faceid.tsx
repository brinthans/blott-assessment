import React from 'react';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import Svg, { Path } from 'react-native-svg';

function FaceIdIcon() {
    return (
        <Box
            className="w-20 h-20 rounded-[20px] shadow-soft-3 items-center justify-center"
            style={{ backgroundColor: '#EEF0F2', borderWidth: 4, borderColor: '#FFF' }}
        >
            <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.66667 12.0052C4.29867 12.0052 4 11.7065 4 11.3385V8.67187C4 6.09854 6.09333 4.0052 8.66667 4.0052H11.3333C11.7013 4.0052 12 4.30387 12 4.67187C12 5.03987 11.7013 5.33854 11.3333 5.33854H8.66667C6.82933 5.33854 5.33333 6.8332 5.33333 8.67187V11.3385C5.33333 11.7065 5.03467 12.0052 4.66667 12.0052ZM26 12.0052C25.632 12.0052 25.3333 11.7065 25.3333 11.3385V8.67187C25.3333 6.8332 23.8373 5.33854 22 5.33854H19.3333C18.9653 5.33854 18.6667 5.03987 18.6667 4.67187C18.6667 4.30387 18.9653 4.0052 19.3333 4.0052H22C24.5733 4.0052 26.6667 6.09854 26.6667 8.67187V11.3385C26.6667 11.7065 26.368 12.0052 26 12.0052ZM11.3333 14.6719C10.9653 14.6719 10.6667 14.3732 10.6667 14.0052V11.3385C10.6667 10.9705 10.9653 10.6719 11.3333 10.6719C11.7013 10.6719 12 10.9705 12 11.3385V14.0052C12 14.3732 11.7013 14.6719 11.3333 14.6719ZM19.3333 14.6719C18.9653 14.6719 18.6667 14.3732 18.6667 14.0052V11.3385C18.6667 10.9705 18.9653 10.6719 19.3333 10.6719C19.7013 10.6719 20 10.9705 20 11.3385V14.0052C20 14.3732 19.7013 14.6719 19.3333 14.6719ZM14 17.3385C13.632 17.3385 13.3333 17.0399 13.3333 16.6719C13.3333 16.3039 13.632 16.0052 14 16.0052C14.368 16.0052 14.6667 15.7052 14.6667 15.3385V11.3385C14.6667 10.9705 14.9653 10.6719 15.3333 10.6719C15.7013 10.6719 16 10.9705 16 11.3385V15.3385C16 16.4412 15.1027 17.3385 14 17.3385ZM15.3333 21.3385C13.824 21.3385 12.544 20.8239 11.528 19.8105C11.268 19.5492 11.268 19.1279 11.528 18.8665C11.7893 18.6065 12.2107 18.6065 12.472 18.8665C13.2373 19.6332 14.1733 20.0052 15.3333 20.0052C16.4933 20.0052 17.4293 19.6332 18.1947 18.8665C18.456 18.6065 18.8773 18.6065 19.1387 18.8665C19.3987 19.1279 19.3987 19.5492 19.1387 19.8105C18.1227 20.8239 16.8427 21.3385 15.3333 21.3385ZM11.3333 26.6719H8.66667C6.09333 26.6719 4 24.5785 4 22.0052V19.3385C4 18.9705 4.29867 18.6719 4.66667 18.6719C5.03467 18.6719 5.33333 18.9705 5.33333 19.3385V22.0052C5.33333 23.8439 6.82933 25.3385 8.66667 25.3385H11.3333C11.7013 25.3385 12 25.6372 12 26.0052C12 26.3732 11.7013 26.6719 11.3333 26.6719ZM22 26.6719H19.3333C18.9653 26.6719 18.6667 26.3732 18.6667 26.0052C18.6667 25.6372 18.9653 25.3385 19.3333 25.3385H22C23.8373 25.3385 25.3333 23.8439 25.3333 22.0052V19.3385C25.3333 18.9705 25.632 18.6719 26 18.6719C26.368 18.6719 26.6667 18.9705 26.6667 19.3385V22.0052C26.6667 24.5785 24.5733 26.6719 22 26.6719Z"
                    fill="black"
                />
            </Svg>
        </Box>
    );
}

export default function EnableFaceIdScreen() {
    const router = useRouter();

    const handleEnableFaceId = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();

            if (hasHardware && isEnrolled) {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: 'Enable Face ID for Blott',
                    fallbackLabel: 'Use PIN',
                });

                if (result.success) {
                    // Face ID enabled successfully
                    router.replace('/home');
                }
            } else {
                // No biometric hardware or not enrolled
                router.replace('/home');
            }
        } catch {
            router.replace('/home');
        }
    };

    const handleSkip = () => {
        router.replace('/home');
    };

    return (
        <Box className="flex-1 bg-background-0">
            <Box className="pt-safe" />

            {/* Centered content */}
            <Box className="flex-1 justify-center items-center px-5">
                {/* Face ID Icon */}
                <FaceIdIcon />

                {/* Title */}
                <Heading className="text-2xl font-normal text-typography-900 text-center mt-6 mb-2">
                    Login with a Look
                </Heading>

                {/* Subtitle */}
                <Text className="text-base text-typography-600 text-center px-5">
                    Use face ID instead of a password next time you login.
                </Text>
            </Box>

            {/* Buttons */}
            <VStack space="md" className="px-5 pb-safe mb-4">
                <Button
                    size="lg"
                    className="bg-primary-500 rounded-3xl w-full h-11 px-6 gap-3 shrink-0 justify-center items-center"
                    onPress={handleEnableFaceId}
                >
                    <ButtonText className="text-typography-white font-semibold text-lg">
                        Enable Face ID
                    </ButtonText>
                </Button>

                <Button
                    size="lg"
                    variant="outline"
                    className="rounded-3xl w-full h-11 px-6 gap-3 shrink-0 justify-center items-center border-outline-300"
                    onPress={handleSkip}
                >
                    <ButtonText className="text-typography-900 font-semibold text-lg">
                        Not now
                    </ButtonText>
                </Button>
            </VStack>
        </Box>
    );
}
