import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useStyles } from '@/components/useStyles';
import { useWeeklyCalendar } from '@/hooks/useWeeklyCalendar';
import moment from 'moment';

interface IWeeklyCalendar {
    onDateChange: (date: number) => void;
}

export const WeeklyCalendar = ({ onDateChange }: IWeeklyCalendar) => {
    const styles = useStyles();

    const { weeklyCalendar, selectedDate, onDatePress } =
        useWeeklyCalendar(onDateChange);

    return (
        <View style={styles.mainView}>
            <View style={styles.calendarView}>
                {weeklyCalendar.map((day, index) => (
                    <View
                        style={
                            day.isSelected
                                ? styles.selectedDayView
                                : styles.dayView
                        }
                        key={index}
                    >
                        <Pressable
                            onPress={() => onDatePress(day.date)}
                        >
                            <Text style={styles.dayText}>
                                {day.day}
                            </Text>
                            <Text style={styles.dateText}>
                                {moment(day.date).format('D')}
                            </Text>
                        </Pressable>
                    </View>
                ))}
            </View>
        </View>
    );
};
