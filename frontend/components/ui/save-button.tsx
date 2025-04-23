import React from "react";
import { Button } from "./button";

const SaveButton = ({ loading }: { loading: boolean }) => {
  return (
    <Button disabled={loading} type="submit">
      {loading ? "Saving..." : "Save Changes"}
    </Button>
  );
};

export default SaveButton;
