<script>
  import windowImage from '$lib/images/window.webp';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  const formData = writable({});

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const entries = Object.fromEntries(params.entries());
    formData.set(entries);
    console.log(entries);
  });
</script>

<svelte:head>
  <title>Result</title>
  <meta name="description" content="Result Page" />
</svelte:head>

<section>
{#if Object.keys($formData).length > 0}
  <h2 class="text-2xl font-bold text-gray-800">결과 이미지</h2>
  <div class="text-column">
    <source srcset={windowImage} type="image/webp" />
    <img src={windowImage} alt="Result Window" />
  </div>

  <!-- <h2 class="text-2xl font-bold text-gray-800">제출된 정보</h2>
  <div class="bg-gray-100 rounded-xl p-4 overflow-auto">
    <pre class="text-sm text-gray-800">{JSON.stringify($formData, null, 2)}</pre>
  </div> -->
{:else}
  <div class="bg-gray-100 rounded-xl p-4 overflow-auto">
    <pre class="text-sm text-gray-800">제출된 데이터가 없습니다.</pre>
  </div>
{/if}
</section>

<style>
  .text-column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  h2 {
    font-size: 1.2rem; /* ~ text-3xl */
    /* font-weight: 800; */
    margin-top: 0.5rem;
    /* margin-bottom: 1rem; */
    text-align: center;
    /* text-decoration: underline; */
    /* text-underline-offset: 4px; */
    text-decoration-color: #818cf8; /* Tailwind indigo-400 */
  }

  .bg-gray-100 {
    background-color: #f7fafc; /* Tailwind's gray-100 */
    border-radius: 0.75rem; /* Tailwind's rounded-xl */
    padding: 1rem;
    overflow-x: auto; /* Allows horizontal scrolling for long text */
  }

  pre {
    white-space: pre-wrap; /* Ensures long lines wrap */
  }
</style>
