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

interface User {
  id: number;
  email: string;
  username: string | null;
  password: string;
  token: string | null;
  confirmed: boolean;
  location: string | null;
  language: string | null;
  timeZone: string | null;
  image: string | null;
  github_user: string;
  login: string;
  avatar_url: string;
  company_id: number;
}

const DragList = ({id_PR,asigned_user}) => {

  //TODO: asignee has to be checked in db

  const [userOptions, setUserOptions] = useState<Option[]>([]);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [displayEdit, setDisplayEdit] = useState(false);

  const [asignee, setAsignee] = React.useState<string | null>("");
  const [inputValue, setInputValue] = React.useState("");
  const { optionUsers,assignUser,getPR} = useAuth();

  useEffect(() => {
    const usersList = async () => {
      const list = await optionUsers();
      setUserOptions(list);
      
    };

    const loadAsignee= async()=>{
      const PR = await getPR(id_PR)
      const loadedAsignee=PR.asigned_user?.username

      if (loadAsignee) {
        setAsignee(loadedAsignee)
        
      } else{
        setAsignee("")

      }

    }
    usersList();
    loadAsignee()

  }, []);

  //Function that sets the value to false when leving the asignee div
  const handleMouse = () => {
    setDisplayEdit(!displayEdit);
  };

  const handleAssign=()=>{
    setDisplayEdit(false)
    
    const assignAction= async()=>{
      await assignUser({username:asignee,id_PR:id_PR})
    }

    assignAction()
    
  };

  return (
    <div className="flex w-full">
      <div onClick={handleMouse} className="w-2rem mr-3 mt-4 font-bold cursor-pointer">
        Asignee:
      </div>

      {displayEdit ? (
        <div className="flex flex-grow justify-center items-center">
          <Autocomplete
            value={asignee}
            onChange={(event, newValue) => {
              setAsignee(newValue);
              setInputValue(newValue)
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
            onClick={handleAssign}
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
