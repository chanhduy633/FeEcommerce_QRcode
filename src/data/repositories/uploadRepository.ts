import { UploadRemote } from "../remotes/uploadRemote";

export interface IUploadRepository {
  upload(file: File): Promise<string>;
}

export class UploadRepository implements IUploadRepository {
  private remote: UploadRemote;

  constructor(remote: UploadRemote) {
    this.remote = remote;
  }

  async upload(file: File): Promise<string> {
    return this.remote.upload(file); 
  }
}
