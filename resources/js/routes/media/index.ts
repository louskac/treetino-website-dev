import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../wayfinder';
/**
 * @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/media'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/media',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/media'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/media'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/media'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/media'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/media'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\MediaController::index
 * @see app/Http/Controllers/MediaController.php:21
 * @route '/media'
 */
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

index.form = indexForm;

const media = {
    index: Object.assign(index, index),
};

export default media;
