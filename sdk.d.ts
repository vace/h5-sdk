/*!
 * @overview h5-sdk@4.0.3 2021/1/20 下午6:46:28
 * @copyright (c) 2018-present, MaQu, Inc.
 * @authors Vace<i@ahmq.net>
 * @license Released under the MIT License.
 */

declare namespace sdk {
const AuthSymbol: unique symbol;
/**
 * 用户类
 */
class AuthUser {
    /** 用户资料刷新时间 */
    static REFRESH_TIME: number;
    /** 用户登录时间 */
    private $logintime;
    /** 用户ID */
    id: number;
    /** 当前平台 */
    platform: string;
    /** 授权用户appid */
    appid: string;
    /** 用户昵称 */
    nickname: string;
    /** 用户头像 */
    avatar: string;
    /** 用户OPENID */
    openid: string;
    /** 用户状态 */
    state: string;
    /** 性别，0未知，1男，2女 */
    gender: number;
    /** 用户邮箱 */
    email: string;
    /** 用户名 */
    username: string;
    /** 用户类型 */
    type: string;
    /** 用户地理位置 */
    location: string;
    /** 同一主体下的ID */
    unionid: string;
    /** 绑定的auth实例 */
    private [AuthSymbol];
    /** 原始数据 */
    get data(): any;
    /** 缓存key */
    get $key(): string;
    /** 是否登录 */
    get isLogin(): boolean;
    /** 需要刷新资料 */
    get needRefreshed(): boolean;
    /** 实例化auth用户 */
    constructor(auth: Auth);
    /** 重置用户资料 */
    reset(user: any): void;
    /** 登录用户 */
    login(user: any): this;
    /** 登出用户 */
    logout(): void;
}

interface ITaskerPromise<T> extends Promise<T> {
    resolve(val: T): Promise<T>;
    reject(err?: Error): Promise<T>;
}
/**
 * 创建一个同步promise任务，在需要时手动resolve
 * @example
 * var task = sdk.tasker()
 * task.then(console.log)
 * task.resolve(data)
 */
function tasker<T>(): ITaskerPromise<T>;

type AuthOnRedirectLogin = (url: string, reason: AuthError) => AuthUser;
class AuthError extends Error {
    code: number;
    data: any;
    constructor(code: number, message: string, data?: any);
}
/**
 * Auth 授权
 */
class Auth extends Http {
    /** 导出用户类 */
    static AuthUser: typeof AuthUser;
    /** 导出授权错误类 */
    static AuthError: typeof AuthError;
    /** 用户Auth实例，使用时生成 */
    static instance: Auth;
    /** 用户实例 */
    user: AuthUser;
    /** Auth版本号，可修改version强制重新授权 */
    version: string;
    /** 用户角色 */
    state: string;
    /** 授权种类 */
    type: string;
    /** 授权配置 */
    httpconf: any;
    /** 当前应用所在平台 */
    platform: string;
    /** 当前应用appid */
    appid: string;
    /** 当前应用scope */
    scope: string;
    /** 当前环境 */
    env: string;
    /** 回调url */
    url: string;
    /** 自定义redirect方法 */
    onRedirectLogin: AuthOnRedirectLogin;
    /** 仅在子类中使用 */
    protected $tryUseAuth: boolean;
    /** 读取当前缓存key */
    get $key(): string;
    /** 用户ID */
    get id(): number;
    /** 用户是否登录 */
    get isLogin(): boolean;
    /** 读取当前的token */
    get token(): string;
    /** 读取jwt信息 */
    get jwt(): any;
    /** 读取token是否有效 */
    get isTokenValid(): boolean;
    /**
     * 实例化Auth，只有一个实例可通过Auth.instance获取
     * @param options 初始化Auth
     */
    constructor(options: any);
    /** 登陆任务 */
    finished: ITaskerPromise<AuthUser>;
    /** 登陆用户 */
    login(): Promise<AuthUser>;
    /** 授权用户 */
    authorize(arg: any): Promise<AuthUser>;
    /** 刷新用户资料 */
    refresh(): Promise<AuthUser>;
    /** 更新用户token */
    saveToken(token: string): void;
    /** 要求用户登出 */
    logout(): void;
    /** 尝试使用现有参数登陆 */
    autoLogin(): Promise<AuthUser>;
    /** 跳转到登录页或自行处理逻辑 */
    redirectLogin(reason: AuthError): AuthUser;
    /** 跳转到登陆 */
    doLogin(loginApi: string, query: any): Promise<AuthUser>;
    /** 转换配置参数，子类可覆盖实现 */
    transformAuthOptions: <T>(val: T) => T;
    /** 全局请求转换 */
    transformAuthRequest(config: any): any;
    /** 全局auth参数接收 */
    onAuthHeadersReceived(header: Headers): void;
    /** 转换用户登陆请求 */
    transformAuthResponse(response: any): AuthUser;
}

const HttpMessage: unique symbol;
const HttpCache: unique symbol;
/** 请求格式 */
type HttpRequestOption = string | IHttpRequestOption;
/** ui提示逻辑 */
type HttpNofifyCallback = (message: string, data: any) => any;
/** 可用方法签名 */
enum HttpMethod {
    GET = "GET",
    DELETE = "DELETE",
    HEAD = "HEAD",
    OPTIONS = "OPTIONS",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    JSONP = "JSONP"
}
type SendRequest = (url: HttpRequestOption, query?: any, options?: any) => Promise<any>;
/**
 * http抛出的错误类
 */
class HttpError extends Error {
    /** 错误代码 */
    code: number;
    /** 携带的错误数据 */
    data: any;
    /** 请求类 */
    request?: Http;
    /** 响应结果 */
    response?: Response;
    /**
     * 初始化http错误对象
     * @param code 错误码
     * @param message 错误消息
     * @param request 请求类
     * @param response 响应结果
     */
    constructor(code: number, message: string, request?: Http, response?: Response);
}
/**
 * Http请求类
 */
class Http {
    /** 抛出的网络错误类 */
    static HttpError: typeof HttpError;
    /** 内部使用的headers */
    static HttpHeaders: typeof Headers;
    /** 内部使用的response */
    static HttpResponse: typeof Response;
    /** 内部使用的request */
    static HttpRequest: typeof Request;
    /** 可用的编码 */
    static ContentType: {
        JSON: string;
        FORM: string;
    };
    /** 全局加载中处理 */
    static showLoading: HttpNofifyCallback;
    /** 全局错误消息处理 */
    static showError: HttpNofifyCallback;
    /** 全局成功消息处理 */
    static showSuccess: HttpNofifyCallback;
    /** 支持的方法种类 */
    static Method: typeof HttpMethod;
    /** 默认的网络请求配置 */
    static HttpOption: IHttpConfig;
    /** 发送请求，具体实现由所在平台实现 */
    static request(url: string, request: any): Promise<Response>;
    /** 默认全局实例 */
    static instance: Http;
    /** 实例配置 */
    httpconfig: IHttpConfig;
    /** 请求缓存 */
    [HttpCache]: Map<string, IHttpCache>;
    /** 自定义文案 */
    [HttpMessage]: {
        success: string;
        error: string;
        loading: string;
    };
    /** 是否携带用户凭证 */
    auth: Auth;
    /** 仅在子类中使用 */
    protected $tryUseAuth: boolean;
    /** 实例化 */
    constructor(_option?: IHttpConfig);
    /** 关联Auth */
    withAuth(auth: Auth): this;
    /** 发送 GET 请求，并返回结果 */
    get(url: HttpRequestOption, query?: any): Promise<any>;
    /** 发送 DELETE 请求，并返回结果 */
    delete(url: HttpRequestOption, query?: any): Promise<any>;
    /** 发送 HEAD 请求，并返回结果 */
    head(url: HttpRequestOption, query?: any): Promise<any>;
    /** 发送 OPTIONS 请求，并返回结果 */
    options(url: HttpRequestOption, query?: any): Promise<any>;
    /** 发送 POST 请求，并返回结果 */
    post(url: HttpRequestOption, data?: any): Promise<any>;
    /** 发送 PUT 请求，并返回结果 */
    put(url: HttpRequestOption, data?: any): Promise<any>;
    /** 发送 PATCH 请求，并返回结果 */
    patch(url: HttpRequestOption, data?: any): Promise<any>;
    jsonp(url: HttpRequestOption, query?: any): Promise<any>;
    /** 执行指定action */
    action(url: HttpRequestOption, data?: any, method?: HttpMethod, extOptions?: any): Promise<any>;
    /** 发送request */
    request(req: IHttpRequestOption): Promise<any>;
    /** 用于设置响应中的提示内容 */
    setHttpMessage(key: string, message: string): void;
    /** 使用指定方法(默认GET)请求，并返回text */
    text(url: HttpRequestOption, query?: any, method?: HttpMethod): Promise<any>;
    /** 使用指定方法(默认GET)请求，并返回arrayBuffer */
    arrayBuffer(url: HttpRequestOption, query?: any, method?: HttpMethod): Promise<any>;
    /** 使用指定方法(默认GET)请求，并返回blob */
    blob(url: HttpRequestOption, query?: any, method?: HttpMethod): Promise<any>;
    /** 使用指定方法(默认GET)请求，并返回formData */
    formData(url: HttpRequestOption, query?: any, method?: HttpMethod): Promise<any>;
    static get: SendRequest;
    static delete: SendRequest;
    static head: SendRequest;
    static options: SendRequest;
    static post: SendRequest;
    static put: SendRequest;
    static patch: SendRequest;
    static jsonp: SendRequest;
    static action: SendRequest;
    static text: SendRequest;
    static arrayBuffer: SendRequest;
    static blob: SendRequest;
    static formData: SendRequest;
}
interface IHttpCache {
    expiretime: number;
    data: any;
}
interface IHttpConfig {
    auth?: Auth;
    baseURL?: string;
    validateStatus?: (code: number) => boolean;
    transformRequest?: (req: IHttpRequestOption) => IHttpRequestOption;
    transformResponse?: (rsp: Response, req: IHttpRequestOption) => any;
    onHeadersReceived?: (headers: Headers) => void;
}
interface IHttpRequestOption {
    /** GET请求 支持缓存 */
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

interface IAppOption {
    /** 应用接口根路径 */
    baseURL?: string;
    /** 应用appid */
    appid?: string;
    /** 是否关闭日志分析 */
    analysisoff?: boolean;
    /** 初始化api，可放置json等静态文件 */
    readyapi?: string;
    /** 携带指定的auth */
    auth?: Auth;
}
class AppError extends Error {
    code: number;
    data: number;
    app: App;
    constructor(code: number, message: string, data: any, app: App);
}
/**
 * 实例化App对象
 */
class App extends Http {
    /** APP 响应错误 */
    static AppError: typeof AppError;
    /** 转换app的请求 */
    transformAppRequest(config: any): any;
    /** 转换app响应 */
    transformAppResponse(response: Response): Promise<any>;
    /** 当前应用实例(如果有多个实例，只能获取第一个) */
    static instance: App;
    /** 当前应用基本配置， */
    config: IAppConfig;
    /** 当前应用定义的配置 */
    setting: Record<string, any>;
    /** 应用appid */
    readonly appid: string;
    /** 初始化接口 */
    readyapi: string;
    /** 是否启用应用分析 */
    analysisoff: boolean;
    /** 应用初始化完成事件 */
    finished: ITaskerPromise<App>;
    /**
     * @param opts app配置或者appid
     */
    constructor(opts: IAppOption | string);
    /** 应用初始化 */
    ready(fn?: any): Promise<App>;
}
interface IAppConfig {
    id: number;
    appid: string;
    name: string;
    endpoint: string;
    oauth: string;
    starttime: number;
    endtime: number;
    status: string;
    updatetime: number;
}

type CommonQuery = string | number | Record<string, any>;
/**
 * 全局配置
 */
class Config {
    /** 是否为调试模式 */
    static isDev: boolean;
    /** CDN文件根路径 */
    static CDN_ROOT: string;
    /** api接口地址 */
    static API_HTTP: string;
    /** auth api接口地址 */
    static API_AUTH: string;
    /** app api接口地址 */
    static API_APP: string;
    /** service 相关服务 */
    static API_SERVICE: string;
    /** 设置配置 */
    static set(key: string | Record<string, any>, val?: any): void;
    /** 普通API接口服务 */
    static api(service: string, query?: CommonQuery): string;
    /** 获取service地址 */
    static service(service: string, query?: CommonQuery): string;
    /** 获取cdn文件 */
    static cdn(filename: string, process?: string): string;
}

type IEmitterEventHandler = (event?: any, a1?: any, a2?: any) => void;
const EmitterSymbol: unique symbol;
/**
 * 事件处理
 */
class Emitter {
    /** 单例缓存 */
    static instance: Emitter;
    /** 缓存监听的实例对象 */
    private [EmitterSymbol];
    /**
     * 注册指定事件，返回解绑事件句柄
     * @param event 事件名称 `*` 为监听全部事件
     * @param handler 事件回调
     */
    on(event: string, handler: IEmitterEventHandler): () => this;
    /**
     * @alias on
     */
    addEventListener(event: string, handler: IEmitterEventHandler): () => this;
    /**
     * 监听一次指定事件并自动销毁
     * @param event 事件名称
     * @param handler 事件回调
     */
    once(event: string, handler: IEmitterEventHandler): () => this;
    /**
     * 解绑监听事件句柄
     * @param event	Type of event to unregister `handler` from, or `"*"`
     * @param handler Handler function to remove
     */
    off(event: string, handler: IEmitterEventHandler): this;
    /**
     * @alias off
     */
    removeEventListener(event: string, handler: IEmitterEventHandler): this;
    /**
     * Invoke all handlers for the given type.
     * If present, `"*"` handlers are invoked after type-matched handlers.
     *
     * @param {String} event  The event type to invoke
     * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
     */
    /**
     * 使用参数，触发事件，如果传递 `*` 则触发所有事件
     * @param event 事件名称
     * @param arg1 传递参数1
     * @param arg2 传递参数2
     */
    emit(event: string, arg1?: any, arg2?: any): this;
}

/** 资源预加载处理 */
type IResItem = {
    /** Res 地址 */
    url: string;
    /** 别名 */
    key?: string;
    /** 种类 */
    type?: string;
    /** 传入文件名 */
    filename?: string;
};
/** 定义加载器实现 */
type IResLoader = (res: ResTask<any>) => Promise<any> | any;
/** 基础配置 */
type IResOption = {
    /** 加载根目录 */
    baseURL?: string;
    /** 当任务添加时，是否自动工作 */
    autoStart?: boolean;
};
/** 元素任务状态 */
const enum ResTaskStatus {
    /** 被添加 */ ADDED = /** 加载中 */ 0,
    LOADING = /** 已完成加载 */ 1,
    LOADED = /** 加载失败 */ 2,
    FAILED = 3
}
/** 加载任务 */
class ResTask<T> {
    /** 资源被添加 */
    static STATUS_ADDED: ResTaskStatus;
    /** 资源加载中 */
    static STATUS_LOADING: ResTaskStatus;
    /** 资源已完成加载 */
    static STATUS_LOADED: ResTaskStatus;
    /** 资源加载失败 */
    static STATUS_FAILED: ResTaskStatus;
    /** 当前资源加载完成 */
    finished: ITaskerPromise<ResTask<T>>;
    /** 当前资源加载状态 */
    status: number;
    /** 当前资源key */
    key: string;
    /** 当前应用路径 */
    url: string;
    /** 当前资源定义文件名 */
    filename: string;
    /** 当前资源种类 */
    type: string;
    /** 当前资源加载配置 */
    options: any;
    /** 当前资源加载成功后存储 */
    data: T;
    /** 当前资源加载失败原因 */
    error: Error;
    /** 资源加载任务，可用于用户取消、监听进度等 */
    task: any;
    /**
     * 实例化资源
     * @param config 资源基础配置
     * @param options 资源配置
     */
    constructor(config: IResItem, options: any);
    /** 资源加载成功通知 */
    resolve(): Promise<ResTask<T>>;
    /** 资源加载失败通知 */
    reject(err?: Error): Promise<ResTask<T>>;
    /** 资源加载成功后触发 */
    onLoad(fn: (data: T) => any): any;
    /** 资源加载失败后触发 */
    onError(fn: (err: Error) => any): Promise<any>;
    /** 释放当前资源 */
    remove(): boolean;
    /** 加载资源 */
    doLoad(): any;
}
/**
 * 加载进度实例
 */
class ResProgress {
    /** 总数 */
    total: number;
    /** 当前第多少个 */
    current: number;
    /** 等待中多少个 */
    pending: number;
    /** 已加载多少个 */
    loaded: number;
    /** 加载失败多少个 */
    failed: number;
    /** 是否加载完成 */
    get isComplete(): boolean;
    /** 可获取0-100之间的百分比数字 */
    get percent(): number;
}
/** 方法封装，具体实现由子类单独实现 */
interface IResLoaderHook<T> {
    (item: string[] | IResItem[], option?: any): Promise<ResTask<T>[]>;
    (item: string | IResItem, option?: any): Promise<ResTask<T>>;
}
/**
 * 资源加载处理器
 */
class Res extends Emitter {
    /** 全局配置 */
    static config: IResOption;
    /** 任务实例 */
    static ResTask: typeof ResTask;
    /** 进度实例 */
    static ResProgress: typeof ResProgress;
    /** 默认实例 */
    static instance: Res;
    /** 加载控制器 */
    static loaders: Map<string, IResLoader>;
    /** 全局ext自动查找，根据请求文件名自动查找对应加载器 */
    static extmaps: {};
    /** 注册加载控制器 */
    static registerLoader(type: string, loader: IResLoader): typeof Res;
    /** 查询加载控制器 */
    static getLoader(type: string): IResLoader | undefined;
    /** 全局队列 */
    private static $queue;
    /** 全局可设置的并发加载量，0为不限量 */
    private static $concurrency;
    /** 当前正在加载的数量 */
    private static $pending;
    /** 全局缓存 */
    private static $cache;
    /** 释放资源 */
    static remove(res: ResTask<any>): boolean;
    /** 查找指定key资源 */
    static get(keyOrTask: string | ResTask<any>, _default?: any): any;
    /** 全局方法，添加资源 */
    static add(item: any, option?: any): ResTask<unknown>;
    /** @private 检查队列 */
    private static _watchExecTask;
    /** 是否工作中 */
    isWorked: boolean;
    /** 根路径 */
    baseURL: string;
    /** 进度通知 */
    progress: ResProgress;
    /** 全局加载任务(仅在第一次start-complete后触发) */
    finished: ITaskerPromise<Res>;
    /** 等待中队列 */
    protected $queue: ResTask<any>[];
    /**
     * 资源加载器
     * @param options 加载器全局配置
     */
    constructor(options?: IResOption);
    /** 开始任务 */
    start(): ITaskerPromise<Res>;
    add<T>(item: string | IResItem, option?: any): ResTask<T>;
    add<T>(item: string[] | IResItem[], option?: any): ResTask<T>[];
    /** 释放资源 */
    remove(res: ResTask<any>): boolean;
    /** 查找指定key资源 */
    get(keyOrTask: string | ResTask<any>, _default?: any): any;
    /** @private 执行指定任务 */
    private _execTask;
    /** @private 进度通知 */
    private _nofify;
    /** @private 检测任务是否加载完成 */
    private _checkComplete;
    /**
     * 扩展属性注解
     */
    /** 加载arrayBuffer资源 */
    arrayBuffer: IResLoaderHook<ArrayBuffer>;
    /** 加载arrayBuffer类型资源（使用全局加载器） */
    static arrayBuffer: IResLoaderHook<ArrayBuffer>;
    /** 加载blob资源 */
    blob: IResLoaderHook<Blob>;
    /** 加载blob类型资源（使用全局加载器） */
    static blob: IResLoaderHook<Blob>;
    /** 加载headers资源 */
    headers: IResLoaderHook<Headers>;
    /** 加载headers类型资源（使用全局加载器） */
    static headers: IResLoaderHook<Headers>;
    /** 加载json资源 */
    json: IResLoaderHook<any>;
    /** 加载json类型资源（使用全局加载器） */
    static json: IResLoaderHook<any>;
    /** 加载text资源 */
    text: IResLoaderHook<string>;
    /** 加载text类型资源（使用全局加载器） */
    static text: IResLoaderHook<string>;
    /** 加载formData资源 */
    formData: IResLoaderHook<FormData>;
    /** 加载formData类型资源（使用全局加载器） */
    static formData: IResLoaderHook<FormData>;
    /** 加载jsonp资源 */
    jsonp: IResLoaderHook<any>;
    /** 加载jsonp类型资源（使用全局加载器） */
    static jsonp: IResLoaderHook<any>;
    /** 加载css资源 */
    css: IResLoaderHook<HTMLStyleElement>;
    /** 加载css类型资源（使用全局加载器） */
    static css: IResLoaderHook<HTMLStyleElement>;
    /** 加载js资源 */
    js: IResLoaderHook<HTMLScriptElement>;
    /** 加载js类型资源（使用全局加载器） */
    static js: IResLoaderHook<HTMLScriptElement>;
    /** 加载img资源 */
    img: IResLoaderHook<HTMLImageElement>;
    /** 加载img类型资源（使用全局加载器） */
    static img: IResLoaderHook<HTMLImageElement>;
    /** 加载crossimg资源 */
    crossimg: IResLoaderHook<HTMLImageElement>;
    /** 加载crossimg类型资源（使用全局加载器） */
    static crossimg: IResLoaderHook<HTMLImageElement>;
    /** 加载audio资源 */
    audio: IResLoaderHook<HTMLAudioElement>;
    /** 加载audio类型资源（使用全局加载器） */
    static audio: IResLoaderHook<HTMLAudioElement>;
    /** 加载video资源 */
    video: IResLoaderHook<HTMLVideoElement>;
    /** 加载video类型资源（使用全局加载器） */
    static video: IResLoaderHook<HTMLVideoElement>;
    /** 加载download资源 */
    download: IResLoaderHook<any>;
    /** 加载download类型资源（使用全局加载器） */
    static download: IResLoaderHook<any>;
}

/** UI支持的颜色 */
type TypeColor = 'dark' | 'main' | 'primary' | 'warn' | 'info';
/** UI支出的主题 */
type UiTheme = 'android' | 'ios' | 'half';
/** 通用默认配置 */
type UiBaseOption = {
    /** 指定根元素ID */
    id?: string;
    /** 渲染主题 */
    theme?: UiTheme;
    /** 是否添加遮罩层 */
    isAddMask?: boolean;
    /** 是否包含表单 */
    isForm?: boolean;
    /** 类名 */
    className?: string;
    /** 延迟自动关闭时间 */
    duration?: boolean | number;
    /** 挂载根元素 */
    target?: string | HTMLElement;
    /** 关闭回调 */
    onClose?: Function;
    [key: string]: any;
};
/** UI按钮配置 */
type UiButtonOption = {
    /** 触发的click事件的key */
    key?: string;
    /** 按钮名称 */
    label: string;
    /** `button`转换为`a`用于拨号，邮箱 */
    href?: string;
    /** 点击回调 */
    onClick?: Function;
    /** 文字加粗 */
    bold?: boolean;
    /** 文字颜色 */
    color?: TypeColor;
    /** 自定义类名 */
    className?: string;
};
/** UI输入框种类 */
type UiInputType = 'hidden' | 'text' | 'tel' | 'password' | 'textarea' | 'number' | 'custom';
/** UI输入框配置 */
type UiInputOption = {
    /** input 的name */
    name: string;
    /** 标签名称 */
    type?: UiInputType;
    /** 输入标签名称 */
    label?: string;
    /** 输入提示 */
    tips?: string;
    /** 默认输入内容 */
    placeholder?: string;
    /** 默认值 */
    value?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 自定义内容，type = custom有效 */
    innerHTML?: string;
    /** 验证器，验证未通过返回失败原因，false或string */
    validate?: (value: string) => any;
    [key: string]: any;
};
/**
 * UiBase基础构造类
 * @class UiBase
 * @extends {Emitter}
 */
class UiBase extends Emitter {
    static nextZIndex: number;
    static get zIndex(): number;
    /** 所有打开的dialog集合，用于批量关闭 */
    static openInstances: UiBase[];
    /** 关闭所有已经打开的弹窗 */
    static closeAll(): void;
    /** 默认配置 */
    static option: any;
    /** 时间触发器 */
    emitter: any;
    /** 实例配置 */
    option: UiBaseOption;
    /** 挂载元素 */
    $target?: ZeptoCollection;
    /** 根元素 */
    $root: ZeptoCollection;
    /** 遮罩 */
    $mask: ZeptoCollection;
    /** 动画入场className */
    inClassName: string;
    /** 动画出场className */
    outClassName: string;
    /** 组件ID */
    id: string;
    /** 弹窗是否打开 */
    isOpened: boolean;
    private _closeTid?;
    /** 构造UI */
    constructor(option?: UiBaseOption);
    private _releaseCloseTid;
    /** 打开弹窗 */
    open(): this;
    private _onOpen;
    private _onOpened;
    private $_autoScrollTopId;
    private _onFormBlur;
    private _onFormFocus;
    validateForm(field?: string): boolean;
    validateClear(field?: string): boolean;
    /** 关闭弹窗 */
    close(): void;
    /** 执行一个异步任务，执行成功则关闭 */
    withClose(next: Function | Promise<any>): Promise<any>;
    private _onClose;
    private _onClosed;
    /** 延迟关闭 */
    wait(duration: number): Promise<UiBase>;
}

/** UIModal配置 */
interface UiModalOption extends UiBaseOption {
    /** 标题 */
    title?: string;
    /** 子标题 */
    header?: string;
    /** 内容 */
    content?: string;
    /** 底部追加内容 */
    footer?: string;
    /** 操作按钮列表 */
    buttons?: UiButtonOption[];
    /** 输入项列表 */
    inputs?: UiInputOption[];
    /** 是否展示关闭按钮，只有title存在时渲染 */
    showClose?: boolean;
    /** 点击mask是否可关闭 */
    maskClose?: boolean;
    /** 背景透明 */
    transparent?: boolean;
    /** 挂载元素 */
    target?: string | HTMLElement;
    /** 按钮点击回调 */
    onClick?: (key?: string) => void;
    /** 弹层关闭回调 */
    onClose?: Function;
    validate?: (key: string, value: string, data: object) => any;
}
class UiModal extends UiBase {
    /** 全局配置 */
    static option: UiModalOption;
    /** 弹层实例 */
    $modal: ZeptoCollection;
    /** 表单实例 */
    $form?: ZeptoCollection;
    /** 按钮列表实例 */
    $buttons?: ZeptoCollection;
    /** 加载中实例 */
    $spinning?: ZeptoCollection;
    /** 获取form的数据 */
    get data(): {
        [key: string]: string;
    };
    /** prompt 弹窗的数据 */
    get value(): string;
    constructor(_option?: UiModalOption);
    /** 执行一个异步任务，执行成功则关闭 */
    withClose(next: Function | Promise<any>, message?: string): Promise<any>;
    /** 显示操作loading */
    showSpinning(message?: string): this;
    /** 隐藏交互loading */
    hideSpinning(): this;
    validateForm(field?: string): boolean;
    validateClear(field?: string): boolean;
    private _validInput;
    private _openHook;
    private _closedHook;
}

/** 配置项 */
interface IUiMusicOption {
    /** 是否在后台播放 */
    background?: boolean;
    /** 挂载元素 */
    target?: string;
    /** 音乐路径 */
    src?: string;
    /** 类名 */
    className?: string;
    /** 主题 */
    theme?: string;
    /** 位置 */
    position?: 'tl' | 'tr' | 'bl' | 'br';
    /** 默认样式 */
    style?: any;
    /** 是否自动播放 */
    autoplay?: boolean;
    /** 是否循环播放 */
    loop?: boolean;
    /** 是否静音 */
    muted?: boolean;
    /** 默认音量 */
    volume?: number;
    /** 预加载付出 */
    preload?: 'none' | 'metadata' | 'auto';
    /** X方向偏移量 */
    offsetX?: number | string;
    /** Y方向偏移量 */
    offsetY?: number | string;
    /** 图标尺寸 */
    size?: number | string;
    /** 点击回调 */
    onClick?: Function;
}
/** 主题注册 */
interface IUiMusicTheme {
    /** 播放中主题 */
    playing: string | Function;
    /** 暂停状态主题 */
    paused: string | Function;
    /** 加载中主题 */
    loading?: string | Function;
}
/** 雪碧音支持 */
interface IUiMusicTimeline {
    /** 开始播放时间点 */
    begin: number;
    /** 结束播放时间点 */
    end: number;
    /** 是否循环播放 */
    loop?: boolean;
}
/**
 * 音乐播放器
 */
class UiMusic {
    /** 获取默认实例 */
    static instance: UiMusic;
    /** 全局配置 */
    static option: IUiMusicOption;
    /** 主题列表 */
    static themes: Map<any, any>;
    /** 注册主题 */
    static registerTheme(themeName: any, adapter: IUiMusicTheme | number[]): Map<string, IUiMusicTheme>;
    /** 雪碧音支持 */
    timelines: Record<string, IUiMusicTimeline>;
    /** 实例配置 */
    option: IUiMusicOption;
    /** 是否挂载 */
    isMounted: boolean;
    /** 用户暂停应用 */
    isUserPaused: boolean;
    /** 是否正在加载 */
    private _isLoading;
    /** 是否正在播放 */
    private _isPlaying;
    /** 是否暂停播放 */
    private _isPaused;
    $root: ZeptoCollection;
    $view: ZeptoCollection;
    $loading: ZeptoCollection;
    $playing: ZeptoCollection;
    $paused: ZeptoCollection;
    audio: HTMLAudioElement;
    constructor(_option: IUiMusicOption);
    /** 设置播放进度 */
    set currentTime(val: number);
    /** 读取播放进度 */
    get currentTime(): number;
    /** 获取主题 */
    get theme(): IUiMusicTheme;
    set isLoading(val: boolean);
    /** 获取是否加载中状态 */
    get isLoading(): boolean;
    /** 设置暂停状态 */
    set isPaused(val: boolean);
    /** 读取暂停状态 */
    get isPaused(): boolean;
    /** 设置播放状态 */
    set isPlaying(val: boolean);
    /** 读取播放状态 */
    get isPlaying(): boolean;
    /**
     * 加载音乐路径
     * @param {string} [src]
     * @returns
     */
    load(src?: string): this;
    /** 播放 */
    play: () => this;
    /** 暂停 */
    pause: () => void;
    /** 重新播放，如果用户手动暂停，则不会重播 */
    replay: () => void;
    /** 隐藏图标 */
    hide(): void;
    /** 打开图标 */
    show(): void;
    /** 销毁 */
    destory(): void;
    private _handleEvent;
    /**
     * timeline 支持
     */
    /** 添加雪碧音 */
    addTimeline(name: string, timeline: IUiMusicTimeline): void;
    private _unbindTimeupdate;
    /** 播放指定片段雪碧音 */
    gotoAndPlay(name: string, callback?: Function): void;
}

interface IUiSheetAction extends UiButtonOption {
}
/** UIsheet配置 */
interface IUiSheetOption extends UiBaseOption {
    /** 标题 */
    title?: string;
    /** 操作按钮列表 */
    menus?: IUiSheetAction[];
    /** 第二栏按钮列表 */
    actions?: IUiSheetAction[];
    /** 点击mask是否可关闭 */
    maskClose?: boolean;
    /** 背景透明 */
    transparent?: boolean;
    /** 挂载元素 */
    target?: string | HTMLElement;
    /** 按钮点击回调 */
    onClick?: (key?: string) => void;
    /** 弹层关闭回调 */
    onClose?: Function;
}
class UiSheet extends UiBase {
    /** 全局配置 */
    static option: IUiSheetOption;
    /** 弹层实例 */
    $sheet: ZeptoCollection;
    constructor(_option?: IUiSheetOption);
    private _openHook;
    private _closedHook;
}

/** 设置选项 */
type UiToastOption = UiBaseOption & {
    /** 图标 */
    icon?: string;
    /** 消息内容 */
    message?: string;
    /** 点击可关闭 */
    clickClosed?: boolean;
    /** 点击回调 */
    onClick?: (this: UiToast, instance: UiToast) => void;
};
/**
 * Toast提示类
 */
class UiToast extends UiBase {
    /** 全局配置 */
    static option: UiToastOption;
    /** body 内容 */
    $body: ZeptoCollection;
    /** 图标内容 */
    $icon: ZeptoCollection;
    /** 消息内容 */
    $message: ZeptoCollection;
    constructor(_option: UiToastOption);
    /** 更新消息内容 */
    setMessage(message: string): this;
    /** 更新图标内容 */
    setIcon(icon: string): this;
    private _openHook;
    private _closedHook;
}

interface UiViewOption extends UiBaseOption {
    type: 'image' | 'preloader' | 'curtain';
    /** 是否全屏 */
    isFullScreen?: boolean;
    /** 图片路径 */
    src?: string;
    /** 图片描述 */
    alt?: string;
    /** 追加内容 */
    content?: string;
    /** 附加图标 */
    icon?: string;
    /** 图标位置 */
    iconPosition?: 'tl' | 'tr' | 'bl' | 'br' | 'center';
    /** 图标点击回调函数 */
    onClick?: (this: UiView, instance: UiView) => void;
}
class UiView extends UiBase {
    /** 全局配置 */
    static option: {
        isAddMask: boolean;
        target: string;
        iconPosition: string;
        onClick: (this: UiView) => void;
    };
    /** view节点 */
    $view: ZeptoCollection;
    /** 内容节点 */
    $content?: ZeptoCollection;
    constructor(_option: UiViewOption);
    private _openHook;
    /** 重新设置内容 */
    setContent(content: string): any;
}

/** 当前环境全局变量 */
let EnvGlobal: any;

/** 当前运行平台，web|mini|node */
const platform = "__PLATFORM__";
/** 当前版本信息 x.y.z */
const version = "__VERSION__";
/**
 * 常用正则
 */
/** 是否为http匹配的正则表达式，存在//www.example.com的情况 */
const regexHttp: RegExp;
/** base64匹配的正则表达式 */
const regexBase64: RegExp;
/** 是否为数字的正则表达式(正数、负数、和小数) */
const regexNumber: RegExp;
/** 是否为电话号码的正则表达式 */
const regexMobile: RegExp;
/** 是否为中文的正则表达式 */
const regexChinese: RegExp;
/** 使用正则匹配和分割目录 */
const regexSplitPath: RegExp;
/**
 * 常用简易函数
 */
/** 空函数 */
const noop: () => void;
/** 定值函数 */
const always: <T>(val: T) => T;
/** 返回值始终为true */
const alwaysTrue: () => boolean;
/** 返回值始终为false */
const alwaysFalse: () => boolean;
/** 对象合并`Object.assign` */
const assign: {
    <T, U>(target: T, source: U): T & U;
    <T_1, U_1, V>(target: T_1, source1: U_1, source2: V): T_1 & U_1 & V;
    <T_2, U_2, V_1, W>(target: T_2, source1: U_2, source2: V_1, source3: W): T_2 & U_2 & V_1 & W;
    (target: object, ...sources: any[]): any;
};
/** 对象key列表`Object.keys` */
const keys: {
    (o: object): string[];
    (o: {}): string[];
};
/** 创建无原型链对象 */
const object: () => any;
/**
 * 类型判断函数
 */
/** 判定参数是否为数组`Array.isArray` */
const isArray: (arg: any) => arg is any[];
/** 判定参数是否为NaN`Number.isNaN` */
const isNaN: (number: unknown) => boolean;
/** 判定参数是否为Number对象 */
const isNumber: (arg: any) => arg is number;
/** 判定参数是否为String对象 */
const isString: (arg: any) => arg is string;
/** 判定参数是否为Boolean对象 */
const isBoolean: (arg: any) => arg is boolean;
/** 判定参数是否为Arguments对象 */
const isArguments: (arg: any) => arg is any[];
/** 判定参数是否为Map对象 */
const isMap: (arg: any) => arg is Map<any, any>;
/** 判定参数是否为Error对象 */
const isError: (arg: any) => arg is Error;
/** 判定参数是否为Set对象 */
const isSet: (arg: any) => arg is Set<any>;
/** 判定参数是否为RegExp对象 */
const isRegExp: (arg: any) => arg is RegExp;
/** 判定参数是否为Symbol对象 */
const isSymbol: (arg: any) => arg is symbol;
/** 判定参数是否为Date对象 */
const isDate: (arg: any) => arg is Date;
/** 判定参数是否为File对象 */
const isFile: (arg: any) => arg is File;
/** 判定参数是否为Blob对象 */
const isBlob: (arg: any) => arg is Blob;
/** 判定参数是否为Object对象(object|function) */
const isObject: (obj: any) => boolean;
/** 判定对象是否具有指定属性 */
const isHasOwn: (obj: any, prop: any) => boolean;
/** 判定参数是否为函数`Function` */
const isFunction: (fun: any) => fun is Function;
/** 判定参数是否为`Null` */
const isNull: (nul: any) => nul is null;
/** 判定参数是否为`Undefined` */
const isUndefined: (val: any) => val is undefined;
/** 判定参数是否为`Null`|`Undefined` */
const isNullOrUndefined: (arg: unknown) => boolean;
/** 判定参数是否为存在(非`Null`|`Undefined`) */
const isDef: <T>(val: T | null | undefined) => val is T;
/** 判定参数是否为原始对象(排除数组) */
const isPlainObject: (val: any) => boolean;
/** 判定参数是否为绝对路径 */
const isAbsolute: (path: any) => boolean;
/** 判定参数是否为http|ftp链接 */
const isHttp: (path: any) => boolean;
/** 判定参数是否为`Promise` */
const isPromise: <T>(obj: any) => obj is Promise<T>;
/** 判定参数是否为空值(falsely,空数组,空对象,空字符串) */
const isEmpty: typeof _isEmpty;
/** 判定参数是否为base64编码格式 */
const isBase64: (str: any) => boolean;
/** 判定参数是否为原始函数 */
const isNative: (Ctor: unknown) => boolean;
/** 判定参数是否为`Window` */
const isWindow: (obj: any) => boolean;
/** 判定参数是否为`Document` */
const isDocument: (obj: any) => boolean;
/** 判定参数是否为`FormData` */
const isFormData: (val: any) => boolean;
/** 判定参数是否为有效的数值表示方法 */
const isNumeric: (val: any) => any;
/**
 * 常用数学函数
 */
/** 范围取值，num始终在[min,max]闭区间内 */
const range: (num: number, min: number, max: number) => number;
/** 在[0,min]或[min, max)中取随机整值 */
const random: (min: number, max?: number | undefined) => number;
/**
 * 常用字符串处理函数
 */
/** 生成sdk内带前缀唯一值 */
const uid: (prefix?: string) => string;
/** 生成随机32位UUID值 */
const uuid: typeof _uuid;
/** 生成指定长度随机字符串 */
const randomstr: typeof _randomstr;
/** 将参数转为驼峰格式 */
const camelize: (str: string) => string;
/** 将驼峰字符串转换为中划线格式(paddingLeft => padding-left) */
const dasherize: (str: string) => string;
/** 根据基路径和参数创建url(参数为number时转换为{id: num}) */
const createURL: (base: string, query?: string | number | Record<any, any> | undefined) => string;
/** 参数转换为字符串，并首尾去空 */
const trim: (str: any) => string;
/** 从url中去过滤参数集合 */
const filterURL: typeof _filterURL;
/** 从参数中提取文本classnames */
const classnames: typeof _classNames;
/** 从参数中生成css样式 */
const styles: typeof _styles;
/** 根据属性和值生成css代码 */
const css: typeof _css;
/** 根据属性和值判定是否需要增加px单位并返回新值 */
const addPx: typeof _addPx;
/**
 * 数组/对象工具函数
 */
/** 获取任意参数`length`值 */
const getLength: (obj: any) => number;
/** 判定给定任意两个值是否全等 */
const equal: typeof _equal;
/** 在数组中根据删除条件过滤删除数组，并返回过滤后的数组(原数组已被过滤) */
const remove: typeof _remove;
/** 在数组中查找指定值，并移除指定值 */
const splice: typeof _splice;
/** 在数组中从指定开始(默认为0)位置判定对象是否存在 */
const inArray: (val: any, arr: any[], fromIndex?: number | undefined) => boolean;
/** 在数组中移除重复选项，保持数组项唯一性 */
const uniqueArray: (arr: any[]) => any[];
/** 使用迭代器遍历对象或数组，返回遍历后数组 */
const map: typeof _map;
/** 将参数数组随机打乱 */
const shuffle: typeof _shuffle;
/** 从数组中取值 */
const pick: typeof _pick;
/** 遍历对象/数组，返回false时停止循环 */
const each: typeof _each;
/** 从参数数组中生成映射对象 */
const makeMark: <T extends string | number | symbol>(arr: T[]) => Record<T, true>;
/** 从数组中根据条件生成映射对象 */
const makeMap: <T extends string | number | symbol>(arr: T[], fn?: ((key: T, arr: T[]) => any) | undefined) => Record<T, any>;
/**
 * 常用函数高阶函数
 */
/** 高阶函数：只运行函数一次 */
const once: (func: Function) => (this: any, ...args: any[]) => any;
/** 高阶函数：只运行函数N次 */
const before: typeof _before;
/** 高阶函数：在调用N次后，运行函数一次 */
const after: typeof _after;
/** 高阶函数：频率控制，返回函数连续调用时，func 执行频率限定为 次/wait */
const throttle: typeof _throttle;
/** 高阶函数：空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行 */
const debounce: typeof _debounce;
/** 高阶函数：根据缓存函数或参数缓存函数运算结果 */
const memoize: typeof _memoize;
/** 高阶函数：参数延展，fun(a, b, c) => spread(fun)([a, b, c]) */
const spread: <T extends Function>(callback: T) => (arr: any[]) => any;
/** 高阶函数：包装参数作为函数运行，wranFn(any)(a, b) */
const wrapFn: <T extends Function>(callback: T, context?: any) => T;
/** 在事件循环的下一帧执行函数 */
const nextTick: {
    (callback: any): void;
    (): Promise<void>;
};
/**
 * querystring 函数
 */
/** 转换对象为stringify格式 */
const stringify: (obj: any, sep?: string, eq?: string) => string;
/** 将查询参数中序列化为对象 */
const parse: typeof _parse;
/**
 * 时间相关
 */
/** 获取当前毫秒时间戳 */
const now: () => number;
/** 获取当前unix事件戳 */
const timestamp: () => number;
/** 格式化时间戳为可读事件 */
const unixtime: (unixtime?: number, format?: string | undefined) => string;
/** 延迟固定时间并返回Promise */
const wait: <T>(duration: number, arg?: T | undefined) => Promise<T>;
/** 语义化时间戳 */
const timeago: typeof _timeago;
/** 别名：请使用unixtime */
const unixFormat: (unixtime?: number, format?: string | undefined) => string;
/**
 * 路径操作
 */
/** 目录操作：分隔目录 */
const splitPath: (filename: string) => string[];
/** 目录操作：将多个路径转换为一个路径 */
const resolvePath: typeof _resolvePath;
/** 目录操作：获取当前目录文件夹 */
const dirname: typeof _dirname;
/** 目录操作：获取当前路径中的文件名(如`share.png`，后缀可选) */
const basename: typeof _basename;
/** 目录操作：获取当前路径的后缀名称(包含`.`，如`.png`) */
const extname: typeof _extname;
function _isEmpty(val: any): boolean;
function _map<T>(obj: T[], iteratee: (val: any, key: string | number, obj: T[]) => any): any[];
function _shuffle<T>(array: T[]): T[];
function _parse(qs: string, sep?: string, eq?: string): Record<string, any>;
/**
 * 频率控制 返回函数连续调用时，func 执行频率限定为 次 / wait
 * @param  {function}   func      传入函数
 * @param  {number}     wait      表示时间窗口的间隔
 */
function _throttle<T extends Function>(func: T, wait: number): T;
/**
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        传入函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，调用触发于开始边界而不是结束边界
 */
function _debounce<T extends Function>(func: T, wait?: number, immediate?: boolean): T;
/**
 * 遍历对象或者数组
 */
function _each(obj: any, iteratee: (val: any, key: any, _this: unknown) => any, context?: any): any;
/**
 * @example
 * sdk.pick({a: 1, b: 2, c: 3}, ['a', 'b']) // {a: 1, b: 2}
 * sdk.pick({a: 1, b: 2, c: 3}, {a: 'aa', b: 'bb'}) // {aa: 1, bb: 2}
 * @param obj 对象
 * @param map 文本
 */
function _pick<T>(obj: T, map: string[] | Record<string, any>): T;
/**
 * 创建一个会缓存 func 结果的函数。 如果提供了 hashFn，就用 hashFn 的返回值作为 key 缓存函数的结果。 默认情况下用第一个参数作为缓存的 key。 func 在调用时 this 会绑定在缓存函数上。
 * @param {any} func 计算函数体
 * @param {any} hashFn 可选的函数缓存key
 */
function _memoize<T extends Function>(func: T, hashFn?: (...arg: any[]) => string): T;
function _uuid(): string;
function _randomstr(len?: number): string;
/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @exampe
 *
 * jQuery(element).on('click', before(5, addContactToList))
 * // => Allows adding up to 4 contacts to the list.
 */
function _before(n: number, func: Function | any): (this: any, ...args: any[]) => any;
/**
 * The opposite of `before`. This method creates a function that invokes
 * `func` once it's called `n` or more times.
 *
 * @since 0.1.0
 * @category Function
 * @param {number} n The number of calls before `func` is invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * const saves = ['profile', 'settings']
 * const done = after(saves.length, () => console.log('done saving!'))
 *
 * forEach(saves, type => asyncSave({ 'type': type, 'complete': done }))
 * // => Logs 'done saving!' after the two async saves have completed.
 */
function _after(n: number, func: Function): (this: any, ...args: any[]) => any;
/**
 * Removes all elements from `array` that `predicate` returns truthy for
 * and returns an array of the removed elements. The predicate is invoked
 * with three arguments: (value, index, array).
 *
 * **Note:** Unlike `filter`, this method mutates `array`. Use `pull`
 * to pull elements from an array by value.
 *
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new array of removed elements.
 * @see pull, pullAll, pullAllBy, pullAllWith, pullAt, reject, filter
 * @example
 *
 * const array = [1, 2, 3, 4]
 * const evens = remove(array, n => n % 2 == 0)
 */
function _remove<T>(array: T[], predicate: (value: unknown, index: number, array: T[]) => boolean): T[];
function _splice<T>(array: T[], item: T): false | T;
/**
 * 美化表示Unix时间戳，注意参数为时间戳
 * @param {number} unixTime 允许`Date`类型参数
 * @returns {string} 美化后的时间描述，如“3小时前”
 */
function _timeago(unixTime: Date | number): string;
/**
 * 把一个路径或路径片段的序列解析为一个绝对路径
 * @param {string} to 初始路径
 * @param {string} from 相对路径
 */
function _resolvePath(...args: string[]): string;
/**
 * 返回一个 path 的目录名，类似于 Unix 中的 dirname 命令。
 * @example
 * sdk.dirname('/foo/bar/baz/asdf/quux'); // 返回 /foo/bar/baz/asdf
 */
function _dirname(path: string): string;
/**
 * 返回一个 path 的最后一部分，类似于 Unix 中的 basename 命令
 * @example
 * sdk.basename('/foo/bar/quux.html'); // 返回 'quux.html'
 */
function _basename(path: string, ext?: string): string;
/**
 * 回 path 的扩展名，即从 path 的最后一部分中的最后一个
 * @example
 * sdk.extname('index.html'); // 返回 .html
 * @param {string} path
 */
function _extname(path: string): string;
function _filterURL(url: string, filters: string[]): string;
function _classNames(...args: any[]): string;
/**
 * css样式编译，支持以下方式
 * styles('position: absoulte', { zIndex: 1, left: 2 }, [ 'zIndex', 1 ])
 * 如果值为空，将会被忽略，如下
 * styles(null, false, '', [], {})
 */
function _styles(...args: any[]): string;
function _css(prop: string, value: any, isString?: boolean): string;
function _addPx(prop: string, value: any): any;
function _equal(a: any, b: any): boolean;

const navigator: Navigator;
const document: Document;

/**
 * 网页相关常量
 */
/** 当前的userAgent */
const userAgent: string;
/** 是否为移动设备 */
const isMobile: boolean;
/** 是否为ios设备（ipad产品或者iphone） */
const isIos: boolean;
/** 是否为安卓设备 */
const isAndroid: boolean;
/** 是否为小程序 */
const isMiniapp: boolean;
/** 是否在微信浏览器中 */
const isWechat: boolean;
/** 是否在钉钉浏览器中 */
const isDingTalk: boolean;
/** css animation的前缀 */
const animationPrefix: string;
/** css transitionEnd 事件 */
const transitionEnd: string;
/** css animationEnd 事件 */
const animationEnd: string;
/** 当前页面是否启用动画 */
const animationEnabled: boolean;
type removeEventListener = () => void;
/** 监听指定元素的时间，返回unbind */
function addListener(element: EventTarget, event: string, callback: EventListener): removeEventListener;
/** 监听动画结束事件 */
function onAnimationEnd(element: HTMLElement, callback: EventListener): void | removeEventListener;
/** 监听渐变动画结束事件 */
function onTransitionEnd(element: HTMLElement, callback: EventListener): void | removeEventListener;
/** 页面是否就绪 */
const domready: Promise<boolean>;
/** 网页是否支持webp */
const webp: (this: any, ...args: any[]) => any;
/** 发送jsonp请求 */
const jsonp: typeof _jsonp;
/** 获取dom属性表，属性支持修饰符(!:转换为布尔值，+:转换为数值，?: 尝试转换数值) */
const getDomAttrs: typeof _getDomAttrs;
interface IJsonpOption {
    callback?: string;
    timeout?: number;
}
function _jsonp(url: string, options?: IJsonpOption | any): Promise<unknown>;
function _getDomAttrs(element: string | Element, attrs: string[]): Record<string, any>;

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
};
const baseAnalysis: {
    config: IAnalysisConfig;
    send: typeof send;
    pv: typeof pv;
    share: typeof share;
    user: typeof user;
    click: typeof click;
    unload: typeof unload;
    error: typeof error;
};

/** 发送指定事件 */
function send(event: string, data?: any, value?: number): void | null;
/** 发送页面pv事件 */
function pv(): Promise<void | null>;
/** 发送用户事件 */
function user(data?: any, value?: number): void | null;
/** 发送用户分享事件 */
function share(platform?: any, logid?: number): void | null;
/** 发送用户点击事件 */
function click(data?: any, value?: number): void | null;
/** 发送用户离开事件 */
function unload(): void | null;
/** 发送错误事件 */
function error(error: Error | string): false | void | null;

/**
 * 在本地缓存中保存若干个值，达到上限后移除尾部数组头部值
 * @param cacheKey 缓存key
 * @param maxLength 最大长度
 */
function hotcache(cacheKey: string, maxLength?: number): {
    get: (key: string, _default?: any) => any;
    set: (key: string, value: any) => any;
    remove: (key: string) => void;
    clearAll: () => void;
};

type IJssdkShareItem = {
    arg: null | IJssdkShareBase;
    platform: string;
    api: string;
    params?: any;
};
function share$1(opts?: string | IJssdkShare): Promise<void> | IJssdkShareItem | IJssdkShareItem[] | undefined;
class JssdkError extends Error {
}
const jssdk: {
    /** 使用的jssdk版本 */
    version: string;
    /** 当前签名appid */
    appid: string;
    /** 分享保留参数 */
    shareLogid: number;
    /** 定义值 */
    task: ITaskerPromise<boolean>;
    /** ready 监听 */
    ready: (fn: EventListenerOrEventListenerObject) => void;
    /** 配置处理 */
    config: (this: any, ...args: any[]) => any;
    /** 调用分享 */
    share: typeof share$1;
    /** 异步加载jssdk */
    loadJssdk: (this: any, ...args: any[]) => any;
    /** 错误对象 */
    JssdkError: typeof JssdkError;
};

interface IJssdkShareBase {
    platform: string;
    title: string;
    desc: string;
    link: string;
    imgUrl: string;
    success: any;
    cancel: any;
}
/** 设置分享 */
interface IJssdkShare {
    platform?: string;
    title?: string;
    desc?: string;
    link?: string;
    img?: string;
    /** 小程序使用的5:4图标 */
    banner?: string;
    imgurl?: string;
    imgUrl?: string;
    /** 自定义其他配置 */
    logid?: number;
    config?: string;
    success?: Function;
    cancel?: Function;
    type?: 'music' | 'video' | 'link';
    dataUrl?: string;
    dataurl?: string;
}

const _default: {
    PrivacyFileds: string[];
    /** 当前路径，查询字符串 */
    readonly querystring: any;
    /** 查询字符串序列化 */
    readonly query: Record<string, any>;
    /** 当前根路径 */
    readonly rootpath: string;
    /** 当前路径url */
    readonly url: string;
    /** 脱敏链接 */
    readonly safeurl: string;
    /** 获取当前根路径下的指定文件 */
    getRootFile(filename: string): string;
};

interface IStoreUseProxy {
    get(key: string): any;
    set(key: string, val: any): void;
    keys(): string[];
    remove(key: string): void;
    clear(): void;
}

const _default$1: {
    use(usestorage: IStoreUseProxy): any;
    get(key: string, _default?: any): any;
    set(key: string, data: any): void;
    keys(): string[];
    remove(key: string): void;
    clear(): void;
    each(fn: (value: any, key: string) => void): void;
};

/**
 * 获取cdn资源
 * @param filename 文件名
 * @param process 处理函数
 */
function res(filename: string, process?: string): string;
/**
 * 获取 lib 仓库文件
 * @param libname lib 仓库，如 vue/2.6.10/vue.min.js
 */
function lib(libname: string): string;
/**
 * 如果原图包含EXIF信息，添加该参数会获取EXIF信息。如果原图不包含EXIF信息，则只返回基本信息
 * @param filename
 */
function info(filename: string): Promise<any>;
/**
 * 获取图片的平均色调。
 * @param filename 文件名
 */
function hue(filename: string): Promise<any>;
/**
 * 视频截帧（默认截图第一张）
 * @param filename 文件名
 * @param w 宽度
 * @param h 高度
 * @param format 格式化jpg|png
 */
function snapshot(filename: string, w?: number, h?: number, format?: string): string;
/**
 * 智能媒体管理
 * @param filename 文件名
 * @param service 管理接口
 */
function imm(filename: string, service: string): Promise<any>;
const styles$1: Record<string, any>;
/**
 * 图片处理规则 @see https://help.aliyun.com/document_detail/48884.html
 */
function style(filename: string, style: string): string;

const cdn_res: typeof res;
const cdn_lib: typeof lib;
const cdn_info: typeof info;
const cdn_hue: typeof hue;
const cdn_snapshot: typeof snapshot;
const cdn_imm: typeof imm;
const cdn_style: typeof style;
namespace cdn {
  export {
    cdn_res as res,
    cdn_lib as lib,
    cdn_info as info,
    cdn_hue as hue,
    cdn_snapshot as snapshot,
    cdn_imm as imm,
    styles$1 as styles,
    cdn_style as style,
  };
}

/**
 * 访问服务端的service，要求必须包含app实例
 */
function service(serviceName: string, opt: any, method?: 'get' | 'post'): Promise<any>;
/** 上传base64文件（项目文件）*/
function upbase64(base64: string): Promise<CloudResponse>;
/** 同步文件到cdn（项目文件）*/
function syncurl(url: string): Promise<CloudResponse>;
/** 同步文件到cdn（临时文件）*/
function tempurl(url: string): Promise<CloudResponse>;
/** 文件是否存在（临时文件）*/
function hastemp(key: string): Promise<CloudResponse>;
/** 同步远程图片 */
function syncimage(url: string): Promise<CloudResponse>;
/** 获取文件信息 */
function headfile(key: string): Promise<CloudResponse>;
/** 代理转发请求，解决各种跨域问题 */
function proxy(option: ProxyOption): Promise<any>;
/** 将微信的amr格式转换为Mp3格式 */
function amr2mp3(input: string, kbs?: number): Promise<CloudResponse>;
type CloudResponse = {
    /** 文件名称 */
    name: string;
    /** 文件路径 */
    url: string;
    /** 代理服务状态 */
    status: number;
    /** 代理服务器消息 */
    statusMessage: string;
    /** 图片mime类型 */
    mime?: string;
};
interface ProxyOption extends Request {
    url: string;
    type: string;
}

/** 同步微信资源文件 */
function wxmedia(media_id: string): Promise<CloudResponse>;
/** 上传一个文件（项目文件） */
function upfile(file: File, isTempFile?: boolean): Promise<CloudResponse>;
/** 上传文件（临时文件） */
function uptemp(file: File): Promise<CloudResponse>;

const cloud_web_wxmedia: typeof wxmedia;
const cloud_web_upfile: typeof upfile;
const cloud_web_uptemp: typeof uptemp;
const cloud_web_service: typeof service;
const cloud_web_upbase64: typeof upbase64;
const cloud_web_syncurl: typeof syncurl;
const cloud_web_tempurl: typeof tempurl;
const cloud_web_hastemp: typeof hastemp;
const cloud_web_syncimage: typeof syncimage;
const cloud_web_headfile: typeof headfile;
const cloud_web_proxy: typeof proxy;
const cloud_web_amr2mp3: typeof amr2mp3;
type cloud_web_CloudResponse = CloudResponse;
namespace cloud_web {
  export {
    cloud_web_wxmedia as wxmedia,
    cloud_web_upfile as upfile,
    cloud_web_uptemp as uptemp,
    cloud_web_service as service,
    cloud_web_upbase64 as upbase64,
    cloud_web_syncurl as syncurl,
    cloud_web_tempurl as tempurl,
    cloud_web_hastemp as hastemp,
    cloud_web_syncimage as syncimage,
    cloud_web_headfile as headfile,
    cloud_web_proxy as proxy,
    cloud_web_amr2mp3 as amr2mp3,
    cloud_web_CloudResponse as CloudResponse,
  };
}

/**
 * Calculates MD5 value for a given string.
 * If a key is provided, calculates the HMAC-MD5 value.
 * Returns a Hex encoded string unless the raw argument is given.
 */
function md5(string: string, key?: string, raw?: boolean): string;

/** binary to assic */
const btoa: any;
/** ascii to binary */
const atob: any;

/** 对数据签名 */
function signature(object: Record<string, any>, action?: string): string;
/**
 * jwt解码，形式如 header.body.signature
 * @param {string} token
 */
function jwtDecode(token: string): any;

const safety_web_md5: typeof md5;
const safety_web_btoa: typeof btoa;
const safety_web_atob: typeof atob;
const safety_web_signature: typeof signature;
const safety_web_jwtDecode: typeof jwtDecode;
namespace safety_web {
  export {
    safety_web_md5 as md5,
    safety_web_btoa as btoa,
    safety_web_atob as atob,
    safety_web_signature as signature,
    safety_web_jwtDecode as jwtDecode,
  };
}

const store: Map<any, any>;
type IUsePlugin = {
    name: string;
    version?: string;
} | string;
/** 插件系统配置 */
const config: {
    rootPath: string;
};
/** 定义一个插件 */
function define(plugin: string, anything: any): any;
/** 使用一个插件 */
function use(plugin: IUsePlugin): Promise<any>;

const plugin_web_store: typeof store;
const plugin_web_config: typeof config;
const plugin_web_define: typeof define;
const plugin_web_use: typeof use;
namespace plugin_web {
  export {
    plugin_web_store as store,
    plugin_web_config as config,
    plugin_web_define as define,
    plugin_web_use as use,
  };
}

/** 后端服务生成生成二维码 */
function qrcode(text: string, size?: number): string;

/** 生成微信账号二维码 */
function getQrcode(username: string): string;
/** 读取文件的base64 */
function readAsDataURL(inputer: File): Promise<string>;
/** 选择某个种类的文件 */
function chooseFile(accept?: string, multiple?: boolean): Promise<File | FileList>;
/**
 * 选择文件并获取base64编码
 * @returns {Promise<string>}
 */
function chooseImageAsDataURL(option?: any): Promise<string>;
/**
 * base64文本转换为blob，可直接用表单上传
 * @param {string} base64String 原文本
 * @param {string} contentType 自定义contentType
 * @param {string} sliceSize 块大小
 * @returns {Blob}
 */
function base64toBlob(base64String: string, contentType?: string, sliceSize?: number): Blob;

const tool_web_getQrcode: typeof getQrcode;
const tool_web_readAsDataURL: typeof readAsDataURL;
const tool_web_chooseFile: typeof chooseFile;
const tool_web_chooseImageAsDataURL: typeof chooseImageAsDataURL;
const tool_web_base64toBlob: typeof base64toBlob;
const tool_web_qrcode: typeof qrcode;
namespace tool_web {
  export {
    tool_web_getQrcode as getQrcode,
    tool_web_readAsDataURL as readAsDataURL,
    tool_web_chooseFile as chooseFile,
    tool_web_chooseImageAsDataURL as chooseImageAsDataURL,
    tool_web_base64toBlob as base64toBlob,
    tool_web_qrcode as qrcode,
  };
}

/** UiAlert 配置 */
interface IUiAlertOption extends UiModalOption {
    /** 点击链接可选 */
    href?: string;
    /** 按钮名称 */
    okText?: string | false;
    /** 按钮点击回调事件 */
    ok?: Function;
}
/** UiConfirm配置 */
interface IUiConfirmOption extends IUiAlertOption {
    /** 表单验证失败提示文案 */
    formError?: Function | string;
    /** 关闭按钮文字 */
    noText?: string | false;
    /** 关闭按钮回调 */
    no?: Function;
}
/** UiPrompt 配置 */
interface IUiPromptOption extends IUiConfirmOption {
    /** 输入种类 */
    type?: UiInputType;
    /** 输入默认值 */
    defaultValue?: string;
    /** 默认输入内容 */
    placeholder?: string;
    /** 输入验证器 */
    validate?: (value: string) => any;
}
type IUserProfileType = 'username' | 'mobile' | 'password' | 'address' | 'hidden';
/** UserBox类型 */
interface IUiUserboxOption extends IUiConfirmOption {
    title: string;
    profile: IUserProfileType[];
}
/** 打开一个Modal */
function modal(option: UiModalOption): UiModal;
/** 打开一个Alert弹窗 */
function alert(option: IUiAlertOption | string): UiModal;
/** 打开一个confirm弹窗 */
function confirm(option: IUiConfirmOption): UiModal;
/** 打开一个prompt */
function prompt(option: IUiPromptOption | string): UiModal;
/** 打开一个sheet */
function sheet(option: IUiSheetOption): UiSheet;
/** 打开自定义输入面板 */
function userbox(option: IUiUserboxOption): UiModal;
/** 显示toast */
const toast: (message: any, duration?: any, onClose?: any) => UiToast;
/** 显示toast-tips */
const tips: (message: any, duration?: any, onClose?: any) => UiToast;
/** 显示toast-success */
const success: (message: any, duration?: any, onClose?: any) => UiToast;
/** 显示toast-info */
const info$1: (message: any, duration?: any, onClose?: any) => UiToast;
/** 显示toast-warn */
const warn: (message: any, duration?: any, onClose?: any) => UiToast;
/** 显示toast-error */
const error$1: (message: any, duration?: any, onClose?: any) => UiToast;
/** 显示toast-loading */
const loading: (message: any, duration?: any, onClose?: any) => UiToast;
/** 打开自定义view */
function view(option: UiViewOption): UiView;
/** 预览图片，支持全屏/半屏 */
function image(option: UiViewOption | string, isFullScreen?: boolean): UiView;
/** 展示全局的加载动画 */
function preloader(content?: string): UiView;
/** 打开一个modal弹窗，返回按钮key，取消时key=undefined */
const $modal: (option: UiModalOption) => Promise<string | undefined>;
/** 打开一个alert弹窗，用户点击确定，返回true */
const $alert: (option: IUiAlertOption) => Promise<true | undefined>;
/**
 * 打开一个confirm弹窗，返回true,false
 * @example
 * var isOk = await ui.$confim({title: '确认吗？', content: '内容'})
 */
const $confirm: (option: IUiConfirmOption) => Promise<boolean>;
/**
 * 打开一个prompt弹窗，返回输入内容，取消返回undefined
 * @example
 * var content = await ui.$prompt({title: '输入内容', content: '请在输入框输入内容'})
 */
const $prompt: (option: IUiPromptOption) => Promise<string | undefined>;
/**
 * 打开一个userbox弹窗，返回输入对象，取消返回undefined
 */
const $userbox: (option: IUiUserboxOption) => Promise<object | undefined>;

type ui_web_IUiAlertOption = IUiAlertOption;
type ui_web_IUiConfirmOption = IUiConfirmOption;
type ui_web_IUiPromptOption = IUiPromptOption;
type ui_web_IUserProfileType = IUserProfileType;
type ui_web_IUiUserboxOption = IUiUserboxOption;
const ui_web_modal: typeof modal;
const ui_web_alert: typeof alert;
const ui_web_confirm: typeof confirm;
const ui_web_prompt: typeof prompt;
const ui_web_sheet: typeof sheet;
const ui_web_userbox: typeof userbox;
const ui_web_toast: typeof toast;
const ui_web_tips: typeof tips;
const ui_web_success: typeof success;
const ui_web_warn: typeof warn;
const ui_web_loading: typeof loading;
const ui_web_view: typeof view;
const ui_web_image: typeof image;
const ui_web_preloader: typeof preloader;
const ui_web_$modal: typeof $modal;
const ui_web_$alert: typeof $alert;
const ui_web_$confirm: typeof $confirm;
const ui_web_$prompt: typeof $prompt;
const ui_web_$userbox: typeof $userbox;
namespace ui_web {
  export {
    ui_web_IUiAlertOption as IUiAlertOption,
    ui_web_IUiConfirmOption as IUiConfirmOption,
    ui_web_IUiPromptOption as IUiPromptOption,
    ui_web_IUserProfileType as IUserProfileType,
    ui_web_IUiUserboxOption as IUiUserboxOption,
    ui_web_modal as modal,
    ui_web_alert as alert,
    ui_web_confirm as confirm,
    ui_web_prompt as prompt,
    ui_web_sheet as sheet,
    ui_web_userbox as userbox,
    ui_web_toast as toast,
    ui_web_tips as tips,
    ui_web_success as success,
    info$1 as info,
    ui_web_warn as warn,
    error$1 as error,
    ui_web_loading as loading,
    ui_web_view as view,
    ui_web_image as image,
    ui_web_preloader as preloader,
    ui_web_$modal as $modal,
    ui_web_$alert as $alert,
    ui_web_$confirm as $confirm,
    ui_web_$prompt as $prompt,
    ui_web_$userbox as $userbox,
  };
}

export { App, Auth, AuthUser, Config, Emitter, Http, Res, UiBase, UiModal, UiMusic, UiSheet, UiToast, UiView, addListener, addPx, after, always, alwaysFalse, alwaysTrue, baseAnalysis as analysis, animationEnabled, animationEnd, animationPrefix, assign, basename, before, camelize, cdn, classnames, cloud_web as cloud, createURL, css, dasherize, debounce, dirname, document, domready, each, equal, extname, filterURL, getDomAttrs, getLength, EnvGlobal as global, hotcache, inArray, isAbsolute, isAndroid, isArguments, isArray, isBase64, isBlob, isBoolean, isDate, isDef, isDingTalk, isDocument, isEmpty, isError, isFile, isFormData, isFunction, isHasOwn, isHttp, isIos, isMap, isMiniapp, isMobile, isNaN, isNative, isNull, isNullOrUndefined, isNumber, isNumeric, isObject, isPlainObject, isPromise, isRegExp, isSet, isString, isSymbol, isUndefined, isWechat, isWindow, jsonp, jssdk, keys, _default as location, makeMap, makeMark, map, memoize, navigator, nextTick, noop, now, object, onAnimationEnd, onTransitionEnd, once, parse, pick, platform, plugin_web as plugin, random, randomstr, range, regexBase64, regexChinese, regexHttp, regexMobile, regexNumber, regexSplitPath, remove, resolvePath, safety_web as safefy, shuffle, splice, splitPath, spread, _default$1 as store, stringify, styles, tasker, throttle, timeago, timestamp, tool_web as tool, transitionEnd, trim, ui_web as ui, uid, uniqueArray, unixFormat, unixtime, userAgent, uuid, version, wait, webp, wrapFn };

}