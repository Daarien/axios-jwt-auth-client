import axios from "axios";
import ava, { TestInterface } from "ava";
import MockAdapter from "axios-mock-adapter";
import Api from "../src";

const test = ava as TestInterface<{
  api: Api;
}>;

test.beforeEach(t => {
  const client = axios.create();
  t.context.api = new Api({ client });
});

const loginRequest = {
  login: "admin",
  password: "55555"
};

test("fake login", async t => {
  const { api } = t.context;
  const mock = new MockAdapter(api.client);
  mock
    .onPost("http://localhost:3000/auth/login", loginRequest)
    .reply(200, { token: "TOKEN" });
  await api.login(loginRequest);

  t.is(mock.history.post.length, 1);
});

test("login", async t => {
  const { api } = t.context;
  await api.login(loginRequest);
  t.is(typeof api.token === "string", true, "token is ok!");

  await api.getUsers();
  t.is(api.users.length === 3, true, "");
});
