<script>
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  const returnHome = () => {
    goto("/");
  };
</script>

<svelte:head><title>{$page.status}: {$page.error.message}</title></svelte:head>

<h1>{$page.status}: {$page.error.message}</h1>
<button type="button" on:click={returnHome}>Kembali</button>
