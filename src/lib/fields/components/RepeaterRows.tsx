import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { IField } from "../../interfaces/IField";
import RepeaterRow from "./RepeaterRow";
import Store from "../../stores/RootStore";
const shortid = require("shortid");

interface IProps {
  field: IField;
}

const Rows = ({ field }: IProps) => {
  const store = useContext(Store);

  const rows = store.model[field.key].map((row: object, index: number) => {
    const id = shortid.generate();
    return <RepeaterRow parent={{ field, index }} key={id} />;
  });

  return rows;
};

export default observer(Rows);
