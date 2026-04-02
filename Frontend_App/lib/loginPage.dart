import 'utils.dart'; //custom utils. here, used to print debug messages as SnackBar

import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  bool isLoginMode = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: <Widget>[
          Spacer(), // TODO: replace this with proper positioning
          Text('Le Chic'), //TODO: make app title prettier; add logo

          //set view based on "toggle" below
          isLoginMode ? LoginView() : RegisterView(),

          //swap between login and register view
          SegmentedButton(
            showSelectedIcon: false,
            segments: const <ButtonSegment<bool>>[
              ButtonSegment<bool>(
                value: true,
                label: Text('Login'),
              ),
              ButtonSegment<bool>(
                value: false,
                label: Text('Register'),
              ),
            ], 
            selected: <bool>{isLoginMode},
            onSelectionChanged: (Set<bool> newSelection) {
              setState(() {
                isLoginMode = newSelection.first;
              });
            },
          ),

          Spacer(), //TODO: refer to spacer above for note
        ],
      ),
    );
  }
}

class LoginView extends StatelessWidget {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      children: <Widget>[
        Login(),
        Forgot(),
      ],
    );
  }
}

class Login extends StatelessWidget {
  const Login({super.key});

  void loginPressed(BuildContext context) {
    showSnackBar(context, 'Login pressed');
    Navigator.pushNamed(context, '/dashboard');
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        TextField(
          decoration: InputDecoration(
            labelText: 'Username',
          ),
        ),
        TextField(
          obscureText: true,
          decoration: InputDecoration(
            labelText: 'Password',
          ),
        ),
        FilledButton(
          onPressed: () => loginPressed(context),
          child: Text('Login'),
        ),
      ],
    );
  }
}

class Forgot extends StatelessWidget {
  const Forgot({super.key});

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () => showSnackBar(context, 'Forgot Password clicked'),
      child: Text('Forgot Password?'),
    );
  }
}

class RegisterView extends StatefulWidget{
  const RegisterView({super.key});

  @override
  State<RegisterView> createState() => _RegisterViewState();
}

class _RegisterViewState extends State<RegisterView> {

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          decoration: InputDecoration(
            labelText: 'First',
          ),
        ),
        TextField(
          decoration: InputDecoration(
            labelText: 'Last',
          ),
        ),
        TextField(
          decoration: InputDecoration(
            labelText: 'Email',
          ),
        ),
        TextField(
          obscureText: true,
          decoration: InputDecoration(labelText: 'Password'),
        ),
        FilledButton(
          onPressed: () => showSnackBar(context, 'Create account pressed'),
          child: Text('Create Account'),
        ),
      ],
    );
  }
}
