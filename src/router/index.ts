import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Auth from '../layouts/Auth.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import VerifyEmail from '../views/VerifyEmail.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';
import Default from '../layouts/Default.vue';
import Home from '../views/Home.vue';
import Guard from '../service/middleware';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/',
		component: Default,
		beforeEnter: Guard.redirectIfNotAuthenticated,
		children: [
			{
				path: '',
				name: 'index',
				component: Home,
			},
		],
	},
	{
		path: '/login',
		component: Auth,
		beforeEnter: Guard.redirectIfAuthenticated,
		children: [
			{
				path: '',
				name: 'login',
				component: Login,
			},
		],
	},
	{
		path: '/register',
		component: Auth,
		children: [
			{
				path: '',
				name: 'register',
				component: Register,
			},
		],
	},
	{
		path: '/verificar-email',
		component: Auth,
		beforeEnter: (to, from, next) => {
			if (!to.query?.token) {
				next({ name: 'login' });
			}

			next();
		},
		children: [
			{
				path: '',
				name: 'verifyEmail',
				component: VerifyEmail,
			},
		],
	},
	{
		path: '/esqueci-senha',
		component: Auth,
		children: [
			{
				path: '',
				name: 'forgotPassword',
				component: ForgotPassword,
			},
		],
	},
	{
		path: '/recuperar-senha',
		component: Auth,
		beforeEnter: (to, from, next) => {
			if (!to.query?.token) {
				next({ name: 'login' });
			}

			next();
		},
		children: [
			{
				path: '',
				name: 'resetPassword',
				component: ResetPassword,
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
