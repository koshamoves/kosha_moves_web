import {
  BookingLocation,
  BookingTime,
  InfoCircle,
  TruckFront,
} from "@/components/Icons";
import { Button, H, P, Picture } from "@/components/atoms";
import { Checkbox } from "@/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/form";
import { DiscountInput } from "@/components/input";
import { Column, Row } from "@/components/layout";
import { toast } from "@/components/toast/use-toast";
import { ErrorMessage, StorageKeys } from "@/constants/enums";
import {
  bookMoveFactory,
  bookMoveReverseFactory,
} from "@/core/models/bookMoveFactory";
import {
  hireLabourFactory,
  hireLabourReverseFactory,
} from "@/core/models/hireLabourFactory";
import { Routes } from "@/core/routing";
import { useAddToBookings } from "@/hooks/fireStore/useAddToBookings";
import { useValidRoute } from "@/hooks/useValidRoute";
import { generateBookingId } from "@/lib/helpers/generateBookingId";
import { generateDoodles } from "@/lib/helpers/generateDoodle";
import { cn, formatCurrency, thing2 } from "@/lib/utils";
import useBookingStore from "@/stores/booking.store";
import useUserStore from "@/stores/user.store";
import {
  BookMove,
  Booking,
  HireLabour,
  Quote,
  QuoteDetailsRate,
  RequestType,
  Voucher,
} from "@/types/structs";
import { format } from "date-fns";
import { CircleAlert } from "lucide-react";
import { FC, HTMLAttributes, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { useRouter, usePathname } from "next/navigation";
import useBookMoveStore from "@/stores/book-move.store";
import { useUpdateBooking } from "@/hooks/fireStore/useUpdateBooking";
import { getAuth } from "firebase/auth";
import { useCancelBooking } from "@/hooks/fireStore/useCancelBooking";
import { useGetVoucher } from "@/hooks/misc/useGetVoucher";
import useHireLabourStore from "@/stores/hire-labour.store";
import { useGetQuotes } from "@/hooks/quote/useGetQuotes";
import Link from "next/link";
import { useBookMove } from "@/hooks/booking/useBookMove";
import { useUpdateMove } from "@/hooks/booking/useUpdateMove";
import { BookingStatusDto, MoveRequestDto, MoveUpdateDto } from "@/types/dtos";
import useQuoteDetailsStore from "@/stores/quote-details.store";

const QuoteDetails: FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => (
  <Row {...props} className={cn("flex gap-4", props.className)} />
);
interface QuotesDetailsLocationProps {
  locations: Array<{
    address: string;
    location?: string;
    apartmentNumber: string;
    buildingType: string;
    flightOfStairs: number;
    googlePlaceId: string;
    hasElevator: string;
    id: string;
  }>;
}
const QuoteDetailsLocation: FC<QuotesDetailsLocationProps> = ({
  locations,
}) => {
  return (
    <Row className="flex-1 bg-white-100 p-2 px-6 shadow-custom rounded-lg gap-1 order-2 lg:order-1">
      <BookingLocation className="w-[40px] h-[40px] min-w-[40px] min-h-[40px]" />
      <Row
        className={cn("gap-0 flex-wrap", {
          // "flex-col" : locations.length > 2
        })}
      >
        {locations.map((item, index) => {
          return (
            <Row
              key={index}
              className="items-center flex-1 min-w-[200px] max-w-[350px]"
            >
              {index !== 0 && (
                <div className="h-[50px] w-[6px] sm:w-[50px] sm:h-[6px] bg-primary rounded-md" />
              )}
              <Column className="gap-0 flex-1">
                <P className="text-primary text-base font-semibold">
                  {item.address || item.location}
                </P>
                <P className="text-grey-100 text-sm font-semibold">
                  {item.buildingType},{" "}
                  {item.hasElevator === "Yes"
                    ? "Elevator Available"
                    : "No Elevator"}
                </P>
              </Column>
            </Row>
          );
        })}
      </Row>
    </Row>
  );
};

interface QuoteDetailsMapProps extends HTMLAttributes<HTMLDivElement> {
  data: {
    location?: {
      lat: string;
      long: string;
    };
    name: string;
    charge: number;
    reviews: number;
    movesCompleted: string;
    companyId: string;
  };
}
const QuoteDetailsMap: FC<QuoteDetailsMapProps> = ({ data, ...props }) => {
  const { location, name, charge, reviews, movesCompleted, companyId } = data;
  return (
    <Column
      className={cn(
        "shadow-custom bg-white-100 rounded-lg p-4 gap-4",
        props.className
      )}
    >
      <Picture
        container={{
          className: "w-full h-24 rounded-lg",
        }}
        image={{
          alt: "",
          src: "/images/map.png",
          className: "object-cover rounded-lg",
        }}
      />
      <Column className="justify-center items-center gap-4">
        <H className="text-2xl text-grey-300">{name}</H>
        <Row className="items-start justify-evenly text-center gap-4 px-8">
          <Column className="gap-0 flex-1">
            <P className="text-primary font-bold font-dm-sans text-lg">
              {formatCurrency(charge)}
            </P>
            <P className="text-sm font-dm-sans text-grey-300">per hour</P>
          </Column>
          <Link href={`/reviews/${companyId}`}>
            <Column className="gap-0 flex-1">
              <P className="text-primary font-bold font-dm-sans text-lg">
                {reviews}
              </P>
              <P className="text-sm font-dm-sans text-grey-300">reviews</P>
            </Column>
          </Link>
          {movesCompleted !== "nil" && (
            <Column className="gap-0 flex-1">
              <P className="text-primary font-bold font-dm-sans text-lg">
                {+movesCompleted || 0}
              </P>
              <P className="text-sm font-dm-sans text-grey-300">
                moves completed
              </P>
            </Column>
          )}
        </Row>
      </Column>
    </Column>
  );
};

interface QuotesDetailsWorkersProps extends HTMLAttributes<HTMLDivElement> {
  movers: number;
  minMovers: number;
  finishing: boolean;
  disabled?: boolean;
  workerTag?: string;
}

const QuoteDetailsWorkers: FC<QuotesDetailsWorkersProps> = ({
  movers,
  minMovers = 1,
  disabled,
  workerTag = "Movers",
  finishing,
  ...props
}) => {
  const updateQuoteField = useQuoteDetailsStore(state => state.updateField);
  const [count, setCount] = useState<number>(movers);
  const doodles = useMemo(() => generateDoodles({ length: 3 }), []);

  useEffect(() => {
    updateQuoteField("movers", count);
  }, [count, updateQuoteField]);

  return (
    <Column
      className={cn(
        "max-w-[400px] text-center items-center justify-center gap-4 bg-white-100 shadow-custom rounded-lg p-4",
        props.className
      )}
    >
      <Row
        className={cn(
          "items-center w-full",
          !finishing ? "justify-between" : "justify-center"
        )}
      >
        {!finishing && (
          <Button
            disabled={disabled}
            onClick={() =>
              !disabled &&
              setCount((prev) => (prev > minMovers ? prev - 1 : minMovers))
            }
            className="flex-1 rounded-full shadow-custom max-w-[30px] max-h-[30px] p-0 text-xl font-medium bg-grey-800 text-grey-600 hover:bg-primary hover:text-white-100"
          >
            -
          </Button>
        )}
        <Column className="flex-1 max-w-max">
          <Row className="relative min-w-[210px]">
            {doodles.map((item, index) => (
              <div
                key={item + index}
                className={cn(
                  "w-[70px] h-[70px] p-[2px] rounded-full bg-white-100 border",
                  {
                    "relative mr-[-20px]": index !== doodles.length - 1,
                  },
                  `z-${index}`
                )}
              >
                <Picture
                  container={{ className: "w-full h-full rounded-full" }}
                  image={{
                    alt: "movers doodle",
                    src: item,
                    className: "rounded-full ",
                  }}
                />
              </div>
            ))}
          </Row>
          <H className="text-primary font-bold text-2xl">
            {count} {workerTag ?? "Movers"}
          </H>
        </Column>
        {!finishing && (
          <Button
            disabled={disabled}
            onClick={() => !disabled && setCount((prevCount) => prevCount + 1)}
            className="flex-1 rounded-full shadow-custom max-w-[30px] max-h-[30px] p-0 text-xl font-medium bg-grey-800 text-grey-600 hover:bg-primary hover:text-white-100"
          >
            +
          </Button>
        )}
      </Row>
      {!finishing && (
        <P className="px-12 font-dm-sans text-grey-300 text-base">
          Click on the -\+ sign to increase or reduce the number of movers
        </P>
      )}
    </Column>
  );
};
interface QuoteDetailsRatesProps extends HTMLAttributes<HTMLDivElement> {
  rates: Array<QuoteDetailsRate>;
}
const QuoteDetailsRates: FC<QuoteDetailsRatesProps> = ({ rates }) => {
  return (
    <Column className="p-4 bg-white-100 shadow-custom rounded-lg">
      <H level={2} className="text-primary font-dm-sans text-lg">
        Rates
      </H>
      <Column>
        {rates
          .filter((item) => item.count > 0)
          .map((item, index) => {
            const price = item.rate * item.count; // due to filter, item.count is at least 1 

            return (
              <Row
                key={item.label + index}
                className="items-center justify-between p-3 bg-white-100 shadow-custom rounded-lg"
              >
                <Row className="items-center">
                  <span className="w-[40px] h-[40px] bg-white-300 flex items-center justify-center rounded-lg">
                    {item.icon}
                  </span>
                  <P className="text-primary">
                    {item.label} {item.count ? `(${item.count})` : null}
                  </P>
                </Row>
                <P className="text-primary font-bold">
                  {formatCurrency(price) /* FIXME: some behaviour changed here. Is it still correct? */}
                </P>
              </Row>
            );
          })}
      </Column>
    </Column>
  );
};

interface QuoteDetailsVehicleProps {
  truckType: string;
  disabled?: boolean;
  finishing: boolean;
}
const QuoteDetailsVehicle: FC<QuoteDetailsVehicleProps> = ({
  truckType,
  disabled,
  finishing,
}) => {
  const updateQuoteField = useQuoteDetailsStore(store => store.updateField);

  //TODO: confirm the types of vehicles available
  const truckList = [
    { type: "pickup truck", image: "/images/truckPickUp.png", quantity: 0 },
    { type: "van", image: "/images/truckVan.png", quantity: 0 },
    { type: "16 ft", image: "/images/truck16.png", quantity: 0 },
    { type: "24 ft", image: "/images/truck24.png", quantity: 0 },
  ];

  const [trucks, setTrucks] = useState(truckList);
  const [selectedTruck, setSelectedTruck] = useState({
    type: truckType,
    quantity: 0,
  });

  const handleIncrease = (index: number) => {
    if (disabled) return;
    setTrucks((prevTrucks) =>
      prevTrucks.map((truck, i) =>
        i === index ? { ...truck, quantity: truck.quantity + 1 } : truck
      )
    );
    if (trucks[index].type === selectedTruck.type) {
      setSelectedTruck((prevSelectedTruck) => ({
        ...prevSelectedTruck,
        quantity: prevSelectedTruck.quantity + 1,
      }));
    }
  };

  const handleDecrease = (index: number) => {
    if (disabled) return;
    setTrucks((prevTrucks) =>
      prevTrucks.map((truck, i) =>
        i === index && truck.quantity > 0
          ? { ...truck, quantity: truck.quantity - 1 }
          : truck
      )
    );
    if (
      trucks[index].type === selectedTruck.type &&
      selectedTruck.quantity > 0
    ) {
      setSelectedTruck((prevSelectedTruck) => ({
        ...prevSelectedTruck,
        quantity: prevSelectedTruck.quantity - 1,
      }));
    }
  };

  const handleSelectTruck = (type: string) => {
    if (disabled) return;
    const selected = trucks.find((truck) => truck.type === type);
    if (selected) {
      setSelectedTruck({ type: selected.type, quantity: selected.quantity });
    }
  };

  useEffect(() => {
    updateQuoteField("movingTruck", selectedTruck.type);
  }, [selectedTruck.type, updateQuoteField]);

  return (
    <Column className="gap-6 w-full p-4 bg-white-100 shadow-custom rounded-lg">
      {!!NaN && (
        <H level={2} className="text-primary font-dm-sans text-lg">
          Choose Truck
        </H>
      )}
      <Column className="gap-4">
        {trucks.filter((truck) => truck.type === truckType).length === 0 && (
          <p className="text-gray-600">No truck available.</p>
        )}
        {trucks
          .filter((truck) => truck.type === truckType)
          .map((item, index) => (
            <Row key={index} className="justify-between items-center">
              <Row
                onClick={() => !!NaN && handleSelectTruck(item.type)}
                className={twMerge(
                  `items-center`,
                  !disabled && !!NaN && "cursor-pointer"
                )}
              >
                {!!NaN &&
                  (selectedTruck.type === item.type ? (
                    <span className="rounded-full border border-primary w-[20px] h-[20px] flex items-center justify-center">
                      <span className="bg-primary w-[10px] h-[10px] rounded-full" />
                    </span>
                  ) : (
                    <span className="border border-primary w-[20px] h-[20px] rounded-full" />
                  ))}
                <Picture
                  container={{
                    className: "w-[60px] h-[60px] rounded-full ml-4",
                  }}
                  image={{
                    alt: item.type,
                    src: item.image,
                    className: "rounded-full",
                  }}
                />
              </Row>
              {!finishing && !!NaN && (
                <Row className="items-center gap-4">
                  <Button
                    disabled={disabled}
                    size="icon"
                    className="max-w-[20px] max-h-[20px]"
                    onClick={() => handleDecrease(index)}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    disabled={disabled}
                    size="icon"
                    className="max-w-[20px] max-h-[20px]"
                    onClick={() => handleIncrease(index)}
                  >
                    +
                  </Button>
                </Row>
              )}
            </Row>
          ))}
      </Column>
    </Column>
  );
};

interface QuoteDetailsChargeProps extends HTMLAttributes<HTMLDivElement> {
  amount: number;
  hourlyRate: number;
  finishing?: boolean;
  updating?: boolean;
}
const QuoteDetailsCharge: FC<QuoteDetailsChargeProps> = ({
  amount,
  hourlyRate,
  finishing,
  updating,
  ...props
}) => {
  const { isValidRoute: isHireLabourRoute } = useValidRoute(
    Routes.hireLabourQuoteDetails
  );
  const selectedBooking = useBookingStore.use.selectedBooking();
  const { user } = useUserStore((state) => state);
  const { isPending: isSubmitPending, isSuccess: isSubmitSuccess, bookMove } = useBookMove();
  const { isPending: isUpdatePending, isSuccess: isUpdateSuccess, updateMove } = useUpdateMove();

  const shouldDisableSubmit = isSubmitPending ||
    isUpdatePending ||
    isSubmitSuccess ||
    isUpdateSuccess;

  //const { isPending, mutate: updateBooking } = useUpdateBooking();

  const bookData = useBookMoveStore(state => state) as BookMove; // FIXME: some type safety here? 
  const hireData = useHireLabourStore(state => state) as HireLabour;

  // FIXME: merging the two types like this isn't the best imo. (temp fix so things aren't too broken)
  const formData: BookMove | HireLabour = isHireLabourRoute ? hireData : bookData;

  const quoteDetails = useQuoteDetailsStore(state => state) as Quote;


  const router = useRouter();
  const pathname = usePathname();
  const [gottenVoucher, setGottenVoucher] = useState<Voucher | null>(null);
  const { isPending: isDeletePending, mutate: deleteBooking } =
    useCancelBooking();
  const { isPending: isGettingVoucher, mutate: getVoucher } = useGetVoucher({
    onSuccess: (data) => {
      setGottenVoucher(data);
    },
    onError: () => {
      setGottenVoucher(null);
    },
  });
  const { isPending: isGettingQuotes, getQuotes } = useGetQuotes({
    onSuccess: () => {
      if (
        selectedBooking &&
        (selectedBooking.requestType === RequestType.RegularMove ||
          selectedBooking.requestType === RequestType.LabourOnly)
      ) {
        router.push(
          `${selectedBooking.requestType === RequestType.RegularMove
            ? Routes.bookMoveQuotes
            : Routes.hireLabourQuotes
          }?action=update`
        );
      }
    },
  });

  if (!formData || !quoteDetails) {
    toast({
      title: "Oops!",
      description: ErrorMessage.SERVICE_REQUEST_MADE,
      variant: "default",
    });
    return;
  }

  const handleBook = () => {
    if (!selectedBooking && updating) return;

    const formattedFormData = isHireLabourRoute ? hireLabourFactory(hireData) : bookMoveFactory(bookData);
    const data = {
      clientId: user?.uid ?? "", // FIXME: some of the data here we don't want to just ignore if its not present
      clientName: user?.fullName ?? "",
      searchRequest: {
        ...formattedFormData,
        additionalNotes: formData.instructions
      },
      bookingDate: new Date(),
      quote: { ...quoteDetails, voucherCode: gottenVoucher?.code ?? "" },
    } as MoveRequestDto;

    if (updating) {
      if (!selectedBooking?.bookingId) return;

      const moveUpdateDto: MoveUpdateDto = {
        bookingId: selectedBooking.bookingId,
        moveRequest: data,
        status: BookingStatusDto.Edited,
        modifiedDate: new Date()
      };

      updateMove(moveUpdateDto);
    } else {
      bookMove(data);
    }
  };

  //TODO: how the voucher code works
  if (!selectedBooking && updating) return null;
  const currentUser = getAuth().currentUser;

  return (
    <Column
      {...props}
      className="gap-12 w-full p-6 bg-white-100 shadow-custom rounded-lg"
    >
      <H level={2} className="text-primary font-dm-sans text-lg">
        Total minimum charge
      </H>
      {gottenVoucher ? (
        <div className="flex flex-wrap gap-2 items-end leading-[100%]">
          <H level={3} className="text-xl font-bold line-through">
            {"$" + amount}
          </H>
          <H className="text-3xl font-bold">
            {formatCurrency(
              ((amt: number) => {
                const { discountType: type, clientDiscount } = gottenVoucher;
                if (type === "Amount") {
                  return amt - clientDiscount;
                } else {
                  return amt - (clientDiscount / 100) * amt;
                }
              })(amount)
            )}
          </H>
        </div>
      ) : (
        <H className="text-3xl font-bold">{formatCurrency(amount)}</H>
      )}
      {gottenVoucher && (
        <>
          <p className="mt-[-2.5rem]">
            Discount applied: -
            {gottenVoucher.discountType === "Amount" ? "$" : ""}
            {gottenVoucher.clientDiscount}
            {gottenVoucher.discountType === "Percentage" ? "%" : ""}
          </p>
        </>
      )}
      <Column className="gap-6">
        <P className="text-grey-600 text-sm">
          Note: After the minimum charge, you would be charged
          {` ${formatCurrency(hourlyRate / 4)} `}
          for every additional 15 minutes
        </P>

        {!finishing && (
          <>
            <>
              <DiscountInput
                placeholder="Input Discount Code"
                className="bg-white-400 border-dashed border-2 border-white-500 placeholder:text-grey-400"
                timeout={1500}
                onInputSettled={(str: string) => {
                  console.warn("discount str: ", str);
                  getVoucher({ code: str });
                }}

              />
              {isGettingVoucher && (
                <p className="text-sm italic">Checking voucher...</p>
              )}
            </>

            <Button
              disabled={shouldDisableSubmit}
              loading={shouldDisableSubmit}
              onClick={() => {
                if (!currentUser) router.push(`${Routes.signIn}?returnUrl=${pathname}`);
                if (!(!formData || !quoteDetails) && currentUser)
                  handleBook();
              }}
            >
              {
                !currentUser ? "Sign in to complete booking" :
                  (updating ?
                    (isUpdatePending ? "Updating..." : "Update Booking") :
                    "Book Now")
              }
            </Button>
          </>
        )}
        {finishing && currentUser && (
          <>
            {/* {user?.hasCreditCard ? (
              <Button className="bg-[#19B000]">Make Payment</Button>
            ) : (
              !!NaN && <Button className="bg-[#19B000]">Pay on site</Button>
            )} */}
            {selectedBooking?.status === "Pending" && (
              <Button
                disabled={isDeletePending}
                loading={isDeletePending}
                className="bg-[#CD1A1A33] text-[#DB3434]"
                onClick={() => {
                  if (!selectedBooking?.bookingId) return;
                  deleteBooking({
                    bookingId: selectedBooking.bookingId,
                  });
                }}
              >
                Cancel Request
              </Button>
            )}
            {selectedBooking?.status === "Rejected" && (
              <Button
                disabled={isGettingQuotes}
                loading={isGettingQuotes}
                onClick={() => {
                  if (!selectedBooking?.bookingId) return;
                  if (selectedBooking.requestType === RequestType.RegularMove) {
                    getQuotes(
                      bookMoveFactory(bookMoveReverseFactory(selectedBooking))
                    );
                  } else if (selectedBooking.requestType === RequestType.LabourOnly) {
                    getQuotes(
                      hireLabourFactory(
                        hireLabourReverseFactory(selectedBooking)
                      )
                    );
                  }
                }}
              >
                Search for new vendor
              </Button>
            )}
          </>
        )}
      </Column>
    </Column>
  );
};

const QuoteDetailsEditRequest: FC<{ type: Booking["requestType"] }> = ({
  type,
}) => {
  const router = useRouter();
  const { update: updateBookMove } = useBookMoveStore((state) => state);
  const { update: updateHireLabour } = useHireLabourStore((state) => state);
  const selectedBooking = useBookingStore.use.selectedBooking();
  if (!selectedBooking) return null;
  return (
    <Column className="bg-[#00000099] p-6 space-y-3 rounded-lg">
      <div className="flex justify-center items-center">
        <InfoCircle />
      </div>
      <p className="text-center text-sm text-white-500">
        Do you wish to make any changes to your request?
      </p>
      <Button
        className="bg-white-500 text-black-500"
        onClick={() => {
          if (type === RequestType.RegularMove) {
            updateBookMove(bookMoveReverseFactory(selectedBooking));
          } else if (type === RequestType.LabourOnly) {
            updateHireLabour(hireLabourReverseFactory(selectedBooking));
          }
          router.push(
            `${selectedBooking.requestType === RequestType.RegularMove
              ? Routes.sequence.bookMove
              : Routes.sequence.hireLabour
            }?action=update`
          );
        }}
      >
        Edit request Details
      </Button>
    </Column>
  );
};

interface QuoteDetailsServiceRequirementProps
  extends HTMLAttributes<HTMLDivElement> {
  services: Array<String>;
  disabled?: boolean;
}

const QuoteDetailsServiceRequirement: FC<
  QuoteDetailsServiceRequirementProps
> = ({ disabled, ...props }) => {

  const updateMove = useBookMoveStore(state => state.update);


  const services = [
    "reassembly",
    "disassembly",
    "furniture wrapping",
    "dollies",
    "moving pads",
    "straps",
    "floor runners",
    "tape",

    "move garage items",
    "move patio items",
  ];

  const form = useForm({
    defaultValues: {
      services: useBookMoveStore(state => state.services),
    },
  });

  const { watch, control, setValue } = form;

  const watchedServices = watch("services");

  useEffect(() => {
    updateMove({ services: watchedServices });
  }, [updateMove, watchedServices]);

  return (
    <Column
      {...props}
      className="gap-12 w-full p-6 bg-white-100 shadow-custom rounded-lg"
    >
      <H level={2} className="text-primary font-dm-sans text-lg">
        Services Requirements
      </H>
      <Form {...form}>
        <form>
          {services.map((item, index) => (
            <FormField
              key={index}
              control={control}
              name="services"
              render={({ field }) => {
                const checkboxId = `services-${item}`;
                const isChecked = field.value?.includes(item);
                return (
                  <FormItem className="flex flex-row items-center gap-4 space-y-0 mb-2">
                    <FormControl>
                      <Checkbox
                        className="data-[state=checked]:bg-orange-100 data-[state=checked]:border-orange-100"
                        id={checkboxId}
                        disabled={disabled}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (disabled) return;
                          const updatedServices = checked
                            ? [...(field.value || []), item]
                            : field.value?.filter((value) => value !== item);
                          setValue("services", updatedServices);
                          field.onChange(updatedServices);
                        }}
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor={checkboxId}
                      className={cn(
                        "font-medium text-grey-100 hover:cursor-pointer",
                        {
                          "text-primary font-medium": isChecked,
                        }
                      )}
                    >
                      {item}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
        </form>
      </Form>
    </Column>
  );
};

interface QuoteDetailsNotesImagesProps extends HTMLAttributes<HTMLDivElement> {
  images: Array<string>;
  notes: string;
}
const QuoteDetailsNotesImages: FC<QuoteDetailsNotesImagesProps> = ({
  images,
  notes,
}) => {
  return (
    <Column className="gap-12 w-full p-6 bg-white-100 shadow-custom rounded-lg">
      <H level={2} className="text-grey-300 font-dm-sans text-lg">
        Notes & Images
      </H>
      {images.length > 0 && (
        <Row className="flex-wrap gap-4">
          {images.map((image, index) => (
            <div
              key={image + index}
              className="relative flex-1 min-w-[250px] max-w-[300px] h-[180px] group"
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
            </div>
          ))}
        </Row>
      )}
      <P className="text-grey-400">
        <i>{notes}</i>
      </P>
    </Column>
  );
};
const QuoteDetailsEDT = () => {
  return (
    <Column className="gap-10 w-full p-6 bg-white-100 shadow-custom rounded-lg">
      <H level={2} className="text-grey-300 font-dm-sans text-lg">
        Estimated Delivery Time
      </H>

      <Column className="gap-8 text-grey-300 font-dm-sans font-normal">
        <P>Date: 11th May, 2024</P>
        <H className="text-primary text-2xl">8:00am - 2:00pm</H>
        <Row className="items-center">
          <TruckFront className="w-[20px] h-[20px]" />
          <P>4.7 Kilometres</P>
        </Row>
      </Column>
    </Column>
  );
};
interface QuoteDetailsStatusProps extends HTMLAttributes<HTMLDivElement> {
  status:
  | "New"
  | "Pending"
  | "Confirmed"
  | "Rejected"
  | "InProgress"
  | "Completed"
  | "DepositHeld"
  | "Cancelled"
  | "Edited"
  | "Paused"
  | "PendingPayment";
}
const QuoteDetailsStatus: FC<QuoteDetailsStatusProps> = ({ status }) => {
  return (
    <Column className="flex-1 bg-white-100 p-2 gap-2 px-6 shadow-custom rounded-lg">
      <P className="text-sm text-primary-foreground">Status</P>
      <P
        className={cn("font-bold text-lg text-grey-600", {
          "text-orange-500": status === "Pending",
          "text-green-200": status === "Confirmed",
          "text-red-500": status == "Cancelled",
        })}
      >
        {status}
      </P>
    </Column>
  );
};

interface QuoteDetailsDateProps {
  date: string;
  time: string;
}
const QuoteDetailsDate: FC<QuoteDetailsDateProps> = ({ date, time }) => {
  return (
    <Row className="flex-1 items-center bg-white-100 p-2 gap-2 px-6 shadow-custom rounded-lg">
      <BookingTime className="w-[30px] h-[30px]" />
      <Column className="gap-0">
        <P className="text-grey-100 text-sm font-semibold">{date}</P>
        <P className="text-sm font-semibold">{time}</P>
      </Column>
    </Row>
  );
};

const QuoteDetailsEdit = () => {
  return (
    <Column className="bg-grey-300 p-6 justify-center">
      <CircleAlert className="w-[24px] h-[24px]" />
      <P className="text-white-100">
        Do you wish to make any changes to your request?
      </P>
      <Button className="text-grey-300 bg-white-100">
        Edit request Details
      </Button>
    </Column>
  );
};
export {
  QuoteDetails,
  QuoteDetailsLocation,
  QuoteDetailsMap,
  QuoteDetailsWorkers,
  QuoteDetailsRates,
  QuoteDetailsVehicle,
  QuoteDetailsCharge,
  QuoteDetailsServiceRequirement,
  QuoteDetailsNotesImages,
  QuoteDetailsEDT,
  QuoteDetailsStatus,
  QuoteDetailsEdit,
  QuoteDetailsEditRequest,
  QuoteDetailsDate,
};
