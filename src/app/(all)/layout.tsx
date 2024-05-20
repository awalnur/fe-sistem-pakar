'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import "../globals.css";
import { useEffect, useState } from "react";
import { cekLogin } from "@/lib/cekLogin";
import {History, Loader2} from "lucide-react";
import {cn} from "@/lib/utils";
import {className} from "postcss-selector-parser";

import {
  LogOut,
  Settings,
  User
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";


export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const login = cekLogin()
    if (login===null || login==='false'){
      setIsLoggedIn(false);
      setLoading(false);
    }else{
      setIsLoggedIn(true);
      setLoading(false);
    }
  }, []);
  const goPage=(uri:string)=>{
      router.push(uri)
  }
  const handleLogout = () => {
    localStorage.removeItem("login");
    localStorage.removeItem("accessToken")
    localStorage.removeItem("admin");
    router.push("/login");
  };

  return (
      <html lang="en">
      <body className="font-inter">
      <nav className="fixed backdrop-blur border-b-[#f0f0f050] border-b top-0 z-50 flex w-full bg-transparent lg:px-16 lg:py-3 xl:px-64">
        <div className="nav-logo">
          <img className="h-12" src="/img/logo-nav.png" alt="Logo" />
        </div>
        <div className="text-black ml-16 my-auto flex flex-row gap-3 xl:text-lg xl:gap-5" id="Menu">
          <Link href="/">Homepage</Link>
          <Link href="/penyakit">Penyakit</Link>
          <Link href="/tentang">Tentang</Link>
        </div>
        <div className="ml-auto">
          {isLoggedIn ? (
              <div className="flex flex-row gap-2 z-10">
                {/*<Button*/}
                {/*    className="rounded-full xl:px-10 xl:text-md xl:py-3"*/}
                {/*    variant="outline"*/}
                {/*    onClick={handleLogout}*/}
                {/*>*/}
                {/*  Logout*/}
                {/*</Button>*/}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <User className={'bg-white p-1.5 w-10 h-10 rounded-full '}/>


                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuGroup>

                      <DropdownMenuItem onClick={()=>goPage('/profil')}>
                        <User className="mr-2 h-4 w-4"/>
                        <span>Profile</span>
                        {/*<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={()=>goPage('/homepage')}>
                        <Settings className="mr-2 h-4 w-4"/>
                        <span>Dashboard</span>
                        {/*<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>*/}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={()=>goPage('/riwayat')}>
                        <History className="mr-2 h-4 w-4"/>
                        <span>Riwayat</span>
                        {/*<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>*/}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuItem  onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4"/>
                      <span>Log out</span>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
          ) : (
              <div className="flex flex-row gap-2 z-10">
                <Link href="/login">
                  <Button
                      className="rounded-full xl:px-10 xl:text-lg xl:py-6"
                      variant="outline"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                      className="rounded-full xl:px-10 xl:text-lg xl:py-6 from-yellow-400 to-orange-400 bg-gradient-to-br text-white hover:text-orange-500 hover:bg-white"
                      variant="outline"
                  >
                    Register
                  </Button>
                </Link>
              </div>
          )}
        </div>
      </nav>
      {
        loading ? (

            <div className={'absolute z-50 w-full h-full bg-transparent backdrop-blur flex'}>
              <Loader2
                  className={cn('my-28 h-20 w-20 text-primary/80 animate-spin m-auto', className)}
              />
            </div>
        ) : (null)
      }
      {children}

      <footer className="w-full bg-gradient-to-t from-[#006b4f] to-[#006b4f] lg:h-16 text-center p-6">
        <div className="text-white">
          Copyright © 2024 AGRI CHICKEN HEALTH DIAGNOSE
        </div>
      </footer>
      </body>
      </html>
  );
}
