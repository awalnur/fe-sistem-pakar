'use client'
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {useForm} from "react-hook-form";
import {Header} from "@/lib/header"
import {map, z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {Separator} from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast"
import {redirect, useRouter} from "next/navigation";
// import {cekLogin} from "@/lib/cekLogin";
const BE_URL = process.env.NEXT_PUBLIC_BE_URL

import dynamic from 'next/dynamic'
import FarmLocation from "@/components/farmLocation";
import {cn} from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Loader2, Plus} from "lucide-react";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {className} from "postcss-selector-parser";
function cekLogin(){

    if (typeof window === "undefined") return null;
    let login : string | null =''
    login = localStorage.getItem('login')
    return login
}
const farmSchema = z.object({
    nama_peternakan: z.string().min(2, {
        message: "nama peternakan tidak boleh kosong",
    }),
    alamat_peternakan: z.string().min(2, {
        message: "alamat peternakan tidak boleh kosong",
    })
})

export default function Penyakit() {
    const [gejala, setData] = useState(null);
    const [isLoading, setLoading] = useState(true);
    const router  = useRouter()
    const [optionData, setDataOption] = useState(null);
    const [isLoadingOption, setLoadingOption] = useState(true);
    const [selectedGejala, setSelectedGejala] = useState([]); // State to store selected gejala checkboxes
    const [login, setLogin] = useState(cekLogin())
    const [isSSR, setIsSSR] = useState(true);

    const [peternakan, setPeternakanData] = useState(null);
    const [open, setOpen] = useState(false)

    let uri=''
    const fetchData = async () => {
        try {
            const response = await fetch(BE_URL + '/v1/gejala/all?limit=1000');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const gejalaData = await response.json();
            console.log('Response data:', gejalaData);
            setData(gejalaData['data']);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error case
            setLoading(false);
        }
    };
    const getPeternakan = async () => {
        // let token = Header()
        try {
            const response = await fetch(BE_URL + '/v1/farm/option',
                {
                    method: 'GET',
                    headers: Header()
                });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const option = await response.json();
            console.log('Response data:', option);
            setDataOption(option['data']);
            setLoadingOption(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error case
            setLoadingOption(false);
        }
    };

    const addAlamat = useForm<z.infer<typeof farmSchema>>({
        resolver: zodResolver(farmSchema),
        // defaultValues: {
        //     nama_peternakan: '',
        //     alamat_peternakan: '',
        // },
    })
    async function onSubmitAddAlamat(values: z.infer<typeof farmSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        const nama_peternakan = values.nama_peternakan
        const alamat_peternakan = values.alamat_peternakan

        const response = await fetch(BE_URL+'/v1/farm/create', {
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
                getPeternakan()
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

    // @ts-ignore
    const handleLocationSelect = (selectedValue) => {
        // Here you can update the form data when the location is selected
        console.log(selectedValue)
        setPeternakanData(selectedValue);
    };
    // const NoSSR = dynamic(() => import('@/components/no-ssr'), { ssr: false })

    useEffect(() => {

        login=='true'? getPeternakan() : false;
        fetchData();
        setIsSSR(false);

    }, []);



    const FormSchema = z.object({
        gejala: z.array(z.string()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
        // kode_peternakan: z.string(),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            gejala: [],
            kode_peternakan: null
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        data = data
        if (peternakan!=null){
            data['kode_peternakan']=peternakan
        }else{
            if(login==='true'){
                alert('peternakan tidak boleh kosong')
                return false
            }
        }
        console.log('ads', data)

        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                  <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
        if (login=='true'){
            uri= '/v1/diagnose'
        }else{
            uri = '/v1/diagnose/public'
        }
        const response = await fetch(BE_URL+uri, {
            method: 'POST',
            headers: Header(),
            body: JSON.stringify(data),
        })
        const resdata = response.json();
        resdata.then(responseData => {
            // Use the response data here

            console.log('Received response data:', responseData['data']);
            if (responseData['status_code']==200) {
                // console.log('Response status code', responseData['status_code']);
                router.push('/diagnosa/hasil/'+responseData['data']['kode_riwayat']);
            }
            // console.log('Response data:', data.then());
            // if (!responseData['data']['accesstoken'].isEmpty) {
            //     localStorage.setItem('accessToken', responseData['data']['accesstoken'])
            //     localStorage.setItem('(auth)', 'true')
            //     // console.log(response.json())
            //     router.push('/homepage')
            // } else {
            //     // Handle errors
            // }
        })
            .catch(error => {
                // Handle error case
                console.error('Error in fetchData:', error);
            });
    }

    function openDialog(){
        if (open === false) {
            setOpen(true)
        }
    }
return (
        <main className="block">
            {isLoading ? (

                <div className={'absolute z-50 w-full h-full bg-transparent backdrop-blur flex'}>
                    <Loader2
                        className={cn('my-28 h-20 w-20 text-primary/80 animate-spin m-auto', className)}
                    />
                </div>
            ) : (null)}
            <div className="flex w-full min-h-screen flex-col items-center justify-between z-10 top-0 left-0 pb-24 lg:px-16 bg-transparent ">
                <div className={"fixed -z-40 lg:w-8/12 xl:w-6/12 right-0 bg-hero-pattern h-screen bg-cover top-0"}>
                </div>
                <div
                    className="relative flex flex-col w-full lg:gap-5 xl:top-28 lg:top-20 py-4 z-20 left-0 justify-between font-mono text-sm lg:flex mb-15 h-auto">
                    <div className={'text-black'}>
                        <h1 className={'title text-xl font-bold md:text-center'}>
                            DIAGNOSA PENYAKIT AYAM </h1>
                        <p className={'descriptif text-center text-gray-600 mx-auto mt-2'}>
                            Cari tahu jenis penyakit pada ayam anda dengan melakukan diagnosa dengan memilih data gejala yang terjadi pada Ayam anda
                        </p>
                    </div>
                    <Card className={'xl:max-w-5xl mx-auto w-full px-14 ty-8 mt-16 rounded-xl bg-[#ffffff90] backdrop-blur  mb-16'}>
                        <Form {...addAlamat} >
                            <Dialog open={open} onOpenChange={setOpen}>

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
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                                {
                                (login=='true'&&!isSSR)?(
                                    optionData?(
                                            <div>
                                                <FarmLocation options={optionData} onSelect={handleLocationSelect}/>
                                                <Button type={'reset'} onClick={()=>openDialog()} className={'relative flex  px-5 py-2 gap-3 rounded-full border border-gray-200 bg-primary text-white'}><Plus/> {''} <p className={'my-auto'}>Tambah Lokasi Peternakan</p></Button>

                                            </div>
                                            ):(
                                            <div>
                                                <FarmLocation options={[{id:'0', value:'Alamat tidak ada'}]} onSelect={handleLocationSelect}/>
                                                <Button type={'reset'} onClick={()=>openDialog()} className={'relative flex  px-5 py-2 gap-3 rounded-full border border-gray-200 bg-primary text-white'}><Plus/> {''} <p className={'my-auto'}>Tambah Lokasi Peternakan</p></Button>
                                            </div>)

                                        ):('')
                                }


                                <div className={'title py-4'}>

                                    <h1 className={'text-lg font-medium'}>
                                        Pilih Gejala
                                    </h1>
                                </div>
                                <Separator/>
                                <div className={'list-gejala py-6 gap-5'}>
                                    {isLoading ? (
                                        <p>Loading...</p>
                                    ) : (
                                        gejala ? (
                                            gejala.map((item, index) => (

                                                <FormField
                                                    key={index}
                                                    control={form.control}
                                                    name="gejala"
                                                    render={({field}) => {
                                                        return (
                                                            <FormItem
                                                                key={item.id}
                                                                className="flex flex-row items-start space-x-2"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(item.kode_gejala)}
                                                                        className={'w-6 aspect-square h-6 m-2'}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, item.kode_gejala])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== item.kode_gejala
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel
                                                                    className="xl:text-lg text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"

                                                                >
                                                                    {item.gejala}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                                //
                                                // <div className="flex items-center space-x-2" key={item.kode_gejala}>
                                                //         <Checkbox
                                                //                     name='gejalaTerjadi'
                                                //                     id={item.kode_gejala}
                                                //                     className={'w-6 aspect-square h-6 m-2'}/>
                                                //         <label
                                                //             htmlFor={item.kode_gejala}
                                                //             className="xl:text-lg text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                //         >
                                                //             {item.gejala}
                                                //         </label>
                                                //     </div>
                                            ))
                                        ) : (
                                            <p>No data available</p>
                                        )
                                    )
                                    }

                                </div>
                                <Separator/>
                                <div
                                    className={'flex pt-5 sticky bottom-0 pb-6 rounded-b-xl backdrop-blur -mx-14 px-16 justify-end '}>
                                    <Button type={'submit'}
                                            className={'rounded-full bg-gradient-to-bl from-green-900 to-green-600 border-orange-700 px-8 py-2'}> Diagnosa</Button>
                                </div>
                            </form>
                        </Form>
                    </Card>
                </div>
            </div>
        </main>
);
}


