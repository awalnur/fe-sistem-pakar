import Link from "next/link";
import {Button} from "@/components/ui/button";

export const TopNav = () => {
    return <div>
    <nav className="fixed backdrop-blur border-b-[#f0f0f050] border-b top-0 z-50 flex w-full bg-transparent lg:px-16 lg:py-3 xl:px-64">
        <div className="nav-logo">
    <img className="h-12" src="/img/logo-nav.png"/>
        </div>
        <div className="text-black ml-16 my-auto flex flex-row gap-3 xl:text-lg xl:gap-5" id="Menu">
    <Link href="/" legacyBehavior passHref>
    Homepage
    </Link>
    <Link href="/penyakit" legacyBehavior passHref>
    Penyakit
    </Link>
    <Link href="/tentang" legacyBehavior passHref>
    Tentang
    </Link>
    </div>

    <div className="ml-auto">
    { login=='true'? (
        <div className="flex flex-row gap-2 z-10">
        <Link href={'/logout'}>
        <Button className={'rounded-full xl:px-10 xl:text-lg xl:py-6'} variant={'outline'}
    id={'login-button'}> Logout </Button>
        </Link>
        </div>
        ): (
                <div className="flex flex-row gap-2 z-10">
                <Link href={'/login'}>
                <Button className={'rounded-full xl:px-10 xl:text-lg xl:py-6'} variant={'outline'}
            id={'login-button'}> Login </Button>
                </Link>
                <Link href={'/register'}>
            <Button
                className={'rounded-full xl:px-10 xl:text-lg xl:py-6 from-yellow-400 to-orange-400 bg-gradient-to-br text-white hover:text-orange-500 hover:bg-white'}
            variant={'outline'} id={'login-button'}> Register </Button>
                </Link>
                </div>
        )}

    </div>
    </nav>
</div>
}