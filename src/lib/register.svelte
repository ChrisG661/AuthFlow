<script>
  import { supabase } from "$lib/supabaseClient";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { userSession } from "$lib/sessionStore";
  import { fly } from "svelte/transition";
  import StackLogo from "$lib/stacklogo-line.svelte";
  import Check from "$lib/check.svelte";
  import Cross from "$lib/cross.svelte";
  import LoadingIcon from "$lib/loading-icon.svelte";
  import PeekPassword from "$lib/peek-password.svelte";
  let loading = false;
  let email = { value: "", element: null };
  let password = { value: "", element: undefined, show: false };
  let confirmPassword = { value: "", element: undefined, show: false };
  let valid = false;
  let message = { code: 0, success: "", error: "", button: "" };
  let passwordChecker = {
    visibility: false,
    bar: Array(5).fill(false),
    barColor: "orange",
    uppercaseLetter: false,
    lowercaseLetter: false,
    number: false,
    symbol: false,
    longer: false,
  };
  [
    "bg-red-300",
    "dark:bg-red-400",
    "bg-orange-300",
    "dark:bg-orange-400",
    "bg-yellow-300",
    "dark:bg-yellow-400",
    "bg-green-300",
    "dark:bg-green-400",
    "bg-blue-300",
    "dark:bg-blue-400",
  ];

  const checkPassword = () => {
    let msg = "";

    passwordChecker.uppercaseLetter = password.value.match(/[A-Z]/g) !== null;
    passwordChecker.lowercaseLetter = password.value.match(/[a-z]/g) !== null;
    passwordChecker.number = password.value.match(/[0-9]/g) !== null;
    passwordChecker.symbol = password.value.match(/[^a-zA-Z0-9]/g) !== null;
    passwordChecker.longer = password.value.length >= 12;
    passwordChecker.bar = [
      passwordChecker.uppercaseLetter,
      passwordChecker.lowercaseLetter,
      passwordChecker.number,
      passwordChecker.symbol,
      passwordChecker.longer,
    ];
    passwordChecker.bar = passwordChecker.bar.sort((a, b) => b - a);
    switch (passwordChecker.bar.filter(Boolean).length) {
      case 0:
      case 1:
        passwordChecker.barColor = "red";
        break;
      case 2:
        passwordChecker.barColor = "orange";
        break;
      case 3:
        passwordChecker.barColor = "yellow";
        break;
      case 4:
        passwordChecker.barColor = "green";
        break;
      case 5:
        passwordChecker.barColor = "blue";
        break;
    }
    if (password.value.length < 8) {
      msg = "Kata sandi harus memiliki minimal 8 karakter";
      password.element.setCustomValidity(msg);
      confirmPassword.element.setCustomValidity(msg);
      message.button = msg;
    } else if (password.value !== confirmPassword.value) {
      msg = "Kata sandi tidak sama";
      if (confirmPassword.value.length == 0) {
        password.element.setCustomValidity("");
      } else {
        password.element.setCustomValidity(msg);
        confirmPassword.element.setCustomValidity(msg);
        message.button = msg;
      }
    } else if (passwordChecker.bar.filter(Boolean).length < 2) {
      msg = "Kata sandi harus memenuhi 2 kriteria";
      password.element.setCustomValidity(msg);
      confirmPassword.element.setCustomValidity(msg);
      message.button = msg;
    } else {
      password.element.setCustomValidity(msg);
      confirmPassword.element.setCustomValidity(msg);
      message.button = msg;
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
    } else if (password.value !== confirmPassword.value) {
      valid = false;
    } else if (passwordChecker.bar.filter(Boolean).length < 2) {
      valid = false;
    } else {
      message.button = "";
      valid = true;
    }
    return;
  };

  const handleSignUp = async () => {
    try {
      loading = true;
      message.success = message.error = message.button = "";

      const { user, session, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      if (user) {
        message.success = "Periksa email Anda untuk link login!";
        setTimeout(() => {
          goto("/masuk");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      message.code = error.status;
      switch (error.status) {
        case 400:
          message.error = "Email sudah terdaftar";
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
    if (confirmPassword.element)
      confirmPassword.element.type = confirmPassword.show ? "text" : "password";
  }
</script>

<section
  class="flex flex-col items-center justify-center h-screen bg-white md:flex-row dark:bg-slate-800"
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
        Daftar
      </h1>
      <form id="register" class="w-80" on:submit|preventDefault={handleSignUp}>
        <div class="relative z-0 w-full mb-6 group">
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
        <div class="relative z-10 w-full mb-6 group">
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
            on:focus={() => {
              passwordChecker.visibility = true;
            }}
            on:blur={() => {
              passwordChecker.visibility = false;
            }}
          />
          <div class="absolute top-3.5 right-1.5 peer-focus:visible invisible ">
            <PeekPassword bind:show={password.show} />
          </div>

          <label
            for="password"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Kata sandi</label
          >
          {#if passwordChecker.visibility}
            <div
              role="tooltip"
              class="absolute z-20 inline-block text-sm font-light text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm w-80 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400"
              transition:fly
            >
              <div class="p-3 space-y-2">
                {#if password.value.length < 8}
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Harus memiliki setidaknya 8 karakter
                  </h3>
                {:else}
                  <h3 class="font-semibold text-gray-900 dark:text-white">
                    Harus memenuhi setidaknya 2 kriteria
                  </h3>
                {/if}
                <div class="grid grid-cols-5 gap-1">
                  {#each passwordChecker.bar as bar}
                    {#if bar}
                      <div
                        class="h-1 bg-{passwordChecker.barColor}-300 dark:bg-{passwordChecker.barColor}-400"
                      />
                    {:else}
                      <div class="h-1 bg-gray-200 dark:bg-gray-600" />
                    {/if}
                  {/each}
                </div>
                <p>Kata sandi sebaiknya memiliki:</p>
                <ul>
                  <li class="flex items-center mb-1">
                    {#if passwordChecker.uppercaseLetter}
                      <Check />
                    {:else}
                      <Cross />
                    {/if}
                    Huruf besar
                  </li>
                  <li class="flex items-center mb-1">
                    {#if passwordChecker.lowercaseLetter}
                      <Check />
                    {:else}
                      <Cross />
                    {/if}
                    Huruf kecil
                  </li>
                  <li class="flex items-center mb-1">
                    {#if passwordChecker.number}
                      <Check />
                    {:else}
                      <Cross />
                    {/if}
                    Angka (123)
                  </li>
                  <li class="flex items-center mb-1">
                    {#if passwordChecker.symbol}
                      <Check />
                    {:else}
                      <Cross />
                    {/if}
                    Simbol (@!&)
                  </li>
                  <li class="flex items-center">
                    {#if passwordChecker.longer}
                      <Check />
                    {:else}
                      <Cross />
                    {/if}
                    Kata sandi lebih panjang (lebih dari 12 karakter)
                  </li>
                </ul>
              </div>
            </div>
          {/if}
        </div>
        <div class="relative z-0 w-full mb-6 group">
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 invalid:focus:border-red-600 dark:invalid:focus:border-red-500 peer"
            placeholder=" "
            required
            bind:value={confirmPassword.value}
            bind:this={confirmPassword.element}
            on:input={checkInput}
          />
          <label
            for="confirm-password"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >Konfirmasi kata sandi</label
          >
          <div class="absolute top-3.5 right-1.5 peer-focus:visible invisible">
            <PeekPassword bind:show={confirmPassword.show} />
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

        <button
          type="submit"
          disabled={!valid || loading}
          title={message.button}
          class="mt-2 disabled:bg-blue-300 dark:disabled:bg-blue-400 mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full md:w-20 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {#if !loading}Daftar{:else}<LoadingIcon
              class="w-5 h-5"
            />{/if}</button
        >

        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
          Sudah punya akun? <a
            href="/masuk"
            class="font-medium text-primary-600 hover:underline dark:text-primary-500"
            >Login di sini</a
          >
        </p>
      </form>
    </div>
  </div>
</section>
