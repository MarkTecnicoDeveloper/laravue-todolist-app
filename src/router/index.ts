import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Auth from '../layouts/Auth.vue';

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
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
