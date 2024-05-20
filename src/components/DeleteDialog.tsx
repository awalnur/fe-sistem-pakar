
import React, {useState} from "react";
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
import {Trash2} from "lucide-react";
import {DialogBody} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Button} from "@/components/ui/button";
// @ts-ignore
const DeleteDialog = ({ id, name }) => {
    const [selectedOption, setSelectedOption] = useState('');

    return (
        <Dialog>
            <DialogTrigger className={'absolute mx-4 right-0 px-1 aspect-square bg-red-600 text-white border-white rounded-md h-8'}><Trash2/></DialogTrigger>
            <DialogContent>
                <DialogHeader className={'border-b pb-3'}>
                    <DialogTitle>Peringatan!</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>
                <DialogBody>
                    Hapus Lokasi peternakan
                    {/*@ts-ignore*/}
                    <b> {item?item.nama_peternakan:null}</b>
                </DialogBody>
                <DialogFooter>
                    <div className={'flex w-full gap-5 justify-items-end'}>
                        {/*@ts-ignore*/}
                        <Button variant={'destructive'} className={'ml-auto'} onClick={()=>HapusFarm(item.kode_peternakan)}>Hapus</Button>
                        <DialogClose  className={'border rounded-lg px-5 py-1.5'}>Batalkan</DialogClose>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteDialog;