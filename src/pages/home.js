import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../app/globals.css';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import { AiOutlineHome, AiOutlineLogout } from 'react-icons/ai';
import { GiMeal, GiWeightLiftingUp } from 'react-icons/gi';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import Cookies from 'js-cookie';

const showToast = (message, backgroundColor, textColor) => {
    Toastify({
        text: message,
        duration: 2500,
        gravity: 'top',
        position: 'center',
        stopOnFocus: true,
        style: {
            borderRadius: '10px',
            backgroundImage: backgroundColor,
            textAlign: 'center',
            color: textColor,
        },
    }).showToast();
};


export default function Home() {
    const router = useRouter();

    const handleLogout = async () => {
        let userID = Cookies.get('userID');
        let sessionID = Cookies.get('sessionID');
        console.log(userID, sessionID);
        let { error } = await supabase
            .from('active_sessions')
            .delete()
            .eq('userID', userID)
            .eq('sessionID', sessionID);
        if (error) {
            console.log("Error logging out:", error.message);
        } else {
            localStorage.setItem('toastMessage', JSON.stringify({
                message: 'Sesión cerrada',
                style: 'linear-gradient(to right, #DFE6E3, #DADADA)',
                color: '#000'
            }));
            Cookies.remove('sessionID');
            Cookies.remove('userID');
            router.push('/login');
        }
    };

    const handleScroll = () => {
        const elements = document.querySelectorAll('.fade-in-up');
        elements.forEach(element => {
            const position = element.getBoundingClientRect();
            if (position.top < window.innerHeight) {
                element.classList.add('animate-fadeInUp');
            }
        });
    };

    useEffect(() => {
        const toastMessage = localStorage.getItem('toastMessage');
        if (toastMessage) {
            const { message, style, color } = JSON.parse(toastMessage);
            // Display the toast message
            showToast(message, style, color);
            // Remove the message from localStorage
            localStorage.removeItem('toastMessage');
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Trigger animation on load in case elements are already in view
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center h-dvh relative">
            <div className="logosectionCotainer flex flex-col items-center justify-center absolute top-56 left-0 right-0 animate-combined z-10">
                <Image src="/mvc-pro_logo.png" alt="mvc-pro logo" width={200} height={200} />
            </div>
            <div className="container mx-auto py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                    <div className="flex items-center justify-center">
                        <div className="rounded-lg shadow-lg bg-gray-800 p-10 text-center opacity-0 animate-fadeInUp w-[95%]" onClick={() => router.push('/diet')}>
                            <h2 className="text-2xl font-bold mb-4">Dieta</h2>
                            <p className="text-gray-400">Plan de alimentación saludable y personalizado.</p>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="rounded-lg shadow-lg bg-gray-800 p-10 text-center opacity-0 w-[95%] animate-fadeInUp2">
                            <h2 className="text-2xl font-bold mb-4">Entrenamiento</h2>
                            <p className="text-gray-400">Rutinas de ejercicio diseñadas para ti.</p>
                        </div>
                    </div>
                </div>
            </div>
            <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex justify-around items-center">
                <button onClick={() => router.push('/home')} className="text-white text-2xl">
                    <AiOutlineHome />
                </button>
                <button onClick={() => router.push('/diet')} className="text-white text-2xl">
                    <GiMeal />
                </button>
                <button onClick={() => router.push('/training')} className="text-white text-2xl">
                    <GiWeightLiftingUp />
                </button>
                <button onClick={handleLogout} className="text-white text-2xl">
                    <AiOutlineLogout />
                </button>
            </nav>
        </div>
    );
}
