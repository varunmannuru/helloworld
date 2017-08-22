export class ClientInfo {
    constructor(
        public clientId: number,
        public alienNmbr  : number,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public gender: string,
        public ssn: string,
        public immigrationStatusCode: string,
      public secndMgntInd:String ,
      public entryDate:string ,
    public  dateOfBirth:string ,
     public countryOfOrigin:String,
     public primLang:String ,
    public   secndLang:String ,
     public secndLang2:String ,
     public secndLang3:String ,

    public  homePhone:String,
    public  cellPhone:String,
    public  emailAddr:String,
    public  addressStreet1:String,
     public addressCity:String,
    public  addressCounty:String,
    public  addressState:String,
    public  adddressZip:number,
    public maritalStatuCode:String,
    public intrptnReqdInd:String,
    public previousOccupationCode:String,
    public educationLevelCode :String,
    public primaryApplicantAlienNmbr: number,
    public primaryApplicantInd:String,
    public relationShipCode:String

    ){}
}
