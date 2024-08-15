import { createRouter, createWebHistory } from 'vue-router';
import MainComponent from '../components/MainComponent.vue';
import TicketBookingView from '../views/TicketBookingView.vue';

const routes = [
    {
        path: '/',
        name: 'MainComponent',
        component: MainComponent
    },
    {
        path: '/booking/:gameId', // gameId를 URL 파라미터로 받음
        name: 'TicketBookingView',
        component: TicketBookingView,
        props: true
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
