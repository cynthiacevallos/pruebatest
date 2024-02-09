<template>
  <div>
    <v-container>
      <v-form>
        <v-text-field label="Usuario" v-model="datos.usuario" type="text" variant="underlined"></v-text-field>
        <v-text-field label="Contraseña" v-model="datos.passw" type="password" variant="underlined"></v-text-field>
        <v-btn color="green" @click="login" variant="outlined" text>INGRESAR</v-btn>
        <v-alert class="my-4" type="warning" variant="tonal" v-if="msgShow" :text="msg"></v-alert>
      </v-form>
    </v-container>
  </div>
</template>
<style>
*{
  width: 100%;
  height: 80%;
}
</style>
<script>
export const USUARIO = process.env.VUE_APP_USERNAME;
export const PASSWORD = process.env.VUE_APP_PASSWORD;
export const RUTA_API = process.env.VUE_APP_API;
import router from "@/router";
import axios from "axios";
import VueJwtDecode from 'vue-jwt-decode'

export default {
  name: 'HomeView',
  data() {
    return {
      datos: {
        usuario: "",
        passw: "",
      },
      msg: "",
      msgShow: false,
      item: {
        codUsuario: "",
        name: "",
        centros: ""
      }
    }
  },
  methods: {
    login() {
      this.msgShow = false

      axios.post(RUTA_API + "/api/token/", {
        username: USUARIO,
        password: PASSWORD,
      }).then((response) => {
        this.auth = "Bearer " + response.data.access;
        axios.post(RUTA_API + "/login/", {
          Username: this.datos.usuario,
          Password: this.datos.passw
          // Username: "46184379",
          // Password: "Arias250290",
        }, {
          headers: { Authorization: this.auth },
        }).then((res) => {
          this.msg = ""
          if (res.data.status) {
            console.log(res.data.message)
            this.msgShow = true
            this.msg = res.data.message
          } else {
            let decoded = VueJwtDecode.decode(res.data.token)
            console.log(decoded)
            sessionStorage.setItem("usuario", decoded.codUsuario)
            sessionStorage.setItem("nombre", decoded.name)
            sessionStorage.setItem("centro", decoded.centros.split(",")[3].split(":")[1].replace("\"", "").replace("\"", ""))
            this.item.codUsuario = decoded.codUsuario
            this.item.name = decoded.name
            this.item.centros = decoded.centros.split(",")[3].split(":")[1].replace("\"", "").replace("\"", "")
            router.push("/main")
          }


        })
      })
    }
  },
  mounted() {

  },
}
</script>
