export interface IFile {
    name: string;
    content: Uint8Array | Buffer; // receive a Uint8array but need as a buffer to store
}