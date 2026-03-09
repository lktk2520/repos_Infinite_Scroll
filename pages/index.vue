<template>
    <main class="home-page">
        <h1>您好！這是無限滾動專案示例</h1>
        <p>Data source: GitHub REST API (Author: microsoft)</p>
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
                        <template v-for="item in repos">
                            <tr>
                                <td>{{ item.name }}</td>
                                <td>{{ item.description }}</td>
                                <td>
                                    <a :href="item.html_url">
                                        {{ item.html_url }}
                                    </a>
                                </td>
                            </tr>
                        </template>

                        <tr ref="loadMoreTrigger" class="loading-trigger">
                            <td colspan="3">
                                <p v-if="isLoading">載入中...</p>
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
        </div>



    </main>
</template>
<script setup>

const repos = ref([])
//初始化的30筆
const downloaded_Page = ref(30)

//新的repos從第4頁開始載入
const page = ref(4)

const isLoading = ref(true)
const loadMoreTrigger = ref(null); // 對應 HTML 中的 ref
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
        const token = config.public.githubToken
        const data = await $fetch(`https://api.github.com/orgs/microsoft/repos?per_page=10&page=${page.value}&sort=updated`)
        repos.value = [...repos.value, ...data]
    } catch (error) {
        console.error('抓取失敗:', error)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchRepos_init()
    //實例化觀察者
    observer = new IntersectionObserver((entries) => {
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
            text-align: left;

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