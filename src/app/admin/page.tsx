
'use client'
import { Inter } from "next/font/google";
import "@/app/globals.css";
import React, {useEffect} from "react";
import {Toaster} from "@/components/ui/toaster";
import {Button} from "@/components/ui/button";
import {ChevronDown, History, List, ListCollapse, Loader2, LogOut, Settings, User} from "lucide-react";
import {Nav} from "@/components/Nav";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {redirect, useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {className} from "postcss-selector-parser";
import {Header} from "@/lib/header";

const inter = Inter({ subsets: ["latin"] });
const BE_URL = process.env.NEXT_PUBLIC_BE_URL

export function cekLogin(){

    if (typeof window === "undefined") return null;
    let login : string | null =''
    let access : string | null =''
    login = localStorage.getItem('adminLogin') ? localStorage.getItem('adminLogin'):'false'

    return login
}
export default function Page({
                                   }: Readonly<{
}>) {
    const login = cekLogin()
    const router = useRouter()

    async function fetchUser(limit=10, page=1, search=''){
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
        router.push('/admin/dashboard')
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