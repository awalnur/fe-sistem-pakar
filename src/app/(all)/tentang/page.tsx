import React from "react";


export default function Tentang() {
    return (
        <div>
            <main className="flex w-full min-h-screen flex-col items-center justify-between z-10 top-0 left-0 pb-24  ">
                <div className={"fixed w-full  -z-40 xl:w-6/12 right-0 bg-hero-pattern h-screen bg-cover "}>
                </div>

                <div
                    className="relative top-20 flex flex-col lg:gap-5 2xl:top-64 z-30 left-0 xl:px-64 w-full justify-between font-mono text-sm lg:flex p-8 xl:p-16">
                    <div className={'text-black backdrop-blur border xl:px-12 xl:py-8 px-6 py-3 rounded-2xl'}>
                        <h1 className={'title text-xl font-bold font-sans lg:w-5/12'}>
                            Tentang
                        </h1>
                        <div className={'descriptif w-full 2xl:w-8/12 mt-8 text-justify'}>
                            <p>AGRI Chicken Health Diagnose merupakan sebuah platform inovatif yang menyediakan fitur
                                bagi pengguna untuk mendiagnosis kesehatan ayam broiler atau ayam pedaging berdasarkan
                                gejala-gejala yang terjadi. Platform ini menggunakan sistem penghitungan Dempster-Shafer
                                untuk menentukan persentase kemungkinan penyakit yang mungkin terjadi pada ayam.</p>
                            <p>Perlu diperhatikan bahwa AGRI hanya memberikan diagnosa awal yang sifatnya belum final.
                                Oleh karena itu, hasil diagnosa ini tidak dapat dijadikan sebagai acuan pasti, namun
                                dapat digunakan sebagai analisa awal dalam menentukan jenis penyakit yang mungkin
                                diderita oleh ayam. Data yang digunakan dalam sistem ini berasal dari pakar yang
                                kompeten dan telah diproses melalui pembelajaran mesin.</p>
                            <p>Kami berharap AGRI dapat membantu peternak dalam mengidentifikasi masalah kesehatan ayam
                                secara cepat dan tepat, sehingga langkah-langkah penanganan yang tepat dapat segera
                                diambil.</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )

}