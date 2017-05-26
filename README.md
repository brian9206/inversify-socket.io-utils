# inversify-socket.io-utils
Some utilities for the development of socket.io applications with Inversify.

## The Basics
### Step 1: Decorate your event handlers
To use a class as a "event handler" for your socket.io app, simply add the `@EventHandler` decorator to the class.
The following example will declare a event handler that responds to 'foo' event.

```ts
import { IEventHandler, EventHandler, InversifySocketIOClient } from 'inversify-socket.io-utils';
import { injectable, inject } from 'inversify';

@EventHandler('foo')
@injectable()
export class FooEventHandler implements IEventHandler {

    constructor( @inject('FooService') private fooService: FooService ) {}

    // replace InversifySocketIOClient to your implementation, any to your JSON interface or any type you want
    fire(client: InversifySocketIOClient, data: any) {
        client.emit('bar', {
            'data' => data
        });
    }
}
```

### Step 2: Configure container, client and server
Configure the inversify container in your composition root as usual.

Then, pass the container to the InversifySocketIOServer constructor. This will allow it to register all event handlers and their dependencies from your container and attach them to the express app.
Then just call server.bind() to prepare your app.

In order for the InversifySocketIOServer to find your event handlers, you must bind them to the `TYPE.EventHandler` service identifier.
The `IEventHandler` interface exported by inversify-socket.io-utils contains a method fire(client, data), so you need to implement in your event handlers.

You also need to implement InversifySocketIOClient and bind it to `TYPE.Client` service identifier in transient scope.

```ts
import { injectable } from 'inversify';
import { InversifySocketIOClient } from 'inversify-socket.io-utils';

@injectable()
export class SocketIOClient extends InversifySocketIOClient {
    constructor() {
        super();
    }

    protected onConnect() {
        console.log('connected');
    }

    protected onDisconnect(reason: string) {
        console.log(`disconnected: ${reason}`);
    }
}
```

In your main program:
```ts
import { Container } from 'inversify';
import { IEventHandler, InversifySocketIOServer, TYPE } from 'inversify-socket.io-utils';
import * as http from 'http';

// set up container
let container = new Container();

// note that you *must* bind your event handlers to EventHandler
container.bind<IEventHandler>(TYPE.EventHandler).to(FooEventHandler);

// and you *must* bind your client to Client in transient scope
container.bind<SocketIOClient>(TYPE.Client).to(SocketIOClient).inTransientScope();

container.bind<FooService>('FooService').to(FooService);

// create server
let server = new InversifySocketIOServer(container);

let http = http.createServer();
server.bind(http);
http.listen(8080);
```

## InversifySocketIOServer
A wrapper for a socket.io Application.

## InversifySocketIOClient
A abstract class that you need to implement and it will be created when the new socket.io connection is established.

## Use InversifySocketIOServer with express
Simply pass express app to `http.createServer()` method.

```ts
let app = express();
// Your express code

let http = http.createServer(app);
server.bind(http);
http.listen(8080);
```