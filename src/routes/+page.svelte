<script>
  import { goto } from "$app/navigation";
  import StackLogo from "$lib/stacklogo-line.svelte";
  import { draw } from "svelte/transition";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let animate = false;
  let animateParams = { duration: 1200 };
  onMount(() => {
    animate = true;
    setTimeout(() => {
      animate = true;
    }, 500);
  });
</script>

<svelte:head><title>Beranda</title></svelte:head>

<section
  class="bg-white dark:bg-slate-800 h-screen flex flex-col items-center justify-center md:flex-row overflow-hidden relative"
>
  <div class="">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 880 985.18"
      class="absolute z-0 px-6 h-3/4 overflow-hidden flex items-center justify-center bg-cover stroke-gray-200 dark:stroke-gray-700 top-1/2 left-1/2 stroke-[54px] -translate-x-1/2 -translate-y-1/2 opacity-30"
      fill="none"
      stroke="inherit"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {#if animate}
        <path
          in:draw={animateParams}
          d="M41.9,757.07,388.14,932.58a116.91,116.91,0,0,0,105.68,0L840,757.07"
          transform="translate(0 -0.03)"
        />
        <path
          in:draw={animateParams}
          d="M41.13,586.84,387.37,762.31a116.91,116.91,0,0,0,105.68,0L839.23,586.84"
          transform="translate(0 -0.03)"
        />
        <path
          in:draw={animateParams}
          d="M40.17,414.12,386.41,589.58a116.91,116.91,0,0,0,105.68,0L838.27,414.12"
          transform="translate(0 -0.03)"
        />
        <path
          in:draw={{ ...animateParams, delay: 10 }}
          d="M439.05,235.26,638.56,336.38"
          transform="translate(0 -0.03)"
        />
        <path
          in:draw={{ ...animateParams, delay: 10 }}
          d="M439.05,235.26,638.61,134.17"
          transform="translate(0 -0.03)"
        />
        <path
          d="M40,235.26l372.69,189a57.66,57.66,0,0,0,52.15,0l372.94-189"
          transform="translate(0 -0.03)"
          in:draw={animateParams}
        />
        <path
          d="M40,235.26l372.69-189a57.66,57.66,0,0,1,52.15,0l372.94,189"
          transform="translate(0 -0.03)"
          in:draw={animateParams}
        />
      {/if}
    </svg>
  </div>
  <div class="flex items-center flex-col z-10 text-center">
    <h1
      class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
    >
      Sumatif Informatika Kelas 11 Kuartal I
    </h1>
    <p
      class="text-center mb-6 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400"
    >
      Aplikasi autentikasi dalam framework SvelteKit dan TailwindCSS
    </p>
    <a
      href="/masuk"
      class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
    >
      Masuk
      <svg
        class="ml-2 -mr-1 w-5 h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
          clip-rule="evenodd"
        /></svg
      >
    </a>
  </div>
</section>
