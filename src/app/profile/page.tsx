"use client"
import { VirtualCard } from "@/components/VirtualCard";
import { Button, H, P, Picture } from "@/components/atoms";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/dialog";
import { DeleteAccount } from "@/components/dialogs";
import { AddCardFrom } from "@/components/forms/addCardForm";
import { Column, Row } from "@/components/layout";
import { MoveHistory } from "@/components/moveHistory";
import { UserProfileItem } from "@/components/userProfile";
import { useSignOut } from "@/hooks/auth/useSignOut";
import { generateAcronym } from "@/lib/helpers/generateAcronym";
import useUserStore from "@/stores/user.store";

const Page = () => {
      const {user} =  useUserStore((state) => state);
      const hasCreditCard = user?.hasCreditCard;
      const {loading, signOut} = useSignOut();
      return (
            <Column className="gap-4">
                  <Row className="gap-6 flex-col md:flex-row">
                        <Column className="gap-8 flex-1 p-4 shadow-xs bg-white-100 rounded-lg md:max-w-[400px]">
                              <Column className="items-center relative">
                                    <div className="bg-yellow-gradient w-full h-[130px] rounded-lg"></div>
                                    <span className="absolute -bottom-6">
                                          {/* <Tooltip 
                                                trigger={
                                                      <Button className="absolute z-10 -right-6 -bottom-1" size="icon" variant="link">
                                                            <Edit invertColor={false} width={20} height={20} />
                                                      </Button>
                                                }
                                                content="Change Photo"
                                          /> */}
                                          <Avatar className="w-[70px] h-[70px] bg-[#F6DF9C]">
                                                <AvatarImage src={ user?.photoURL ?? ""} alt={(user?.fullName || user?.displayName) ?? ""}/>
                                                <AvatarFallback>{generateAcronym((user?.fullName || user?.displayName) ?? "")}</AvatarFallback>
                                          </Avatar>
                                    </span>
                              </Column>
                              <Column className="pl-6 py-4 gap-0">
                                    <UserProfileItem />
                              </Column>
                        </Column>
                        {/* <div className="flex-1">
                              <H className="m-0 ml-6 text-primary text-xl md:hidden">Payment Methods</H>
                              <Row className="bg-white-100 shadow-xs flex-1 p-6 rounded-lg gap-4 flex-col md:flex-row items-center w-full h-full">
                                    {
                                          hasCreditCard ? (
                                                <VirtualCard />
                                          ): (
                                                <Picture 
                                                container={{
                                                  className: "w-full max-w-[350px] h-[150px]"
                                                }}
                                                image={{
                                                  alt: "",
                                                  src: "/images/profile-bg.png"
                                                }}
                                              />
                                          )
                                    }
                                    <Column className="gap-8 md:max-w-[200px] p-4">
                                          <Column className="gap-1">
                                                <H className="m-0 text-primary hidden md:block">
                                                      {
                                                            hasCreditCard? "Payment Methods" : "No Credit/Debit card"
                                                      }
                                                </H>
                                                <P className="m-0 text-primary-foreground">
                                                      {
                                                            hasCreditCard? "Change /Update your payment methods here" : "Please add your card here"
                                                      }
                                                </P>
                                          </Column>
                                          {
                                                hasCreditCard? (
                                                      <Button className="w-full md:max-w-[140px]">Update</Button>
                                                ): (
                                                      <Dialog>
                                                            <DialogTrigger><Button className="w-full md:max-w-[140px]">Add New Card</Button></DialogTrigger>
                                                            <DialogContent className="w-full max-w-[700px] flex flex-col gap-6">
                                                                  <DialogHeader>
                                                                        <DialogTitle className="text-center">Add your Card Details</DialogTitle>
                                                                  </DialogHeader>
                                                                  <AddCardFrom />
                                                            </DialogContent>
                                                      </Dialog>
                                                      
                                                )
                                          }
                                    </Column>
                              </Row>
                        </div> */}
                  </Row>
                 {/*  <Row className="gap-4 flex-wrap flex-col md:flex-row">
                        <Column className="flex-1 gap-6 font-dm-sans p-4 bg-white-100 shadow-xs rounded-lg">
                              <Column>
                                    <H className="text-xl text-primary">Move History</H>
                                    <p className="text-primary-foreground text-base">Here you can find all your transactions on this account and you can print them out as a .pdf or .csv file</p>  
                              </Column>
                              <Column>
                                     <MoveHistory status="Pending" type="Hire labor" />
                                    <MoveHistory status="Pending" type="Hire labor" />
                                    <MoveHistory status="Pending" type="Hire labor" />
                              </Column>
                        </Column>
                        <Column className="flex-1 font-dm-sans p-4 bg-white-100 shadow-xs rounded-lg">
                              <Column>
                                    <H className="text-xl text-primary">Legal Policy</H>
                                    <p className="text-primary-foreground text-base">We believe in transparency, affordability, and excellent customer service. That&apos;s why we offer competitive pricing and easy payment options. Our app also automates the invoicing and billing process, saving you time and hassle. For any legal enquiries you may have, browse through the categories below</p>  
                              </Column>
                        </Column>
                  </Row> */}
                  <Row className="gap-4 flex-wrap">
                        <Column className="mt-6 flex-1 gap-4 md:max-w-[400px]">
                              <Button 
                                    loading={loading} 
                                    onClick={() => signOut()} 
                                    variant="secondary" 
                                    size="lg"
                              >Sign Out</Button>
                              <DeleteAccount trigger={<Button variant="destructive" size="lg">Delete Account</Button>} />
                        </Column>
                        {/* empty by design */}
                        <div className="flex-1 hidden md:block" />
                  </Row>
            </Column>
      )
}

export default Page;