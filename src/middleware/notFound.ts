import { Response } from "express";

export const notFound = ( res: Response ) => {
  res.status(404).json({ message: "Route not found"});
};