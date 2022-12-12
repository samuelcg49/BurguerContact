import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home';
import Error from './views/Error';
import Login from './views/Login';
import SignUp from './views/SignUp';
import Dashboard from './views/Dashboard';
import Edit from './views/Edit';
import ForgotPassword from './views/ForgotPassword';

import { auth } from './utils/firebase'

Vue.use(VueRouter);

export const router = new VueRouter({
    base: '/',
    mode: 'history',
    routes: [
        { path: '/', name: "home", component: Home, meta: { rutaLibre: true } },
        { path: '*', redirect: '/404' },
        { path: "/404", name: "error", component: Error },
        { path: '/login', name: "login", component: Login },
        { path: '/sign-up', name: "signup", component: SignUp },
        { path: '/dashboard', name: "dashboard", component: Dashboard, meta: { autentificado: true } },
        { path: '/edit/:contacto', name: "edit", component: Edit, props: true, meta: { autentificado: true } },
        { path: '/forgot-password', name: "forgotpassword", component: ForgotPassword }
    ]
});

router.beforeEach((to, from, next) => {

    if (auth.currentUser) { //Si hay un usuario logueado, guardamos el valor de su verificacion: "true" ó "false"
        var usuario = auth.currentUser.emailVerified;
    }

    let autentificacion = to.matched.some(record => record.meta.autentificado)

    let rutaLibre = to.matched.some(record => record.meta.rutaLibre)

    if (rutaLibre) {
        next()
    } else if (autentificacion && !usuario) {
        next("login")
    } else if (!autentificacion && usuario) {
        next("dashboard")
    } else {
        next()
    }
})  