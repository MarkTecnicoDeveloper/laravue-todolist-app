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
                <div class="flex">
                    <div class="w-1/2 mr-2">
                        <input
                            v-model="first_name"
                            v-bind="first_nameAttrs"
                            type="text"
                            placeholder="Digite seu nome"
                            class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                        >
                        <div v-if="errors.firstName" class="text-red-500 text-sm mb-2">
                            {{ errors.firstName }}
                        </div>
                    </div>
                    <div class="w-1/2">
                        <input
                            v-model="last_name"
                            v-bind="last_nameAttrs"
                            type="text"
                            placeholder="Digite seu sobrenome"
                            class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                        >
                    </div>
                </div>
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
                    :disabled="spinner.register"
                    class="flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 w-full appearance-none leading-normal"
                >
                    <img v-if="spinner.register" src="../assets/img/spinner.svg" alt="" class="w-5 h-5 mr-2">
                    REGISTRAR
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import LoginMenu from '../components/Auth/LoginMenu.vue';
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import axiosClient from '../axios';
import messages from '../utils/messages';

const user = ref({
	first_name: '',
	last_name: '',
	email: '',
	password: '',
});

const responseApi = ref({
	color: '',
	message: '',
});

const spinner = ref({
	register: false,
});

const { errors, handleSubmit, defineField, setValues } = useForm({
	validationSchema: yup.object({
		first_name: yup.string().required('El campo Primeiro nome é obrigatorio'),
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

const [first_name, first_nameAttrs] = defineField('first_name');
const [last_name, last_nameAttrs] = defineField('last_name');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');

function onSuccess(values) {
	user.value.first_name = values.first_name;
	user.value.last_name = values.last_name;
	user.value.email = values.email;
	user.value.password = values.password;

	register();
}

function onInvalidSubmit() {}

const onSubmit = handleSubmit(onSuccess, onInvalidSubmit);

function register() {
	const payload = user.value;

	resetResponseApi();

	spinner.value.register = true;

	axiosClient
		.post('v1/register', payload)
		.then(() => {
			responseApi.value.color = 'green';
			responseApi.value.message = 'Seu cadastro foi feito com sucesso';

			resetForm();
		})
		.catch((e) => {
			spinner.value.register = false;

			const errorCode = e?.response?.data?.error || 'ServerError';

			responseApi.value.color = 'red';
			responseApi.value.message = messages[errorCode];
		})
		.finally(() => {
			spinner.value.register = false;
		});
}

function resetResponseApi() {
	responseApi.value.color = '';
	responseApi.value.message = '';
}

function resetForm() {
	setValues({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
	});

	user.value.first_name = '';
	user.value.last_name = '';
	user.value.email = '';
	user.value.password = '';
}
</script>