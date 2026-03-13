// app/plugins/directives.ts
export default defineNuxtPlugin((nuxtApp) => {
  // 註冊 v-highlight 指令
  nuxtApp.vueApp.directive('highlight', {
    mounted(el, binding) {
      el.style.backgroundColor = binding.value || 'yellow'
    }
  })
})