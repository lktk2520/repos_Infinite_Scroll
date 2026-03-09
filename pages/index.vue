<!-- <template>
    <main class="home-page">
        <h1>您好！這是無限滾動專案示例</h1>
        <p>
            Data source: GitHub REST API (Author: microsoft)
        </p>
        <p>
            Author: 陳允中(Henrry)
        </p>
        <div class="container">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>title</th>
                            <th>description</th>
                            <th>url</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template v-for="item in repos" :key=item.id>
                            <tr>
                                <td data-label="Title">{{ item.name }}</td>
                                <td data-label="Description">{{ item.description }}</td>
                                <td data-label="URL">
                                    <a :href="item.html_url" target="_blank">{{ item.html_url }}</a>
                                </td>
                            </tr>
                        </template>
                        <tr ref="loadMoreTrigger" class="loading-trigger">
                            <td colspan="3" style="vertical-align: middle;">
                                <p v-if="isLoading">載入中...</p>
                                <p v-if="isAll">已載入所有資料</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>



    </main>
</template>
<script setup>
//資料
const repos = ref([])

//初始化的30筆
const downloaded_Page = ref(30)

//新的repos從第4頁開始載入
const page = ref(4)

//讀取中
const isLoading = ref(true)

//已載入所有資料
const isAll = ref(false)

//定義螢幕觀察者
const loadMoreTrigger = ref(null); // 對應 HTML 中的 ref

//觀察者實體
let observer = null;

//取得環境變數token
const config = useRuntimeConfig()

//初始取得前30筆repos
const fetchRepos_init = async () => {
    try {
        const token = config.public.githubToken
        const data = await $fetch(`https://api.github.com/orgs/microsoft/repos?per_page=${downloaded_Page.value}&sort=updated`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json'
            }
        })
        repos.value = data
        if (data.length == 0) {
            isAll.value = true
        }
    } catch (error) {
        console.error('抓取失敗:', error)
    } finally {
        isLoading.value = false
    }
}

//根據滑動載入新的頁面(資料)
/* per_page：每一頁要顯示幾個（最高可設為 100）。
 page：你要看第幾頁。*/

const fetchRepos_addPage = async () => {
    try {
        console.log(page.value)
        const token = config.public.githubToken
        const data = await $fetch(`https://api.github.com/orgs/microsoft/repos?per_page=10&page=${page.value}&sort=updated`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json'
            }
        })
        repos.value = [...repos.value, ...data]
        if (data.length == 0) {
            isAll.value = true
        }
    } catch (error) {
        console.error('抓取失敗:', error)
    } finally {

        page.value++
        isLoading.value = false
    }
}

onMounted(() => {
    fetchRepos_init()
    //實例化觀察者
    observer = new IntersectionObserver((entries) => {


        if (page.value > 6) {
            isAll.value = true
            return
        }
        // entries[0] 就是我們的 loadMoreTrigger
        if (entries[0].isIntersecting && !isLoading.value) {
            console.log("偵測到觸底，載入下一頁...");
            isLoading.value = true;
            fetchRepos_addPage();
        }
    }, {
        root: null, // 預設為瀏覽器視窗
        rootMargin: '0px 0px 200px 0px', // 提早 200px 觸發，使用者體驗更好，不會看到斷層
        threshold: 0.1 // 哨兵出現 10% 就觸發
    });

    //
    if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value);
    }
})

//清理，避免記憶體洩漏
onUnmounted(() => {
    if (observer) observer.disconnect();
});
</script> -->

<template>
    <main class="home-page">
        <h1>您好！這是無限滾動專案示例</h1>
        <p>Data source: GitHub REST API (Author: microsoft)</p>
        <p>Author: 陳允中(Henrry)</p>
        <div class="container">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>title</th>
                            <th>description</th>
                            <th>url</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in repos" :key="item.id">
                            <td data-label="Title">{{ item.name }}</td>
                            <td data-label="Description">{{ item.description }}</td>
                            <td data-label="URL">
                                <a :href="item.html_url" target="_blank">{{ item.html_url }}</a>
                            </td>
                        </tr>
                        <tr ref="loadMoreTrigger" class="loading-trigger">
                            <td colspan="3" style="vertical-align: middle;">
                                <p v-if="isLoading">載入中...</p>
                                <p v-if="isAll">已載入所有資料</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 1. 定義我們「最終想要」的資料結構
interface RepoItem {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
}

// 2. 定義 GitHub API 回傳的原始完整結構 (部分定義即可)
interface GitHubRawResponse {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    [key: string]: any;
}

