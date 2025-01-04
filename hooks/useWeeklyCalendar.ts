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

    console.log('selected weekly calendar', selectedDate);

    const onDatePress = (date: number) => {
        setSelectedDate(date);
    };

    const updateWeeklyCalendar = () => {
        // Get the start of the current week (Monday)
        const startOfWeek = moment()
            .startOf('isoWeek')
            .startOf('day');

        const updatedWeeklyCalendar = daysOfWeek.map((day, index) => {
            const date = startOfWeek
                .clone()
                .add(index, 'days')
                .startOf('day')
                .valueOf();
            return {
                day: day,
                date: date,
                isSelected: date === selectedDate,
            };
        });

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
