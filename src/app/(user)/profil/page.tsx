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

const farmSchema = z.object({
    nama_peternakan: z.string().min(2, {
        message: "nama peternakan tidak boleh kosong",
    }),
    alamat_peternakan: z.string().min(2, {
        message: "alamat peternakan tidak boleh kosong",
    })
})

const farmUpdateSchema = z.object({
    kode_peternakan: z.number().min(0, {
        message: "kode peternakan tidak boleh kosong",
    }),
    nama_peternakan: z.string().min(2, {
        message: "nama peternakan tidak boleh kosong",
    }),
    alamat_peternakan: z.string().min(2, {
        message: "alamat peternakan tidak boleh kosong",
    })
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
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const [lokasiPeternakan, setLokasiPeternakan] = useState([null])
    const [userdata, setUserdata] = useState({})
    const [loadingPeternakan, setLoadingPeternakan] = useState(false)
    const [open, setOpen] = useState(false)
    const [dialogOpen, setOpenDialog] = useState(false)
    const apiUrl = process.env.NEXT_PUBLIC_BE_URL
    const [dialogStates, setDialogStates] = useState({}); // State to store dialog open/close states
    const [editDialogStates, setEditDialogStates] = useState({}); // State to store dialog open/close states

// @ts-ignore
    const closeDialog = (index) => {
        setDialogStates(prevState => ({
            ...prevState,
            [index]: false // Close the dialog at index
        }));
    };

    const {toast} = useToast()


    const fetchDataFarm = async () => {
        try {
            const response = await fetch(BE_URL + '/v1/farm/farm?limit=100',
                {
                    method: 'GET',
                    headers: Header()
                });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const dataPeternakan = await response.json();
            console.log('Response data:', dataPeternakan);
            setLokasiPeternakan(dataPeternakan['data']['entries']);
            setLoadingPeternakan(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error case
            setLoadingPeternakan(false);
        }
    };

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

    const addAlamat = useForm<z.infer<typeof farmSchema>>({
        resolver: zodResolver(farmSchema),
        // defaultValues: {
        //     nama_peternakan: '',
        //     alamat_peternakan: '',
        // },
    })
    const updateFarmAlamat = useForm<z.infer<typeof farmUpdateSchema>>({
        resolver: zodResolver(farmUpdateSchema)
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
    async function onSubmitAddAlamat(values: z.infer<typeof farmSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        const nama_peternakan = values.nama_peternakan
        const alamat_peternakan = values.alamat_peternakan

        const response = await fetch(apiUrl+'/v1/farm/create', {
            method: 'POST',
            headers: Header(),
            body: JSON.stringify({ nama_peternakan, alamat_peternakan }),
        })
        const data = response.json();
        data.then(responseData => {
            // Use the response data here
            console.log('Received response data:', response.status);
            // console.log('Response data:', data.then());
            if (response.status!==200){
                // Handle errors
                addAlamat.setError('nama_peternakan', { message: 'Nama peternakan tidak sesuai atau sudah digunakan' });
                addAlamat.setError('alamat_peternakan', { message: 'Alamat peternakan tidak sesuai atau sudah digunakan' });
            } else if(response.status===200){
                toast({
                    title: "Info !",
                    variant: "default",
                    className: cn(
                        'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5 bg-primary  text-white'
                    ),
                    description: "Peternakan berhasil ditambahkan",
                })
                if (open === true) {
                    setOpen(false)
                }
                addAlamat.reset()
                fetchDataFarm()
            }else {
                console.log('haha error')
                addAlamat.setError('nama_peternakan', { message: 'Nama peternakan tidak sesuai atau sudah digunakan' });
                addAlamat.setError('alamat_peternakan', { message: 'Alamat peternakan tidak sesuai atau sudah digunakan' });
            }
        })
            .catch(error => {
                // Handle error case
                console.error('Error:', error);
            });
    }
    async function onSubmitUpdateAlamat(values: z.infer<typeof farmUpdateSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const kode = values.kode_peternakan
        const nama_peternakan = values.nama_peternakan
        const alamat_peternakan = values.alamat_peternakan
        const response = await fetch(apiUrl+'/v1/farm/update/'+kode, {
            method: 'PUT',
            headers: Header(),
            body: JSON.stringify({ nama_peternakan, alamat_peternakan }),
        })
        const data = response.json();
        data.then(responseData => {
            // Use the response data here
            console.log('Received response data:', response.status);
            // console.log('Response data:', data.then());
            if (response.status!==200){
                // Handle errors
                updateFarmAlamat.setError('nama_peternakan', { message: 'Nama peternakan tidak sesuai atau sudah digunakan' });
                updateFarmAlamat.setError('alamat_peternakan', { message: 'Alamat peternakan tidak sesuai atau sudah digunakan' });
            } else if(response.status===200){
                toast({
                    title: "Info !",
                    variant: "default",
                    className: cn(
                        'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5 bg-primary  text-white'
                    ),
                    description: "Peternakan berhasil diubah",
                })

                fetchDataFarm()
                Object.keys(editDialogStates).forEach(key => {

                    // @ts-ignore
                    if (editDialogStates[key] === true) {

                        // @ts-ignore
                        editDialogStates[key]=false
                    }
                });
            }else {
                console.log('haha error')
                updateFarmAlamat.setError('nama_peternakan', { message: 'Nama peternakan tidak sesuai ' });
                updateFarmAlamat.setError('alamat_peternakan', { message: 'Alamat peternakan tidak sesuai ' });
            }
        })
            .catch(error => {
                // Handle error case
                console.error('Error:', error);
            });
    }
    // @ts-ignore
    async function HapusFarm(id, index){
        try {
            const response = await fetch(BE_URL + '/v1/farm/delete/'+id,
                {
                    method: 'DELETE',
                    headers: Header()
                });
            if (!response.ok) {
                throw new Error('Failed to delete data');
            }

            closeDialog(index)
            toast({
                title: "Info !",
                variant: "default",
                className: cn(
                    'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5 bg-primary  text-white'
                ),
                description: "Pata Peternakan Berhasil Dihapus",
            })
            fetchDataFarm()

        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: "Peringatan!",
                variant: "destructive",
                className: cn(
                    'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5'
                ),
                description: "Terjadi Kesalahan saat menghapus data",
            })
        }
    }
    // @ts-ignore
    function getFarmData(index){
        let data = lokasiPeternakan[index]
        // console.log(data)
        return data
    }
    useEffect(() => {

        fetchDataFarm();
        fetchDataUser();
        let data = null
        Object.keys(editDialogStates).forEach(key => {
            // @ts-ignore
            if (editDialogStates[key] === true) {
                data = getFarmData(key)
            }
        });
        // @ts-ignore
        updateFarmAlamat.setValue('kode_peternakan', data?data.kode_peternakan:'')
        // @ts-ignore
        updateFarmAlamat.setValue('nama_peternakan', data?data.nama_peternakan:'')
        // @ts-ignore
        updateFarmAlamat.setValue('alamat_peternakan', data?data.alamat_peternakan:'')

    }, [editDialogStates, updateFarmAlamat]);
    return (
        <main className="block">
            <div className="flex w-full min-h-screen flex-col items-center justify-between z-10 top-0 left-0 pb-24  ">

                <div className={"fixed -z-40 3xl:w-6/12 w-full lg:w-8/12 right-0 bg-hero-pattern h-screen bg-cover "}>
                </div>

                <div className={'relative w-full top-20 xl:px-64 p-6 xl:py-16 flex lg:gap-5'}>
                    <div className={'hidden md:block sticky z-50 top-24 h-fit w-3/12 rounded-xl border'}>
                        <div
                            data-collapsed={isCollapsed}
                            className="sticky group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
                        >
                            <h1 className={'px-4 pt-2'}>Menu</h1>
                            <Separator className={'border'}/>

                            <Nav
                                isCollapsed={isCollapsed}
                                links={[
                                    {
                                        title: "Dashboard",
                                        label: "",
                                        variant: "ghost",
                                        uri:'/homepage',
                                    },
                                    {
                                        title: "Riwayat Diagnosa",
                                        label: "",
                                        variant: "ghost",
                                        uri:'/riwayat',
                                    },
                                    {
                                        title: "Profil",
                                        label: "",
                                        variant: "default",
                                        uri:'/profil',

                                    }
                                ]}
                            />
                        </div>
                    </div>
                    <div className={'content flex flex-col w-full'}>
                        <div className={'pb-4'}>
                            <h1 className={'text-lg font-bold'}>Profil</h1>
                            <p className={'text-sm font-normal text-gray-600'}>Profil Pengguna</p>
                        </div>
                        <div className={'grid grid-cols-1 md:grid-cols-2 gap-5'}>
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

                            <Card
                                className={'flex w-full bg-[#ffffff90] rounded-2xl backdrop-blur border px-4 py-2  gap-5'}>
                                <div className={'box-content w-full p-5'}>
                                    <div id={'title'}>
                                        <h1 className={'text-lg font-bold'}>
                                            Lokasi Peternakan
                                            <Separator className={'w-full border-b py-1'}/>
                                        </h1>
                                        <div className={'flex flex-col mt-2 '}>
                                            <div className={'relative flex flex-col rounded-xl gap-5 '}>
                                                {
                                                    lokasiPeternakan?(
                                                        lokasiPeternakan.map((item, index)=>(

                                                            <Card key={index} className={'flex rounded-xl p-4  gap-5'}>
                                                                <div className={'flex aspect-square border border-gray-400 p-3 rounded-xl'}>
                                                                    <MapIcon className={'w-10 h-10'}/>
                                                                </div>
                                                                <div className={' w-full'}>
                                                                    <h1 className={'text-lg font-medium'}>{
                                                                        // @ts-ignore
                                                                        item?item.nama_peternakan:null
                                                                        // item.nama_peternakan
                                                                        // console.log(item.nama_peternakan)
                                                                    }</h1>
                                                                    <p className={'text-gray-400'}>{
                                                                        // @ts-ignore
                                                                        item?item.alamat_peternakan:null
                                                                    }</p>
                                                                </div>
                                                                <Form {...updateFarmAlamat} key={'form'+index} >
                                                                    <Dialog key={'form'+index} open={
                                                                        // @ts-ignore
                                                                        editDialogStates[index]} onOpenChange={isOpen => setEditDialogStates({ ...editDialogStates, [index]: isOpen })}>
                                                                        <DialogTrigger className={'px-1 aspect-square bg-orange-400 text-white border-white rounded-md h-8'}><PencilIcon/></DialogTrigger>

                                                                        <DialogContent>
                                                                            <DialogHeader>
                                                                                <DialogTitle>Edit Lokasi Peternakan</DialogTitle>
                                                                                <DialogDescription>
                                                                                </DialogDescription>
                                                                            </DialogHeader>
                                                                            <DialogBody>
                                                                                <form key={'form'+index} onSubmit={updateFarmAlamat.handleSubmit(onSubmitUpdateAlamat)} className="space-y-2 mt-2">
                                                                                    <FormField
                                                                                        control={updateFarmAlamat.control}
                                                                                        name="kode_peternakan"
                                                                                        defaultValue={
                                                                                            // @ts-ignore
                                                                                        item?item.kode_peternakan:null}
                                                                                        render={({ field }) => (
                                                                                            <FormItem className={'hidden'}>
                                                                                                <FormLabel>Kode Peternakan</FormLabel>
                                                                                                <FormControl>
                                                                                                    <Input placeholder="Nama Peternakan" {...field} className={'bg-gray-100 w-full  border-gray-700' }/>
                                                                                                </FormControl>
                                                                                                <FormMessage />
                                                                                            </FormItem>
                                                                                        )}
                                                                                    />
                                                                                    <FormField
                                                                                        control={updateFarmAlamat.control}
                                                                                        name="nama_peternakan"
                                                                                        defaultValue={
                                                                                            // @ts-ignore
                                                                                        item?item.nama_peternakan:null}
                                                                                        render={({ field }) => (
                                                                                            <FormItem>
                                                                                                <FormLabel>Nama Peternakan</FormLabel>
                                                                                                <FormControl>
                                                                                                    <Input placeholder="Nama Peternakan"  {...field}  className={'bg-gray-100 w-full  border-gray-700' }/>
                                                                                                </FormControl>
                                                                                                <FormMessage />
                                                                                            </FormItem>
                                                                                        )}
                                                                                    />
                                                                                    <FormField
                                                                                        control={updateFarmAlamat.control}
                                                                                        name="alamat_peternakan"
                                                                                        defaultValue={
                                                                                            // @ts-ignore
                                                                                        item?item.alamat_peternakan:null}

                                                                                        render={({ field }) => (
                                                                                            <FormItem>
                                                                                                <FormLabel>Alamat</FormLabel>
                                                                                                <FormControl>
                                                                                                    <Textarea placeholder="alamat" {...field} className={'bg-gray-100 w-full border-gray-700'}/>
                                                                                                </FormControl>
                                                                                                <FormMessage />
                                                                                            </FormItem>
                                                                                        )}
                                                                                    />

                                                                                    <Button type="submit" className={'rounded-full'}>Simpan Alamat Peternakan</Button>
                                                                                </form>
                                                                            </DialogBody>

                                                                        </DialogContent>

                                                                    </Dialog>

                                                                </Form>
                                                                <Dialog key={index} open={
                                                                    // @ts-ignore
                                                                    dialogStates[index]} onOpenChange={setDialogStates}>
                                                                    <DialogTrigger className={'right-0 px-1 aspect-square bg-red-600 text-white border-white rounded-md h-8'}><Trash/></DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader className={'border-b pb-3'}>
                                                                            <DialogTitle>Peringatan!</DialogTitle>
                                                                            <DialogDescription>
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <DialogBody>
                                                                            Hapus Lokasi peternakan
                                                                            <b> {
                                                                                // @ts-ignore
                                                                                item?item.nama_peternakan:null}</b>
                                                                        </DialogBody>
                                                                        <DialogFooter>
                                                                            <div className={'flex w-full gap-5 justify-items-end'}>
                                                                                <Button variant={'destructive'} className={'ml-auto'} onClick={
                                                                                    // @ts-ignore
                                                                                    ()=>HapusFarm(item.kode_peternakan, index)}>Hapus</Button>
                                                                                <DialogClose  className={'border rounded-lg px-5 py-1.5'}>Batalkan</DialogClose>
                                                                            </div>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                                {/*<Button className={'absolute mx-4 right-0 px-1 aspect-square h-8'} variant={'destructive'}><Trash2/></Button>*/}

                                                            </Card>
                                                        ))
                                                    ):(
                                                        'Data Peternakan Tidak Tersedia'
                                                    )
                                                }
                                                <div>

                                                    <Form {...addAlamat} >
                                                    <Dialog open={open} onOpenChange={setOpen}>
                                                        <DialogTrigger className={'relative flex p-2 gap-3 rounded-full border border-gray-200'}><Plus/> {''} Tambah Lokasi Peternakan</DialogTrigger>

                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Tambah Lokasi Peternakan</DialogTitle>
                                                                <DialogDescription>
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogBody>
                                                                    <form  onSubmit={addAlamat.handleSubmit(onSubmitAddAlamat)} className="space-y-2 mt-2">
                                                                        <FormField
                                                                            control={addAlamat.control}
                                                                            name="nama_peternakan"
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Nama Peternakan</FormLabel>
                                                                                    <FormControl>
                                                                                        <Input placeholder="Nama Peternakan" {...field} className={'bg-gray-100 w-full  border-gray-700' }/>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />
                                                                        <FormField
                                                                            control={addAlamat.control}
                                                                            name="alamat_peternakan"
                                                                            render={({ field }) => (
                                                                                <FormItem>
                                                                                    <FormLabel>Alamat</FormLabel>
                                                                                    <FormControl>
                                                                                        <Textarea placeholder="alamat" {...field} className={'bg-gray-100 w-full border-gray-700'}/>
                                                                                    </FormControl>
                                                                                    <FormMessage />
                                                                                </FormItem>
                                                                            )}
                                                                        />

                                                                        <Button type="submit" className={'rounded-full'}>Simpan Alamat Peternakan</Button>
                                                                    </form>
                                                            </DialogBody>

                                                        </DialogContent>

                                                    </Dialog>

                                                    </Form>

                                                </div>
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
