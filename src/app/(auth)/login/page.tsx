"use client"
import Image from "next/image";
import React, {FormEvent} from "react";
import {Button} from "@/components/ui/button";

import {useForm} from "react-hook-form";

import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl, FormDescription,
    FormField,
    FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from 'next/navigation'


const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(2, {
        message: "password cannot be empty",
    }),
})

export default function Login() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        const username = values.username
        const password = values.password
        const apiUrl = process.env.NEXT_PUBLIC_BE_URL;

        const response = await fetch(apiUrl+'/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
        const data = response.json();
        data.then(responseData => {
            // Use the response data here
            console.log('Received response data:', response.status);
            // console.log('Response data:', data.then());
            if (response.status!==200){
                // Handle errors
                form.setError('username', { message: 'Username atau Password salah' });
                form.setError('password', { message: 'Username atau Password salah' });
            }else if(!responseData['data']['accesstoken'].isEmpty) {
                localStorage.setItem('accessToken', responseData['data']['accesstoken'])
                localStorage.setItem('login', 'true')
                // console.log(response.json())
                router.push('/homepage')
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
        <div className={'text-black my-auto px-8 xl:px-12 gap-4 flex flex-col'}>
            <div className={'login-log mx-auto mb-4'}>
                <Link href={'/'}>
                    <Image src={'/img/logo.svg'} alt={'logo'} width={200} height={100}></Image>
                </Link>
            </div>
            <h1 className={'title text-lg font-bold'}>
                Login ke AGRI
            </h1>
            <p className={'text-sm text-gray-600'}>
                Login ke AGRI Chicken Health Diagnose untuk melakukan diagnosa dan melihat riwayat diagnosa.
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
                                    <Input placeholder="username atau email" {...field} className={'bg-gray-100 border-gray-700'}/>
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
                    <Button type="submit" className={'rounded-full'}>Login</Button>
                </form>
            </Form>
            <div>
                Belum punya Akun ? {" "}<Link href={'/register'} className={'underline text-md'}>Register</Link>
            </div>
        </div>

    );
}
