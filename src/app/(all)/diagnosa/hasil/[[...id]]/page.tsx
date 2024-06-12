"use client"
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {Card} from "@/components/ui/card";

import { Separator } from "@radix-ui/react-separator";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {usePathname} from "next/navigation";
import {Header} from "@/lib/header";
import {cekLogin} from "@/lib/cekLogin";
import Link from "next/link";
const BE_URL = process.env.NEXT_PUBLIC_BE_URL
export default function ResultDiagnose() {
    const [result, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const [jsonData, setJsonData] = useState([]);

    const router = usePathname().split('/')
    const login = cekLogin()
    const id_riwayat = router[router.length-1]

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response=null
                if (login){
                    response = await fetch(BE_URL + '/v1/diagnose/result/'+id_riwayat,
                        {
                            method: 'GET',
                            headers: Header()
                        });
                }else{
                    response = await fetch(BE_URL + '/v1/diagnose/result/'+id_riwayat+'/public');
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                console.log(result)
                const data = JSON.parse(result['data'].other);

                setJsonData(data)
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

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <main className="block">
            <div className="flex w-full min-h-screen flex-col items-center justify-between z-10 top-0 left-0 pb-24 md:px-16 px-4 ">

                <div className={"fixed w-full -z-40 xl:w-6/12 lg:w-8/12 right-0 bg-hero-pattern h-screen bg-cover "}>
                </div>

                <div className={'relative w-full top-20 xl:px-64 xl:py-16 xl:gap-5 py-5'}>
                    <div className={'title w-full lg:p-8 p-4'}>
                        <h1 className={'text-center font-bold text-xl'}>Hasil Diagnosa</h1>
                    </div>
                    <Card className={'flex flex-col md:flex-row w-full bg-[#ffffff90] rounded-xl backdrop-blur border p-1 md:p-8  gap-5'}>

                        <div className={'box-content p-5 lg:w-9/12'}>
                            <div className={'intro mb-2'}>
                                Berdasarkan hasil perhitungan menggunakan metode Demster-shafer dari gejala yang terjadi
                                pada ayam,
                                sistem menyimpulkan hasil sebagai berikut:
                            </div>
                            <Separator/>

                            <div id={'title'}>
                                <h2 className={'text-md font-medium my-2'}>Nama Penyakit :</h2>
                                <h1 className={'text-lg font-bold border p-3 rounded-xl bg-gray-50'}>
                                    {
                                        // @ts-ignore
                                        result ? (result.penyakit.nama_penyakit) : ''
                                    }
                                </h1>
                            </div>
                            <div id={'image'}
                                 className={'block lg:hidden lg:right-10 lg:top-10 aspect-square p-4 lg:w-3/12'}>
                                <Image src={
                                    // @ts-ignore
                                    result ? result.penyakit.gambar ? (BE_URL + '/v1/assets?images=' + result.penyakit.gambar) : ('/img/default.png') : ('/img/default.png')
                                } className={'rounded-2xl'} alt={'Gambar Penyakit'}
                                       width={500} height={250}/>
                                <p className={'py-2'}>
                                    {
                                        // @ts-ignore
                                        result ? result.penyakit.nama_penyakit : ''
                                    }
                                </p>

                                <div className={'persentase flex flex-col my-5 gap-5 w-full'}>
                                    <h1 className={'font-bold'}>Presentase Tingkat Kepercayaan : </h1>
                                    <div className={'presentase p-10'}>
                                        {" "}
                                        <CircularProgressbar                                        // @ts-ignore

                                            value={(result ? (result.persentase) : (0))}                                        // @ts-ignore
                                            // @ts-ignore

                                            text={(result ? (result.persentase) : (0)) + `%`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Separator/>
                            <div className={'gejala my-2'}>
                                <h2 className={'text-md font-medium my-2'}>Gejala Yang terjadi :</h2>
                                <div className={'gejala-terjadi p-3 border rounded-lg md:px-7 '}>
                                    <ul className={'list list-inside list-disc'}>
                                        {                                        // @ts-ignore

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
                                <p className={'text-justify  py-2'} dangerouslySetInnerHTML={
                                    // @ts-ignore

                                    {__html: result ? (result.penyakit.definisi) : ''}}>

                                </p>
                            </div>


                            <div className={'Deskripsi my-2'}>
                                <h2 className={'font-medium text-lg my-2'}> Penularan</h2>
                                <hr className={'w-4/12 mb-2'}/>
                                <p className={'text-justify py-2'} dangerouslySetInnerHTML={
                                    // @ts-ignore

                                    {__html: result ? (result.penyakit.penularan) : ''}}>
                                    {/*{*/}
                                    {/*    result?(result.penyakit.penularan):'-'*/}
                                    {/*}*/}
                                </p>
                            </div>
                            <div className={'Deskripsi my-2'}>
                                <h2 className={'font-medium text-lg my-2'}> Pencegahan</h2>
                                <hr className={'w-4/12 mb-2'}/>
                                <p className={'text-justify py-2'} dangerouslySetInnerHTML={
                                    // @ts-ignore

                                    {__html: result ? (result.penyakit.pencegahan) : ''}
                                }>
                                    {/*{*/}
                                    {/*    result ? (result.penyakit.pencegahan) : '-'*/}
                                    {/*}*/}
                                </p>
                            </div>
                            <div className={'my-4'}>
                                <Link href={'/homepage'} className={'rounded-full bg-primary text-white px-8 py-3'}>Kembali
                                    Ke Halaman Utama</Link>
                            </div>
                        </div>
                        <div id={'image'}
                             className={'lg:block hidden lg:right-10 lg:top-10 aspect-square p-4 lg:w-3/12'}>
                            <Image src={
                                // @ts-ignore
                                result ? result.penyakit.gambar ? (BE_URL + '/v1/assets?images=' + result.penyakit.gambar) : ('/img/default.png') : ('/img/default.png')
                            } className={'rounded-2xl'} alt={'Gambar Penyakit'}
                                   width={500} height={250}/>
                            <p className={'py-2'}>
                                {
                                    // @ts-ignore
                                    result ? result.penyakit.nama_penyakit : ''
                                }
                            </p>

                            <div className={'persentase flex flex-col my-5 gap-5 w-full'}>
                                <h1 className={'font-bold'}>Presentase Tingkat Kepercayaan : </h1>
                                <div className={'presentase'}>
                                    {" "}
                                    <CircularProgressbar                                        // @ts-ignore

                                        value={(result ? (result.persentase) : (0))}                                        // @ts-ignore
                                        // @ts-ignore

                                        text={(result ? (result.persentase) : (0)) + `%`}
                                    />
                                </div>
                            </div>
                            <hr className={'my-2'}/>
                            <div className={'asd'}>
                                <h1 className={'text-sm'}>Penyakit Lain yang mungkin terjadi</h1>
                                <div className={''}>
                                    <div>
                                        <ul>
                                            <li className={'flex flex-row justify-between py-2 border-b'}>
                                                <div>
                                                    <b>
                                                        Nama
                                                    </b>
                                                </div>
                                                <div>
                                                    <b>10%</b>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Card>
                </div>

            </div>
        </main>
    );
}
