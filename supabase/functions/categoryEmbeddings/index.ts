import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { env, pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

// Configuration for Deno runtime
env.useBrowserCache = false;
env.allowLocalModels = false;

const categories = [
  'Drink',
  'Vegetables',
  'Fruits',
  'Legumes',
  'Whole Grains',
  'Fermented Foods',
  'Herbs and Spices',
  'Nuts and Seeds',
  'Meat',
  'Fish',
  'Dairy',
  'Bread & Bakery',
  'Pasta, Rice & Cereal',
  'Baking',
  'Canned',
  'Frozen',
  'Sweets',
  'Deli',
  'Household',
  'Personal Care',
  'Pet Care',
];

const generateEmbedding = await pipeline('feature-extraction', 'Supabase/gte-small');

// Create our initial category embeddings
serve(async () => {
  try {
    await Promise.all(
      categories.map(async (category) => {
        const output = await generateEmbedding(category, {
          pooling: 'mean',
          normalize: true,
        });
        const embedding = Array.from(output.data);
        const { error } = await supabase.from('categories').insert({
          category,
          embedding,
        });
        if (error) {
          console.error(`Error inserting category ${category}:`, error);
        }
      })
    );

    // Return success response
    return new Response(JSON.stringify({ done: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error in processing:', err);
    return new Response(JSON.stringify({ error: 'Failed to process categories' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});