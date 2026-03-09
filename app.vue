<template>
  <div>
    <nav>
      <NuxtLink to="/">無限滾動</NuxtLink>
      <NuxtLink to="/about">關於</NuxtLink>
    </nav>
    <NuxtPage />
  </div>
</template>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
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

  a {
    color: white;
    text-decoration: none;
    padding: 0 15px;
  }

}
</style>
