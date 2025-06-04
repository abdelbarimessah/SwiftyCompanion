import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable } from 'react-native';

import { FocusAwareStatusBar, SafeAreaView, Text, View } from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';

type OnboardingScreenProps = {
  image: any;
  title: string;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
};

function OnboardingScreen({
  image,
  title,
  step,
  totalSteps,
  onNext,
  onSkip,
}: OnboardingScreenProps) {
  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1">
        <View className="items-end px-8 py-10">
          <Text className="text-base font-normal text-black" onPress={onSkip}>
            Skip
          </Text>
        </View>
        <View className="items-center px-10 py-5">
          <Image
            source={image}
            style={{ width: 310, height: 318 }}
            className="shadow-2xl"
          />
        </View>

        <View className="mt-10 items-center px-1">
          <Text className="text-center text-3xl font-normal leading-tight text-black">
            {title}
          </Text>
        </View>

        <Pressable className="mt-10 items-center" onPress={onNext}>
          <View className="rounded-full bg-black px-16 py-2">
            <Text className="text-2xl font-medium text-white">Next</Text>
          </View>
        </Pressable>
        <View className="mt-6 flex-row items-center justify-center">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              className={`mr-2 h-[5px] rounded-full ${
                index === step - 1 ? 'w-[30px] bg-black' : 'w-[5px] bg-black/50'
              }`}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function Onboarding() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last screen, proceed to login
      setIsFirstTime(false);
      router.replace('/login');
    }
  };

  const handleSkip = () => {
    setIsFirstTime(false);
    router.replace('/login');
  };

  // Screen content based on current step
  const screenContent = {
    1: {
      image: require('../../assets/images/onboarding/onboarding-image-1.png'),
      title: 'Our reputation\nis as solid as\nconcrete.',
    },
    2: {
      image: require('../../assets/images/onboarding/onboarding-image-2.png'),
      title: 'Discover your\nperfect home\nwith us.',
    },
    3: {
      image: require('../../assets/images/onboarding/onboarding-image-3.png'),
      title: 'Your dream home\nis just a tap\naway.',
    },
  };

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <OnboardingScreen
        image={screenContent[currentStep as keyof typeof screenContent].image}
        title={screenContent[currentStep as keyof typeof screenContent].title}
        step={currentStep}
        totalSteps={3}
        onNext={handleNext}
        onSkip={handleSkip}
      />
    </View>
  );
}
