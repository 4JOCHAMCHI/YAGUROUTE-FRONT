import { createRouter, createWebHistory } from 'vue-router';
import MainComponent from '../components/MainComponent.vue';
import TicketBookingView from '../views/TicketBookingView.vue';
import MainAfter from "../components/MainAfter.vue";
import SignIn from "@/views/SignIn.vue";
import SignUp from "@/views/SignUp.vue";

const routes = [
    {
        path: '/',
        name: 'MainComponent',
        component: MainComponent
    },
    {
        path: '/dashboard',
        name: 'MainAfter',
        component: MainAfter
    },
    {
        path: '/booking/:gameId',
        name: 'TicketBookingView',
        component: TicketBookingView,
        props: true
    },
    {
        path: '/signin',
        name: 'SignIn',
        component: SignIn,
        props: true
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp,
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
