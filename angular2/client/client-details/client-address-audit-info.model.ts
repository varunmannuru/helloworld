export class ClientAddressAuditInfo {
    constructor(
        public address: string,
        public city: string,
        public county: string,
        public zip: string,
        public auditType:string,
        public auditDate:string,
        public auditUser:string,
    ){}
}
