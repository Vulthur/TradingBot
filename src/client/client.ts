import Vue from "vue";
import MainComponent from "./components/Main.vue";

//export const EventBus = new Vue();
let vue = new Vue({
    el: "#app",
    template: `
        <MainComponent></MainComponent>
    `,
    components: {
        MainComponent
    },
});
