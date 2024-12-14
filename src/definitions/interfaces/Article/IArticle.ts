import { IFile } from "./IFile";

export interface IArticle {
    id?: string;
    title: string;
    keywords: string[];
    author: string;
    content: string;
    image: IFile;
    createdAt?: Date;
    updatedAt?: Date;
}