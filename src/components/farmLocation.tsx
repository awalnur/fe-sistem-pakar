import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useState} from "react";

const FarmLocation = ({ options, onSelect }) => {
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectChange = (event) => {
        const selectedValue = event.valueOf();
        setSelectedOption(selectedValue);
        onSelect(selectedValue); // Trigger onSelect callback with selected value
    };
    return (
        <div>
            <h1 className={'title py-5 text-lg font-medium'}>
                Lokasi Peternakan
            </h1>
            <div className={'w-full mb-5'}>
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <Select name={'kode_peternakan'} onValueChange={handleSelectChange}>
                    <SelectTrigger className="lg:w-[400px]">
                        <SelectValue placeholder="Pilih Lokasi Peternakan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Lokasi Peternakan</SelectLabel>
                            {options.map((item) => (
                                <SelectItem key={item.id} value={item.id.toString()}>
                                    {item.value}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

            </div>

        </div>
    );
};

export default FarmLocation;