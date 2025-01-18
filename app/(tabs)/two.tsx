import { StyleSheet, Pressable } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { supabase } from '@/utils/supabase';

export default function TabTwoScreen() {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };
    return (
        <View style={styles.container}>
            <Pressable onPress={handleLogout}>
                <Text>Logout</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});
