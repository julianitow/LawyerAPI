import { IFile } from "../IFile";

export interface IPresentation {
    id?: string;
    title: string;
    content: string;
    quote: string;
    image: IFile;
}