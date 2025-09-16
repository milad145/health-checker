import Kavenegar from "kavenegar";

export default class SMSService {
    constructor({smsApiKey, blockSMS, baseUrl}) {
        this.baseUrl = baseUrl;
        this.smsApi = Kavenegar.KavenegarApi({
            ['api' + 'key']: smsApiKey
        });
        this.blockSMS = blockSMS;
    }

    async #sendSMSTemplate(receptor, token, token2, token3, template) {
        const __this = this;
        return new Promise((resolve, reject) => {
            token = token + ""
            if (this.blockSMS) {
                console.log(template, ' : ', receptor, ' : ', token)
                return resolve(true)
            }
            this.smsApi.VerifyLookup({
                receptor: receptor,
                token: typeof token === 'string' ? token.trim().replace(/ /g, '_') : undefined,
                token2: typeof token2 === 'string' ? token2.trim().replace(/ /g, '_') : undefined,
                token3: typeof token3 === 'string' ? token3.trim().replace(/ /g, '_') : undefined,
                template: template
            }, function (response, status) {
                if (status === 200)
                    resolve(true);
                else {
                    console.warn(`Sending SMS to ${receptor} failed with status code: ${status} (${__this.#errorMessage(status)})`)
                    reject({message: "Sending SMS failed!"})
                }
            })
        })
    }

    #errorMessage(code) {
        const errors = {
            400: "Parameters are incomplete",
            401: "The account has been disabled",
            402: "The operation was unsuccessful",
            403: "The API-Key identification code is not valid",
            404: "The method is unclear",
            405: "The Get / Post method is wrong",
            406: "Required parameters are blank",
            407: "Access to the information that you want is not possible",
            409: "The server is unable to respond. Try later",
            411: "Invalid receiver",
            412: "The sender is invalid",
            413: "The message is empty or the message length is too long. Latin characters and Farsi characters 268 characters",
            414: "The volume of the request exceeds the limit",
            415: "The start index is greater than the total number of numbers",
            416: "Requester IP address is not authorized in security settings",
            417: "The date is not valid, the value 0 means the current time and otherwise send the UnixTime format",
            418: "Your account credit is not enough",
            419: "The length of the text array and the receiver and transmitter are not the same size",
            422: "Data can not be processed due to inappropriate characters",
            424: "The template was not found",
            426: "Using this method requires advanced service",
            428: "Sending code via phone call is not possible",
            431: "The code structure is not correct",
            432: "The code parameter was not found in the text of the message"
        }

        if (errors.hasOwnProperty(code))
            return errors[code];

        return "";
    }

    async sendCode(phoneNumber, code) {
        return await this.#sendSMSTemplate(phoneNumber, code, null, null, 'barijanLogin')
    }
}
