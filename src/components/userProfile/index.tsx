import { FC, useState, useEffect } from "react";
import { Button, P } from "../atoms";
import { Edit } from "../Icons";
import { Column, Row } from "../layout";
import { Tooltip } from "../tooltip";
import { useUpdateUserDetails } from "@/hooks/fireStore/useUpdateUserDetails";
import { Input } from "../input";
import useUserStore from "@/stores/user.store";

export const UserProfileItem: FC = () => {
  const { user } = useUserStore((state) => state);
  const { updateProfile, loading } = useUpdateUserDetails();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [isFormValid, setIsFormValid] = useState(true);

  useEffect(() => {
    setIsFormValid(fullName.trim() !== "" && phoneNumber.trim() !== "");
  }, [fullName, phoneNumber]);

  const handleUpdateProfile = () => {
    if (isFormValid) {
      updateProfile(fullName, phoneNumber);
      setIsEditing(false);
    }
  };

  return (
    <Row className="items-center">
      {isEditing ? (
        <Column className="flex-1">
          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button
            className="button"
            loading={loading}
            onClick={handleUpdateProfile}
            disabled={loading || !isFormValid}
          >
            Update
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </Column>
      ) : (
        <Row className="items-center justify-between w-full">
          <Column className="flex-1 text-center justify-self-center">
            <P className="font-dm-sans text-xl font-bold text-blue-200">
              {fullName || user?.fullName}
            </P>
            <P className="text-grey-100 text-lg">
              {phoneNumber || user?.phoneNumber}
            </P>
          </Column>
          <Tooltip
            trigger={
              <Button
                size="icon"
                variant="link"
                onClick={() => {
                  setIsEditing(true);
                  setFullName(user?.fullName || "");
                  setPhoneNumber(user?.phoneNumber || "");
                }}
                disabled={!user?.fullName || !user?.phoneNumber}
              >
                <Edit invertColor={false} width={15} height={15} />
              </Button>
            }
            content="Edit"
          />
        </Row>
      )}
    </Row>
  );
};
