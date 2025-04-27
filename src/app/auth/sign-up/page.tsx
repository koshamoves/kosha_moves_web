import { Caret, Google } from "@/components/Icons";
import { Button, H, P } from "@/components/atoms";
import { SignUpForm } from "@/components/forms";
import { Column, Row } from "@/components/layout";
import { LANDING_PAGE_URL } from "@/constants/constants";
import Link from "next/link";

const Page = () => {
      return (
            <div className="flex-1 flex items-center justify-center h-full">
                  <Column className="justify-between gap-10 h-full w-full max-w-[420px]">
                        <Link href={LANDING_PAGE_URL}>
                              <Row className="text-primary-foreground font-dm-sans max-w-max p-2 items-center gap-4">
                                    <Caret width={22} height={22}/>
                                    <p className="">Back to Website</p>
                              </Row>
                        </Link>
                        <Row className="flex-1 items-center">
                              <Column className="gap-10 w-full">
                                    <Column className="">
                                          <H level={1} className="text-primary m-0 text-4xl">Create an Account</H>
                                          <P className="text-primary-foreground m-0 text-base font-dm-sans">Input your account details to sign up</P>
                                    </Column>
                                   {/*  <Button variant="ghost" size="lg">
                                          <Google className="mr-2 h-[20px] w-[19px]" />
                                          <p className="text-primary text-base">Sign up with Google</p>
                                    </Button> */}
                                    <Column className="gap-12">
                                         {/*  <div className="relative">
                                                <div className="border" />
                                                <P className="font-dm-sans text-grey-100 p-2 bg-white-100 max-w-max absolute left-[50%] -bottom-4 translate-x-[-50%]">or</P>
                                          </div> */}
                                          <SignUpForm />
                                    </Column>
                              </Column>
                        </Row>
                  </Column>
            </div>
      )
}

export default Page;