<template>
    <div>欢迎管理员：
        <h1 id="clock"></h1>
    </div>
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