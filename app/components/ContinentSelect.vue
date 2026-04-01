<template>
    <select
        :value="modelValue"
        class="w-full py-2.5 px-3 rounded-lg border border-gray-300 bg-white"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
        <option value="">Tous les continents</option>
        <option v-for="c in continents" :key="c.code" :value="c.name">
            {{ c.name }}
        </option>
    </select>
</template>

<script setup lang="ts">
    defineProps<{ modelValue: string; continents: Continent[] }>();
    defineEmits<{ "update:modelValue": [value: string] }>();
</script>