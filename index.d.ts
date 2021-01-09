/// <reference types="zepto" />
declare module 'h5-sdk/src/functions/common' {
	 let EnvGlobal: any;
	export { EnvGlobal as global };
	export const platform = "__PLANTFORM__";
	export const version = "__VERSION__";
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
	export const object: () => any;
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
	export const splice: typeof _splice;
	export const inArray: (val: any, arr: any[], fromIndex?: number | undefined) => boolean;
	export const uniqueArray: (arr: any[]) => any[];
	export const map: typeof _map;
	export const shuffle: typeof _shuffle;
	export const pick: typeof _pick;
	export const each: typeof _each;
	export const makeMark: <T extends string | number | symbol>(arr: T[]) => Record<T, true>;
	export const makeMap: <T extends string | number | symbol>(arr: T[], fn?: ((key: T, arr: T[]) => any) | undefined) => Record<T, any>;
	export const once: (func: Function) => (this: any, ...args: any[]) => any;
	export const before: typeof _before;
	export const after: typeof _after;
	export const throttle: typeof _throttle;
	export const debounce: typeof _debounce;
	export const memoize: typeof _memoize;
	export const spread: <T extends Function>(callback: T) => (arr: any[]) => any;
	export const wrapFn: <T extends Function>(callback: T, context?: any) => T;
	export const nextTick: {
	    (callback: any): void;
	    (): Promise<void>;
	};
	export const stringify: (obj: any, sep?: string, eq?: string) => string;
	export const parse: typeof _parse;
	export const now: () => number;
	export const timestamp: () => number;
	export const unixtime: (unixtime?: number, format?: string | undefined) => string;
	export const wait: <T>(duration: number, arg?: T | undefined) => Promise<T>;
	export const timeago: typeof _timeago;
	export const unixFormat: (unixtime?: number, format?: string | undefined) => string;
	export const splitPath: (filename: string) => string[];
	export const resolvePath: typeof _resolvePath;
	export const dirname: typeof _dirname;
	export const basename: typeof _basename;
	export const extname: typeof _extname; function _isEmpty(val: any): boolean; function _map<T>(obj: T[], iteratee: (val: any, key: string | number, obj: T[]) => any): any[]; function _shuffle<T>(array: T[]): T[]; function _parse(qs: string, sep?: string, eq?: string): Record<string, any>; function _throttle<T extends Function>(func: T, wait: number): T; function _debounce<T extends Function>(func: T, wait?: number, immediate?: boolean): T; function _each(obj: any, iteratee: (val: any, key: any, _this: unknown) => any, context?: any): any; function _pick<T>(obj: T, map: string[] | Record<string, any>): T; function _memoize<T extends Function>(func: T, hashFn?: (...arg: any[]) => string): T; function _uuid(): string; function _randomstr(len?: number): string; function _before(n: number, func: Function | any): (this: any, ...args: any[]) => any; function _after(n: number, func: Function): (this: any, ...args: any[]) => any; function _remove<T>(array: T[], predicate: (value: unknown, index: number, array: T[]) => boolean): T[]; function _splice<T>(array: T[], item: T): false | T; function _timeago(unixTime: Date | number): string; function _resolvePath(...args: string[]): string; function _dirname(path: string): string; function _basename(path: string, ext?: string): string; function _extname(path: string): string; function _filterURL(url: string, filters: string[]): string; function _classNames(...args: any[]): string; function _styles(...args: any[]): string; function _css(prop: string, value: any): string; function _equal(a: any, b: any): boolean;

}
declare module 'h5-sdk/src/plugins/store' {
	export interface IStoreUseProxy {
	    get(key: string): any;
	    set(key: string, val: any): void;
	    keys(): string[];
	    remove(key: string): void;
	    clear(): void;
	} const _default_1: {
	    use(usestorage: IStoreUseProxy): {
	        use(usestorage: IStoreUseProxy): any;
	        get(key: string, _default?: any): any;
	        set(key: string, data: any): void;
	        keys(): string[];
	        remove(key: string): void;
	        clear(): void;
	        each(fn: (value: any, key: string) => void): void;
	    };
	    get(key: string, _default?: any): any;
	    set(key: string, data: any): void;
	    keys(): string[];
	    remove(key: string): void;
	    clear(): void;
	    each(fn: (value: any, key: string) => void): void;
	};
	export default _default_1;

}
declare module 'h5-sdk/src/plugins/hotcache' {
	export default function hotcache(cacheKey: string, maxLength?: number): {
	    get: (key: string, _default?: any) => any;
	    set: (key: string, value: any) => any;
	    remove: (key: string) => void;
	    clearAll: () => void;
	};

}
declare module 'h5-sdk/src/factory/AuthUser' {
	import Auth from 'h5-sdk/src/factory/Auth'; const AuthSymbol: unique symbol;
	export default class AuthUser {
	    static REFRESH_TIME: number;
	    private $logintime;
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
	    readonly data: any;
	    readonly $key: string;
	    readonly isLogin: boolean;
	    readonly needRefreshed: boolean;
	    constructor(auth: Auth);
	    reset(user: any): void;
	    login(user: any): this;
	    logout(): void;
	}
	export {};

}
declare module 'h5-sdk/src/factory/Config' {
	 type CommonQuery = string | number | Record<string, any>;
	export default class Config {
	    static isDev: boolean;
	    static CDN_ROOT: string;
	    static API_HTTP: string;
	    static API_AUTH: string;
	    static API_APP: string;
	    static API_SERVICE: string;
	    static set(key: string | Record<string, any>, val?: any): void;
	    static api(service: string, query?: CommonQuery): string;
	    static service(service: string, query?: CommonQuery): string;
	    static cdn(filename: string, process?: string): string;
	}
	export {};

}
declare module 'h5-sdk/src/plugins/safety' {
	export const btoa: any;
	export const atob: any;
	export const md5: (str: string, key?: string) => string;
	export function signature(object: Record<string, any>, action?: string): string;
	export function jwtDecode(token: string): any;

}
declare module 'h5-sdk/src/factory/Auth' {
	import Http from 'h5-sdk/src/factory/Http';
	import AuthUser from 'h5-sdk/src/factory/AuthUser';
	export const enum AuthType {
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
	    protected $tryUseAuth: boolean;
	    readonly $key: string;
	    readonly id: number;
	    readonly isLogin: boolean;
	    readonly token: string;
	    readonly jwt: any;
	    readonly isTokenValid: boolean;
	    constructor(options: any);
	    tasker: Promise<AuthUser>;
	    private $_loginResolve;
	    private $_loginReject;
	    login(): Promise<AuthUser>;
	    authorize(arg: any): Promise<AuthUser>;
	    refresh(): Promise<AuthUser>;
	    saveToken(token: string): void;
	    logout(): void;
	    _requestLogin(): Promise<AuthUser>;
	    _redirectLogin(reason: AuthError): void;
	    transformAuthOptions: <T>(val: T) => T;
	    transformAuthRequest(config: any): any;
	    onAuthHeadersReceived(header: Headers): void;
	    transformAuthResponse(response: any): AuthUser;
	}
	export {};

}
declare module 'h5-sdk/src/factory/Http' {
	import Auth from 'h5-sdk/src/factory/Auth'; const HttpMessage: unique symbol; const HttpCache: unique symbol; type HttpRequestOption = string | IHttpRequestOption; type HttpNofifyCallback = (message: string, data: any) => any;
	export enum HttpMethod {
	    GET = "GET",
	    DELETE = "DELETE",
	    HEAD = "HEAD",
	    OPTIONS = "OPTIONS",
	    POST = "POST",
	    PUT = "PUT",
	    PATCH = "PATCH",
	    JSONP = "JSONP"
	} type SendRequest = (url: HttpRequestOption, query?: any) => Promise<any>;
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
	        FORM: string;
	    };
	    static showLoading: HttpNofifyCallback;
	    static showError: HttpNofifyCallback;
	    static showSuccess: HttpNofifyCallback;
	    static Method: typeof HttpMethod;
	    static HttpOption: IHttpConfig;
	    static request(url: string, request: any): Promise<Response>;
	    static instance: Http;
	    httpconfig: IHttpConfig;
	    [HttpCache]: Map<string, IHttpCache>;
	    [HttpMessage]: {
	        success: string;
	        error: string;
	        loading: string;
	    };
	    auth: Auth;
	    protected $tryUseAuth: boolean;
	    constructor(_option?: IHttpConfig);
	    withAuth(auth: Auth): this;
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
	    setHttpMessage(key: string, message: string): void;
	    static get: SendRequest;
	    static delete: SendRequest;
	    static head: SendRequest;
	    static options: SendRequest;
	    static post: SendRequest;
	    static put: SendRequest;
	    static patch: SendRequest;
	    static jsonp: SendRequest;
	    static action: SendRequest;
	}
	interface IHttpCache {
	    expiretime: number;
	    data: any;
	}
	export interface IHttpConfig {
	    auth?: Auth;
	    baseURL?: string;
	    validateStatus?: (code: number) => boolean;
	    transformRequest?: (req: IHttpRequestOption) => IHttpRequestOption;
	    transformResponse?: (rsp: Response, req: IHttpRequestOption) => any;
	    onHeadersReceived?: (headers: Headers) => void;
	}
	export interface IHttpRequestOption {
	    cache?: boolean | number | ((fetchURL: string) => string);
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
	}
	export {};

}
declare module 'h5-sdk/src/plugins/tasker' {
	export interface ITaskerPromise<T> extends Promise<T> {
	    resolve(val: T): Promise<T>;
	    reject(err?: Error): Promise<T>;
	}
	export default function tasker<T>(): ITaskerPromise<T>;

}
declare module 'h5-sdk/src/factory/App' {
	import Http from 'h5-sdk/src/factory/Http';
	import Auth from 'h5-sdk/src/factory/Auth';
	import { ITaskerPromise } from 'h5-sdk/src/plugins/tasker';
	interface IAppOption {
	    baseURL?: string;
	    appid?: string;
	    analysisoff?: boolean;
	    readyapi?: string;
	    auth?: Auth;
	}
	export class AppError extends Error {
	    code: number;
	    data: number;
	    app: App;
	    constructor(code: number, message: string, data: any, app: App);
	}
	export default class App extends Http {
	    static AppError: typeof AppError;
	    transformAppRequest(config: any): any;
	    transformAppResponse(response: Response): Promise<any>;
	    static instance: App;
	    config: Record<string, any>;
	    setting: Record<string, any>;
	    readonly appid: string;
	    readyapi: string;
	    analysisoff: boolean;
	    tasker: ITaskerPromise<App>;
	    constructor(opts: IAppOption | string);
	    ready(fn: any): Promise<App>;
	}
	export {};

}
declare module 'h5-sdk/src/factory/Emitter' {
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
declare module 'h5-sdk/src/factory/Res' {
	import Emitter from 'h5-sdk/src/factory/Emitter';
	export type IResItem = {
	    url: string;
	    key: string;
	    type: string;
	    filename: string;
	};
	export type IResLoader = (res: ResTask<any>) => Promise<any> | any;
	export type IResOption = {
	    baseURL?: string;
	    autoStart?: boolean;
	}; const enum ResTaskStatus {
	    ADDED = 0,
	    LOADING = 1,
	    LOADED = 2,
	    FAILED = 3
	}
	export class ResTask<T> {
	    static STATUS_ADDED: ResTaskStatus;
	    static STATUS_LOADING: ResTaskStatus;
	    static STATUS_LOADED: ResTaskStatus;
	    static STATUS_FAILED: ResTaskStatus;
	    tasker: import("../plugins/tasker").ITaskerPromise<ResTask<T>>;
	    status: number;
	    key: string;
	    url: string;
	    filename: string;
	    type: string;
	    options: any;
	    data: T;
	    error: Error;
	    task: any;
	    constructor(config: IResItem, options: any);
	    remove(): any;
	    doExec(): any;
	} class ResProgress {
	    total: number;
	    current: number;
	    pending: number;
	    loaded: number;
	    failed: number;
	    readonly isComplete: boolean;
	    readonly percent: number;
	}
	export interface IResLoaderHook<T> {
	    (item: string[] | IResItem[], option?: any): Promise<ResTask<T>[]>;
	    (item: string | IResItem, option?: any): Promise<ResTask<T>>;
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
	    static remove(res: ResTask<any>): boolean;
	    static get(keyOrTask: string | ResTask<any>, _default?: any): any;
	    static add(item: any, option?: any): ResTask<{}>;
	    private static _watchExecTask;
	    isWorked: boolean;
	    baseURL: string;
	    progress: ResProgress;
	    protected $queue: ResTask<any>[];
	    protected $task: import("../plugins/tasker").ITaskerPromise<Res>;
	    constructor(options?: IResOption);
	    start(): import("../plugins/tasker").ITaskerPromise<Res>;
	    add<T>(item: string | IResItem, option?: any): ResTask<T>;
	    add<T>(item: string[] | IResItem[], option?: any): ResTask<T>[];
	    remove(res: ResTask<any>): boolean;
	    get(keyOrTask: string | ResTask<any>, _default?: any): any;
	    private _addTask;
	    private _execTask;
	    private _nofify;
	    arrayBuffer: IResLoaderHook<ArrayBuffer>;
	    static arrayBuffer: IResLoaderHook<ArrayBuffer>;
	    blob: IResLoaderHook<Blob>;
	    static blob: IResLoaderHook<Blob>;
	    headers: IResLoaderHook<Headers>;
	    static headers: IResLoaderHook<Headers>;
	    json: IResLoaderHook<any>;
	    static json: IResLoaderHook<any>;
	    text: IResLoaderHook<string>;
	    static text: IResLoaderHook<string>;
	    formData: IResLoaderHook<FormData>;
	    static formData: IResLoaderHook<FormData>;
	    jsonp: IResLoaderHook<any>;
	    static jsonp: IResLoaderHook<any>;
	    css: IResLoaderHook<HTMLStyleElement>;
	    static css: IResLoaderHook<HTMLStyleElement>;
	    js: IResLoaderHook<HTMLScriptElement>;
	    static js: IResLoaderHook<HTMLScriptElement>;
	    img: IResLoaderHook<HTMLImageElement>;
	    static img: IResLoaderHook<HTMLImageElement>;
	    crossimg: IResLoaderHook<HTMLImageElement>;
	    static crossimg: IResLoaderHook<HTMLImageElement>;
	    audio: IResLoaderHook<HTMLAudioElement>;
	    static audio: IResLoaderHook<HTMLAudioElement>;
	    video: IResLoaderHook<HTMLVideoElement>;
	    static video: IResLoaderHook<HTMLVideoElement>;
	    download: IResLoaderHook<any>;
	    static download: IResLoaderHook<any>;
	}
	export {};

}
declare module 'h5-sdk/src/venders/AbortController' {
	import BaseEmitter from 'h5-sdk/src/factory/Emitter';
	export class AbortSignal extends BaseEmitter {
	    aborted: boolean;
	    onabort: any;
	    dispatchEvent(event: any): boolean | undefined;
	    toString(): string;
	}
	export class AbortController {
	    signal: AbortSignal;
	    abort(): void;
	    toString(): string;
	}

}
declare module 'h5-sdk/src/plugins/analysis' {
	 type IAnalysisConfig = {
	    enabled: boolean;
	    requestId: string;
	    requestTime: number;
	    minVistedTime: number;
	    minStayTime: number;
	    maxReportError: number;
	    unloadData: any;
	    userId: number;
	    getURL(): void | string;
	    getSpm(): {
	        from: string;
	        uid: number;
	    };
	    getAgent(): void | string;
	    sendRequest: (url: string) => void;
	    getErrorStack: (err: Error | string) => string;
	}; const baseAnalysis: {
	    config: IAnalysisConfig;
	    send: typeof send;
	    pv: typeof pv;
	    share: typeof share;
	    user: typeof user;
	    click: typeof click;
	    unload: typeof unload;
	    error: typeof error;
	};
	export default baseAnalysis; function send(event: string, data?: any, value?: number): void | null; function pv(): Promise<void | null>; function user(data?: any, value?: number): void | null; function share(platform?: any, logid?: number): void | null; function click(data?: any, value?: number): void | null; function unload(): void | null; function error(error: Error | string): false | void | null;

}
declare module 'h5-sdk/src/plugins/cdn' {
	export function res(filename: string, process?: string): string;
	export function lib(libname: string): string;
	export function info(filename: string): Promise<any>;
	export function hue(filename: string): Promise<any>;
	export function snapshot(filename: string, w?: number, h?: number, format?: string): string;
	export function imm(filename: string, service: string): Promise<any>;
	export const styles: Record<string, any>;
	export function style(filename: string, style: string): string;

}
declare module 'h5-sdk/src/plugins/cloud' {
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
declare module 'h5-sdk/src/plugins/tool' {
	export function qrcode(text: string, size?: number): string;

}
declare module 'h5-sdk/src/functions/utils.web' {
	 const navigator: Navigator, document: Document;
	export { document, navigator };
	export const userAgent: string;
	export const isMobile: boolean;
	export const isIos: boolean;
	export const isAndroid: boolean;
	export const isMiniapp: boolean;
	export const isWechat: boolean;
	export const isDingTalk: boolean;
	export const animationPrefix: string;
	export const transitionEnd: string;
	export const animationEnd: string;
	export const animationEnabled: boolean;
	export function addListener(element: any, event: string, callback: EventListener): Function;
	export function onAnimationEnd(element: HTMLElement, callback: EventListener): void | Function;
	export function onTransitionEnd(element: HTMLElement, callback: EventListener): void | Function;
	export const domready: Promise<boolean>;
	export const webp: (this: any, ...args: any[]) => any;
	export const jsonp: typeof _jsonp;
	export const getDomAttrs: typeof _getDomAttrs;
	interface IJsonpOption {
	    callback?: string;
	    timeout?: number;
	} function _jsonp(url: string, options?: IJsonpOption | any): Promise<{}>; function _getDomAttrs(element: string | Element, attrs: string[]): Record<string, any>;

}
declare module 'h5-sdk/src/venders/index.web' {
	/// <reference types="zepto" />
	import 'h5-sdk/whatwg-fetch';
	export const $: ZeptoStatic;
	export const Zepto: ZeptoStatic;

}
declare module 'h5-sdk/src/plugins/location.web' {
	 const _default: {
	    PrivacyFileds: string[];
	    readonly querystring: any;
	    readonly query: Record<string, any>;
	    readonly rootpath: string;
	    readonly url: string;
	    readonly safeurl: string;
	    getRootFile(filename: string): string;
	};
	export default _default;

}
declare module 'h5-sdk/src/factory/Auth.web' {
	import Auth from 'h5-sdk/src/factory/Auth';
	export default Auth;

}
declare module 'h5-sdk/src/factory/Config.web' {
	import Config from 'h5-sdk/src/factory/Config';
	export default Config;

}
declare module 'h5-sdk/src/factory/UiBase.web' {
	/// <reference types="zepto" />
	import Emitter from 'h5-sdk/src/factory/Emitter';
	export type TypeColor = 'dark' | 'main' | 'primary' | 'warn' | 'info';
	export type UiTheme = 'android' | 'ios' | 'half';
	export type UiBaseOption = {
	    id?: string;
	    theme?: UiTheme;
	    isAddMask?: boolean;
	    isForm?: boolean;
	    className?: string;
	    duration?: boolean | number;
	    target?: string | HTMLElement;
	    onClose?: Function;
	    [key: string]: any;
	};
	export type UiBaseEvent = 'open' | 'opened' | 'close' | 'closed';
	export type UiButtonOption = {
	    key?: string;
	    label: string;
	    href?: string;
	    onClick?: Function;
	    bold?: boolean;
	    color?: TypeColor;
	    className?: string;
	};
	export type UiInputType = 'hidden' | 'text' | 'tel' | 'password' | 'textarea' | 'number' | 'custom';
	export type UiInputOption = {
	    name: string;
	    type?: UiInputType;
	    label?: string;
	    tips?: string;
	    placeholder?: string;
	    value?: string;
	    disabled?: boolean;
	    innerHTML?: string;
	    validate?: (value: string) => any;
	    [key: string]: any;
	};
	export default class UiBase extends Emitter {
	    static nextZIndex: number;
	    static readonly zIndex: number;
	    static openInstances: UiBase[];
	    static closeAll(): void;
	    static option: any;
	    emitter: any;
	    option: UiBaseOption;
	    $target?: ZeptoCollection;
	    $root: ZeptoCollection;
	    $mask: ZeptoCollection;
	    inClassName: string;
	    outClassName: string;
	    id: string;
	    isOpened: boolean;
	    private _closeTid?;
	    constructor(option?: UiBaseOption);
	    private _releaseCloseTid;
	    open(): this;
	    private _onOpen;
	    private _onOpened;
	    private $_autoScrollTopId;
	    private _onFormBlur;
	    private _onFormFocus;
	    validateForm(field?: string): boolean;
	    validateClear(field?: string): boolean;
	    close(): void;
	    private _onClose;
	    private _onClosed;
	    wait(duration: number): Promise<UiBase>;
	}
	export function classPrefix(className: string | any[]): string;
	export function createClsElement(className: string, content?: string | ZeptoCollection, tagName?: string): ZeptoCollection;
	export function onceAnimationEnd($element: ZeptoCollection, callback: any): any;
	export function createSdkIcon(name: string): string;

}
declare module 'h5-sdk/src/factory/UiModal.web' {
	/// <reference types="zepto" />
	import 'h5-sdk/src/assets/ui-modal.less';
	import UiBase, { UiBaseOption, UiButtonOption, UiInputOption } from 'h5-sdk/src/factory/UiBase.web';
	export interface UiModalOption extends UiBaseOption {
	    title?: string;
	    header?: string;
	    content?: string;
	    footer?: string;
	    buttons?: UiButtonOption[];
	    inputs?: UiInputOption[];
	    showClose?: boolean;
	    maskClose?: boolean;
	    transparent?: boolean;
	    target?: string | HTMLElement;
	    onClick?: (key?: string) => void;
	    onClose?: Function;
	    validate?: (key: string, value: string, data: object) => any;
	}
	export default class UiModal extends UiBase {
	    static option: UiModalOption;
	    $modal: ZeptoCollection;
	    $form?: ZeptoCollection;
	    $buttons?: ZeptoCollection;
	    $spinning?: ZeptoCollection;
	    readonly data: {
	        [key: string]: string;
	    };
	    readonly value: string;
	    constructor(_option?: UiModalOption);
	    withClose(next: any, message?: string): Promise<any>;
	    showSpinning(message?: string): this;
	    hideSpinning(): this;
	    validateForm(field?: string): boolean;
	    validateClear(field?: string): boolean;
	    private _validInput;
	    private _openHook;
	    private _closedHook;
	}

}
declare module 'h5-sdk/src/factory/UiToast.web' {
	/// <reference types="zepto" />
	import 'h5-sdk/src/assets/ui-toast.less';
	import UiBase, { UiBaseOption } from 'h5-sdk/src/factory/UiBase.web';
	export type UiToastOption = UiBaseOption & {
	    icon?: string;
	    message?: string;
	    clickClosed?: boolean;
	    onClick?: (this: UiToast, instance: UiToast) => void;
	};
	export default class UiToast extends UiBase {
	    static option: UiToastOption;
	    $body: ZeptoCollection;
	    $icon: ZeptoCollection;
	    $message: ZeptoCollection;
	    constructor(_option: UiToastOption);
	    setMessage(message: string): this;
	    setIcon(icon: string): this;
	    private _openHook;
	    private _closedHook;
	}

}
declare module 'h5-sdk/src/assets/svg-string' {
	export const SvgWindmill = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64px\" height=\"64px\" viewBox=\"0 0 128 128\" x=\"64\" y=\"0\"><path d=\"M64 0L40.08 21.9a10.98 10.98 0 0 0-5.05 8.75C34.37 44.85 64 60.63 64 60.63V0z\" fill=\"#ffb118\"/><path d=\"M128 64l-21.88-23.9a10.97 10.97 0 0 0-8.75-5.05C83.17 34.4 67.4 64 67.4 64H128z\" fill=\"#80c141\"/><path d=\"M63.7 69.73a110.97 110.97 0 0 1-5.04-20.54c-1.16-8.7.68-14.17.68-14.17h38.03s-4.3-.86-14.47 10.1c-3.06 3.3-19.2 24.58-19.2 24.58z\" fill=\"#cadc28\"/><path d=\"M64 128l23.9-21.88a10.97 10.97 0 0 0 5.05-8.75C93.6 83.17 64 67.4 64 67.4V128z\" fill=\"#cf171f\"/><path d=\"M58.27 63.7a110.97 110.97 0 0 1 20.54-5.04c8.7-1.16 14.17.68 14.17.68v38.03s.86-4.3-10.1-14.47c-3.3-3.06-24.58-19.2-24.58-19.2z\" fill=\"#ec1b21\"/><path d=\"M0 64l21.88 23.9a10.97 10.97 0 0 0 8.75 5.05C44.83 93.6 60.6 64 60.6 64H0z\" fill=\"#018ed5\"/><path d=\"M64.3 58.27a110.97 110.97 0 0 1 5.04 20.54c1.16 8.7-.68 14.17-.68 14.17H30.63s4.3.86 14.47-10.1c3.06-3.3 19.2-24.58 19.2-24.58z\" fill=\"#00bbf2\"/><path d=\"M69.73 64.34a111.02 111.02 0 0 1-20.55 5.05c-8.7 1.14-14.15-.7-14.15-.7V30.65s-.86 4.3 10.1 14.5c3.3 3.05 24.6 19.2 24.6 19.2z\" fill=\"#f8f400\"/><circle cx=\"64\" cy=\"64\" r=\"2.03\"/></svg>";
	export const SvgColorRing = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64px\" height=\"64px\" viewBox=\"0 0 128 128\" x=\"0\" y=\"0\"><path d=\"M.6 57.54c5.73-6.23 17.33-15.5 33.66-12.35C55.4 48.5 64 63.95 64 63.95S42.42 65 30.28 83.63a38.63 38.63 0 0 0-3.4 32.15 64.47 64.47 0 0 1-5.52-4.44A63.64 63.64 0 0 1 .6 57.54z\" fill=\"#ffcb02\"/><path d=\"M65.32 29.05c7.65 19.98-1.44 35.18-1.44 35.18S52.2 46.05 30.03 44.85A38.6 38.6 0 0 0 .56 57.93 63.8 63.8 0 0 1 37.56 6c8.2 1.8 22.26 7.16 27.76 23.05z\" fill=\"#ff9e02\"/><path d=\"M94.92 47.7c-13.48 16.63-31.2 16.36-31.2 16.36s9.92-19.2-.13-39a38.6 38.6 0 0 0-26.18-19 63.78 63.78 0 0 1 63.52 6.03c2.56 8 4.98 22.85-6.05 35.6z\" fill=\"#ff4b42\"/><path d=\"M93.52 82.53C72.38 79.17 63.75 63.7 63.75 63.7s21.6-1.02 33.7-19.63a38.6 38.6 0 0 0 3.43-32.04 64.33 64.33 0 0 1 5.74 4.6 63.63 63.63 0 0 1 20.82 53.26c-5.62 6.2-17.34 15.8-33.94 12.6z\" fill=\"#c063d6\"/><path d=\"M62.5 99c-7.65-19.98 1.44-35.17 1.44-35.17S75.56 81.6 97.74 82.8a39.1 39.1 0 0 0 29.73-13.03 63.8 63.8 0 0 1-37.16 52.3c-8.2-1.8-22.25-7.15-27.8-23.06z\" fill=\"#17a4f6\"/><path d=\"M26.64 115.63C24 107.6 21.6 93.06 32.5 80.5c13.48-16.62 31.58-16.55 31.58-16.55s-9.6 19.06.44 38.86a38.82 38.82 0 0 0 26.05 19.17 63.78 63.78 0 0 1-63.93-6.3z\" fill=\"#4fca24\"/></svg>";

}
declare module 'h5-sdk/src/factory/UiMusic.web' {
	/// <reference types="zepto" />
	import 'h5-sdk/src/assets/ui-music.less';
	export interface IUiMusicOption {
	    background?: boolean;
	    target?: string;
	    src?: string;
	    className?: string;
	    theme?: string;
	    position?: 'tl' | 'tr' | 'bl' | 'br';
	    style?: any;
	    autoplay?: boolean;
	    loop?: boolean;
	    muted?: boolean;
	    volume?: number;
	    preload?: 'none' | 'metadata' | 'auto';
	    offsetX?: number | string;
	    offsetY?: number | string;
	    size?: number | string;
	    onClick?: Function;
	}
	export interface IUiMusicTheme {
	    playing: string | Function;
	    paused: string | Function;
	    loading?: string | Function;
	}
	interface IUiMusicTimeline {
	    begin: number;
	    end: number;
	    loop?: boolean;
	}
	export default class UiMusic {
	    static instance: UiMusic;
	    static option: IUiMusicOption;
	    static themes: Map<any, any>;
	    static registerTheme(themeName: any, adapter: IUiMusicTheme | number[]): Map<string, IUiMusicTheme>;
	    timelines: Record<string, IUiMusicTimeline>;
	    option: IUiMusicOption;
	    isMounted: boolean;
	    isUserPaused: boolean;
	    private _isLoading;
	    private _isPlaying;
	    private _isPaused;
	    $root: ZeptoCollection;
	    $view: ZeptoCollection;
	    $loading: ZeptoCollection;
	    $playing: ZeptoCollection;
	    $paused: ZeptoCollection;
	    audio: HTMLAudioElement;
	    constructor(_option: IUiMusicOption);
	    currentTime: number;
	    readonly theme: IUiMusicTheme;
	    isLoading: boolean;
	    isPaused: boolean;
	    isPlaying: boolean;
	    load(src?: string): this;
	    play: () => this;
	    pause: () => void;
	    replay: () => void;
	    hide(): void;
	    show(): void;
	    destory(): void;
	    private _handleEvent;
	    addTimeline(name: string, timeline: IUiMusicTimeline): void;
	    private _unbindTimeupdate;
	    gotoAndPlay(name: string, callback?: Function): void;
	}
	export {};

}
declare module 'h5-sdk/src/factory/UiView.web' {
	/// <reference types="zepto" />
	import 'h5-sdk/src/assets/ui-view.less';
	import UiBase, { UiBaseOption } from 'h5-sdk/src/factory/UiBase.web';
	export interface UiViewOption extends UiBaseOption {
	    type: 'image' | 'preloader' | 'curtain';
	    isFullScreen?: boolean;
	    src?: string;
	    alt?: string;
	    content?: string;
	    icon?: string;
	    iconPosition?: 'tl' | 'tr' | 'bl' | 'br' | 'center';
	    onClick?: (this: UiView, instance: UiView) => void;
	}
	export default class UiView extends UiBase {
	    static option: {
	        isAddMask: boolean;
	        target: string;
	        iconPosition: string;
	        onClick: (this: UiView) => void;
	    };
	    $view: ZeptoCollection;
	    $content?: ZeptoCollection;
	    constructor(_option: UiViewOption);
	    private _openHook;
	    setContent(content: string): any;
	}

}
declare module 'h5-sdk/src/factory/UiSheet.web' {
	/// <reference types="zepto" />
	import UiBase, { UiBaseOption, UiButtonOption } from 'h5-sdk/src/factory/UiBase.web';
	interface IUiSheetAction extends UiButtonOption {
	}
	export interface IUiSheetOption extends UiBaseOption {
	    title?: string;
	    menus?: IUiSheetAction[];
	    actions?: IUiSheetAction[];
	    maskClose?: boolean;
	    transparent?: boolean;
	    target?: string | HTMLElement;
	    onClick?: (key?: string) => void;
	    onClose?: Function;
	}
	export default class UiSheet extends UiBase {
	    static option: IUiSheetOption;
	    $sheet: ZeptoCollection;
	    constructor(_option?: IUiSheetOption);
	    private _openHook;
	    private _closedHook;
	}
	export {};

}
declare module 'h5-sdk/src/plugins/ui.web' {
	import { UiInputType } from 'h5-sdk/src/factory/UiBase.web';
	import UiModal, { UiModalOption } from 'h5-sdk/src/factory/UiModal.web';
	import UiToast from 'h5-sdk/src/factory/UiToast.web';
	import UiMusic, { IUiMusicOption } from 'h5-sdk/src/factory/UiMusic.web';
	import UiView, { UiViewOption } from 'h5-sdk/src/factory/UiView.web';
	import UiSheet, { IUiSheetOption } from 'h5-sdk/src/factory/UiSheet.web';
	export interface IUiAlertOption extends UiModalOption {
	    href?: string;
	    okText?: string | false;
	    ok?: Function;
	}
	export interface IUiConfirmOption extends IUiAlertOption {
	    formError?: Function | string;
	    noText?: string | false;
	    no?: Function;
	}
	export interface IUiPromptOption extends IUiConfirmOption {
	    type?: UiInputType;
	    defaultValue?: string;
	    placeholder?: string;
	    validate?: (value: string) => any;
	}
	export type IUserProfileType = 'username' | 'mobile' | 'password' | 'address' | 'hidden';
	export interface IUiUserboxOption extends IUiConfirmOption {
	    title: string;
	    profile: IUserProfileType[];
	}
	export function modal(option: UiModalOption): UiModal;
	export function alert(option: IUiAlertOption | string): UiModal;
	export function confirm(option: IUiConfirmOption): UiModal;
	export function prompt(option: IUiPromptOption | string): UiModal;
	export function sheet(option: IUiSheetOption): UiSheet;
	export function userbox(option: IUiUserboxOption): UiModal;
	export const toast: (message: any, duration?: any, onClose?: any) => UiToast;
	export const tips: (message: any, duration?: any, onClose?: any) => UiToast;
	export const success: (message: any, duration?: any, onClose?: any) => UiToast;
	export const info: (message: any, duration?: any, onClose?: any) => UiToast;
	export const warn: (message: any, duration?: any, onClose?: any) => UiToast;
	export const error: (message: any, duration?: any, onClose?: any) => UiToast;
	export const loading: (message: any, duration?: any, onClose?: any) => UiToast;
	export function view(option: UiViewOption): UiView;
	export function image(option: UiViewOption | string, isFullScreen?: boolean): UiView;
	export function preloader(content?: string): UiView;
	export function music(option: string | IUiMusicOption): UiMusic;
	export const $modal: (option: UiModalOption) => Promise<string | undefined>;
	export const $alert: (option: IUiAlertOption) => Promise<true | undefined>;
	export const $confirm: (option: IUiConfirmOption) => Promise<boolean>;
	export const $prompt: (option: IUiPromptOption) => Promise<string | undefined>;
	export const $userbox: (option: IUiUserboxOption) => Promise<object | undefined>;

}
declare module 'h5-sdk/src/factory/Http.web' {
	import Http from 'h5-sdk/src/factory/Http';
	export default Http;

}
declare module 'h5-sdk/src/factory/Res.web' {
	import Res from 'h5-sdk/src/factory/Res';
	export default Res;

}
declare module 'h5-sdk/src/plugins/analysis.web' {
	import analysis from 'h5-sdk/src/plugins/analysis';
	export default analysis;

}
declare module 'h5-sdk/src/plugins/jssdk.web' {
	 type IJssdkShareItem = {
	    arg: null | IJssdkShareBase;
	    platform: string;
	    api: string;
	    params?: any;
	}; function share(opts?: string | IJssdkShare): Promise<void> | IJssdkShareItem | IJssdkShareItem[] | undefined; class JssdkError extends Error {
	} const jssdk: {
	    version: string;
	    appid: string;
	    shareLogid: number;
	    task: import("./tasker").ITaskerPromise<boolean>;
	    ready: (fn: EventListenerOrEventListenerObject) => void;
	    config: (this: any, ...args: any[]) => any;
	    share: typeof share;
	    loadJssdk: (this: any, ...args: any[]) => any;
	    JssdkError: typeof JssdkError;
	};
	export default jssdk;
	export type IJssdkConfig = {
	    url?: string;
	    debug?: boolean;
	    appid?: string;
	    jsApiList?: string[];
	};
	export type IJssdkMessageMini = {
	    appid: string;
	    title: string;
	    desc: string;
	    link: string;
	    icon: string;
	    banner: string;
	};
	export interface IJssdkResponse extends IJssdkConfig {
	    timestamp: string;
	    nonceStr: string;
	    signature: string;
	}
	export interface IJssdkShareBase {
	    platform: string;
	    title: string;
	    desc: string;
	    link: string;
	    imgUrl: string;
	    success: any;
	    cancel: any;
	}
	export interface IJssdkShare {
	    platform?: string;
	    title?: string;
	    desc?: string;
	    link?: string;
	    img?: string;
	    banner?: string;
	    imgurl?: string;
	    imgUrl?: string;
	    logid?: number;
	    config?: string;
	    success?: Function;
	    cancel?: Function;
	    type?: 'music' | 'video' | 'link';
	    dataUrl?: string;
	    dataurl?: string;
	}
	export type IJssdkShareMini = {
	    appid: string;
	    title: string;
	    desc: string;
	    link: string;
	    icon: string;
	    banner: string;
	};

}
declare module 'h5-sdk/src/plugins/store.web' {
	import { IStoreUseProxy } from 'h5-sdk/src/plugins/store'; const _default: {
	    use(usestorage: IStoreUseProxy): any;
	    get(key: string, _default?: any): any;
	    set(key: string, data: any): void;
	    keys(): string[];
	    remove(key: string): void;
	    clear(): void;
	    each(fn: (value: any, key: string) => void): void;
	};
	export default _default;

}
declare module 'h5-sdk/src/plugins/cloud.web' {
	import { CloudResponse } from 'h5-sdk/src/plugins/cloud';
	export * from 'h5-sdk/src/plugins/cloud';
	export function wxmedia(media_id: string): Promise<CloudResponse>;
	export function upfile(file: File, isTempFile?: boolean): Promise<CloudResponse>;
	export function uptemp(file: File): Promise<CloudResponse>;

}
declare module 'h5-sdk/src/plugins/plugin.web' {
	export const store: Map<any, any>; type IUsePlugin = {
	    name: string;
	    version?: string;
	} | string;
	export const config: {
	    rootPath: string;
	};
	export function define(plugin: string, anything: any): any;
	export function use(plugin: IUsePlugin): Promise<any>;
	export {};

}
declare module 'h5-sdk/src/plugins/tool.web' {
	export * from 'h5-sdk/src/plugins/tool';
	export function getQrcode(username: string): string;
	export function readAsDataURL(inputer: File): Promise<string>;
	export function chooseFile(accept?: string, multiple?: boolean): Promise<File | FileList>;
	export function chooseImageAsDataURL(option?: any): Promise<string>;
	export function base64toBlob(base64String: string, contentType?: string, sliceSize?: number): Blob;

}
declare module 'h5-sdk/src/entry.web' {
	import 'h5-sdk/src/assets/common.less';
	import 'h5-sdk/src/assets/icon.less';
	import 'h5-sdk/src/venders/index.web';
	import App from 'h5-sdk/src/factory/App';
	import Auth from 'h5-sdk/src/factory/Auth.web';
	import AuthUser from 'h5-sdk/src/factory/AuthUser';
	import Config from 'h5-sdk/src/factory/Config.web';
	import Emitter from 'h5-sdk/src/factory/Emitter';
	import Http from 'h5-sdk/src/factory/Http.web';
	import Res from 'h5-sdk/src/factory/Res.web';
	import UiBase from 'h5-sdk/src/factory/UiBase.web';
	import UiModal from 'h5-sdk/src/factory/UiModal.web';
	import UiMusic from 'h5-sdk/src/factory/UiMusic.web';
	import UiSheet from 'h5-sdk/src/factory/UiSheet.web';
	import UiToast from 'h5-sdk/src/factory/UiToast.web';
	import UiView from 'h5-sdk/src/factory/UiView.web';
	export { App, Auth, AuthUser, Config, Emitter, Http, Res, UiBase, UiModal, UiMusic, UiSheet, UiToast, UiView };
	export * from 'h5-sdk/src/functions/common';
	export * from 'h5-sdk/src/functions/utils.web';
	export { default as analysis } from 'h5-sdk/src/plugins/analysis.web';
	export { default as hotcache } from 'h5-sdk/src/plugins/hotcache';
	export { default as jssdk } from 'h5-sdk/src/plugins/jssdk.web';
	export { default as location } from 'h5-sdk/src/plugins/location.web';
	export { default as store } from 'h5-sdk/src/plugins/store.web';
	export { default as tasker } from 'h5-sdk/src/plugins/tasker';
	import * as cdn from 'h5-sdk/src/plugins/cdn';
	import * as cloud from 'h5-sdk/src/plugins/cloud.web';
	import * as safefy from 'h5-sdk/src/plugins/safety';
	import * as plugin from 'h5-sdk/src/plugins/plugin.web';
	import * as tool from 'h5-sdk/src/plugins/tool.web';
	import * as ui from 'h5-sdk/src/plugins/ui.web';
	export { cdn, cloud, safefy, plugin, tool, ui };
	import 'h5-sdk/src/scheduler/task.web';

}
declare module 'h5-sdk/src/factory/Res.test' {
	export {};

}
declare module 'h5-sdk' {
	import main = require('h5-sdk/src/entry.web');
	export = main;
}
