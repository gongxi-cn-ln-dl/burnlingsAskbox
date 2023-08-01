import { useRoute } from "vue-router";
import cookies from 'vue-cookies';

const route = useRoute();

const toUser = route.params.id;

const host = "https://api.burnling.asia";

const userId = cookies.get("userId") ? cookies.get("userId") : "-1";
const token = cookies.get('token')

export{
  toUser,
  host,
  userId,
  token
}