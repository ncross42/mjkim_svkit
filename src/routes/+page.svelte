<script>
	import home from '$lib/images/home.webp';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Window Design Prototype Tool" />
</svelte:head>

<section>
	<source srcset={home} type="image/webp" />
	<img src={home} alt="Home" />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

</style>
