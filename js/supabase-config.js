/**
 * Supabase Client Configuration
 *
 * This file initializes the Supabase client for use throughout the application.
 * Replace the placeholder values with your actual Supabase project credentials.
 */

// Supabase configuration
// IMPORTANT: Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client
// The client is available globally as window.supabaseClient
let supabaseClient = null;

/**
 * Initialize the Supabase client
 * @returns {Object|null} The Supabase client or null if initialization fails
 */
function initSupabase() {
    // Check if Supabase library is loaded
    if (typeof supabase === 'undefined' || !supabase.createClient) {
        console.warn('Supabase library not loaded. Form will work in fallback mode.');
        return null;
    }

    // Check if credentials are configured
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
        console.warn('Supabase credentials not configured. Form will work in fallback mode.');
        return null;
    }

    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase client initialized successfully');
        return supabaseClient;
    } catch (error) {
        console.error('Failed to initialize Supabase client:', error);
        return null;
    }
}

/**
 * Get the Supabase client instance
 * @returns {Object|null} The Supabase client or null if not initialized
 */
function getSupabaseClient() {
    return supabaseClient;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initSupabase();
});
