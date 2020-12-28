declare module 'sdk/src/functions/common' {
	export const regexHttp: RegExp;
	export const regexBase64: RegExp;
	export const regexNumber: RegExp;
	export const regexMobile: RegExp;
	export const regexChinese: RegExp;
	export const regexSplitPath: RegExp;
	export const noop: () => void;
	export const always: <T>(val: T) => T;
	export const alwaysTrue: () => boolean;
	export const alwaysFalse: () => boolean;
	export const assign: {
	    <T, U>(target: T, source: U): T & U;
	    <T, U, V>(target: T, source1: U, source2: V): T & U & V;
	    <T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
	    (target: object, ...sources: any[]): any;
	};
	export const keys: (o: {}) => string[];
	export const isArray: (arg: any) => arg is any[];
	export const isNaN: (number: number) => boolean;
	export const isNumber: (arg: any) => arg is number;
	export const isString: (arg: any) => arg is string;
	export const isBoolean: (arg: any) => arg is boolean;
	export const isArguments: (arg: any) => arg is any[];
	export const isMap: (arg: any) => arg is Map<any, any>;
	export const isError: (arg: any) => arg is Error;
	export const isSet: (arg: any) => arg is Set<any>;
	export const isRegExp: (arg: any) => arg is RegExp;
	export const isSymbol: (arg: any) => arg is symbol;
	export const isDate: (arg: any) => arg is Date;
	export const isFile: (arg: any) => arg is File;
	export const isBlob: (arg: any) => arg is Blob;
	export const isObject: (obj: any) => boolean;
	export const isHasOwn: (obj: any, prop: any) => boolean;
	export const isFunction: (fun: any) => fun is Function;
	export const isNull: (nul: any) => nul is null;
	export const isUndefined: (val: any) => val is undefined;
	export const isNullOrUndefined: (arg: unknown) => boolean;
	export const isDef: <T>(val: T | null | undefined) => val is T;
	export const isPlainObject: (val: any) => boolean;
	export const isAbsolute: (path: any) => boolean;
	export const isHttp: (path: any) => boolean;
	export const isPromise: <T>(obj: any) => obj is Promise<T>;
	export const isEmpty: typeof _isEmpty;
	export const isBase64: (str: any) => boolean;
	export const isNative: (Ctor: unknown) => boolean;
	export const isWindow: (obj: any) => boolean;
	export const isDocument: (obj: any) => boolean;
	export const isFormData: (val: any) => boolean;
	export const isNumeric: (val: any) => boolean;
	export const range: (num: number, min: number, max: number) => number;
	export const random: (min: number, max?: number | undefined) => number;
	export const uid: (prefix?: string) => string;
	export const uuid: typeof _uuid;
	export const randomstr: typeof _randomstr;
	export const camelize: (str: string) => string;
	export const dasherize: (str: string) => string;
	export const createURL: (base: string, query?: string | number | Record<any, any> | undefined) => string;
	export const trim: (str: any) => string;
	export const filterURL: typeof _filterURL;
	export const classnames: typeof _classNames;
	export const styles: typeof _styles;
	export const css: typeof _css;
	export const getLength: (obj: any) => number;
	export const equal: typeof _equal;
	export const remove: typeof _remove;
	export const inArray: (val: any, arr: any, fromIndex?: number | undefined) => boolean;
	export const uniqueArray: (arr: any[]) => any[];
	export const map: typeof _map;
	export const shuffle: typeof _shuffle;
	export const pick: typeof _pick;
	export const each: typeof _each;
	export const makeMark: (arr: string[]) => Record<string, boolean>;
	export const makeMap: (arr: string[]) => Record<string, string>;
	export const once: (func: Function) => (this: any, ...args: any[]) => any;
	export const before: typeof _before;
	export const after: typeof _after;
	export const throttle: typeof _throttle;
	export const debounce: typeof _debounce;
	export const memoize: typeof _memoize;
	export const spread: (callback: Function) => (arr: any[]) => any;
	export const wrapFn: (callback: any, context?: any) => any;
	export const nextTick: (callback?: any, ctx?: any) => Promise<{}> | undefined;
	export const stringify: (obj: any, sep?: string, eq?: string) => string;
	export const parse: typeof _parse;
	export const now: () => number;
	export const unixtime: (unixtime?: number, format?: string | undefined) => string;
	export const timestamp: (timestamp?: number, format?: string | undefined) => string;
	export const wait: <T>(duration: number, arg?: T | undefined) => Promise<T>;
	export const timeago: typeof _timeago;
	export const splitPath: (filename: string) => string[];
	export const resolvePath: typeof _resolvePath;
	export const dirname: typeof _dirname;
	export const basename: typeof _basename;
	export const extname: typeof _extname; function _isEmpty(val: any): boolean; function _map<T>(obj: T[], iteratee: (val: any, key: string | number, obj: T[]) => any): any[]; function _shuffle<T>(array: T[]): T[]; function _parse(qs: string, sep?: string, eq?: string): Record<string, any>; function _throttle(func: Function, wait: number): (this: any) => any; function _debounce<T extends Function>(func: T, wait?: number, immediate?: boolean): T; function _each(obj: any, iteratee: (val: any, key: any, _this: unknown) => any, context?: any): any; function _pick<T>(obj: T, map: string[] | Record<string, any>): T; function _memoize<T>(func: Function, hashFn?: (...arg: any[]) => string): T; function _uuid(): string; function _randomstr(len?: number): string; function _before(n: number, func: Function | any): (this: any, ...args: any[]) => any; function _after(n: number, func: Function): (this: any, ...args: any[]) => any; function _remove<T>(array: T[], predicate: (value: unknown, index: number, array: T[]) => boolean): T[]; function _timeago(unixTime: Date | number): string; function _resolvePath(...args: string[]): string; function _dirname(path: string): string; function _basename(path: string, ext?: string): string; function _extname(path: string): string; function _filterURL(url: string, filters: string[]): string; function _classNames(...args: any[]): string; function _styles(...args: any[]): string; function _css(prop: string, value: any): string; function _equal(a: any, b: any): boolean;
	export {};

}
declare module 'sdk/src/factory/Http' {
	export interface IHttpConfig {
	    baseURL?: string;
	    validateStatus: (code: number) => boolean;
	    transformRequest: (req: IHttpRequestOption) => IHttpRequestOption;
	    transformResponse: (rsp: Response) => any;
	    onHeadersReceived: (headers: Headers) => void;
	}
	export interface IHttpRequestOption {
	    url?: string;
	    query?: any;
	    body?: any;
	    param?: any;
	    data?: any;
	    headers?: HeadersInit;
	    method?: HttpMethod;
	    showLoading?: any;
	    showError?: any;
	    showSuccess?: any;
	    [key: string]: any;
	} type HttpRequestOption = string | IHttpRequestOption; type HttpNofifyCallback = (message: string, data: any) => any;
	export enum HttpMethod {
	    GET = "GET",
	    DELETE = "DELETE",
	    HEAD = "HEAD",
	    OPTIONS = "OPTIONS",
	    POST = "POST",
	    PUT = "PUT",
	    PATCH = "PATCH",
	    JSONP = "JSONP"
	}
	export class HttpError extends Error {
	    code: number;
	    data: any;
	    request?: Http;
	    response?: Response;
	    constructor(code: number, message: string, request?: Http, response?: Response);
	}
	export default class Http {
	    static HttpError: typeof HttpError;
	    static HttpHeaders: typeof Headers;
	    static HttpResponse: typeof Response;
	    static HttpRequest: typeof Request;
	    static ContentType: {
	        JSON: string;
	        FORMDATA: string;
	    };
	    static showLoading: HttpNofifyCallback;
	    static showError: HttpNofifyCallback;
	    static showSuccess: HttpNofifyCallback;
	    static Method: typeof HttpMethod;
	    static HttpOption: IHttpConfig;
	    static request(url: string, request: any): Promise<Response>;
	    static instance: Http;
	    httpconf: IHttpConfig;
	    constructor(_option?: IHttpConfig | any);
	    get(url: HttpRequestOption, query?: any): Promise<any>;
	    delete(url: HttpRequestOption, query?: any): Promise<any>;
	    head(url: HttpRequestOption, query?: any): Promise<any>;
	    options(url: HttpRequestOption, query?: any): Promise<any>;
	    post(url: HttpRequestOption, data?: any): Promise<any>;
	    put(url: HttpRequestOption, data?: any): Promise<any>;
	    patch(url: HttpRequestOption, data?: any): Promise<any>;
	    jsonp(url: HttpRequestOption, query?: any): Promise<any>;
	    action(url: HttpRequestOption, data?: any, method?: HttpMethod): Promise<any>;
	    request(req: IHttpRequestOption): Promise<any>;
	    private $messages;
	    setHttpMessage(key: string, message: string): void;
	}
	export {};

}
declare module 'sdk/src/factory/Config' {
	 type CommonQuery = string | number | Record<string, any>;
	export default class Config {
	    static isDev: boolean;
	    static CDN_ROOT: string;
	    static API_HTTP: string;
	    static API_AUTH: string;
	    static API_APP: string;
	    static API_SERVICE: string;
	    static api(service: string, query?: CommonQuery): string;
	    static service(service: string, query?: CommonQuery): string;
	    static cdn(filename: string): string;
	}
	export {};

}
declare module 'sdk/src/plugins/store' {
	export interface IStoreUseProxy {
	    get(key: string): any;
	    set(key: string, val: any): any;
	    keys(): string[];
	    remove(key: string): void;
	    clear(): void;
	} const _default_1: {
	    use(usestorage: IStoreUseProxy): {
	        use(usestorage: IStoreUseProxy): any;
	        get(key: string, _default?: any): any;
	        set(key: string, data: any): any;
	        keys(): string[];
	        remove(key: string): void;
	        clear(): void;
	        each(fn: (value: any, key: string) => void): void;
	    };
	    get(key: string, _default?: any): any;
	    set(key: string, data: any): any;
	    keys(): string[];
	    remove(key: string): void;
	    clear(): void;
	    each(fn: (value: any, key: string) => void): void;
	};
	export default _default_1;

}
declare module 'sdk/src/plugins/hotcache' {
	export default function hotcache(cacheKey: string, maxLength?: number): {
	    get: (key: string, _default?: any) => any;
	    set: (key: string, value: any) => any;
	    remove: (key: string) => void;
	};

}
declare module 'sdk/src/factory/AuthUser' {
	import Auth from 'sdk/src/factory/Auth'; const AuthSymbol: unique symbol;
	export default class AuthUser {
	    id: number;
	    platform: string;
	    appid: string;
	    nickname: string;
	    avatar: string;
	    openid: string;
	    state: string;
	    gender: number;
	    email: string;
	    username: string;
	    type: string;
	    location: string;
	    unionid: string;
	    private [AuthSymbol];
	    readonly $key: string;
	    readonly isLogin: boolean;
	    constructor(auth: Auth);
	    reset(user: any): void;
	    login(user: any): this;
	    logout(): this;
	}
	export {};

}
declare module 'sdk/src/plugins/safety' {
	export const btoa: any;
	export const atob: any;
	export const md5: (str: string, key?: string) => string;
	export function signature(object: Record<string, any>, action?: string): string;
	export function jwtDecode(token: string): any;

}
declare module 'sdk/src/factory/Auth' {
	import Http from 'sdk/src/factory/Http';
	import AuthUser from 'sdk/src/factory/AuthUser';
	export enum AuthType {
	    none = "none",
	    base = "base",
	    user = "user"
	}
	export enum AuthErrorCode {
	    OK = 0,
	    NO_CODE = 1,
	    LOGIN_FAILED = 2
	} type AuthOnRedirectLogin = (url: string, reason: AuthError) => void;
	export class AuthError extends Error {
	    code: number;
	    data: any;
	    constructor(code: number, message: string, data?: any);
	}
	export default class Auth extends Http {
	    static AuthUser: typeof AuthUser;
	    static AuthError: typeof AuthError;
	    static instance: Auth;
	    static transformAuthOptions: <T>(val: T) => T;
	    static transformAuthRequest(auth: Auth, config: any): any;
	    static onAuthHeadersReceived(auth: Auth, header: Headers): void;
	    user: AuthUser;
	    version: string;
	    state: string;
	    type: string;
	    httpconf: any;
	    platform: string;
	    appid: string;
	    scope: string;
	    env: string;
	    url: string;
	    onRedirectLogin: AuthOnRedirectLogin;
	    readonly $key: string;
	    readonly id: number;
	    readonly isLogin: boolean;
	    readonly token: string;
	    readonly isTokenValid: boolean;
	    constructor(options: any);
	    tasker: Promise<AuthUser>;
	    private $_loginResolve;
	    private $_loginReject;
	    login(): Promise<AuthUser>;
	    authorize(arg: any): Promise<AuthUser>;
	    saveToken(token: string): void;
	    logout(): void;
	    _requestLogin(): Promise<AuthUser>;
	    _redirectLogin(reason: AuthError): void;
	}
	export {};

}
declare module 'sdk/src/factory/Tasker' {
	 const HandleSymbol: unique symbol; const PromiseSymbol: unique symbol; type PromiseHandle = {
	    resolve: ITaskerResolve;
	    reject: ITaskerReject;
	}; type ITaskerResolve = <T>(value: T | PromiseLike<T>) => void; type ITaskerReject = (reason?: Error | any) => void;
	export default class Tasker {
	    [PromiseSymbol]: Promise<any>;
	    [HandleSymbol]: PromiseHandle;
	    isResolved: boolean;
	    constructor();
	    then(onfulfilled: ITaskerResolve, onrejected?: ITaskerReject): Promise<void>;
	    catch(onrejected: ITaskerReject): Promise<any>;
	    finally(onfinally: ITaskerReject): Promise<any>;
	    resolve(val: any): this;
	    reject(err?: Error): this;
	}
	export {};

}
declare module 'sdk/src/factory/App' {
	import Http from 'sdk/src/factory/Http';
	import Auth from 'sdk/src/factory/Auth';
	import Tasker from 'sdk/src/factory/Tasker';
	interface IAppOption {
	    appid: string;
	    analysisoff?: boolean;
	}
	export class AppResponseError extends Error {
	    code: number;
	    data: number;
	    app: App;
	    constructor(code: number, message: string, data: any, app: App);
	}
	export default class App extends Http {
	    static transformAppRequest(app: App, config: any): any;
	    static transformAppResponse(app: App, response: Response): Promise<any>;
	    static onAppHeadersReceived(app: App, headers: Headers): void;
	    static instance: App;
	    config: Record<string, any>;
	    setting: Record<string, any>;
	    appid: string;
	    analysisoff: boolean;
	    readonly auth: Auth;
	    tasker: Tasker;
	    constructor(option: IAppOption | string);
	    ready(): Promise<T>;
	}
	export {};

}
declare module 'sdk/src/functions/utils.mini' {
	export const appid: string;
	export const isDev: boolean;
	export const getAuthSetting: (scope: string) => Promise<any>;
	export function getSystemInfoSync(): any;
	export function requestAnimationFrame(cb: Function): any;
	export function getCurrentPage(): any;

}
declare module 'sdk/src/factory/Auth.mini' {
	import Auth from 'sdk/src/factory/Auth';
	export default Auth;

}
declare module 'sdk/src/factory/Emitter' {
	 type IEmitterEventHandler = (event?: any, a1?: any, a2?: any) => void;
	export const EmitterSymbol: unique symbol;
	export default class Emitter {
	    static instance: Emitter;
	    private [EmitterSymbol];
	    on(event: string, handler: IEmitterEventHandler): () => this;
	    addEventListener(event: string, handler: IEmitterEventHandler): () => this;
	    once(event: string, handler: IEmitterEventHandler): () => this;
	    off(event: string, handler: IEmitterEventHandler): this;
	    removeEventListener(event: string, handler: IEmitterEventHandler): this;
	    emit(event: string, a?: any, b?: any): this;
	}
	export {};

}
declare module 'sdk/src/venders/http.mini' {
	 class DOMException extends Error {
	    constructor(message: string, name: string);
	} class _Headers implements Headers {
	    map: {};
	    constructor(headers?: HeadersInit);
	    append(name: string, value: string): void;
	    delete(name: string): void;
	    get(name: string): any;
	    has(name: string): boolean;
	    set(name: string, value: string): void;
	    forEach(callback: any, thisArg?: this): void;
	} class _Body implements Body {
	    bodyUsed: boolean;
	    headers: Headers;
	    body: any;
	    _bodyInit: any;
	    _bodyText: any;
	    _bodyBlob: Blob;
	    _bodyFormData: FormData;
	    _bodyArrayBuffer: ArrayBuffer;
	    constructor();
	    protected _initBody(body?: any): void;
	    blob(): Promise<Blob>;
	    arrayBuffer(): Promise<ArrayBuffer>;
	    text(): Promise<any>;
	    formData(): Promise<FormData>;
	    json(): Promise<any>;
	} class _Request extends _Body implements Request {
	    readonly isHistoryNavigation: boolean;
	    readonly isReloadNavigation: boolean;
	    readonly keepalive: boolean;
	    readonly referrerPolicy: ReferrerPolicy;
	    readonly redirect: RequestRedirect;
	    readonly cache: RequestCache;
	    readonly credentials: RequestCredentials;
	    readonly destination: RequestDestination;
	    headers: Headers;
	    integrity: string;
	    url: string;
	    method: string;
	    mode: RequestMode;
	    signal: AbortSignal;
	    referrer: any;
	    timeout: any;
	    constructor(input: RequestInfo, options?: RequestInit);
	    clone(this: any): _Request;
	} class _Response extends _Body implements Response {
	    static error(): _Response;
	    static redirect(url: string, status: number): _Response;
	    readonly trailer: Promise<Headers>;
	    readonly redirected: boolean;
	    type: ResponseType;
	    status: number;
	    ok: boolean;
	    statusText: string;
	    url: string;
	    constructor(bodyInit: any, options?: any);
	    clone(this: any): _Response;
	}
	export { DOMException, _Headers as Headers, _Body as Body, _Request as Request, _Response as Response };

}
declare module 'sdk/src/factory/Http.mini' {
	import Http from 'sdk/src/factory/Http';
	export default Http;

}
declare module 'sdk/src/factory/Res' {
	import Tasker from 'sdk/src/factory/Tasker';
	import Emitter from 'sdk/src/factory/Emitter';
	export type IResItem = {
	    url: string;
	    key: string;
	    type: string;
	};
	export type IResLoader = (res: ResTask) => Promise<any> | any;
	export type IResOption = {
	    baseURL?: string;
	    autoStart?: boolean;
	}; enum ResTaskStatus {
	    ADDED = 0,
	    LOADING = 1,
	    LOADED = 2,
	    FAILED = 3
	} class ResTask extends Tasker {
	    static STATUS_ADDED: ResTaskStatus;
	    static STATUS_LOADING: ResTaskStatus;
	    static STATUS_LOADED: ResTaskStatus;
	    static STATUS_FAILED: ResTaskStatus;
	    status: number;
	    key: string;
	    url: string;
	    type: string;
	    options: any;
	    data: any;
	    error: Error;
	    constructor(config: IResItem, options: any);
	    remove(): boolean;
	    doExec(): any;
	    onLoaded(data: any): this;
	    onError(error: Error): this;
	} class ResProgress {
	    total: number;
	    current: number;
	    pending: number;
	    loaded: number;
	    failed: number;
	    readonly isComplete: boolean;
	    readonly percent: number;
	}
	export default class Res extends Emitter {
	    static ResTask: typeof ResTask;
	    static ResProgress: typeof ResProgress;
	    static instance: Res;
	    static loaders: Map<string, IResLoader>;
	    static extmaps: {};
	    static registerLoader(type: string, loader: IResLoader): typeof Res;
	    static getLoader(type: string): IResLoader | undefined;
	    private static $queue;
	    private static $concurrency;
	    private static $pending;
	    private static $cache;
	    static remove(res: ResTask): boolean;
	    static get(keyOrTask: string | ResTask, _default?: any): any;
	    private static _watchQueue;
	    isWorked: boolean;
	    baseURL: string;
	    progress: ResProgress;
	    protected $queue: ResTask[];
	    protected $task: Tasker;
	    constructor(options?: IResOption);
	    start(): Tasker;
	    add(item: string | string[] | IResItem | IResItem[], option?: any): ResTask | Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
	    remove(res: ResTask): boolean;
	    get(keyOrTask: string | ResTask, _default?: any): any;
	    private _addTask;
	    private _putResQueue;
	    private _watchTask;
	    private _nofify;
	}
	export {};

}
declare module 'sdk/src/factory/AbortController.mini' {
	import BaseEmitter from 'sdk/src/factory/Emitter'; class AbortSignal extends BaseEmitter {
	    aborted: boolean;
	    onabort: any;
	    dispatchEvent(event: any): boolean | undefined;
	    toString(): string;
	}
	export default class AbortController {
	    signal: AbortSignal;
	    abort(): void;
	    toString(): string;
	}
	export {};

}
declare module 'sdk/src/plugins/store.mini' {
	import { IStoreUseProxy } from 'sdk/src/plugins/store'; const _default: {
	    use(usestorage: IStoreUseProxy): any;
	    get(key: string, _default?: any): any;
	    set(key: string, data: any): any;
	    keys(): string[];
	    remove(key: string): void;
	    clear(): void;
	    each(fn: (value: any, key: string) => void): void;
	};
	export default _default;

}
declare module 'sdk/src/plugins/cdn' {
	export function res(filename: string, process?: string): string;
	export function lib(libname: string): string;
	export function info(filename: string): Promise<any>;
	export function hue(filename: string): Promise<any>;
	export function snapshot(filename: string, w?: number, h?: number, format?: string): string;
	export function imm(filename: string, service: string): Promise<any>;
	export function style(filename: string, style: string): string;

}
declare module 'sdk/src/plugins/cloud' {
	export function service(serviceName: string, opt: any, method?: 'get' | 'post'): Promise<any>;
	export function upbase64(base64: string): Promise<CloudResponse>;
	export function syncurl(url: string): Promise<CloudResponse>;
	export function tempurl(url: string): Promise<CloudResponse>;
	export function hastemp(key: string): Promise<CloudResponse>;
	export function syncimage(url: string): Promise<CloudResponse>;
	export function headfile(key: string): Promise<CloudResponse>;
	export function proxy(option: ProxyOption): Promise<any>;
	export function amr2mp3(input: string, kbs?: number): Promise<CloudResponse>;
	export type CloudResponse = {
	    name: string;
	    url: string;
	    status: number;
	    statusMessage: string;
	    mime?: string;
	};
	interface ProxyOption extends Request {
	    url: string;
	    type: string;
	}
	export {};

}
declare module 'sdk/src/plugins/tool' {
	export function qrcode(text: string, size?: number): string;

}
declare module 'sdk/src/entry.mini' {
	export const version = "__VERSION__";
	import App from 'sdk/src/factory/App';
	import AuthUser from 'sdk/src/factory/AuthUser';
	import Auth from 'sdk/src/factory/Auth.mini';
	import Config from 'sdk/src/factory/Config';
	import Emitter from 'sdk/src/factory/Emitter';
	import Http from 'sdk/src/factory/Http.mini';
	import Res from 'sdk/src/factory/Res';
	import Tasker from 'sdk/src/factory/Tasker';
	import AbortController from 'sdk/src/factory/AbortController.mini';
	export { App, Auth, AuthUser, Config, Emitter, Http, Res, Tasker, AbortController };
	export { DOMException, Headers, Request, Response } from 'sdk/src/venders/http.mini';
	export * from 'sdk/src/functions/common';
	export * from 'sdk/src/functions/utils.mini';
	import hotcache from 'sdk/src/plugins/hotcache';
	import store from 'sdk/src/plugins/store.mini';
	import * as cdn from 'sdk/src/plugins/cdn';
	import * as cloud from 'sdk/src/plugins/cloud';
	import * as safefy from 'sdk/src/plugins/safety';
	import * as tool from 'sdk/src/plugins/tool';
	export { cdn, store, cloud, hotcache, safefy, tool };

}
declare module 'sdk/src/assets/star-loading' {
	export const SvgWindmill = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64px\" height=\"64px\" viewBox=\"0 0 128 128\" x=\"64\" y=\"0\"><path d=\"M64 0L40.08 21.9a10.98 10.98 0 0 0-5.05 8.75C34.37 44.85 64 60.63 64 60.63V0z\" fill=\"#ffb118\"/><path d=\"M128 64l-21.88-23.9a10.97 10.97 0 0 0-8.75-5.05C83.17 34.4 67.4 64 67.4 64H128z\" fill=\"#80c141\"/><path d=\"M63.7 69.73a110.97 110.97 0 0 1-5.04-20.54c-1.16-8.7.68-14.17.68-14.17h38.03s-4.3-.86-14.47 10.1c-3.06 3.3-19.2 24.58-19.2 24.58z\" fill=\"#cadc28\"/><path d=\"M64 128l23.9-21.88a10.97 10.97 0 0 0 5.05-8.75C93.6 83.17 64 67.4 64 67.4V128z\" fill=\"#cf171f\"/><path d=\"M58.27 63.7a110.97 110.97 0 0 1 20.54-5.04c8.7-1.16 14.17.68 14.17.68v38.03s.86-4.3-10.1-14.47c-3.3-3.06-24.58-19.2-24.58-19.2z\" fill=\"#ec1b21\"/><path d=\"M0 64l21.88 23.9a10.97 10.97 0 0 0 8.75 5.05C44.83 93.6 60.6 64 60.6 64H0z\" fill=\"#018ed5\"/><path d=\"M64.3 58.27a110.97 110.97 0 0 1 5.04 20.54c1.16 8.7-.68 14.17-.68 14.17H30.63s4.3.86 14.47-10.1c3.06-3.3 19.2-24.58 19.2-24.58z\" fill=\"#00bbf2\"/><path d=\"M69.73 64.34a111.02 111.02 0 0 1-20.55 5.05c-8.7 1.14-14.15-.7-14.15-.7V30.65s-.86 4.3 10.1 14.5c3.3 3.05 24.6 19.2 24.6 19.2z\" fill=\"#f8f400\"/><circle cx=\"64\" cy=\"64\" r=\"2.03\"/></svg>";
	export const SvgColorRing = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64px\" height=\"64px\" viewBox=\"0 0 128 128\" x=\"0\" y=\"0\"><path d=\"M.6 57.54c5.73-6.23 17.33-15.5 33.66-12.35C55.4 48.5 64 63.95 64 63.95S42.42 65 30.28 83.63a38.63 38.63 0 0 0-3.4 32.15 64.47 64.47 0 0 1-5.52-4.44A63.64 63.64 0 0 1 .6 57.54z\" fill=\"#ffcb02\"/><path d=\"M65.32 29.05c7.65 19.98-1.44 35.18-1.44 35.18S52.2 46.05 30.03 44.85A38.6 38.6 0 0 0 .56 57.93 63.8 63.8 0 0 1 37.56 6c8.2 1.8 22.26 7.16 27.76 23.05z\" fill=\"#ff9e02\"/><path d=\"M94.92 47.7c-13.48 16.63-31.2 16.36-31.2 16.36s9.92-19.2-.13-39a38.6 38.6 0 0 0-26.18-19 63.78 63.78 0 0 1 63.52 6.03c2.56 8 4.98 22.85-6.05 35.6z\" fill=\"#ff4b42\"/><path d=\"M93.52 82.53C72.38 79.17 63.75 63.7 63.75 63.7s21.6-1.02 33.7-19.63a38.6 38.6 0 0 0 3.43-32.04 64.33 64.33 0 0 1 5.74 4.6 63.63 63.63 0 0 1 20.82 53.26c-5.62 6.2-17.34 15.8-33.94 12.6z\" fill=\"#c063d6\"/><path d=\"M62.5 99c-7.65-19.98 1.44-35.17 1.44-35.17S75.56 81.6 97.74 82.8a39.1 39.1 0 0 0 29.73-13.03 63.8 63.8 0 0 1-37.16 52.3c-8.2-1.8-22.25-7.15-27.8-23.06z\" fill=\"#17a4f6\"/><path d=\"M26.64 115.63C24 107.6 21.6 93.06 32.5 80.5c13.48-16.62 31.58-16.55 31.58-16.55s-9.6 19.06.44 38.86a38.82 38.82 0 0 0 26.05 19.17 63.78 63.78 0 0 1-63.93-6.3z\" fill=\"#4fca24\"/></svg>";

}
declare module 'sdk/src/plugins/analysis' {
	export interface IAnalysisProxy {
	    installed?: boolean;
	    install: (base: typeof baseAnalysis) => any;
	    ready: () => Promise<any>;
	    minVistedTime: number;
	    minStayTime: number;
	    maxReportError: number;
	    readonly requestId: string;
	    readonly requestTime: number;
	    readonly pageurl: string;
	    readonly userid: number;
	    readonly useragent: string;
	    unloadData: any;
	    spm: {
	        from: string;
	        uid: number;
	    };
	    sendRequest: (url: string) => void;
	    getErrorStack: (err: Error | string) => string;
	} const baseAnalysis: {
	    use: typeof use;
	    send: typeof send;
	    pv: typeof pv;
	    share: typeof share;
	    user: typeof user;
	    click: typeof click;
	    unload: typeof unload;
	    error: typeof error;
	};
	export default baseAnalysis; function use(proxy: IAnalysisProxy): {
	    use: typeof use;
	    send: typeof send;
	    pv: typeof pv;
	    share: typeof share;
	    user: typeof user;
	    click: typeof click;
	    unload: typeof unload;
	    error: typeof error;
	}; function send(event: string, data?: any, value?: number): void | null; function pv(): Promise<void | null>; function user(data?: any, value?: number): void | null; function share(platform?: any, logid?: number): void | null; function click(data?: any, value?: number): void | null; function unload(): void | null; function error(error: Error | string): false | void | null;

}
declare module 'sdk' {
	import main = require('sdk/src/entry.mini');
	export = main;
}
