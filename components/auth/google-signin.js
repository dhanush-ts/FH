"use client"
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { api } from '@/app/api';

const Login = ({callbackUrl}) => {
    const { isAuthenticated, setIsAuthenticated } = useAuth();
    const router = useRouter();
    const handleLoginSuccess = async (response) => {
        const credential = response.credential;

        const res = await fetch(`${api}/auth/login/google/`, {
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
            router.push(callbackUrl);
        }
        console.log("Backend Response:", data);
    };

    return (
        <div className="flex justify-center items-center">
            <GoogleLogin 
                onSuccess={handleLoginSuccess} 
                onError={() => console.log("Login Failed")} 
                text='signin_with' useOneTap={true}
            />
        </div>
    );
};

export default Login;