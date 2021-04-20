<template>
  <div id="app">
    <div class="header">
      <h1>Gear Manager</h1>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/Inventory">Inventory</router-link>
    </div>
    <div class="content">
      <router-view/>
    </div>
    <div class="footer-container">
      <div class="footer">
        <p>&copy; Irvin Mendoza 2021</p>
        <p>Github: <a href="https://github.com/irvinmdoza/cp5" target="_blank">Creative Project #5</a></p>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #F4F1E9;
  color: #2c3e50;
}
#nav {
  padding: 30px;
}
#nav a {
  font-weight: bold;
  color: #648ecc;
}
#nav a.router-link-exact-active {
  color: #2c3e50;
}
.footer-container {
  display: flex;
  flex: initial;
  flex-direction: column;
  width: 100%;
  text-align: center;
  align-items: center;
  background-color: #EBE2D7;
}
.footer {
  padding: 10px;
}
.header {
  display: flex;
  flex: initial;
  justify-content: center;
  width: 100%;
  color: white;
  background: #627d99;
}
.content {
  display: flex;
  justify-content: center;
  flex: 1;
  width: 80%;
}
</style>
