<script setup lang="ts">
//import router from "@/router";
import { useCircleStore } from "@/stores/circle";
import { ref } from "vue";

const name = ref("");
const friend1 = ref("");
const friend2 = ref("");
const { addToCircle, removeFromCircle } = useCircleStore();

async function add() {
  await addToCircle(name.value, friend1.value);
}

async function remove() {
  await removeFromCircle(friend2.value);
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="add">
    <h3>Add To Circle</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">Circle Name</label>
        <input v-model.trim="name" type="text" id="aligned-name" placeholder="Name" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-friend">Circle Friend</label>
        <input v-model.trim="friend1" id="aligned-friend" placeholder="Friend" required />
      </div>
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Submit</button>
      </div>
    </fieldset>
  </form>

  <form class="pure-form pure-form-aligned" @submit.prevent="remove">
    <h3>Remove from Circle</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-friend">Circle Friend</label>
        <input v-model.trim="friend2" id="aligned-friend" placeholder="Friend" required />
      </div>
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Submit</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}
</style>
