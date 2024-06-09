"use client"
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

import {map, z} from "zod"

import {Nav} from "@/app/(all)/penyakit/detail/[[...id]]/nav";
import { Separator } from "@radix-ui/react-separator";
import {usePathname} from "next/navigation";
import {useRouter} from "next/router";
import {Skeleton} from "@/components/ui/skeleton";
import {ChevronLeft} from "lucide-react";
import Link from "next/link";
const formSchema = z.object({
    searhcinput: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})


const BE_URL = process.env.NEXT_PUBLIC_BE_URL

export default function Penyakit() {
    const router = usePathname().split('/')

    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const id  = router[router.length-1]
    const [penyakit, setData] = useState(null);
    const [detailpenyakit, setDataDetail] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [isLoadingData, setDataLoading] = useState(true);
    console.log(id)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(BE_URL + '/v1/penyakit/option');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const dataPenyakit = await response.json();
                console.log('Response data:', dataPenyakit);
                setData(dataPenyakit['data']['entries']);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error case
                setLoading(false);
            }
        };

        const fetchDataPenyakit = async () => {
            try {
                const response = await fetch(BE_URL + '/v1/penyakit/get/'+id);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const dataPenyakit = await response.json();
                setDataDetail(dataPenyakit['data']);
                setDataLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error case
                setDataLoading(false);
            }
        };
        fetchData();
        fetchDataPenyakit();
    }, []);

    return (
        <main className="block">
            <div className="flex w-full min-h-screen flex-col items-center justify-between z-10 top-0 left-0 ">

                <div className={'relative w-full pt-10 flex xl:gap-5'}>
                    {isLoadingData ? (
                        <Card className={'flex w-full bg-[#ffffff90] rounded-xl backdrop-blur border p-8  gap-5'}>
                            <div className={'box-content w-full p-5'}>
                                <div id={'title'}>
                                    <Skeleton className={'text-xl w-80 h-5 my-2'} />

                                    <Skeleton className={'text-xl w-40 h-3 my-1'}/>
                                </div>
                                <div className={'Deskripsi my-2'}>

                                    <Skeleton className={'text-xl w-60 h-4 my-4'}/>
                                    <hr className={'w-4/12 mb-2'}/>
                                    <Skeleton className={'text-xl w-full h-3 my-2'}/>
                                    <Skeleton className={'text-xl w-full h-3 my-2'}/>
                                    <Skeleton className={'text-xl w-full h-3 my-2'}/>
                                    <Skeleton className={'text-xl w-full h-3 my-2'}/>
                                    <Skeleton className={'text-xl w-full h-3 my-2'}/>
                                </div>
                                <div className={'Deskripsi my-2'}>

                                    <Skeleton className={'text-xl w-60 h-4 my-4'}/>
                                    <hr className={'w-4/12 mb-2'}/>
                                    <Skeleton className={'text-xl w-full h-3 my-2'}/>
                                    <Skeleton className={'text-xl w-full h-3 my-2'}/>
                                    <Skeleton className={'text-xl w-full h-3 my-2'}/>
                                    <Skeleton className={'text-xl w-full h-3 my-2'}/>
                                    <Skeleton className={'text-xl w-full h-3 my-2'}/>
                                </div>

                            </div>
                            <div id={'image'} className={'lg:right-10 lg:top-10 aspect-square w-60'}>
                                <Skeleton className={'rounded-2xl w-60 aspect-square'}
                                />
                                <Skeleton className={'py-2 w-60 w-48 my-3'}>
                                </Skeleton>
                            </div>
                        </Card>
                    ) : (
                        <Card className={'w-full bg-[#ffffff90] rounded-lg backdrop-blur'}>
                            <CardHeader className={'flex gap-5 flex-row border-b py-3'}>
                                <Link href={'/admin/penyakit'} className={'flex gap-2 -ml-5 w-fit px-5 py-2 text-green-600  rounded-xl'} ><ChevronLeft/> Kembali</Link>
                                <h1 className={'text-lg'}>Detail Penyakit</h1>
                            </CardHeader>
                            <CardContent className={'flex gap-5 pt-5'}>
                                <div className={'box-content w-full px-5'}>
                                    <div id={'title'}>

                                        <h1 className={'text-xl font-bold'}>
                                            {
                                                // @ts-ignore
                                                detailpenyakit.nama_penyakit ? (detailpenyakit.nama_penyakit) : ('penyakit tidak ditemukan')}
                                        </h1>
                                        <p className={'italic text-sm text-gray-600 border-b py-1 mt-2 '}>
                                            {
                                                // @ts-ignore
                                                detailpenyakit.nama_penyakit ? (detailpenyakit.nama_penyakit) : ('penyakit tidak ditemukan')}
                                        </p>
                                    </div>
                                    <div className={'Deskripsi my-2'}>
                                        <h2 className={'font-medium text-lg my-2'}> Tentang</h2>
                                        <hr className={'w-4/12 mb-2'}/>
                                        <div className={'text-justify text-sm'} dangerouslySetInnerHTML={
                                            // @ts-ignore
                                            {__html: detailpenyakit.definisi}}>
                                        </div>
                                    </div>
                                    <div className={'Deskripsi my-2'}>
                                        <h2 className={'font-medium text-lg my-2'}> Penularan</h2>
                                        <hr className={'w-4/12 mb-2'}/>
                                        <div className={'text-justify text-sm'} dangerouslySetInnerHTML={
                                            // @ts-ignore
                                            {__html: detailpenyakit.penularan}}>

                                        </div>
                                    </div>
                                    <div className={'Deskripsi my-2'}>
                                        <h2 className={'font-medium text-lg my-2'}> Pencegahan</h2>
                                        <hr className={'w-4/12 mb-2'}/>
                                        <div className={'text-justify text-sm'} dangerouslySetInnerHTML={
                                            // @ts-ignore
                                            {__html: detailpenyakit.pencegahan}}>


                                        </div>
                                    </div>

                                    <div className={'Deskripsi my-2'}>
                                        <h2 className={'font-medium text-lg my-2'}> Penanganan</h2>
                                        <hr className={'w-4/12 mb-2'}/>
                                        <div className={'text-justify text-sm'}  dangerouslySetInnerHTML={
                                            // @ts-ignore
                                            {__html: detailpenyakit.penanganan}}>
                                            {/*{detailpenyakit.penanganan}?*/}

                                        </div>
                                    </div>
                                </div>
                                <div id={'image'} className={'lg:right-10 lg:top-10 aspect-square'}>
                                    <Image
                                        src={// @ts-ignore
                                        detailpenyakit.gambar ? ('/uploads/' + detailpenyakit.gambar) : ('/img/default.png')}
                                        className={'rounded-2xl'} alt={'Gambar Penyakit'}
                                        width={500} height={250}/>
                                    <p className={'py-2'}>
                                        {
                                            // @ts-ignore
                                            detailpenyakit.nama_penyakit}
                                    </p>
                                </div>
                            </CardContent>


                        </Card>
                    )
                    }
                </div>

            </div>
        </main>
    );
}
