import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { SERVICES, SequenceStepsProps } from "..";
import {
  hireLabourSequenceStep1Schema,
  hireLabourSequenceStep2Schema,
  hireLabourSequenceStep3Schema,
} from "@/core/validators";
import { Column, Row } from "@/components/layout";
import { Button, P, Picture } from "@/components/atoms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import { Input } from "@/components/input";
import { InputDirectives } from "@/lib/helpers/inputDirectives";
import { DateInput } from "@/components/dateInput";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { toast } from "@/components/toast/use-toast";
import useHireLabourStore from "@/stores/hire-labour.store";
import { Textarea } from "@/components/textarea";
import { Camera, Cancel, Check } from "@/components/Icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { Checkbox } from "@/components/checkbox";
import { LocationInput } from "@/components/locationAutoCompleteInput";
import { Dialog, DialogContent, DialogTitle } from "@/components/dialog";
import Link from "next/link";
import { Routes } from "@/core/routing";
import { useGetQuotes } from "@/hooks/quote/useGetQuotes";
import { hireLabourFactory } from "@/core/models/hireLabourFactory";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorMessage } from "@/constants/enums";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "@/firebase/firestore";
import { generateBookingId } from "@/lib/helpers/generateBookingId";
import TimePicker from '../../../TimePicker';
import { CountableInput } from "@/components/input/CountableInput";
import { HireLabour } from "@/types/structs";


const Step1: FC<SequenceStepsProps> = ({ onChangeStep }) => {
  const router = useRouter();

  const { update, reset } = useHireLabourStore(state => state);
  let { date, time, serviceLocation, apartmentNumber, buildingType, elevatorAccess, flightOfStairs } = useHireLabourStore(state => state);

  const form = useForm<z.infer<typeof hireLabourSequenceStep1Schema>>({
    resolver: zodResolver(hireLabourSequenceStep1Schema),
    defaultValues: {
      date,
      time,
      serviceLocation,
      apartmentNumber,
      buildingType,
      elevatorAccess,
      flightOfStairs,
    },
  });

  const hasElevatorAccess = useWatch({
    control: form.control,
    name: "elevatorAccess",
  });

  useEffect(() => {
    localStorage.removeItem("bookingId");
  }, []);

  const onSubmit = (data: z.infer<typeof hireLabourSequenceStep1Schema>) => {
    onChangeStep("itm");
    update(data);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="text-grey-300 p-6 bg-white-100 flex flex-col gap-6 shadow-sm rounded-xl"
      >
        <Column className="gap-8">
          <Row className="gap-6 flex-col sm:flex-row">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <Column className="gap-3">
                    <FormLabel className="text-grey-300">Date</FormLabel>
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
                    <FormMessage className="text-destructive" />
                  </Column>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-grey-300">Time</FormLabel>
                  <FormControl>
                    <TimePicker onChange={(value) => field.onChange(value)} />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
          </Row>
          <Row className="gap-6 flex-col sm:flex-row">
            <LocationInput
              name="serviceLocation"
              control={form.control}
              label="Service Location"
              defaultValue={serviceLocation}
            />
            <FormField
              control={form.control}
              name="apartmentNumber"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-grey-300">
                    Apartment/Unit
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      {...InputDirectives.numbersOnly}
                      placeholder=""
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
          </Row>
          <Row className="gap-4 flex-col sm:flex-row">
            <FormField
              control={form.control}
              name="buildingType"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-grey-300">Building Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={buildingType}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Condo" />
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
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="elevatorAccess"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-grey-300">
                    Elevator Access
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={elevatorAccess}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Yes" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            {hasElevatorAccess === "No" && (
              <FormField
                control={form.control}
                name="flightOfStairs"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-grey-300">
                      Flight of Stairs
                    </FormLabel>
                    <FormControl>
                      <CountableInput
                        style={{ input: "h-10 rounded-lg", button: "h-8" }}
                        count={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage className="text-destructive" />
                  </FormItem>
                )}
              />
            )}
          </Row>
        </Column>
        <Row className="items-center justify-center my-8">
          <Button type="button" className="flex-1 max-w-[180px] rounded-3xl" onClick={() => {
            reset()
            router.push(Routes.root)
          }}>
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 max-w-[180px] bg-orange-100 rounded-3xl"
          >
            Save & Continue
          </Button>
        </Row>
      </form>
    </Form>
  );
};

