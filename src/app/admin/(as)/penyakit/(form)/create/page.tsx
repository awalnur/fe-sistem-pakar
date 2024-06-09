'use client'
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Header} from "@/lib/header";
import Link from "next/link";
import {ChevronLeft, ChevronRight, PlusCircle} from "lucide-react";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {toast} from "@/components/ui/use-toast";
import {cn} from "@/lib/utils";


const BE_URL = process.env.NEXT_PUBLIC_BE_URL

const desease = z.object({
    // gambar
    kode_penyakit: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    nama_penyakit: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    definisi: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    penyebab: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    penularan: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    pencegahan: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    penanganan: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    gambar:z.any()
        .refine((files) => files?.length == 1, "Image is required.")
        ,
    // z.string().min(2, {
    //     message: "alamat peternakan tidak boleh kosong",
    // })
})

export default function CreatePenyakitPage() {

    const header = Header()


    const createDesease = useForm<z.infer<typeof desease>>({
        resolver: zodResolver(desease),
        defaultValues: {
            kode_penyakit:'',
            nama_penyakit:'',
            definisi:'',
            penyebab:'',
            penularan:'',
            pencegahan:'',
            penanganan:'',
        },
    })
    const fileRef = createDesease.register("gambar");
    async function onSubmit(values: z.infer<typeof desease>) {
        const formData = new FormData();

        formData.append('kode_penyakit', values.kode_penyakit)
        formData.append('nama_penyakit', values.nama_penyakit)
        formData.append('definisi', values.definisi)
        formData.append('penyebab', values.penyebab)
        formData.append('penularan', values.penularan)
        formData.append('pencegahan', values.pencegahan)
        formData.append('penanganan', values.penanganan)
        formData.append('gambar', values.gambar[0])
        delete header['Content-Type']
        console.log(header)
        try{
            const response = await fetch(BE_URL+'/v1/penyakit/create', {
                method: 'POST',
                headers: header,
                body: formData,
            })
            if (!response.ok) {
                throw new Error('Failed to delete data');
            }

            // closeDialog(index)
            toast({
                title: "Info !",
                variant: "default",
                className: cn(
                    'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5 bg-primary  text-white'
                ),
                description: "Tambah Data Penyakit Berhasil",
            })
            // fetchGejala(limit, currentPage)

        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: "Peringatan!",
                variant: "destructive",
                className: cn(
                    'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5'
                ),
                description: "Terjadi Kesalahan saat menyimpan",
            })
        }

    }
    return (
        <div className={'py-10'}>
            <Card>
                <CardHeader className={'flex flex-row gap-5 border-b py-3'}>
                    <Link href={'/admin/penyakit'} className={'flex gap-2 -ml-5 w-fit px-5 py-2 text-green-600 rounded-xl'} ><ChevronLeft/> Kembali</Link>
                    <h1 className={'text-xl my-auto font-medium'}>Tambahkan Data penyakit</h1>

                </CardHeader>
                <CardContent className={'py-5'}>
                    <Form {...createDesease}>
                        <form  onSubmit={createDesease.handleSubmit(onSubmit)} encType="multipart/form-data" className={'flex-col flex gap-3'}>
                            <FormField
                                control={createDesease.control}
                                name="kode_penyakit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kode Penyakit</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Kode Penyakit" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createDesease.control}
                                name="nama_penyakit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Penyakit</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nama Penyakit" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createDesease.control}
                                name="definisi"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Deskripsi Penyakit</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Deskripsi Penyakit" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createDesease.control}
                                name="penyebab"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Penyebab Penyakit</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Penyebab Penyakit" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createDesease.control}
                                name="penularan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Penularan Penyakit</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Penularan Penyakit" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createDesease.control}
                                name="pencegahan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pencegahan Penyakit</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Pencegahan Penyakit" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createDesease.control}
                                name="penanganan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Penanganan Penyakit</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Penanganan Penyakit" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createDesease.control}
                                name="gambar"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Penanganan Penyakit</FormLabel>
                                        <FormControl>
                                            <Input type={'file'} placeholder="Penanganan Penyakit" {...fileRef} className={'bg-gray-100 w-96  border-gray-700' }/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type={'submit'} variant={'default'} className={'w-56 mt-5'}> Simpan</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )

}