"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"


import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {buttonVariants} from "@/components/ui/button";
import {useRouter} from "next/router";
interface NavProps {
    diseaseId: string
    isCollapsed: boolean
    links: {
        id: string
        value?: string
    }[]
}

export function Nav({diseaseId, links, isCollapsed }: NavProps) {

    const  id  = diseaseId

    return (
        <div
            data-collapsed={isCollapsed}
            className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                {links.map((link, index) =>
                    isCollapsed ? (
                        <Tooltip key={index} delayDuration={0}>
                            <TooltipTrigger asChild>
                                <Link
                                    href={"/penyakit/detail/"+link.id}
                                    className={cn(
                                        buttonVariants({ variant: id==link.id? ('default') : ('ghost'), size: "icon" }),
                                        "h-9 w-9",
                                        'default' === "default" &&
                                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                                    )}>
                                    <span className="sr-only">{link.value}</span>
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="flex items-center gap-4">
                                {link.value}
                                {link.value && (
                                    <span className="ml-auto text-muted-foreground">
                                        {link.value}
                                    </span>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    ) : (
                        <Link
                            key={index}
                            href={"/penyakit/detail/"+link.id}
                            className={cn(
                                buttonVariants({ variant: id==link.id? ('default') : ('ghost'), size: "sm" }),
                                'default' === "default" &&
                                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                "justify-start"
                            )}>
                            {link.value}
                            {link.value && (
                                <span
                                    className={cn(
                                        "ml-auto",
                                        'default' === "default" &&
                                        "text-background dark:text-white"
                                    )}
                                />
                            )}
                        </Link>
                    )
                )}
            </nav>
        </div>
    )
}