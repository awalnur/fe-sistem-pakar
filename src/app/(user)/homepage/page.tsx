"use client"
import Image from "next/image";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card} from "@/components/ui/card";

import {Calendar, MapPin} from "lucide-react";
import Link from "next/link";
import {Nav} from "@/app/(user)/nav";
import { Separator } from "@radix-ui/react-separator";
import React, {useEffect, useState} from "react";
import moment from "moment";
import {Header} from "@/lib/header";
const BE_URL = process.env.NEXT_PUBLIC_BE_URL


interface NavProps {
    isCollapsed: boolean
    links: {
        title: string
        label?: string
        variant: "default" | "ghost"
    }[]
}
export default function HomePage() {
    const [dataRiwayat, setRiwayat] = useState([])
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(BE_URL + '/v1/riwayat/last',
                    {
                        method: 'GET',
                        headers: Header()
                    });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const datariwayat = await response.json();
                console.log('Response data:', datariwayat);
                setRiwayat(datariwayat['data']['entries']);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error case
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    console.log('data riwayat',)
    return (
        <main className="block">
            <div className="flex w-full min-h-screen flex-col items-center justify-between z-10 top-0 left-0 pb-24  ">

                <div className={"absolute -z-40 3xl:w-6/12 lg:w-8/12 right-0 bg-hero-pattern h-screen bg-cover "}>
                </div>

                <div className={'relative w-full top-20 xl:px-64 p-6 xl:py-16 flex lg:gap-5'}>
                    <div className={'sticky z-40 top-24 h-fit w-3/12 rounded-xl border'}>
                        <div
                            data-collapsed={isCollapsed}
                            className="sticky group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
                        >
                            <h1 className={'px-4 pt-2'}>Menu</h1>
                            <Separator className={'border'}/>

                            <Nav
                                isCollapsed={isCollapsed}
                                links={[
                                    {
                                        title: "Dashboard",
                                        label: "",
                                        variant: "default",
                                        uri:'/homepage',
                                    },
                                    {
                                        title: "Riwayat Diagnosa",
                                        label: "",
                                        variant: "ghost",
                                        uri:'/riwayat',
                                    },
                                    {
                                        title: "Profil",
                                        label: "",
                                        variant: "ghost",
                                        uri:'/profil',
                                    }
                                ]}
                            />
                        </div>
                    </div>
                    <div className={'content flex flex-col w-full'}>
                        <div className={'pb-4'}>
                            <h1 className={'text-lg font-bold'}>Dashboard</h1>
                            <p className={'text-sm font-normal text-gray-600'}>Halaman Dashboard Pengguna</p>
                        </div>
                        <Card className={'flex w-full bg-[#ffffff90] rounded-2xl backdrop-blur border px-4 py-2  gap-5'}>
                            <div className={'box-content w-full p-5'}>
                                <div id={'title'}>
                                    <h1 className={'text-xl font-bold'}>
                                        Selamat Datang, <b>User</b> di AGRI Chicken Health Diagnose
                                    </h1>
                                    <p className={'text-sm text-gray-600 py-1 mt-2 '}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam convallis erat non
                                        pellentesque dignissim.
                                    </p>
                                </div>
                                <div className={'flex pt-8'}>
                                    <Link href={'/diagnosa'}>
                                        <Button variant={'outline'} className={'rounded-full'}> Lakukan Diagnosa</Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                        <div className={'riwayat Diagnosa flex flex-col py-8 gap-5'}>
                            <h1 className={'font-medium text-md border-b w-fit pr-16 pb-1'}>
                                Riwayat Diagnosa
                            </h1>
                            <div className={'flex gap-5'}>


                                {
                                    dataRiwayat.length > 0 ? (dataRiwayat.map((item, index) => (
                                        <Card key={index}
                                              className={'flex lg:w-4/12 p-2 gap-5 rounded-2xl backdrop-blur bg-[#ffffff99]'}>
                                            <div
                                                className={'presentase flex flex-col align-middle aspect-square p-4 text-lg my-auto bg-gray-100 rounded-2xl'}>
                                                <p className={'text-xs text-center text-gray-600 mt-auto'}>Akurasi</p>
                                                <h1 className={'font-bold text-center mb-auto'}>{
                                                    // @ts-ignore
                                                    item.persentase}%</h1>
                                            </div>
                                            <div className={'keterangan w-full flex flex-col'}>
                                                <Link href={
                                                    // @ts-ignore
                                                    '/diagnosa/hasil/' + item.kode_riwayat}
                                                      className={'text-md font-bold'}> {
                                                    // @ts-ignore
                                                    item.penyakit}</Link>
                                                <div className={'text-xs flex flex-row text-gray-600 gap-2'}>
                                                    <Calendar className={'w-4'}/>
                                                    <p className={'my-auto'}>{
                                                        // @ts-ignore
                                                        moment(item.created_date, 'DD-MM-YYYY HH:mm:ss').format('dddd, DD-MM-YYYY')}</p>
                                                </div>
                                                <div className={'text-xs flex flex-row text-gray-600 gap-2'}>
                                                    <MapPin className={'w-4'}/>
                                                    <p className={'my-auto'}>{
                                                        // @ts-ignore
                                                        item.peternakan}</p>
                                                </div>
                                            </div>
                                        </Card>

                                    ))) : (

                                        <p>
                                            Riwayat Tidak ada
                                        </p>
                                    )
                                    // data.map((data)=>(
                                    //
                                    // ))
                                }

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
