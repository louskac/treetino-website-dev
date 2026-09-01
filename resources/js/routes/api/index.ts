import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../wayfinder';
import checkoutFb28ab from './checkout';
/**
 * @see \App\Http\Controllers\ContactController::contact
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/api/contact'
 */
export const contact = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: contact.url(options),
    method: 'post',
});

contact.definition = {
    methods: ['post'],
    url: '/api/contact',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ContactController::contact
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/api/contact'
 */
contact.url = (options?: RouteQueryOptions) => {
    return contact.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ContactController::contact
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/api/contact'
 */
contact.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contact.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ContactController::contact
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/api/contact'
 */
const contactForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: contact.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ContactController::contact
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/api/contact'
 */
contactForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: contact.url(options),
    method: 'post',
});

contact.form = contactForm;

/**
 * @see \App\Http\Controllers\Api\PreorderController::checkout
 * @see app/Http/Controllers/Api/PreorderController.php:20
 * @route '/api/checkout'
 */
export const checkout = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
});

checkout.definition = {
    methods: ['post'],
    url: '/api/checkout',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Api\PreorderController::checkout
 * @see app/Http/Controllers/Api/PreorderController.php:20
 * @route '/api/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Api\PreorderController::checkout
 * @see app/Http/Controllers/Api/PreorderController.php:20
 * @route '/api/checkout'
 */
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Api\PreorderController::checkout
 * @see app/Http/Controllers/Api/PreorderController.php:20
 * @route '/api/checkout'
 */
const checkoutForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: checkout.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Api\PreorderController::checkout
 * @see app/Http/Controllers/Api/PreorderController.php:20
 * @route '/api/checkout'
 */
checkoutForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: checkout.url(options),
    method: 'post',
});

checkout.form = checkoutForm;

const api = {
    contact: Object.assign(contact, contact),
    checkout: Object.assign(checkout, checkoutFb28ab),
};

export default api;
