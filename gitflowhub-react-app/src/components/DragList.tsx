import useAutocomplete from "@mui/base/useAutocomplete";
import {useState, useEffect } from "react";
import axiosClient from "../config/axiosClient";
import React from "react";
import { AxiosResponse } from "axios";

interface Option {
  label: string;
  value: string;
}

interface User {
  id: number;
  name: string;
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

  useEffect(() => {
    const optionUsers = async () => {
      try {
        //Find users of the same company in db
        const response: AxiosResponse<User[]> = await axiosClient("/prs/users");

        const users: User[] = response.data;

        //transform data according to component
        const userOptions = users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    optionUsers();
  }, []);

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
