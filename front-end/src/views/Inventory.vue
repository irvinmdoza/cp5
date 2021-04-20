<template>
<div>
  <div class="content" v-if="user">
    <h1>Welcome {{user.firstName}}!</h1>
    <h3>My Equipped Gear</h3>
    <ul>
      <li v-for="item in equipped" :key="item.id">{{ item.name }}</li>
    </ul>
    <h3>Available Equipment</h3>
    <div class="item-list-content">
      <div class="items">
        <div class="item" v-for="item in items" :key="item.id">
          <div class="item-title">
            <h4 class="item-name">{{item.name}}</h4>
            <div class="image">
              <img :src="'/images/' + item.type +'.png'">
            </div>
          </div>
          <div class="item-info">
            <p class="item-info-head">Information</p>
            <div class="item-stats">
              <p>Type: {{item.type}}</p>
              <p>Defense: {{item.defense}}</p>
              <p>Rarity: {{item.rarity}}</p>
            </div>
          </div>
          <div class="buttons">
            <div :id='"equip" + item.id' :style="item.equipped == 'true' ? 'display: none;' : 'display: block;'">
              <button class="equip-button" v-on:click="equipItem(item.id)">EQUIP</button>
            </div>
            <div :id='"unequip" + item.id' :style="item.equipped == 'true' ? 'display: block;' : 'display: none;'">
              <button class="equip-button" v-on:click="unequipItem(item.id)">UN-EQUIP</button>
            </div>
            <button class="delete-button" v-on:click="deleteItem(item.id)">Delete</button>
            <router-link :to="'/item/' + item.id">Edit</router-link>
          </div>
        </div>
        <div class="addItem">
          <fieldset id="fieldset" class="fieldset">
            <legend>Add New Item:</legend>
            <label for="itemName">Item Name</label>
            <input type="text" id="itemName">
            <label for="itemType">Type</label>
            <select id="itemType">
              <option value="Head">Head</option>
              <option value="Chest">Chest</option>
              <option value="Arm">Arm</option>
              <option value="Leg">Leg</option>
              <option value="Misc">Misc</option>
            </select>
            <label for="itemDefense">Defense Stat</label>
            <select id="itemDefense">
              <option v-for="num in 30" :value="num" :key="num">{{num}}</option>
            </select>
            <label for="itemRarity">Item Rarity</label>
            <select id="itemRarity">
              <option v-for="num in 10" :value="num" :key="num">{{num}}</option>
            </select>
            <button class="auto" v-on:click="addItem()">Add Item</button>
          </fieldset>
          <div class="logout-button-container">
            <p class="logout-button"><a @click="logout">LOGOUT</a></p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Login v-else />
</div>
</template>

<script>
import axios from 'axios';
import Login from '@/components/Login.vue';
export default {
  name: 'Inventory',
  components: {
    Login,
  },
  async created() {
    try {
      let response = await axios.get('api/users');
      this.$root.$data.user = response.data.user;
      this.getItems();
      this.getEquipped();
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
    items() {
      return this.$root.$data.items;
    },
    equipped() {
      return this.$root.$data.equipped;
    }
  },
  methods: {
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
    async addItem() {
      let name = document.getElementById("itemName").value;
      let typeSelector = document.getElementById("itemType");
      let type = typeSelector.options[typeSelector.selectedIndex].value;
      let defSelector = document.getElementById("itemDefense");
      let defense = defSelector.options[defSelector.selectedIndex].value;
      let rarfSelector = document.getElementById("itemRarity");
      let rarity = rarfSelector.options[rarfSelector.selectedIndex].value;
      try {
        await axios.post("/api/items", {
          name: name,
          type: type,
          defense: defense,
          rarity: rarity,
          equipped: "false"
        })
        this.getItems();
      } catch (error) {
        //console.log(error);
      }
    },
    async deleteItem(id) {
      try {
        await axios.delete("/api/items/" + id);
        this.getItems();
        this.getEquipped();
        return true;
      } catch (error) {
        //console.log(error);
      }
      // TODO: REMOVE FROM EQUIPPED AS WELL
    },
    async equipItem(itemID) {
      try {
        await axios.put("/api/items/equipped/" + itemID, {
          equipped: "true",
        });
        this.getEquipped();
      } catch (error) {
        //console.log(error);
      }
      document.getElementById("equip" + itemID).style["display"] = "none";
      document.getElementById("unequip" + itemID).style["display"] = "block";
    },
    async unequipItem(itemID) {
      try {
        await axios.put("/api/items/equipped/" + itemID, {
          equipped: "false",
        });
        this.getEquipped();
      } catch (error) {
        //console.log(error);
      }
      document.getElementById("equip" + itemID).style["display"] = "block";
      document.getElementById("unequip" + itemID).style["display"] = "none";
    },
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
        this.$root.$data.items = [];
        this.$root.$data.equipped = [];
      } catch (error) {
        this.$root.$data.user = null;
      }
    },
  }
}
</script>

<style scoped>
  h3 {
    padding-bottom: 5px;
    border-bottom: 2px solid black;
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  ul, li {
    margin: 0;
    padding: 0;
  }
  .item-list-content {
    width: 100%;
  }
  .items {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .item {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 10px 0;
    border: 1px solid #c7c0a5;
    border-radius: 10px;
    background: #627d99;
  }
  .logout-button-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .item-name {
    text-align: center;
    color: white;
    margin: 20px;
  }
  .item-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 10px 20px;
    width: 100%;
    background: #F4F1E9;
  }
  .item-stats {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    background: #f5f5f5;
    border: 1px solid black;
  }
  p {
    margin: 5px;
  }
  .item-info-head {
    font-weight: bold;
  }
  .equip-button, .delete-button {
    text-align: center;
    height: 40px;
    width: 60px;
    margin: 5px 10px;
  }
  .item-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 300px;
  }
  .fieldset {
    display: flex;
    flex-direction: column;
  }
  input, select {
    margin-bottom: 10px;
    border: none;
    border-radius: 3px;
    padding: 3px;
  }
  .hidden {
    display: none;
  }
  .addItem {
    margin-bottom: 20px;
  }
  .buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .buttons a {
    margin: 5px 0;
    font-weight: bold;
    color: #eee;
  }
  fieldset {
    border-radius: 10px;
    border: 1px solid #c7c0a5;
  }
  .logout-button {
    background-color: #9c7878;
    color: #fff;
    width: min-content;
    padding: 10px 24px;
    text-align: center;
    margin: 10px 10px;
    font-size: 14px;
  }
</style>
