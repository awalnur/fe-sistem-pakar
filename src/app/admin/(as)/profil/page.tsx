"use client"
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {useForm} from "react-hook-form";

import {map, z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";

import {MapIcon, PencilIcon, Plus, PlusSquare, Trash, Trash2} from "lucide-react";
import {Nav} from "@/app/(user)/nav";
import { Separator } from "@radix-ui/react-separator";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Header} from "@/lib/header";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {cn} from "@/lib/utils";
import {useToast} from "@/components/ui/use-toast";
import {Skeleton} from "@/components/ui/skeleton";
const BE_URL = process.env.NEXT_PUBLIC_BE_URL


const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().min(2, {
        message: "email tidak boleh kosong",
    }),
    first_name: z.string().min(2, {
        message: "nama depan tidak boleh kosong",
    }),
    last_name: z.string().min(2, {
        message: "nama belakang tidak boleh kosong",
    }),
    address: z.string().min(2, {
        message: "alamat tidak boleh kosong",
    }),

})
const updatePasswordSchemas = z.object({
    password: z.string().min(8, {
        message: "panjang password minimal 8 karakter",
    }),
    newpassword: z.string().min(8, {
        message: "panjang password minimal 8 karakter",
    }),
    new_password: z.string().min(8, {
        message: "panjang password minimal 8 karakter",
    }),
}).refine((values)=>{
    return values.newpassword===values.new_password
},{
    message: 'password tidak sama',
    path: ['new_password']
})

