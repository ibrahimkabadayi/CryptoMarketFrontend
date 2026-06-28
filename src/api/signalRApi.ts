import * as signalR from "@microsoft/signalr";

class SignalRService{
    private connection: signalR.HubConnection | null = null;
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = "http://localhost:5000"
    }

    public async startConnection(hubUrl: string, isAuthRequired: boolean = false): Promise<void> {
        if (this.connection) {
            console.log("Connection already exists.");
            return;
        }

        try{
            const options: signalR.IHttpConnectionOptions = {
                headers: {
                    'Idempotency-Key': crypto.randomUUID()
                }
            };

            if (isAuthRequired){
                options.accessTokenFactory = () => localStorage.getItem('token') || "";
            }

            this.connection = new signalR.HubConnectionBuilder()
               .withUrl(this.baseUrl + hubUrl, options)
               .withAutomaticReconnect()
               .build();

            console.log(this.connection.baseUrl);

            await this.connection.start();

            this.connection.onclose((error) => {
                console.warn("SignalR Connection closed: ", error);
                this.connection = null;
            });

        }catch (err){
            console.error("Error while starting connection: ", err);
            setTimeout(() => this.startConnection(hubUrl), 5000);
        }
    }

    public on(eventName: string, callback:(...args: any[]) => void){
        if (!this.connection) {
            console.log("SignalR Connection not established yet.");
            return;
        }
        this.connection.on(eventName, callback);
    }

    public async invoke(methodName: string, ...args: any[]):  Promise<any> {
        if (!this.connection) {
            console.error("SignalR Connection not started yet.");
            return;
        }
        try {
            return await this.connection.invoke(methodName, ...args);
        } catch (err) {
            console.error(`Error invoking ${methodName}:`, err);
            throw err;
        }
    }

    public off(eventName: string){
        if (this.connection) {
            this.connection.off(eventName);
        }
    }

    public async stopConnection(): Promise<void> {
        if (this.connection) {
            try {
                await this.connection.stop();
                this.connection = null;
                console.log("SignalR Connection stopped.");
            } catch (err) {
                console.error("Error while stopping connection: ", err);
            }
        }
    }
}

export const signalRService = new SignalRService();