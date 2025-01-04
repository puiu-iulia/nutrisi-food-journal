import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    SectionList,
    TouchableOpacity,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { AddMeal } from '@/components/AddMeal';
import { supabase } from '@/utils/supabase';
import { DailyLog } from '@/utils/types';
import { Pressable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

type MealSection = {
    title: string;
    data: DailyLog[];
};

interface IDailyLogs {
    mealData: DailyLog[];
    onAddMeal: () => void;
}

export default function DailyLogs({
    mealData,
    onAddMeal,
}: IDailyLogs) {
    const [filteredMealData, setFilteredMealData] = useState<
        MealSection[]
    >([]);

    useEffect(() => {
        filterMealData();
    }, [mealData]);

    const filterMealData = async () => {
        // Transform the data into sections
        const sections: any = mealTypes.map((mealType) => {
            const mealItems =
                mealData
                    ?.filter((meal) => meal.meal_type === mealType)
                    .map((meal) => ({
                        id: meal.id,
                        name: meal.name,
                        is_gut_healthy: meal.is_gut_healthy,
                    })) || [];

            return {
                title: mealType,
                data: mealItems,
            };
        });
        setFilteredMealData(sections);
    };

    const updateDailyLog = async (
        id: string,
        isGutHealthy: boolean,
    ) => {
        const { data, error } = await supabase
            .from('daily_logs')
            .update({ is_gut_healthy: isGutHealthy })
            .eq('id', id);

        if (error) {
            console.error('Error updating daily log:', error);
        } else {
            onAddMeal(); // Refresh the data
        }
    };

    const renderSectionHeader = ({
        section,
    }: {
        section: MealSection;
    }) => (
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <AddMeal
                mealType={section.title}
                onAddMeal={() => onAddMeal()}
            />
        </View>
    );

    const renderItem = ({ item }: { item: DailyLog }) => (
        <View style={styles.mealItem}>
            <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{item.name}</Text>
                <Pressable
                    style={{ width: 40, height: 40 }}
                    onPress={() =>
                        updateDailyLog(item.id, !item.is_gut_healthy)
                    }
                >
                    <Ionicons
                        name={
                            item.is_gut_healthy
                                ? 'happy'
                                : 'sad-outline'
                        }
                        size={24}
                        color={'#486864'}
                    />
                </Pressable>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <SectionList
                sections={filteredMealData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                stickySectionHeadersEnabled={false}
                style={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        backgroundColor: 'white',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    calories: {
        fontSize: 14,
        color: '#666',
    },
    mealItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 24,
        paddingVertical: 8,
    },
    icon: {
        fontSize: 24,
        marginRight: 16,
    },
    mealCalories: {
        fontSize: 14,
        color: '#666',
    },
    addButton: {
        padding: 16,
        backgroundColor: '#007bff',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    mealInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    mealName: {
        fontSize: 15,
    },
});
