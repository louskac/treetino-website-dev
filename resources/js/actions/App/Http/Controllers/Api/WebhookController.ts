import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\WebhookController::webhook
* @see app/Http/Controllers/Api/WebhookController.php:14
* @route '/webhook'
*/
export const webhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

webhook.definition = {
    methods: ["post"],
    url: '/webhook',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\WebhookController::webhook
* @see app/Http/Controllers/Api/WebhookController.php:14
* @route '/webhook'
*/
webhook.url = (options?: RouteQueryOptions) => {
    return webhook.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\WebhookController::webhook
* @see app/Http/Controllers/Api/WebhookController.php:14
* @route '/webhook'
*/
webhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\WebhookController::webhook
* @see app/Http/Controllers/Api/WebhookController.php:14
* @route '/webhook'
*/
const webhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: webhook.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\WebhookController::webhook
* @see app/Http/Controllers/Api/WebhookController.php:14
* @route '/webhook'
*/
webhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: webhook.url(options),
    method: 'post',
})

webhook.form = webhookForm

const WebhookController = { webhook }

export default WebhookController