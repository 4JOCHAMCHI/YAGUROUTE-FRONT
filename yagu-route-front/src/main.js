import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from '../src/router/router.js'
import vuetify from './plugins/vuetify.js'


const app = createApp(App);

app.use(router);
app.use(vuetify);
app.mount('#app');
app.provide('$axios', axios);