<script>
  import { supabase } from "$lib/supabaseClient";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { userSession } from "$lib/sessionStore";
  import { fly } from "svelte/transition";
  import StackLogo from "$lib/stacklogo-line.svelte";
  import LoadingIcon from "$lib/loading-icon.svelte";
  import PeekPassword from "$lib/peek-password.svelte";
  let loading = false;
  let email = { value: "", element: null };
  let password = { value: "", element: null, show: false };
  let valid = false;
  let message = { code: 0, success: "", error: "", button: "" };

  const checkPassword = (e) => {
    let msg = "";
    if (password.value.length < 8) {
      msg = "Kata sandi harus memiliki minimal 8 karakter";
      password.element.setCustomValidity(msg);
      message.button = msg;
    } else {
      password.element.setCustomValidity(msg);
    }
    return;
  };

  const checkInput = (e) => {
    if (password.value.length == 0 && email.value.length == 0) {
      valid = false;
      return;
    }
    checkPassword(e);
    if (!email.element.validity.valid) {
      message.button = "Format email salah";
      valid = false;
      return;
    }
    if (password.value.length < 8) {
      valid = false;
    } else {
      message.button = "";
      valid = true;
    }
    return;
  };

  const handleLogin = async () => {
    try {
      loading = true;
      message.code = 0;
      message.success = message.error = "";
      const { user, session, error } = await supabase.auth.signIn({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      if (user) {
        message.success = "Login berhasil";
        setTimeout(() => {
          goto("/profil");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      message.code = error.status;
      switch (error.status) {
        case 400:
          message.error = "Email atau password salah";
          break;
        default:
          message.error = error.message;
      }
    } finally {
      loading = false;
    }
  };

  $: {
    if (password.element)
      password.element.type = password.show ? "text" : "password";
  }
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
        Masuk
      </h1>
      <form id="register" class="w-80" on:submit|preventDefault={handleLogin}>
        <div class="relative z-0 w-full mb-4 group">
          <input
            type="email"
            name="email"
            id="email"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 invalid:focus:border-red-600 dark:invalid:focus:border-red-500 peer"
            placeholder=" "
            required
            bind:value={email.value}
            bind:this={email.element}
            on:input={checkInput}
          />
          <label
            for="email"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Alamat email</label
          >
        </div>
        <div class="relative z-0 w-full mb-6 group">
          <input
            type="password"
            name="password"
            id="password"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 invalid:focus:border-red-600 dark:invalid:focus:border-red-500 peer"
            placeholder=" "
            required
            bind:value={password.value}
            bind:this={password.element}
            on:input={checkInput}
          />
          <label
            for="password"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Kata sandi</label
          >
          <div class="absolute top-3.5 right-1.5 peer-focus:visible invisible">
            <PeekPassword bind:show={password.show} />
          </div>
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
        {#if message.code == 400}
          <p
            class="mb-2 text-xs text-gray-500 dark:text-gray-400 hover:underline"
            transition:fly
          >
            <a href="/lupa-kata-sandi">Lupa kata sandi?</a>
          </p>
        {/if}

        <button
          type="submit"
          disabled={!valid || loading}
          title={message.button}
          class="disabled:bg-blue-300 dark:disabled:bg-blue-400 mt-2 mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full md:w-20 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >{#if !loading}Masuk{:else}<LoadingIcon
              class="w-5 h-5"
            />{/if}</button
        >

        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
          Belum punya akun? <a
            href="/daftar"
            class="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >Daftar di sini</a
          >
        </p>
      </form>
    </div>
  </div>
</section>
