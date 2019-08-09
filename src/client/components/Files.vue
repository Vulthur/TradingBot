<template>
    <div id="action-main"> 
        <div class="row">
            <button @click='clickImportFile()'>Import</button>
            <input @change='importFile' accept=".json" ref='inputFile' type="file">
            <button @click='exportFile()'>Export</button>
            <a href='' ref='exportFile' download="data.json"></a>
        </div>
        <div class="error" v-if="error"> {{ error }} </div>
        <hr>
    </div>
</template>

<style scoped>
    #action-main {
        padding: 10px 10px;
    }
    input[type=file], a {
        display: none;
    }
</style>

<script lang="ts">
    import Vue from "vue";
    import { Strategy, StrategyJSON } from "../../core/Strategy/Strategy";
    import { StrategyBollinger, jsonToStrategyBollinger, aliasBollinger} from "../../core/Strategy/StrategyBollinger";
    import { StrategyTest, jsonToStrategyTest, aliasTest } from "../../core/Strategy/StrategyTest";
    import { Point, PointJSON } from "../../core/Point";
    import { Graph } from "../../core/Graph";

    // TODO ACCES LIST
    let ListStrategysJSONParser: {[index: string] : Function} = {};
    ListStrategysJSONParser[aliasBollinger] = jsonToStrategyBollinger;
    ListStrategysJSONParser[aliasTest] = jsonToStrategyTest;

    interface HTMLInputEvent extends Event {
        target: HTMLInputElement & EventTarget;
    }
    interface ResultFileReaderTxtLoad extends EventTarget {
        result: string;
    }

    // Internal Class for JSON
    class JSONFile {
        private points: Array<PointJSON>;
        private strategys: Array<StrategyJSON>;

        constructor(){
            this.points = new Array<PointJSON>();
            this.strategys = new Array<StrategyJSON>();
        }

        /**
         * Getter $points
         * @return {Array<PointJSON>}
         */
        public get $points(): Array<PointJSON> {
            return this.points;
        }
        /**
         * Getter $strategys
         * @return {Array<StrategyJSON>}
         */
        public get $strategys(): Array<StrategyJSON> {
            return this.strategys;
        }
        /**
         * Setter $points
         * @param {Array<PointJSON>} value
         */
        public set $points(value: Array<PointJSON>) {
            this.points = value;
        }
        /**
         * Setter $strategys
         * @param {Array<StrategyJSON>} value
         */
        public set $strategys(value: Array<StrategyJSON>) {
            this.strategys = value;
        }
    }
    
    export default Vue.extend({
        props: {
            // TODO waiting for commit PropTypes Vue JS
            datas: Object as () => Graph,
            strategys: Array as () => Array<Strategy>,
        },
        methods: {
            clickImportFile() {
                if(confirm("Do you want to import a file ? You will loose your current scene !"))
                    (this.$refs.inputFile as HTMLElement).click();
            },
            exportFile(){
                let jsonFile = new JSONFile()
                for (let i = 0; i < this.datas.$points.length; i++) {
                    jsonFile.$points.push(this.datas.$points[i].toJson())
                }
                for (let j = 0; j < this.strategys.length; j++) {
                    jsonFile.$strategys.push(this.strategys[j].toJsonExtend());
                }

                (this.$refs.exportFile as HTMLLinkElement).href = "data:text/json;charset=utf-8," 
                        + encodeURIComponent(JSON.stringify(jsonFile));       
                (this.$refs.exportFile as HTMLLinkElement).click();

            },
            importFile(e: HTMLInputEvent){
                if(e.target.files !== null && e.target.files.length !== 0){
                    let file: File = e.target.files[0];
                    this.error = "";
                    this.fileReader.readAsText(file, "utf-8");
                }
                // Reset for the onchange event
                (this.$refs.inputFile as HTMLInputElement).value = '';
            }
        },
        data() {
            return {
                error: "",
                fileReader: new FileReader()
            }
        },
        mounted() {
            this.fileReader.onload = (e: Event) => {
                let json: any;
                let text: string = (e.target as ResultFileReaderTxtLoad).result
                
                if(e.target !== null){
                    try {
                        json = JSON.parse(text);                       
                        if(!json.hasOwnProperty("points") || !(json.points instanceof Array) ||
                                !json.hasOwnProperty("strategys") || !(json.strategys instanceof Array))
                            throw new Error("Incorrect JSON structure { points:[], strategys:[] }");

                        let points = new Array<Point>();
                        for (let i = 0; i < json.points.length; i++) {
                            points.push(new Point(json.points[i].x, json.points[i].y));
                        }
                        this.$emit('update:points', points);

                        let strategys = new Array<Strategy>();
                        for (let i = 0; i < json.strategys.length; i++) {
                            if(ListStrategysJSONParser[json.strategys[i].alias]){
                                strategys.push(ListStrategysJSONParser[json.strategys[i].alias](json.strategys[i]))
                            } else {
                                throw new Error("Incorrect type of strategy" + json.strategys[i].alias);
                            }
                        }
                        this.$emit('update:strategys', strategys);
                        this.$nextTick(function() {
                            this.$emit('importFile');
                        });
                    } catch (error) {
                        console.error(error);
                        this.error = "Error JSON File : " + error;
                    }    
                }
            }
        }
    });
</script>