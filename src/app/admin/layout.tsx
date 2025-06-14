import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import React from "react";
import {Toaster} from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Admin",
    description: "AGRI ADMIN PAGE" ,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="en">
        <body className={inter.className}>
        <Toaster />
        {children}
        </body>
        </html>
    );
}
