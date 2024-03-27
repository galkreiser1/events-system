import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from "@mantine/core";
import classes from "./SignUp.module.css";
import { useNavigation } from "../App";
import { useState } from "react";
import { AuthApi } from "../api/authApi";
import { APIStatus } from "../types";
import { Loader } from "../loader/Loader";

export function SignUp() {
  const navigator = useNavigation();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const SignUpErrorMessages = {
    required: "Username and password are required",
    mismatch: "Password and password confirm does not match",
    exists: "Username already exists",
    failed: "Sign Up failed, please try again",
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirm(e.target.value);
  };

  const handleSignUp = async () => {
    if (password.length === 0 || username.length === 0) {
      setErrorMessage(SignUpErrorMessages.required);
      console.log(SignUpErrorMessages.required);
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMessage(SignUpErrorMessages.mismatch);
      console.log(SignUpErrorMessages.mismatch);
      return;
    }
    setIsLoading(true);
    const res = await AuthApi.signUp({ username, password });
    setIsLoading(false);

    if (res === APIStatus.Success) {
      navigator?.navigateTo("/signin");

      return;
    }

    if (res === APIStatus.AlreadyExists) {
      setErrorMessage(SignUpErrorMessages.exists);
      console.log(SignUpErrorMessages.exists);
      return;
    }
    if (res === APIStatus.ServerError) {
      console.log(SignUpErrorMessages.failed);
      return;
    }
  };

  const handleSignin = () => {
    navigator?.navigateTo("signin");
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <Container size={420} my={40}>
        <Title ta="center" className={classes.title}>
          Welcome!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          Already have an account?{" "}
          <Anchor onClick={handleSignin} size="sm" component="button">
            Sign in
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Username"
            placeholder="your username"
            required
            onChange={handleUsernameChange}
            error={errorMessage === SignUpErrorMessages.required}
          />
          <PasswordInput
            onChange={handlePasswordChange}
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            error={errorMessage === SignUpErrorMessages.required}
          />
          <PasswordInput
            onChange={handlePasswordConfirmChange}
            label="Confirm Password"
            placeholder="Your password"
            required
            mt="md"
            error={errorMessage === SignUpErrorMessages.mismatch}
          />

          <Button fullWidth mt="xl" onClick={handleSignUp}>
            Sign up
          </Button>
        </Paper>
      </Container>
    );
  }
}
