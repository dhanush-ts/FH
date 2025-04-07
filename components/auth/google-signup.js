"use client"
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';

const GoogleSignUp = () => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const router = useRouter();

    const handleRegisterSuccess = async (response) => {
        const credential = response.credential; 

        const res = await fetch("http://localhost:8000/api/auth/register/google/", {
            method: "POST",
            credentials: "include",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json",
             },
            body: JSON.stringify({ token: credential })
        });

        const data = await res.json();
        if(data?.detail === "Successful"){
            setIsAuthenticated(true);
            console.log(isAuthenticated)
            router.push("/");
        }
        console.log("Backend Response:", data);

    };

    return (
        <div className='flex items-center justify-center'>
            <GoogleLogin 
                onSuccess={handleRegisterSuccess} 
                onError={() => console.log("Login Failed")} 
                text='signup_with' flow="auth-code"
            />
        </div>
    );
};

export default GoogleSignUp;