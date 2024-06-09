'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import "../globals.css";
import { useEffect, useState } from "react";
import { cekLogin } from "@/lib/cekLogin";
import {History, ListCollapse, Loader2} from "lucide-react";
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
import Image from "next/image";
import {usePrev} from "@react-spring/shared";


// @ts-ignore
export default function RootLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [isShowAside, setIsShowAside] = useState(false);

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
    setLoading(false);

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

  // @ts-ignore
  return (
      <html lang="en">
      <body className="font-inter">
      {isShowAside?(
      <div className={'fixed h-full w-full z-40 bg-[#00000080] backdrop-blur'} >
        <aside className={"fixed inset-0 h-full top-0 p-10 pt-20 flex flex-col gap-5 z-50 left-0 w-5/6 bg-white"}>

          <Link onClick={()=>setIsShowAside(prevState => !prevState)} href="/">Home</Link>
          <Link onClick={()=>setIsShowAside(prevState => !prevState)} href="/penyakit">Penyakit</Link>
          <Link onClick={()=>setIsShowAside(prevState => !prevState)} href="/tentang">Tentang</Link>
        </aside>

      </div>
          ):''}
      <nav className="fixed backdrop-blur border-b-[#f0f0f050] border-b top-0 z-50 flex w-full bg-transparent px-5 py-3 lg:px-16 lg:py-3 2xl:px-64">
        <div className="flex flex-wrap md:hidden items-center justify-center w-fit">
          <Button className={'text-black'} variant={'ghost'} onClick={()=>setIsShowAside(prevState => !prevState)}><ListCollapse/></Button>
        </div>
        <div className="nav-logo mx-auto md:mx-0 center">
          <Link href={'/'}>
          <Image alt={'logo Image'}  className={"md:h-12 "} src="/img/logo-nav.png" width={100} height={100}/>
          </Link>
        </div>
        <div className="md:flex text-black hidden ml-16 my-auto flex-row gap-3 xl:text-lg xl:gap-5" id="Menu">
        {/*<div className="fixed h-full bg-white md:flex text-black ml-16 my-auto flex-row gap-3 xl:text-lg xl:gap-5" id="Menu">*/}
          <Link href="/">Home</Link>
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
