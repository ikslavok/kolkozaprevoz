<script>
	let { children } = $props();
  import '../app.css';
</script>
<svelte:head>
    <link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap" rel="stylesheet">  
</svelte:head>
<div class="container">
<h1 class="main-heading">Kolko za prevoz</h1>
<h3 class="subheading">Isplaniraj koliko će koštati gorivo za putovanje...</h3>

{@render children()}

<footer><a href="/privacy">Politika privatnosti / Privacy Policy</a></footer>
</div>
<style>
footer{
    text-align: center;
    margin: 3em 0 1.5em;
    font-size: 0.9em;
}
.container{
	width: 90vw;
	margin: 0 auto;
}
.main-heading{
    text-align: center;
    text-transform: uppercase;
    margin-bottom: 0.1em;
}
.subheading{
    font-family: 'Quicksand', sans-serif;
    text-align: center;
    margin-top: 0em;
    margin-bottom: 2em;
}
</style>