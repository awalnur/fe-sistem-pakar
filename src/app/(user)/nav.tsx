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
interface NavProps {
    isCollapsed: boolean
    links: {
        title: string
        label?: string
        variant: "default" | "ghost"
        uri: string
    }[]
}

export function Nav({ links, isCollapsed }: NavProps) {
    return (
        <div
            data-collapsed={isCollapsed}
            className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
        >

            <nav
                className="grid gap-1 px-2 xl:px-4 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                {links.map((link, index) =>
                        isCollapsed ? (
                            <Tooltip key={index} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="#"
                                        className={cn(
                                            buttonVariants({variant: link.variant, size: "icon"}),
                                            "h-9 w-9",
                                            link.variant === "default" &&
                                            "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                                        )}
                                    >
                                        <span className="sr-only">{link.title}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="flex items-center gap-4">
                                    {link.title}
                                    {link.label && (
                                        <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <Link
                                key={index}
                                href={link.uri}
                                className={cn(
                                    buttonVariants({variant: link.variant, size: "sm"}),
                                    link.variant === "default" &&
                                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                    "justify-start"
                                )}
                            >
                                {link.title}
                                {link.label && (
                                    <span
                                        className={cn(
                                            "ml-auto",
                                            link.variant === "default" &&
                                            "text-background dark:text-white"
                                        )}
                                    >
                  {link.label}
                </span>
                                )}
                            </Link>
                        )
                )}
            </nav>


        </div>
    )
}