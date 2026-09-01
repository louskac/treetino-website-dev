import PreorderController from './PreorderController'
import WebhookController from './WebhookController'

const Api = {
    PreorderController: Object.assign(PreorderController, PreorderController),
    WebhookController: Object.assign(WebhookController, WebhookController),
}

export default Api