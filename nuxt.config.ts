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
  },
  features: {
    // 強制將 CSS 內聯到 HTML 中，這能徹底解決「先看到 HTML 才看到樣式」的問題
    inlineStyles: true
  }
})