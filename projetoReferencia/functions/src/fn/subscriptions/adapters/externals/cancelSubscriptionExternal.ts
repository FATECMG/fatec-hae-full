import axios from "axios";
import { config } from "firebase-functions";
import { injectable } from "inversify";
import { IExternal } from "../../../../shared/adapters/external/interfaces.external";

@injectable()
export class CancelSubscriptionExternal implements IExternal<string, void>{
    async call(id: string): Promise<void> {
        await axios({
            url: `https://api.pagar.me/core/v5/subscriptions/${id}`,
            method: 'DELETE',
            data: {
                cancel_pending_invoices: true,
            },
            auth: {
                username: config()?.payment?.key,
                password: '',
            },
        })
    }

}