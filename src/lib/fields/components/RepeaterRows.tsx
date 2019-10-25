import * as React from "react";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { IField } from "../../interfaces/IField";
import { IParent } from "../../interfaces/IParent";
import RepeaterRow from "./RepeaterRow";
import Store from "../../stores/RootStore";
const shortid = require("shortid");

interface IProps {
  field: IField;
  ancestors?: IParent[];
}

const Rows = ({ field, ancestors }: IProps) => {
  const store = useContext(Store);
  const rows = store.getValue(field, ancestors);

  const rowLayout = rows.map((row: object, index: number) => {
    const id = shortid.generate();
    return (
      <RepeaterRow field={field} ancestors={ancestors} index={index} key={id} />
    );
  });

  return rowLayout;
};

export default observer(Rows);
