import React from "react";
import { FluentComponent } from './manifest';

const PrimaryButton = (props) => {
  return (
    <FluentComponent {...props} manifestModule="./PrimaryButton" />
  )
};

export { PrimaryButton };
