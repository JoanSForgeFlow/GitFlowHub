import Autocomplete from "@mui/material/Autocomplete";
import { useState, useEffect, useRef } from "react";
import React from "react";
import useAuth from "../hooks/useAuth";

import TextField from "@mui/material/TextField";
import "../css/PRDashboard.css";
import Button from "@mui/material/Button";

interface Option {
  label: string;
  value: string;
}

const DragList = () => {
  const [userOptions, setUserOptions] = useState<Option[]>([]);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [displayEdit, setDisplayEdit] = useState(false);

  //TODO Poner en asignee el que nos sale en la db
  const [asignee, setAsignee] = React.useState<string | null>("");
  const [inputValue, setInputValue] = React.useState("");
  const { optionUsers } = useAuth();

  console.log(userOptions);

  useEffect(() => {
    const usersList = async () => {
      const list = await optionUsers();
      setUserOptions(list);
    };

    usersList();
  }, []);

  //Function that sets the value to false when leving the asignee div
  const handleMouse = () => {
    setDisplayEdit(!displayEdit);
  };

  return (
    <div className="flex w-full">
      <div onClick={handleMouse} className="w-2rem mr-3 mt-4">
        Asignee:
      </div>

      {displayEdit ? (
        <div className="flex flex-grow justify-center items-center">
          <Autocomplete
            value={inputValue}
            onChange={(event, newValue) => {
              setAsignee(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            id="controllable-states-demo"
            options={userOptions.map((option) => option.label)}
            sx={{ width: "200px" }}
            renderInput={(params) => <TextField {...params} label="Asignee" />}
          />

          <button
            value="Asign"
            className="bg-sky-700 w-400 py-1 px-2 ml-1  text-white uppercase rounded-lg hover:cursor-pointer hover:bg-sky-950 transition-colors"
            onClick={() => setDisplayEdit(false)}
          >
            Asign
          </button>
        </div>
      ) : (
        <div className="flex w-full justify-center items-center mt-4">
          <div
            className={`w-full ${
              isMouseOver
                ? "rounded-tl-md rounded-bl-md flex-grow border border-slate-400"
                : ""
            }`}
            style={{ minHeight: "1.8rem" }}
            onClick={() => setDisplayEdit(true)}
            onMouseEnter={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false)}
          >
            {asignee}
          </div>

          {isMouseOver && (
            <div className="material-symbols-outlined  bg-slate-500 pt-1 rounded-tr-md rounded-br-md">
              Edit
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DragList;
