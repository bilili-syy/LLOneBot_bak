import SendMsg from "./SendMsg";
import {ActionName, BaseCheckResult} from "../types";
import {OB11PostSendMsg} from "../../types";

class SendPrivateMsg extends SendMsg {
    actionName = ActionName.SendPrivateMsg

    protected async check(payload: OB11PostSendMsg): Promise<BaseCheckResult> {
        payload.message_type = "private"
        return super.check(payload);
    }
}

export default SendPrivateMsg