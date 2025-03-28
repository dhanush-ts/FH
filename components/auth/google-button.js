import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const handleLoginSuccess = async (response) => {
        const credential = response.credential;  // Google token

        // Send token to Django Backend
        const res = await fetch("http://localhost:8000/api/auth/login/google/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: credential })
        });

        const data = await res.json();
        console.log("Backend Response:", data);

    };
    const handleRegisterSuccess = async (response) => {
        const credential = response.credential;  // Google token

        // Send token to Django Backend
        const res = await fetch("http://localhost:8000/api/auth/register/google/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: credential })
        });

        const data = await res.json();
        console.log("Backend Response:", data);

    };

    return (
        <div>
            <GoogleLogin 
                onSuccess={handleLoginSuccess} 
                onError={() => console.log("Login Failed")} 
                text='signin_with' 
            />
            <GoogleLogin 
                onSuccess={handleRegisterSuccess} 
                onError={() => console.log("Login Failed")} 
                text='signup_with' 
            />
        </div>
    );
};

export default Login;