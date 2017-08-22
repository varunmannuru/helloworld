export class ClientSearchRequest {
    constructor(
        public alienNmbr  : number,
        public firstName: string,
        public lastName: string,
        public dateOfBirth: string,
        public entryDate: string,
        public defaultDate: string
    ){}
}
