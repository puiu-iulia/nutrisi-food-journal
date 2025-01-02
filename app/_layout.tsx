import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useSegments, useRouter, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';

import { supabase } from '@/utils/supabase';

import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    const [session, setSession] = useState<Session | null>(null);
    const [initialized, setInitialized] = useState<boolean>(false);

    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (!initialized) return;

        // Check if the path/url is in the (auth) group
        const inAuthGroup = segments[0] === '(tabs)';

        if (session && !inAuthGroup) {
            // Redirect authenticated users to the list page
            //@ts-ignore
            router.replace('/(tabs)/');
        } else if (!session) {
            // Redirect unauthenticated users to the login page
            router.replace('/');
        }
    }, [session, initialized]);

    useEffect(() => {
        // Listen for changes to authentication state
        const { data } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log(
                    'supabase.auth.onAuthStateChange',
                    event,
                    session,
                );

                setSession(session);
                setInitialized(true);
            },
        );
        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            <Slot />
        </ThemeProvider>
    );
}
