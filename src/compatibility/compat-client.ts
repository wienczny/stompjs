import { Client } from '../client';
import type { StompHeaders } from '../stomp-headers';
import type { frameCallbackType, messageCallbackType } from '../types';
import { HeartbeatInfo } from './heartbeat-info';

/**
 * Available for backward compatibility, please shift to using {@link Client}.
 *
 * **Deprecated**
 *
 * Part of `@stomp/stompjs`.
 *
 * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
 */
export class CompatClient extends Client {
  /**
   * It is no op now. No longer needed. Large packets work out of the box.
   */
  public maxWebSocketFrameSize: number = 16 * 1024;

  /**
   * Available for backward compatibility, please shift to using {@link Client}
   * and [Client#webSocketFactory]{@link Client#webSocketFactory}.
   *
   * **Deprecated**
   *
   * @internal
   */
  constructor(webSocketFactory: () => any) {
    super();
    this.reconnect_delay = 0;
    this.webSocketFactory = webSocketFactory;
    // Default from previous version
    this.debug = (...message: any[]) => {
      console.log(...message);
    };
  }

  private _parseConnect(...args: any[]): any {
    let closeEventCallback;
    let connectCallback;
    let errorCallback;
    let headers: StompHeaders = {};
    if (args.length < 2) {
      throw new Error('Connect requires at least 2 arguments');
    }
    if (typeof args[1] === 'function') {
      [headers, connectCallback, errorCallback, closeEventCallback] = args;
    } else {
      switch (args.length) {
        case 6:
          [
            headers.login,
            headers.passcode,
            connectCallback,
            errorCallback,
            closeEventCallback,
            headers.host,
          ] = args;
          break;
        default:
          [
            headers.login,
            headers.passcode,
            connectCallback,
            errorCallback,
            closeEventCallback,
          ] = args;
      }
    }

    return [headers, connectCallback, errorCallback, closeEventCallback];
  }

  /**
   * Available for backward compatibility, please shift to using [Client#activate]{@link Client#activate}.
   *
   * **Deprecated**
   *
   * The `connect` method accepts different number of arguments and types. See the Overloads list. Use the
   * version with headers to pass your broker specific options.
   *
   * overloads:
   * - connect(headers, connectCallback)
   * - connect(headers, connectCallback, errorCallback)
   * - connect(login, passcode, connectCallback)
   * - connect(login, passcode, connectCallback, errorCallback)
   * - connect(login, passcode, connectCallback, errorCallback, closeEventCallback)
   * - connect(login, passcode, connectCallback, errorCallback, closeEventCallback, host)
   *
   * params:
   * - headers, see [Client#connectHeaders]{@link Client#connectHeaders}
   * - connectCallback, see [Client#onConnect]{@link Client#onConnect}
   * - errorCallback, see [Client#onStompError]{@link Client#onStompError}
   * - closeEventCallback, see [Client#onWebSocketClose]{@link Client#onWebSocketClose}
   * - login [String], see [Client#connectHeaders](../classes/Client.html#connectHeaders)
   * - passcode [String], [Client#connectHeaders](../classes/Client.html#connectHeaders)
   * - host [String], see [Client#connectHeaders](../classes/Client.html#connectHeaders)
   *
   * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
   */
  public connect(...args: any[]): void {
    const out = this._parseConnect(...args);

    if (out[0]) {
      this.connectHeaders = out[0];
    }
    if (out[1]) {
      this.onConnect = out[1];
    }
    if (out[2]) {
      this.onStompError = out[2];
    }
    if (out[3]) {
      this.onWebSocketClose = out[3];
    }

    super.activate();
  }

  /**
   * Available for backward compatibility, please shift to using [Client#deactivate]{@link Client#deactivate}.
   *
   * **Deprecated**
   *
   * See:
   * [Client#onDisconnect]{@link Client#onDisconnect}, and
   * [Client#disconnectHeaders]{@link Client#disconnectHeaders}
   *
   * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
   */
  public disconnect(
    disconnectCallback?: any,
    headers: StompHeaders = {}
  ): void {
    if (disconnectCallback) {
      this.onDisconnect = disconnectCallback;
    }
    this.disconnectHeaders = headers;

    super.deactivate();
  }

