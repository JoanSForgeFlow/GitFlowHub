import useAutocomplete from "@mui/base/useAutocomplete";
import {useState, useEffect } from "react";
import axiosClient from "../config/axiosClient";
import React from "react";
import { AxiosResponse } from "axios";
import useAuth from "../hooks/useAuth";

interface Option {
  label: string;
  value: string;
}



const DragList = () => {
  const [userOptions, setUserOptions] = useState<Option[]>([]);
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    options: userOptions,
    getOptionLabel: (option) => option.label,
  });

  const {optionUsers}=useAuth()

  useEffect(()=>{
    const usersList=optionUsers()
    setUserOptions(usersList)
},[])


  return (
    <React.Fragment>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
      </div>
      {groupedOptions.length > 0 && (
        <ul {...getListboxProps()}>
          {groupedOptions.map((option, index) => {
            if ("group" in option) {
              // It's a grouped option
              return (
                <li key={option.key} data-group={option.group}>
                  {option.group}
                </li>
              );
            } else {
              // It's an individual option
              return (
                <li key={option.value} {...getOptionProps({ option, index })}>
                  {option.label}
                </li>
              );
            }
          })}
        </ul>
      )}
    </React.Fragment>
  );
};

export default DragList;
