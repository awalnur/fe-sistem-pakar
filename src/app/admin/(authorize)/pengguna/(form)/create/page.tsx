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
    //FIXME in files:
    // - asdas
    // - asdsa
    // - ASDASD

//TODO
// DOCUMENT
// BUG

const BE_URL = process.env.NEXT_PUBLIC_BE_URL

const userdata = z.object({
    // gambar
    username: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    email: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    nama_depan: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    nama_belakang: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    alamat: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    password: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
    retype_password: z.string().min(2,{
        message: "Field ini wajib diisi"
    }),
}).refine((values)=>{
    return values.password===values.retype_password
},{
    message: 'password tidak sama',
    path: ['retype_password']
})

export default function CreateUserPage() {

    const header = Header()


    const newUser = useForm<z.infer<typeof userdata>>({
        resolver: zodResolver(userdata),
        defaultValues: {
            username:'',
            email:'',
            nama_depan:'',
            nama_belakang:'',
            alamat:'',
            password:'',
            retype_password:'',
        },
    })

    async function onSubmit(values: z.infer<typeof userdata>) {

        const username = values.username
        const email = values.email
        const nama_depan = values.nama_depan
        const nama_belakang = values.nama_belakang
        const alamat = values.alamat
        const password = values.retype_password
        try{
            const response = await fetch(BE_URL+'/v1/user/create', {
                method: 'POST',
                headers: Header(),
                body: JSON.stringify({username, email, nama_depan, nama_belakang, alamat, password}),
            })
            if (!response.ok) {
                throw new Error('gagal menambahkan user baru');
            }

            // closeDialog(index)
            toast({
                title: "Info !",
                variant: "default",
                className: cn(
                    'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5 bg-primary  text-white'
                ),
                description: "Pengguna Baru Berhasil ditambahkan",
            })

            newUser.reset()
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
                    <Link href={'/admin/pengguna'} className={'flex gap-2 -ml-5 w-fit px-5 py-2 text-green-600  rounded-lg'} ><ChevronLeft/> Kembali</Link>
                    <h1 className={'text-xl my-auto font-medium'}>Tambahkan Pengguna Baru</h1>

                </CardHeader>
                <CardContent className={'py-5'}>
                    <Form {...newUser}>
                        <form  onSubmit={newUser.handleSubmit(onSubmit)} encType="multipart/form-data" className={'flex-col flex gap-3'}>
                            <FormField
                                control={newUser.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Username" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={newUser.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alamat Email</FormLabel>
                                        <FormControl>
                                            <Input type={'email'} placeholder="Alamat Email" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className={'flex gap-4'}>

                                <FormField
                                    control={newUser.control}
                                    name="nama_depan"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Depan</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nama Depan" {...field} className={'bg-gray-100 w-full  border-gray-700' }/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={newUser.control}
                                    name="nama_belakang"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Belakang</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nama Belakang" {...field} className={'bg-gray-100 lg:w-full  border-gray-700' }/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={newUser.control}
                                name="alamat"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alamat</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Alamat" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={newUser.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type={'password'} placeholder="Password" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={newUser.control}
                                name="retype_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ulangi Password</FormLabel>
                                        <FormControl>
                                            <Input type={'password'} placeholder="Ulangi Password" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
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