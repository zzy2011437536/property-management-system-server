import * as cls from 'cls-hooked'
export function getClsHookData<T=string>(name:string,space = 'app'):T{
    return cls.getNamespace(space)?.get(name)||''
}