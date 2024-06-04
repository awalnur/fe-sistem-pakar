'use client'
import {router} from "next/client";
import {redirect} from "next/navigation";

export function cekLogin(){

    if (typeof window === "undefined") return null;
    let login : string | null =''

    login = localStorage.getItem('login')

    if (login =='false'){
        redirect('/login');
    }

    return login
}