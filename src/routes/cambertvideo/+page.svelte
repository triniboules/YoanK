<script lang="ts">
	import TimestampConverter from "../../components/TimestampConverter.svelte";
  import Background from '../../components/Background.svelte';

</script>
<Background />
<style>
  body {
    margin: 0;
    height: 100vh;
    display: grid;
    grid-template-columns: 1fr 30% 1fr; /* Middle column 60% */
    grid-template-rows: 1fr 1fr 1fr; /* Three equal rows */
    box-sizing: border-box; /* Include padding in height/width calculations */
  }

  .container {
    grid-column: 2; /* Middle column */
    grid-row: 2; /* Middle row */
    background: rgba(255, 255, 255, 0.1); /* Semi-transparent background */
    border-radius: 10px;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    padding: 20px; /* Inner padding */
    text-align: center;
    width: 100%; /* Full width of the grid cell */
    height: 100%; /* Full height of the grid cell */
  }
</style>

<div class="container">

</div>
