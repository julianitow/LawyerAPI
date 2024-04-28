export interface IArticle {
    id?: string;
    title: string;
    keywords: string[];
    author: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}