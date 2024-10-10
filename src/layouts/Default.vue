<template>
    <div>
        <TheHeader />

        <div class="px-3 py-10 md:px-10">
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts">
import TheHeader from '../components/Partials/TheHeader.vue';
</script>