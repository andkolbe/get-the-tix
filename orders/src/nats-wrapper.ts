import  { connect, Stan } from 'node-nats-streaming'

// all the code to connect to our nats server
// create a nats client object that internally keeps track of a client that will be available to everything else inside of our app
// make it work similar to mongoose
class NatsWrapper {
    // private means that nothing else inside of the app can access _client
    // the ? tells typescript this property might be undefined for a period of time
    // we want to expose it, but also display an error if it is undefined, if someone tries to access the client before we have called connect
    // we can do this by using a typescript getter
    private _client?: Stan

    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS client without connecting')
        }

        return this._client
    }

    // in connect, we create an instance of the nats client and assign it to the _client variable
    connect(clusterId: string, clientId: string, url: string) {
        this._client = connect(clusterId, clientId, { url })

        // wrap in a Promise so we can use async/await instead of callback function
        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Connected to NATS')
                resolve()
            })
            this.client.on('error', (err) => {
                reject(err)
            })
        })
    }
}

export const natsWrapper = new NatsWrapper()