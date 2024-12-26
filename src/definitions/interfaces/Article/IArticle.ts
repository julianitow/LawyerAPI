import { IFile } from "../";

export interface IArticle {
  id?: string;
  title: string;
  summary: string;
  keywords: string[];
  author: string;
  content: string;
  image?: IFile;
  createdAt?: Date;
  updatedAt?: Date;
}
