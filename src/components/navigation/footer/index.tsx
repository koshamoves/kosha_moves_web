import { P } from "@/components/atoms"
import { POLICY_URL, TERMS_URL } from "@/constants/constants";
import Link from "next/link"

export const Footer = () => {
      const currentYear = new Date().getFullYear();
      return (
            <footer className="flex flex-wrap gap-2 justify-between items-center w-full pb-4 pt-6">
                  <P className="text-grey-200">© {currentYear} Kosha Moves All Rights Reserved.</P>

                  <div className="flex flex-wrap gap-4 sm:gap-8">
                        <Link href={POLICY_URL}>
                              <P className="text-grey-200 hover:text-black transition-colors duration-300 ease-linear">Privacy Policy</P>
                        </Link>
                        <Link href={TERMS_URL}>
                              <P className="text-grey-200 hover:text-black transition-colors duration-300 ease-linear">Terms</P>
                        </Link>
                  </div>
            </footer>
      )
}