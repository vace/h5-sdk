/// <reference types="zepto" />
/// <reference types="store" />
/// <reference types="blueimp-md5" />
declare module 'h5-sdk/types/es6-object-assign' {
	export function assign(target: any, firstSource: any, ...args: any[]): any;
	export function polyfill(): void;

}
declare module 'h5-sdk/src/functions/regex' {
	export const regexHttp: RegExp;
	export const regexBase64: RegExp;
	export const regexNumber: RegExp;
	export const regexMobile: RegExp;
	export const regexChinese: RegExp;
	export const regexSplitPath: RegExp;

}
declare module 'h5-sdk/src/functions/is' {
	export function is(type: string): (arg: any) => arg is any;
	export const isArray: (arg: any) => arg is any[];
	export const isBoolean: (arg: any) => arg is any;
	export const isNull: (arg: any) => arg is any;
	export const isNullOrUndefined: (arg: any) => boolean;
	export const isNumber: (arg: any) => arg is any;
	export const isString: (arg: any) => arg is any;
	export const isSymbol: (arg: any) => arg is any;
	export const isUndefined: (arg: any) => arg is any;
	export const isRegExp: (arg: any) => arg is any;
	export const isObject: (arg: any) => boolean;
	export const isDate: (arg: any) => arg is any;
	export const isError: (e: any) => boolean;
	export const isFunction: (arg: any) => arg is any;
	export function isPrimitive(arg: any): boolean;
	export function isHasOwn(obj: any, prop: string): boolean;
	export function isEmpty(value: any): boolean;
	export function isHttp(str: string): boolean;
	export function isBase64(string: string): boolean;
	export function isNative(Ctor: any): boolean;
	export function isWindow(obj: any): boolean;
	export function isDocument(obj: any): boolean;
	export function isPromise(obj: any): boolean;
	export function isFormData(val: any): boolean;
	export const isFile: (arg: any) => arg is any;
	export const isBlob: (arg: any) => arg is any;

}
declare module 'h5-sdk/src/functions/underscore' {
	export const now: () => number;
	export function throttle(func: Function, wait: number): (this: any) => any;
	export function debounce(func: Function, wait?: number, immediate?: boolean): any;
	export function random(min: number, max?: number): number;
	export function shuffle<T>(array: T[]): T[];
	export function each(obj: any, iteratee: Function, context?: any): any;
	export function pick(obj: object, map: string[] | object): {};
	export function memoize(func: Function, hasher?: Function): any;

}
declare module 'h5-sdk/src/adapters/store/interface' {
	export interface IStore {
	    read(key: string): any;
	    write(key: string, val: any): any;
	    remove(key: string): any;
	    clearAll(): any;
	    keys(): string[];
	}

}
declare module 'h5-sdk/src/utils/global' {
	export const isBrowserEnv: boolean;
	export const global: any;
	export const navigator: any;
	export const location: any;
	export const document: any;
	export const getwx: () => any;
	export const fetch: any;
	export const WeixinJSBridge: any;
	export const addEventListener: any;
	export const removeEventListener: any;
	export const performance: any;
	export const localStorage: any;

}
declare module 'h5-sdk/src/adapters/store/store.web' {
	import { IStore } from 'h5-sdk/src/adapters/store/interface';
	export default function createStoreWeb(): IStore;

}
declare module 'h5-sdk/src/adapters/store/store.mini' {
	import { IStore } from 'h5-sdk/src/adapters/store/interface';
	export default function createStoreMini(): IStore;

}
declare module 'h5-sdk/src/adapters/store/store.node' {
	import { IStore } from 'h5-sdk/src/adapters/store/interface';
	export default function createStoreNode(): IStore;

}
declare module 'h5-sdk/src/adapters/store/index' {
	import { IStore } from 'h5-sdk/src/adapters/store/interface'; const _default: {
	    readonly store: IStore;
	    get(key: string, _defaultValue?: any): any;
	    set(key: string, value: any): any;
	    remove(key: string): any;
	    each(fn: (value: any, key: string) => void): void;
	    clearAll(): any;
	};
	export default _default;

}
declare module 'h5-sdk/src/factory/_cacher' {
	export default function cacher(cacheKey: string): {
	    get: (key: string) => any;
	    set: (key: string, value: any) => any;
	    remove: (key: string) => void;
	};

}
declare module 'h5-sdk/src/factory/User' {
	export type IUserState = 'unknow' | 'normal' | 'black' | 'admin' | 'super' | 'developer';
	export type IUserPlatform = 'unknow' | 'wechat' | 'qq' | 'taobao' | 'weibo' | 'douyin' | 'github' | 'google' | 'linkedin' | 'facebook' | 'open' | 'mini';
	export type IUserType = 'none' | 'base' | 'user';
	export type IUserOption = {
	    appid: string;
	};
	export default class User {
	    private static cacher;
	    private static _instance;
	    static readonly instance: User;
	    static readonly hasInstance: boolean;
	    static createInstance(option: IUserOption): User;
	    isLogin: boolean;
	    id: number;
	    platform: IUserPlatform;
	    appid: string;
	    nickname: string;
	    avatar: string;
	    openid: string;
	    state: IUserState;
	    gender: number;
	    email: string;
	    username: string;
	    userType: IUserType;
	    location: string;
	    unionid: string;
	    constructor(option: IUserOption);
	    login(user: any): this;
	    logout(): void;
	}

}
declare module 'h5-sdk/src/plugins/safety' {
	export function btoa(input: string): string;
	export function atob(input: string): string;
	export const md5: (str: string, key?: string) => string;
	export function signature(object: Record<string, any>, action?: string): string;
	export function jwtDecode(token: string): any;

}
declare module 'h5-sdk/src/factory/Tasker' {
	export default class Tasker {
	    isWorked: boolean;
	    isDone: boolean;
	    task: Promise<any>;
	    private _nativeResolve;
	    private _nativeReject;
	    constructor();
	    working(): void;
	    resolve(val: any): Promise<any>;
	    reject(err: any): Promise<any>;
	    then(onfulfilled: any, onrejected: any): Promise<any>;
	}

}
declare module 'h5-sdk/src/adapters/auth/interface' {
	import Auth from 'h5-sdk/src/factory/Auth';
	import { IUserPlatform, IUserType, IUserState } from 'h5-sdk/src/factory/User';
	export interface IAuth {
	    checkToken(auth: Auth, checkRet: any): boolean;
	    checkLogin(auth: Auth): Promise<boolean>;
	    login(auth: Auth): Promise<any>;
	    update(auth: Auth, param: any): Promise<any>;
	    logout(auth: Auth): Promise<any>;
	    refresh(auth: Auth): Promise<any>;
	}
	export interface IAuthOption {
	    version?: string;
	    platform: IUserPlatform;
	    appid: string;
	    type?: IUserType;
	    url?: string;
	    scope?: string;
	    env?: string;
	}
	export interface IJwtDecodeRet {
	    exp: number;
	    iss: string;
	    id: number;
	    state: IUserState;
	    sub: IUserPlatform;
	    typ: IUserType;
	}

}
declare module 'h5-sdk/src/functions/qs' {
	export function stringify(obj?: any, sep?: string, eq?: string): string;
	export function parse(qs: string, sep?: string, eq?: string): Record<string, any>;

}
declare module 'h5-sdk/src/functions/path' {
	export function isAbsolute(path: string): boolean;
	export function resolvePath(...args: string[]): string;
	export function dirname(path: string): string;
	export function basename(path: string, ext?: string): string;
	export function extname(path: string): string;

}
declare module 'h5-sdk/src/adapters/request/request.web' {
	import { IHttpOption, IHttpRequestOption } from 'h5-sdk/src/adapters/request/interface';
	export default function createRequestWeb(): (config: IHttpOption & IHttpRequestOption) => Promise<any>;

}
declare module 'h5-sdk/src/adapters/request/request.mini' {
	import { IHttpOption, IHttpRequestOption } from 'h5-sdk/src/adapters/request/interface';
	export interface WxRequestCallbackResult {
	    data: string | object | ArrayBuffer;
	    header: object;
	    statusCode: number;
	}
	export default function createRequestMini(): (config: IHttpOption & IHttpRequestOption) => Promise<{}>;

}
declare module 'h5-sdk/src/adapters/request/request.node' {
	import { IHttpOption, IHttpRequestOption } from 'h5-sdk/src/adapters/request/interface';
	export default function createRequestNode(): (config: IHttpOption & IHttpRequestOption) => any;

}
declare module 'h5-sdk/src/adapters/request/index' {
	import { IRequest } from 'h5-sdk/src/adapters/request/interface'; let request: IRequest;
	export { request };

}
declare module 'h5-sdk/src/adapters/auth/auth.mini' {
	import { IAuth } from 'h5-sdk/src/adapters/auth/interface';
	export default function createAuthMini(): IAuth;

}
declare module 'h5-sdk/src/utils/shared.web' {
	export const assign: {
	    <T, U>(target: T, source: U): T & U;
	    <T, U, V>(target: T, source1: U, source2: V): T & U & V;
	    <T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
	    (target: object, ...sources: any[]): any;
	};
	export function getCurrentHref(isPrivacy?: boolean | string[]): string;
	export function getCurrentPathFile(filename?: string): string;

}
declare module 'h5-sdk/src/adapters/auth/auth.web' {
	import { IAuth } from 'h5-sdk/src/adapters/auth/interface';
	export default function createAuthWeb(): IAuth;

}
declare module 'h5-sdk/src/adapters/auth/auth.node' {
	import { IAuth } from 'h5-sdk/src/adapters/auth/interface';
	export default function createAuthNode(): IAuth;

}
declare module 'h5-sdk/src/adapters/auth/index' {
	import { IAuth } from 'h5-sdk/src/adapters/auth/interface'; let auth: IAuth;
	export { auth };

}
declare module 'h5-sdk/src/factory/Auth' {
	import User, { IUserState, IUserPlatform, IUserType } from 'h5-sdk/src/factory/User';
	import Tasker from 'h5-sdk/src/factory/Tasker';
	import { IAuthOption, IAuth } from 'h5-sdk/src/adapters/auth/interface';
	export default class Auth {
	    static adapter: IAuth;
	    static option: IAuthOption;
	    static cacher: {
	        get: (key: string) => any;
	        set: (key: string, value: any) => any;
	        remove: (key: string) => void;
	    };
	    private static _instance;
	    static readonly instance: Auth;
	    static readonly hasInstance: boolean;
	    static createInstance(option: IAuthOption): Auth;
	    tasker: Tasker;
	    isAuthed: boolean;
	    id: number;
	    user: User;
	    version: string;
	    state: IUserState;
	    type?: IUserType;
	    option: IAuthOption;
	    platform: IUserPlatform;
	    appid: string;
	    scope: string;
	    env: string;
	    url: string;
	    _accessToken: string | null;
	    isAccessTokenValid: boolean;
	    constructor(options?: IAuthOption);
	    accessToken: string | null;
	    saveToken(token: string): void;
	    clearToken(): void;
	    setOption(option: IAuthOption): this;
	    setup(): Promise<User | any>;
	    refresh(): Promise<User | null>;
	    checkLogin(): Promise<boolean>;
	    update(param: any): Promise<any>;
	    login(): Promise<any>;
	    logout(): Promise<any>;
	}

}
declare module 'h5-sdk/src/adapters/request/interface' {
	import Auth from 'h5-sdk/src/factory/Auth';
	export type IRequest = (config: IHttpOption & IHttpRequestOption) => Promise<any>;
	export type ICommonResponseData = {
	    code: number;
	    data: any;
	    message: string;
	    msg?: string;
	};
	export interface IHttpRequestBase {
	    method?: 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'JSONP';
	    headers?: HeadersInit;
	    body?: any;
	    mode?: 'cors' | 'no-cors' | 'same-origin';
	    cache?: RequestCache;
	    credentials?: RequestCredentials;
	    redirect?: RequestRedirect;
	    referrer?: ' no-referrer' | 'client';
	}
	export interface IHttpOption extends IHttpRequestBase {
	    auth?: Auth;
	    baseURL?: string;
	    timeout?: number;
	    transformRequest?: (arg: ITransformRequestOption) => any;
	    transformResponse?: (res: Response) => any;
	    responseType?: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text';
	    validateStatus?: (status: number) => boolean;
	}
	export interface ITransformRequestOption extends RequestInit {
	    url: string;
	}
	export interface IHttpRequestOption extends IHttpRequestBase {
	    url: string;
	    query?: any;
	    params?: any;
	    data?: any;
	}
	export enum Method {
	    GET = "GET",
	    DELETE = "DELETE",
	    HEAD = "HEAD",
	    OPTIONS = "OPTIONS",
	    POST = "POST",
	    PUT = "PUT",
	    PATCH = "PATCH",
	    JSONP = "JSONP"
	}
	export enum ContentType {
	    UrlEncode = "application/x-www-form-urlencoded; charset=utf-8",
	    JSON = "application/json; charset=utf-8"
	}

}
declare module 'h5-sdk/src/utils/common' {
	import { ICommonResponseData } from 'h5-sdk/src/adapters/request/interface';
	export function commonResponseReslove(response: ICommonResponseData): Promise<Error> | Promise<any>;

}
declare module 'h5-sdk/src/factory/Http' {
	import { IHttpOption, IHttpRequestOption } from 'h5-sdk/src/adapters/request/interface';
	export default class Http {
	    static option: IHttpOption;
	    private static _instance;
	    static readonly instance: Http;
	    option: IHttpOption;
	    constructor(_option?: IHttpOption);
	    get(url: string, params?: any): Promise<any>;
	    delete(url: string, params?: any): Promise<any>;
	    head(url: string, params?: any): Promise<any>;
	    options(url: string, params?: any): Promise<any>;
	    post(url: string, data?: any): Promise<any>;
	    put(url: string, data?: any): Promise<any>;
	    patch(url: string, data?: any): Promise<any>;
	    request(option: IHttpRequestOption): Promise<any>;
	}

}
declare module 'h5-sdk/src/functions/common' {
	export function camelize(str: string): string;
	export function noop(): void;
	export function alway(val: any): any;
	export function dasherize(str: string): string;
	export function wait<T>(ms: number, arg?: T): Promise<T>;
	export function uid(prefix?: string): string;
	export function uuid(): string;
	export function randomstr(len?: number): string;
	export function spread(callback: Function): (arr: any[]) => any;

}
declare module 'h5-sdk/src/factory/App' {
	import Http from 'h5-sdk/src/factory/Http';
	import Auth from 'h5-sdk/src/factory/Auth';
	import User from 'h5-sdk/src/factory/User';
	export default class App {
	    private static cacher;
	    private static _instance;
	    static readonly instance: App;
	    static errorHandler: errorHandler;
	    static readonly hasInstance: boolean;
	    static createInstance(option: IAppOption): App;
	    static transformRequest: any;
	    static transformResponse: any;
	    static showLoading: any;
	    static showSuccess: any;
	    static showError: any;
	    readonly isLogin: boolean | null;
	    http: Http;
	    auth: Auth | null;
	    user: User | null;
	    private tasker;
	    appid: string;
	    config: IAppServerConfig;
	    setting: IAppServerSetting;
	    analysisoff?: boolean;
	    constructor(app: IAppOption);
	    setAuth(auth: Auth): this;
	    ready(fn?: any, err?: any): Promise<any>;
	    private setup;
	    private setServer;
	    post(action: string, data?: any): any;
	    put(action: string, data?: any): any;
	    get(action: string, query?: any): any;
	    delete(action: string, query?: any): any;
	    action(action: string | IActionStruct, param?: any, method?: string): any;
	} type MessageCallback = (msg?: string, response?: any) => any; type MessageDialog = boolean | string | MessageCallback;
	export interface IActionStruct {
	    api: string;
	    param: any;
	    body: any;
	    query: any;
	    showError: MessageDialog;
	    showLoading: MessageDialog;
	    showSuccess: MessageDialog;
	} type IAppServerConfig = {
	    id: number;
	    name: string;
	    oauth: string;
	    appid: string;
	    endtime: number;
	    starttime: number;
	    status: string;
	}; type IAppServerSetting = Record<string, any>;
	export type IAppServerInit = {
	    api: {
	        [module: string]: string[];
	    };
	    config: IAppServerConfig;
	    setting: IAppServerSetting;
	    version: string;
	};
	export type IAppOption = {
	    appid: string;
	    analysisoff?: boolean;
	}; type ITypeAction = {
	    method: string;
	    action: string;
	    param: any;
	}; type errorHandler = (err: Error, action: ITypeAction, vm: App) => void;
	export {};

}
declare module 'h5-sdk/src/adapters/analysis/interface' {
	export interface IAnalysis {
	    getCurrentUrl(privacy: any): string;
	    getErrorStack(error: any): string;
	    getUserAgent(): string;
	    getCurrentParam(): Record<string, any>;
	    send(target: string): Promise<any>;
	    onShow(fn: EventListener): any;
	    onError(fn: EventListener): any;
	    onUnload(fn: EventListener): any;
	}

}
declare module 'h5-sdk/src/adapters/analysis/analysis.mini' {
	import { IAnalysis } from 'h5-sdk/src/adapters/analysis/interface';
	export default function createAnalysisMini(): IAnalysis;

}
declare module 'h5-sdk/src/functions/helper' {
	export function addListener(element: Window | HTMLElement | Document, event: string, callback: EventListener): Function;
	export const domready: Promise<boolean>;

}
declare module 'h5-sdk/src/adapters/analysis/analysis.web' {
	import { IAnalysis } from 'h5-sdk/src/adapters/analysis/interface';
	export default function createAnalysisWeb(): IAnalysis;

}
declare module 'h5-sdk/src/adapters/analysis/index' {
	import { IAnalysis } from 'h5-sdk/src/adapters/analysis/interface'; let analysis: IAnalysis;
	export { analysis };

}
declare module 'h5-sdk/src/plugins/analysis' {
	export type AnalysisOption = {
	    disabled: boolean;
	    maxReportError: number;
	    beforeLoadTime: number;
	    unloadData: any;
	};
	export const config: AnalysisOption;
	export const EVENTS: {
	    'VIEW': string;
	    'ERROR': string;
	    'SHARE': string;
	    'UNLOAD': string;
	    'CLICK': string;
	    'USER': string;
	};
	export function start(): void;
	export function stop(): void;
	export function pv(e?: any): Promise<void>;
	export function event(event: string, data?: any, value?: number): Promise<void>;
	export function user(data?: any, value?: number): Promise<void>;
	export function click(data?: any, value?: number): Promise<void>;
	export function error(error: Error | string): false | Promise<void> | undefined;

}
declare module 'h5-sdk/src/config' {
	import { AnalysisOption } from 'h5-sdk/src/plugins/analysis';
	export let isDev: boolean;
	export type DefaultConfig = {
	    api: string;
	    analysis?: AnalysisOption;
	    service: string;
	    cdn: string;
	};
	export const config: DefaultConfig;
	export default config;
	export function getServiceUri(name: string): string;
	export function getApiUri(name: string): string;
	export function getCdnRes(filename: string): string;
	export function getOssRes(filename: string, process: string | object): string;

}
declare module 'h5-sdk/src/factory/Emitter' {
	 type EventHandler = (event?: any, a1?: any, a2?: any) => void; type WildCardEventHandler = (type: string, event?: any, a1?: any, a2?: any) => void; type AllowEventHandler = EventHandler | WildCardEventHandler;
	export default class Emitter {
	    protected static _instance: Emitter;
	    static readonly instance: Emitter;
	    private $emitters;
	    readonly $emitter: AllowEventHandler[];
	    on(type: string, handler: EventHandler): () => this;
	    once(type: string, handler: EventHandler): () => this;
	    off(type: string, handler: EventHandler): this;
	    emit(type: string, a?: any, b?: any): this;
	    private $getEmitter;
	}
	export {};

}
declare module 'h5-sdk/src/utils/shared' {
	/// <reference types="zepto" />
	export * from 'h5-sdk/src/utils/shared.web';
	export function nextZIndex(): number;
	export function classPrefix(className: string | any[]): string;
	export function createSdkIcon(name: string): string;
	export function createClsElement(className: string, content?: string | ZeptoCollection, tagName?: string): ZeptoCollection;
	export function onceAnimationEnd($element: ZeptoCollection, callback: any): any;
	export function getElementAttrs(element: HTMLElement | ZeptoCollection, attrs: string[]): {
	    [key: string]: any;
	};

}
declare module 'h5-sdk/src/functions/environment' {
	export const isMobile: boolean;
	export const isIos: boolean;
	export const isAndroid: boolean;
	export const isMiniapp: boolean;
	export const isWechat: boolean;
	export function checkSupportWebp(): Promise<boolean>;

}
declare module 'h5-sdk/src/functions/lodash' {
	export function before(n: number, func: Function | any): (this: any, ...args: any[]) => any;
	export function after(n: number, func: Function): (this: any, ...args: any[]) => any;
	export function once(func: Function): (this: any, ...args: any[]) => any;
	export function remove(array: any[], predicate: Function): any[];

}
declare module 'h5-sdk/src/functions/timeago' {
	export function timeago(unixTime: Date | number): string;
	export function unixFormat(unixTime: number, format?: string): string;

}
declare module 'h5-sdk/src/functions/index' {
	export * from 'h5-sdk/src/functions/common';
	export * from 'h5-sdk/src/functions/environment';
	export * from 'h5-sdk/src/functions/helper';
	export * from 'h5-sdk/src/functions/is';
	export * from 'h5-sdk/src/functions/lodash';
	export * from 'h5-sdk/src/functions/path';
	export * from 'h5-sdk/src/functions/qs';
	export * from 'h5-sdk/src/functions/regex';
	export * from 'h5-sdk/src/functions/timeago';
	export * from 'h5-sdk/src/functions/underscore';

}
declare module 'h5-sdk/src/plugins/jssdk' {
	import 'h5-sdk/src/polyfill/jweixin-1.5.0';
	import Emitter from 'h5-sdk/src/factory/Emitter';
	export type IWxConfigOption = {
	    url?: string;
	    debug?: boolean;
	    appid?: string;
	    jsApiList?: any[];
	};
	export type IPostMessageStruct = {
	    appid: string;
	    title: string;
	    desc: string;
	    link: string;
	    icon: string;
	    banner: string;
	};
	export interface IConfigResponse extends IWxConfigOption {
	    timestamp: string;
	    nonceStr: string;
	    signature: string;
	}
	export interface IWxShareOption {
	    platform?: '*' | SharePlatform;
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
	}
	export type IWxEventType = 'beforeConfig' | 'config' | 'share' | 'updateShare' | 'error' | 'ready';
	export const defaultJsApiList: string[];
	export const emitter: Emitter;
	export const on: (type: IWxEventType, callback: EventHandlerNonNull) => () => Emitter;
	export function ready(fn: Function): void;
	export function config(option?: IWxConfigOption): Promise<IConfigResponse>;
	export function fire(resolve: Function): void;
	export function getAppid(): string; type SharePlatform = 'timeline' | 'app' | 'qq' | 'weibo' | 'qzone' | 'mini';
	export function share(option?: IWxShareOption): any;
	export function setMiniappShare(option: IWxShareOption): any;
	export function chooseImageBase64(): Promise<string>;
	export function preview(url: string | string[], index?: number): void;
	export function api(apiName: string, option?: any): Promise<any>;
	export {};

}
declare module 'h5-sdk/src/plugins/tool' {
	export function onShake(callback: Function): false | (() => void);
	export function readAsDataURL(inputer: File): Promise<string>;
	export function chooseFile(accept?: string): Promise<File>;
	export function chooseImageAsDataURL(): Promise<string>;
	export function autoGetImageBase64(): Promise<string>;
	export function scrollTop(element?: HTMLElement): void;
	export function scrollFix(_element?: HTMLElement): void;
	export function base64toBlob(base64String: string, contentType?: string, sliceSize?: number): Blob;

}
declare module 'h5-sdk/src/factory/UiBase' {
	/// <reference types="zepto" />
	import Emitter from 'h5-sdk/src/factory/Emitter';
	export type TypeColor = 'dark' | 'main' | 'primary' | 'warn' | 'info';
	export type UiTheme = 'android' | 'ios';
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

}
declare module 'h5-sdk/src/factory/UiModal' {
	/// <reference types="zepto" />
	import 'h5-sdk/src/assets/ui-modal.less';
	import UiBase, { UiBaseOption, UiButtonOption, UiInputOption } from 'h5-sdk/src/factory/UiBase';
	export interface UiModalOption extends UiBaseOption {
	    title?: string;
	    header?: string;
	    content?: string;
	    footer?: string;
	    buttons?: UiButtonOption[];
	    inputs?: UiInputOption[];
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
	    showSpinning(message?: string): this;
	    hideSpinning(): this;
	    validateForm(field?: string): boolean;
	    validateClear(field?: string): boolean;
	    private _validInput;
	    private _openHook;
	    private _closedHook;
	}

}
declare module 'h5-sdk/src/adapters/ui/interface' {
	import { UiInputType } from 'h5-sdk/src/factory/UiBase';
	import { UiModalOption } from 'h5-sdk/src/factory/UiModal';
	export interface IUiAlertOption extends UiModalOption {
	    href?: string;
	    okText?: string;
	    ok?: Function;
	}
	export interface IUiConfirmOption extends IUiAlertOption {
	    formError?: Function | string;
	    noText?: string;
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

}
declare module 'h5-sdk/src/adapters/ui/ui.promise' {
	import { UiModalOption } from 'h5-sdk/src/factory/UiModal';
	import { IUiConfirmOption, IUiPromptOption, IUiUserboxOption, IUiAlertOption } from 'h5-sdk/src/adapters/ui/interface';
	export function wrapModal(fun: Function, option: UiModalOption): Promise<string | undefined>;
	export function wrapAlert(fun: Function, option: IUiAlertOption): Promise<true | undefined>;
	export function wrapConfirm(fun: Function, option: IUiConfirmOption): Promise<boolean>;
	export function wrapPrompt(fun: Function, option: IUiPromptOption): Promise<string | undefined>;
	export function wrapUserbox(fun: Function, option: IUiUserboxOption): Promise<object | undefined>;

}
declare module 'h5-sdk/src/adapters/ui/ui.mini' {
	import { IUiAlertOption, IUiConfirmOption } from 'h5-sdk/src/adapters/ui/interface';
	export let uiAssetsPath: string;
	export function alert(option: IUiAlertOption): Promise<boolean>;
	export function confirm(option: IUiConfirmOption): Promise<boolean>;
	export function prompt(): any;
	export function userbox(): any;
	export const toast: (message: any, duration?: number | undefined) => any;
	export const tips: (message: any, duration?: number | undefined) => any;
	export const success: (message: any, duration?: number | undefined) => any;
	export const info: (message: any, duration?: number | undefined) => any;
	export const warn: (message: any, duration?: number | undefined) => any;
	export const error: (message: any, duration?: number | undefined) => any;
	export const loading: (message: any, duration?: number | undefined) => any;
	export const view: () => any;
	export const image: () => any;
	export const preloader: (content?: string) => {
	    close(): void;
	};
	export const music: () => any;
	export const $modal: (option: any) => any;
	export const $alert: (option: IUiAlertOption) => Promise<true | undefined>;
	export const $confirm: (option: IUiConfirmOption) => Promise<boolean>;
	export const $prompt: (option: any) => any;
	export const $userbox: (option: any) => any;

}
declare module 'h5-sdk/src/adapters/app/app.mini' {
	export default function createAppMini(): void;

}
declare module 'h5-sdk/src/factory/index.mini' {
	export { default as App } from 'h5-sdk/src/factory/App';
	export { default as Auth } from 'h5-sdk/src/factory/Auth';
	export { default as Emitter } from 'h5-sdk/src/factory/Emitter';
	export { default as Http } from 'h5-sdk/src/factory/Http';
	export { default as User } from 'h5-sdk/src/factory/User';

}
declare module 'h5-sdk/src/functions/index.mini' {
	export * from 'h5-sdk/src/functions/common';
	export * from 'h5-sdk/src/functions/is';
	export * from 'h5-sdk/src/functions/path';
	export * from 'h5-sdk/src/functions/qs';
	export * from 'h5-sdk/src/functions/regex';
	export * from 'h5-sdk/src/functions/timeago';
	export * from 'h5-sdk/src/functions/underscore';

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
declare module 'h5-sdk/src/plugins/cloud.mini' {
	export * from 'h5-sdk/src/plugins/cloud';
	import { CloudResponse } from 'h5-sdk/src/plugins/cloud';
	export function upfile(path: string, isTempFile?: boolean): any;
	export function uptemp(path: string): Promise<CloudResponse>;

}
declare module 'h5-sdk/src/plugins/index.mini' {
	import * as safety from 'h5-sdk/src/plugins/safety';
	import store from 'h5-sdk/src/adapters/store/index';
	import * as analysis from 'h5-sdk/src/plugins/analysis';
	import * as ui from 'h5-sdk/src/adapters/ui/ui.mini';
	import * as cloud from 'h5-sdk/src/plugins/cloud.mini';
	export { cloud, safety, store, ui, analysis };

}
declare module 'h5-sdk/src/functions/index.node' {
	export * from 'h5-sdk/src/functions/common';
	export * from 'h5-sdk/src/functions/is';
	export * from 'h5-sdk/src/functions/path';
	export * from 'h5-sdk/src/functions/qs';
	export * from 'h5-sdk/src/functions/regex';
	export * from 'h5-sdk/src/functions/timeago';
	export * from 'h5-sdk/src/functions/underscore';

}
declare module 'h5-sdk/src/adapters/app/app.node' {
	export default function createAppMini(): void;

}
declare module 'h5-sdk/src/factory/index.node' {
	export { default as App } from 'h5-sdk/src/factory/App';
	export { default as Auth } from 'h5-sdk/src/factory/Auth';
	export { default as Emitter } from 'h5-sdk/src/factory/Emitter';
	export { default as Http } from 'h5-sdk/src/factory/Http';
	export { default as User } from 'h5-sdk/src/factory/User';

}
declare module 'h5-sdk/src/plugins/index.node' {
	import * as safety from 'h5-sdk/src/plugins/safety';
	import store from 'h5-sdk/src/adapters/store/index';
	export { safety, store };

}
declare module 'h5-sdk/src/factory/Res' {
	import Emitter from 'h5-sdk/src/factory/Emitter';
	export enum TYPE {
	    UNKNOWN = "none",
	    ARRAY_BUFFER = "arrayBuffer",
	    BLOB = "blob",
	    HEADERS = "headers",
	    JSON = "json",
	    TEXT = "text",
	    FORM_DATA = "formData",
	    CSS = "css",
	    JS = "js",
	    IMG = "img",
	    AUDIO = "audio",
	    VIDEO = "video"
	}
	export enum STATUS {
	    ADDED = 0,
	    LOADING = 1,
	    LOAEED = 2,
	    FAILED = 3
	}
	export class ResProgress {
	    total: number;
	    current: number;
	    pending: number;
	    loaded: number;
	    failed: number;
	    $bus: Res;
	    readonly isComplete: boolean;
	    readonly percent: number;
	    clear(): void;
	    $notify(event: IResEvent): void;
	    $added(): void;
	    $pending(): void;
	    $loaded(): void;
	    $failed(): void;
	}
	export default class Res extends Emitter {
	    static concurrency: number;
	    private static pending;
	    private static _taskList;
	    static id: number;
	    static Progress: typeof ResProgress;
	    static config: IResConfig;
	    static cache: Record<string, IResourceStruct>;
	    protected static _instance: Res;
	    static readonly instance: Res;
	    static loaders: Map<string, LoaderHandle>;
	    static registerLoader(this: any, type: string, handle: LoaderHandle): typeof Res;
	    static getLoader(type: string): LoaderHandle;
	    static get(key: string | number): IResourceStruct;
	    config: IResConfig;
	    isStart: boolean;
	    isWorking: boolean;
	    progress: ResProgress;
	    isExecuted: boolean;
	    tasks: IResourceStruct[];
	    cache: Record<string, IResourceStruct>;
	    private _onResLoaded;
	    private _onResFailed;
	    readonly isComplete: boolean;
	    constructor(option?: IResConfig);
	    start(): this;
	    pause(): this;
	    get(key: string | number): IResourceStruct;
	    add(res: IResPushStruct, option?: any): IResourceTask;
	    pushRes(res: IResourceStruct): void;
	    clear(): void;
	    private __resCb;
	}
	export type IResConfig = {
	    root?: string;
	    defaultType?: string;
	    autoStart?: boolean;
	};
	export type IResPushStruct = {
	    url: string;
	    key?: string;
	    type?: string;
	}; type LoaderHandle = (url: string, option?: any) => Promise<any>;
	export type IResourceStruct = {
	    id: number;
	    key: string;
	    url: string;
	    type: string;
	    status: STATUS;
	    data: any;
	    readonly isLoading: boolean;
	    readonly isLoaded: boolean;
	    readonly isFailed: boolean;
	    task: IResourceTask;
	    option: any;
	    error?: any;
	};
	export interface IResourceTask extends Promise<IResourceStruct> {
	    id: number;
	    exec: (a?: IResourceStruct) => void;
	}
	export type IResEvent = 'push' | 'pending' | 'success' | 'complete' | 'fail' | 'clear' | 'progress' | 'start' | 'paused';
	export {};

}
declare module 'h5-sdk/src/assets/star-loading' {
	 const _default: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64px\" height=\"64px\" viewBox=\"0 0 128 128\" x=\"64\" y=\"0\"><path d=\"M64 0L40.08 21.9a10.98 10.98 0 0 0-5.05 8.75C34.37 44.85 64 60.63 64 60.63V0z\" fill=\"#ffb118\"/><path d=\"M128 64l-21.88-23.9a10.97 10.97 0 0 0-8.75-5.05C83.17 34.4 67.4 64 67.4 64H128z\" fill=\"#80c141\"/><path d=\"M63.7 69.73a110.97 110.97 0 0 1-5.04-20.54c-1.16-8.7.68-14.17.68-14.17h38.03s-4.3-.86-14.47 10.1c-3.06 3.3-19.2 24.58-19.2 24.58z\" fill=\"#cadc28\"/><path d=\"M64 128l23.9-21.88a10.97 10.97 0 0 0 5.05-8.75C93.6 83.17 64 67.4 64 67.4V128z\" fill=\"#cf171f\"/><path d=\"M58.27 63.7a110.97 110.97 0 0 1 20.54-5.04c8.7-1.16 14.17.68 14.17.68v38.03s.86-4.3-10.1-14.47c-3.3-3.06-24.58-19.2-24.58-19.2z\" fill=\"#ec1b21\"/><path d=\"M0 64l21.88 23.9a10.97 10.97 0 0 0 8.75 5.05C44.83 93.6 60.6 64 60.6 64H0z\" fill=\"#018ed5\"/><path d=\"M64.3 58.27a110.97 110.97 0 0 1 5.04 20.54c1.16 8.7-.68 14.17-.68 14.17H30.63s4.3.86 14.47-10.1c3.06-3.3 19.2-24.58 19.2-24.58z\" fill=\"#00bbf2\"/><path d=\"M69.73 64.34a111.02 111.02 0 0 1-20.55 5.05c-8.7 1.14-14.15-.7-14.15-.7V30.65s-.86 4.3 10.1 14.5c3.3 3.05 24.6 19.2 24.6 19.2z\" fill=\"#f8f400\"/><circle cx=\"64\" cy=\"64\" r=\"2.03\"/></svg>";
	export default _default;

}
declare module 'h5-sdk/src/factory/UiMusic' {
	/// <reference types="zepto" />
	import 'h5-sdk/src/assets/ui-music.less';
	import Emitter from 'h5-sdk/src/factory/Emitter';
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
	export default class UiMusic extends Emitter {
	    static _instance: UiMusic;
	    static readonly instance: UiMusic;
	    static readonly hasInstance: boolean;
	    static createInstance(option: IUiMusicOption): UiMusic;
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
	    destory(): void;
	    private _handleEvent;
	    addTimeline(name: string, timeline: IUiMusicTimeline): void;
	    private _unbindTimeupdate;
	    gotoAndPlay(name: string, callback?: Function): void;
	}
	export {};

}
declare module 'h5-sdk/src/venders/index' {
	/// <reference types="zepto" />
	export const $: ZeptoStatic;
	export const Zepto: ZeptoStatic;

}
declare module 'h5-sdk/src/factory/UiToast' {
	/// <reference types="zepto" />
	import 'h5-sdk/src/assets/ui-toast.less';
	import UiBase, { UiBaseOption } from 'h5-sdk/src/factory/UiBase';
	export type UiToastOption = UiBaseOption & {
	    icon?: string;
	    message?: string;
	    clickClosed?: boolean;
	    onClick?: (this: UiToast, instance: UiToast) => void;
	};
	export default class UiToast extends UiBase {
	    static option: UiToastOption;
	    $header?: ZeptoCollection;
	    $body?: ZeptoCollection;
	    $message: ZeptoCollection;
	    constructor(_option: UiToastOption);
	    setMessage(message: string): this;
	    setIcon(icon: string): this;
	    private _openHook;
	    private _closedHook;
	}

}
declare module 'h5-sdk/src/factory/UiView' {
	/// <reference types="zepto" />
	import 'h5-sdk/src/assets/ui-view.less';
	import UiBase, { UiBaseOption } from 'h5-sdk/src/factory/UiBase';
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
declare module 'h5-sdk/src/adapters/ui/ui.web' {
	import UiModal, { UiModalOption } from 'h5-sdk/src/factory/UiModal';
	import UiToast from 'h5-sdk/src/factory/UiToast';
	import UiMusic, { IUiMusicOption } from 'h5-sdk/src/factory/UiMusic';
	import UiView, { UiViewOption } from 'h5-sdk/src/factory/UiView';
	import { IUiAlertOption, IUiConfirmOption, IUiPromptOption, IUiUserboxOption } from 'h5-sdk/src/adapters/ui/interface';
	export function close(fn?: any): (modal: UiModal) => any;
	export function modal(option: UiModalOption): UiModal;
	export function alert(option: IUiAlertOption | string): UiModal;
	export function confirm(option: IUiConfirmOption): UiModal;
	export function prompt(option: IUiPromptOption | string): UiModal;
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
declare module 'h5-sdk/src/plugins/ui' {
	export * from 'h5-sdk/src/adapters/ui/ui.web';

}
declare module 'h5-sdk/src/plugins/cloud.web' {
	import { CloudResponse } from 'h5-sdk/src/plugins/cloud';
	export * from 'h5-sdk/src/plugins/cloud';
	export function wxmedia(media_id: string): Promise<CloudResponse>;
	export function upfile(file: File, isTempFile?: boolean): Promise<CloudResponse>;
	export function uptemp(file: File): Promise<CloudResponse>;

}
declare module 'h5-sdk/src/plugins/wechat' {
	export function getQrcode(username: string): string;
	export function shorturl(url: string, appid?: string): Promise<string>;

}
declare module 'h5-sdk/src/plugins/index' {
	import * as jssdk from 'h5-sdk/src/plugins/jssdk';
	import * as ui from 'h5-sdk/src/plugins/ui';
	import * as safety from 'h5-sdk/src/plugins/safety';
	import * as tool from 'h5-sdk/src/plugins/tool';
	import * as cloud from 'h5-sdk/src/plugins/cloud.web';
	import * as analysis from 'h5-sdk/src/plugins/analysis';
	import * as wechat from 'h5-sdk/src/plugins/wechat';
	export { default as store } from 'h5-sdk/src/adapters/store/index';
	export { jssdk, ui, safety, tool, cloud, analysis, wechat };

}
declare module 'h5-sdk/src/adapters/app/app.web' {
	export default function createAppWeb(): void;

}
declare module 'h5-sdk/src/factory/index' {
	export { default as App } from 'h5-sdk/src/factory/App';
	export { default as Emitter } from 'h5-sdk/src/factory/Emitter';
	export { default as Http } from 'h5-sdk/src/factory/Http';
	export { default as Auth } from 'h5-sdk/src/factory/Auth';
	export { default as Res } from 'h5-sdk/src/factory/Res';
	export { default as Tasker } from 'h5-sdk/src/factory/Tasker';
	export { default as UiBase } from 'h5-sdk/src/factory/UiBase';
	export { default as UiMusic } from 'h5-sdk/src/factory/UiMusic';
	export { default as UiModal } from 'h5-sdk/src/factory/UiModal';
	export { default as UiToast } from 'h5-sdk/src/factory/UiToast';
	export { default as UiView } from 'h5-sdk/src/factory/UiView';
	export { default as User } from 'h5-sdk/src/factory/User';

}
declare module 'h5-sdk/src/web-entry' {
	import 'h5-sdk/src/assets/common.less';
	import 'h5-sdk/src/assets/icon.less';
	import 'h5-sdk/src/polyfill/index';
	export const version = "__VERSION__";
	export * from 'h5-sdk/src/config';
	export * from 'h5-sdk/src/functions/index';
	export * from 'h5-sdk/src/venders/index';
	export * from 'h5-sdk/src/plugins/index';
	export * from 'h5-sdk/src/factory/index';
	import 'h5-sdk/src/scheduler/index';

}
declare module 'h5-sdk/src/adapters/app/index' {
	 const _default: {};
	export default _default;

}
declare module 'h5-sdk/src/adapters/ui/ui.node' {
	export function preloader(): void;
	export function loading(): void;

}
declare module 'h5-sdk/src/functions/common.spec' {
	export {};

}
declare module 'h5-sdk/src/functions/is.spec' {
	export {};

}
declare module 'h5-sdk/src/functions/path.spec' {
	export {};

}
declare module 'h5-sdk/src/functions/qs.spec' {
	export {};

}
declare module 'h5-sdk' {
	import main = require('h5-sdk/src/web-entry');
	export = main;
}
