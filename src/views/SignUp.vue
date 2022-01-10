<template>
  <div class="col-md-6 col-lg-4 offset-lg-4 offset-md-3 mt-4 pt-5">
    <h1 class="text-center">Registrarse</h1>

    <div class="bg-light p-5 border shadow rounded-3">
      <!-- <div class="alert alert-success" role="alert" v-if="!enviado">
        Revisa tu bandeja de entrada para verificar tu correo electrónico
      </div> -->
      <span class="text-danger mb-3" v-if="mensaje">{{ mensaje }}</span>
      <!-- Signup Form -->
      <form @submit.prevent="comparePasswords">
        <div class="mb-4">
          <input
            type="text"
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
            minlength="6"
          />
        </div>
        <div class="mb-4">
          <input
            type="password"
            class="form-control"
            placeholder="Repite la Contraseña"
            v-model="password2"
            minlength="6"
          />
        </div>
        <p class="form-text text-end text-danger" v-if="!verification">
          Las contraseñas no coinciden
        </p>
        <input
          value="Crear cuenta"
          type="submit"
          class="btn btn-primary w-100 my-3 shadow"
        />

        <p class="text-center m-0">
          Ya tengo cuenta,
          <router-link to="/login">Iniciar sesión</router-link>
        </p>
      </form>
      <!-- Login Form -->
    </div>
  </div>
</template>

<script>
import { auth } from "../utils/firebase";
export default {
  name: "SignUp",
  data() {
    return {
      email: "",
      password: "",
      password2: "",
      verification: true,
      mensaje: "",
    };
  },
  methods: {
    comparePasswords() {
      if (this.password != this.password2) {
        this.verification = !true;
      } else {
        this.signUp();
      }
    },
    async signUp() {
      await auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          auth.currentUser
            .sendEmailVerification()
            .then(() =>
              alert(
                "Revisa tu bandeja de entrada para verificar tu correo electrónico"
              )
            );

          this.email = "";
          this.password = "";
          this.password2 = "";
          this.verification = true;
          auth.signOut();
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
