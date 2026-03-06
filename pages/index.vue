<template>
    <main class="home-page">
        <h1>您好！這是無限滾動專案示例</h1>
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
                                <td>{{ item.html_url }}</td>
                            </tr>
                        </template>

                    </tbody>
                </table>
            </div>
        </div>



    </main>
</template>
<script setup>

const repos = ref([])
const pending = ref(true)

const fetchRepos = async () => {
    try {
        const data = await $fetch('https://api.github.com/orgs/microsoft/repos?per_page=30&sort=updated')
        repos.value = data
    } catch (error) {
        console.error('抓取失敗:', error)
    } finally {
        pending.value = false
    }
}

onMounted(() => {
    fetchRepos()
})
</script>

<style lang="scss">
h1 {
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