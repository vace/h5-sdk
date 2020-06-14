import { UiInputType } from '../../factory/UiBase';
import { UiModalOption } from '../../factory/UiModal';

/** UiAlert 配置 */
export interface IUiAlertOption extends UiModalOption {
  /** 点击链接可选 */
  href?: string
  /** 按钮名称 */
  okText?: string | false
  /** 按钮点击回调事件 */
  ok?: Function
}


/** UiConfirm配置 */
export interface IUiConfirmOption extends IUiAlertOption {
  /** 表单验证失败提示文案 */
  formError?: Function | string
  /** 关闭按钮文字 */
  noText?: string | false
  /** 关闭按钮回调 */
  no?: Function
}


/** UiPrompt 配置 */
export interface IUiPromptOption extends IUiConfirmOption {
  /** 输入种类 */
  type?: UiInputType
  /** 输入默认值 */
  defaultValue?: string,
  /** 默认输入内容 */
  placeholder?: string,
  /** 输入验证器 */
  validate?: (value: string) => any
}


export type IUserProfileType = 'username' | 'mobile' | 'password' | 'address' | 'hidden'
/** UserBox类型 */
export interface IUiUserboxOption extends IUiConfirmOption {
  title: string
  profile: IUserProfileType[]
}