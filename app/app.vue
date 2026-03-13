<template>
  <div>
    <nav>
      無限滾動 Side-Project
      <NuxtLink to="/">首頁</NuxtLink>
      <NuxtLink to="/infinite_Scroll">無限滾動</NuxtLink>
      <NuxtLink to="/directive">指令</NuxtLink>

    </nav>
    <NuxtPage />
  </div>
</template>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

h1,
p {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
}

main {
  padding: 60px 0;
}

nav {
  background-color: black;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 40px;
  color: white;

  a {
    color: white;
    text-decoration: none;
    padding: 0 15px;
  }

}
</style>
