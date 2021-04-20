<template>
<div class="item-info">
  <fieldset id="fieldset2" class="fieldset2">
    <legend>Edit Item:</legend>
    <label for="itemName">Item Name</label>
    <input type="text" id="itemName2" :value='item.name'>
    <label for="itemType">Type</label>
    <select id="itemType2">
      <option value="Head" selected>Head</option>
      <option value="Chest">Chest</option>
      <option value="Arm">Arm</option>
      <option value="Leg">Leg</option>
      <option value="Misc">Misc</option>
    </select>
    <label for="itemDefense">Defense Stat</label>
    <select id="itemDefense2">
      <option v-for="num in 30" :value="num" :key="num">{{num}}</option>
    </select>
    <label for="itemRarity">Item Rarity</label>
    <select id="itemRarity2">
      <option v-for="num in 10" :value="num" :key="num">{{num}}</option>
    </select>
    <button class="auto" v-on:click="updateItem(item.id)">Update Item</button>
  </fieldset>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Item',
  data() {
    return {
      item: {},
    }
  },
  created() {
    this.getItem(this.$route.params.id);
  },
  methods: {
    async getItem(id) {
      try {
        let response = await axios.get("/api/items/" + id);
        this.item = response.data;
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    async updateItem(id) {
      let name = document.getElementById("itemName2").value;
      let typeSelector = document.getElementById("itemType2");
      let type = typeSelector.options[typeSelector.selectedIndex].value;
      let defSelector = document.getElementById("itemDefense2");
      let defense = defSelector.options[defSelector.selectedIndex].value;
      let rarfSelector = document.getElementById("itemRarity2");
      let rarity = rarfSelector.options[rarfSelector.selectedIndex].value;
      try {
        await axios.put("/api/items/" + id, {
          name: name,
          type: type,
          defense: defense,
          rarity: rarity,
        })
        this.getItems();
      } catch (error) {
        //console.log(error);
      }
    }
  },
}
</script>

<style scoped>
.fieldset2 {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
input, select {
  margin-bottom: 10px;
  border: none;
  border-radius: 3px;
  padding: 3px;
}
</style>
