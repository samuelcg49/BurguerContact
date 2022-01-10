<template>
  <div class="col-md-6 col-lg-4 offset-lg-4 offset-md-3 mt-4 pt-5">
    <h1 class="text-center">Iniciar Sesión</h1>
    <div class="bg-light p-5 border shadow rounded-3">
      <!-- <div class="alert alert-danger" role="alert" v-if="!enviado">
        Revisa tu bandeja de entrada para verificar tu correo electrónico
      </div> -->
      <span class="text-danger mb-3" v-if="mensaje">{{ mensaje }}</span>
      <!-- Login Form -->
      <form @submit.prevent="login">
        <div class="mb-4">
          <input
            type="email"
            class="form-control"
            placeholder="Correo electrónico"
            v-model="email"
          />
        </div>
        <div class="mb-4">
          <input
            type="password"
            class="form-control"
            placeholder="Contraseña"
            v-model="password"
          />
        </div>
        <div class="mb-4 form-check w-100">
          <router-link to="/forgot-password" class="float-end"
            >He olvidado mi contraseña</router-link
          >
        </div>
        <button type="submit" class="btn btn-primary w-100 my-3 shadow">
          Inicia Sesión
        </button>
        <p class="text-center m-0">
          No tengo cuenta, <router-link to="/sign-up">Registrarse</router-link>
        </p>
      </form>
      <!-- Login Form -->
    </div>
  </div>
</template>

<script>
import { auth } from "../utils/firebase";
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      mensaje: "",
      enviado: true,
    };
  },
  methods: {
    async login() {
      await auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          if (!auth.currentUser.emailVerified) {
            auth.signOut();

            alert("Por favor, verifica tu dirección de correo electrónico");
          } else {
            this.$router.replace("dashboard");
          }
        })
        .catch((error) => {
          console.log(error.code), (this.mensaje = error.message);
        });
    },
  },
};
</script>

<style scoped>
.btn {
  background: #f9b864;
  border: 1px solid #f9b864;
  font-weight: bold;
}
.btn:hover {
  background: #f6f6f6;
  color: #f9b864;
  border: 1px solid #f9b864;
  transition: all 300ms ease-in-out;
  font-weight: bold;
}
</style>
