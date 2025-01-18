import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
}) {
    return (
        <FontAwesome
            size={28}
            style={{ marginBottom: -3 }}
            {...props}
        />
    );
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor:
                            Colors[colorScheme ?? 'light'].tint,
                        // Disable the static render of the header on web
                        // to prevent a hydration error in React Navigation v6.
                        headerShown: useClientOnlyValue(false, true),
                    }}
                >
                    <Tabs.Screen
                        name="index"
                        options={{
                            title: 'Meal Logs',
                            tabBarIcon: ({ color }) => (
                                <TabBarIcon
                                    name="list-alt"
                                    color={color}
                                />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="two"
                        options={{
                            title: 'Profile',
                            tabBarIcon: ({ color }) => (
                                <TabBarIcon
                                    name="user"
                                    color={color}
                                />
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="grocery"
                        options={{
                            title: 'Grocery',
                            tabBarIcon: ({ color }) => (
                                <TabBarIcon
                                    name="shopping-basket"
                                    color={color}
                                />
                            ),
                        }}
                    />
                </Tabs>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}
