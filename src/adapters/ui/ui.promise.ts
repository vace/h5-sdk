import { UiModalOption } from "../../factory/UiModal";
import { IUiConfirmOption, IUiPromptOption, IUiUserboxOption, IUiAlertOption } from "./interface";
import { UiModal } from "h5-sdk";

export function wrapModal(fun: Function, option: UiModalOption): Promise<string | undefined> {
  return new Promise((resolve) => {
    let instance: any
    option.onClick = (key) => {
      resolve(key)
      instance.close()
    }
    option.onClose = () => {
      resolve(undefined)
    }
    instance = fun(option)
  })
}

export function wrapAlert(fun: Function, option: IUiAlertOption): Promise<true | undefined> {
  return new Promise((resolve) => {
    let instance: any
    option.ok = (key: any) => {
      resolve(true)
      instance.close()
    }
    option.onClose = () => {
      resolve(undefined)
    }
    instance = fun(option)
  })
}

export function wrapConfirm (fun: Function, option: IUiConfirmOption): Promise<boolean> {
  return new Promise((resolve, reject) => {
    option.ok = (e: UiModal) => {
      resolve(true)
      e.close()
    }
    option.no = (e: UiModal) => {
      resolve(false)
      e.close()
    }
    return fun(option)
  })
}

export function wrapPrompt (fun: Function, option: IUiPromptOption): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    option.ok = (e: UiModal) => {
      resolve(e.value)
      e.close()
    }
    option.no = (e: UiModal) => {
      resolve(undefined)
      e.close()
    }
    return fun(option)
  })
}

export function wrapUserbox (fun: Function, option: IUiUserboxOption): Promise<object | undefined> {
  return new Promise((resolve, reject) => {
    option.ok = (e: UiModal) => {
      resolve(e.data)
      e.close()
    }
    option.no = (e: UiModal) => {
      resolve(undefined)
      e.close()
    }
    return fun(option)
  })
}
