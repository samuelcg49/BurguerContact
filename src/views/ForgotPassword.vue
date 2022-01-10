<template>
  <div class="col-md-6 col-lg-4 offset-lg-4 offset-md-3 mt-4 pt-5">
    <h2 class="text-center">¿Has olvidado la contraseña?</h2>
    <div class="bg-light p-5 border shadow rounded-3">
      <div class="alert alert-success" role="alert" v-if="!enviado">
        Se ha enviado un email para restablecer tu contraseña
      </div>
      <span class="text-danger mb-3" v-if="mensaje">{{ mensaje }}</span>
      <!-- Login Form -->
      <form @submit.prevent="resetPassword">
        <div class="mb-4">
          <input
            type="email"
            class="form-control"
            placeholder="Correo electrónico"
            v-model="email"
          />
        </div>

        <button type="submit" class="btn btn-primary w-100 my-3 shadow">
          Restablecer contraseña
        </button>
      </form>
      <!-- Login Form -->
    </div>
  </div>
</template>

<script>
import { auth } from "../utils/firebase";
export default {
  name: "ForgotPassword",
  data() {
    return {
      email: "",
      mensaje: "",
      enviado: true,
    };
  },
  methods: {
    async resetPassword() {
      await auth
        .sendPasswordResetEmail(this.email)
        .then((res) => {
          this.enviado = res;
          this.email = "";
        })
        .catch((error) => {
          this.mensaje = error.message;
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