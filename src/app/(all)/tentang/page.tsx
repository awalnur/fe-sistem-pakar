import React from "react";


export default function Tentang() {
    return (
        <div>
            <main className="flex w-full min-h-screen flex-col items-center justify-between z-10 top-0 left-0 pb-24  ">
                <div className={"fixed w-full md:absolute -z-40 xl:w-6/12 right-0 bg-hero-pattern h-screen bg-cover "}>
                </div>

                <div
                    className="relative top-40 flex flex-col lg:gap-5 xl:top-64 z-30 left-0 xl:px-64 w-full justify-between font-mono text-sm lg:flex p-8 xl:p-16">
                    <div className={'text-black backdrop-blur border xl:px-12 xl:py-8 px-6 py-3 rounded-2xl'}>
                        <h1 className={'title text-xl font-bold font-sans lg:w-5/12'}>
                            Tentang
                        </h1>
                        <p className={'descriptif lg:w-5/12 mt-8 text-justify'}>
                            AGRI CHICKEN HEALTH DIAGNOSE merupakan sebuah platform yang menyediakan fitur bagi pengguna untuk melakukan diagnosa pada ayam broiler atau ayam pedaging berdasarkan gejala-gejala yang terjadi pada ayam.
                            AGRI menggunakan sistem penghitungan <i>dempster-shafer</i> dalam menentukan persentase kemungkinan penyakit yang terjadi pada ayam.
                            <br/>
                            AGRI hanya memberikan diagnosa yang sifatnya belum final. Sehingga tidak dapat dijadikan sebagai acuan pasti, tapi bisa digunakan sebagai analisa awal dalam menentukan jenis penyakit yang mungkin diderita berdasarkan hasil belajar mesin yang mana datanya berasal dari pakar yang kompeten.

                        </p>
                    </div>
                </div>

            </main>
        </div>
    )

}