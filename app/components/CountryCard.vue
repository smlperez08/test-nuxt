<template>
    <NuxtLink :to="`/countries/${country.code}`" class="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-300">
        <div class="flex items-center gap-3">
            <span class="text-3xl">{{ country.emoji }}</span>
            <div class="min-w-0">
                <p class="font-semibold text-gray-900 truncate">{{ country.name }}</p>
                <p class="text-sm text-gray-500">{{ country.code }} · {{ country.continent.name }}</p>
            </div>
        </div>
    </NuxtLink>
</template>

<script setup lang="ts">
    defineProps<{ country: Country }>();
</script>
