import { IFile } from "../IFile";

export interface IPresentation {
    id?: string;
    title: string;
    content: string;
    image: IFile;
}