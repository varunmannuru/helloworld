import { DropDownModelInfo } from './rss.dropdown';

export class RssInfo {
    constructor(
        public clientId: number,
        public alienNmbr  : number,
        public services:DropDownModelInfo[],
        public intakeDate:string,
        public cashAssistProgram:String

           
     
    ){}
}