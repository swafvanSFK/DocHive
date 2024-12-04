'use client'

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react"
import { useUser } from "@clerk/nextjs"
import Breadcrumbs from "./BreadCrumbs"
import React from "react"

const Header = () => {
  const {user} = useUser()  
  
  return (
    <div className="flex justify-between flex-row-reverse md:flex-row lg:flex-row items-center p-2 md:p-5 lg:p-5">
        <div>
        {user && (
          <p className="hidden md:block lg:block text-2xl ">{user.firstName}{`'s`} Space</p>
        )}
        </div>
        {/* Breadcrumbs */}
        <Breadcrumbs/> 
        <>
          <SignedOut>
            <SignInButton/>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </>
    </div>
  )
}
export default Header