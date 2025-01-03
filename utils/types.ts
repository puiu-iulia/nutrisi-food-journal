export type Food = {
    id: string;
    name: string;
    gut_healthy: boolean;
    created_at: string;
    created_by: string | undefined | null;
};

export type DailyLog = {
    id: string;
    log_date: string;
    food_id: Food;
    created_at: string;
    user_id: string;
    meal_type: string;
    is_gut_healthy: boolean;
    name: string;
};
