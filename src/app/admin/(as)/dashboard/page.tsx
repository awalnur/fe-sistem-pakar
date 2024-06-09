'use client'

import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {ResponsiveLine} from "@nivo/line";
import dataJson from './indomaps.json'

import { ResponsiveGeoMap } from '@nivo/geo'

import {HeartCrack, SquareActivity, Stethoscope, Users2} from "lucide-react";
import {useEffect, useState} from "react";

import {Header} from "@/lib/header";
import {useRouter} from "next/navigation";
const BE_URL = process.env.NEXT_PUBLIC_BE_URL

export default function Dashboard() {
    const mapData = dataJson
    const [data, setData] = useState([])
    const [totalGejala, setTotalGejala] = useState(0)
    const [totalPenyakit, setTotalPenyakit] = useState(0)
    const [totalUser, setTotalUser] = useState(0)
    const [totalDiagnosa, setTotalDiagnosa] = useState(0)
    const router = useRouter()
    async function fetchData(){
            // page=page>0?page-1:0
            const response = await fetch(BE_URL + '/v1/admin/graph',
                {
                    method: 'GET',
                    headers: Header()
                });
            if (!response.ok) {
                if (response.status === 401){
                    router.push('/admin/login')
                }
            }else{

                const data = await response.json();
                setData(data['data']['entries'])
                setTotalDiagnosa(data['data']['total_diagnosa'])
                setTotalPenyakit(data['data']['total_penyakit'])
                setTotalUser(data['data']['total_pengguna'])
                setTotalGejala(data['data']['total_gejala'])
            }
    }

    useEffect(() => {
        fetchData()
    }, []);


    return (
        <div>

            <div className={'py-5 flex flex-row gap-5'}>

                <div className={'left w-9/12 flex-col flex gap-4'}>

                    <Card className={'p-1 h-[30rem]'}>
                        <CardHeader className={'pb-0'}>
                            Diagnosa Harian
                        </CardHeader>
                        <CardContent className={'w-full h-96'}>
                            <ResponsiveLine
                                data={data}
                                curve={'natural'}
                                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                                xScale={{ type: 'time',
                                    format: '%Y-%m-%d',
                                    precision: 'day',
                                }}
                                yScale={{
                                    type: 'linear',
                                    min: 'auto',
                                    max: 'auto',
                                    stacked: false,
                                    reverse: false
                                }}
                                yFormat=" >-.2f"
                                axisTop={null}
                                axisRight={null}

                                axisBottom={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    format: '%b %d',
                                    legend: 'Diagnosa pada 30 hari terakhir',
                                    legendOffset: 36,
                                    legendPosition: 'middle',
                                    truncateTickAt: 0
                                }}
                                axisLeft={{
                                    tickSize: 5,
                                    tickPadding: 5,
                                    tickRotation: 0,
                                    legend: 'count',
                                    legendOffset: -40,
                                    legendPosition: 'middle',
                                    truncateTickAt: 0
                                }}
                                pointSize={10}
                                pointColor={{ theme: 'background' }}
                                pointBorderWidth={2}
                                pointBorderColor={{ from: 'serieColor' }}
                                pointLabel="data.yFormatted"
                                pointLabelYOffset={-12}
                                enableTouchCrosshair={true}
                                useMesh={true}
                                legends={[
                                    {
                                        anchor: 'bottom-right',
                                        direction: 'column',
                                        justify: false,
                                        translateX: 100,
                                        translateY: 0,
                                        itemsSpacing: 0,
                                        itemDirection: 'left-to-right',
                                        itemWidth: 80,
                                        itemHeight: 20,
                                        itemOpacity: 0.75,
                                        symbolSize: 12,
                                        symbolShape: 'circle',
                                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                        effects: [
                                            {
                                                on: 'hover',
                                                style: {
                                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                                    itemOpacity: 1
                                                }
                                            }
                                        ]
                                    }
                                ]}
                            />
                        </CardContent>
                    </Card>

                    <Card className={'p-1 h-[30rem]'}>
                        <CardHeader className={'pb-0'}>
                            Peta Penyebaran Penyakit
                        </CardHeader>
                        <ResponsiveGeoMap
                            features={mapData['features']}
                            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                            projectionScale={900}
                            projectionTranslation={[ -1.2, 0.3 ]}
                            projectionRotation={[ 0, 0, 0 ]}
                            fillColor="#ffffff"
                            borderWidth={1}
                            borderColor="#635f5f"
                            graticuleLineColor="#a32929"
                        />
                    </Card>
                </div>

                <div className={'right w-3/12'}>
                    <div className={'min-w-full grid grid-cols-2 gap-3'}>
                        <Card className={'col-span-1 bg-white aspect-square p-5 flex-col flex gap-2'}>
                            <HeartCrack width={56} height={56} className={'text-red-600'} />
                            <h1 className={'text-4xl font-bold'}>{totalPenyakit}</h1>
                            <h1 className={'text-sm font-medium text-gray-600'}>Jenis Penyakit</h1>
                        </Card>
                        <Card className={'col-span-1 bg-white aspect-square p-5 flex-col flex gap-2'}>
                            <Stethoscope width={56} height={56} className={'text-green-600'} />
                            <h1 className={'text-4xl font-bold'}>{totalGejala}</h1>
                            <h1 className={'text-sm font-medium text-gray-600'}>Jenis Gejala</h1>
                        </Card>
                        <Card className={'col-span-1 bg-white aspect-square p-5 flex-col flex gap-2'}>
                            <Users2 width={56} height={56} className={'text-green-600'} />
                            <h1 className={'text-4xl font-bold'}>{totalUser}</h1>
                            <h1 className={'text-sm font-medium text-gray-600'}>Pengguna Terdaftar</h1>
                        </Card>
                        <Card className={'col-span-1 bg-white aspect-square p-5 flex-col flex gap-2'}>
                            <SquareActivity width={56} height={56} className={'text-green-600'} />
                            <h1 className={'text-4xl font-bold'}>{totalDiagnosa}</h1>
                            <h1 className={'text-sm font-medium text-gray-600'}>Diagnosa Dilakukan</h1>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}