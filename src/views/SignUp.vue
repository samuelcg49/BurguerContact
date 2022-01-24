<template>
  <div class="col-md-6 col-lg-4 offset-lg-4 offset-md-3 mt-4 pt-5">
    <h1 class="text-center">Registrarse</h1>

    <div class="bg-light p-5 border shadow rounded-3">
      <!-- <div class="alert alert-success" role="alert" v-if="!enviado">
        Revisa tu bandeja de entrada para verificar tu correo electrónico
      </div> -->
      <span class="text-danger mb-3" v-if="mensaje">{{ mensaje }}</span>
      <!-- Social Media login -->
      <div>
        <div
          @click="loginSocialMedia(1)"
          class="w-100 btn btn-lg btn-social btn-block btn-outline"
        >
          <img
            src="https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.293/static/media/google-logo.e086107b.svg"
            class="ms-1"
          />
          <span class="ms-5 me-5"> Registrarse con Google </span>
        </div>

        <div
          @click="loginSocialMedia(2)"
          class="mt-2 w-100 btn btn-lg btn-social btn-block btn-outline"
        >
          <img
            src="https://aid-frontend.prod.atl-paas.net/atlassian-id/front-end/5.0.293/static/media/microsoft-logo.42b61fa1.svg"
            class=""
          />
          <span class="ms-5 me-4"> Registrarse con Microsoft </span>
        </div>

        <div
          @click="loginSocialMedia(3)"
          class="mt-2 w-100 btn btn-lg btn-social btn-block btn-outline"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
            class="me-5"
          />
          <span class="me-5 pe-1"> Registrarse con Github </span>
        </div>
      </div>
      <p class="mb-3 mt-4 text-center text-secondary">O BIEN</p>

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
    loginSocialMedia(id) {
      let provider = "";

      switch (id) {
        case 1:
          provider = new firebase.auth.GoogleAuthProvider();
          break;
        case 2:
          provider = new firebase.auth.OAuthProvider("microsoft.com");
          break;
        case 3:
          provider = new firebase.auth.GithubAuthProvider();
          break;
      }

      auth
        .signInWithRedirect(provider)
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
.btn-social {
  color: #545454;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 1px #ddd;
}

img,
svg {
  width: 20px;
  margin-bottom: 5px;
}

span {
  font-size: 17px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
