'use client'
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Header} from "@/lib/header";
import Link from "next/link";
import {ChevronLeft, ChevronRight, PlusCircle} from "lucide-react";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {toast} from "@/components/ui/use-toast";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {Separator} from "@radix-ui/react-separator";
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
})

const updatePasswordSchemas = z.object({
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


export default function UpdateUserPage() {
    const router = usePathname().split('/')
    const kode_pengguna=router[router.length-1]
    const [result, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);

    const newUser = useForm<z.infer<typeof userdata>>({
        resolver: zodResolver(userdata),
        defaultValues: {
            username:'',
            email:'',
            nama_depan:'',
            nama_belakang:'',
            alamat:'',
        },
    })

    const updatePasswordform = useForm<z.infer<typeof updatePasswordSchemas>>({
        resolver: zodResolver(updatePasswordSchemas),
        defaultValues: {
            newpassword: '',
            new_password: ''
        },
    })



    async function onSubmit(values: z.infer<typeof userdata>) {
        const username = values.username
        const email = values.email
        const first_name = values.nama_depan
        const last_name = values.nama_belakang
        const address = values.alamat
        try{
            const response = await fetch(BE_URL+'/v1/user/update_profile?kode_user='+kode_pengguna, {
                method: 'PUT',
                headers: Header(),
                body: JSON.stringify({username, email, first_name, last_name, address}),
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

            // newUser.reset()
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

    async function onPasswordChangeSubmit(values: z.infer<typeof updatePasswordSchemas>){
        const password = 'none'
        const new_password = values.new_password

        const response = await fetch(BE_URL+'/v1/user/update_password?kode_user='+kode_pengguna, {
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
                updatePasswordform.reset()
            } else {
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
    const fetchData = async () => {
        try {
            let response = null
            // if (login){
            response = await fetch(BE_URL + '/v1/user/get/'+kode_pengguna,
                {
                    method: 'GET',
                    headers: Header()
                });
            // }else{
            //     response = await fetch(BE_URL + '/v1/diagnose/result/'+id_riwayat+'/public');
            // }
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const result = await response.json();
            console.log('Response data:', result);
            setData(result['data']);
            newUser.setValue('username', result['data']['username'])
            newUser.setValue('nama_depan', result['data']['nama_depan'])
            newUser.setValue('nama_belakang', result['data']['nama_belakang'])
            newUser.setValue('email', result['data']['email'])
            newUser.setValue('alamat', result['data']['alamat'])
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error case
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchData();
    }, []);



    return (
        <div className={'py-10'}>
            <Card>
                <CardHeader className={'flex flex-row gap-5 border-b py-3'}>
                    <Link href={'/admin/pengguna'} className={'flex gap-2 -ml-5 w-fit px-5 py-2 text-green-600  rounded-lg'} ><ChevronLeft/> Kembali</Link>
                        <h1 className={'text-xl my-auto font-medium'}>Edit Pengguna </h1>

                </CardHeader>
                <CardContent className={'py-5'}>
                    <Form {...newUser}>
                        <form  onSubmit={newUser.handleSubmit(onSubmit)} encType="multipart/form-data" className={'flex-col flex gap-3 '}>
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

                            <Button type={'submit'} variant={'default'} className={'w-56 mt-5'}> Simpan</Button>
                        </form>
                    </Form>
                    <Separator className={'border-b my-10'}/>
                    <h1 className={'text-lg font-bold'}>Ubah Password Pengguna</h1>

                    <Form {...updatePasswordform} >
                        <form onSubmit={updatePasswordform.handleSubmit(onPasswordChangeSubmit)}
                              className="space-y-4 mt-2">

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

                            <Button type="submit" className={'rounded-lg w-56'}>Update
                                Password</Button>
                        </form>
                    </Form>
                    <h5 className={'font-medium text-sm pt-5'}>Ketentuan</h5>
                    <div className={''}>
                        <Separator className={'my-2 border-b text-xs'}/>
                        <ul>
                            <li>Password terdiri dari 8 karakter</li>
                            <li>Password mengandung huruf besar</li>
                            <li>Password mengandung huruf kecil</li>
                            <li>Password mengandung spesial karakter</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

        </div>
    )

}