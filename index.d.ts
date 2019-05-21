/// <reference types="zepto" />
/// <reference types="store" />
/// <reference types="blueimp-md5" />
declare module 'h5-sdk/src/plugins/store' {
	export const store: StoreAPI;
	interface StoreAPI {
	    readonly version: string;
	    readonly enabled: boolean;
	    get(key: string, optionalDefaultValue?: any): any;
	    set(key: string, value: any): any;
	    remove(key: string): void;
	    each(callback: (val: any, namespacedKey: string) => void): void;
	    clearAll(): void;
	    hasNamespace(namespace: string): boolean;
	    createStore(plugins?: Function[], namespace?: string): StoreAPI;
	    addPlugin(plugin: Function): void;
	    namespace(namespace: string): StoreAPI;
	}
	export {};

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
declare module 'h5-sdk/src/functions/common' {
	export function camelize(str: string): string;
	export function noop(): void;
	export function alway(val: any): any;
	export function dasherize(str: string): string;
	export function wait<T>(ms: number, arg?: T): Promise<T>;
	export function uid(prefix?: string): string;
	export function uuid(): string;
	export function randomstr(len?: number): string;

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
declare module 'h5-sdk/src/factory/Http' {
	export type CommonResponseData = {
	    code: number;
	    data: any;
	    message: string;
	    msg?: string;
	};
	export interface HttpRequestBase {
	    method?: 'GET' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH';
	    headers?: HeadersInit;
	    body?: any;
	    mode?: 'cors' | 'no-cors' | 'same-origin';
	    cache?: RequestCache;
	    credentials?: RequestCredentials;
	    redirect?: RequestRedirect;
	    referrer?: ' no-referrer' | 'client';
	}
	export interface HttpOption extends HttpRequestBase {
	    baseURL?: string;
	    timeout?: number;
	    transformRequest?: (arg: TransformRequestOption) => any;
	    transformResponse?: (res: Response) => any;
	    responseType?: 'arrayBuffer' | 'blob' | 'formData' | 'json' | 'text';
	    validateStatus?: (status: number) => boolean;
	}
	export interface TransformRequestOption extends RequestInit {
	    url: string;
	}
	export interface HttpRequestOption extends HttpRequestBase {
	    url: string;
	    params?: any;
	    data?: any;
	}
	export default class Http {
	    static option: HttpOption;
	    private static _instance;
	    static readonly instance: Http;
	    option: HttpOption;
	    constructor(_option?: HttpOption);
	    get(url: string, params?: any): Promise<any>;
	    delete(url: string, params?: any): Promise<any>;
	    head(url: string, params?: any): Promise<any>;
	    options(url: string, params?: any): Promise<any>;
	    post(url: string, data?: any): Promise<any>;
	    put(url: string, data?: any): Promise<any>;
	    patch(url: string, data?: any): Promise<any>;
	    request(option: HttpRequestOption): Promise<any>;
	}

}
declare module 'h5-sdk/src/utils/global' {
	export const location: Location;
	export const document: Document;
	export const getwx: () => any;
	export const isWxMini: () => boolean;
	export const fetch: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>;
	export const WeixinJSBridge: any;
	export const addEventListener: {
	    <K extends "error" | "mouseover" | "mouseout" | "input" | "progress" | "select" | "scroll" | "touchstart" | "touchend" | "touchmove" | "touchcancel" | "pointerdown" | "pointerup" | "pointermove" | "pointercancel" | "MSPointerDown" | "MSPointerUp" | "MSPointerMove" | "MSPointerCancel" | "MSGestureEnd" | "abort" | "afterprint" | "beforeprint" | "beforeunload" | "blur" | "canplay" | "canplaythrough" | "change" | "click" | "compassneedscalibration" | "contextmenu" | "dblclick" | "devicelight" | "devicemotion" | "deviceorientation" | "drag" | "dragend" | "dragenter" | "dragleave" | "dragover" | "dragstart" | "drop" | "durationchange" | "emptied" | "ended" | "focus" | "hashchange" | "invalid" | "keydown" | "keypress" | "keyup" | "load" | "loadeddata" | "loadedmetadata" | "loadstart" | "message" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseup" | "mousewheel" | "MSGestureChange" | "MSGestureDoubleTap" | "MSGestureHold" | "MSGestureStart" | "MSGestureTap" | "MSInertiaStart" | "MSPointerEnter" | "MSPointerLeave" | "MSPointerOut" | "MSPointerOver" | "offline" | "online" | "orientationchange" | "pagehide" | "pageshow" | "pause" | "play" | "playing" | "popstate" | "ratechange" | "readystatechange" | "reset" | "resize" | "seeked" | "seeking" | "stalled" | "storage" | "submit" | "suspend" | "timeupdate" | "unload" | "volumechange" | "vrdisplayactivate" | "vrdisplayblur" | "vrdisplayconnect" | "vrdisplaydeactivate" | "vrdisplaydisconnect" | "vrdisplayfocus" | "vrdisplaypointerrestricted" | "vrdisplaypointerunrestricted" | "vrdisplaypresentchange" | "waiting" | "animationcancel" | "animationend" | "animationiteration" | "animationstart" | "auxclick" | "cancel" | "close" | "cuechange" | "dragexit" | "gotpointercapture" | "loadend" | "lostpointercapture" | "pointerenter" | "pointerleave" | "pointerout" | "pointerover" | "securitypolicyviolation" | "toggle" | "transitioncancel" | "transitionend" | "transitionrun" | "transitionstart" | "wheel" | "languagechange" | "messageerror" | "rejectionhandled" | "unhandledrejection">(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): void;
	    (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): void;
	};
	export const removeEventListener: {
	    <K extends "error" | "mouseover" | "mouseout" | "input" | "progress" | "select" | "scroll" | "touchstart" | "touchend" | "touchmove" | "touchcancel" | "pointerdown" | "pointerup" | "pointermove" | "pointercancel" | "MSPointerDown" | "MSPointerUp" | "MSPointerMove" | "MSPointerCancel" | "MSGestureEnd" | "abort" | "afterprint" | "beforeprint" | "beforeunload" | "blur" | "canplay" | "canplaythrough" | "change" | "click" | "compassneedscalibration" | "contextmenu" | "dblclick" | "devicelight" | "devicemotion" | "deviceorientation" | "drag" | "dragend" | "dragenter" | "dragleave" | "dragover" | "dragstart" | "drop" | "durationchange" | "emptied" | "ended" | "focus" | "hashchange" | "invalid" | "keydown" | "keypress" | "keyup" | "load" | "loadeddata" | "loadedmetadata" | "loadstart" | "message" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseup" | "mousewheel" | "MSGestureChange" | "MSGestureDoubleTap" | "MSGestureHold" | "MSGestureStart" | "MSGestureTap" | "MSInertiaStart" | "MSPointerEnter" | "MSPointerLeave" | "MSPointerOut" | "MSPointerOver" | "offline" | "online" | "orientationchange" | "pagehide" | "pageshow" | "pause" | "play" | "playing" | "popstate" | "ratechange" | "readystatechange" | "reset" | "resize" | "seeked" | "seeking" | "stalled" | "storage" | "submit" | "suspend" | "timeupdate" | "unload" | "volumechange" | "vrdisplayactivate" | "vrdisplayblur" | "vrdisplayconnect" | "vrdisplaydeactivate" | "vrdisplaydisconnect" | "vrdisplayfocus" | "vrdisplaypointerrestricted" | "vrdisplaypointerunrestricted" | "vrdisplaypresentchange" | "waiting" | "animationcancel" | "animationend" | "animationiteration" | "animationstart" | "auxclick" | "cancel" | "close" | "cuechange" | "dragexit" | "gotpointercapture" | "loadend" | "lostpointercapture" | "pointerenter" | "pointerleave" | "pointerout" | "pointerover" | "securitypolicyviolation" | "toggle" | "transitioncancel" | "transitionend" | "transitionrun" | "transitionstart" | "wheel" | "languagechange" | "messageerror" | "rejectionhandled" | "unhandledrejection">(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | EventListenerOptions | undefined): void;
	    (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions | undefined): void;
	};
	export const performance: Performance;

}
declare module 'h5-sdk/src/utils/shared' {
	/// <reference types="zepto" />
	import { CommonResponseData } from 'h5-sdk/src/factory/Http';
	export function nextZIndex(): number;
	export function classPrefix(className: string | any[]): string;
	export function createSdkIcon(name: string): string;
	export function createClsElement(className: string, content?: string | ZeptoCollection, tagName?: string): ZeptoCollection;
	export function onceAnimationEnd($element: ZeptoCollection, callback: any): any;
	export function getElementAttrs(element: HTMLElement | ZeptoCollection, attrs: string[]): {
	    [key: string]: any;
	};
	export function commonResponseReslove(response: CommonResponseData): Promise<Error> | Promise<any>;
	export const assign: {
	    <T, U>(target: T, source: U): T & U;
	    <T, U, V>(target: T, source1: U, source2: V): T & U & V;
	    <T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
	    (target: object, ...sources: any[]): any;
	};
	export function getCurrentHref(isPrivacy?: boolean | string[]): string;
	export function getCurrentPathFile(filename?: string): string;

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
declare module 'h5-sdk/src/factory/UiBase' {
	/// <reference types="zepto" />
	import Emitter from 'h5-sdk/src/factory/Emitter';
	export type TypeColor = 'dark' | 'main' | 'primary' | 'warn' | 'info';
	export type UiTheme = 'android' | 'ios';
	export type UiBaseOption = {
	    id?: string;
	    theme?: UiTheme;
	    isAddMask?: boolean;
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
	    showSpinning(message: string): this;
	    hideSpinning(): this;
	    private _openHook;
	    private _closedHook;
	}

}
declare module 'h5-sdk/src/factory/User' {
	export type UserState = 'unknow' | 'normal' | 'black' | 'admin' | 'super' | 'developer';
	export type UserPlatform = 'unknow' | 'wechat' | 'qq' | 'taobao' | 'weibo' | 'douyin' | 'github' | 'google' | 'linkedin' | 'facebook' | 'open' | 'mini';
	export type UserType = 'none' | 'base' | 'user';
	export default class User {
	    private static cacheKey;
	    private static _instance;
	    static readonly instance: User;
	    isLogin: boolean;
	    id: number;
	    platform: UserPlatform;
	    appid: string;
	    nickname: string;
	    avatar: string;
	    openid: string;
	    state: UserState;
	    gender: number;
	    email: string;
	    username: string;
	    userType: UserType;
	    location: string;
	    unionid: string;
	    constructor(user?: any);
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
	    isDone: boolean;
	    task: Promise<any>;
	    private _nativeResolve;
	    private _nativeReject;
	    constructor();
	    resolve(val: any): Promise<any>;
	    reject(err: any): Promise<any>;
	    then(onfulfilled: any, onrejected: any): Promise<any>;
	}

}
declare module 'h5-sdk/src/factory/Oauth' {
	import User, { UserState, UserPlatform, UserType } from 'h5-sdk/src/factory/User';
	import Tasker from 'h5-sdk/src/factory/Tasker';
	interface OauthOption {
	    platform: UserPlatform;
	    appid: string;
	    type?: UserType;
	    url?: string;
	    scope?: string;
	    env?: string;
	}
	export default class Oauth {
	    static option: OauthOption;
	    static cacheKey: string;
	    private static _instance;
	    static readonly instance: Oauth;
	    static getInstance(): Oauth;
	    tasker: Tasker;
	    id: number;
	    user: User;
	    state: UserState;
	    type: UserType;
	    option: OauthOption;
	    platform: UserPlatform;
	    appid: string;
	    scope: string;
	    env: string;
	    url: string;
	    private _accessToken;
	    isAccessTokenValid: boolean;
	    accessToken: string | null;
	    saveToken(token: string): void;
	    setOption(option: OauthOption): this;
	    init(option: OauthOption): Promise<User | any>;
	    redirect(_url?: string): void;
	    refreshUser(): Promise<User | null>;
	    login(): Promise<boolean | User>;
	}
	export {};

}
declare module 'h5-sdk/src/factory/App' {
	import Http from 'h5-sdk/src/factory/Http';
	import Oauth from 'h5-sdk/src/factory/Oauth';
	import User from 'h5-sdk/src/factory/User';
	export default class App {
	    private static cacheKey;
	    private static _instance;
	    static readonly instance: App;
	    static errorHandler: errorHandler;
	    static getInstance(option?: AppOption): App;
	    readonly isLogin: boolean;
	    isInited: boolean;
	    http: Http;
	    oauth: Oauth;
	    user: User;
	    private tasker;
	    appid: string;
	    version: string;
	    config: AppServerConfig;
	    setting: AppServerSetting;
	    constructor(app: AppOption);
	    ready(fn?: any): Promise<any>;
	    private setup;
	    private setServer;
	    post(action: string, data?: any): any;
	    put(action: string, data?: any): any;
	    get(action: string, query?: any): any;
	    delete(action: string, query?: any): any;
	    action(action: string, param?: any, method?: string): any;
	} type AppServerConfig = {
	    id: number;
	    name: string;
	    oauth: string;
	    appid: string;
	    endtime: number;
	    starttime: number;
	    status: string;
	}; type AppServerSetting = Record<string, any>;
	export type AppServerInit = {
	    api: {
	        [module: string]: string[];
	    };
	    config: AppServerConfig;
	    setting: AppServerSetting;
	    version: string;
	};
	export type AppOption = {
	    appid: string;
	    version: string;
	}; type TypeAction = {
	    method: string;
	    action: string;
	    param: any;
	}; type errorHandler = (err: Error, action: TypeAction, vm: App) => void;
	export {};

}
declare module 'h5-sdk/src/functions/helper' {
	export function addListener(element: HTMLElement | Document, event: string, callback: EventListener): Function;
	export const domready: Promise<boolean>;

}
declare module 'h5-sdk/src/plugins/analysis' {
	export type AnalysisOption = {
	    disabled: boolean;
	    maxReportError: number;
	    beforeLoadTime: number;
	    unloadData: any;
	};
	export const config: AnalysisOption;
	export function pv(): Promise<void>;
	export function event(event: string, data?: string, value?: number): Promise<void>;
	export function error(error: Error): false | Promise<void> | undefined;

}
declare module 'h5-sdk/src/config' {
	import { AnalysisOption } from 'h5-sdk/src/plugins/analysis';
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
	    static pending: number;
	    total: number;
	    current: number;
	    pending: number;
	    loaded: number;
	    failed: number;
	    $bus: Res;
	    readonly isComplete: boolean;
	    clear(): void;
	    $notify(event: ResEvent): void;
	    $added(): void;
	    $pending(): void;
	    $loaded(): void;
	    $failed(): void;
	}
	export default class Res extends Emitter {
	    static id: number;
	    static Progress: typeof ResProgress;
	    static config: ResConfig;
	    static cache: Record<string, ResouceStruct>;
	    protected static _instance: Res;
	    static readonly instance: Res;
	    static loaders: Map<string, LoaderHandle>;
	    static registerLoader(this: any, type: string, handle: LoaderHandle): typeof Res;
	    static getLoader(type: string): LoaderHandle;
	    static get(key: string | number): ResouceStruct;
	    config: ResConfig;
	    isStart: boolean;
	    isWorking: boolean;
	    progress: ResProgress;
	    queue: ResouceStruct[];
	    cache: Record<string, ResouceStruct>;
	    readonly isComplete: boolean;
	    constructor(option?: ResConfig);
	    start(): this;
	    pause(): this;
	    get(key: string | number): ResouceStruct;
	    add(res: PushResStruct, option?: any): ResourceTask;
	    private $working;
	} type ResConfig = {
	    concurrency?: number;
	    root?: string;
	    defaultType?: string;
	    autoStart?: boolean;
	}; type PushResStruct = {
	    url: string;
	    key?: string;
	    type?: string;
	}; type LoaderHandle = (url: string, option?: any) => Promise<any>; type ResouceStruct = {
	    id: number;
	    key: string;
	    url: string;
	    type: string;
	    status: STATUS;
	    data: any;
	    readonly isLoading: boolean;
	    readonly isLoaded: boolean;
	    readonly isFailed: boolean;
	    task: ResourceTask;
	    option: any;
	    error?: any;
	};
	interface ResourceTask extends Promise<ResouceStruct> {
	    id: number;
	    exec: (a?: ResouceStruct) => void;
	}
	export type ResEvent = 'push' | 'pending' | 'success' | 'complete' | 'fail' | 'clear' | 'progress' | 'start' | 'paused';
	export {};

}
declare module 'h5-sdk/src/assets/star-loading' {
	 const _default: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"64px\" height=\"64px\" viewBox=\"0 0 128 128\" x=\"64\" y=\"0\"><path d=\"M64 0L40.08 21.9a10.98 10.98 0 0 0-5.05 8.75C34.37 44.85 64 60.63 64 60.63V0z\" fill=\"#ffb118\"/><path d=\"M128 64l-21.88-23.9a10.97 10.97 0 0 0-8.75-5.05C83.17 34.4 67.4 64 67.4 64H128z\" fill=\"#80c141\"/><path d=\"M63.7 69.73a110.97 110.97 0 0 1-5.04-20.54c-1.16-8.7.68-14.17.68-14.17h38.03s-4.3-.86-14.47 10.1c-3.06 3.3-19.2 24.58-19.2 24.58z\" fill=\"#cadc28\"/><path d=\"M64 128l23.9-21.88a10.97 10.97 0 0 0 5.05-8.75C93.6 83.17 64 67.4 64 67.4V128z\" fill=\"#cf171f\"/><path d=\"M58.27 63.7a110.97 110.97 0 0 1 20.54-5.04c8.7-1.16 14.17.68 14.17.68v38.03s.86-4.3-10.1-14.47c-3.3-3.06-24.58-19.2-24.58-19.2z\" fill=\"#ec1b21\"/><path d=\"M0 64l21.88 23.9a10.97 10.97 0 0 0 8.75 5.05C44.83 93.6 60.6 64 60.6 64H0z\" fill=\"#018ed5\"/><path d=\"M64.3 58.27a110.97 110.97 0 0 1 5.04 20.54c1.16 8.7-.68 14.17-.68 14.17H30.63s4.3.86 14.47-10.1c3.06-3.3 19.2-24.58 19.2-24.58z\" fill=\"#00bbf2\"/><path d=\"M69.73 64.34a111.02 111.02 0 0 1-20.55 5.05c-8.7 1.14-14.15-.7-14.15-.7V30.65s-.86 4.3 10.1 14.5c3.3 3.05 24.6 19.2 24.6 19.2z\" fill=\"#f8f400\"/><circle cx=\"64\" cy=\"64\" r=\"2.03\"/></svg>";
	export default _default;

}
declare module 'h5-sdk/src/functions/environment' {
	export const isMobile: boolean;
	export const isIos: boolean;
	export const isAndroid: boolean;
	export const isWechat: boolean;
	export function checkSupportWebp(): Promise<boolean>;

}
declare module 'h5-sdk/src/plugins/jssdk' {
	import 'h5-sdk/src/polyfill/jweixin-1.5.0';
	import Emitter from 'h5-sdk/src/factory/Emitter'; type WxConfigOption = {
	    url: string;
	    debug?: boolean;
	    appid?: string;
	    jsApiList: [];
	};
	interface ConfigResponse extends WxConfigOption {
	    timestamp: string;
	    nonceStr: string;
	    signature: string;
	}
	interface ShareOption {
	    type?: '*' | 'timeline' | 'wxapp' | 'mini';
	    title?: string;
	    desc?: string;
	    link?: string;
	    img?: string;
	    banner?: string;
	    imgurl?: string;
	    imgUrl?: string;
	    config?: string;
	    success?: Function;
	} type WxEventType = 'beforeConfig' | 'config' | 'share' | 'updateShare' | 'error' | 'ready';
	export const defaultJsApiList: string[];
	export const emitter: Emitter;
	export const on: (type: WxEventType, callback: EventHandlerNonNull) => () => Emitter;
	export function ready(fn: Function): void;
	export function config(option?: WxConfigOption): Promise<ConfigResponse>;
	export function fire(resolve: Function): void;
	export function getAppid(): string;
	export function share(option?: ShareOption): any;
	export function chooseImageBase64(): Promise<string>;
	export function preview(url: string | string[], index?: number): void;
	export function api(apiName: string, option?: any): Promise<any>;
	export {};

}
declare module 'h5-sdk/src/factory/UiMusic' {
	/// <reference types="zepto" />
	import 'h5-sdk/src/assets/ui-music.less';
	import Emitter from 'h5-sdk/src/factory/Emitter';
	export interface UiMusicOption {
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
	interface UiMusicTheme {
	    playing: string | Function;
	    paused: string | Function;
	    loading?: string | Function;
	}
	interface UiMusicTimeline {
	    begin: number;
	    end: number;
	    loop?: boolean;
	}
	export default class UiMusic extends Emitter {
	    static _instance: UiMusic;
	    static readonly instance: UiMusic;
	    static getInstance(option: UiMusicOption): UiMusic;
	    static option: UiMusicOption;
	    static themes: Map<any, any>;
	    static registerTheme(themeName: any, adapter: UiMusicTheme | number[]): Map<string, UiMusicTheme>;
	    timelines: Record<string, UiMusicTimeline>;
	    option: UiMusicOption;
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
	    constructor(_option: UiMusicOption);
	    currentTime: number;
	    readonly theme: UiMusicTheme;
	    isLoading: boolean;
	    isPaused: boolean;
	    isPlaying: boolean;
	    load(src?: string): this;
	    play: () => this;
	    pause: () => void;
	    replay: () => void;
	    destory(): void;
	    private _handleEvent;
	    addTimeline(name: string, timeline: UiMusicTimeline): void;
	    private _unbindTimeupdate;
	    gotoAndPlay(name: string, callback?: Function): void;
	}
	export {};

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
	export * from 'h5-sdk/src/functions/path';
	export * from 'h5-sdk/src/functions/qs';
	export * from 'h5-sdk/src/functions/regex';
	export * from 'h5-sdk/src/functions/timeago';
	export * from 'h5-sdk/src/functions/underscore';

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
	    type: 'image' | 'preloader';
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
declare module 'h5-sdk/src/plugins/ui' {
	import UiModal, { UiModalOption } from 'h5-sdk/src/factory/UiModal';
	import UiToast from 'h5-sdk/src/factory/UiToast';
	import UiMusic, { UiMusicOption } from 'h5-sdk/src/factory/UiMusic';
	import UiView, { UiViewOption } from 'h5-sdk/src/factory/UiView';
	import { UiInputType } from 'h5-sdk/src/factory/UiBase';
	export function modal(option: UiModalOption): UiModal;
	interface UiAlertOption extends UiModalOption {
	    href?: string;
	    okText?: string;
	    ok?: Function;
	}
	export function alert(option: UiAlertOption | string): UiModal;
	interface UiConfirmOption extends UiAlertOption {
	    noText?: string;
	    no?: Function;
	}
	export function confirm(option: UiConfirmOption): UiModal;
	interface UiPromptOption extends UiConfirmOption {
	    type?: UiInputType;
	    defaultValue?: string;
	    placeholder?: string;
	}
	export function prompt(option: UiPromptOption | string): UiModal; type UserProfileType = 'username' | 'mobile' | 'password' | 'address' | 'hidden';
	interface UiUserboxOption extends UiConfirmOption {
	    title: string;
	    profile: UserProfileType[];
	}
	export function userbox(option: UiUserboxOption): UiModal;
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
	export function music(option: string | UiMusicOption): UiMusic;
	export {};

}
declare module 'h5-sdk/src/plugins/tool' {
	export function onShake(callback: Function): false | (() => void);
	export function readAsDataURL(inputer: File): Promise<string>;
	export function chooseFile(accept?: string): Promise<File>;
	export function chooseImageAsDataURL(): Promise<string>;
	export function autoGetImageBase64(): Promise<string>;

}
declare module 'h5-sdk/src/plugins/cloud' {
	export function service(serviceName: string, opt: any, method?: 'get' | 'post'): Promise<any>;
	export function upbase64(base64: string): Promise<CloudResponse>;
	export function upfile(file: File): Promise<CloudResponse>;
	export function syncurl(url: string): Promise<CloudResponse>;
	export function syncimage(url: string): Promise<CloudResponse>;
	export function wxmedia(media_id: string): Promise<CloudResponse>;
	export function headfile(key: string): Promise<CloudResponse>;
	export function proxy(option: ProxyOption): Promise<any>;
	export function amr2mp3(input: string, kbs?: number): Promise<CloudResponse>; type CloudResponse = {
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
declare module 'h5-sdk/src/plugins/wechat' {
	export function getQrcode(username: string): string;
	export function shorturl(url: string, appid?: string): Promise<string>;

}
declare module 'h5-sdk/src/plugins/index' {
	import * as jssdk from 'h5-sdk/src/plugins/jssdk';
	import * as ui from 'h5-sdk/src/plugins/ui';
	import * as safety from 'h5-sdk/src/plugins/safety';
	import * as tool from 'h5-sdk/src/plugins/tool';
	import * as cloud from 'h5-sdk/src/plugins/cloud';
	import * as analysis from 'h5-sdk/src/plugins/analysis';
	import * as wechat from 'h5-sdk/src/plugins/wechat';
	export { store } from 'h5-sdk/src/plugins/store';
	export { jssdk, ui, safety, tool, cloud, analysis, wechat };

}
declare module 'h5-sdk/src/factory/index' {
	export { default as App } from 'h5-sdk/src/factory/App';
	export { default as Emitter } from 'h5-sdk/src/factory/Emitter';
	export { default as Http } from 'h5-sdk/src/factory/Http';
	export { default as Oauth } from 'h5-sdk/src/factory/Oauth';
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
declare module 'h5-sdk' {
	import main = require('h5-sdk/src/web-entry');
	export = main;
}
