import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../wayfinder';
/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
});

login.definition = {
    methods: ['get', 'head'],
    url: '/login',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options);
};

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
const loginForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

login.form = loginForm;

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
export const logout = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
});

logout.definition = {
    methods: ['post'],
    url: '/logout',
} satisfies RouteDefinition<['post']>;

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options);
};

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
const logoutForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logoutForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: logout.url(options),
    method: 'post',
});

logout.form = logoutForm;

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
export const register = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
});

register.definition = {
    methods: ['get', 'head'],
    url: '/register',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options);
};

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: register.url(options),
    method: 'get',
});

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: register.url(options),
    method: 'head',
});

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
const registerForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: register.url(options),
    method: 'get',
});

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
registerForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: register.url(options),
    method: 'get',
});

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
registerForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: register.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

register.form = registerForm;

/**
 * @see \App\Http\Controllers\HomeController::home
 * @see app/Http/Controllers/HomeController.php:21
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
});

home.definition = {
    methods: ['get', 'head'],
    url: '/',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\HomeController::home
 * @see app/Http/Controllers/HomeController.php:21
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
    return home.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\HomeController::home
 * @see app/Http/Controllers/HomeController.php:21
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: home.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\HomeController::home
 * @see app/Http/Controllers/HomeController.php:21
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: home.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\HomeController::home
 * @see app/Http/Controllers/HomeController.php:21
 * @route '/'
 */
const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\HomeController::home
 * @see app/Http/Controllers/HomeController.php:21
 * @route '/'
 */
homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\HomeController::home
 * @see app/Http/Controllers/HomeController.php:21
 * @route '/'
 */
homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: home.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

home.form = homeForm;

/**
 * @see \App\Http\Controllers\ConfiguratorController::configurator
 * @see app/Http/Controllers/ConfiguratorController.php:21
 * @route '/configurator'
 */
export const configurator = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: configurator.url(options),
    method: 'get',
});

configurator.definition = {
    methods: ['get', 'head'],
    url: '/configurator',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ConfiguratorController::configurator
 * @see app/Http/Controllers/ConfiguratorController.php:21
 * @route '/configurator'
 */
configurator.url = (options?: RouteQueryOptions) => {
    return configurator.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ConfiguratorController::configurator
 * @see app/Http/Controllers/ConfiguratorController.php:21
 * @route '/configurator'
 */
configurator.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: configurator.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ConfiguratorController::configurator
 * @see app/Http/Controllers/ConfiguratorController.php:21
 * @route '/configurator'
 */
configurator.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: configurator.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ConfiguratorController::configurator
 * @see app/Http/Controllers/ConfiguratorController.php:21
 * @route '/configurator'
 */
const configuratorForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: configurator.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ConfiguratorController::configurator
 * @see app/Http/Controllers/ConfiguratorController.php:21
 * @route '/configurator'
 */
configuratorForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: configurator.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ConfiguratorController::configurator
 * @see app/Http/Controllers/ConfiguratorController.php:21
 * @route '/configurator'
 */
configuratorForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: configurator.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

configurator.form = configuratorForm;

/**
 * @see \App\Http\Controllers\Api\PreorderController::checkoutInitiate
 * @see app/Http/Controllers/Api/PreorderController.php:20
 * @route '/checkout'
 */
export const checkoutInitiate = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: checkoutInitiate.url(options),
    method: 'post',
});

checkoutInitiate.definition = {
    methods: ['post'],
    url: '/checkout',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Api\PreorderController::checkoutInitiate
 * @see app/Http/Controllers/Api/PreorderController.php:20
 * @route '/checkout'
 */
checkoutInitiate.url = (options?: RouteQueryOptions) => {
    return checkoutInitiate.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Api\PreorderController::checkoutInitiate
 * @see app/Http/Controllers/Api/PreorderController.php:20
 * @route '/checkout'
 */
checkoutInitiate.post = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: checkoutInitiate.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Api\PreorderController::checkoutInitiate
 * @see app/Http/Controllers/Api/PreorderController.php:20
 * @route '/checkout'
 */
const checkoutInitiateForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: checkoutInitiate.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Api\PreorderController::checkoutInitiate
 * @see app/Http/Controllers/Api/PreorderController.php:20
 * @route '/checkout'
 */
checkoutInitiateForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: checkoutInitiate.url(options),
    method: 'post',
});

checkoutInitiate.form = checkoutInitiateForm;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
export const dashboard = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
});

dashboard.definition = {
    methods: ['get', 'head'],
    url: '/dashboard',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options);
};

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
const dashboardForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
dashboardForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
});

/**
 * @see \Inertia\Controller::__invoke
 * @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
 * @route '/dashboard'
 */
dashboardForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

dashboard.form = dashboardForm;

/**
 * @see \App\Http\Controllers\Api\WebhookController::webhook
 * @see app/Http/Controllers/Api/WebhookController.php:14
 * @route '/webhook'
 */
export const webhook = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
});

webhook.definition = {
    methods: ['post'],
    url: '/webhook',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Api\WebhookController::webhook
 * @see app/Http/Controllers/Api/WebhookController.php:14
 * @route '/webhook'
 */
webhook.url = (options?: RouteQueryOptions) => {
    return webhook.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Api\WebhookController::webhook
 * @see app/Http/Controllers/Api/WebhookController.php:14
 * @route '/webhook'
 */
webhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: webhook.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Api\WebhookController::webhook
 * @see app/Http/Controllers/Api/WebhookController.php:14
 * @route '/webhook'
 */
const webhookForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: webhook.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Api\WebhookController::webhook
 * @see app/Http/Controllers/Api/WebhookController.php:14
 * @route '/webhook'
 */
webhookForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: webhook.url(options),
    method: 'post',
});

webhook.form = webhookForm;
