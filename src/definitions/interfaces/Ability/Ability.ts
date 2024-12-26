import { IFile } from "../";

export interface IAbility {
  id?: string;
  name: string;
  image: IFile;
  content: string;
}
