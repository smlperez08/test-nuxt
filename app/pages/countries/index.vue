<template>
    <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Pays</h1>

        <div class="flex flex-col sm:flex-row gap-3 mb-8">
            <div class="flex-1">
                <SearchInput v-model="search" />
            </div>
            <div class="sm:w-56">
                <ContinentSelect v-model="selectedContinent" :continents="continents || []" />
            </div>
        </div>

        <div v-if="errorCountries" class="text-center py-16">
            <p class="text-red-500 text-lg mb-4">❌ Une erreur est survenue</p>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" @click="() => refreshCountries()">Réessayer</button>
        </div>

        <div v-else-if="loadingCountries" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <SkeletonCard v-for="n in 20" :key="n" />
        </div>

        <template v-else>
            <p class="text-sm text-gray-500 mb-4">{{ filteredCountries.length }} pays</p>
            <div v-if="filteredCountries.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <CountryCard v-for="country in filteredCountries" :key="country.code" :country="country" />
            </div>
            <div v-else class="text-center py-16 text-gray-400">Aucun pays trouvé pour "{{ search }}"</div>
        </template>
    </div>
</template>

<script setup lang="ts">
    definePageMeta({ layout: "default" });
    useHead({ title: "Countries" });

    const route = useRoute();
    const router = useRouter();
    const { getCountries, getContinents } = useGraphql();

    const search = ref((route.query.q as string) || "");
    const selectedContinent = ref((route.query.continent as string) || "");

    const {
        data: countries,
        pending: loadingCountries,
        error: errorCountries,
        refresh: refreshCountries,
    } = await useAsyncData("countries", () => getCountries());

    const { data: continents } = await useAsyncData("continents", () => getContinents());

    // conserver les filtres en query string
    // ex: /countries?q=fra&continent=Europe
    watch([search, selectedContinent], ([q, continent]) => {
        router.replace({ query: { ...(q && { q }), ...(continent && { continent }) } });
    });

    const filteredCountries = computed(() => {
        if (!countries.value) return [];
        return countries.value.filter(c => {
            const matchSearch = c.name.toLowerCase().includes(search.value.toLowerCase());
            const matchContinent = !selectedContinent.value || c.continent.name === selectedContinent.value;
            return matchSearch && matchContinent;
        });
    });
</script>