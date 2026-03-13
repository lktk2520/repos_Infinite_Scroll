<template>
    <main>
        <h1>directive：指令</h1>
        <input v-model="message" placeholder="輸入文字..." />
        <p v-highlight:yellow>
            目前 message 的值是：{{ message }}
        </p>

        <hr>

        <input type="range" min="0" max="500" v-model="pinPadding" />
        <span> {{ pinPadding }} </span>
        <br />

        <input type="radio" id="top" value="top" v-model="direction" />
        <label for="top">top</label>

        <input type="radio" id="right" value="right" v-model="direction" />
        <label for="right">right</label>

        <input type="radio" id="bottom" value="bottom" v-model="direction" />
        <label for="bottom">bottom</label>

        <input type="radio" id="left" value="left" v-model="direction" />
        <label for="left">left</label>

        <p v-pin:[direction]="pinPadding">
            Direction: {{ direction }} , pinPadding: {{ pinPadding }}
        </p>
    </main>
</template>

<script setup lang="ts">
// import { ref, defineExpose } from 'vue';

const message = ref('Hello Vue!');
const count = ref(0);

const direction = ref('top');
const pinPadding = ref(100);

const vHighlight = {
    mounted: (el: any, binding: any) => {
        // 1. 取得 instance 本身
        const vm = binding.instance;

        console.log('--- 指令掛載成功 ---');

        // 2. 存取 instance 裡面的東西
        // 注意：在 <script setup> 中，必須透過 defineExpose 暴露出的屬性才能在這裡抓到
        console.log('取得 message:', vm.message);
        console.log('取得 count:', vm.count);

        // 設置背景顏色（來自 binding.arg）
        el.style.backgroundColor = binding.arg || 'red';
    },
    updated: (el: any, binding: any) => {
        // 當組件更新時再次查看
        console.log('組件更新，當前 message:', binding.instance.message);
    }
};

const vPin = {
    mounted(el: any, binding: any) {
        el.style.position = "fixed";
        el.style[binding.arg] = binding.value + "px";
    },
    updated(el: any, binding: any) {
        // 避免 top 與 bottom 或 left 與 right 同時出現
        switch (binding.arg) {
            case "bottom":
                el.style.top = "";
                break;
            case "top":
                el.style.bottom = "";
                break;
            case "right":
                el.style.left = "";
                break;
            case "left":
                el.style.right = "";
                break;
            // no default
        }
        el.style[binding.arg] = binding.value + "px";
    }
};

// 重點：必須 expose 才能讓指令透過 instance 抓到
defineExpose({
    message,
    count
});
</script>