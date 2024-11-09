"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";
import { UserData } from "@/lib/types";

interface EditProfileButtonProps {
  data: UserData;
}

function EditProfileButton({ data }: EditProfileButtonProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>Edit Profile</Button>
      <EditProfileDialog
        user={data}
        open={showDialog}
        onClose={setShowDialog}
      />
    </>
  );
}

export default EditProfileButton;
