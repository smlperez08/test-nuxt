<template>
    <div>
        <NuxtLink :to="{ path: '/countries', query: backQuery }" class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
            ← Retour
        </NuxtLink>

        <div v-if="error" class="text-center py-16 text-red-500">❌ Pays introuvable</div>

        <div v-else-if="pending" class="space-y-4">
            <div class="h-10 bg-gray-200 rounded w-1/3"></div>
            <div class="h-4 bg-gray-100 rounded w-1/4"></div>
        </div>

        <template v-else-if="country">
            <div class="bg-white rounded-xl border border-gray-200 p-8 mb-8">
                <div class="flex items-center gap-4 mb-6">
                    <span class="text-6xl">{{ country.emoji }}</span>
                    <div>
                        <h1 class="text-3xl font-bold text-gray-900">{{ country.name }}</h1>
                        <p class="text-gray-500">{{ country.code }} · {{ country.continent.name }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                        <p class="text-xs text-gray-400 uppercase mb-1">Capitale</p>
                        <p class="font-medium text-gray-800">{{ country.capital || "—" }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                        <p class="text-xs text-gray-400 uppercase mb-1">Devise</p>
                        <p class="font-medium text-gray-800">{{ country.currency || "—" }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                        <p class="text-xs text-gray-400 uppercase mb-1">Continent</p>
                        <p class="font-medium text-gray-800">{{ country.continent.name }}</p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                        <p class="text-xs text-gray-400 uppercase mb-1">Langues</p>
                        <p class="font-medium text-gray-800">
                            {{ country.languages.map(l => l.name).join(", ") || "—" }}
                        </p>
                    </div>
                </div>
            </div>

            <div v-if="neighbors.length">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Pays du même continent</h2>
                <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <CountryCard v-for="c in neighbors" :key="c.code" :country="c" />
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
    const route = useRoute();
    const code = route.params.code as string;

    const { getCountryByCode } = useGraphql();

    const { data: country, pending, error } = await useAsyncData(`country-${code}`, () => getCountryByCode(code));

    useHead({
        title: country.value ? `${country.value.name} - Countries` : "Countries",
    });

    // Voisins du même continent (5 max)
    const neighbors = computed(() => country.value?.continent.countries.filter(c => c.code !== code).slice(0, 5) ?? []);

    // Récupère les query params pour le bouton retour
    const route2 = useRoute();
    const backQuery = computed(() => {
        const q = route2.query.q;
        const continent = route2.query.continent;
        return { ...(q && { q }), ...(continent && { continent }) };
    });
</script>
