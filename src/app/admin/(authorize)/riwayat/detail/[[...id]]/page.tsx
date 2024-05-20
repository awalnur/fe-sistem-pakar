"use client"
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

import { Separator } from "@radix-ui/react-separator";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {Button} from "@/components/ui/button";
import {usePathname} from "next/navigation";
import {Header} from "@/lib/header";
import {cekLogin} from "@/lib/cekLogin";
import Link from "next/link";
import {ChevronLeft} from "lucide-react";
const BE_URL = process.env.NEXT_PUBLIC_BE_URL
export default function DetailRiwayat() {
    const [result, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);

    const router = usePathname().split('/')
    const login = cekLogin()
    const id_riwayat = router[router.length-1]
    useEffect(() => {
        const fetchData = async () => {
            try {
                let response = null
                response = await fetch(BE_URL + '/v1/diagnose/result/'+id_riwayat+'/admin',
                    {
                        method: 'GET',
                        headers: Header()
                    });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                console.log('Response data:', result);
                setData(result['data']);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error case
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main className="block">
            <div
                className="flex w-full min-h-screen flex-col items-center justify-between z-10 top-0 left-0 pb-24">

                <div className={'relative w-full mt-5'}>
                    <Card className={'w-full bg-[#ffffff90] rounded-xl backdrop-blur border'}>
                        <CardHeader className={'flex gap-5 flex-row border-b py-3'}>
                            <Link href={'/admin/riwayat'} className={'flex gap-2 -ml-5 w-fit px-5 py-2 text-green-600  rounded-xl'} ><ChevronLeft/> Kembali</Link>
                            <h1 className={'text-lg'}>Riwayat Diagnosa</h1>
                        </CardHeader>
                        <CardContent className={'flex gap-5 pt-5'}>

                            <div className={'box-content w-full p-5'}>
                                <div className={'border p-5 rounded mb-3 '}>
                                    <div className={'px-y border-b pb-3'}>
                                        <h2 className={'text-sm text-gray-600'}>Nama Peternak</h2>
                                        {/*@ts-ignore*/}
                                        <h1 className={'text-lg font-medium'}>{result ? (result.peternak) : ''}</h1>
                                    </div>
                                    <div className={'border-b py-2'}>
                                        <h2 className={'text-sm text-gray-600'}>Nama Peternakan</h2>
                                        {/*@ts-ignore*/}
                                        <h1 className={'text-lg font-medium'}>{result ? (result.peternakan) : ''} <label className={'text-sm font-normal italic'}> (Alamat: {result ? (result.alamat_peternakan) : ''})</label></h1>

                                    </div>
                                </div>

                                <div className={'intro mb-2'}>
                                    Berdasarkan hasil perhitungan menggunakan metode Demster-shafer dari gejala yang
                                    terjadi
                                    pada ayam,
                                    sistem menyimpulkan hasil sebagai berikut:
                                </div>
                                <Separator/>
                                <div id={'title'}>
                                    <h2 className={'text-md font-medium my-2'}>Nama Penyakit :</h2>
                                    <h1 className={'text-lg font-bold border p-3 rounded-xl bg-gray-50'}>
                                        {/*@ts-ignore*/}
                                        {result ? (result.penyakit.nama_penyakit) : ''}
                                    </h1>
                                </div>
                                <Separator/>
                                <div className={'gejala my-2'}>
                                    <h2 className={'text-md font-medium my-2'}>Gejala Yang terjadi :</h2>
                                    <div className={'gejala-terjadi p-3 border rounded-lg px-7'}>
                                        <ul className={'list list-inside list-disc'}>
                                            {
                                                // @ts-ignore
                                                result ? (result.gejala.map((item, index) => (
                                                    <li key={index} className={'list-item p-2.5 border-b'}>
                                                        {item}
                                                    </li>
                                                ))) : ('Tidak ada Gejala terjadi')
                                            }
                                        </ul>
                                    </div>
                                </div>
                                <div className={'Deskripsi my-2'}>
                                    <h2 className={'font-medium text-md my-2 pt-5'}> Tentang Penyakit</h2>
                                    <hr className={'w-4/12 mb-2'}/>
                                    {/*@ts-ignore*/}
                                    <p className={'text-justify  py-2'} dangerouslySetInnerHTML={{__html: result ? (result.penyakit.definisi) : '-'}}>

                                    </p>
                                </div>


                                <div className={'Deskripsi my-2'}>
                                    <h2 className={'font-medium text-lg my-2'}> Penularan</h2>
                                    <hr className={'w-4/12 mb-2'}/>
                                    {/*@ts-ignore*/}

                                    <p className={'text-justify py-2'}  dangerouslySetInnerHTML={{__html: result ? (result.penyakit.penularan) : '-'}}>

                                    </p>
                                </div>
                                <div className={'Deskripsi my-2'}>
                                    <h2 className={'font-medium text-lg my-2'}> Pencegahan</h2>
                                    <hr className={'w-4/12 mb-2'}/>
                                    {/*@ts-ignore*/}

                                    <p className={'text-justify py-2'} dangerouslySetInnerHTML={{__html: result ? (result.penyakit.pencegahan) : '-'}}>
                                        </p>
                                </div>
                            </div>
                            <div id={'image'} className={'lg:right-10 lg:top-10 aspect-square'}>
                                <Image src={'/img/default.png'} className={'rounded-2xl'} alt={'Gambar Penyakit'}
                                       width={500} height={250}/>
                                <p className={'py-2'}>
                                    {
                                        // @ts-ignore
                                        result ? (result.penyakit.nama_penyakit) : '-'
                                    }                            </p>

                                <div className={'persentase flex flex-col my-5 gap-5'}>
                                    <h1 className={'font-bold'}>Presentase Tingkat Kepercayaan : </h1>
                                    <div className={'presentase px-20'}>
                                        {" "}
                                        <CircularProgressbar
                                            value={
                                            // @ts-ignore
                                            (result ? (result.persentase) : (0))}
                                            text={
                                            // @ts-ignore
                                            (result ? (result.persentase) : (0)) + `%`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </main>
    )
}
