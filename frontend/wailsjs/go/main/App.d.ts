// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {main} from '../models';

export function AddBackUp(arg1:string,arg2:string):Promise<main.AddBackUpResonse>;

export function DeleteActiveBackUp(arg1:string):Promise<main.DeleteActiveBackupResponse>;

export function DeleteBackUp(arg1:string):Promise<main.DeleteBackupResponse>;

export function GetActiveBackUps(arg1:string):Promise<main.GetActiveBackUpsResponse>;

export function GetBackups():Promise<main.GetBackUpsResponse>;

export function RestoreActiveBackup(arg1:string):Promise<main.ResoteBackUpResponse>;

export function SelectSource():Promise<string>;

export function TakeBackup(arg1:string,arg2:string):Promise<main.TakeBackupResponse>;
