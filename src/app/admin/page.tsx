'use client'

import "@/app/globals.css";
import React, {useEffect} from "react";
import {Loader2} from "lucide-react";

import {redirect, useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {className} from "postcss-selector-parser";
import {Header} from "@/lib/header";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL

function cekLogin(){

    if (typeof window === "undefined") return null;
    let login : string | null =''

    login = localStorage.getItem('adminLogin') ? localStorage.getItem('adminLogin'):'false'

    return login
}
export default function Page({
                                   }: Readonly<{
}>) {
    const login = cekLogin()
    const router = useRouter()

    async function fetchUser(){
        try {
            // page=page>0?page-1:0
            const response = await fetch(BE_URL + '/v1/user/current_user',
                {
                    method: 'GET',
                    headers: Header()
                });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const userdata = await response.json();
            console.log(userdata['level'])
            if (userdata['level'] == 'Pengguna') {
                localStorage.setItem('adminLogin', 'false');
                router.push('/admin/login')
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error case
            // setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser()
    }, []);

    if (login === 'false'){
        router.push('/admin/login')
    }else{
        // @ts-ignore
        redirect('/admin/dashboard')
    }

    return (
        <div>
            <div className={'absolute z-50 w-full h-full bg-transparent backdrop-blur flex'}>
                <Loader2
                    className={cn('my-28 h-20 w-20 text-primary/80 animate-spin m-auto', className)}
                />
            </div>
        </div>
    )
}