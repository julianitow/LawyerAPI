import { IFile } from "..";
import { OrderedObject } from "../OrderedObject";

export interface IAbility extends OrderedObject {
  id?: string;
  name: string;
  image: IFile;
  content: string;
}
