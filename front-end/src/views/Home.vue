<template>
  <div class="home">
    <p>Welcome to Gear Manager! A tool created to help people manage equipment and items acquired in DnD or RPG campaigns!</p>
    <div class="imageHolder">
      <img src='/images/Head.png'>
      <img src='/images/Chest.png'>
      <img src='/images/Arm.png'>
      <img src='/images/Leg.png'>
      <img src='/images/Misc.png'>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
}
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.imageHolder {
  margin: 30px;
}
</style>
