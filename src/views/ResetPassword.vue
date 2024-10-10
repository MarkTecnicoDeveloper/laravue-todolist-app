<template>
    <div>
        <h3 class="py-2 mb-8 text-gray-500 text-lg font-medium text-center">
            Recuperar senha
        </h3>
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
                    type="email"
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
                    :disabled="spinner.reset_password"
                    class="flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 w-full appearance-none leading-normal"
                >
                    <img v-if="spinner.reset_password" src="../assets/img/spinner.svg" alt="" class="w-5 h-5 mr-2">
                    ALETRAR SENHA
                </button>
                <div class="my-4 text-center">
                    <RouterLink
                        :to="{ name: 'login' }"
                        class="text-sm font-light"
                    >
                        Login
                    </RouterLink>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import axiosClient from '../axios';
import messages from '../utils/messages';

const route = useRoute();

const user = ref({
	email: '',
	password: '',
	token: '',
});

const responseApi = ref({
	color: '',
	message: '',
});

const spinner = ref({
	reset_password: false,
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

	resetPassword();
}

function onInvalidSubmit() {}

const onSubmit = handleSubmit(onSuccess, onInvalidSubmit);

onMounted(() => {
	user.value.token = route?.query?.token || '';
});

function resetPassword() {
	const payload = user.value;

	resetResponseApi();

	spinner.value.reset_password = true;

	axiosClient
		.post('v1/reset-password', payload)
		.then(() => {
			responseApi.value.color = 'green';
			responseApi.value.message = 'Senha alterada com suceso!';
		})
		.catch((e) => {
			spinner.value.reset_password = false;

			const errorCode = e?.response?.data?.error || 'ServerError';

			responseApi.value.color = 'red';
			responseApi.value.message = messages[errorCode];
		})
		.finally(() => {
			spinner.value.reset_password = false;
		});
}

function resetResponseApi() {
	responseApi.value.color = '';
	responseApi.value.message = '';
}
</script>