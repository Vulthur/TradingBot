<template>
    <div id="main">
        <LoadingComponent
            v-show="isLoading"
            ref="LoadingComponent"
        >
        </LoadingComponent>    
        <GraphComponent 
            :datas="datas"
            :strategys="strategys" 
            :hidedStrategy="hidedStrategy"
            :currentStrategy="currentStrategy"
            :currentAction="currentAction"
            v-on:loading="loading"
            v-on:endLoading="endLoading"
            ref="GraphComponent">
        </GraphComponent>
        <div id="input-main">
            <FilesComponent
                v-bind:strategys.sync="strategys"
                v-bind:points.sync="datas.$points"
                v-on:importFile="importFile"
                v-bind:datas.sync="datas">
            </FilesComponent>
            <GetDataComponent 
                v-bind:points.sync="datas.$points"
                v-on:loading="loading"
                v-on:endLoading="endLoading"
                ref="GetDataComponent">
            </GetDataComponent>
            <StrategysComponent 
                v-bind:strategys.sync="strategys"
                v-bind:hidedStrategy.sync="hidedStrategy"
                v-bind:currentStrategy.sync="currentStrategy"
                v-bind:currentAction.sync="currentAction"
                v-on:loading="loading"
                ref="StrategysComponent">
            </StrategysComponent>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import GraphComponent from "./Graph.vue";
    import LoadingComponent from "./Loading.vue";
    import GetDataComponent from "./GetData.vue";
    import StrategysComponent from "./Strategys/Strategys.vue";
    import FilesComponent from "./Files.vue";
    import { Graph } from "../../core/Graph";
    import { Strategy } from "../../core/Strategy/Strategy";
    import { Point } from "../../core/Point";
    import { Action } from "../../core/Action/Action";

    // Interface references
    interface vueStartegys extends Vue {
        insertStrats() : void
    }

    export default Vue.extend({
        methods: {
            importFile() {
                (this.$refs.StrategysComponent as vueStartegys).insertStrats();
            },
            loading(){
                this.isLoading = true;
                this.$forceUpdate();
                console.log("Go " + Date.now());       
            },
            endLoading(){
                this.isLoading = false;
                console.log("Sp " + Date.now());
            },
        },
        components: {
            GraphComponent,
            GetDataComponent,
            StrategysComponent,
            FilesComponent,
            LoadingComponent
        },
        data() {
            return {
                datas: new Graph("mainGraph", [], 0xFFFFFF, 0),
                strategys: new Array<Strategy>(),
                hidedStrategy: new Array<Strategy>(),
                currentStrategy: {},
                currentAction:  {},
                isLoading: false as boolean,
            }
        }
    });
</script>

<style>
    * { margin:0; padding:0; }
    body, html, #main {
        height: 100%;
        width: 100%;
        font-family: "Calibri", sans-serif;
    }
    #main {
        display: flex;
    }
    #input-main {
        width: 22%;
        height: 100%;
        background: #1e1e1e;
        color: #fcfcfc;
        overflow-y: scroll;
    }
    .row {
        display: flex;
        margin: 5px 0;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
    }
    .row > * {
        flex-grow: 1;
        flex-basis: 0;
        margin: 1px 7px;
        min-width: 0;
        word-break: break-all;
    }
    .row > button {
        margin: 8px 7px;
    }
    .error {
        color: #d22e2e;
        text-align: center;
        font-weight: bold;
    }
    h2, h3 {
        margin: 4px 0 8px 0;
        text-align: center;
    }
    select, input[type="text"],
    input[type="number"],
    input[type="date"] {
        text-align: center;
        font-family: "Calibri", sans-serif;
        padding : 3px 0;
        border: 0;
    }
    select, input[type="text"],
    input[type="number"] {
        width: 17%;
    }
    select:focus,
    input[type="number"]:focus,
    input[type=text]:focus,
    input[type="date"]:focus,
    button:focus {
        outline:0;
    }
    input[type="number"]:focus,
    input[type=text]:focus {
        background-color: rgb(181, 213, 255);
    }
    button {
        font-family: "Calibri", sans-serif;
        background:  rgb(62, 140, 197);
        background-image: radial-gradient(rgb(43, 113, 163) 65%, rgb(56, 128, 180));
        border: 1px solid #313131;
        height: 25px;
        color: rgb(252, 252, 252);
        cursor: pointer;
        letter-spacing: 2px; 
    }
    button:hover {
        background-image: radial-gradient(rgb(66, 127, 172) 45%, rgb(76, 137, 180));
    }
    hr {
        background-color: #313131;
        width: 100%;
        height: 1px;
        border: 0;
    }
</style>