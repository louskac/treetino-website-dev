import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PreorderController::initiate
* @see app/Http/Controllers/Api/PreorderController.php:20
* @route '/api/checkout/initiate'
*/
export const initiate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(options),
    method: 'post',
})

initiate.definition = {
    methods: ["post"],
    url: '/api/checkout/initiate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PreorderController::initiate
* @see app/Http/Controllers/Api/PreorderController.php:20
* @route '/api/checkout/initiate'
*/
initiate.url = (options?: RouteQueryOptions) => {
    return initiate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PreorderController::initiate
* @see app/Http/Controllers/Api/PreorderController.php:20
* @route '/api/checkout/initiate'
*/
initiate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PreorderController::initiate
* @see app/Http/Controllers/Api/PreorderController.php:20
* @route '/api/checkout/initiate'
*/
const initiateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: initiate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PreorderController::initiate
* @see app/Http/Controllers/Api/PreorderController.php:20
* @route '/api/checkout/initiate'
*/
initiateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: initiate.url(options),
    method: 'post',
})

initiate.form = initiateForm

const checkout = {
    initiate: Object.assign(initiate, initiate),
}

export default checkout