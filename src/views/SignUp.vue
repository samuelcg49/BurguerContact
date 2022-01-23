<template>
  <div class="col-md-6 col-lg-4 offset-lg-4 offset-md-3 mt-4 pt-5">
    <h1 class="text-center">Registrarse</h1>

    <div class="bg-light p-5 border shadow rounded-3">
      <!-- <div class="alert alert-success" role="alert" v-if="!enviado">
        Revisa tu bandeja de entrada para verificar tu correo electrónico
      </div> -->
      <span class="text-danger mb-3" v-if="mensaje">{{ mensaje }}</span>
      <!-- Signup Form -->
      <div class="row mb-2" @click="loginGoogle">
        <div class="col-md-12">
          <button class="w-100 btn btn-lg btn-google btn-block btn-outline">
            <img src="https://img.icons8.com/color/32/000000/google-logo.png" />
            Continuar con Google
          </button>
        </div>
        <p class="mt-3 text-center text-secondary">O BIEN</p>
      </div>
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
        <button type="submit" class="btn btn-primary w-100 my-3 shadow">
          Inicia Sesión
        </button>

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
import { auth, firebase } from "../utils/firebase";
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
    loginGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();

      auth
        .signInWithPopup(provider)
        .then(() => {
          this.$router.replace("dashboard");
        })
        .catch((error) => {
          console.log(error.code), (this.mensaje = error.message);
        });
    },
  },
};
</script>

<style scoped>
form .btn {
  background: #f9b864;
  border: 1px solid #f9b864;
  font-weight: bold;
}
form .btn:hover {
  background: #f6f6f6;
  color: #f9b864;
  border: 1px solid #f9b864;
  transition: all 300ms ease-in-out;
  font-weight: bold;
}
.btn-google {
  color: #545454;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 1px #ddd;
}
</style>
