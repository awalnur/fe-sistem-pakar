"use client"
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {useForm} from "react-hook-form";
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid'

import {map, z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import Link from "next/link";
const formSchema = z.object({
    searhcinput: z.string().min(0, {
        message: "Username must be at least 2 characters.",
    }),
})

const BE_URL = process.env.NEXT_PUBLIC_BE_URL

export default function Penyakit() {
    const [penyakit, setData] = useState(null);
    const [hasilPencarian, setDataPencarian] = useState('');
    const [isLoading, setLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            searhcinput: "",
        },
    })
    const fetchData = async (cari='') => {
        try {
            let response = null
            if (cari==''){
                response = await fetch(BE_URL + '/v1/penyakit/most', {
                    method: 'GET'
                });
            }else{
                response = await fetch(BE_URL + '/v1/penyakit/search?search='+cari, {
                    method: 'GET'
                });
            }
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


    useEffect(() => {
        fetchData(hasilPencarian);
    }, [hasilPencarian]);
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        setDataPencarian(values.searhcinput)
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <main className="block">
            <div className="flex w-full min-h-screen flex-col items-center justify-between z-10 top-0 left-0 pb-24  ">

                <div className={"absolute -z-40 xl:w-6/12 right-0 bg-hero-pattern h-screen bg-cover "}>
                </div>

                <div
                    className="relative flex flex-col w-full lg:gap-5 xl:top-64 z-50 left-0 justify-between font-mono text-sm lg:flex mb-64 h-auto">
                    <div className={'text-black'}>
                        <h1 className={'title text-xl font-bold md:text-center'}>
                            Temukan data penyakit ayam
                        </h1>
                        <p className={'descriptif text-center text-gray-600 mx-auto mt-2'}>
                            Cari tau dan cek data penyakit ayam yang ada.
                        </p>
                    </div>
                    <div className={'relative search max-w-3xl w-full mx-auto'}>
                        <Card className={'rounded-full justify-between'}>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full h-14">
                                    <FormField
                                        control={form.control}
                                        name={`searhcinput`}
                                        render={({field}) => (
                                            <FormItem className={'w-full xl:-mr-28 border-20'}>
                                                <FormControl>
                                                    <Input placeholder="Cari Data Penyakit" {...field}
                                                        onKeyUp={form.handleSubmit(onSubmit)}
                                                           className={'border-0 rounded-full py-2 px-4 h-full'}/>
                                                </FormControl>
                                            </FormItem>
                                        )}></FormField>
                                    <Button className={'my-auto rounded-full pr-2'} type="submit">Cari {" "}
                                        <MagnifyingGlassCircleIcon className={'ml-2 w-8'}/> </Button>
                                </form>

                            </Form>
                        </Card>

                    </div>
                    <div id={'latest'} className={' w-full xl:px-96 xl:py-20 my-15'}>
                        <div className={'title'}>
                            <h1 className={'xl:text-2xl font-bold font-sans py-3'}>
                                { hasilPencarian?'Hasil Pencarian':'Banyak di cari'}
                            </h1>
                        </div>
                        <div className={'w-full grid grid-cols-3 gap-5'}>
                            {isLoading ? (
                                    <p>Loading...</p>
                                ) : (
                                penyakit ? (

                                        penyakit.length>0?(
                                    penyakit.map((penyakit) => (
                                        <Card className={'col-span-1 h-28 backdrop-blur bg-[#ffffff80] xl:p-4 flex rounded-2xl gap-2'} key={penyakit.nama_penyakit}>
                                            <div className={'image aspect-square'}>
                                                <Image src={'/img/default.png'} className={'rounded-xl'} alt={'img'} width={500} height={500}></Image>
                                            </div>
                                            <div className={'w-full mx-2'}>
                                                <h2 className={'font-bold'}>{penyakit.nama_penyakit}</h2>
                                                <div className={'flex flex-col'}>
                                                    <p className={'text-xs text-gray-600'}>
                                                        {penyakit.definisi?(penyakit.definisi.substring(0, 30)):('Definisi tidak tersedia')}
                                                    </p>
                                                    <Link href={'/penyakit/detail/'+penyakit.kode_penyakit} className={'mt-2'}>Lihat Detail</Link>
                                                </div>
                                            </div>
                                        </Card>
                                       )
                                    )): (
                                            <p>Data tidak tersedia</p>

                                        )
                                ) : (
                                    <p>Data tidak tersedia</p>
                                )
                            )
                            }
                        </div>
                    </div>
                </div>
                <div
                    className="p-15 flex justify-between text-center z-50 lg:max-w-5xl lg:w-full lg:grid-cols-4 lg:text-left border-2 rounded-full">
                    <div
                        className="group rounded-lg border border-transparent px-5 py-4 transition-colors my-auto ml-8 "
                    >
                        <h2 className={`mb-1 text-2xl font-semibold`}>
                            Ada masalah pada kesehatan Ayam Anda? {" "}
                        </h2>
                        <p className={`m-0  text-sm opacity-50`}>
                            Cari tahu penyakit yang diderita ayam anda berdasarkan gejala-gejala yang terjadi.
                        </p>
                    </div>
                    <a
                        href="/diagnosa"
                        className="my-auto mr-5 group rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <h2 className={`text-lg font-semibold`}>
                            Diagnosa Sekarang {" "}
                            <span
                                className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                      -&gt;
                    </span>
                        </h2>
                    </a>
                </div>
            </div>
        </main>
    );
}
