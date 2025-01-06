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
import { Ionicons } from '@expo/vector-icons';

interface IAddMeal {
    mealType: string;
    onAddMeal: () => void;
    logDate: number;
}

export const AddMeal = ({
    mealType,
    onAddMeal,
    logDate,
}: IAddMeal) => {
    const [name, setName] = useState('');
    const [isGutHealthy, setIsGutHealthy] = useState(false);

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
            log_date: new Date(logDate).toISOString(),
            name: name,
            is_gut_healthy: isGutHealthy,
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

    const toggleIsGutHealthy = () => {
        setIsGutHealthy(!isGutHealthy);
    };

    return (
        <View style={{ backgroundColor: '#fff' }}>
            <Pressable
                style={styles.addMealButton}
                onPress={() => {
                    handlePresentTaskModalPress();
                }}
            >
                <MaterialIcons name="add" size={20} color="#486864" />
                <Text style={styles.addMealButtonText}>Add </Text>
            </Pressable>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                onDismiss={onDismiss}
            >
                <BottomSheetView style={styles.bottomSheetView}>
                    {/* <Text style={styles.darkText}>
                        Add a New Meal
                    </Text> */}
                    <BottomSheetTextInput
                        placeholder="Food Name"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                    <View style={styles.spacedRow}>
                        <View style={styles.row}>
                            <Pressable onPress={toggleIsGutHealthy}>
                                <Ionicons
                                    name={
                                        isGutHealthy
                                            ? 'checkbox-outline'
                                            : 'square-outline'
                                    }
                                    size={24}
                                    color={'#486864'}
                                />
                            </Pressable>
                            <Text style={styles.darkText}>
                                {'Is Gut Healthy'}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Pressable onPress={toggleIsGutHealthy}>
                                <Ionicons
                                    name={
                                        !isGutHealthy
                                            ? 'checkbox-outline'
                                            : 'square-outline'
                                    }
                                    size={24}
                                    color={'#486864'}
                                />
                            </Pressable>
                            <Text style={styles.darkText}>
                                {"It's Not Gut Healthy"}
                            </Text>
                        </View>
                    </View>
                    <Pressable
                        style={styles.saveButton}
                        onPress={handleSaveMeal}
                    >
                        <Text style={styles.saveButtonText}>
                            Save
                        </Text>
                    </Pressable>
                </BottomSheetView>
            </BottomSheetModal>
        </View>
    );
};
