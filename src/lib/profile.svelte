<script>
  import { supabase } from "$lib/supabaseClient";
  import { userSession } from "$lib/sessionStore";
  import Avatar from "$lib/avatar.svelte";
  import StackLogo from "$lib/stacklogo-line.svelte";
  import LoadingIcon from "$lib/loading-icon.svelte";
  import { fly } from "svelte/transition";

  let loading = true;
  let valid = true;
  let email = "";
  let username = "";
  let avatarUrl = "";
  let message = {
    code: 0,
    success: "",
    error: "",
    button: "",
  };

  const getProfile = (node) => {
    try {
      loading = true;
      const user = supabase.auth.user();

      supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user?.id)
        .single()
        .then(({ data, error, status }) => {
          if (data) {
            username = data.username;
            avatarUrl = data.avatar_url;
            email = $userSession?.user?.email;
          }
          if (error && status !== 406) throw error;
        });
    } catch (error) {
      console.log(error);
      message.code = error.status;
      switch (error.status) {
        case 400:
          message.error = "Gagal mengunduh profil";
          break;
        default:
          message.error = error.message;
      }
    } finally {
      loading = false;
    }
  };

  const updateProfile = async () => {
    try {
      loading = true;
      const user = supabase.auth.user();

      const updates = {
        id: user?.id,
        username,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal",
      });

      if (error) throw error;
    } catch (error) {
      console.log(error);
      message.code = error.status;
      switch (error.status) {
        case 400:
          message.error = "Gagal memperbarui profil";
          break;
        default:
          message.error = error.message;
      }
    } finally {
      loading = false;
    }
  };
  const checkInput = (e) => {
    if (!e.target.validity.valid) {
      valid = false;
      return;
    }
    valid = true;
    return;
  };
</script>

<section
  class="flex flex-col items-center justify-center h-screen md:flex-row bg-white-100 dark:bg-slate-800"
>
  <div
    class="z-10 px-6 w-48 md:w-80 flex items-center justify-center bg-cover stroke-gray-200 dark:stroke-gray-700 duration-300 transition-all stroke-[64px] hover:stroke-[72px]"
  >
    <StackLogo />
  </div>
  <div
    class="z-20 flex flex-col items-start justify-start px-6 py-8 text-white w-120"
  >
    <div>
      <h1 class="mb-6 text-3xl font-semibold text-gray-900 dark:text-white">
        Profil
      </h1>
      <form
        id="register"
        class="w-80 form-widget"
        on:submit|preventDefault={updateProfile}
        use:getProfile
      >
        <div class="relative z-0 w-full mb-6">
          <Avatar bind:path={avatarUrl} on:upload={updateProfile} />
        </div>
        <div class="relative z-0 w-full mb-4 group">
          <input
            type="email"
            name="email"
            id="email"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
            value={email}
            disabled
          />
          <label
            for="email"
            class="font-medium absolute text-sm text-gray-500 dark:text-gray-400 transform top-3 -z-10 origin-[0] left-0b scale-75 -translate-y-6"
            >Alamat email</label
          >
        </div>
        <div class="relative z-0 w-full mb-4 group">
          <input
            type="text"
            name="name"
            id="name"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 focus:outline-none focus:ring-0"
            placeholder=" "
            required
            pattern="^[^\s]+(\s+[^\s]+)*$"
            bind:value={username}
            on:input={checkInput}
          />
          <label
            for="name"
            class="font-medium absolute text-sm text-gray-500 dark:text-gray-400 transform top-3 -z-10 origin-[0] left-0b scale-75 -translate-y-6"
            >Nama</label
          >
        </div>
        {#if message.success}
          <p class="mb-2 text-sm text-blue-400" transition:fly>
            {message.success}
          </p>
        {/if}
        {#if message.error}
          <p class="mb-2 text-sm text-red-400" transition:fly>
            {message.error}
          </p>
        {/if}
        <button
          type="submit"
          disabled={!valid || loading}
          title={message.button}
          class="disabled:bg-blue-300 dark:disabled:bg-blue-400 mt-2 mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full md:w-24 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >{#if !loading}Perbarui{:else}<LoadingIcon
              class="w-5 h-5"
            />{/if}</button
        >
        <p class="text-sm font-light text-gray-500 dark:text-gray-400 mb-1">
          <a href="/atur-kata-sandi" class="hover:underline">Lupa password?</a>
        </p>
        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
          <a href="/" class="hover:underline">Kembali?</a>
        </p>
      </form>
    </div>
  </div>
</section>
