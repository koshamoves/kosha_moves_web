import { FC, useEffect, useState } from "react";
import { SERVICES, SequenceStepsProps } from "..";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  bookMoveSequenceStep1Schema,
  bookMoveSequenceStep2Schema,
  bookMoveSequenceStep3Schema,
  bookMoveSequenceStep4Schema,
} from "@/core/validators";
import { DateInput } from "@/components/dateInput";
import { Button, P, Picture } from "@/components/atoms";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Column, Row } from "@/components/layout";
import { Input } from "@/components/input";
import { InputDirectives } from "@/lib/helpers/inputDirectives";
import { Add, Camera, Cancel } from "@/components/Icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import useBookMoveStore from "@/stores/book-move.store";
import { Textarea } from "@/components/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { Checkbox } from "@/components/checkbox";
import { bookMoveFactory } from "@/core/models/bookMoveFactory";
import { useGetQuotes } from "@/hooks/quote/useGetQuotes";
import {
  LocationInput,
  StopsLocationInput,
} from "@/components/locationAutoCompleteInput";
import { useRouter, useSearchParams } from "next/navigation";
import { Routes } from "@/core/routing";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/firebase/firestore";
import { generateBookingId } from "@/lib/helpers/generateBookingId";
import { ErrorMessage } from "@/constants/enums";
import { toast } from "@/components/toast/use-toast";

