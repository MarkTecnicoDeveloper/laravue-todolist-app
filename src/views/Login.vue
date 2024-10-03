<template>
    <div class="h-[300px]">
        <LoginMenu />
        <div class="grid gap-2">
            <input
                v-model="user.email"
                type="text"
                placeholder="Digite seu e-mail"
                class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
            >
            <input
                v-model="user.password"
                type="password"
                placeholder="Digite sua senha"
                class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
            >
            <button
                    @click.stop.prevent="login()"
                    type="submit"
                    class="flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                    ENTRAR
            </button>
            <div class="my-4 text-center">
                <RouterLink
                    to=""
                    class="text-sm font-light"
                >
                    Esqueci minha senha
                </RouterLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import LoginMenu from '../components/Auth/LoginMenu.vue';
import { ref } from 'vue';
import axiosClient from '../axios';
import Cookie from 'js-cookie';
import { useUserStore } from '../store/userStore';

const userStore = useUserStore();

const user = ref({
	email: '',
	password: '',
});

function login() {
	const payload = user.value;

	axiosClient.post('v1/login', payload).then((response) => {
		const token = `${response.data.token_type} ${response.data.acess_token}`;
		Cookie.set('_todolist_token', token, { expires: 30 });
		userStore.user = response.data.data;
	});
}
</script>