import { IFile, OrderedObject } from "s1mpl3-api-l1b";

export interface IAbility extends OrderedObject {
  id?: string;
  name: string;
  image: IFile;
  content: string;
}