// 使用處理後的類型 RepoItem
const repos = ref<RepoItem[]>([])
const downloaded_Page = ref<number>(30)
const page = ref<number>(4)
const isLoading = ref<boolean>(true)
const isAll = ref<boolean>(false)
const loadMoreTrigger = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null
const config = useRuntimeConfig()

/**
 * 物件處理函式：將 API 回傳的原始物件轉換為我們需要的格式
 */
const transformRepo = (data: GitHubRawResponse[]): RepoItem[] => {
    return data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        html_url: item.html_url
    }))
}

// 初始取得前30筆
const fetchRepos_init = async () => {
    try {
        const token = config.public.githubToken
        const data = await $fetch<GitHubRawResponse[]>(`https://api.github.com/orgs/microsoft/repos?per_page=${downloaded_Page.value}&sort=updated`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json'
            }
        })

        // --- 在這裡處理物件 ---
        repos.value = transformRepo(data)

        if (data.length === 0) isAll.value = true
    } catch (error) {
        console.error('抓取失敗:', error)
    } finally {
        isLoading.value = false
    }
}

// 根據滑動載入新的頁面
const fetchRepos_addPage = async () => {
    try {
        const token = config.public.githubToken
        const data = await $fetch<GitHubRawResponse[]>(`https://api.github.com/orgs/microsoft/repos?per_page=10&page=${page.value}&sort=updated`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github+json'
            }
        })

        // --- 在這裡處理物件並合併 ---
        const newRepos = transformRepo(data)
        repos.value = [...repos.value, ...newRepos]

        if (data.length === 0) isAll.value = true
    } catch (error) {
        console.error('抓取失敗:', error)
    } finally {
        page.value++
        isLoading.value = false
    }
}

onMounted(() => {
    fetchRepos_init()

    observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
        if (page.value > 6) {
            isAll.value = true;
            return;
        }

        // 使用 optional chaining (?.) 確保 entry 存在
        if (entries[0]?.isIntersecting && !isLoading.value) {
            console.log("偵測到觸底...");
            isLoading.value = true;
            fetchRepos_addPage();
        }
    }, {
        root: null,
        rootMargin: '0px 0px 200px 0px',
        threshold: 0.1
    });

    if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value);
    }
})

onUnmounted(() => {
    if (observer) observer.disconnect();
});
</script>
<style lang="scss" scoped>
h1,
p {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
}



.container {
    max-width: 1000px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: 'Inter', system-ui, sans-serif;

    .table-container {
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
        background: white;

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;

            @include respond-to('lg') {
                border: 0;

                thead {
                    display: none; // 隱藏原本的表頭
                }

                tr {
                    display: block; // 讓每一列變成一個獨立區塊
                    margin-bottom: 1.5rem;
                    border: 1px solid #eee;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                    background: #fff;
                    padding: 10px;
                }

                td {
                    display: flex; // 讓內容與標籤橫向排列
                    justify-content: flex-start;
                    align-items: center;
                    border-bottom: 1px solid #f0f0f0;
                    padding: 12px 8px;
                    text-align: left;
                    font-size: 0.9rem;

                    &:last-child {
                        border-bottom: 0;
                    }

                    // 使用偽元素產生左側標籤
                    &::before {
                        content: attr(data-label); // 自動抓取 HTML 上的 data-label
                        font-weight: 700;
                        text-transform: uppercase;
                        color: #42b883; // 統一使用 Nuxt 綠
                        margin-right: 1rem;
                        flex-shrink: 0;
                        width: 100px;
                        text-align: center;
                    }

                    // 調整 URL 在手機版的顯示，避免撐開
                    a {
                        word-break: break-all;
                        // max-width: 200px;
                        display: inline-block;
                    }
                }
            }

            thead {
                background-color: #42b883; // Nuxt 綠色
                color: white;

                th {
                    padding: 15px;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    letter-spacing: 0.5px;
                    text-align: center;
                }
            }

            tbody {
                tr {
                    border-bottom: 1px solid #eee;
                    transition: background-color 0.2s;

                    &:hover {
                        background-color: #f9fbfd;
                    }

                    &:last-child {
                        border-bottom: none;
                    }

                    p {
                        margin-bottom: 0;
                    }
                }

                td {
                    padding: 12px 15px;
                    color: #444;
                    line-height: 1.5;

                    &.font-bold {
                        font-weight: 600;
                        color: #2c3e50;
                    }

                    &.desc {
                        max-width: 400px;
                        font-size: 0.9rem;
                        color: #666;
                    }
                }
            }
        }
    }
}
</style>