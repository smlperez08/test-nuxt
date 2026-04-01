<template>
    <div class="relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
            type="text"
            :value="props.modelValue"
            placeholder="Rechercher un pays..."
            class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white"
            @input="onInput"
        />
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{ modelValue: string }>();
    const emit = defineEmits<{ "update:modelValue": [value: string] }>();

    let debounceTimer: ReturnType<typeof setTimeout>;

    function onInput(e: Event) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            emit("update:modelValue", (e.target as HTMLInputElement).value);
        }, 250);
    }
</script>
