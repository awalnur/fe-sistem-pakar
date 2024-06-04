
import React from "react";

import {Card} from "@/components/ui/card";

export default function Home() {
  return (
      <div>
        <main className="flex w-full min-h-screen flex-col items-center justify-between z-10 top-0 left-0 pb-24 xl:px-64 lg:px-32 p-8 ">
          <div className={"absolute -z-40 lg:w-8/12 w-full xl:w-6/12 right-0 bg-hero-pattern h-screen bg-cover "}>
          </div>

          <Card
              className="relative bg-[#ffffff99] flex flex-col lg:gap-5 lg:top-36 xl:top-64 top-20 z-30 xl:w-6/12 border-0 rounded-2xl backdrop-blur md:w-full left-0 p-8 w-full justify-between font-mono text-sm lg:flex mr-auto ">
            <div className={'text-black'}>
              <h1 className={'title  text-xl md:text-5xl font-bold font-sans '}>
                Kenali Masalahnya, Temukan
                Solusinya
              </h1>
              <p className={'descriptif mt-8'}>
                Temukan penyakit yang diderita ayam berdasarkan gejala yang terjadi menggunakan <b>AGRI</b>.

                Lebih cepat temukan masalah, lebih tepat penanganannya.
              </p>
            </div>
          </Card>


          <div className="p-15 flex  md:flex-row flex-col justify-between text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left border-2 rounded-full backdrop-blur">
            <div
                className="group rounded-sm border border-transparent py-2 md:px-5 md:py-4 transition-colors my-auto ml-4 md:ml-8 "
            >
              <h2 className={`mb-1 md:text-2xl font-semibold`}>
                Ada masalah pada kesehatan Ayam Anda? {" "}
              </h2>
              <p className={`m-0 text-sm md:opacity-50`}>
                Cari tahu penyakit yang diderita ayam anda berdasarkan gejala-gejala yang terjadi.
              </p>
            </div>
            <a
                href="/diagnosa"
                className="md:my-auto my-2 md:mr-5  mx-auto group rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 border border-transparent md:px-5 md:py-4 py-2 px-3 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                target="_blank"
                rel="noopener noreferrer"
            >
              <h2 className={`md:text-lg font-semibold`}>
                Diagnosa Sekarang {" "}
                <span
                    className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                      -&gt;
                    </span>
              </h2>
            </a>
          </div>
        </main>
      </div>
  );
}
