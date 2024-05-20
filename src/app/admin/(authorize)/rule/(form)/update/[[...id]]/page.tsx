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
import {Check, ChevronLeft, ChevronRight, ChevronsUpDown, PlusCircle} from "lucide-react";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem, CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {cn} from "@/lib/utils";
import {toast} from "@/components/ui/use-toast";
import {usePathname} from "next/navigation";


const BE_URL = process.env.NEXT_PUBLIC_BE_URL

const rule = z.object({
    // gambar
    kode_penyakit: z.string().optional(),
    gejala: z.any().optional()
})
export default function UpdatePenyakitPage() {

    //TODO
    // - delete list
    const [open, setOpen] = useState(false)
    const [opens, setOpens] = useState({})
    const [dataGejala, setDatasGejala] = useState([])
    const [dataPenyakit, setDataPenyakit] = useState(null)

    const [value, setValue] = useState('')
    const [Selectedvalues, setValues] = useState({})
    const [inputGejala, setInputGejalaValue] = useState([0])
    const [inputValues, setInputValues] = useState({'bobot[0]':0.1});
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setInputValues({
            ...inputValues,
            [name]: parseFloat(value)
        });
    };
    const router = usePathname().split('/')
    const kode_penyakit = router[router.length-1]
    const header = Header()
    console.log(kode_penyakit)

    async function fecthRule(){
        try {
            const response = await fetch(BE_URL + '/v1/rule/get/'+kode_penyakit.toUpperCase(),
                {
                    method: 'GET',
                    headers: Header()
                });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const penyakit = await response.json();
            const currentGejala = penyakit['data']['gejala']
            const listGejalaRule = {}
            let number = []
            Object.entries(currentGejala).forEach(([idx, val]) => {
                // Convert index from string to number
                // const idx = Number(index);
                console.log('asd', idx, val)
                const index = parseInt(idx)
                // setInputGejalaValue([index]: val);
                listGejalaRule[index]=val
                number.push(index)
            });

            // console.log('Response data s:',penyakit['data']['kode_penyakit'], penyakit);
            setValue(penyakit['data']['kode_penyakit']);
            setValues(listGejalaRule)
            setInputGejalaValue(number)
            setInputValues(penyakit['data']['bobot']);

        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error case
        }
    }
    async function fetchPenyakit() {
        try {
            const response = await fetch(BE_URL + '/v1/rule/list_penyakit?baypass=1',
                {
                    method: 'GET',
                    headers: Header()
                });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const penyakit = await response.json();

            setDataPenyakit(penyakit['data']['entries']);
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error case
        }
    }
    async function fetchGejala(){
        try {
            // page=page>0?page-1:0
            const response = await fetch(BE_URL + '/v1/gejala/all?limit=1000',
                {
                    method: 'GET',
                    headers: Header()
                });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const gejala = await response.json();
            const data = gejala['data']
            setDatasGejala(data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const createRule = useForm<z.infer<typeof rule>>({
        resolver: zodResolver(rule),
    })

    async function onSubmit(values: z.infer<typeof rule>) {
        const gejala = []
        const total_gejala=Object.keys(Selectedvalues).length
        if (total_gejala<2){
            createRule.setError('gejala', {message:'Setidaknya ada 2 gejala yang terjadi'})
        }else{
            Object.entries(Selectedvalues).forEach(([idx, val]) => {
                const index = parseInt(idx)
                gejala.push({
                    kode_gejala: val,
                    bobot: inputValues[`bobot[${index}]`],
                })
            });
            const body = {
                'gejala': gejala
            }
            try{
                const response = await fetch(BE_URL+'/v1/rule/update/'+kode_penyakit, {
                    method: 'PUT',
                    headers: header,
                    body: JSON.stringify(body),
                })
                if (!response.ok) {
                    throw new Error('Failed to delete data');
                }

                // closeDialog(index)
                toast({
                    title: "Info !",
                    variant: "default",
                    className: cn(
                        'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5 bg-primary  text-white'
                    ),
                    description: "Tambah Data Rule Berhasil",
                })

            } catch (error) {
                console.error('Error fetching data:', error);
                toast({
                    title: "Peringatan!",
                    variant: "destructive",
                    className: cn(
                        'top-5 mx-auto flex fixed md:max-w-[420px] md:top-4 md:right-5'
                    ),
                    description: "Terjadi Kesalahan saat menyimpan data",
                })
            }
        }


    }

    const handleToggle = (key, currentValue) => {
        setValues(prevValues => ({
            ...prevValues,
            [key]: currentValue === prevValues[key] ? "" : currentValue
        }));
        // setInputValues()
    };
    const closes = (key, currentValue) => {
        console.log('asd')

        setOpens(prevValues => ({
            ...prevValues,
            [key]: false
        }));
    };
    const addGejala = () => {
        // Create a new array with the existing elements and a new element
        setInputGejalaValue([...inputGejala, inputGejala.length]);

        setInputValues({
            ...inputValues,
            [`bobot[${inputGejala.length}]`]: 0.1
        });
    };

    useEffect(() => {
        if (dataPenyakit===null){
            fetchPenyakit()
        }
        if (dataGejala.length===0){
            fetchGejala()
        }
        if (value==''){

            fecthRule()
        }
    }, [dataPenyakit, dataGejala]);
    console.log(Selectedvalues, inputValues, dataPenyakit)
    // console.log(value, value?(dataPenyakit?dataPenyakit.find((dataPenyakit)=>value.toUpperCase()==dataPenyakit.kode_penyakit)?.penyakit:"s"):"k", dataPenyakit[0]);
    return (
        <div className={'py-10'}>

            <Card>
                <CardHeader className={'flex flex-row gap-5 border-b py-3'}>
                    <Link href={'/admin/rule'} className={'flex gap-2 -ml-5 w-fit px-5 py-2 text-green-600  rounded-xl'} ><ChevronLeft/> Kembali</Link>
                    <h1 className={'text-xl my-auto font-medium'}>Edit Aturan</h1>

                </CardHeader>
                <CardContent className={'py-5'}>
                    <Form {...createRule}>
                        <form  onSubmit={createRule.handleSubmit(onSubmit)} encType="multipart/form-data" className={'flex-col flex gap-3'}>

                            <FormField
                                name="kode_penyakit"
                                render={({ field }) => (
                                    <FormItem className={'flex flex-col gap-2'}>
                                        <FormLabel>Nama Penyakit</FormLabel>

                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    disabled
                                                    aria-expanded={open}
                                                    className="w-[200px] justify-between"
                                                >
                                                    {
                                                        value
                                                            ?
                                                            dataPenyakit.find((penyakit) =>penyakit.kode_penyakit === value.toUpperCase())?.penyakit || "Select Penyakit..."
                                                            : "Select Penyakit..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Cari Penyakit..s." />
                                                    <CommandEmpty>No Penyakit found.</CommandEmpty>
                                                    <CommandList>
                                                        <CommandGroup>
                                                            {dataPenyakit?dataPenyakit.map((penyakit) => (
                                                                // <label className={'s'} key={framework.value}> { framework.value}</label>
                                                                <CommandItem
                                                                    key={penyakit.kode_penyakit}
                                                                    value={penyakit.kode_penyakit}
                                                                    onSelect={(currentValue) => {
                                                                        setValue(currentValue === value ? "" : currentValue)
                                                                        setOpen(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            value === penyakit.kode_penyakit ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {penyakit.penyakit}
                                                                </CommandItem>
                                                            )):('')}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={createRule.control}
                                name="gejala"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className={'flex flex-row mt-2 gap-2 justify-between w-[970px]'}>

                                            <FormLabel>Gejala</FormLabel>
                                            <FormLabel>Belief (Rentang 0.1-1.0)</FormLabel>
                                        </div>
                                        {
                                            inputGejala.map((item, key)=>(
                                                <div key={'d'+key} className={'flex gap-4'}>
                                                    <Popover key={'s'+key} open={opens[key]} onOpenChange={setOpens}>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                role="combobox"
                                                                aria-expanded={opens[key]}
                                                                className="w-[800px] justify-between"
                                                            >
                                                                {Selectedvalues[key]
                                                                    ? dataGejala?dataGejala.find((framework) => framework.kode_gejala === Selectedvalues[key].toUpperCase())?.gejala:"s"
                                                                    : "Select Gejala..."}

                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[800px] p-0">
                                                            <Command>
                                                                <CommandInput placeholder="Cari Gejala..." />
                                                                <CommandEmpty>Gejala Tidak ditemukan</CommandEmpty>
                                                                <CommandList>
                                                                    <CommandGroup>
                                                                        {dataGejala.map((gejala) => (

                                                                            Selectedvalues ?(Object.values(Selectedvalues).includes(gejala.kode_gejala.toLowerCase())||Object.values(Selectedvalues).includes(gejala.kode_gejala.toUpperCase()))?(
                                                                                null
                                                                            ):(
                                                                                <CommandItem
                                                                                    key={gejala.kode_gejala}
                                                                                    value={gejala.gejala}
                                                                                    onSelect={(currentValue, val=gejala.kode_gejala) => {
                                                                                        handleToggle(key, val === Selectedvalues[key] ? "" : val)
                                                                                        closes(key, val === opens[key] ? "" : val)
                                                                                    }}
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            Selectedvalues[key] === gejala.kode_gejala ? "opacity-100" : "opacity-0"
                                                                                        )}
                                                                                    />
                                                                                    {gejala.gejala}
                                                                                </CommandItem>
                                                                            ):(
                                                                                <CommandItem
                                                                                    key={gejala.kode_gejala}
                                                                                    value={gejala.gejala}
                                                                                    onSelect={(currentValue, currentKey) => {

                                                                                        handleToggle(key, currentValue === Selectedvalues[key] ? "" : currentValue)
                                                                                        closes(key, currentValue === opens[key] ? "" : currentValue)

                                                                                    }}
                                                                                >
                                                                                    <Check
                                                                                        className={cn(
                                                                                            "mr-2 h-4 w-4",
                                                                                            Selectedvalues[key] === gejala.kode_gejala ? "opacity-100" : "opacity-0"
                                                                                        )}
                                                                                    />
                                                                                    {gejala.gejala}
                                                                                </CommandItem>
                                                                            )
                                                                        ))}
                                                                    </CommandGroup>
                                                                </CommandList>
                                                            </Command>
                                                        </PopoverContent>
                                                    </Popover>
                                                    <Input name={'bobot['+key+']'} key={'a'+key} type={'number'} className={'w-40 '} placeholder={'Belief'} min={0.1} defaultValue={inputValues['bobot['+key+']']} step={0.1} max={1.0} onChange={handleInputChange}/>
                                                </div>
                                            ))
                                        }
                                        <FormMessage />
                                    </FormItem>

                                )}

                            />
                            <Button variant={'outline'} type={'button'} className={'py-4 px-4 h-12 w-60 text-left flex flex-row justify-start gap-5'} onClick={()=>(addGejala())}><PlusCircle/> Tambah Gejala</Button>

                            <Button type={'submit'} variant={'default'} className={'w-56 mt-5'}> Simpan</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )

}