const Step2: FC<SequenceStepsProps> = ({ onChangeStep }) => {
  const { update, removeImage, updateField } = useHireLabourStore(state => state);
  let { majorAppliances, workOutEquipment, pianos, hotTubs, poolTables, numberOfBoxes, instructions, images, tempImages } = useHireLabourStore(state => state);

  const form = useForm<z.infer<typeof hireLabourSequenceStep2Schema>>({
    resolver: zodResolver(hireLabourSequenceStep2Schema),
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
      const imageUrl = images[index];
      const urlParts = imageUrl.split("%2F");
      const folder = urlParts[0].split("/").pop();
      const fileName = urlParts[1].split("?")[0];

      const imageRef = ref(storage, `${folder}/${fileName}`);
      await deleteObject(imageRef);

      removeImage(index);
      form.setValue(
        "images",
        images.filter((_, i) => i !== index)
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

  const onSubmit = (data: z.infer<typeof hireLabourSequenceStep2Schema>) => {
    updateField("bookingId", bookingId);
    onChangeStep("generalInfo");
    update(data);
  };

  return (
    <Form {...form}>
      <form
        className="text-grey-300 p-6 bg-white-100 flex flex-col gap-6 shadow-sm rounded-xl"
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
                  <CountableInput
                    style={{ button: "h-8" }}
                    count={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="text-destructive" />
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
                  <CountableInput
                    style={{ button: "h-8" }}
                    count={field.value}
                    onChange={field.onChange}
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
                  <CountableInput
                    style={{ button: "h-8" }}
                    count={field.value}
                    onChange={field.onChange}
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
                  <CountableInput
                    style={{ button: "h-8" }}
                    count={field.value}
                    onChange={field.onChange}
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
                  <CountableInput
                    style={{ button: "h-8" }}
                    count={field.value}
                    onChange={field.onChange}
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
                  <CountableInput
                    style={{ button: "h-8" }}
                    count={field.value}
                    onChange={field.onChange}
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
            {images.map((image, index) => (
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
            {images.length > 0 && (
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
                        onChange={(e) => {
                          if (e.target.files) {
                            updateField("images", [
                              ...images,
                              URL.createObjectURL(e.target.files[0]),
                            ]);
                            field.onChange([
                              ...images,
                              URL.createObjectURL(e.target.files[0]),
                            ]);
                          }
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </Row>
          {images?.length <= 0 && (
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
                      onChange={(e) => {
                        if (e.target.files) {
                          updateField("images", [
                            ...images,
                            URL.createObjectURL(e.target.files[0]),
                          ]);
                          field.onChange([
                            ...images,
                            URL.createObjectURL(e.target.files[0]),
                          ]);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>
        <Row className="items-center justify-center my-8">
          <Button
            type="button"
            className="flex-1 max-w-[180px] rounded-3xl"
            onClick={() => onChangeStep("dlt")}
          >
            Previous
          </Button>
          <Button
            type="submit"
            className="flex-1 max-w-[180px] bg-orange-100 rounded-3xl"
          >
            Save & Continue
          </Button>
        </Row>
      </form>
    </Form>
  );
};

const Step3: FC<SequenceStepsProps> = ({ onChangeStep }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updating = searchParams.get("action") === "update";
  const { update, services, serviceLocation } = useHireLabourStore((state) => state);
  const [loading, setLoading] = useState(false);
  const { isPending, getQuotes } = useGetQuotes({
    onSuccess: () => {
      router.push(
        `${Routes.hireLabourQuotes}${updating ? "?action=update" : ""}`
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

  const form = useForm<z.infer<typeof hireLabourSequenceStep3Schema>>({
    resolver: zodResolver(hireLabourSequenceStep3Schema),
    defaultValues: {
      services: services,
    },
  });

  const onSubmit = (data: z.infer<typeof hireLabourSequenceStep3Schema>) => {
    update(data);
    
    const state = useHireLabourStore.getState() as HireLabour;
    if (serviceLocation) getQuotes(hireLabourFactory(state));
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
                                return checked
                                  ? field.onChange([
                                    ...(field.value || []),
                                    service.id,
                                  ])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== service.id
                                    )
                                  );
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
        <Row className="items-center justify-center my-8">
          <Button
            type="button"
            className="flex-1 max-w-[180px] rounded-3xl"
            onClick={() => onChangeStep("itm")}
          >
            Previous
          </Button>
          <Button
            loading={isPending || loading}
            type="submit"
            className="flex-1 max-w-[180px] bg-orange-100 rounded-3xl"
          >
            Get Qoutes
          </Button>
        </Row>
      </form>
    </Form>
  );
};

export const HireLabourSequence = {
  Step1,
  Step2,
  Step3,
};
