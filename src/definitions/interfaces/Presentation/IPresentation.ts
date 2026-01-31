import { IFile } from "s1mpl3-api-l1b";

export interface IPresentation {
    id?: string;
    title: string;
    content: string;
    quote: string;
    image: IFile;
}