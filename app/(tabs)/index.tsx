import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import DailyLogs from '@/components/DailyLogs';
import { WeeklyCalendar } from '@/components/WeeklyCalendar';

export default function TabOneScreen() {
    return (
        <View style={styles.container}>
            <WeeklyCalendar onDateChange={() => {}} />
            <DailyLogs />
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
