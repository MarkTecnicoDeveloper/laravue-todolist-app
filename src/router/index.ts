import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Auth from '../layouts/Auth.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import VerifyEmail from '../views/VerifyEmail.vue';
import ForgotPassword from '../views/ForgotPassword.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: Auth,
		children: [
			{
				path: '/login',
				name: 'login',
				component: Login,
			},
			{
				path: '/register',
				name: 'register',
				component: Register,
			},
			{
				path: '/verificar-email',
				name: 'verifyEmail',
				component: VerifyEmail,
				beforeEnter: (to, from, next) => {
					if (!to.query?.token) {
						next({ name: 'login' });
					}

					next();
				},
			},
			{
				path: '/esqueci-senha',
				name: 'forgotPassword',
				component: ForgotPassword,
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
