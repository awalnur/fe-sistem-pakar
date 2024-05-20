
"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Pagination
} from "@/components/ui/pagination"

import {
    ArrowUpDown,
    ChevronDown,
    ChevronLeft,
    ChevronRight, EyeIcon,
    MoreHorizontal, PencilIcon,
    Plus,
    PlusCircle,
    Trash
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"



import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Header} from "@/lib/header";
import {PaginationContent, PaginationItem} from "@/components/ui/pagination";
import Link from "next/link";
import {router} from "next/client";
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
import {cn} from "@/lib/utils";
import {toast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Textarea} from "@/components/ui/textarea";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const BE_URL = process.env.NEXT_PUBLIC_BE_URL


export type modelGejala = {
    kode_gejala: string
    gejala:string
}

const gejalaSchema = z.object({
    kode_gejala: z.string().min(2, {
        message: "Kode Gejala tidak boleh kosong",
    }),
    gejala: z.string().min(2, {
        message: "Gejala tidak boleh kosong",
    })
})
const updategejalaSchema = z.object({
    kode_gejala: z.string().min(2, {
        message: "Kode Gejala tidak boleh kosong",
    }),
    gejala: z.string().min(2, {
        message: "Gejala tidak boleh kosong",
    })
})

export default function AdminGejala() {
    const [dialogStates, setDialogStates] = useState({}); // State to store dialog open/close states
    const [open, setOpen] = useState(false)
    const [editDialogStates, setEditDialogStates] = useState(false); // State to store dialog open/close states
    const [update_data, setUpdateData] = useState({})
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [currentPage, setCurrent] = useState(1)
    const [dataGejala, setGejala] = useState(null)
    const limit = 10
    const total_data = 10
    const [totalPage, setTotalPage] = useState(10)
    const pages = [];
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const data: modelGejala[] = dataGejala?dataGejala:[]


    const addGejala = useForm<z.infer<typeof gejalaSchema>>({
        resolver: zodResolver(gejalaSchema),

    })
    const updateGejala = useForm<z.infer<typeof updategejalaSchema>>({
        resolver: zodResolver(updategejalaSchema)
    })
    const closeDialog = (index) => {
        setDialogStates(prevState => ({
            ...prevState,
            [index]: false // Close the dialog at index
        }));
    };

    async function onSubmitAddGejala(values: z.infer<typeof gejalaSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
        const kode_gejala = values.kode_gejala
        const gejala = values.gejala

        const response = await fetch(BE_URL+'/v1/gejala/create', {
            method: 'POST',
            headers: Header(),
            body: JSON.stringify({ kode_gejala, gejala }),
        })
        const data = response.json();
        data.then(responseData => {
            // Use the response data here
            console.log('Received response data:', response.status);
            // console.log('Response data:', data.then());
            if (response.status!==201){
                // Handle errors
                addGejala.setError('kode_gejala', { message: 'Kode gejala tidak sesuai atau sudah digunakan' });
                addGejala.setError('gejala', { message: 'Gejala tidak sesuai ' });
            } else if(response.status===201){
                toast({
                    title: "Info !",
                    variant: "default",
                    className: cn(
                        'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5 bg-primary  text-white'
                    ),
                    description: "Gejala berhasil ditambahkan",
                })
                if (open === true) {
                    setOpen(false)
                }
                addGejala.reset()
                fetchGejala(limit, currentPage)
            }else {
                console.log('haha error')
                addGejala.setError('kode_gejala', { message: 'Kode Gejala tidak sesuai atau sudah digunakan' });
                addGejala.setError('gejala', { message: 'Gejala tidak sesuai' });
            }
        })
            .catch(error => {
                // Handle error case
                console.error('Error:', error);
            });
    }
    async function onSubmitUpdateGejala(values: z.infer<typeof updategejalaSchema>) {
        // Do something with the form values.
        console.log('ajshdasdjn', values)
        // ✅ This will be type-safe and validated.
        const kode_gejala = values.kode_gejala
        const gejala = values.gejala

        const response = await fetch(BE_URL+'/v1/gejala/update/'+kode_gejala, {
            method: 'PATCH',
            headers: Header(),
            body: JSON.stringify({ gejala }),
        })
        const data = response.json();
        data.then(responseData => {
            // Use the response data here
            console.log('Received response data:', response.status);
            // console.log('Response data:', data.then());
            if (response.status!==200){
                // Handle errors
                updateGejala.setError('gejala', { message: 'Gejala tidak sesuai' });
            } else if(response.status===200){
                toast({
                    title: "Info !",
                    variant: "default",
                    className: cn(
                        'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5 bg-primary  text-white'
                    ),
                    description: "Gejala berhasil diubah",
                })

                fetchGejala(limit, currentPage)
                    Object.keys(editDialogStates).forEach(key => {

                    // @ts-ignore
                    if (editDialogStates[key] === true) {

                        // @ts-ignore
                        editDialogStates[key]=false
                    }
                });
                setEditDialogStates(false)
            }else {
                console.log('haha error')
                updateGejala.setError('gejala', { message: 'Gejala tidak sesuai ' });
            }
        })
            .catch(error => {
                // Handle error case
                console.error('Error:', error);
            });
    }





    async function DeleteGejala(id, index){
        try {
            const response = await fetch(BE_URL + '/v1/gejala/delete/'+id,
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
                description: "Data Gejala Berhasil Dihapus",
            })
            fetchGejala(limit, currentPage)

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

    const columns: ColumnDef<modelGejala>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "kode_gejala",
            header: "Kode Gejala",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("kode_gejala")}</div>
            ),
        },
        {
            accessorKey: "gejala",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Gajala
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase block">{row.getValue("gejala")}</div>,
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const kode_gejala = row.getValue("kode_gejala")
                const gejala = row.getValue("gejala")
                const index = row.index
                return (
                    <div className={'flex gap-3 justify-end'}>
                        {/*<Link className={'flex items-center justify-center aspect-square  text-green-600 border rounded-md h-8'} href={`/${kode_gejala}`}>*/}

                        {/*    <EyeIcon/>*/}
                        {/*</Link>*/}
                        <Button className={'px-1 aspect-square bg-orange-400 text-white border-white rounded-md h-8'} onClick={()=>(setEditDialogStates(true), setUpdateData({'kode_gejala': kode_gejala, 'gejala':gejala}))}><PencilIcon/></Button>


                        <Dialog key={index} open={dialogStates[index]} onOpenChange={setDialogStates}>

                            <DialogTrigger className={'px-1 aspect-square bg-red-600 text-white border-white rounded-md h-8'}><Trash/></DialogTrigger>

                            {/*<DialogTrigger className={'w-full text-left px-2'}>Hapus</DialogTrigger>*/}
                            <DialogContent>
                                <DialogHeader className={'border-b pb-3'}>
                                    <DialogTitle>Peringatan!</DialogTitle>
                                    <DialogDescription>
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogBody>
                                    Hapus Data Gejala
                                </DialogBody>
                                <DialogFooter>
                                    <div className={'flex w-full gap-5 justify-items-end'}>
                                        <Button variant={'destructive'} className={'ml-auto'} onClick={()=>DeleteGejala(kode_gejala, row.index)}>Hapus</Button>
                                        <DialogClose  className={'border rounded-lg px-5 py-1.5'}>Batalkan</DialogClose>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )
            },
        },
    ]
    const goPage=(uri:string)=>{
        router.push(uri)
    }
    async function fetchGejala(limit=10, page=1, search=''){
        try {
            // page=page>0?page-1:0
            const response = await fetch(BE_URL + '/v1/gejala/all?limit='+limit+'&offset='+page+'&searchBy=gejala&search='+search,
                {
                    method: 'GET',
                    headers: Header()
                });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const dataGejala = await response.json();
            console.log('Response data:', dataGejala);
            console.log('Response data:', dataGejala['data']['entries'].length);
            if (dataGejala['data']['entries'].length===0 && currentPage>1){
                setCurrent(currentPage-1)
            }

            setGejala(dataGejala['data']['entries']);
            setTotalPage(dataGejala['data']['total_page'])
            setLoading(false);

        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error case
            setLoading(false);
        }
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
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })
    // @ts-ignore
    function getGejalaData(index){
        // @ts-ignore
        let data = dataGejala[index]
        // console.log(data)
        return data
    }
    useEffect(() => {
        fetchGejala(limit, currentPage)
        let data = null

        Object.keys(editDialogStates).forEach(key => {
            console.log('hahahah')
            // @ts-ignore
            if (editDialogStates[key] === true) {
                data = getGejalaData(key)
            }
        });

        console.log(data)
        updateGejala.setValue('kode_gejala', update_data?update_data.kode_gejala:'')
        updateGejala.setValue('gejala', update_data?update_data.gejala:'')
    }, [limit, currentPage, updateGejala, editDialogStates]);

    for (let i = 1; i <= totalPage; i++) {
        pages.push(
            <PaginationItem key={i}>
                { i == currentPage?
                    <Button disabled  size={'sm'} variant={'secondary'}>{i}</Button>
                    :
                    <Button className={''} variant={'outline'} size={'sm'} onClick={() => setCr(i)}>{i}</Button>}

            </PaginationItem>
        );
    }
    return (
        <div dir="page" className="admin-Gejala py-5 w-full">
            <Form {...updateGejala}>
                <Dialog open={editDialogStates} onOpenChange={setEditDialogStates}>


                    {/*<DialogTrigger className={'px-1 aspect-square bg-orange-400 text-white border-white rounded-md h-8'}><PencilIcon/></DialogTrigger>*/}
                    {/*<DialogTrigger className={'w-full text-left px-2 py-2'}>Edit</DialogTrigger>*/}

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Gejala</DialogTitle>
                            <DialogDescription>
                            </DialogDescription>
                        </DialogHeader>
                        <DialogBody>
                            <form  onSubmit={updateGejala.handleSubmit(onSubmitUpdateGejala)} className="space-y-2">
                                <FormField
                                    control={updateGejala.control}
                                    name="kode_gejala"
                                    render={({ field }) => (
                                        <FormItem className={'hidden'}>
                                            <FormLabel>Kode Gejala</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nama Gejala" {...field} className={'bg-gray-100 w-full  border-gray-700' }/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={updateGejala.control}
                                    name="gejala"
                                    defaultValue={'asd'}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gejala</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Gejala"  {...field} className={'bg-gray-100 w-full  border-gray-700' }/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <Button className={'rounded-xl'}>Simpan</Button>
                            </form>
                        </DialogBody>

                    </DialogContent>

                </Dialog>

            </Form>
            <Card>
                <CardHeader>
                    Data Gejala
                </CardHeader>
                <CardContent>

                    <div className="w-full">
                    <div className="flex items-center py-4 gap-5">
                        <Form {...addGejala} >
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger className={'flex gap-2 bg-primary w-fit px-5 py-2 text-white rounded-md'}><PlusCircle/> {''} Tambah Gejala</DialogTrigger>

                                <DialogContent>
                                    <DialogHeader >
                                        <DialogTitle>Tambah Gejala</DialogTitle>
                                        <DialogDescription>
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={addGejala.handleSubmit(onSubmitAddGejala)} className="mt-2">

                                        <DialogBody className={'space-y-4'}>
                                            <FormField
                                                control={addGejala.control}
                                                name="kode_gejala"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Kode Gejala</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Kode Gejala" {...field}
                                                                   className={'bg-gray-100 w-full  border-gray-700'}/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={addGejala.control}
                                                name="gejala"
                                                render={({field}) => (
                                                    <FormItem>
                                                        <FormLabel>Gejala</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="gejala" {...field}
                                                                      className={'bg-gray-100 w-full border-gray-700'}/>
                                                        </FormControl>
                                                        <FormMessage/>
                                                    </FormItem>
                                                )}
                                            />

                                        </DialogBody>
                                        <DialogFooter className={'pb-2 pt-3'}>

                                            <Button type="submit" className={'rounded-lg'}>Simpan</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>

                            </Dialog>

                        </Form>
                        <DropdownMenu>
                                <p className={'ml-auto'}>Tampilkan</p>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        Tampilkan Kolom <ChevronDown className="ml-2 h-4 w-4"/>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => {
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) =>
                                                        column.toggleVisibility(!!value)
                                                    }
                                                >
                                                    {column.id}
                                                </DropdownMenuCheckboxItem>
                                            )
                                        })}
                                </DropdownMenuContent>
                            </DropdownMenu>

                        <Input
                            placeholder="Filter Gajala..."
                            onChange={(event) =>
                                fetchGejala(limit, currentPage, event.target.value)
                            }
                            className="max-w-sm"
                        />
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                )
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                No results.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                                {table.getFilteredRowModel().rows.length} row(s) selected.
                            </div>
                            <div className="space-x-2">

                                {
                                    totalPage>0 ?(
                                        <Pagination>
                                            <PaginationContent>
                                                <PaginationItem>

                                                    <Button onClick={()=>setCr(0, 0, 1)}
                                                            variant="outline"
                                                            size="sm">

                                                        <ChevronLeft className="h-4 w-4" />
                                                        <span>Previous</span>
                                                    </Button>                                                    </PaginationItem>
                                                {pages}
                                                <PaginationItem>
                                                    <Button onClick={()=>setCr(0, 1)}
                                                            variant="outline"
                                                            size="sm">
                                                        <span>Next</span>
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    ):(<div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.previousPage()}
                                            disabled={!table.getCanPreviousPage()}
                                        >
                                            Previous
                                        </Button>
                                        <Button size='sm' variant={'outline'}>1</Button>
                                        <Button size='sm' variant={'ghost'} disabled>2</Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => table.nextPage()}
                                            disabled={!table.getCanNextPage()}
                                        >
                                            Next
                                        </Button>
                                    </div>)
                                }
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
