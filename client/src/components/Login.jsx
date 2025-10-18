import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { colors } = useTheme();

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                navigate("/home");
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
    };

    return (
        <main className={`min-h-screen flex justify-center items-center ${colors.primary}`}>
            <section className={`${colors.card} rounded-xl shadow-2xl p-8 max-w-md w-full mx-4`}>
                <div>
                    <h1 className={`text-3xl font-bold text-center ${colors.textPrimary} mb-2`}>Xcrypt</h1>
                    <p className={`text-center ${colors.textMuted} mb-8`}>Welcome back! Please sign in to your account.</p>
                    <form className="mt-8">
                        <div>
                            <label htmlFor="email-address" className={`text-sm font-medium ${colors.textSecondary}`}>
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                required
                                className={`mt-2 block w-full rounded-lg ${colors.input} ${colors.inputFocus} px-4 py-3 ${colors.textPrimary} placeholder-gray-400 transition-all duration-200`}
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mt-6">
                            <label htmlFor="password" className={`text-sm font-medium ${colors.textSecondary}`}>
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className={`mt-2 block w-full rounded-lg ${colors.input} ${colors.inputFocus} px-4 py-3 ${colors.textPrimary} placeholder-gray-400 transition-all duration-200`}
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={onLogin}
                                className={`w-full px-4 py-3 text-sm font-semibold text-white ${colors.buttonPrimary} rounded-lg transition-all duration-200 shadow-sm`}
                            >
                                Login
                            </button>
                        </div>
                    </form>

                    <p className={`text-sm ${colors.textSecondary} text-center mt-6`}>
                        No account yet?{' '}
                        <NavLink to="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                            Sign up
                        </NavLink>
                    </p>
                </div>
            </section>
        </main>
    );
};

export default Login;