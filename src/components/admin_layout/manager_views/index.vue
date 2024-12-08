<template>

  <Card>
      <template #title>欢迎管理员：</template>
      <template #content><div><h1 id="clock"></h1></div></template>
  </Card>

  <br>

  <Card>
    <template #header>
      <img src="https://tool.lu/netcard/" style="width:100%;max-width:400px">
    </template>
  </Card>
  
</template>

<script>
import Clock from '../../../js/Clock'

export default {
  name: 'App',
  mounted() {
    const clockElement = document.getElementById('clock');
    const clock = new Clock();
    clock.display(clockElement);
  }
};

</script>