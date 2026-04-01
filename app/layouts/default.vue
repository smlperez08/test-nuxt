<template>
    <div class="min-h-screen bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-6 py-4">
            <NuxtLink to="/countries" class="text-xl font-bold text-blue-600 hover:text-blue-700"> 🌍 Countries </NuxtLink>
        </header>
        <main class="max-w-7xl mx-auto px-4 py-8">
            <slot />
        </main>
    </div>
</template>
