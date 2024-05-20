
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

import {ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, PlusCircle, Trash} from "lucide-react"

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

const BE_URL = process.env.NEXT_PUBLIC_BE_URL


export type modelRule = {
    kode_penyakit:string
    penyakit:string
    gejala?:[]
}
export default function AdminPenyakit() {
    const [dialogStates, setDialogStates] = useState({}); // State to store dialog open/close states

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [currentPage, setCurrent] = useState(1)
    const [dataRule, setRule] = useState(null)
    const limit = 10

    // const total_data = 10
    const [totalPage, setTotalPage] = useState(10)
    const pages = [];
    const router = useRouter()
    const [isLoading, setLoading] = useState(false)
    const data: modelRule[] = dataRule?dataRule:[]

    const closeDialog = (index) => {
        setDialogStates(prevState => ({
            ...prevState,
            [index]: false // Close the dialog at index
        }));
    };
    async function DeleteRule(id, index){
        try {
            const response = await fetch(BE_URL + '/v1/rule/delete/'+id,
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
                description: "Data Rule Berhasil Dihapus",
            })
            fetchRule(limit, currentPage)

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

    const columns: ColumnDef<modelRule>[] = [

        {
            accessorKey: "kode_penyakit",
            header: "Kode Penyakit",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("kode_penyakit")}</div>
            ),
        },
        {
            accessorKey: "penyakit",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Nama Penyakit
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => <div className="lowercase block">{row.getValue("penyakit")}</div>,
        },
        {
            accessorKey: "gejala",
            header: () => <div className="text-left">Gejala dan belief</div>,
            cell: ({ row }) => {
                const gejala = row.getValue("gejala")

                return (
                    <div className="text-left text-xs">
                        <ul>
                            {gejala.map((item) => (
                                <li className={'list-disc flex flex-row justify-between p-2 border-b'}><p>{item.gejala}</p><p className={'text-sm'}>Belief : <span className={'px-2 py-1 bg-green-600 font-medium text-white rounded'}>{item.bobot}</span></p></li>
                            ))}
                        </ul>

                    </div>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const kode_penyakit = row.getValue("kode_penyakit")

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Link href={'/admin/rule/update/'+kode_penyakit}>
                                <DropdownMenuItem>
                                    Edit
                                </DropdownMenuItem>
                            </Link>
                            <Dialog key={kode_penyakit} open={dialogStates[row.index]} onOpenChange={setDialogStates}>
                                {/*<DropdownMenuItem >Hapus</DropdownMenuItem>*/}

                                <DialogTrigger className={'w-full text-left px-2'}>Hapus</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader className={'border-b pb-3'}>
                                        <DialogTitle>Peringatan!</DialogTitle>
                                        <DialogDescription>
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogBody>
                                        <h1>Menghapus Rule?</h1>
                                        <small>Menghapus rule maka akan menghapus relasi antara penyakit dengan gejala</small>
                                    </DialogBody>
                                    <DialogFooter>
                                        <div className={'flex w-full gap-5 justify-items-end'}>
                                            <Button variant={'destructive'} className={'ml-auto'} onClick={()=>DeleteRule(kode_penyakit, row.index)}>Lanjutkan Menghapus</Button>
                                            <DialogClose  className={'border rounded-lg px-5 py-1.5'}>Batalkan</DialogClose>
                                        </div>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
    const goPage=(uri:string)=>{
        router.push(uri)
    }
    async function fetchRule(limit=10, page=1, search=''){
        try {
            // page=page>0?page-1:0
            const response = await fetch(BE_URL + '/v1/rule/all?limit='+limit+'&offset='+page+'&searchBy=nama_penyakit&search='+search,
                {
                    method: 'GET',
                    headers: Header()
                });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const dataRule = await response.json();
            console.log('Response data:', dataRule);
            console.log('Response data:', dataRule['data']['entries'].length);
            if (dataRule['data']['entries'].length===0 && currentPage>1){
                setCurrent(currentPage-1)
            }

            setRule(dataRule['data']['entries']);
            setTotalPage(dataRule['data']['total_page'])
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

    useEffect(() => {
        fetchRule(limit, currentPage)
        console.log('data penyakit limit:{}'+limit+' current:'+currentPage+''+dataRule)
    }, [limit, currentPage]);

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
        <div dir="page" className="admin-penyakit py-5 w-full">
            <Card>
                <CardHeader>
                    Data Aturan
                </CardHeader>
                <CardContent>
                    <div className="w-full">
                        <div className="flex items-center py-4 gap-5">


                            <Link href={'/admin/rule/create'} className={'flex gap-2 bg-primary w-fit px-5 py-2 text-white rounded-md'} type={'button'} ><PlusCircle/> Tambah </Link>

                             <DropdownMenu>
                                 <h1 className={'ml-auto'}>Tampilkan</h1>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" >
                                        Tampilkan Kolom <ChevronDown className="ml-1 h-4 w-4"/>
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
                            placeholder="Filter Nama Penyakit..."
                            onChange={(event) =>
                                fetchRule(limit, currentPage, event.target.value)
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
