'use client';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const checkUserSession = async () => {
            const userID = Cookies.get('userID');
            const sessionID = Cookies.get('sessionID');

            if (userID && sessionID) {
                // Function to check if the user exists in Supabase with the 'mvc-pro' schema
                const { data, error } = await supabase
                    .from('users') // Adjust the table name according to your schema
                    .select('id')
                    .eq('userID', userID)
                    .eq('sessionID', sessionID)
                    .single();

                if (data) {
                    // User exists, redirect to home page
                    router.push('/home');
                } else {
                    // User does not exist, redirect to login page
                    router.push('/login');
                }
            } else {
                // Cookies do not exist, redirect to login page
                router.push('/login');
            }
        };

        checkUserSession();
    }, [router]);

    return (
        <>
        </>
    );
}
