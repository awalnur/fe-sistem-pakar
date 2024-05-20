'use client'
import {ChevronDown, History, LayoutDashboardIcon, LogOut, Settings, Table2, User, Users} from "lucide-react";

import React, {createElement} from "react";
import Link from "next/link";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {usePathname, useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";

interface NavProps {
    isCollapsed: boolean
    current_user: string
    links: {
        title: string
        icon: string
        baseName: string
        uri: string
        active: boolean
    }[]
}

export function Nav({ links, current_user}: NavProps)
{
    const base = usePathname().split('/')[2]
    // console.log(base)
    const icon={
        'ChevronDown':<ChevronDown/>,
        'History':<History/>,
        'LayoutDashboardIcon':<LayoutDashboardIcon/>,
        'LogOut':<LogOut/>,
        'Settings':<Settings/>,
        'Table2':<Table2/>,
        'User':<User/>,
        'Users':<Users/>
    }
    function HandleLogouts()  {
        console.log('hapus')
        // router.push("/login");
        // return true

    }

    return (<nav
        className={'top-0 shadow-2xl lg:min-w-80 xl:min-w-80 inline-block h-screen '}>
            <div className={'fixed h-screen lg:min-w-80 lg:w-80 xl:w-80 flex flex-col'}>
                <div className={'flex flex-wrap items-left min-h-16  px-6 border-b  bg-white shadow'}>
                    <Image src={'/img/logo-admin.svg'} alt={'logoadmin'} width={200} height={56}/>
                </div>
                <div className={'flex flex-wrap items-center px-6 lg:py-10 border-b bg-[#347b3b] text-white rounded-tr-3xl '}>
                    <div className={'flex userdetail w-full gap-3'}>
                        <div className={'avatar flex'}>
                            <div className={'aspect-square bg-black w-16 rounded-full text-white text-center'}>

                            </div>
                        </div>
                        <div className={'detail w-full px-3 gap-2 my-auto'}>
                            <h1 className={'text-lg font-medium'}>{current_user}</h1>
                            <h6 className={'text-sm text-gray-400'}>Administrator</h6>
                        </div>
                        <div className={'right-0 my-auto'}>
                            <DropdownMenu>
                                <DropdownMenuTrigger className={'outline-none active:border-none selection:border-none'}>
                                    <div className={'px-1 h-8 py-1 border border-white rounded bg-transparent w-auto'}><ChevronDown/></div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40 left-0">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuGroup>

                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4"/>
                                            <span>Profile</span>
                                            {/*<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>*/}
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuItem >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
                <div id={'Dashboard-menu'} className={'flex w-full h-full bottom-0 bg-[#347b3b]'}>
                    <div className={'flex flex-col w-full items-center px-6 py-5 gap-2 text-white'}>
                        {
                            links.map((link, index) =>

                                <Link key={index} href={'/admin'+link.uri} aria-disabled={link.active}

                                      className={(link.baseName===base)?('font-medium w-full flex gap-2  bg-[#1b5820] px-5 py-3 rounded-lg'):('!w-full flex gap-2 px-5 py-2 rounded-lg')}
                                >
                                    {icon[link.icon]} {link.title}
                                </Link>

                            )
                        }

                        {/*<Link href={'/admin'+} aria-disabled={true} className={'!w-full flex gap-2 px-5 py-2 rounded-lg '}>*/}
                        {/*    <Table2/> Data Penyakit*/}
                        {/*</Link>*/}
                        {/*<Link href={'#'} aria-disabled={true} className={'!w-full flex gap-2 px-5 py-2 rounded-lg'}>*/}
                        {/*    <Table2/> Data Gejala*/}
                        {/*</Link>*/}
                        {/*<Link href={'#'} aria-disabled={true} className={'!w-full flex gap-2 px-5 py-2 rounded-lg'}>*/}
                        {/*    <Table2/> Rule*/}
                        {/*</Link>*/}
                        {/*<Link href={'#'} aria-disabled={true} className={'!w-full flex gap-2 px-5 py-2 rounded-lg'}>*/}
                        {/*    <History/> Riwayat Diagnosa*/}
                        {/*</Link>*/}

                        {/*<Link href={'#'} aria-disabled={true} className={'!w-full flex gap-2 px-5 py-2 rounded-lg'}>*/}
                        {/*    <Users/> Data Pengguna*/}
                        {/*</Link>*/}
                        <Link href={'/admin/profil'} aria-disabled={true}
                              className={('profil'===base)?('font-medium w-full flex gap-2  bg-[#1b5820] px-5 py-3 rounded-lg mt-auto'):('!w-full flex gap-2 px-5 py-2 rounded-lg mt-auto')}>
                            <Settings/> Profil
                        </Link>

                        <Button onClick={()=>HandleLogouts()} variant={'ghost'}
                              className={'!w-full flex gap-2 py-3 rounded-lg justify-start px-5'}>
                            <LogOut/> Logout
                        </Button>
                    </div>
                </div>

            </div>

        </nav>
    )
}