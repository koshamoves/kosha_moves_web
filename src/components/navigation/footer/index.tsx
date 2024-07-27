import { P } from "@/components/atoms"
import { Routes } from "@/core/routing"
import Link from "next/link"

export const Footer = () => {
      const currentYear = new Date().getFullYear();
      return (
            <footer className="flex flex-wrap gap-2 justify-between items-center w-full pb-4 pt-6">
                  <P className="text-grey-200">© {currentYear} Kosha Moves All Rights Reserved.</P>

                  <div className="flex flex-wrap gap-4 sm:gap-8">
                        <Link href={Routes.license}>
                              <P className="text-grey-200 hover:text-black transition-colors duration-300 ease-linear">License</P>
                        </Link>
                        <Link href={Routes.terms}>
                              <P className="text-grey-200 hover:text-black transition-colors duration-300 ease-linear">Terms of Use</P>
                        </Link>
                  </div>
            </footer>
      )
}