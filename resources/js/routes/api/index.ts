import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ContactController::contact
* @see app/Http/Controllers/ContactController.php:31
* @route '/api/contact'
*/
export const contact = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contact.url(options),
    method: 'post',
})

contact.definition = {
    methods: ["post"],
    url: '/api/contact',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ContactController::contact
* @see app/Http/Controllers/ContactController.php:31
* @route '/api/contact'
*/
contact.url = (options?: RouteQueryOptions) => {
    return contact.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContactController::contact
* @see app/Http/Controllers/ContactController.php:31
* @route '/api/contact'
*/
contact.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: contact.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ContactController::contact
* @see app/Http/Controllers/ContactController.php:31
* @route '/api/contact'
*/
const contactForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: contact.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ContactController::contact
* @see app/Http/Controllers/ContactController.php:31
* @route '/api/contact'
*/
contactForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: contact.url(options),
    method: 'post',
})

contact.form = contactForm

const api = {
    contact: Object.assign(contact, contact),
}

export default api