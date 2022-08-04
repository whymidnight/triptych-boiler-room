import React from "react";
import { Button } from "@mui/material";

interface props {
  message: string;
  buttons:
    | {
        label: string;
        handler: (event: React.MouseEvent<HTMLButtonElement>) => void;
      }[]
    | null;
}

const MenuModals = (props: props): JSX.Element => {
  return (
    <div className="MenuModalsComponent card m-4">
      {props.message}
      <div className="card-content buttons-menu has-text-centered">
        {props.buttons &&
          props.buttons.map(({ label, handler }, index) => (
            <Button
              key={index}
              className="button is-primary m-2"
              onClick={handler}
            >
              <span>{label}</span>
            </Button>
          ))}
      </div>
    </div>
  );
};

export default MenuModals;
