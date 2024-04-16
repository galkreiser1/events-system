import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import classes from "./SignIn.module.css";
import { useNavigation } from "../App";
import { useState } from "react";
import { AuthApi } from "../api/authApi";
import { APIStatus } from "../types";
import { Loader } from "../loader/Loader";

export function SignIn() {
  const navigator = useNavigation();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const LoginErrorMessages = {
    required: "Username and password are required",
    invalid: "Invalid username or password",
    failed: "Login failed, please try again",
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setErrorMessage("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage("");
  };

  const handleSignup = () => {
    navigator?.navigateTo("signup");
  };

  const handleLogin = async () => {
    if (password.length === 0 || username.length === 0) {
      setErrorMessage(LoginErrorMessages.required);
      console.log(LoginErrorMessages.required);
      return;
    }
    setErrorMessage("");

    setIsLoading(true);
    const res = await AuthApi.login({ username, password });
    setIsLoading(false);

    if (res === APIStatus.Success) {
      setErrorMessage("");

      navigator?.navigateTo("catalog");
      return;
    }
    if (res === APIStatus.BadRequest) {
      setErrorMessage(LoginErrorMessages.invalid);
      console.log(LoginErrorMessages.invalid);
      return;
    }
    if (res === APIStatus.Unauthorized) {
      setErrorMessage(LoginErrorMessages.invalid);
      console.log(LoginErrorMessages.invalid);
      return;
    }
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Welcome back!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor onClick={handleSignup} size="sm" component="button">
            Create account
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Username"
            placeholder="your username"
            required
            onChange={handleUsernameChange}
            error={errorMessage}
          />
          <PasswordInput
            label="Password"
            onChange={handlePasswordChange}
            placeholder="Your password"
            required
            mt="md"
            error={errorMessage}
          />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            {/* <Anchor component="button" size="sm">
            Forgot password?
          </Anchor> */}
          </Group>
          <Button fullWidth mt="xl" onClick={handleLogin}>
            Sign in
          </Button>
        </Paper>
      </Container>
    );
  }
}
