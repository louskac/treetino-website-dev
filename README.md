# Treetino Corp. Website

## Version & Client Info

Version 0.0.1 - Development

**Treetino Corp. s.r.o.**

Main Contact:  
Dominik Mašek  
+420 730 587 857

Graphics (Brand & Brand Manual Compliance):  
Tomáš Petera  
+420 722 221 334

## Description

## Conventions
### Components

#### Layouts
Every page uses `{ Head }` component imported from `@inertiajs/vue3`

Every page uses `DefaultLayout.vue` imported from `@/layouts/DefaultLayout.vue`

Visual page content shall be inserted inside `DefaultLayout`, otherwise it will be ignored and fail silently

#### Individual Pages
All significant parts of the website should be broken down to individual components. This ensures precise debugging 
of individual functions.

Significant parts: Content of page components stored in `resources/js/pages` divided into `<section>` tags.

Example:
- Home/Index.vue
  - HomeHero.vue
  - HomeCtaTop.vue
  - HomeFeatures.vue
  - HomeInfo.vue
  - HomeNumbers.vue
  - CtaGeneric.vue
  - Configurator.vue

### Component Hierarchy
- Component - Vue Component File
  - Template `<template>`
    - Section `<section>`
      - Absolute Division `<div>`
      - Relative Division (Main Container) `<div>`

### Main Container
This class list is used in the first relatively positioned  `<div>` in the master `<section>` 

`w-full max-w-[1200px] justify-between p-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]`

Optimized for ideal viewing on all devices:
- Mobile Phones: 100% of allowed viewport width (avw)
- Small (40rem / 640px or larger): 500px
- Medium (48rem / 768px or larger): 700px
- Large (64rem / 1024px or larger): 200px narrower than avw
- Extra Large (80rem / 1280px or larger): 400px narrower than avw
- Larger (Ultrawide monitors and Specialised Viewing): Width limited at 1200px

