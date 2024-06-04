'use client'
import { Inter } from "next/font/google";
import "@/app/globals.css";
import React, {useEffect, useState} from "react";
import {Toaster} from "@/components/ui/toaster";
import {Button} from "@/components/ui/button";
import {ChevronDown, ChevronRight, History, List, ListCollapse, LogOut, Settings, User} from "lucide-react";
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
import {redirect, usePathname, useRouter} from "next/navigation";
import type { Metadata } from "next";
import {Header} from "@/lib/header";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const BE_URL = process.env.NEXT_PUBLIC_BE_URL

export function cekLogin(){

    if (typeof window === "undefined") return null;
    let login : string | null =''
    login = localStorage.getItem('adminLogin') ? localStorage.getItem('adminLogin'):'false'


    return login
}
export function getAccess(){
    if (typeof window === "undefined") return null;
    let access : string | null =''
    access = localStorage.getItem('adminLogin') ? localStorage.getItem('adminLogin'):'false'
    return access
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const [current_user, setUser]= useState(null);
    const link = [
        {
            title: "Dashboard",
            icon: "LayoutDashboardIcon",
            active: true,
            baseName:'dashboard',
            uri:'/dashboard',
        },{
            title: "Data Penyakit",
            icon: "Table2",
            active: false,
            baseName:'penyakit',
            uri:'/penyakit',
        },{
            title: "Data Gejala",
            icon: "Table2",
            active: false,
            baseName:'gejala',
            uri:'/gejala',
        },{
            title: "Rule",
            icon: "Table2",
            active: false,
            baseName:'rule',
            uri:'/rule',
        },{
            title: "Riwayat Diagnosa",
            icon: "History",
            active: false,
            baseName:'riwayat',
            uri:'/riwayat',
        },{
            title: "Data Pengguna",
            icon: "Users",
            active: false,
            baseName:'pengguna',
            uri:'/pengguna',
        },
    ]
    const login = cekLogin()
    const access = getAccess()
    const router = useRouter()
    const path = usePathname().split('/')

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

            if (userdata['level'] == 'Pengguna') {
                localStorage.removeItem('adminLogin');
                router.push('/admin/login')
            }else{
                setUser(userdata)
            }

        } catch (error) {
            console.error('Error fetching data:', error);

            localStorage.removeItem('adminLogin');
            router.push('/admin/login')
        }
    }

    useEffect(() => {
        fetchUser()
    }, []);

    function HandleLogouts()  {

        if (typeof window === "undefined") return null;
        localStorage.removeItem('adminLogin')
        localStorage.removeItem('accessToken')


        console.log('hapus')
        router.replace('/admin/login')
        // return true

    }


    return (
        <div className={'flex  bg-gray-200 bg-cover bg-fixed'}>
            <Nav links={link} isCollapsed={false} current_user={
                // @ts-ignore
                current_user?current_user.username:'-'}/>
            <main className="flex flex-row bg-gray-200 w-full">
                <Toaster/>
                <div
                    className={'navbar fixed flex flex-row right-0 lg:left-80 xl:left-80 min-h-16 h-16 z-50 bg-white justify-between px-5 shadow'}>
                    <div className={'relative left my-auto'}>
                        <Button variant={'ghost'}>
                            <List className={'text-xl'}/>
                        </Button>
                    </div>
                    <div className={'relative my-auto gap-5 w-fit flex flex-row align-middle items-center px-5'}>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                className={'outline-none active:border-none selection:border-none gap-3 w-fit flex flex-row align-middle items-center right-3'}>
                                <div className={'avatar w-12 rounded-full aspect-square bg-gray-700'}>
                                </div>
                                <div>
                                    <h1 className={'font-medium text-left'}>{
                                        // @ts-ignore
                                        current_user? current_user.username:'-'}</h1>
                                    <h2 className={'text-xs font-light text-left'}>Administrator</h2>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40 right-10">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator/>
                                <DropdownMenuGroup>
                                    <Link href={'/admin/profil'}>
                                                                            <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4"/>
                                        <span>Profile</span>
                                    </DropdownMenuItem>

                                    </Link>

                                </DropdownMenuGroup>
                                <DropdownMenuItem onClick={()=>HandleLogouts()}>
                                    <LogOut className="mr-2 h-4 w-4"/>
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>

                <div className="flex p-8 mt-16 w-full flex-col z-10">

                    <Breadcrumb>
                        <BreadcrumbList>

                            {
                                path.map((item, index)=>(

                                        index != 0?(
                                        <BreadcrumbItem key={index} >
                                            <BreadcrumbLink href={
                                                // @ts-ignore
                                                "/"+(index==1?path[index]:(index==2?(path[1]+'/'+path[index]):(index==3?(path[1]+'/'+path[2]+'/'+path[index]):(''))))} className={'capitalize flex flex-row'}> <ChevronRight className={'h-4 my-auto'}/>{item}</BreadcrumbLink>
                                        </BreadcrumbItem>
                                        ):('')

                                )
                                )                            }

                        </BreadcrumbList>
                    </Breadcrumb>

                    {children}

                    <footer className={'bg-white -mx-8 bottom-0 px-8 -mb-8 h-16 flex items-center mt-10'}>Copyright © 2024 AGRI Chicken Health</footer>
                </div>

            </main>
        </div>
        // </body>
        // </html>
    );
}
