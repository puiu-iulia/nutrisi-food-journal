import {
    View,
    Text,
    ListRenderItem,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import React, { useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, {
    BottomSheetTextInput,
    BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import { supabase } from '@/utils/supabase';
export type Ref = BottomSheet;

interface Props {
    listItems: any[];
    groceryOptions: any[];
    onItemSelected: (item: string, categoryId: number) => void;
}

const BottomGrocerySheet = (props: Props) => {
    const snapPoints = useMemo(() => ['14%', '75%'], []);
    const [item, setItem] = useState('');
    const bottomSheetRef = useRef<BottomSheet>(null);

    const renderRecommendationRow: ListRenderItem<any> = ({
        item,
    }) => {
        const onAddItem = async (grocery: any) => {
            bottomSheetRef.current?.collapse();

            // Get embedding for the grocery item
            const { data } = await supabase.functions.invoke(
                'getEmbedding',
                {
                    body: { input: grocery },
                },
            );
            // Match the embedding to a category
            const { data: documents } = await supabase.rpc(
                'match_category',
                {
                    query_embedding: data.embedding,
                    match_threshold: 0.8,
                    match_count: 1,
                },
            );

            console.log('match category', documents);

            // Add item to shopping list
            props.onItemSelected(item, documents[0].id);
            setItem('');
        };

        return (
            <TouchableOpacity
                onPress={() => onAddItem(item)}
                style={styles.groceryRow}
            >
                <Text
                    style={{ color: '#000', fontSize: 18, flex: 1 }}
                >
                    {item}
                </Text>
                <Ionicons name="add" size={24} color="black" />
            </TouchableOpacity>
        );
    };

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            handleIndicatorStyle={{ backgroundColor: '#fff' }}
            backgroundStyle={{ backgroundColor: '#486864' }}
        >
            <View style={styles.searchRow}>
                <BottomSheetTextInput
                    style={styles.inputField}
                    placeholder="I need..."
                    placeholderTextColor={'#666'}
                    onChangeText={setItem}
                    value={item}
                />
            </View>
            <BottomSheetFlatList
                data={
                    item !== ''
                        ? [item, ...props.groceryOptions]
                        : props.groceryOptions
                }
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderRecommendationRow}
                contentContainerStyle={styles.groceryContainer}
            />
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 10,
    },
    inputField: {
        flex: 1,
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderColor: '#2b825b',
        borderRadius: 4,
        padding: 10,
        color: '#000',
        backgroundColor: '#fff',
        marginBottom: 40,
    },
    groceryContainer: {
        paddingBottom: 20,
    },
    groceryRow: {
        flexDirection: 'row',
        backgroundColor: '#dae1e0',
        padding: 10,
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 4,
    },
});

export default BottomGrocerySheet;
