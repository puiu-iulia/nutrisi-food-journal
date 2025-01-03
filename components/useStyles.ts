import { StyleSheet, Platform, Dimensions } from 'react-native';
import colors from '@/constants/Colors';

export const useStyles = () =>
    StyleSheet.create({
        mainView: {
            paddingVertical: 16,
            backgroundColor: colors.light.background,
        },
        calendarView: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 20,
            marginTop: 8,
            paddingHorizontal: 8,
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        dayView: {
            backgroundColor: colors.light.background,
            height: 50,
            width: 50,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
        },
        selectedDayView: {
            backgroundColor: colors.light.tint,
            height: 50,
            width: 50,
            justifyContent: 'center',
            borderRadius: 25,
            alignItems: 'center',
        },
        dayText: {
            color: colors.light.text,
            fontSize: 13,
        },
        dayTextSelected: {
            color: colors.light.text,
            fontSize: 13,
            textAlign: 'center',
        },
        dateText: {
            color: colors.light.text,
            fontSize: 20,
            fontWeight: '800',
            textAlign: 'center',
        },
        monthText: {
            color: colors.light.text,
            fontSize: 13,
            textAlign: 'center',
        },
        addButton: {
            backgroundColor: colors.light.tint,
            padding: 10,
            borderRadius: 5,
        },
        input: {
            borderWidth: 1,
            borderColor: colors.light.text,
            borderRadius: 5,
            padding: 10,
        },
        bottomSheetView: {
            padding: 16,
        },
        addMealButton: {
            height: 40,
            //flex: 1,
            paddingHorizontal: 16,
            borderRadius: 16,
            flexDirection: 'row',
            backgroundColor: '#dae1e0',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
        },
        addMealButtonText: {
            fontSize: 16,
            fontWeight: '600',
            color: '#486864',
            textAlign: 'center',
        },
    });
