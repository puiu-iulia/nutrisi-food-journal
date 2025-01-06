import { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import moment from 'moment';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import DailyLogs from '@/components/DailyLogs';
import { WeeklyCalendar } from '@/components/WeeklyCalendar';
import { supabase } from '@/utils/supabase';
import { DailyLog } from '@/utils/types';

export default function TabOneScreen() {
    const [selectedDate, setSelectedDate] = useState(
        moment().startOf('day').valueOf(),
    );
    const [mealData, setMealData] = useState<DailyLog[]>([]);

    const fetchMealData = async (date: any) => {
        const startOfDay = moment(date).startOf('day').toISOString();
        const endOfDay = moment(date).endOf('day').toISOString();
        const { data, error } = await supabase
            .from('daily_logs')
            .select('*')
            .gte('log_date', startOfDay)
            .lt('log_date', endOfDay);

        //console.log(data);
        if (error) {
            console.error('Error fetching meals:', error);
        } else {
            setMealData(data);
        }
    };

    useEffect(() => {
        const date = new Date();
        fetchMealData(date);
    }, []);

    console.log(selectedDate);

    return (
        <View style={styles.container}>
            <WeeklyCalendar
                onDateChange={(date) => {
                    fetchMealData(new Date(date));
                    //@ts-ignore
                    setSelectedDate(new Date(date));
                    console.log('date', date, new Date(date));
                }}
            />
            <DailyLogs
                mealData={mealData}
                logDate={selectedDate}
                onAddMeal={() => fetchMealData(selectedDate)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
