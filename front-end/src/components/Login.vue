<template>
  <div class="hero">
    <div class="heroBox">
      <form class="form">
        <fieldset>
          <legend>Register for an account to get started!</legend>
          <input placeholder="first name" v-model="firstName">
          <input placeholder="last name" v-model="lastName">
        </fieldset>
        <fieldset>
          <input placeholder="username" v-model="username">
          <input type="password" placeholder="password" v-model="password">
        </fieldset>
        <fieldset>
          <button type="submit" class="pure-button pure-button-primary" @click.prevent="register">Register</button>
        </fieldset>
      </form>
      <p v-if="error" class="error">{{error}}</p>
      <form class="pure-form space-above">
        <fieldset>
          <legend>Login</legend>
          <input placeholder="username" v-model="usernameLogin">
          <input type="password" placeholder="password" v-model="passwordLogin">
        </fieldset>
        <fieldset>
          <button type="submit" class="pure-button pure-button-primary" @click.prevent="login">Login</button>
        </fieldset>
      </form>
      <p v-if="errorLogin" class="error">{{errorLogin}}</p>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  export default {
    name: 'HomePage',
    data() {
      return {
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        usernameLogin: '',
        passwordLogin: '',
        error: '',
        errorLogin: '',
      }
    },
    methods: {
      async register() {
        this.error = '';
        this.errorLogin = '';
        if (!this.firstName || !this.lastName || !this.username || !this.password)
          return;
        try {
          let response = await axios.post('/api/users', {
            firstName: this.firstName,
            lastName: this.lastName,
            username: this.username,
            password: this.password,
          });
          this.$root.$data.user = response.data.user;
        } catch (error) {
          this.error = error.response.data.message;
          this.$root.$data.user = null;
        }
      },
      async login() {
        this.error = '';
        this.errorLogin = '';
        if (!this.usernameLogin || !this.passwordLogin)
          return;
        try {
          let response = await axios.post('/api/users/login', {
            username: this.usernameLogin,
            password: this.passwordLogin,
          });
          this.$root.$data.user = response.data.user;
          this.getItems();
          this.getEquipped();
        } catch (error) {
          this.errorLogin = "Error: " + error.response.data.message;
          this.$root.$data.user = null;
        }
      },
      async getItems() {
        try {
          let response = await axios.get("/api/items");
          this.$root.$data.items = response.data;
          return true;
        } catch (error) {
          //console.log(error);
        }
      },
      async getEquipped() {
        try {
          let response = await axios.get("/api/items/equipped");
          this.$root.$data.equipped = response.data;
          return true;
        } catch (error) {
          //console.log(error);
        }
      },
    },
  }
</script>

<style scoped>
  h1 {
    font-size: 28px;
    font-variant: capitalize;
  }

  .hero {
    padding: 120px;
    display: flex;
    justify-content: center;
  }

  .heroBox {
    text-align: center;
  }

  .hero form {
    border-radius: 10px;
    font-size: 14px;
    background-color: #FFF;
    padding: 30px;
    margin: 20px;
  }

  .hero form legend {
    font-size: 20px;
    margin-bottom: 25px;
  }
  .hero fieldset {
    border: none;
  }
  .heroBox {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .hero button {
    background-color: #627d99;
    border: none;
    color: white;
    padding: 10px 24px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 14px;
  }
  input {
    margin-right: 10px;
  }
  .error {
    border-radius: 10px;
    font-weight: bold;
    color: #FFF;
    padding: 10px;
    width: 250px;
    background-color: #d19494;
  }
</style>
