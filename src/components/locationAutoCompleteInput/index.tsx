//@ts-nocheck
import { useState, useEffect, FC, useCallback } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../form";
import { useGoogleAutoComplete } from "@/hooks/misc/useGoogleAutoComplete";
import { Input } from "../input";
import { debounce } from "lodash";
import useBookMoveStore from "@/stores/book-move.store";
import { trimTextAtPeriod } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useFormContext } from "react-hook-form";
import useOutsideClick from "@/hooks/useOutsideClick";
import useHireLabourStore from "@/stores/hire-labour.store";
import { useValidRoute } from "@/hooks/useValidRoute";
import { Routes } from "@/core/routing";

interface LocationInputProps {
  name: string;
  control: any;
  label?: string;
  index?: number;
  defaultValue?: string
}

const LocationInput: FC<LocationInputProps> = ({ name, control, label, defaultValue }) => {
  const { isValidRoute: isHireLabourRoute } = useValidRoute(Routes.sequence.hireLabour)
  const { googleAutoComplete, data, isPending } = useGoogleAutoComplete();
  const [inputValue, setInputValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useOutsideClick(() => setIsOpen(false));

  const { setValue } = useFormContext();
  const updateField = useBookMoveStore((state) => state.updateField);
  const { updateField: updateHireLabourField } = useHireLabourStore((state) => state);

  useEffect(() => {
    // TODO: I gotta clean this up a bit, also deal with types and stuff :(
    if (data) {
      setSuggestions(data.predictions);
    } else {
      setSuggestions([]);
    }
  }, [data]);

  useEffect(() => {
    setIsOpen(suggestions.length > 0 || isPending);
  }, [suggestions, isPending]);

  const debouncedFetch = useCallback(
    debounce((query: string) => {
      if (query) {
        googleAutoComplete({ input: query, radius: 1800 });
      }
    }, 300),
    [googleAutoComplete]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedFetch(e.target.value);
  };

  const handleSuggestionClick = (suggestion: any, field: any) => {
    setInputValue(suggestion.description);
    field.onChange(suggestion.description);
    const trimmedName = trimTextAtPeriod(name);

    if (isHireLabourRoute) {
      setValue(name, suggestion.description);
      setValue("googlePlaceId", suggestion.place_id);
      updateHireLabourField(name, suggestion.description)
      updateHireLabourField("googlePlaceId", suggestion.place_id)
    } else {
      setValue(`${trimmedName}.location`, suggestion.description);
      setValue(`${trimmedName}.googlePlaceId`, suggestion.place_id);
      updateField(trimmedName, {
        location: suggestion.description,
        googlePlaceId: suggestion.place_id
      });
    }
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div ref={ref} className="flex flex-col gap-2">
              {/* TODO: How can I make value be field.value instead? */}
              <Input {...field} defaultValue={field.value} value={inputValue} onChange={handleChange} />
              {isOpen && (
                <ul className="bg-white border p-4 flex flex-col gap-2 shadow-custom rounded-md max-h-[200px] overflow-y-auto">
                  {isPending ? (
                    <div className="flex justify-center items-center">
                      <Loader className="animate-spin w-[25px] h-[25px] text-primary" />
                    </div>
                  ) : (
                    suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion, field)}
                        className="text-black cursor-pointer"
                      >
                        {suggestion.description}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const StopsLocationInput: FC<LocationInputProps> = ({ name, index, label, defaultValue }) => {
  const { control, setValue } = useFormContext();
  const { googleAutoComplete, data, isPending } = useGoogleAutoComplete();
  const [inputValue, setInputValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useOutsideClick(() => setIsOpen(false));

  const updateField = useBookMoveStore((state) => state.updateField);

  useEffect(() => {
    if (data) {
      setSuggestions(data.predictions);
    } else {
      setSuggestions([]);
    }
  }, [data]);

  useEffect(() => {
    setIsOpen(suggestions.length > 0 || isPending);
  }, [suggestions, isPending]);

  const debouncedFetch = useCallback(
    debounce((query: string) => {
      if (query) {
        googleAutoComplete({ input: query, radius: 1800 });
      }
    }, 300),
    [googleAutoComplete]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    debouncedFetch(e.target.value);
  };

  const handleSuggestionClick = (suggestion: any) => {
    setInputValue(suggestion.description);
    setValue(`${name}.location`, suggestion.description);
    setValue(`${name}.googlePlaceId`, suggestion.place_id);
    updateField(`stops[${index}]`, {
      location: suggestion.description,
      googlePlaceId: suggestion.place_id,
    });
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <FormField
      control={control}
      name={`${name}.location`}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div ref={ref} className="flex flex-col gap-2">
              <Input {...field} value={inputValue} onChange={handleChange} />
              {isOpen && (
                <ul className="bg-white border p-4 flex flex-col gap-2 shadow-custom rounded-md max-h-[200px] overflow-y-auto">
                  {isPending ? (
                    <div className="flex justify-center items-center">
                      <Loader className="animate-spin w-[25px] h-[25px] text-primary" />
                    </div>
                  ) : (
                    suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-black cursor-pointer"
                      >
                        {suggestion.description}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export {
  LocationInput,
  StopsLocationInput
}
