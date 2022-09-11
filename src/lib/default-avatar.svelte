<script>
  let Class = "";
  let Initials = "";
  export { Class as class };
  export { Initials as initials };
</script>

{#if Initials}
  <div
    class="{Class} inline-flex overflow-hidden relative justify-center items-center  p-1 bg-gray-300 rounded-full dark:bg-slate-700"
  >
    <span class="font-medium text-gray-600 dark:text-gray-300">{Initials}</span>
  </div>
{:else}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    class="{Class} p-1 bg-gray-300 rounded-full fill-white dark:bg-slate-700 dark:fill-slate-500"
  >
    <path
      fill-rule="evenodd"
      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
      clip-rule="evenodd"
    />
  </svg>{/if}
