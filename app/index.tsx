import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Button,
    Alert,
} from 'react-native';
import React, { useState } from 'react';

import { supabase } from '@/utils/supabase';

function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Sign in with email and password
    const onSignInPress = async () => {
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    };

    // Create a new user
    const onSignUpPress = async () => {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        if (!session)
            Alert.alert(
                'Please check your inbox for email verification!',
            );

        setLoading(false);
    };

    const signInAnonymously = async () => {
        const { data, error } =
            await supabase.auth.signInAnonymously();
        if (error) Alert.alert(error.message);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Nutrisi</Text>
            <TextInput
                autoCapitalize="none"
                placeholder="john@doe.com"
                value={email}
                onChangeText={setEmail}
                style={styles.inputField}
            />
            <TextInput
                placeholder="password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.inputField}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={onSignInPress}
            >
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <Button
                onPress={onSignUpPress}
                title="Create Account"
                color={'#64867e'}
            />
            <Button
                onPress={signInAnonymously}
                title="Skip >>"
                color={'#64867e'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d2e4e1',
        alignItems: 'center',
        paddingTop: 100,
    },
    header: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#000',
        paddingVertical: 48,
    },
    inputField: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        margin: 10,
    },
    button: {
        marginVertical: 15,
        alignItems: 'center',
        backgroundColor: '#64867e',
        padding: 12,
        borderRadius: 4,
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
    },
});

export default Auth;
