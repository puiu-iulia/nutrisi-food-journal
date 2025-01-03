import React, { useState, useRef, useCallback } from 'react';
import { Pressable } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetBackdrop,
    BottomSheetView,
    BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text } from '@/components/Themed';
import { supabase } from '@/utils/supabase';
import { useStyles } from '@/components/useStyles';
import { Food } from '@/utils/types';

interface IAddMeal {
    mealType: string;
    onAddMeal: () => void;
}

export const AddMeal = ({ mealType, onAddMeal }: IAddMeal) => {
    const [name, setName] = useState('');

    const styles = useStyles();

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = ['50%'];

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                pressBehavior="close"
            />
        ),
        [],
    );

    const onDismiss = () => {
        bottomSheetModalRef.current?.dismiss();
    };

    const handlePresentTaskModalPress = () => {
        bottomSheetModalRef.current?.present();
    };

    const handleSaveMeal = async () => {
        if (!name.trim()) return;

        const {
            data: { user },
        } = await supabase.auth.getUser();

        const newDailyLog = {
            log_date: new Date().toISOString(),
            name: name,
            is_gut_healthy: false,
            meal_type: mealType,
            user_id: user?.id,
        };

        const { data: dailyLogData, error: dailyLogError } =
            await supabase.from('daily_logs').insert(newDailyLog);

        if (dailyLogError) {
            console.error('Error saving daily log:', dailyLogError);
        } else {
            console.log(
                'Daily log saved successfully:',
                dailyLogData,
            );
        }
        setName('');
        onDismiss();
        onAddMeal();
    };

    return (
        <View>
            <Pressable
                style={styles.addMealButton}
                onPress={() => {
                    handlePresentTaskModalPress();
                }}
            >
                <MaterialIcons name="add" size={20} color="#486864" />
                <Text style={styles.addMealButtonText}>New Meal</Text>
            </Pressable>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                onDismiss={onDismiss}
            >
                <BottomSheetView style={styles.bottomSheetView}>
                    <Text>Add a New Meal</Text>
                    <BottomSheetTextInput
                        placeholder="Food Name"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                    <Pressable
                        style={styles.addButton}
                        onPress={handleSaveMeal}
                    >
                        <Text>Save Meal</Text>
                    </Pressable>
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
};