  /**
   * Available for backward compatibility, use [Client#publish]{@link Client#publish}.
   *
   * Send a message to a named destination. Refer to your STOMP broker documentation for types
   * and naming of destinations. The headers will, typically, be available to the subscriber.
   * However, there may be special purpose headers corresponding to your STOMP broker.
   *
   *  **Deprecated**, use [Client#publish]{@link Client#publish}
   *
   * Note: Body must be String. You will need to covert the payload to string in case it is not string (e.g. JSON)
   *
   * ```javascript
   *        client.send("/queue/test", {priority: 9}, "Hello, STOMP");
   *
   *        // If you want to send a message with a body, you must also pass the headers argument.
   *        client.send("/queue/test", {}, "Hello, STOMP");
   * ```
   *
   * To upgrade, please follow the [Upgrade Guide](../additional-documentation/upgrading.html)
   */
  public send(
    destination: string,
    headers: { [key: string]: any } = {},
    body = ''
  ): void {
    headers = Object.assign({}, headers);

    const skipContentLengthHeader = headers['content-length'] === false;
    if (skipContentLengthHeader) {
      delete headers['content-length'];
    }
    this.publish({
      destination,
      headers: headers as StompHeaders,
      body,
      skipContentLengthHeader,
    });
  }

  /**
   * Available for backward compatibility, renamed to [Client#reconnectDelay]{@link Client#reconnectDelay}.
   *
   * **Deprecated**
   */
  set reconnect_delay(value: number) {
    this.reconnectDelay = value;
  }

  /**
   * Available for backward compatibility, renamed to [Client#webSocket]{@link Client#webSocket}.
   *
   * **Deprecated**
   */
  get ws(): any {
    return this.webSocket;
  }

  /**
   * Available for backward compatibility, renamed to [Client#connectedVersion]{@link Client#connectedVersion}.
   *
   * **Deprecated**
   */
  get version() {
    return this.connectedVersion;
  }

  /**
   * Available for backward compatibility, renamed to [Client#onUnhandledMessage]{@link Client#onUnhandledMessage}.
   *
   * **Deprecated**
   */
  get onreceive(): messageCallbackType {
    return this.onUnhandledMessage;
  }

  /**
   * Available for backward compatibility, renamed to [Client#onUnhandledMessage]{@link Client#onUnhandledMessage}.
   *
   * **Deprecated**
   */
  set onreceive(value: messageCallbackType) {
    this.onUnhandledMessage = value;
  }

  /**
   * Available for backward compatibility, renamed to [Client#onUnhandledReceipt]{@link Client#onUnhandledReceipt}.
   * Prefer using [Client#watchForReceipt]{@link Client#watchForReceipt}.
   *
   * **Deprecated**
   */
  get onreceipt(): frameCallbackType {
    return this.onUnhandledReceipt;
  }

  /**
   * Available for backward compatibility, renamed to [Client#onUnhandledReceipt]{@link Client#onUnhandledReceipt}.
   *
   * **Deprecated**
   */
  set onreceipt(value: frameCallbackType) {
    this.onUnhandledReceipt = value;
  }

  private _heartbeatInfo: HeartbeatInfo = new HeartbeatInfo(this);

  /**
   * Available for backward compatibility, renamed to [Client#heartbeatIncoming]{@link Client#heartbeatIncoming}
   * [Client#heartbeatOutgoing]{@link Client#heartbeatOutgoing}.
   *
   * **Deprecated**
   */
  get heartbeat() {
    return this._heartbeatInfo;
  }

  /**
   * Available for backward compatibility, renamed to [Client#heartbeatIncoming]{@link Client#heartbeatIncoming}
   * [Client#heartbeatOutgoing]{@link Client#heartbeatOutgoing}.
   *
   * **Deprecated**
   */
  set heartbeat(value: { incoming: number; outgoing: number }) {
    this.heartbeatIncoming = value.incoming;
    this.heartbeatOutgoing = value.outgoing;
  }
}
