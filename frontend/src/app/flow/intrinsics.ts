import { Type } from "./types";

export const floatType = new Type("Float",
  "A decimal number.");
export const intType = new Type("Integer",
  "A number with no fractional part.");
export const strType = new Type("String",
  "A variable amount of text.");
export const boolType = new Type("Boolean",
  "A value that is either true or false.");
