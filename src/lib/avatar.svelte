<script>
  import { createEventDispatcher } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import DefaultAvatar from "$lib/default-avatar.svelte";
  import LoadingIcon from "$lib/loading-icon.svelte";

  export let path;

  let uploading = false;
  let src = "";
  let files;

  const dispatch = createEventDispatcher();

  const downloadImage = (e) => {
    supabase.storage
      .from("avatars")
      .download(path)
      .then(({ data, error }) => {
        if (error) throw error;
        src = URL.createObjectURL(data);
      })
      .catch((error) => {
        console.error("Gagal mengunduh foto: ", error.message, error);
      });
  };

  const uploadAvatar = async () => {
    try {
      uploading = true;

      if (!files || files.length === 0) {
        throw new Error("Pilih foto untuk diunggah");
      }

      const file = files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      path = filePath;
      dispatch("upload");
    } catch (error) {
      console.log(error);
    } finally {
      uploading = false;
    }
  };
</script>

<div class="relative w-32">
  {#if path}
    <div
      class="overflow-clip h-32 w-32 bg-gray-300 rounded-full dark:bg-slate-700"
    >
      <img use:downloadImage {src} alt="Foto profil" class="avatar" />
    </div>
  {:else}
    <DefaultAvatar
      class="w-32 h-32 p-1 bg-gray-300 rounded-full fill-white dark:bg-slate-700 dark:fill-slate-500"
    />
  {/if}
  <div>
    <button
      type="button"
      for="avatar-upload"
      class="absolute z-10 -right-2 bottom-0 text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      {#if uploading}
        <LoadingIcon class="w-4 h-4" />
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="w-4 h-4"
        >
          <path
            d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"
          />
        </svg>
      {/if}
    </button>
    <input
      class="invisible absolute"
      type="file"
      id="avatar-upload"
      accept="image/*"
      bind:files
      on:change={uploadAvatar}
      disabled={uploading}
    />
  </div>
</div>
