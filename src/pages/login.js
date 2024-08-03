// pages/login.js
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import '../app/globals.css';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setError(error.message);
        } else {
            router.push('/home');
        }
    };

    const handleOAuthLogin = async (provider) => {
        const { error } = await supabase.auth.signInWithOAuth({ provider });
        if (error) {
            setError(error.message);
        } else {
            router.push('/home');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-950 text-white h-dvh">
            <div className="w-full max-w-md p-8 space-y-8">
                <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
                {error && <p className="text-red-500">{error}</p>}
                <form className="space-y-6" onSubmit={handleEmailLogin}>
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
                <hr className="my-6 border-gray-700" />
                <button
                    onClick={() => handleOAuthLogin('google')}
                    className="w-full px-4 py-2 font-bold text-black bg-white rounded-lg hover:bg-gray-300"
                >
                    Login with Google
                </button>
                <button
                    onClick={() => handleOAuthLogin('apple')}
                    className="w-full px-4 py-2 font-bold text-black bg-white rounded-lg hover:bg-gray-300"
                >
                    Login with Apple
                </button>
            </div>
        </div>
    );
}
