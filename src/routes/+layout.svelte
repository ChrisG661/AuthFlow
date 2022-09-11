<script>
  import "../app.postcss";
  import { supabase } from "$lib/supabaseClient";
  import { userSession } from "$lib/sessionStore";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import StackLogo from "$lib/stacklogo-line.svelte";
  import DefaultAvatar from "$lib/default-avatar.svelte";

  let authEvent = "";
  let mounted = false;
  onMount(() => {
    if (browser) {
      $userSession = supabase.auth.session();
      supabase.auth.onAuthStateChange((event, session) => {
        authEvent = event;
        $userSession = session;
      });
      mounted = true;
    }
  });
  $: if (browser && mounted) {
    let urlFragment = new URLSearchParams($page.url.hash.substring(1));
    if (urlFragment.get("type") == "recovery") {
      goto("/atur-kata-sandi");
    }
    if (
      ($page.routeId == "daftar" || $page.routeId == "masuk") &&
      $userSession != null
    ) {
      if (authEvent != "SIGNED_IN") goto("/profil");
    }
    if (!$userSession) {
      userProfile = { avatarUrl: "", name: "", initials: "" };
      switch ($page.routeId) {
        case "profil":
        case "atur-kata-sandi":
          goto("/");
          break;
        default:
          break;
      }
    }
    if ($userSession) {
      getProfile();
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      $userSession = null;
      goto("/");
    } catch (error) {
      console.log(error);
    }
  };

  onMount(() => {
    var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
    var themeToggleLightIcon = document.getElementById(
      "theme-toggle-light-icon"
    );

    // Change the icons inside the button based on previous settings
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      themeToggleLightIcon.classList.remove("hidden");
    } else {
      themeToggleDarkIcon.classList.remove("hidden");
    }

    var themeToggleBtn = document.getElementById("theme-toggle");

    themeToggleBtn.addEventListener("click", function () {
      themeToggleDarkIcon.classList.toggle("hidden");
      themeToggleLightIcon.classList.toggle("hidden");

      if (localStorage.getItem("color-theme")) {
        if (localStorage.getItem("color-theme") === "light") {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        }
      } else {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        }
      }
    });
  });

  let userProfile = { avatarUrl: "", name: "", initials: "" };

  const getProfile = (node) => {
    try {
      //loading = true;
      const user = supabase.auth.user();

      supabase
        .from("profiles")
        .select(`username, avatar_url`)
        .eq("id", user?.id)
        .single()
        .then(({ data, error, status }) => {
          if (data) {
            userProfile.name = data.username;
            userProfile.avatarUrl = data.avatar_url;
            let initials =
              [...userProfile.name.matchAll(/([a-zA-Z]?)[a-zA-Z]+/gu)] || [];
            userProfile.initials = (
              (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
            ).toUpperCase();
          }
          if (error && status !== 406) throw error;
        });
    } catch (error) {
      console.error(error);
    } finally {
      //loading = false;
    }
  };

  const downloadImage = (e) => {
    supabase.storage
      .from("avatars")
      .download(userProfile.avatarUrl)
      .then(({ data, error }) => {
        if (error) throw error;
        userProfile.avatarUrl = URL.createObjectURL(data);
      })
      .catch((error) => {
        console.error("Gagal mengunduh foto: ", error.message, error);
      });
  };
</script>

<svelte:head>
  <script>
    if (
      localStorage.getItem("color-theme") === "dark" ||
      (!("color-theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  </script>
</svelte:head>

<div class="fixed w-full bg-white dark:bg-slate-800 z-30">
  <nav
    class="bg-white border-gray-200 dark:border-slate-700 border-b px-4 sm:px-6 py-2.5 dark:bg-slate-900 "
  >
    <div class="container flex flex-wrap items-center justify-between mx-auto">
      <a href="/" class="flex items-center">
        <div
          class="mr-3 h-6 w-6 sm:h-9 sm:w-9 stroke-gray-700 dark:stroke-gray-100 stroke-[84px]"
        >
          <StackLogo />
        </div>
        <span
          class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
          >Christopher G</span
        >
      </a>
      <div class="flex items-center md:order-2">
        <button
          type="button"
          class="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
          id="user-menu-button"
          aria-expanded="false"
          data-dropdown-toggle="user-dropdown"
          data-dropdown-placement="bottom"
        >
          {#if userProfile.avatarUrl}
            <div
              use:downloadImage
              class="overflow-clip w-8 h-8 bg-gray-300 rounded-full dark:bg-slate-700"
            >
              <img src={userProfile.avatarUrl} alt="Foto profil" />
            </div>
          {:else if userProfile.name}
            <DefaultAvatar class="w-8 h-8" initials={userProfile.initials} />
          {:else}
            <DefaultAvatar class="w-8 h-8" />
          {/if}
        </button>
        <div
          class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
          id="user-dropdown"
          data-popper-reference-hidden=""
          data-popper-escaped=""
          data-popper-placement="bottom"
          style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(0px, 10px);"
        >
          <div class="px-4 py-3">
            {#if $userSession}
              {#if userProfile.name}
                <span class="block text-sm text-gray-900 dark:text-white"
                  >{userProfile.name}</span
                >{/if}
              <span
                class="block text-sm font-medium text-gray-500 truncate dark:text-gray-400"
                >{$userSession?.user.email}</span
              >
            {:else}
              <span
                class="block text-sm font-medium text-gray-500 truncate dark:text-gray-400"
                >Belum masuk</span
              >
            {/if}
          </div>
          <ul class="py-1" aria-labelledby="user-menu-button">
            {#if $userSession}
              <li>
                <a
                  href="/profil"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >Profil</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  on:click|preventDefault={signOut}>Keluar</a
                >
              </li>
            {:else}
              <li>
                <a
                  href="/masuk"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >Masuk</a
                >
              </li>
              <li>
                <a
                  href="/daftar"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >Daftar</a
                >
              </li>
            {/if}
          </ul>
        </div>
        <button
          data-collapse-toggle="mobile-menu-2"
          type="button"
          class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="mobile-menu-2"
          aria-expanded="false"
        >
          <svg
            class="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clip-rule="evenodd"
            /></svg
          >
        </button>
      </div>
      <div
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
        id="mobile-menu-2"
      >
        <ul
          class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li>
            <a
              href="/"
              class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              aria-current="page">Beranda</a
            >
          </li>
          <li>
            <a
              href="https://github.com/ChrisG661/AuthFlow"
              class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              aria-current="page">Lihat sumber</a
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</div>
<slot />

<button
  id="theme-toggle"
  type="button"
  class="fixed z-30 opacity-70 right-2 bottom-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
>
  <svg
    id="theme-toggle-light-icon"
    class="hidden w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    ><path
      d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
    /></svg
  >
  <svg
    id="theme-toggle-dark-icon"
    class="hidden w-5 h-5"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    ><path
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      fill-rule="evenodd"
      clip-rule="evenodd"
    /></svg
  >
</button>
