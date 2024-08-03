import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import '../app/globals.css';
import Image from 'next/image';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

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

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailLogin = async (e) => {
        e.preventDefault();

        // Check if the user exists
        let { data: users, error: selectError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .eq('password', password);

        if (selectError) {
            setError(selectError.message);
            return;
        }

        if (users.length === 0) {
            showToast('Usuario no encontrado', 'linear-gradient(to right, #DFE6E3, #DADADA)', '#000');
            return;
        }
        // Generate a unique session ID
        const sessionID = uuidv4();
        Cookies.set('sessionID', sessionID);
        Cookies.set('userID', users[0].id);

        // Insert into active_sessions
        let { data: session, error: insertError } = await supabase
            .from('active_sessions')
            .insert([{ email: email, password: password, sessionID: sessionID, userID: users[0].id }]);

        if (insertError) {
            setError(insertError.message);
            return;
        }
        // User found, log in
        localStorage.setItem('toastMessage', JSON.stringify({
            message: 'Sesión iniciada',
            style: 'linear-gradient(to right, #DFE6E3, #DADADA)',
            color: '#000'
        }));

        router.push('/home');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white h-dvh">
            <div className="w-full max-w-md p-8 space-y-1 flex flex-col items-center justify-center -mt-20">
                <Image src="/mvc-pro_logo.png" alt="mvc-pro logo" width={200} height={200} />
                {error && <p className="text-red-500">{error}</p>}
                <form className="space-y-9 w-full" onSubmit={handleEmailLogin}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 mt-1 text-black rounded-lg focus:outline-none focus:ring focus:ring-gray-500"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 mt-1 text-black rounded-lg focus:outline-none focus:ring focus:ring-gray-500"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-black bg-white rounded-lg hover:bg-gray-300"
                    >
                        Login with Email
                    </button>
                </form>
            </div>
        </div>
    );
}
