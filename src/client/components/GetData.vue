<template>
    <div id="getdata-main">
        <form id="form-data" @submit.prevent="getData">
            <h2>Data</h2>
            <div class="row">
                <label for="plateform">Plateform</label>
                <select id="plateform" v-model="form.plateform">
                    <option v-for="plateform in plateforms" v-bind:key="plateform">
                        {{ plateform }}
                    </option>
                </select>
                <label for="format">Format</label>
                <select id="format" v-if="form.plateform" v-model="form.format">
                    <option v-for="format in formats" v-bind:key="format">
                        {{ format }}
                    </option>
                </select>
            </div>
            <div class="row">
                <label for="factorTime">Time Factor</label>
                <input type="number" id="factorTime" min="1" required v-model="form.factorTime">
                <label for="symbol">Symbol</label>
                <input type="text" id="symbol" required v-model="form.symbol">
            </div>
            <div class="row">
                <label for="nbData">Number of Data</label>
                <input type="number" id="nbData" min="2" max="10000" required v-model="form.nbData">
            </div>
            <div class="row">
                <label for="lastDate">End Date</label>
                <input id="lastDate" type="date" :max="maxDate" required v-model="form.lastDate">
            </div>
            <div class="row">
                <button type="submit">GET</button>
            </div>
        </form>
        <div class="error" v-if="error"> {{ error }} </div>
        <hr>
    </div>
</template>

<style scoped>
    #getdata-main {
        padding: 2px 10px;
    }
    #form-data {
        width: 100%;
    }
    button {
        font-weight: bolder;
    }
</style>

<script lang="ts">
    import Vue from "vue";
    import { PlaterformClient } from "../../config/ConfigClient";
    import { Graph } from "../../core/Graph";
    import { Point } from "../../core/Point";

    export default Vue.extend({
        methods: {
            getData(e: Event) {       

                // Call Server Side
                this.error = "";
                let form: {[index: string]: string} = this.form;
                this.$emit('loading');
                
                fetch('/api/getData',{
                    method: "POST",
                    body: JSON.stringify(form),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }).then((response) => {
                    if(response.status === 400){
                        throw new Error(response.statusText);
                    }
                    return response.json();
                }).then((json) => {;
                    let points = new Array<Point>();
                    for (let i = 0; i < json.length; i++) {
                        points.push(new Point(json[i].x, json[i].y));
                    }
                    this.$emit('update:points', points);
                    this.$emit('endLoading');
                }).catch((error) => {
                    this.error = error;
                    this.$emit('endLoading');
                })
            },
        },
        data() {
            return { 
                plateforms: Object.keys(PlaterformClient),
                formats: PlaterformClient.Bitmex.timeFormat,
                error: "",
                form: {
                    plateform: Object.keys(PlaterformClient)[0],
                    nbData: "750",
                    format: PlaterformClient.Bitmex.timeFormat[0],
                    factorTime: "1",
                    symbol: "ADAH19",
                    lastDate: 
                        new Date().getFullYear() + "-" +
                        (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" +
                        (new Date().getDate() < 10 ? "0" + (new Date().getDate() + 1) : (new Date().getDate() + 1)),
                },
                maxDate: new Date().getFullYear() + "-" +
                        (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" +
                        (new Date().getDate() < 10 ? "0" + (new Date().getDate() + 1) : (new Date().getDate() + 1)),
            }
        },
    });
</script>
