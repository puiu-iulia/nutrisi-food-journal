import {
    View,
    Text,
    ListRenderItem,
    StyleSheet,
    SectionList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/provider/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import BottomGrocerySheet from '@/components/BottomGrocerySheet';

export default function TabOneScreen() {
    const [listItems, setListItems] = useState<any[]>([]);
    //const { user } = useAuth();
    // Define list categories
    const [groceryOptions, setGroceryOptions] = useState<any[]>([
        'Banana',
        'Apple',
        'Oats',
        'Milk',
        'Eggs',
        'Bread',
        'Butter',
    ]);

    useEffect(() => {
        const fetchData = async () => {
            // Load categories from Supabase
            let { data: categories } = await supabase
                .from('categories')
                .select('id, category');
            // Load products from Supabase
            const { data: products } = await supabase
                .from('products')
                .select()
                .eq('historic', false);
            const { data: historic } = await supabase
                .from('products')
                .select()
                .eq('historic', true);

            // Load previously used products from Supabase and set recommendations
            if (historic) {
                // remove duplicate names
                const combinedHistoric = [
                    ...historic.map((item: any) => item.name),
                    ...groceryOptions,
                ];
                const uniqueHistoric = [...new Set(combinedHistoric)];
                setGroceryOptions(uniqueHistoric);
            }

            // Group products by category
            if (products) {
                const grouped: any = categories
                    ?.map((category: any) => {
                        const items = products.filter(
                            (product: any) =>
                                product.category === category.id,
                        );
                        return { ...category, data: items };
                    })
                    // Filter out categories with no items
                    .filter(
                        (category: any) => category.data.length > 0,
                    );

                setListItems(grouped);
            }
        };
        fetchData();
    }, []);

    // Add item to shopping list
    const onAddItem = async (name: string, categoryId: number) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        const result = await supabase
            .from('products')
            .insert([
                { name, category: categoryId, user_id: user?.id },
            ])
            .select();
        console.log('on add item', result);
        // Add item to state
        if (result.data) {
            const category = listItems.find(
                (category) => category.id === categoryId,
            );
            if (category) {
                category.data.push(result.data[0]);
                setListItems((prev) => [...prev]);
            }
        }
    };

    // Shopping List Item Row
    const renderGroceryRow: ListRenderItem<any> = ({ item }) => {
        const onSelect = async (grocery: any) => {
            // Remove item by setting historic to true
            await supabase
                .from('products')
                .update({ historic: true })
                .eq('id', grocery.id);

            // Remove item from state
            const category = listItems.find(
                (category) => category.id === grocery.category,
            );
            if (category) {
                category.data = category.data.filter(
                    (item: any) => item.id !== grocery.id,
                );
                setListItems((prev) => [...prev]);
            }
        };

        return (
            <TouchableOpacity
                onPress={() => onSelect(item)}
                style={[
                    styles.groceryRow,
                    { backgroundColor: '#fff' },
                ]}
            >
                <Text style={styles.groceryName}>{item.name}</Text>
                <Ionicons
                    name="square-outline"
                    size={24}
                    color="black"
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {listItems.length > 0 && (
                <SectionList
                    contentContainerStyle={{ paddingBottom: 150 }}
                    sections={listItems}
                    stickySectionHeadersEnabled={false}
                    renderItem={renderGroceryRow}
                    renderSectionHeader={({
                        section: { category },
                    }) => (
                        <Text style={styles.sectionHeader}>
                            {category}
                        </Text>
                    )}
                />
            )}

            <BottomGrocerySheet
                listItems={listItems}
                groceryOptions={groceryOptions}
                onItemSelected={(item, categoryId) =>
                    onAddItem(item, categoryId)
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    groceryRow: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        marginHorizontal: 16,
        marginVertical: 4,
        borderRadius: 4,
    },
    groceryName: {
        color: '#000',
        fontSize: 18,
        flex: 1,
    },
    sectionHeader: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginTop: 20,
    },
});
