'use client'

import Link from 'next/link'
import { LuMenu } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { UserMenu } from './UserMenu'
import { SidebarNav } from './Sidebar'

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      {/* Mobile menu */}
      <div className="flex items-center gap-4 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <LuMenu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-16 items-center border-b px-6">
              <Link href="/" className="text-lg font-semibold">
                Dinnartec
              </Link>
            </div>
            <div className="p-4">
              <SidebarNav />
            </div>
          </SheetContent>
        </Sheet>

        <Link href="/" className="text-lg font-semibold">
          Dinnartec
        </Link>
      </div>

      {/* Desktop spacer */}
      <div className="hidden md:block" />

      {/* User menu */}
      <UserMenu user={user} />
    </header>
  )
}