interface NavProps {
    isCollapsed: boolean
    links: {
        title: string
        label?: string
        variant: "default" | "ghost"
    }[]
}
export default function Profil() {
    const [userdata, setUserdata] = useState({})
    const apiUrl = process.env.NEXT_PUBLIC_BE_URL

    const {toast} = useToast()

    const fetchDataUser = async () => {
        try {
            const response = await fetch(BE_URL + '/v1/user/current_user',
                {
                    method: 'GET',
                    headers: Header()
                });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const userdata = await response.json();

            console.log('Response data:', userdata);

            setUserdata(userdata)

            form.setValue('username', userdata.username?userdata.username:(''))
            form.setValue('email', userdata.email?userdata.email:(''))
            form.setValue('address', userdata.alamat?userdata.alamat:(''))
            form.setValue('first_name', userdata.nama_depan?userdata.nama_depan:(''))
            form.setValue('last_name', userdata.nama_belakang?userdata.nama_belakang:(''))
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error case
        }
    };
    // console.log('usenrame', userdata.username)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username:'',
            email:'',
            address:'',
            first_name:'',
            last_name:'',
        },
    })
    const updatePasswordform = useForm<z.infer<typeof updatePasswordSchemas>>({
        resolver: zodResolver(updatePasswordSchemas),
        defaultValues: {
            password: '',
            newpassword: '',
            new_password: ''
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>){

        const username = values.username
        const first_name = values.first_name
        const last_name = values.last_name
        const email = values.email
        const address = values.address

        const response = await fetch(apiUrl+'/v1/user/update_profile', {
            method: 'PUT',
            headers: Header(),
            body: JSON.stringify({ username, first_name, last_name, email, address}),
        })
        const data = response.json();
        data.then(responseData => {
            // Use the response data here
            console.log('Received response data:', response.status);
            // console.log('Response data:', data.then());
            if (response.status === 200) {
                toast({
                    title: "Info !",
                    variant: "default",
                    className: cn(
                        'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5 bg-primary  text-white'
                    ),
                    description: "Profil berhasil diubah",
                })
                fetchDataUser()
            } else {
                toast({
                    title: "Info !",
                    variant: "destructive",
                    className: cn(
                        'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5'
                    ),
                    description: "Gagal menyimpan profil",
                })
            }
        })
    }
    async function onPasswordChangeSubmit(values: z.infer<typeof updatePasswordSchemas>){
        const password = values.password
        const new_password = values.new_password

        const response = await fetch(apiUrl+'/v1/user/update_password', {
            method: 'PUT',
            headers: Header(),
            body: JSON.stringify({ password, new_password}),
        })
        const data = response.json();
        data.then(responseData => {
            // Use the response data here
            console.log('Received response data:', response.status);
            // console.log('Response data:', data.then());
            if (response.status === 200) {
                toast({
                    title: "Info !",
                    variant: "default",
                    className: cn(
                        'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5 bg-primary  text-white'
                    ),
                    description: "Password berhasil diubah",
                })
                fetchDataUser()
            } else {
                updatePasswordform.setError('password', {'message': 'password salah atau tidak sesuai'});
                updatePasswordform.setError('new_password', {'message': 'password salah atau  tidak sesuai'});
                updatePasswordform.setError('newpassword', {'message': 'password salah atau  tidak sesuai'});
                toast({
                    title: "Info !",
                    variant: "destructive",
                    className: cn(
                        'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5'
                    ),
                    description: "Gagal mengubah password",
                })
            }
        })
    }

    // 2. Define a submit handler.
    useEffect(() => {

        fetchDataUser();
        let data = null

    }, []);
    return (
        <main className="block">
            <div className="flex w-full min-h-screen flex-col items-center justify-between z-10 top-0 left-0 pb-24  ">

                <div className={'relative w-full  flex lg:gap-5 py-5'}>
                    <div className={'content flex flex-col w-full'}>
                        <div className={'grid grid-cols-2 gap-5'}>
                            <Card className={'flex w-full bg-[#ffffff90] rounded-2xl backdrop-blur border px-4 py-2  gap-5'}>
                                <div className={'box-content w-full p-5'}>
                                    <div id={'title'}>
                                        <h1 className={'text-lg font-bold'}>
                                            Update Profile
                                            <Separator className={'w-full border-b py-1'}/>
                                        </h1>
                                        <div className={'text-sm text-gray-600 py-1 mt-2 '}>
                                            {
                                                userdata?(
                                                    <Form {...form} >
                                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                                                            <FormField
                                                                control={form.control}
                                                                name="username"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Username</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="username" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700' }/>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="email"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Email</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="email" {...field} className={'bg-gray-100 lg:w-8/12  border-gray-700'}/>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <div className={'flex gap-5'}>
                                                                <FormField
                                                                    control={form.control}
                                                                    name="first_name"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Nama Depan</FormLabel>
                                                                            <FormControl>
                                                                                <Input placeholder="Nama Depan" {...field} className={'bg-gray-100 border-gray-700'}/>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                                <FormField
                                                                    control={form.control}
                                                                    name="last_name"
                                                                    render={({ field }) => (
                                                                        <FormItem>
                                                                            <FormLabel>Nama Akhir</FormLabel>
                                                                            <FormControl>
                                                                                <Input placeholder="Nama Akhir" {...field} className={'bg-gray-100  border-gray-700'}/>
                                                                            </FormControl>
                                                                            <FormMessage />
                                                                        </FormItem>
                                                                    )}
                                                                />
                                                            </div>
                                                            <FormField
                                                                control={form.control}
                                                                name="address"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Alamat</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea placeholder="Alamat" {...field} className={'bg-gray-100  border-gray-700'}>
                                                                            </Textarea>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <Button type="submit" className={'rounded-full'}>Update Profil</Button>
                                                        </form>
                                                    </Form>
                                                ):(
                                                    <Skeleton className={'w-full h-12'}/>
                                                )
                                            }

                                        </div>
                                    </div>
                                </div>
                            </Card>
                            <Card className={'flex w-full bg-[#ffffff90] rounded-2xl backdrop-blur border px-4 py-2  gap-5 h-fit'}>
                                <div className={'box-content w-full p-5'}>
                                    <div id={'title'}>
                                        <h1 className={'text-lg font-bold'}>
                                            Update Password
                                            <Separator className={'w-full border-b py-1'}/>

                                        </h1>
                                        <div className={'text-sm text-gray-600 py-1 mt-2 '}>

                                            <Form {...updatePasswordform} >
                                                <form onSubmit={updatePasswordform.handleSubmit(onPasswordChangeSubmit)}
                                                      className="space-y-4 mt-2">
                                                    <FormField
                                                        control={updatePasswordform.control}
                                                        name="password"
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel>Password</FormLabel>
                                                                <FormControl>
                                                                    <Input type={'password'}
                                                                           placeholder="password" {...field}
                                                                           className={'bg-gray-100 lg:w-8/12  border-gray-700'}/>
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={updatePasswordform.control}
                                                        name="newpassword"
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel>Password Baru</FormLabel>
                                                                <FormControl>
                                                                    <Input type={'password'}
                                                                           placeholder="password" {...field}
                                                                           className={'bg-gray-100 lg:w-8/12  border-gray-700'}/>
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={updatePasswordform.control}
                                                        name="new_password"
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel>Ulangi Password Baru</FormLabel>
                                                                <FormControl>
                                                                    <Input  type={'password'}
                                                                            placeholder="password" {...field}
                                                                            className={'bg-gray-100 lg:w-8/12  border-gray-700'}/>
                                                                </FormControl>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <Button type="submit" className={'rounded-full'}>Update
                                                        Password</Button>
                                                </form>
                                            </Form>
                                            <h5 className={'font-medium pt-5'}>Ketentuan</h5>
                                            <div className={''}>
                                                <Separator className={'my-2 border-b'}/>
                                                <ul>
                                                    <li>Password terdiri dari 8 karakter</li>
                                                    <li>Password mengandung huruf besar</li>
                                                    <li>Password mengandung huruf kecil</li>
                                                    <li>Password mengandung spesial karakter</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
