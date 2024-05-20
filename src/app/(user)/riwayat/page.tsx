"use client"
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"

import {map, z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";

import {
    ChevronLeft,
    ChevronRight, Trash2,
} from "lucide-react";
import Link from "next/link";
import {Nav} from "@/app/(user)/nav";
import { Separator } from "@radix-ui/react-separator";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Header} from "@/lib/header";
import moment from "moment";
import {useRouter} from "next/navigation";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {useToast} from "@/components/ui/use-toast";
import {ToastAction} from "@/components/ui/toast";
import {cn} from "@/lib/utils";
const BE_URL = process.env.NEXT_PUBLIC_BE_URL

const formSchema = z.object({
    searhcinput: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})
interface NavProps {
    isCollapsed: boolean
    links: {
        title: string
        label?: string
        variant: "default" | "ghost"
    }[]
}
export default function Riwayat() {
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [currentPage, setCurrent] = useState(1)

    const [isLoading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)

    const [dataRiwayat, setRiwayat] = useState(null)
    const limit = 10
    const total_data = 10
    const [totalPage, setTotalPage] = useState(10)
    const pages = [];
    const router = useRouter()
    const { toast } = useToast()

    async function fetchRiwayat(limit=10, page=1){
        try {
            const response = await fetch(BE_URL + '/v1/riwayat/all?limit='+limit+'&page='+page,
                {
                    method: 'GET',
                    headers: Header()
                });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const datariwayat = await response.json();
            console.log('Response data:', datariwayat);
            console.log('Response data:', datariwayat['data']['entries'].length);
            if (datariwayat['data']['entries'].length===0 && currentPage>1){
                setCurrent(currentPage-1)
            }

            setRiwayat(datariwayat['data']['entries']);
            setTotalPage(datariwayat['data']['total_page'])
            setLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error case
            setLoading(false);
        }
    }
// @ts-ignore
    async function HapusRiwayat(id){
        try {
            const response = await fetch(BE_URL + '/v1/riwayat/delete/'+id,
                {
                    method: 'DELETE',
                    headers: Header()
                });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const datariwayat = await response.json();

            setOpen(false)
            setLoading(false);
            fetchRiwayat(limit, currentPage)
            // return (
            // )
            toast({
                title: "Info !",
                variant: "default",
                className: cn(
                    'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5 bg-primary  text-white'
                ),
                description: "Riwayat Berhasil Dihapus",
            })


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
            // Handle error case
            setOpen(false)
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchRiwayat(10, currentPage)
    }, [currentPage]);
    const goPage=(uri:string)=>{
        router.push(uri)
    }
    function setCr(id: number, plus=0, minus=0){
        if (plus==0 && minus==0){
            setCurrent(id)
        }else if(plus==1 && minus==0){
            if (currentPage==totalPage){
                setCurrent(totalPage)
            }else{
                setCurrent(currentPage+1)
            }
        }else{

            if (currentPage-1==0){
                setCurrent(1)
            }else{
                setCurrent(currentPage-1)
            }
        }

        // fetchRiwayat(10, currentPage)
    }

    for (let i = 1; i <= totalPage; i++) {
        pages.push(
            <PaginationItem key={i}>
                { i == currentPage?
                    <Button disabled>{i}</Button>
                    :
                        <Button className={''} variant={'outline'} onClick={() => setCr(i)}>{i}</Button>}

            </PaginationItem>
        );
    }
    return (
        <main className="block">
            <div className="flex w-full min-h-screen flex-col items-center justify-between z-10 top-0 left-0 pb-24  ">

                <div className={"absolute -z-40 3xl:w-6/12 lg:w-8/12 right-0 bg-hero-pattern h-screen bg-cover "}>
                </div>

                <div className={'relative w-full top-20 xl:px-64 p-6 xl:py-16 flex lg:gap-5'}>
                    <div className={'sticky z-50 top-24 h-fit w-3/12 rounded-xl border'}>
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
                                        variant: "default",
                                        uri:'/riwayat',
                                    },
                                    {
                                        title: "Profil",
                                        label: "",
                                        variant: "ghost",
                                        uri:'/profil',

                                    }
                                ]}
                            />
                        </div>
                    </div>
                    <div className={'content flex flex-col w-full'}>
                        <div className={'pb-4'}>
                            <h1 className={'text-lg font-bold'}>Riwayat</h1>
                            <p className={'text-sm font-normal text-gray-600'}>Halaman homepage Pengguna</p>
                        </div>
                        <Card className={'flex w-full transition duration-150 bg-[#ffffff90] rounded-2xl backdrop-blur border px-4 py-2  gap-5'}>
                            <div className={'box-content w-full p-5'}>
                                <div className={'flex w-full'}>
                                    <div className={'w-full'}>
                                        <h1 className={'text-lg font-bold'}>
                                            Riwayat Diagnosa
                                        </h1>
                                    </div>
                                    <div className={''}>
                                        <Link href={'/diagnosa'}>
                                            <Button className={'bg-primary rounded-full'}> Lakukan
                                                Diagnosa</Button>
                                        </Link>
                                    </div>
                                </div>
                                <Separator className={'border-b py-2'}/>
                                <div className={'cardBody'}>
                                    <Table>
                                        <TableCaption>
                                            {
                                                totalPage>0 ?(
                                                <Pagination>
                                                    <PaginationContent>
                                                    <PaginationItem>

                                                        <Button onClick={()=>setCr(0, 0, 1)} variant={'outline'} className={'border-0'}>

                                                            <ChevronLeft className="h-4 w-4" />
                                                            <span>Previous</span>
                                                        </Button>                                                    </PaginationItem>
                                                        {pages}
                                                    <PaginationItem>
                                                        <Button onClick={()=>setCr(0, 1)} variant={'outline'} className={'border-0'}>
                                                            <span>Next</span>
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </PaginationItem>
                                                    </PaginationContent>
                                                </Pagination>
                                                ):('Data riwayat tidak ditemukan')
                                            }
                                            </TableCaption>
                                        <TableHeader>
                                        <TableRow>
                                                <TableHead className="w-[100px]">No</TableHead>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Nama Penyakit</TableHead>
                                                <TableHead>Tingkat Kepercayaan</TableHead>
                                                <TableHead>Lokasi peternakan</TableHead>
                                                <TableHead className="text-center">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {// @ts-ignore
                                                dataRiwayat ? (dataRiwayat.map((item, key)=>(
                                                        <TableRow key={key}>
                                                            <TableCell className="font-medium">{item.number}</TableCell>
                                                            <TableCell>{moment(item.created_date, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY')}</TableCell>
                                                            <TableCell>{item.penyakit}</TableCell>
                                                            <TableCell className={'text-center'}>{item.persentase}%</TableCell>
                                                            <TableCell>{item.peternakan?item.peternakan:('-')}</TableCell>
                                                            <TableCell className="flex flex-row gap-2 text-right">

                                                                <Button variant="ghost" className={'rounded-full'} onClick={()=>goPage('/riwayat/detail/'+item.kode_riwayat)}>
                                                                    Detail
                                                                </Button>
                                                                <Dialog key={key}>
                                                                    <DialogTrigger className={'  right-0 px-5 py-2.5 bg-red-600 text-white border-white rounded-full'}>Hapus</DialogTrigger>
                                                                    <DialogContent>
                                                                        <DialogHeader className={'border-b pb-3'}>
                                                                            <DialogTitle>Peringatan!</DialogTitle>
                                                                            <DialogDescription>
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <DialogBody>
                                                                            Hapus Lokasi peternakan
                                                                            <b> {item?item.penyakit:null}</b>
                                                                        </DialogBody>
                                                                        <DialogFooter>
                                                                            <div className={'flex w-full gap-5 justify-items-end'}>
                                                                                <DialogTrigger asChild>

                                                                                    <Button variant={'destructive'} className={'ml-auto'} onClick={()=>HapusRiwayat(item.kode_riwayat)}>Hapus</Button>
                                                                                </DialogTrigger>
                                                                                <DialogClose  className={'border rounded-lg px-5 py-1.5'}>Batalkan</DialogClose>
                                                                            </div>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ):('')
                                            }


                                        </TableBody>
                                    </Table>

                                </div>

                            </div>
                        </Card>
                    </div>
                </div>

            </div>
        </main>
    );
}
