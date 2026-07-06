import * as signalR from "@microsoft/signalr";

class SignalRService{
    private connections: Map<string, signalR.HubConnection> = new Map();
    private readonly baseUrl: string;

    constructor() {
        this.baseUrl = "http://localhost:5000";
    }

    public buildConnection(hubUrl: string, isAuthRequired: boolean = false): void {
        if (this.connections.has(hubUrl)) {
            console.log(`SignalR Connection for ${hubUrl} already exists.`);
            return;
        }

        const options: signalR.IHttpConnectionOptions = {
            headers: { 'Idempotency-Key': crypto.randomUUID() },
            skipNegotiation: false,
            transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
        };

        if (isAuthRequired) {
            options.accessTokenFactory = () => localStorage.getItem('token') || "";
        }

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(this.baseUrl + hubUrl, options)
            .withAutomaticReconnect()
            .build();

        connection.onclose((error) => {
            console.warn(`SignalR Connection closed for ${hubUrl}: `, error);
        });

        this.connections.set(hubUrl, connection);
    }

    public async startConnection(hubUrl?: string): Promise<void> {
        if (hubUrl) {
            const conn = this.connections.get(hubUrl);
            if (!conn) {
                console.error(`Connection for ${hubUrl} is not built yet.`);
                return;
            }
            if (conn.state === signalR.HubConnectionState.Disconnected) {
                try {
                    await conn.start();
                    console.log(`SignalR Connected to: ${hubUrl}`);
                } catch (err) {
                    console.error(`Error while starting connection for ${hubUrl}: `, err);
                    setTimeout(() => this.startConnection(hubUrl), 5000);
                }
            }
            return;
        }

        // @ts-ignore
        for (const [url, conn] of this.connections.entries()) {
            if (conn.state === signalR.HubConnectionState.Disconnected) {
                try {
                    await conn.start();
                    console.log(`SignalR Connected to: ${url}`);
                } catch (err) {
                    console.error(`Error while starting connection for ${url}: `, err);
                }
            }
        }
    }

    public on(eventName: string, callback: (...args: any[]) => void, hubUrl?: string) {
        if (hubUrl) {
            const conn = this.connections.get(hubUrl);
            if (conn) {
                conn.on(eventName, callback);
            } else {
                console.error(`Cannot register '${eventName}'. Connection for ${hubUrl} not built.`);
            }
            return;
        }
        this.connections.forEach(conn => conn.on(eventName, callback));
    }

    public async invoke(methodName: string, hubUrl: string, ...args: any[]): Promise<any> {
        const conn = this.connections.get(hubUrl);
        if (!conn) {
            console.error(`SignalR Connection for ${hubUrl} not built.`);
            return;
        }
        try {
            return await conn.invoke(methodName, ...args);
        } catch (err) {
            console.error(`Error invoking ${methodName} on ${hubUrl}:`, err);
            throw err;
        }
    }

    public off(eventName: string, hubUrl?: string) {
        if (hubUrl) {
            const conn = this.connections.get(hubUrl);
            if (conn) conn.off(eventName);
            return;
        }
        this.connections.forEach(conn => conn.off(eventName));
    }

    public async stopConnection(hubUrl?: string): Promise<void> {
        if (hubUrl) {
            const conn = this.connections.get(hubUrl);
            if (conn) {
                await conn.stop();
                this.connections.delete(hubUrl);
                console.log(`SignalR Connection for ${hubUrl} stopped.`);
            }
            return;
        }
        // @ts-ignore
        for (const [url, conn] of this.connections.entries()) {
            await conn.stop();
            console.log(`SignalR Connection for ${url} stopped.`);
        }
        this.connections.clear();
    }
}

export const signalRService = new SignalRService();