<template>
    <div class="h-[300px]">
        <LoginMenu />
        <div v-if="responseApi.message" :class="`rounded-sm bg-${responseApi.color}-100 p-4 mb-4`">
            <h3 :class="`text-sm leading-5 font-medium text-${responseApi.color}-800`">
                {{ responseApi.message }}
            </h3>
        </div>
        <form @submit.stop.prevent="onSubmit">
            <div class="grid gap-2">
                <input
                    v-model="email"
                    v-bind="emailAttrs"
                    type="text"
                    placeholder="Digite seu e-mail"
                    class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                <div v-if="errors.email" class="text-red-500 text-sm mb-2">
                    {{ errors.email }}
                </div>
                <input
                    v-model="password"
                    v-bind="passwordAttrs"
                    type="password"
                    placeholder="Digite sua senha"
                    class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                <div v-if="errors.password" class="text-red-500 text-sm mb-2">
                    {{ errors.password }}
                </div>
                <button
                        type="submit"
                        :disabled="spinner.login"
                        class="flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 w-full appearance-none leading-normal"
                    >
                        <img v-if="spinner.login" src="../assets/img/spinner.svg" alt="" class="w-5 h-5 mr-2">
                        ENTRAR
                </button>
                <div class="my-4 text-center">
                    <RouterLink
                        :to="{ name: 'forgotPassword' }"
                        class="text-sm font-light"
                    >
                        Esqueci minha senha
                    </RouterLink>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import Cookie from 'js-cookie';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import * as yup from 'yup';
import axiosClient from '../axios';
import LoginMenu from '../components/Auth/LoginMenu.vue';
import { useUserStore } from '../store/userStore';
import messages from '../utils/messages';

const userStore = useUserStore();

const user = ref({
	email: '',
	password: '',
});

const responseApi = ref({
	color: '',
	message: '',
});

const spinner = ref({
	login: false,
});

const { errors, handleSubmit, defineField } = useForm({
	validationSchema: yup.object({
		email: yup
			.string()
			.email('Email deve ser um email válido')
			.required('El campo E-mail é obrigatorio'),
		password: yup
			.string()
			.min(6, 'A senha deve ter pelo menos 6 caracteres')
			.required('El campo Senha é obrigatorio'),
	}),
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

function onSuccess(values) {
	user.value.email = values.email;
	user.value.password = values.password;

	login();
}

function onInvalidSubmit() {}

const onSubmit = handleSubmit(onSuccess, onInvalidSubmit);

function login() {
	const payload = user.value;

	resetResponseApi();

	spinner.value.login = true;

	axiosClient
		.post('v1/login', payload)
		.then((response) => {
			const token = `${response.data.token_type} ${response.data.acess_token}`;
			Cookie.set('_todolist_token', token, { expires: 30 });
			userStore.user = response.data.data;
		})
		.catch((e) => {
			spinner.value.login = false;

			const errorCode = e?.response?.data?.error || 'ServerError';

			responseApi.value.color = 'red';
			responseApi.value.message = messages[errorCode];
		});
}

function resetResponseApi() {
	responseApi.value.color = '';
	responseApi.value.message = '';
}
</script>