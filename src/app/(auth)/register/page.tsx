"use client"
import Image from "next/image";
import React from "react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {useForm} from "react-hook-form";
import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/solid'

import {map, z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import {Images} from "lucide-react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";
import {useToast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";
const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username harus lebih dari 2 karakter.",
    }),
    email: z.string().min(2, {
        message: "Masukkan alamat email valid",
    }),
    password: z.string().min(1, {
        message: "password tidak boleh Kosong",
    }),
    retypePassword: z.string().min(1, {
        message: "password tidak boleh Kosong",
    }),


}).refine((values)=>{
    return values.password===values.retypePassword
},{
    message: 'password tidak sama',
    path: ['retypePassword']
})

export default function Register() {
    const router = useRouter();
    const {toast} = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            retypePassword: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.

        // ✅ This will be type-safe and validated.
        const username = values.username
        const password = values.password
        const first_name = ''
        const last_name =''
        const email = values.email
        const address = ''
        const apiUrl = process.env.NEXT_PUBLIC_BE_URL;
        const response = await fetch(apiUrl+'/v1/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, address, first_name, last_name,email }),
        })
        const data = response.json();
        data.then(responseData => {
            // Use the response data here
            console.log('Received response data:', response.status);
            // console.log('Response data:', data.then());
            if (response.status!==200){
                console.log('Received response data:', responseData['status_code']);
                // Handle errors
                if (responseData['status_code'].toString()== '42201') {
                    form.setError('username', {message: 'Username atau email telah digunakan'});
                    form.setError('email', {message: 'Username atau email telah digunakan'});
                }else if(responseData['status_code'].toString()=='42203'){

                    form.setError('password', {message: 'password harus mengandung huruf besar, huruf kecil, angka dan karakter spesial'});
                    form.setError('retypePassword', {message: 'password harus mengandung huruf besar, huruf kecil, angka dan karakter spesial'});
                }
            }else if(response.status === 200) {

                toast({
                    title: "Registrasi Berhasil !",
                    variant: "default",
                    className: cn(
                        'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5 bg-primary  text-white'
                    ),
                    action: (
                        <ToastAction altText="Goto schedule to undo" onClick={()=>(router.push('/login'))}>Login</ToastAction>
                    ),
                    description: "Silakan Login untuk melanjutkan",
                })
                form.reset()

            } else {
                console.log('haha error')
                // Handle errors
                form.setError('username', { message: 'Username atau Password salah' });
                form.setError('password', { message: 'Username atau Password salah' });
            }
        })
            .catch(error => {
                // Handle error case
                console.error('Error in fetchData:', error);
            });
    }

    return (
        <div className={'text-black md:my-auto px-8 xl:px-12 gap-4 flex flex-col my-8'}>
            <div className={'login-log mx-auto mb-4'}>
                <Link href={'/'}>
                    <Image src={'/img/logo.svg'} alt={'logo'} width={200} height={100}></Image>
                </Link>
            </div>
            <h1 className={'title text-lg font-bold'}>
                Daftar ke AGRI
            </h1>
            <p className={'text-sm text-gray-600'}>
                Daftar ke AGRI Chicken Health Diagnose untuk melakukan diagnosa dan melihat riwayat diagnosa.
            </p>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="username" {...field} className={'bg-gray-100 border-gray-700'}/>
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
                                    <Input placeholder="email" {...field} type={'email'} className={'bg-gray-100 border-gray-700'}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="*****" type={'password'} {...field}  className={'bg-gray-100 border-gray-700'}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="retypePassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ulangi Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="*****" type={'password'} {...field}  className={'bg-gray-100 border-gray-700'}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className={'rounded-full'}>Register</Button>
                </form>
            </Form>
            <div>
                Sudah punya Akun ? {" "}<Link href={'/login'} className={'underline text-md'}>Login</Link>
            </div>
        </div>
    );
}
