import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Auth from '../layouts/Auth.vue';

const routes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		component: Auth,
		children: [
			{
				path: '',
				name: 'login',
				component: Login,
			},
			{
				path: '',
				name: 'register',
				component: Login,
			},
		],
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
