import { UiInputType } from '../../factory/UiBase';
import { UiModalOption } from '../../factory/UiModal';

/** UiAlert 配置 */
export interface UiAlertOption extends UiModalOption {
  /** 点击链接可选 */
  href?: string
  /** 按钮名称 */
  okText?: string
  /** 按钮点击回调事件 */
  ok?: Function
}


/** UiConfirm配置 */
export interface UiConfirmOption extends UiAlertOption {
  /** 表单验证失败提示文案 */
  formError?: string
  /** 关闭按钮文字 */
  noText?: string
  /** 关闭按钮回调 */
  no?: Function
}


/** UiPrompt 配置 */
export interface UiPromptOption extends UiConfirmOption {
  /** 输入种类 */
  type?: UiInputType
  /** 输入默认值 */
  defaultValue?: string,
  /** 默认输入内容 */
  placeholder?: string,
  /** 输入验证器 */
  validate?: (value: string) => any
}


export type UserProfileType = 'username' | 'mobile' | 'password' | 'address' | 'hidden'
/** UserBox类型 */
export interface UiUserboxOption extends UiConfirmOption {
  title: string
  profile: UserProfileType[]
}