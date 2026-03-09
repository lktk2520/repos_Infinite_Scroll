// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  runtimeConfig: {
    // 只能在伺服器端讀取
    githubToken: process.env.NUXT_GITHUB_TOKEN,
    // 如果你的 $fetch 是在前端 (.vue) 執行的，必須放在 public 內
    public: {
      githubToken: process.env.NUXT_GITHUB_TOKEN
    }
  }
})