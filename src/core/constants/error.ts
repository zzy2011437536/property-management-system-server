import {Dictionary} from 'lodash'

class CodeAndMsg{
    CODE:number;
    MESSAGE:string;
}
export class ErrorCode{
    static readonly ERROR:CodeAndMsg = {
        CODE:-1,
        MESSAGE:'fail'
    }
    static readonly SUCCESS:CodeAndMsg = {
        CODE:200,
        MESSAGE:'success'
    }


    //user
    static readonly createUserError:CodeAndMsg = {
        CODE:1001,
        MESSAGE:'该账号已存在,请重新输入'
    }

    static readonly loginUserError:CodeAndMsg = {
        CODE:1002,
        MESSAGE:'账号或密码错误,请重新输入'
    }

    static readonly shutDownUserError:CodeAndMsg = {
        CODE:1003,
        MESSAGE:'账号封停,请联系管理员进行解封,管理员手机号:13704623526'
    }
    static readonly applyingUserError:CodeAndMsg = {
        CODE:1004,
        MESSAGE:'账号正在审批,请联系管理员进行审批,管理员手机号:13704623526'
    }
    static readonly applyRejectUserError:CodeAndMsg = {
        CODE:1005,
        MESSAGE:'账号审批被拒绝,请联系管理员问清缘由,管理员手机号:13704623526'
    }

    static CodeToMessage(code:number):string  {
        for(const key of Object.keys(this)){
            if((this as Dictionary<any>)[key].CODE===code){
                return (this as Dictionary<any>)[key].MESSAGE
            }
        }
        return ''
    }

    static HasCode(code:number):boolean  {
        for(const key of Object.keys(this)){
            if((this as Dictionary<any>)[key].CODE===code){
                return true
            }
        }
        return false
    }
}