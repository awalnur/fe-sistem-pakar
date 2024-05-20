'use client'
import { useRouter } from "next/navigation";
export function HandleLogout()  {
    const router = useRouter();
    localStorage.removeItem("login");
    localStorage.removeItem("accessToken");
    router.push("/login");
    return true
}
