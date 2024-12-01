export namespace main {
	
	export class BackUp {
	    Id: number;
	    Name: string;
	    Source: string;
	    Path: string;
	    Metadata?: string;
	    // Go type: time
	    Created: any;
	
	    static createFrom(source: any = {}) {
	        return new BackUp(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Name = source["Name"];
	        this.Source = source["Source"];
	        this.Path = source["Path"];
	        this.Metadata = source["Metadata"];
	        this.Created = this.convertValues(source["Created"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class AddBackUpResonse {
	    Backup?: BackUp;
	    Error: any;
	
	    static createFrom(source: any = {}) {
	        return new AddBackUpResonse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Backup = this.convertValues(source["Backup"], BackUp);
	        this.Error = source["Error"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class DeleteActiveBackupResponse {
	    Error: any;
	
	    static createFrom(source: any = {}) {
	        return new DeleteActiveBackupResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Error = source["Error"];
	    }
	}
	export class DeleteBackupResponse {
	    Error: any;
	
	    static createFrom(source: any = {}) {
	        return new DeleteBackupResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Error = source["Error"];
	    }
	}
	export class ActiveBackup {
	    Id: number;
	    Name: string;
	    BackUp?: BackUp;
	    Metadata?: string;
	    Active: number;
	    // Go type: time
	    Created: any;
	
	    static createFrom(source: any = {}) {
	        return new ActiveBackup(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Id = source["Id"];
	        this.Name = source["Name"];
	        this.BackUp = this.convertValues(source["BackUp"], BackUp);
	        this.Metadata = source["Metadata"];
	        this.Active = source["Active"];
	        this.Created = this.convertValues(source["Created"], null);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetActiveBackUpsResponse {
	    ActiveBackups: ActiveBackup[];
	    Error: any;
	
	    static createFrom(source: any = {}) {
	        return new GetActiveBackUpsResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ActiveBackups = this.convertValues(source["ActiveBackups"], ActiveBackup);
	        this.Error = source["Error"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class GetBackUpsResponse {
	    Backups: BackUp[];
	    Error: any;
	
	    static createFrom(source: any = {}) {
	        return new GetBackUpsResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Backups = this.convertValues(source["Backups"], BackUp);
	        this.Error = source["Error"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class ResoteBackUpResponse {
	    Error: any;
	
	    static createFrom(source: any = {}) {
	        return new ResoteBackUpResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Error = source["Error"];
	    }
	}
	export class TakeBackupResponse {
	    Error: any;
	
	    static createFrom(source: any = {}) {
	        return new TakeBackupResponse(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Error = source["Error"];
	    }
	}

}