const Step1: FC<SequenceStepsProps> = ({ onChangeStep }) => {
  const router = useRouter();
  const { update, formData, removeStop, reset } = useBookMoveStore(
    (state) => state
  );
  const { moveDate, time, stops, pickUpLocation, finalDestination } = formData;
  const form = useForm<z.infer<typeof bookMoveSequenceStep1Schema>>({
    resolver: zodResolver(bookMoveSequenceStep1Schema),
    defaultValues: {
      moveDate,
      time,
      pickUpLocation,
      stops,
      finalDestination,
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "stops",
    control: form.control,
  });

  useEffect(() => {
    localStorage.removeItem("bookingId");
  }, []);
  const onSubmit = (data: z.infer<typeof bookMoveSequenceStep1Schema>) => {
    onChangeStep("propertyDetail");
    update(data);
  };
  return (
    <Form {...form}>
      <form className="text-grey-300" onSubmit={form.handleSubmit(onSubmit)}>
        <Column className="bg-white-100 shadow-sm rounded-xl gap-6 p-6 sm:p-12">
          <Row className="gap-6 flex-col sm:flex-row">
            <FormField
              control={form.control}
              name="moveDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Column className="gap-3">
                    <FormLabel>Move Date</FormLabel>
                    <DateInput
                      field={field}
                      trigger={
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "h-14 pl-3 text-left font-normal hover:bg-white-100 hover:scale-1",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span></span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      }
                    />
                    <FormMessage />
                  </Column>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      defaultValue={formData.time}
                      type="time"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Row>
          <Row className="gap-6 flex-col sm:flex-row">
            <LocationInput
              name="pickUpLocation.location"
              control={form.control}
              label="Pickup Location"
              defaultValue={pickUpLocation.location}
            />
            <FormField
              control={form.control}
              name="pickUpLocation.apartmentNumber"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Apartment/Unit</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      {...InputDirectives.numbersOnly}
                      defaultValue={formData.pickUpLocation.apartmentNumber}
                      placeholder=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Row>
        </Column>
        <AnimatePresence>
          <div>
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{
                  opacity: 0,
                  y: -100,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 100,
                }}
                className="group"
              >
                <Row className="px-6 justify-between items-center">
                  <div className="relative h-[58px] max-w-max border-l-2 border-dotted border-primary" />
                  <Button
                    type="button"
                    variant="ghost"
                    className="bg-transparent hover:bg-transparent px-0 max-w-max hidden group-hover:inline"
                    onClick={() => {
                      remove(index);
                      removeStop(index);
                    }}
                  >
                    <span className="bg-primary w-[27px] h-[27px] rounded-full flex items-center justify-center">
                      <div className="border w-3" />
                    </span>
                  </Button>
                </Row>
                <Row className="bg-white-100 shadow-sm rounded-xl gap-6 p-6 sm:p-12 flex-col sm:flex-row">
                  <StopsLocationInput
                    name={`stops.${index}`}
                    index={index}
                    control={form.control}
                    label={`Stop ${index + 1}`}
                    defaultValue={stops[index]?.location}
                  />
                  <FormField
                    control={form.control}
                    name={`stops.${index}.apartmentNumber`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Apartment/Unit</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            {...InputDirectives.numbersOnly}
                            placeholder=""
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Row>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
        <div>
          <div className="px-6">
            <div className="relative h-[58px] max-w-max border-l-2 border-dotted border-primary">
              <Button
                type="button"
                variant="ghost"
                className="bg-transparent hover:bg-transparent px-0 max-w-max absolute top-[50%] -left-[14.5px] translate-y-[-50%]"
                onClick={() =>
                  append({
                    location: "",
                    apartmentNumber: "",
                  })
                }
              >
                <Add className="w-[27px] h-[27px] mr-2" />
                Add Stop
              </Button>
            </div>
          </div>
          <Row className="bg-white-100 shadow-sm rounded-xl gap-6 p-6 sm:p-12 flex-col sm:flex-row">
            <LocationInput
              name="finalDestination.location"
              control={form.control}
              label="Final Destination"
              defaultValue={finalDestination.location}
            />
            <FormField
              control={form.control}
              name="finalDestination.apartmentNumber"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Apartment/Unit</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      {...InputDirectives.numbersOnly}
                      defaultValue={formData.finalDestination.apartmentNumber}
                      placeholder=""
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Row>
        </div>
        <Row className="items-center justify-center my-8 flex-wrap">
          <Button
            type="button"
            className="order-1 sm:order-0 flex-1 min-w-[200px] sm:max-w-[180px] rounded-3xl"
            onClick={() => {
              reset();
              router.push(Routes.root);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="order-0 sm:order-1 flex-1 min-w-[200px] sm:max-w-[180px] bg-orange-100 rounded-3xl"
          >
            Save & Continue
          </Button>
        </Row>
      </form>
    </Form>
  );
};

const Step2: FC<SequenceStepsProps> = ({ onChangeStep }) => {
  const { formData, update } = useBookMoveStore((state) => state);
  const { PUDFinalDestination, PUDPickUpLocation, PUDStops } = formData;
  const form = useForm<z.infer<typeof bookMoveSequenceStep2Schema>>({
    resolver: zodResolver(bookMoveSequenceStep2Schema),
    defaultValues: {
      PUDPickUpLocation,
      PUDFinalDestination,
      PUDStops:
        (PUDStops?.length || 0) > 0
          ? PUDStops
          : formData.stops.map(() => ({
              buildingType: "",
              flightOfStairs: "0",
              elevatorAccess: "",
            })),
    },
  });

  const finalDestinationBuildingType = useWatch({
    control: form.control,
    name: "PUDFinalDestination.buildingType",
  });
  const finalDestinationElevatorAccess = useWatch({
    control: form.control,
    name: "PUDFinalDestination.elevatorAccess",
  });
  const pickUpLocationBuildingType = useWatch({
    control: form.control,
    name: "PUDPickUpLocation.buildingType",
  });
  const pickUpLocationElevatorAccess = useWatch({
    control: form.control,
    name: "PUDPickUpLocation.elevatorAccess",
  });
  const stopsBuildingType = useWatch({
    control: form.control,
    name: formData.stops.map(
      (_, index) => `PUDStops.${index}.buildingType`
    ) as "PUDStops"[],
  });
  const stopsElevatorAccess = useWatch({
    control: form.control,
    name: formData.stops.map(
      (_, index) => `PUDStops.${index}.elevatorAccess`
    ) as "PUDStops"[],
  });

  const onSubmit = (data: z.infer<typeof bookMoveSequenceStep2Schema>) => {
    onChangeStep("generalInfo");
    update(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="text-grey-300">
        <div>
          <Row className="bg-white-100 justify-between shadow-sm rounded-xl gap-6 p-6 sm:p-12 flex-col sm:flex-row">
            <Column className="flex-1 max-w-[250px]">
              <P className="font-semibold text-lg">Pickup Location</P>
              <P className="font-bold text-primary text-xl">
                {formData.pickUpLocation.location}
              </P>
            </Column>
            <Row className="gap-4 flex-1 items-center sm:min-w-[300px]">
              <div className="md:flex items-center hidden">
                <div className="mt-8 w-[80px] border border-dotted" />
              </div>
              <Row className="gap-4 flex-col sm:flex-row sm:items-end w-full">
                <FormField
                  control={form.control}
                  name="PUDPickUpLocation.buildingType"
                  render={({ field }) => (
                    <FormItem className="flex-1 relative">
                      <FormLabel className="text-grey-300">
                        Building Type
                      </FormLabel>
                      <Select
                        onValueChange={(...arg) => {
                          field.onChange(...arg);
                          form.trigger("PUDPickUpLocation.elevatorAccess");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Condo">Condo</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Office">Office</SelectItem>
                          <SelectItem value="TownHouse">TownHouse</SelectItem>
                          <SelectItem value="Storage">Storage</SelectItem>
                          <SelectItem value="Store">Store</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive sm:absolute" />
                    </FormItem>
                  )}
                />
                {pickUpLocationBuildingType !== "House" && (
                  <FormField
                    control={form.control}
                    name="PUDPickUpLocation.elevatorAccess"
                    render={({ field }) => (
                      <FormItem className="flex-1 relative">
                        <FormLabel className="text-grey-300">
                          Elevator Access
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-destructive sm:absolute" />
                      </FormItem>
                    )}
                  />
                )}
                {(pickUpLocationElevatorAccess === "No" ||
                  pickUpLocationBuildingType === "House") && (
                  <FormField
                    control={form.control}
                    name="PUDPickUpLocation.flightOfStairs"
                    render={({ field }) => (
                      <FormItem className="flex-1 relative">
                        <FormLabel className="text-grey-300">
                          Flight of Stairs
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-10 rounded-lg"
                            placeholder="0"
                            {...field}
                            {...InputDirectives.numbersOnly}
                          />
                        </FormControl>
                        <FormMessage className="text-destructive sm:absolute" />
                      </FormItem>
                    )}
                  />
                )}
              </Row>
            </Row>
          </Row>
          <div className="px-6">
            <div className="relative h-[40px] max-w-max border-l-2 border-dotted border-primary" />
          </div>
        </div>
        {formData.stops.map((stop, index) => (
          <div key={stop.location + index}>
            <Row className="bg-white-100 justify-between shadow-sm rounded-xl gap-6 p-6 sm:p-12 flex-col sm:flex-row">
              <Column className="flex-1 max-w-[250px]">
                <P className="font-semibold text-lg">Stop {index + 1}</P>
                <P className="font-bold text-primary text-xl">
                  {stop.location}
                </P>
              </Column>
              <Row className="gap-4 flex-1 items-center">
                <div className="hidden sm:flex items-center">
                  <div className="mt-8 w-[80px] border border-dotted" />
                </div>
                <Row className="gap-4 flex-col sm:flex-row w-full">
                  <FormField
                    control={form.control}
                    name={`PUDStops.${index}.buildingType`}
                    render={({ field }) => (
                      <FormItem className="flex-1 relative">
                        <FormLabel className="text-grey-300">
                          Building Type
                        </FormLabel>
                        <Select
                          onValueChange={(...arg) => {
                            field.onChange(...arg);
                            form.trigger(`PUDStops.${index}.elevatorAccess`);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Condo">Condo</SelectItem>
                            <SelectItem value="Apartment">Apartment</SelectItem>
                            <SelectItem value="House">House</SelectItem>
                            <SelectItem value="Office">Office</SelectItem>
                            <SelectItem value="TownHouse">TownHouse</SelectItem>
                            <SelectItem value="Storage">Storage</SelectItem>
                            <SelectItem value="Store">Store</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-destructive sm:absolute" />
                      </FormItem>
                    )}
                  />
                  {(stopsBuildingType as unknown as string[])[index] !==
                    "House" && (
                    <FormField
                      control={form.control}
                      name={`PUDStops.${index}.elevatorAccess`}
                      render={({ field }) => (
                        <FormItem className="flex-1 relative">
                          <FormLabel className="text-grey-300">
                            Elevator Access
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-destructive sm:absolute" />
                        </FormItem>
                      )}
                    />
                  )}
                  {((stopsElevatorAccess as unknown as ("Yes" | "No")[])[
                    index
                  ] === "No" ||
                    (stopsBuildingType as unknown as string[])[index] ===
                      "House") && (
                    <FormField
                      control={form.control}
                      name={`PUDStops.${index}.flightOfStairs`}
                      render={({ field }) => (
                        <FormItem className="flex-1 relative">
                          <FormLabel className="text-grey-300">
                            Flight of Stairs
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-10 rounded-lg"
                              {...field}
                              {...InputDirectives.numbersOnly}
                              defaultValue={0}
                            />
                          </FormControl>
                          <FormMessage className="text-destructive sm:absolute" />
                        </FormItem>
                      )}
                    />
                  )}
                </Row>
              </Row>
            </Row>
            <div className="px-6">
              <div className="relative h-[40px] max-w-max border-l-2 border-dotted border-primary" />
            </div>
          </div>
        ))}
        <div>
          <Row className="bg-white-100 justify-between shadow-sm rounded-xl gap-6 p-6 sm:p-12 flex-col sm:flex-row">
            <Column className="flex-1 max-w-[250px]">
              <P className="font-semibold text-lg">Final Destination</P>
              <P className="font-bold text-primary text-xl">
                {formData.finalDestination.location}
              </P>
            </Column>
            <Row className="gap-4 flex-1 items-center sm:min-w-[300px]">
              <div className="hidden sm:flex items-center">
                <div className="mt-8 w-[80px] border border-dotted" />
              </div>
              <Row className="gap-4 flex-col sm:flex-row sm:items-end w-full">
                <FormField
                  control={form.control}
                  name="PUDFinalDestination.buildingType"
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full relative">
                      <FormLabel className="text-grey-300">
                        Building Type
                      </FormLabel>
                      <Select
                        onValueChange={(...arg) => {
                          field.onChange(...arg);
                          form.trigger("PUDFinalDestination.elevatorAccess");
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Condo">Condo</SelectItem>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Office">Office</SelectItem>
                          <SelectItem value="TownHouse">TownHouse</SelectItem>
                          <SelectItem value="Storage">Storage</SelectItem>
                          <SelectItem value="Store">Store</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-destructive sm:absolute" />
                    </FormItem>
                  )}
                />
                {finalDestinationBuildingType !== "House" && (
                  <FormField
                    control={form.control}
                    name="PUDFinalDestination.elevatorAccess"
                    render={({ field }) => (
                      <FormItem className="flex-1 relative">
                        <FormLabel className="text-grey-300">
                          Elevator Access
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-destructive sm:absolute" />
                      </FormItem>
                    )}
                  />
                )}
                {(finalDestinationElevatorAccess === "No" ||
                  finalDestinationBuildingType === "House") && (
                  <FormField
                    control={form.control}
                    name="PUDFinalDestination.flightOfStairs"
                    render={({ field }) => (
                      <FormItem className="flex-1 relative">
                        <FormLabel className="text-grey-300">
                          Flight of Stairs
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-10 rounded-lg"
                            {...field}
                            {...InputDirectives.numbersOnly}
                          />
                        </FormControl>
                        <FormMessage className="text-destructive sm:absolute" />
                      </FormItem>
                    )}
                  />
                )}
              </Row>
            </Row>
          </Row>
        </div>
        <Row className="items-center justify-center my-8 flex-wrap">
          <Button
            type="button"
            className="order-1 sm:order-0 flex-1 min-w-[200px] sm:max-w-[180px] rounded-3xl"
            onClick={() => onChangeStep("dateAndTime")}
          >
            Previous
          </Button>
          <Button
            type="submit"
            className="order-0 sm:order-1 flex-1 min-w-[200px] sm:max-w-[180px] bg-orange-100 rounded-3xl"
          >
            Save & Continue
          </Button>
        </Row>
      </form>
    </Form>
  );
};

const Step3: FC<SequenceStepsProps> = ({ onChangeStep }) => {
  const { update, updateField, removeImage, formData } = useBookMoveStore(
    (state) => state
  );
  const {
    majorAppliances,
    workOutEquipment,
    pianos,
    hotTubs,
    poolTables,
    numberOfBoxes,
    instructions,
    images,
    tempImages,
  } = formData;
  const form = useForm<z.infer<typeof bookMoveSequenceStep3Schema>>({
    resolver: zodResolver(bookMoveSequenceStep3Schema),
    defaultValues: {
      majorAppliances,
      workOutEquipment,
      pianos,
      hotTubs,
      poolTables,
      numberOfBoxes,
      instructions,
      images,
    },
  });

  const [bookingId, setBookingId] = useState<string>("");

  // Generate a new unique ID when the component mounts
  useEffect(() => {
    const storedBookingId = localStorage.getItem("bookingId");
    if (storedBookingId) {
      setBookingId(storedBookingId);
    } else {
      const newBookingId = generateBookingId();
      setBookingId(newBookingId);
      localStorage.setItem("bookingId", newBookingId);
    }
  }, []);

  const handleRemoveImage = async (index: number) => {
    try {
      const imageUrl = formData.images[index];
      const urlParts = imageUrl.split("%2F");
      const folder = urlParts[0].split("/").pop();
      const fileName = urlParts[1].split("?")[0];

      const imageRef = ref(storage, `${folder}/${fileName}`);
      await deleteObject(imageRef);

      removeImage(index);
      form.setValue(
        "images",
        formData.images.filter((_, i) => i !== index)
      );
      updateField(
        "tempImages",
        tempImages!.filter((_, i) => i !== index)
      );
    } catch (error) {
      toast({
        title: "Oops!",
        description: ErrorMessage.FAILED_ACTION,
        variant: "destructive",
      });
    }
  };
  const handleUpload = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `${bookingId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const tempUrls = fileArray.map((file) => URL.createObjectURL(file));
      updateField("tempImages", [...tempImages!, ...tempUrls]);

      const uploadPromises = fileArray.map((file) => handleUpload(file));
      const uploadUrls = await Promise.all(uploadPromises);
      updateField("images", [...images!, ...uploadUrls]);
      form.setValue("images", [...images!, ...uploadUrls]);
    }
  };

  const onSubmit = (data: z.infer<typeof bookMoveSequenceStep3Schema>) => {
    updateField("bookingId", bookingId);
    onChangeStep("serviceRequirement");
    update(data);
  };
  return (
    <Form {...form}>
      <form
        className="text-grey-300 p-4 sm:p-6 bg-white-100 flex flex-col gap-6 shadow-sm rounded-xl"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Row className="flex-wrap gap-6 flex-col sm:flex-row">
          <FormField
            name="majorAppliances"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-grey-300">
                  Major Appliances
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    {...InputDirectives.numbersOnly}
                    placeholder="0"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="workOutEquipment"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-grey-300">
                  Workout Equipment
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    {...InputDirectives.numbersOnly}
                    placeholder="0"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />
        </Row>
        <Row className="flex-wrap gap-6 flex-col sm:flex-row">
          <FormField
            name="pianos"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-grey-300">Pianos</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    {...InputDirectives.numbersOnly}
                    placeholder="0"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />
          <FormField
            name="hotTubs"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-grey-300">Hot Tubs</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    {...InputDirectives.numbersOnly}
                    placeholder="0"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />
        </Row>
        <Row className="flex-wrap gap-6 flex-col sm:flex-row">
          <FormField
            name="poolTables"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-grey-300">Pool Tables</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    {...InputDirectives.numbersOnly}
                    placeholder="0"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />
          <FormField
            name="numberOfBoxes"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel className="text-grey-300">Number of Boxes</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    {...InputDirectives.numbersOnly}
                    placeholder="0"
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
              </FormItem>
            )}
          />
        </Row>
        <FormField
          name="instructions"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-grey-300">Instructions</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Leave a note for any special instructions or requests you have for the movers"
                  className="resize-none"
                  {...field}
                  rows={6}
                />
              </FormControl>
              <FormMessage className="text-destructive" />
            </FormItem>
          )}
        />
        <div>
          <Row className="items-center flex-wrap gap-4">
            {tempImages!.map((image, index) => (
              <div
                key={image + index}
                className="relative flex-1 min-w-[120px] max-w-[150px] h-[99px] group"
              >
                <Picture
                  container={{
                    className: "w-full h-full rounded-lg",
                  }}
                  image={{
                    alt: "",
                    src: image,
                    className: "object-cover rounded-lg",
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="bg-transparent hover:bg-transparent p-0 max-w-max absolute -top-4 -right-2 hidden group-hover:inline"
                  onClick={() => handleRemoveImage(index)}
                >
                  <Cancel className="w-[24px] h-[24px]" />
                </Button>
              </div>
            ))}
            {tempImages!.length > 0 && (
              <FormField
                name="images"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1 max-w-[150px]">
                    <FormLabel htmlFor="images">
                      <div className="border h-[99px] flex items-center justify-center rounded-lg">
                        <span className="flex items-center justify-center bg-grey-300 w-[40px] h-[40px] rounded-full group-hover:scale-[1.05] group-hover:shadow-xl transition duration-300 ease-in-out">
                          <Camera className="w-[32px] h-[29px]" />
                        </span>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        id="images"
                        className="hidden"
                        multiple
                        onChange={handleChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </Row>
          {tempImages!?.length <= 0 && (
            <FormField
              name="images"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="images">
                    <Row className="items-center gap-4 group hover:cursor-pointer">
                      <span className="flex items-center justify-center bg-primary w-[80px] h-[80px] rounded-full group-hover:scale-[1.05] group-hover:shadow-xl transition duration-300 ease-in-out">
                        <Camera className="w-[32px] h-[29px]" />
                      </span>
                      <P>Add Photo</P>
                    </Row>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      id="images"
                      className="hidden"
                      multiple
                      onChange={handleChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>
        <Row className="items-center justify-center my-8 flex-wrap">
          <Button
            type="button"
            className="order-1 sm:order-0 flex-1 min-w-[200px] sm:max-w-[180px] rounded-3xl"
            onClick={() => onChangeStep("propertyDetail")}
          >
            Previous
          </Button>
          <Button
            type="submit"
            className="order-0 sm:order-1 flex-1 min-w-[200px] sm:max-w-[180px] bg-orange-100 rounded-3xl"
          >
            Save & Continue
          </Button>
        </Row>
      </form>
    </Form>
  );
};

const Step4: FC<SequenceStepsProps> = ({ onChangeStep }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updating = searchParams.get("action") === "update";
  const { update, formData } = useBookMoveStore((state) => state);
  const [loading, setLoading] = useState(false);
  const { isPending, getQuotes } = useGetQuotes({
    onSuccess: () => {
      router.push(
        `${Routes.bookMoveQuotes}${updating ? "?action=update" : ""}`
      );
    },
    onError: () => {
      setLoading(false);
    },
  });
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    if (isPending) setLoading(true);
  }, [isPending]);

  const form = useForm<z.infer<typeof bookMoveSequenceStep4Schema>>({
    resolver: zodResolver(bookMoveSequenceStep4Schema),
    defaultValues: {
      services: formData.services,
    },
  });

  const onSubmit = (data: z.infer<typeof bookMoveSequenceStep4Schema>) => {
    const updatedFormData = { ...formData, ...data };
    update(updatedFormData);
    if (formData.pickUpLocation.location)
      getQuotes(bookMoveFactory(updatedFormData));
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    form.setValue(
      "services",
      checked ? SERVICES.map((service) => service.id) : []
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="text-grey-300 p-6 bg-white-100 flex flex-col gap-6 rounded-xl shadow-sm"
      >
        <Table>
          <TableHeader>
            <Row className="mb-4 items-center">
              <FormControl>
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={handleSelectAllChange}
                />
              </FormControl>
              <FormLabel
                htmlFor="select-all"
                className="font-medium text-base ml-2 hover:cursor-pointer"
              >
                Select All
              </FormLabel>
            </Row>
            <TableRow>
              <TableHead className="w-[300px] text-grey-100">
                Services
              </TableHead>
              <TableHead className="text-grey-100 hidden sm:block">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SERVICES.map((service, index) => (
              <TableRow
                className="border-none hover:cursor-pointer"
                key={service.id + index}
              >
                <TableCell>
                  <FormField
                    control={form.control}
                    name="services"
                    render={({ field }) => {
                      const checkboxId = `services-${service.id}`;
                      const isChecked = field.value?.includes(service.id);
                      return (
                        <FormItem
                          key={service.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              className="data-[state=checked]:bg-orange-100 data-[state=checked]:border-orange-100"
                              id={checkboxId}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([
                                    ...(field.value || []),
                                    service.id,
                                  ]);
                                } else {
                                  field.onChange(
                                    field.value?.filter(
                                      (value) => value !== service.id
                                    )
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={checkboxId}
                            className={cn("font-medium text-grey-100", {
                              "text-primary font-medium": isChecked,
                            })}
                          >
                            {service.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                </TableCell>
                <TableCell className="hidden sm:block">
                  <FormLabel
                    htmlFor={`services-${service.id}`}
                    className={cn("font-medium")}
                  >
                    {service.description}
                  </FormLabel>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Row className="items-center justify-center my-8 flex-wrap">
          <Button
            type="button"
            className="order-1 sm:order-0 flex-1 min-w-[200px] sm:max-w-[180px] rounded-3xl"
            onClick={() => onChangeStep("generalInfo")}
          >
            Previous
          </Button>
          <Button
            loading={isPending || loading}
            type="submit"
            className="order-0 sm:order-1 flex-1 min-w-[200px] sm:max-w-[180px] bg-orange-100 rounded-3xl"
          >
            Get Quotes
          </Button>
        </Row>
      </form>
    </Form>
  );
};

export const BookMoveSequence = {
  Step1,
  Step2,
  Step3,
  Step4,
};
