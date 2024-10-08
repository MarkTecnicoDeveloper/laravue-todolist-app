<template>
    <div>
        <img
            v-if="spinner.verify_email"
            src="../assets/img/spinner.svg"
            class="inline-flex w-5 h-5"
        >

        <div
            v-if="responseApi.message"
            :class="`rounded-sm bg-${responseApi.color}-100 p-4 mb-4`"
        >
            <h3 :class="`text-sm leading-5 font-medium text-${responseApi.color}-800`">
                {{ responseApi.message }}
            </h3>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axiosClient from '../axios';
import messages from '../utils/messages';

const route = useRoute();

const token = ref('');

const responseApi = ref({
	color: '',
	message: '',
});

const spinner = ref({
	verify_email: false,
});

onMounted(() => {
	token.value = route?.query?.token || '';
	verifyEmail();
});

function verifyEmail() {
	spinner.value.verify_email = true;

	axiosClient
		.post('v1/verify-email', { token: token.value })
		.then((response) => {
			responseApi.value.color = 'green';
			responseApi.value.message = 'Email verificado com sucesso';
		})
		.catch((e) => {
			spinner.value.verify_email = false;

			const errorCode = e?.response?.data?.error || 'ServerError';

			responseApi.value.color = 'red';
			responseApi.value.message = messages[errorCode];
		})
		.finally(() => {
			spinner.value.verify_email = false;
		});
}
</script>