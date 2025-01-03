import moment from 'moment';
import { useEffect, useState } from 'react';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface IWeeklyCalendar {
    day: string;
    date: number;
    isSelected: boolean;
}

export const useWeeklyCalendar = (
    onDateChange: (date: number) => void,
) => {
    const [selectedDate, setSelectedDate] = useState(
        moment().startOf('day').valueOf(),
    );
    const [weeklyCalendar, setWeeklyCalendar] = useState(
        <IWeeklyCalendar[]>[],
    );

    const onDatePress = (date: number) => {
        setSelectedDate(date);
    };

    const updateWeeklyCalendar = () => {
        // Get the current day of the week
        const currentDay = moment().format('ddd');
        const currentIndex = daysOfWeek.indexOf(currentDay);

        // Rotate the daysOfWeek array to start from the current day of the week
        const rotatedDaysOfWeek = [
            ...daysOfWeek.slice(currentIndex),
            ...daysOfWeek.slice(0, currentIndex),
        ];

        const updatedWeeklyCalendar = rotatedDaysOfWeek.map(
            (day, index) => {
                const date = moment()
                    .startOf('day')
                    .add(index, 'days')
                    .valueOf();
                return {
                    day: day,
                    date: date,
                    isSelected: date === selectedDate,
                };
            },
        );

        setWeeklyCalendar(updatedWeeklyCalendar);
    };

    useEffect(() => {
        updateWeeklyCalendar();
        onDateChange(selectedDate);
    }, [selectedDate]);

    return {
        weeklyCalendar,
        selectedDate,
        onDatePress,
    };
};
