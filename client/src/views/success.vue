<template>
  <h2>資料更新成功!</h2>
  <h3 class="back_form">
    <RouterLink to="/">返回表單</RouterLink>
  </h3>
  <h3 class="to_gsheet">
    <a
      href="https://docs.google.com/spreadsheets/d/17sr4EnfegjWX0hoLYi6WBEIzwL7qtEqkaGBdvAcfAL0/edit#gid=221934414"
      target="_blank"
      >查看紀錄</a
    >
  </h3>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
h2 {
  font-size: 36px;
  font-weight: 700;
  color: #3375b9;
  border-bottom: 2px solid #18222c;
  margin-bottom: 6px;
}
a {
  font-size: 24px;
  text-decoration: none;
}
h3 {
  margin-bottom: 10px;
}

.back_form a {
  color: #85ce61;
  font-weight: 700;
}

.to_gsheet a {
  color: #ebb563;
  font-weight: 700;
}
</style>
