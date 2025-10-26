'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import NavItems from "./NavItems";
import {User} from "@prisma/client";
import {createAuthClient} from "better-auth/client";

const authClient = createAuthClient();

export default function UserDropdown ({ user, mutateUserAction }: {user: User, mutateUserAction: () => void })  {

    const handleSignOut = async () => {
        await authClient.signOut();
        mutateUserAction();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image ?? ""} alt="Avatar" />
                        <AvatarFallback className="bg-rose-500 text-rose-50 text-sm font-bold">
                            {user?.name ? user.name[0] : 'A'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                    <span className="text-base font-medium text-gray-400">
                        {user?.name ? user.name : 'Anonymous'}
                    </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-gray-400">
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.image ?? ""} alt="Avatar" />
                            <AvatarFallback className="bg-rose-500 text-rose-50 text-sm font-bold">
                                {user?.name ? user.name[0] : 'A'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                        <span className="text-base font-medium text-gray-400">
                            {user?.name ? user.name : 'Anonymous'}
                        </span>
                            <span className="text-sm text-gray-500">
                            {user.email}
                        </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600" />
                <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
                    Logout
                </DropdownMenuItem>
                <DropdownMenuSeparator className="hidden sm:block bg-gray-600" />
                <nav className="sm:hidden">
                    <NavItems />
                </nav>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}