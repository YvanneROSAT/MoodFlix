import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './assets/globals.css';
import './config/axios';
import './styles/global.css';

const app = createApp(App);
app.use(createPinia());
app.mount('#app'); 