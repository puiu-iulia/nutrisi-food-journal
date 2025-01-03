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

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

type MealItem = {
    id: string;
    name: string;
    calories: number;
    icon?: string;
};

type MealSection = {
    title: string;
    data: DailyLog[];
};

export default function DailyLogs() {
    const [mealData, setMealData] = useState<MealSection[]>([]);

    useEffect(() => {
        fetchMealData();
    }, []);

    const fetchMealData = async () => {
        const { data, error } = await supabase
            .from('daily_logs')
            .select('*');
        if (error) {
            console.error('Error fetching meals:', error);
            return;
        }
        // Transform the data into sections
        const sections: any = mealTypes.map((mealType) => {
            const mealItems =
                data
                    ?.filter((meal) => meal.meal_type === mealType)
                    .map((meal) => ({
                        id: meal.id,
                        name: meal.name,
                    })) || [];

            return {
                title: mealType,
                data: mealItems,
            };
        });
        setMealData(sections);
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
                onAddMeal={() => fetchMealData()}
            />
        </View>
    );

    const renderItem = ({ item }: { item: DailyLog }) => (
        <View style={styles.mealItem}>
            <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{item.name}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <SectionList
                sections={mealData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                stickySectionHeadersEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
        fontSize: 16,
        fontWeight: '600',
    },
    calories: {
        fontSize: 14,
        color: '#666',
    },
    mealItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 4,
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
    },
    mealName: {
        fontSize: 16,
        fontWeight: '600',
    },
});
